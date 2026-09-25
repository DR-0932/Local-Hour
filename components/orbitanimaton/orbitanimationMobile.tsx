
"use client";
 
import * as React from "react";
import { motion, useReducedMotion, useMotionValue, type MotionValue } from "framer-motion";
import CardFace from "./OrbitCardFace";
import { ORBIT_CARDS } from "./orbit-cards";
 
/**
 * OrbitProjects — optimized
 *
 * Port of the Framer "Orbit Projects" code component (Stylokit).
 *
 * PERFORMANCE MODEL (this is the part that changed):
 * The old version drove the whole arc via `useState` — every scroll tick called
 * `setProgress`, which re-rendered the parent AND every card, re-running all the
 * trig + reconciling N card subtrees, 60x/sec.
 *
 * This version keeps `progress` as a framer-motion `MotionValue` and NEVER
 * touches React state per frame. Each card subscribes to `progress.on("change")`
 * and writes its own `transform` / `width` / `height` / `opacity` / `zIndex`
 * straight onto its own DOM node via a ref. React only re-renders on real
 * structural changes (resize, item list change, reduced-motion toggle) — the
 * scroll-driven animation itself never touches the React tree.
 *
 * Scroll behaviour is unchanged, in three overlapping phases driven by one
 * 0→1 progress value:
 *   1. reveal   — cards rise into an arc, the two title lines slide in from off-screen
 *   2. orbit    — the arc rotates through `rotation` degrees; depth drives scale + opacity
 *   3. flatten  — cards interpolate out of the arc and into a plain grid
 *
 * On reduced-motion devices the 3D engine is skipped and a static grid renders instead.
 */
 
/* ------------------------------------------------------------- shared types */
 
type OrbitLink = string | { url?: string; href?: string; path?: string };
 
type OrbitCardItem = {
  label?: string;
  image?: string;
  link?: OrbitLink;
};
 
type OrbitContentConfig = {
  showCopy: boolean;
  textColor: string;
  leftTitle: string;
  rightTitle: string;
  desktopTitleFont: React.CSSProperties;
  compactTitleFont: React.CSSProperties;
  titleCenterGap: number;
  centerText: string;
  centerTextWidth: number;
  compactTextGap: number;
  centerFont: React.CSSProperties;
};
 
type OrbitCardsConfig = {
  background: string;
  radius: number;
  aspect: number;
  imageFit: "cover" | "contain";
  depthOpacity: number;
  depthScale: number;
  renderQuality: number;
  labelColor: string;
};
 
type OrbitMotionConfig = {
  scrollLength: number;
  startOffset: number;
  smoothness: number;
  perspective: number;
  curveWidth: number;
  curveHeight: number;
  depth: number;
  rotation: number;
  cardWidth: number;
  offsetY: number;
};
 
type OrbitGridConfig = {
  columns: number;
  gap: number;
  maxWidth: number;
  positionY: number;
};
 
type OrbitResponsiveConfig = {
  desktopBreakpoint: number;
  mobileBreakpoint: number;
  tabletColumns: number;
  mobileColumns: number;
  padding: string;
  gap: number;
  headerGap: number;
};
 
type OrbitProjectsProps = {
  items?: OrbitCardItem[];
  background?: string;
  content?: Partial<OrbitContentConfig>;
  cards?: Partial<OrbitCardsConfig>;
  motion?: Partial<OrbitMotionConfig>;
  grid?: Partial<OrbitGridConfig>;
  responsive?: Partial<OrbitResponsiveConfig>;
  className?: string;
};
 
type GridLayoutProps = {
  items: OrbitCardItem[];
  config: OrbitMotionConfig;
  content: OrbitContentConfig;
  cards: OrbitCardsConfig;
  columns: number;
  padding: string;
  gap: number;
  headerGap: number;
  background: string;
  animate: boolean;
};
 
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;
 
/* ------------------------------------------------------------------ config */
 
const DEFAULT_ITEMS: OrbitCardItem[] = ORBIT_CARDS;
 
