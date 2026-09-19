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

const DEFAULT_ITEMS = [
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
};

const DEFAULT_CARDS = {
  background: "#fff7ed",
  radius: 16,
  aspect: 1.3,
  imageFit: "cover",
  depthOpacity: 15, // % opacity of the card furthest from camera
  depthScale: 80, // % scale of the card furthest from camera
  renderQuality: 0, // supersampling factor, see DesktopCard
  labelColor: "rgba(0, 0, 0, 0.5)",
};

const DEFAULT_MOTION = {
  scrollLength: 460, // vh of scroll the section occupies
  startOffset: 55, // % down the viewport where progress starts counting
  smoothness: 7, // exponential damping rate
  perspective: 1300,
  curveWidth: 570,
  curveHeight: 210,
  depth: 520,
  rotation: 310, // degrees travelled across the orbit phase
  cardWidth: 410,
  offsetY: -40,
};

const DEFAULT_GRID = { columns: 3, gap: 16, maxWidth: 1160, positionY: 52 };

const DEFAULT_RESPONSIVE = {
  desktopBreakpoint: 1024,
  mobileBreakpoint: 640,
  tabletColumns: 2,
  mobileColumns: 1,
  padding: "72px 24px",
  gap: 14,
  headerGap: 56,
};

/* ------------------------------------------------------------------- utils */

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/** Ken Perlin's smootherstep — C2 continuous, so phases blend without a kink. */
function smootherstep(start: number, end: number, value: number) {
  if (start === end) return value < start ? 0 : 1;
  const t = clamp((value - start) / (end - start));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

const getHref = (link: any): string => {
  if (!link) return "";
  if (typeof link === "string") return link;
  return String(link.url || link.href || link.path || "");
};

/* ------------------------------------------------------------------- hooks */

/** Tracks an element's box with a ResizeObserver. */
function useMeasure(): [(node: any) => void, { width: number; height: number }] {
  const [element, setElement] = React.useState<any>(null);
  const [size, setSize] = React.useState({ width: 1440, height: 900 });
  const ref = React.useCallback((node: any) => setElement(node), []);

  React.useLayoutEffect(() => {
    if (!element) return;
    const measure = () => {
      const bounds = element.getBoundingClientRect();
      const width = Math.max(Math.round(bounds.width), 1);
      const height = Math.max(Math.round(bounds.height), 1);
      setSize((prev: { width: number; height: number }) =>
        Math.abs(prev.width - width) < 1 && Math.abs(prev.height - height) < 1
          ? prev
          : { width, height }
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [ref, size];
}

/**
 * Scroll progress with frame-rate independent exponential smoothing.
 *
 * Deliberately not useScroll + useSpring: the original eases toward the target
 * without overshoot, and a spring would add a bounce the arc wasn't tuned for.
 */
function useSmoothScrollProgress(
  rootRef: React.RefObject<HTMLElement | null>,
  { startOffset, smoothness, enabled }: { startOffset: number; smoothness: number; enabled: boolean }
) {
  const [progress, setProgress] = React.useState(0);
  const target = React.useRef(0);
  const current = React.useRef(0);
  const frame = React.useRef<number | null>(null);
  const lastTime = React.useRef<number | null>(null);
  const [isNear, setIsNear] = React.useState(false);

  // Only run the loop while the section is within one viewport of the screen.
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

function CardFace({ item, index, radius, imageFit, background, labelColor, shadowStrength = 1, quality = 1 }: any) {
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
        <div
          className="absolute inset-0 flex items-center justify-center p-6 text-center"
          style={{ color: labelColor }}
        >
          {item.label || `Project ${index + 1}`}
        </div>
      )}
    </div>
  );
}

function DesktopCard({
  item, index, x, y, z, width, height, rotateY, rotateZ, scale, opacity, zIndex,
  radius, imageFit, cardBackground, labelColor, renderQuality, flattened,
}: any) {
  const href = getHref(item.link);

  /**
   * Positive translateZ under perspective blows the front card up well past its
   * CSS width, and the browser upscales the rasterised texture — the front image
   * goes soft. Render at N× size and divide the scale back out, so the visible
   * geometry is identical but the texture has the pixels to spare.
   */
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

function GridLayout({ items, config, content, cards, columns, padding, gap, headerGap, background, animate }: any) {
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
        {items.map((item: any, index: number) => {
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

          const Cell: any = animate ? motion.div : "div";
          const animationProps: any = animate
            ? {
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: "-10%" },
                transition: { duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] },
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

export default function OrbitProjects({
  items = DEFAULT_ITEMS,
  background = "#D4D4D4",
  content: contentProp,
  cards: cardsProp,
  motion: motionProp,
  grid: gridProp,
  responsive: responsiveProp,
  className = "",
}: any = {}) {
  const content = { ...DEFAULT_CONTENT, ...contentProp };
  const cards = { ...DEFAULT_CARDS, ...cardsProp };
  const config = { ...DEFAULT_MOTION, ...motionProp };
  const grid = { ...DEFAULT_GRID, ...gridProp };
  const responsive = { ...DEFAULT_RESPONSIVE, ...responsiveProp };

  const rootRef = React.useRef(null);
  const [viewportRef, viewport] = useMeasure();
  const reduceMotion = useReducedMotion();

  const isCompact = viewport.width < responsive.desktopBreakpoint;
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
          config={config}
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

  /* -------- geometry, all derived from the single progress value ---------- */

  const { width: vw, height: vh } = viewport;
  const count = projectItems.length;

  // Destination grid
  const columns = Math.min(Math.max(Math.round(grid.columns), 1), Math.max(count, 1));
  const rows = Math.ceil(count / columns);
  const gridWidth = Math.min(grid.maxWidth, Math.max(vw - 96, 200));
  const cardW = Math.max(90, (gridWidth - grid.gap * (columns - 1)) / columns);
  const cardH = cardW / Math.max(cards.aspect, 0.2);
  const gridHeight = rows * cardH + Math.max(rows - 1, 0) * grid.gap;

  // Arc dimensions, capped against the viewport so it never overflows
  const arcCardW = Math.min(config.cardWidth, vw * 0.28);
  const arcCardH = arcCardW / Math.max(cards.aspect, 0.2);
  const curveW = Math.min(config.curveWidth, vw * 0.44);
  const curveH = Math.min(config.curveHeight, vh * 0.3);
  const depth = Math.min(config.depth, vw * 0.42);

  // Copy timing
  const titleEnter = smootherstep(0, 0.2, progress);
  const titleExit = smootherstep(0.74, 0.94, progress);
  const titleOpacity = titleEnter * (1 - titleExit);
  const titleShift = lerp(28, 0, titleEnter);

  // Titles fly in from outside the viewport and settle either side of the
  // center paragraph, clearing it by half the gap so they never overlap it.
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
          {projectItems.map((item: any, index: number) => {
            // Cards reveal and flatten on staggered windows, so the arc
            // assembles and dissolves card by card rather than all at once.
            const cardReveal = smootherstep(0.025 + index * 0.01, 0.18 + index * 0.012, progress);
            const flatten = smootherstep(
              0.56 + index * 0.009,
              Math.min(0.91 + index * 0.009, 0.99),
              progress
            );

            const angle = (index / Math.max(count, 1)) * 360 - 125 + orbitProgress * config.rotation;
            const radians = (angle * Math.PI) / 180;

            const arcX = Math.sin(radians) * curveW;
            const arcY = Math.cos(radians + 0.65) * curveH - vh * 0.025 + config.offsetY;
            const arcZ = Math.cos(radians) * depth;

            // 0 = furthest from camera, 1 = nearest
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