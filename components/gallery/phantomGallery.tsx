"use client";

/**
 * PhantomInfiniteGallery — GSAP edition
 *
 * Same draggable, infinitely-tiling image grid with arc curvature, inertial
 * throwing, press-to-zoom, and mouse parallax as the Framer Motion version —
 * rewritten so the animation loop never touches React state.
 *
 * WHY GSAP OVER FRAMER MOTION HERE
 * The old version drove offset/inertia/zoom/parallax through `useState` and
 * recomputed + re-rendered ~400 tiles every animation frame. That's a React
 * reconciliation pass at 60fps over a few hundred nodes — the actual
 * bottleneck, not the math. This version:
 *   - keeps position/rotation/scale OUT of React state entirely. GSAP's
 *     ticker drives a loop that writes directly to each tile's transform via
 *     `gsap.quickSetter`, which is a precompiled, allocation-free setter —
 *     no vdom diff, no reconciliation, GPU-composited transforms only.
 *   - never animates `width`/`height` (forces layout/reflow). "Zoom" is
 *     folded into the same `scale()` used for edge fade, applied with
 *     `transform-origin: 0 0` so it composites on the GPU instead of
 *     triggering layout. Trade-off: padding/text visually scale with the
 *     tile instead of staying pixel-fixed — reads basically the same and is
 *     far cheaper.
 *   - only touches React state when the *set of visible tiles* changes
 *     (crossing a cell boundary), not every frame. That's a rare, cheap
 *     re-render instead of a 60fps one.
 *   - drives hover via CSS (`:hover` + a CSS variable) instead of a
 *     per-tile JS animation.
 *
 * Install: `npm install gsap`
 */

import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from "react";
import { gsap } from "gsap";

type Point = { x: number; y: number };
type Viewport = { w: number; h: number };
type GalleryItem = {
  title: string;
  image: { src: string; alt?: string };
  year: number;
};
type BorderConfig = {
  width: number;
  style: string;
  color: string;
  showTop: boolean;
  showBottom: boolean;
  showLeft: boolean;
  showRight: boolean;
};

// ---------------------------------------------------------------------------
// Pure helpers (unchanged math from the Framer version)
// ---------------------------------------------------------------------------

/** Keep the same world point under the pointer when the cell size changes. */
function computePinnedOffset(
  prevSize: number,
  nextSize: number,
  pivot: Point,
  prevOffset: Point
): Point {
  const worldX = (pivot.x - prevOffset.x) / prevSize;
  const worldY = (pivot.y - prevOffset.y) / prevSize;
  return {
    x: pivot.x - worldX * nextSize,
    y: pivot.y - worldY * nextSize,
  };
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Pseudo-3D "arc wall" transform for a tile at a given center. */
function calcArcTransform({
  cellCenterX,
  cellCenterY,
  viewportW,
  viewportH,
  arcAxis,
  arcMaxAngleDeg,
  arcAmount,
}: {
  cellCenterX: number;
  cellCenterY: number;
  viewportW: number;
  viewportH: number;
  arcAxis: "horizontal" | "vertical";
  arcMaxAngleDeg: number;
  arcAmount: number;
}) {
  const maxAngle = toRadians(arcMaxAngleDeg) * Math.max(0, Math.min(1, arcAmount));
  if (maxAngle === 0) return { z: 0, yawDeg: 0, pitchDeg: 0, edgeFactor: 0 };

  if (arcAxis === "horizontal") {
    const dx = (cellCenterX - viewportW / 2) / (viewportW / 2);
    const angle = dx * maxAngle;
    const radius = viewportW / (2 * Math.sin(Math.max(0.001, maxAngle)));
    const z = -radius * (Math.cos(angle) - 1);
    const yawDeg = -((angle * 180) / Math.PI);
    const edgeFactor = Math.min(1, Math.abs(dx));
    return { z, yawDeg, pitchDeg: 0, edgeFactor };
  }

  const dy = (cellCenterY - viewportH / 2) / (viewportH / 2);
  const angle = dy * maxAngle;
  const radius = viewportH / (2 * Math.sin(Math.max(0.001, maxAngle)));
  const z = -radius * (Math.cos(angle) - 1);
  const pitchDeg = (angle * 180) / Math.PI;
  const edgeFactor = Math.min(1, Math.abs(dy));
  return { z, yawDeg: 0, pitchDeg, edgeFactor };
}

const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));