const DEFAULT_CONTENT: OrbitContentConfig = {
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
 
const DEFAULT_CARDS: OrbitCardsConfig = {
  background: "#fff7ed",
  radius: 16,
  aspect: 1.3,
  imageFit: "cover",
  depthOpacity: 15,
  depthScale: 80,
  renderQuality: 0,
  labelColor: "rgba(0, 0, 0, 0.5)",
};
 
const DEFAULT_MOTION: OrbitMotionConfig = {
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
};
 
const DEFAULT_GRID: OrbitGridConfig = { columns: 2, gap: 16, maxWidth: 1160, positionY: 52 };
 
const DEFAULT_RESPONSIVE: OrbitResponsiveConfig = {
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
 
const getHref = (link?: OrbitLink) => {
  if (!link) return "";
  if (typeof link === "string") return link;
  return String(link.url || link.href || link.path || "");
};
 
/* ------------------------------------------------------------------- hooks */
 
/** Tracks an element's box with a ResizeObserver. */
function useMeasure(): [(node: HTMLElement | null) => void, { width: number; height: number }] {
  const [element, setElement] = React.useState<HTMLElement | null>(null);
  const [size, setSize] = React.useState<{ width: number; height: number }>({ width: 1440, height: 900 });
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
 
/**
 * Scroll progress with frame-rate independent exponential smoothing.
 *
 * KEY CHANGE: this no longer calls setState. It writes into a MotionValue,
 * so updating it never triggers a React render — components that care read
 * it via `.on("change", ...)` and mutate their own DOM node directly.
 */
function useSmoothScrollProgress(
  rootRef: React.RefObject<HTMLElement | null>,
  { startOffset, smoothness, enabled }: { startOffset: number; smoothness: number; enabled: boolean }
): MotionValue<number> {
  const progress = useMotionValue(0);
  const target = React.useRef(0);
  const current = React.useRef(0);
  const frame = React.useRef<number | null>(null);
  const lastTime = React.useRef<number | null>(null);
  const [isNear, setIsNear] = React.useState(false);
 
  React.useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") {
      setIsNear(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setIsNear(entry.isIntersecting), {
      rootMargin: "100% 0px 100% 0px",
      threshold: 0,
    });
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
      progress.set(settled); // <-- no re-render, just notifies subscribers
 
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
  }, [rootRef, enabled, isNear, startOffset, smoothness, progress]);
 
  return progress;
}
 
/**
 * Subscribes an element to a MotionValue and applies a computed style object
 * directly to the DOM every frame — no React state, no re-render, no VDOM diff.
 * `compute` must be referentially stable across frames (memoize it), it's only
 * re-subscribed when it changes (e.g. on resize).
 */
function useMotionStyle<E extends HTMLElement>(
  progress: MotionValue<number>,
  compute: (p: number) => Record<string, string>
) {
  const ref = React.useRef<E>(null);
 
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = (p: number) => {
      const styles = compute(p);
      for (const key in styles) {
        // @ts-expect-error: dynamic CSSStyleDeclaration assignment
        el.style[key] = styles[key];
      }
    };
    apply(progress.get());
    return progress.on("change", apply);
  }, [progress, compute]);
 
  return ref;
}
 
/* ------------------------------------------------------------------- geometry */
 
type CardGeom = {
  arcCardW: number;
  arcCardH: number;
  curveW: number;
  curveH: number;
  depth: number;
  offsetY: number;
  rotation: number;
  vh: number;
  gridLeft: number;
  gridTop: number;
  cardW: number;
  cardH: number;
  depthScale: number; // 0-1
  depthOpacity: number; // 0-1
  quality: number;
};
 
