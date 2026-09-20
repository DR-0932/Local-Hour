"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * OrbitProjects
 *
 * Port of the Framer "Orbit Projects" code component (Stylokit).
 *
 * Scroll behaviour, in three overlapping phases driven by one 0→1 progress value:
 *   1. reveal   — cards rise into an arc, the two title lines slide in from off-screen
 *   2. orbit    — the arc rotates through `rotation` degrees; depth drives scale + opacity
 *   3. flatten  — cards interpolate out of the arc and into a plain grid
 *
 * On reduced-motion devices the 3D engine is skipped and a static grid
 * renders instead. The orbit effect remains available on smaller screens too.
 */

/* ------------------------------------------------------------------ config */

type OrbitItem = {
  image?: string;
  label?: string;
  link?: string | { url?: string; href?: string; path?: string };
};

const DEFAULT_ITEMS: OrbitItem[] = [
  { image: "/club/image01.jpeg", label: "Project 01" },
  { image: "/club/image03.jpeg", label: "Project 02" },
  { image: "/club/image11.jpeg", label: "Project 03" },
  { image: "/club/image08.jpeg", label: "Project 04" },
  { image: "/club/image05.jpeg", label: "Project 05" },
  { image: "/club/image06.jpeg", label: "Project 06" },
];

const DEFAULT_CONTENT = {
  showCopy: true,
  textColor: "#242424",
  leftTitle: "Local",
  rightTitle: "Hour",
  desktopTitleFont: { fontSize: 144, fontWeight: 400, lineHeight: 0.86, letterSpacing: "-0.075em" },
  compactTitleFont: { fontSize: 72, fontWeight: 400, lineHeight: 0.9, letterSpacing: "-0.065em" },
  titleCenterGap: 32,
  centerText: "Exploring ideas through daily design practice.",
  centerTextWidth: 220,
  compactTextGap: 28,
  centerFont: { fontSize: 12, fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.035em" },
} as const;

const DEFAULT_CARDS = {
  background: "#fff7ed",
  radius: 16,
  aspect: 1.3,
  imageFit: "cover",
  depthOpacity: 15,
  depthScale: 80,
  renderQuality: 0,
  labelColor: "rgba(0, 0, 0, 0.5)",
} as const;

const DEFAULT_MOTION = {
  scrollLength: 460,
  startOffset: 55,
  smoothness: 7,
  perspective: 1300,
  curveWidth: 570,
  curveHeight: 210,
  depth: 520,
  rotation: 310,
  cardWidth: 410,
  offsetY: -40,
} as const;

const DEFAULT_GRID = { columns: 3, gap: 16, maxWidth: 1160, positionY: 52 } as const;

const DEFAULT_RESPONSIVE = {
  desktopBreakpoint: 1024,
  mobileBreakpoint: 640,
  tabletColumns: 2,
  mobileColumns: 1,
  padding: "72px 24px",
  gap: 14,
  headerGap: 56,
} as const;

/* ------------------------------------------------------------------- utils */

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

function smootherstep(start: number, end: number, value: number) {
  if (start === end) return value < start ? 0 : 1;
  const t = clamp((value - start) / (end - start));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

const getHref = (link?: OrbitItem["link"]): string => {
  if (!link) return "";
  if (typeof link === "string") return link;
  return String(link.url || link.href || link.path || "");
};

/* ------------------------------------------------------------------- hooks */

function useMeasure(): [(node: HTMLElement | null) => void, { width: number; height: number }] {
  const [element, setElement] = React.useState<HTMLElement | null>(null);
  const [size, setSize] = React.useState({ width: 1440, height: 900 });
  const ref = React.useCallback((node: HTMLElement | null) => setElement(node), []);

  React.useLayoutEffect(() => {
    if (!element) return;

    const measure = () => {
      const bounds = element.getBoundingClientRect();
      const width = Math.max(Math.round(bounds.width), 1);
      const height = Math.max(Math.round(bounds.height), 1);
      setSize((prev) =>
        Math.abs(prev.width - width) < 1 && Math.abs(prev.height - height) < 1 ? prev : { width, height }
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [ref, size];
}

function useSmoothScrollProgress(
  rootRef: React.RefObject<HTMLElement | null>,
  { startOffset, smoothness, enabled }: { startOffset: number; smoothness: number; enabled: boolean }
) {
  const [progress, setProgress] = React.useState<number>(0);
  const target = React.useRef<number>(0);
  const current = React.useRef<number>(0);
  const frame = React.useRef<number | null>(null);
  const lastTime = React.useRef<number | null>(null);
  const [isNear, setIsNear] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") {
      setIsNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsNear(entry.isIntersecting),
      { rootMargin: "100% 0px 100% 0px", threshold: 0 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [rootRef, enabled]);

  React.useEffect(() => {
    if (!enabled || !isNear) return;

    const tick = (time: number) => {
      frame.current = null;
      const previous = lastTime.current ?? time;
      const delta = Math.min(Math.max((time - previous) / 1000, 0), 0.064);
      lastTime.current = time;

      const rate = Math.max(smoothness, 0.1);
      const next = current.current + (target.current - current.current) * (1 - Math.exp(-rate * delta));
      const remaining = Math.abs(target.current - next);
      const settled = remaining < 1e-4 ? target.current : next;

      current.current = settled;
      setProgress(settled);

      if (remaining >= 1e-4) frame.current = requestAnimationFrame(tick);
      else lastTime.current = null;
    };

    const update = () => {
      const root = rootRef.current;
      if (!root) return;
      const bounds = root.getBoundingClientRect();
      const entryLead = window.innerHeight * (clamp(startOffset, 0, 100) / 100);
      const distance = Math.max(bounds.height - window.innerHeight, 1);
      target.current = clamp((entryLead - bounds.top) / distance);
      if (frame.current === null) frame.current = requestAnimationFrame(tick);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
      lastTime.current = null;
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [rootRef, enabled, isNear, startOffset, smoothness]);

  return progress;
}

/* ------------------------------------------------------------------- cards */

function CardFace({
  item,
  index,
  radius,
  imageFit,
  background,
  labelColor,
  shadowStrength = 1,
  quality = 1,
}: {
  item: OrbitItem;
  index: number;
  radius: number;
  imageFit: React.CSSProperties["objectFit"];
  background: string;
  labelColor: string;
  shadowStrength?: number;
  quality?: number;
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden [backface-visibility:hidden]"
      style={{
        borderRadius: radius,
        background,
        boxShadow: `0 ${18 * shadowStrength * quality}px ${50 * shadowStrength * quality}px rgba(0,0,0,${0.12 * shadowStrength})`,
      }}
    >
      {item.image ? (
        <img
          src={item.image}
          alt={item.label || `Project ${index + 1}`}
          draggable={false}
          loading="eager"
          className="block h-full w-full select-none [backface-visibility:hidden]"
          style={{ objectFit: imageFit, background, pointerEvents: "none" }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center" style={{ color: labelColor }}>
          {item.label || `Project ${index + 1}`}
        </div>
      )}
    </div>
  );
}

function DesktopCard({
  item,
  index,
  x,
  y,
  z,
  width,
  height,
  rotateY,
  rotateZ,
  scale,
  opacity,
  zIndex,
  radius,
  imageFit,
  cardBackground,
  labelColor,
  renderQuality,
  flattened,
}: {
  item: OrbitItem;
  index: number;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
  opacity: number;
  zIndex: number;
  radius: number;
  imageFit: React.CSSProperties["objectFit"];
  cardBackground: string;
  labelColor: string;
  renderQuality: number;
  flattened: number;
}) {
  const href = getHref(item.link);
  const quality = item.image ? clamp(renderQuality, 1, 3) : 1;
  const w = width * quality;
  const h = height * quality;

  const face = (
    <CardFace
      item={item}
      index={index}
      radius={radius * quality}
      imageFit={imageFit}
      background={cardBackground}
      labelColor={labelColor}
      quality={quality}
      shadowStrength={lerp(1, 0.4, flattened)}
    />
  );

  return (
    <div
      className="absolute left-1/2 top-1/2 origin-center [backface-visibility:hidden] [transform-style:preserve-3d]"
      style={{
        width: w,
        height: h,
        opacity,
        zIndex,
        transform: `translate3d(${x - (w - width) / 2}px, ${y - (h - height) / 2}px, ${z}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale / quality})`,
      }}
    >
      {href ? (
        <a
          href={href}
          aria-label={item.label || `Open project ${index + 1}`}
          className="block h-full w-full text-inherit no-underline outline-none focus-visible:ring-2 focus-visible:ring-black/60"
        >
          {face}
        </a>
      ) : (
        face
      )}
    </div>
  );
}

/* --------------------------------------------------------- compact / grid */

function GridLayout({
  items,
  content,
  cards,
  columns,
  padding,
  gap,
  headerGap,
  background,
  animate,
}: {
  items: OrbitItem[];
  content: typeof DEFAULT_CONTENT;
  cards: typeof DEFAULT_CARDS;
  columns: number;
  padding: string;
  gap: number;
  headerGap: number;
  background: string;
  animate: boolean;
}) {
  const { showCopy, textColor, leftTitle, rightTitle, centerText, centerTextWidth, compactTextGap, compactTitleFont, centerFont } = content;

  return (
    <section className="relative w-full" style={{ padding, background }}>
      {showCopy && (
        <header className="relative w-full" style={{ marginBottom: headerGap }}>
          <h2 className="m-0 w-full text-left" style={{ ...compactTitleFont, color: textColor }}>
            <span className="block">{leftTitle}</span>
            <span className="block">{rightTitle}</span>
          </h2>
          {centerText && (
            <p
              className="text-left"
              style={{ ...centerFont, margin: `${compactTextGap}px 0 0`, maxWidth: centerTextWidth, color: textColor }}
            >
              {centerText}
            </p>
          )}
        </header>
      )}

      <div
        className="relative grid w-full"
        style={{ gridTemplateColumns: `repeat(${Math.max(Math.round(columns), 1)}, minmax(0, 1fr))`, gap }}
      >
        {items.map((item, index) => {
          const href = getHref(item.link);
          const face = (
            <div className="relative w-full" style={{ aspectRatio: `${Math.max(cards.aspect, 0.2)} / 1` }}>
              <CardFace
                item={item}
                index={index}
                radius={cards.radius}
                imageFit={cards.imageFit}
                background={cards.background}
                labelColor={cards.labelColor}
                shadowStrength={0.3}
              />
            </div>
          );

          const Cell: React.ElementType = animate ? motion.div : "div";
          const animationProps = animate
            ? {
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: "-10%" },
                transition: { duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] as const },
              }
            : {};

          return (
            <Cell key={`${item.label || "project"}-${index}`} {...animationProps}>
              {href ? (
                <a href={href} aria-label={item.label || `Open project ${index + 1}`} className="block w-full text-inherit no-underline">
                  {face}
                </a>
              ) : (
                face
              )}
            </Cell>
          );
        })}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- component */

type OrbitProjectsProps = {
  items?: OrbitItem[];
  background?: string;
  content?: Partial<typeof DEFAULT_CONTENT>;
  cards?: Partial<typeof DEFAULT_CARDS>;
  motion?: Partial<typeof DEFAULT_MOTION>;
  grid?: Partial<typeof DEFAULT_GRID>;
  responsive?: Partial<typeof DEFAULT_RESPONSIVE>;
  className?: string;
};

export default function OrbitProjects({
  items = DEFAULT_ITEMS,
  background = "#D4D4D4",
  content: contentProp = DEFAULT_CONTENT,
  cards: cardsProp = DEFAULT_CARDS,
  motion: motionProp = DEFAULT_MOTION,
  grid: gridProp = DEFAULT_GRID,
  responsive: responsiveProp = DEFAULT_RESPONSIVE,
  className = "",
}: OrbitProjectsProps = {}) {
  const content = { ...DEFAULT_CONTENT, ...contentProp };
  const cards = { ...DEFAULT_CARDS, ...cardsProp };
  const config = { ...DEFAULT_MOTION, ...motionProp };
  const grid = { ...DEFAULT_GRID, ...gridProp };
  const responsive = { ...DEFAULT_RESPONSIVE, ...responsiveProp };

  const rootRef = React.useRef<HTMLElement | null>(null);
  const [viewportRef, viewport] = useMeasure();
  const reduceMotion = useReducedMotion();

  const isMobile = viewport.width < responsive.mobileBreakpoint;
  const useFallback = reduceMotion;

  const progress = useSmoothScrollProgress(rootRef, {
    startOffset: config.startOffset,
    smoothness: config.smoothness,
    enabled: !useFallback,
  });

  const projectItems = items?.length ? items : DEFAULT_ITEMS;

  if (useFallback) {
    return (
      <div ref={viewportRef} className={`relative w-full ${className}`} style={{ background }}>
        <GridLayout
          items={projectItems}
          content={content}
          cards={cards}
          columns={isMobile ? responsive.mobileColumns : responsive.tabletColumns}
          padding={responsive.padding}
          gap={responsive.gap}
          headerGap={responsive.headerGap}
          background={background}
          animate={!reduceMotion}
        />
      </div>
    );
  }

  const { width: vw, height: vh } = viewport;
  const count = projectItems.length;

  const columns = Math.min(Math.max(Math.round(grid.columns), 1), Math.max(count, 1));
  const rows = Math.ceil(count / columns);
  const gridWidth = Math.min(grid.maxWidth, Math.max(vw - 96, 200));
  const cardW = Math.max(90, (gridWidth - grid.gap * (columns - 1)) / columns);
  const cardH = cardW / Math.max(cards.aspect, 0.2);
  const gridHeight = rows * cardH + Math.max(rows - 1, 0) * grid.gap;

  const arcCardW = Math.min(config.cardWidth, vw * 0.28);
  const arcCardH = arcCardW / Math.max(cards.aspect, 0.2);
  const curveW = Math.min(config.curveWidth, vw * 0.44);
  const curveH = Math.min(config.curveHeight, vh * 0.3);
  const depth = Math.min(config.depth, vw * 0.42);

  const titleEnter = smootherstep(0, 0.2, progress);
  const titleExit = smootherstep(0.74, 0.94, progress);
  const titleOpacity = titleEnter * (1 - titleExit);
  const titleShift = lerp(28, 0, titleEnter);

  const safeTextWidth = Math.min(Math.max(content.centerTextWidth, 0), vw * 0.5);
  const titleRest = (safeTextWidth + Math.max(content.titleCenterGap, 0)) / 2;
  const titleOffset = lerp(vw * 0.7, titleRest, titleEnter);

  const revealProgress = smootherstep(0, 0.17, progress);
  const orbitProgress = smootherstep(0.05, 0.7, progress);
  const centerCopyOpacity = smootherstep(0.12, 0.25, progress) * (1 - smootherstep(0.58, 0.82, progress));

  return (
    <section
      ref={rootRef}
      className={`relative w-full ${className}`}
      style={{ height: `${Math.max(config.scrollLength, 120)}vh`, background }}
    >
      <div
        ref={viewportRef}
        className="sticky top-0 isolate w-full overflow-hidden [transform-style:preserve-3d]"
        style={{
          height: "100svh",
          minHeight: 600,
          background,
          perspective: `${config.perspective}px`,
          perspectiveOrigin: "50% 50%",
        }}
      >
        {content.showCopy && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 z-0 w-max will-change-transform"
              style={{
                top: "56%",
                opacity: titleOpacity,
                transform: `translate3d(calc(-100% - ${titleOffset}px), calc(-50% + ${titleShift}px), 0)`,
              }}
            >
              <div className="m-0 whitespace-nowrap" style={{ ...content.desktopTitleFont, color: content.textColor }}>
                {content.leftTitle}
              </div>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 z-0 w-max will-change-transform"
              style={{
                top: "39%",
                opacity: titleOpacity,
                transform: `translate3d(${titleOffset}px, calc(-50% - ${titleShift}px), 0)`,
              }}
            >
              <div className="m-0 whitespace-nowrap" style={{ ...content.desktopTitleFont, color: content.textColor }}>
                {content.rightTitle}
              </div>
            </div>

            <div
              className="pointer-events-none absolute left-1/2 top-1/2 z-[2] box-border max-w-[80vw] p-4 text-center"
              style={{
                ...content.centerFont,
                width: safeTextWidth,
                opacity: centerCopyOpacity,
                transform: "translate3d(-50%, -50%, 0)",
                color: content.textColor,
              }}
            >
              {content.centerText}
            </div>
          </>
        )}

        <div className="absolute inset-0 z-10 [transform-style:preserve-3d]">
          {projectItems.map((item, index) => {
            const cardReveal = smootherstep(0.025 + index * 0.01, 0.18 + index * 0.012, progress);
            const flatten = smootherstep(0.56 + index * 0.009, Math.min(0.91 + index * 0.009, 0.99), progress);

            const angle = (index / Math.max(count, 1)) * 360 - 125 + orbitProgress * config.rotation;
            const radians = (angle * Math.PI) / 180;

            const arcX = Math.sin(radians) * curveW;
            const arcY = Math.cos(radians + 0.65) * curveH - vh * 0.025 + config.offsetY;
            const arcZ = Math.cos(radians) * depth;

            const normalizedDepth = clamp((arcZ + depth) / Math.max(depth * 2, 1));
            const arcScale = lerp(clamp(cards.depthScale, 50, 100) / 100, 1, normalizedDepth);
            const arcOpacity = lerp(clamp(cards.depthOpacity, 0, 100) / 100, 1, normalizedDepth);
            const arcRotateY = -Math.sin(radians) * 62;
            const arcRotateZ = -Math.sin(radians) * 8;

            const entrance = (1 - cardReveal) * vh * 0.48;
            const arcLeft = arcX - arcCardW / 2;
            const arcTop = arcY - arcCardH / 2 + entrance;

            const column = index % columns;
            const row = Math.floor(index / columns);
            const gridLeft = -gridWidth / 2 + column * (cardW + grid.gap);
            const gridTop =
              vh * (grid.positionY / 100) - vh / 2 - gridHeight / 2 + row * (cardH + grid.gap);

            return (
              <DesktopCard
                key={`${item.label || "project"}-${index}`}
                item={item}
                index={index}
                x={lerp(arcLeft, gridLeft, flatten)}
                y={lerp(arcTop, gridTop, flatten)}
                z={lerp(arcZ, 0, flatten)}
                width={lerp(arcCardW, cardW, flatten)}
                height={lerp(arcCardH, cardH, flatten)}
                rotateY={lerp(arcRotateY, 0, flatten)}
                rotateZ={lerp(arcRotateZ, 0, flatten)}
                scale={lerp(arcScale, 1, flatten)}
                opacity={clamp(lerp(arcOpacity * cardReveal * revealProgress, 1, flatten))}
                zIndex={flatten > 0.86 ? 100 + index : Math.round(100 + normalizedDepth * 800)}
                radius={cards.radius}
                imageFit={cards.imageFit}
                cardBackground={cards.background}
                labelColor={cards.labelColor}
                renderQuality={cards.renderQuality}
                flattened={flatten}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