// ---------------------------------------------------------------------------
// Default content
// ---------------------------------------------------------------------------

const DEFAULT_ITEMS: GalleryItem[] = [
  { title: "Tealogy", image: { src: "/gallery/image01.jpeg" }, year: 2026 },
  { title: "organizers", image: { src: "/gallery/image02.jpeg" }, year: 2026 },
  { title: "games", image: { src: "/gallery/image03.jpeg" }, year: 2026 },
  { title: "Mafia", image: { src: "/gallery/image04.jpeg" }, year: 2026 },
  { title: "Discussions", image: { src: "/gallery/image05.jpeg" }, year: 2026 },
  { title: "hmmm", image: { src: "/gallery/image06.jpeg" }, year: 2026 },
  { title: "Sunday", image: { src: "/gallery/image08.jpeg" }, year: 2026 },
  { title: "Fun games", image: { src: "/gallery/image09.jpeg" }, year: 2026 },
  { title: "Outfoors", image: { src: "/gallery/image10.jpeg" }, year: 2026 },
  { title: "The Boys", image: { src: "/gallery/image11.jpeg" }, year: 2026 },
];

const DEFAULT_BORDER: BorderConfig = {
  width: 1,
  style: "solid",
  color: "#FFFFFF",
  showTop: false,
  showBottom: true,
  showLeft: true,
  showRight: true,
};

type PhantomInfiniteGalleryProps = {
  items?: GalleryItem[];
  cellSize?: number;
  backgroundColor?: string;
  textColor?: string;
  cellPadding?: number;
  gap?: number;
  arcAmount?: number;
  arcMaxAngleDeg?: number;
  arcAxis?: "horizontal" | "vertical";
  edgeFade?: number;
  border?: BorderConfig;
  hoverColor?: string;
  zoomValue?: number;
  parallaxEnabled?: boolean;
  parallaxStrength?: number;
  parallaxEase?: number;
  parallaxWhileDragging?: boolean;
  inertiaEnabled?: boolean;
  throwFriction?: number;
  throwVelocityScale?: number;
  throwMinSpeed?: number;
  throwMaxSpeed?: number;
};

const DRAG_THRESHOLD = 4;
const PRESS_ZOOM_DELAY = 120;

type TileHandle = {
  el: HTMLDivElement;
  qsX: (v: number) => void;
  qsY: (v: number) => void;
  qsZ: (v: number) => void;
  qsRotY: (v: number) => void;
  qsRotX: (v: number) => void;
  qsScale: (v: number) => void;
  qsOpacity: (v: number) => void;
};