/** Pure function: progress + static per-card geometry -> a DOM frame. Same math as the original, just factored out so it can run outside React. */
function computeCardFrame(p: number, index: number, count: number, geom: CardGeom) {
  const {
    arcCardW, arcCardH, curveW, curveH, depth, offsetY, rotation, vh,
    gridLeft, gridTop, cardW, cardH, depthScale, depthOpacity, quality,
  } = geom;
 
  const orbitProgress = smootherstep(0.05, 0.7, p);
  const revealProgress = smootherstep(0, 0.17, p);
  const cardReveal = smootherstep(0.025 + index * 0.01, 0.18 + index * 0.012, p);
  const flatten = smootherstep(0.56 + index * 0.009, Math.min(0.91 + index * 0.009, 0.99), p);
 
  const angle = (index / Math.max(count, 1)) * 360 - 125 + orbitProgress * rotation;
  const radians = (angle * Math.PI) / 180;
 
  const arcX = Math.sin(radians) * curveW;
  const arcY = Math.cos(radians + 0.65) * curveH - vh * 0.025 + offsetY;
  const arcZ = Math.cos(radians) * depth;
 
  const normalizedDepth = clamp((arcZ + depth) / Math.max(depth * 2, 1));
  const arcScale = lerp(depthScale, 1, normalizedDepth);
  const arcOpacity = lerp(depthOpacity, 1, normalizedDepth);
  const arcRotateY = -Math.sin(radians) * 62;
  const arcRotateZ = -Math.sin(radians) * 8;
 
  const entrance = (1 - cardReveal) * vh * 0.48;
  const arcLeft = arcX - arcCardW / 2;
  const arcTop = arcY - arcCardH / 2 + entrance;
 
  const x = lerp(arcLeft, gridLeft, flatten);
  const y = lerp(arcTop, gridTop, flatten);
  const z = lerp(arcZ, 0, flatten);
  const width = lerp(arcCardW, cardW, flatten);
  const height = lerp(arcCardH, cardH, flatten);
  const rotateY = lerp(arcRotateY, 0, flatten);
  const rotateZ = lerp(arcRotateZ, 0, flatten);
  const scale = lerp(arcScale, 1, flatten);
  const opacity = clamp(lerp(arcOpacity * cardReveal * revealProgress, 1, flatten));
  const zIndex = flatten > 0.86 ? 100 + index : Math.round(100 + normalizedDepth * 800);
 
  // Supersample so the front card's texture doesn't go soft under perspective scale.
  const w = width * quality;
  const h = height * quality;
 
  return {
    tx: x - (w - width) / 2,
    ty: y - (h - height) / 2,
    z,
    w,
    h,
    rotateY,
    rotateZ,
    scale: scale / quality,
    opacity,
    zIndex,
  };
}
 
/* ------------------------------------------------------------------- cards */
 
type OrbitCardProps = {
  item: OrbitCardItem;
  index: number;
  count: number;
  progress: MotionValue<number>;
  geom: CardGeom;
  radius: number;
  imageFit: "cover" | "contain";
  cardBackground: string;
  labelColor: string;
};
 