export default function PhantomInfiniteGallery({
  items = DEFAULT_ITEMS,
  cellSize = 300,
  backgroundColor = "#000000",
  textColor = "#808080",
  cellPadding = 10,
  gap = 12,
  arcAmount = 0.9,
  arcMaxAngleDeg = 28,
  arcAxis = "horizontal",
  edgeFade = 0.25,
  border = DEFAULT_BORDER,
  hoverColor = "#FF5588",
  zoomValue = 0.98,
  parallaxEnabled = true,
  parallaxStrength = 0.1,
  parallaxEase = 0.12,
  parallaxWhileDragging = false,
  inertiaEnabled = true,
  throwFriction = 0.92,
  throwVelocityScale = 1,
  throwMinSpeed = 80,
  throwMaxSpeed = 2500,
}: PhantomInfiniteGalleryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const vignetteRef = useRef<HTMLDivElement | null>(null);

  // ---- Animation state lives in refs, NOT React state --------------------
  const offsetRef = useRef<Point>({ x: 0, y: 0 });
  const targetOffsetRef = useRef<Point>({ x: 0, y: 0 });
  const inertiaRef = useRef<Point>({ x: 0, y: 0 });
  const velocityRef = useRef<Point>({ x: 0, y: 0 });
  const inertiaActiveRef = useRef(false);
  const mouseOffsetRef = useRef<Point>({ x: 0, y: 0 });
  const targetMouseOffsetRef = useRef<Point>({ x: 0, y: 0 });
  const currentCellSizeRef = useRef(cellSize);
  const targetCellSizeRef = useRef(cellSize);
  const draggingRef = useRef(false);
  const isPressingRef = useRef(false);
  const viewportRef = useRef<Viewport>({ w: 0, h: 0 });
  const windowOriginRef = useRef({ startX: 0, startY: 0 });
  const pointerIdRef = useRef<number | null>(null);
  const lastMoveRef = useRef({ x: 0, y: 0, t: 0 });
  const pressPosRef = useRef<Point>({ x: 0, y: 0 });
  const startOffsetRef = useRef<Point>({ x: 0, y: 0 });
  const pressTimerRef = useRef<number | null>(null);

  // Registry of mounted tile DOM nodes + their precompiled GSAP setters.
  const tileHandlesRef = useRef<Map<string, TileHandle>>(new Map());

  // The only React state that changes at runtime: how many tiles exist and
  // where the visible window currently starts. Both update rarely — cols/
  // rows only on resize, startX/startY only when a cell boundary is crossed.
  const [gridDims, setGridDims] = useState({ cols: 20, rows: 20 });
  const [windowOrigin, setWindowOrigin] = useState({ startX: 0, startY: 0 });

  const cellWithGapBase = cellSize; // fixed box size; visual zoom is a transform, not a layout change

  // ---- Track container size; also resize the tile window to fit ----------
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      viewportRef.current = { w: width, h: height };
      const minCell = Math.max(1, cellSize * Math.min(1, zoomValue));
      const cols = Math.ceil(width / minCell) + 10;
      const rows = Math.ceil(height / minCell) + 10;
      setGridDims((prev) =>
        prev.cols === cols && prev.rows === rows ? prev : { cols, rows }
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [cellSize, zoomValue]);

  // ---- One-time vignette fade-in (GSAP, not per-frame state) -------------
  useEffect(() => {
    if (!vignetteRef.current) return;
    gsap.fromTo(
      vignetteRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  const commitInertiaToBase = useCallback(() => {
    offsetRef.current = {
      x: offsetRef.current.x + inertiaRef.current.x,
      y: offsetRef.current.y + inertiaRef.current.y,
    };
    targetOffsetRef.current = { ...offsetRef.current };
    inertiaRef.current = { x: 0, y: 0 };
    inertiaActiveRef.current = false;
  }, []);

  // ---- Main loop: GSAP ticker, writes DOM directly via quickSetters ------
  useEffect(() => {
    const tick = () => {
      const dt = Math.min(0.05, gsap.ticker.deltaRatio(60) / 60);

      // Lerp zoom
      currentCellSizeRef.current +=
        (targetCellSizeRef.current - currentCellSizeRef.current) * 0.15;

      // Lerp base offset only while not actively dragging
      if (!draggingRef.current) {
        offsetRef.current.x +=
          (targetOffsetRef.current.x - offsetRef.current.x) * 0.15;
        offsetRef.current.y +=
          (targetOffsetRef.current.y - offsetRef.current.y) * 0.15;
      }

      // Inertia
      if (inertiaEnabled && inertiaActiveRef.current) {
        const f = Math.pow(throwFriction, dt * 60);
        velocityRef.current.x *= f;
        velocityRef.current.y *= f;
        const speed = Math.hypot(velocityRef.current.x, velocityRef.current.y);
        if (speed < 1) {
          const dir = Math.atan2(velocityRef.current.y, velocityRef.current.x);
          velocityRef.current.x = Math.cos(dir) * 1e-4;
          velocityRef.current.y = Math.sin(dir) * 1e-4;
        }
        inertiaRef.current.x += velocityRef.current.x * dt;
        inertiaRef.current.y += velocityRef.current.y * dt;
      }

      // Mouse parallax
      const wantParallax =
        parallaxEnabled && (parallaxWhileDragging || !draggingRef.current);
      const mtx = wantParallax ? targetMouseOffsetRef.current.x : 0;
      const mty = wantParallax ? targetMouseOffsetRef.current.y : 0;
      mouseOffsetRef.current.x += (mtx - mouseOffsetRef.current.x) * parallaxEase;
      mouseOffsetRef.current.y += (mty - mouseOffsetRef.current.y) * parallaxEase;

      const cellWithGap = currentCellSizeRef.current;
      const zoomScale = cellWithGap / cellWithGapBase;
      const effX =
        offsetRef.current.x + inertiaRef.current.x + mouseOffsetRef.current.x;
      const effY =
        offsetRef.current.y + inertiaRef.current.y + mouseOffsetRef.current.y;

      // Reposition the visible window only when it actually needs to shift.
      const halfCols = Math.floor(gridDims.cols / 2);
      const halfRows = Math.floor(gridDims.rows / 2);
      const startX = Math.floor(-effX / cellWithGap) - halfCols;
      const startY = Math.floor(-effY / cellWithGap) - halfRows;
      if (
        startX !== windowOriginRef.current.startX ||
        startY !== windowOriginRef.current.startY
      ) {
        windowOriginRef.current = { startX, startY };
        setWindowOrigin({ startX, startY });
      }

      const viewportW = viewportRef.current.w || 1;
      const viewportH = viewportRef.current.h || 1;

      tileHandlesRef.current.forEach((handle, key) => {
        const [xStr, yStr] = key.split(",");
        const x = Number(xStr);
        const y = Number(yStr);

        const tileLeft = x * cellWithGap + effX;
        const tileTop = y * cellWithGap + effY;
        const cellCenterX = tileLeft + cellWithGap / 2;
        const cellCenterY = tileTop + cellWithGap / 2;

        const { z, yawDeg, pitchDeg, edgeFactor } = calcArcTransform({
          cellCenterX,
          cellCenterY,
          viewportW,
          viewportH,
          arcAxis,
          arcMaxAngleDeg,
          arcAmount,
        });

        const edgeScale = 1 - edgeFade * (edgeFactor * edgeFactor);
        const opacity = 1 - 0.4 * (edgeFactor * arcAmount);

        handle.qsX(tileLeft);
        handle.qsY(tileTop);
        handle.qsZ(z);
        handle.qsRotY(yawDeg);
        handle.qsRotX(pitchDeg);
        handle.qsScale(edgeScale * zoomScale);
        handle.qsOpacity(opacity);
      });
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gridDims,
    arcAxis,
    arcMaxAngleDeg,
    arcAmount,
    edgeFade,
    parallaxEnabled,
    parallaxWhileDragging,
    parallaxEase,
    inertiaEnabled,
    throwFriction,
    cellWithGapBase,
  ]);

  // If the `cellSize` prop changes externally, re-pin the view around center.
  useEffect(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    const pivot = rect ? { x: rect.width / 2, y: rect.height / 2 } : { x: 0, y: 0 };
    const visibleOffset = {
      x: offsetRef.current.x + inertiaRef.current.x,
      y: offsetRef.current.y + inertiaRef.current.y,
    };
    const newTarget = computePinnedOffset(
      currentCellSizeRef.current,
      cellSize,
      pivot,
      visibleOffset
    );
    targetCellSizeRef.current = cellSize;
    targetOffsetRef.current = newTarget;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellSize]);

  // ---- Pointer handlers (write refs directly; no per-move setState) ------

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (
        inertiaActiveRef.current ||
        inertiaRef.current.x !== 0 ||
        inertiaRef.current.y !== 0
      ) {
        commitInertiaToBase();
      }

      pointerIdRef.current = e.pointerId;
      e.currentTarget.setPointerCapture(e.pointerId);
      isPressingRef.current = true;
      draggingRef.current = false;

      lastMoveRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
      velocityRef.current = { x: 0, y: 0 };
      pressPosRef.current = { x: e.clientX, y: e.clientY };
      startOffsetRef.current = { ...offsetRef.current };

      if (pressTimerRef.current) window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = window.setTimeout(() => {
        if (!draggingRef.current && isPressingRef.current) {
          const rect = containerRef.current?.getBoundingClientRect();
          const pivot = rect
            ? { x: rect.width / 2, y: rect.height / 2 }
            : { x: 0, y: 0 };
          const newSize = cellSize * zoomValue;
          const visibleOffset = {
            x: offsetRef.current.x + inertiaRef.current.x,
            y: offsetRef.current.y + inertiaRef.current.y,
          };
          const pinned = computePinnedOffset(
            currentCellSizeRef.current,
            newSize,
            pivot,
            visibleOffset
          );
          targetCellSizeRef.current = newSize;
          targetOffsetRef.current = pinned;
        }
      }, PRESS_ZOOM_DELAY);
    },
    [cellSize, zoomValue, commitInertiaToBase]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();

      if (isPressingRef.current) {
        const now = performance.now();
        const dt = Math.max(0.001, (now - lastMoveRef.current.t) / 1000);
        const dx = e.clientX - lastMoveRef.current.x;
        const dy = e.clientY - lastMoveRef.current.y;
        const vx = clamp((dx / dt) * throwVelocityScale, -throwMaxSpeed, throwMaxSpeed);
        const vy = clamp((dy / dt) * throwVelocityScale, -throwMaxSpeed, throwMaxSpeed);
        velocityRef.current.x = vx * 0.6 + velocityRef.current.x * 0.4;
        velocityRef.current.y = vy * 0.6 + velocityRef.current.y * 0.4;
        lastMoveRef.current = { x: e.clientX, y: e.clientY, t: now };
      }

      const suppressParallax = isPressingRef.current;
      if (
        parallaxEnabled &&
        (parallaxWhileDragging || !draggingRef.current) &&
        containerRef.current &&
        !suppressParallax
      ) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const reverseX = (rect.width / 2 - mouseX) * parallaxStrength;
        const reverseY = (rect.height / 2 - mouseY) * parallaxStrength;
        targetMouseOffsetRef.current = { x: reverseX, y: reverseY };
      }

      if (!isPressingRef.current) return;

      const dx = e.clientX - pressPosRef.current.x;
      const dy = e.clientY - pressPosRef.current.y;

      if (!draggingRef.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        draggingRef.current = true;
        if (containerRef.current) containerRef.current.style.cursor = "grabbing";
        startOffsetRef.current = { ...offsetRef.current };
      }

      if (draggingRef.current) {
        const nx = startOffsetRef.current.x + dx;
        const ny = startOffsetRef.current.y + dy;
        offsetRef.current = { x: nx, y: ny };
        targetOffsetRef.current = { x: nx, y: ny };
      }
    },
    [parallaxEnabled, parallaxWhileDragging, parallaxStrength, throwVelocityScale, throwMaxSpeed]
  );

  const handlePointerUp = useCallback(() => {
    try {
      if (pointerIdRef.current != null && containerRef.current?.releasePointerCapture) {
        containerRef.current.releasePointerCapture(pointerIdRef.current);
      }
    } catch {
      // ignore
    }
    isPressingRef.current = false;
    if (pressTimerRef.current) {
      window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    const speed = Math.hypot(velocityRef.current.x, velocityRef.current.y);
    if (inertiaEnabled && speed >= throwMinSpeed) {
      inertiaActiveRef.current = true;
    } else {
      inertiaActiveRef.current = false;
      inertiaRef.current = { x: 0, y: 0 };
    }

    draggingRef.current = false;
    if (containerRef.current) containerRef.current.style.cursor = "grab";

    const rect = containerRef.current?.getBoundingClientRect();
    const pivot = rect ? { x: rect.width / 2, y: rect.height / 2 } : { x: 0, y: 0 };
    const visibleOffset = {
      x: offsetRef.current.x + inertiaRef.current.x,
      y: offsetRef.current.y + inertiaRef.current.y,
    };
    const pinnedBack = computePinnedOffset(
      currentCellSizeRef.current,
      cellSize,
      pivot,
      visibleOffset
    );
    targetMouseOffsetRef.current = { x: 0, y: 0 };
    targetCellSizeRef.current = cellSize;
    targetOffsetRef.current = pinnedBack;
  }, [cellSize, inertiaEnabled, throwMinSpeed]);

  const handlePointerLeave = useCallback(() => {
    targetMouseOffsetRef.current = { x: 0, y: 0 };
  }, []);

  // ---- Grid cell list: recomputed only when the window/dims change -------

  const gridCellKeys = useMemo(() => {
    const keys: { x: number; y: number; key: string; item: GalleryItem }[] = [];
    const { startX, startY } = windowOrigin;
    for (let y = startY; y < startY + gridDims.rows; y++) {
      for (let x = startX; x < startX + gridDims.cols; x++) {
        const itemIndex = Math.abs((x + y * 3) % items.length);
        keys.push({ x, y, key: `${x},${y}`, item: items[itemIndex] });
      }
    }
    return keys;
  }, [windowOrigin, gridDims, items]);

  const registerTile = useCallback(
    (key: string) => (el: HTMLDivElement | null) => {
      if (!el) {
        tileHandlesRef.current.delete(key);
        return;
      }
      tileHandlesRef.current.set(key, {
        el,
        qsX: gsap.quickSetter(el, "x", "px") as (v: number) => void,
        qsY: gsap.quickSetter(el, "y", "px") as (v: number) => void,
        qsZ: gsap.quickSetter(el, "z", "px") as (v: number) => void,
        qsRotY: gsap.quickSetter(el, "rotationY", "deg") as (v: number) => void,
        qsRotX: gsap.quickSetter(el, "rotationX", "deg") as (v: number) => void,
        qsScale: gsap.quickSetter(el, "scale") as (v: number) => void,
        qsOpacity: gsap.quickSetter(el, "opacity") as (v: number) => void,
      });
    },
    []
  );

  const borderStyle = {
    borderTop: border.showTop ? `${border.width}px ${border.style} ${border.color}` : "none",
    borderLeft: border.showLeft ? `${border.width}px ${border.style} ${border.color}` : "none",
    borderRight: border.showRight ? `${border.width}px ${border.style} ${border.color}` : "none",
    borderBottom: border.showBottom ? `${border.width}px ${border.style} ${border.color}` : "none",
  } as const;

  return (
    <div
      ref={containerRef}
      className="phantom-gallery-root relative w-full h-full overflow-hidden select-none [touch-action:none] [perspective:1000px] [transform-style:preserve-3d]"
      style={
        {
          backgroundColor,
          cursor: "grab",
          touchAction: "none",
          overscrollBehavior: "none",
          ["--tile-hover-color" as string]: hoverColor,
        } as React.CSSProperties
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      <style>{`
        .phantom-gallery-tile {
          transition: background-color 0.3s ease-out;
          will-change: transform;
          transform-origin: 0 0;
        }
        .phantom-gallery-tile:hover {
          background-color: var(--tile-hover-color);
        }
      `}</style>

      <div className="absolute w-full h-full [transform-style:preserve-3d]">
        {gridCellKeys.map(({ x, y, key, item }) => (
          <div
            key={key}
            ref={registerTile(key)}
            className="phantom-gallery-tile absolute box-border  flex flex-col cursor-pointer"
            style={{
              left: 0,
              top: 0,
              width: cellWithGapBase,
              height: cellWithGapBase,
              ...borderStyle,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              padding: cellPadding,
            }}
          >
            <div
              className="flex-1 rounded"
              style={{
                backgroundImage: `url(${item?.image?.src || DEFAULT_ITEMS[0].image.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                marginBottom: gap,
              }}
            />
            <div
              className="flex items-center justify-between font-mono text-xs"
              style={{ color: textColor }}
            >
              <span className="font-bold uppercase">{item?.title || "Project"}</span>
              <span>{item?.year || 2024}</span>
            </div>
          </div>
        ))}
      </div>

      <div
        ref={vignetteRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.8) 90%, rgba(0,0,0,1) 100%)",
        }}
      />
    </div>
  );
}