/** One orbiting card. Subscribes to `progress` directly — never re-renders during scroll. */
function OrbitCard({ item, index, count, progress, geom, radius, imageFit, cardBackground, labelColor }: OrbitCardProps) {
  const href = getHref(item.link);
 
  const compute = React.useCallback(
    (p: number) => {
      const f = computeCardFrame(p, index, count, geom);
      return {
        width: `${f.w}px`,
        height: `${f.h}px`,
        opacity: `${f.opacity}`,
        zIndex: `${f.zIndex}`,
        transform: `translate3d(${f.tx}px, ${f.ty}px, ${f.z}px) rotateY(${f.rotateY}deg) rotateZ(${f.rotateZ}deg) scale(${f.scale})`,
      };
    },
    [index, count, geom]
  );
 
  const ref = useMotionStyle<HTMLDivElement>(progress, compute);
 
  const face = (
    <CardFace
      item={item}
      index={index}
      radius={radius * geom.quality}
      imageFit={imageFit}
      background={cardBackground}
      labelColor={labelColor}
      quality={geom.quality}
      shadowStrength={0.6} // was live-interpolated from `flattened`; now fixed to avoid a per-frame prop into a non-motion child. Bump this if cards need heavier shadow while flat.
    />
  );
 
  return (
    <div
      ref={ref}
      className="absolute left-1/2 top-1/2 origin-center [backface-visibility:hidden] [transform-style:preserve-3d] will-change-transform"
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
  items, config, content, cards, columns, padding, gap, headerGap, background, animate,
}: GridLayoutProps) {
  void config;
  const {
    showCopy, textColor, leftTitle, rightTitle, centerText,
    centerTextWidth, compactTextGap, compactTitleFont, centerFont,
  } = content;
 
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
 
          const animationProps = animate
            ? {
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: "-10%" },
                transition: { duration: 0.5, delay: index * 0.06, ease: EASE_OUT_EXPO },
              }
            : {};
 
          const key = `${item.label || "project"}-${index}`;
 
          return animate ? (
            <motion.div key={key} {...animationProps}>
              {href ? (
                <a href={href} aria-label={item.label || `Open project ${index + 1}`} className="block w-full text-inherit no-underline">
                  {face}
                </a>
              ) : (
                face
              )}
            </motion.div>
          ) : (
            <div key={key}>
              {href ? (
                <a href={href} aria-label={item.label || `Open project ${index + 1}`} className="block w-full text-inherit no-underline">
                  {face}
                </a>
              ) : (
                face
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
 
/* --------------------------------------------------------------- component */
 
export default function OrbitProjectsMobile({
  items = DEFAULT_ITEMS,
  background = "#D4D4D4",
  content: contentProp,
  cards: cardsProp,
  motion: motionProp,
  grid: gridProp,
  responsive: responsiveProp,
  className = "",
}: OrbitProjectsProps) {
  const content: OrbitContentConfig = { ...DEFAULT_CONTENT, ...contentProp };
  const cards: OrbitCardsConfig = { ...DEFAULT_CARDS, ...cardsProp };
  const config: OrbitMotionConfig = { ...DEFAULT_MOTION, ...motionProp };
  const grid: OrbitGridConfig = { ...DEFAULT_GRID, ...gridProp };
  const responsive: OrbitResponsiveConfig = { ...DEFAULT_RESPONSIVE, ...responsiveProp };
 
  const rootRef = React.useRef<HTMLElement | null>(null);
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
  const count = projectItems.length;
  const { width: vw, height: vh } = viewport;
 
  // Everything below only depends on viewport/config/cards/grid — none of it
  // depends on scroll progress, so it's fine (and cheap) to recompute on real
  // re-renders only, instead of every frame like the original did.
  const perCardGeom = React.useMemo<CardGeom[]>(() => {
    const columns = Math.min(Math.max(Math.round(grid.columns), 1), Math.max(count, 1));
    const rows = Math.ceil(count / columns);
    const gridWidth = Math.min(grid.maxWidth, Math.max(vw - 96, 450));
    const cardW = Math.max(90, (gridWidth - grid.gap * (columns - 1)) / columns);
    const cardH = cardW / Math.max(cards.aspect, 0.2);
    const gridHeight = rows * cardH + Math.max(rows - 1, 0) * grid.gap;
 
    const arcCardW = Math.min(config.cardWidth, vw * 0.38);
    const arcCardH = arcCardW / Math.max(cards.aspect, 0.2);
    const curveW = Math.min(config.curveWidth, vw * 0.44);
    const curveH = Math.min(config.curveHeight, vh * 0.3);
    const depth = Math.min(config.depth, vw * 0.42);
 
    const quality = clamp(cards.renderQuality, 1, 3);
 
    return projectItems.map((item, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const gridLeft = -gridWidth / 2 + column * (cardW + grid.gap);
      const gridTop = vh * (grid.positionY / 100) - vh / 2 - gridHeight / 2 + row * (cardH + grid.gap);
 
      return {
        arcCardW,
        arcCardH,
        curveW,
        curveH,
        depth,
        offsetY: config.offsetY,
        rotation: config.rotation,
        vh,
        gridLeft,
        gridTop,
        cardW,
        cardH,
        depthScale: clamp(cards.depthScale, 50, 100) / 100,
        depthOpacity: clamp(cards.depthOpacity, 0, 100) / 100,
        quality: item.image ? quality : 1,
      };
    });
  }, [
    projectItems, count, vw, vh,
    grid.columns, grid.maxWidth, grid.gap, grid.positionY,
    cards.aspect, cards.renderQuality, cards.depthScale, cards.depthOpacity,
    config.cardWidth, config.curveWidth, config.curveHeight, config.depth, config.offsetY, config.rotation,
  ]);
 
  // Title / center-copy geometry — also viewport-only, memoized once.
  const headerGeom = React.useMemo(() => {
    const safeTextWidth = Math.min(Math.max(content.centerTextWidth, 0), vw * 0.5);
    const titleRest = (safeTextWidth + Math.max(content.titleCenterGap, 0)) / 2;
    return { safeTextWidth, titleRest };
  }, [content.centerTextWidth, content.titleCenterGap, vw]);
 
  const leftTitleCompute = React.useCallback(
    (p: number) => {
      const titleEnter = smootherstep(0, 0.2, p);
      const titleExit = smootherstep(0.74, 0.94, p);
      const titleOpacity = titleEnter * (1 - titleExit);
      const titleShift = lerp(28, 0, titleEnter);
      const titleOffset = lerp(vw * 0.7, headerGeom.titleRest, titleEnter);
      return {
        opacity: `${titleOpacity}`,
        transform: `translate3d(calc(-100% - ${titleOffset}px), calc(-50% + ${titleShift}px), 0)`,
      };
    },
    [vw, headerGeom.titleRest]
  );
 
  const rightTitleCompute = React.useCallback(
    (p: number) => {
      const titleEnter = smootherstep(0, 0.2, p);
      const titleExit = smootherstep(0.74, 0.94, p);
      const titleOpacity = titleEnter * (1 - titleExit);
      const titleShift = lerp(28, 0, titleEnter);
      const titleOffset = lerp(vw * 0.7, headerGeom.titleRest, titleEnter);
      return {
        opacity: `${titleOpacity}`,
        transform: `translate3d(${titleOffset}px, calc(-50% - ${titleShift}px), 0)`,
      };
    },
    [vw, headerGeom.titleRest]
  );
 
  const centerCopyCompute = React.useCallback((p: number) => {
    const centerCopyOpacity = smootherstep(0.12, 0.25, p) * (1 - smootherstep(0.58, 0.82, p));
    return { opacity: `${centerCopyOpacity}` };
  }, []);
 
  const leftTitleRef = useMotionStyle<HTMLDivElement>(progress, leftTitleCompute);
  const rightTitleRef = useMotionStyle<HTMLDivElement>(progress, rightTitleCompute);
  const centerCopyRef = useMotionStyle<HTMLDivElement>(progress, centerCopyCompute);
 
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
 
  void isCompact; // kept for parity with original prop surface / future responsive tweaks
 
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
              ref={leftTitleRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 z-0 w-max will-change-transform"
              style={{ top: "56%" }}
            >
              <div className="m-0 whitespace-nowrap" style={{ ...content.desktopTitleFont, color: content.textColor }}>
                {content.leftTitle}
              </div>
            </div>
 
            <div
              ref={rightTitleRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 z-0 w-max will-change-transform"
              style={{ top: "39%" }}
            >
              <div className="m-0 whitespace-nowrap" style={{ ...content.desktopTitleFont, color: content.textColor }}>
                {content.rightTitle}
              </div>
            </div>
 
            <div
              ref={centerCopyRef}
              className="pointer-events-none absolute left-1/2 top-1/2 z-[2] box-border max-w-[80vw] p-4 text-center"
              style={{
                ...content.centerFont,
                width: headerGeom.safeTextWidth,
                transform: "translate3d(-50%, -50%, 0)",
                color: content.textColor,
              }}
            >
              {content.centerText}
            </div>
          </>
        )}
 
        <div className="absolute inset-0 z-10 [transform-style:preserve-3d]">
          {projectItems.map((item, index) => (
            <OrbitCard
              key={`${item.label || "project"}-${index}`}
              item={item}
              index={index}
              count={count}
              progress={progress}
              geom={perCardGeom[index]}
              radius={cards.radius}
              imageFit={cards.imageFit}
              cardBackground={cards.background}
              labelColor={cards.labelColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
 
