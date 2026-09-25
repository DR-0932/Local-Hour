"use client";
import Image from "next/image";

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
export type GalleryItem = {
  title: string;
  image: { src: string; alt?: string };
  year: number;
};
export type BorderConfig = {
  width: number;
  style: string;
  color: string;
  showTop: boolean;
  showBottom: boolean;
  showLeft: boolean;
  showRight: boolean;
};

// ---------------------------------------------------------------------------
// Pure Helpers
// ---------------------------------------------------------------------------

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

const DEFAULT_ITEMS: GalleryItem[] = [
  { title: "Tealogy", image: { src: "/gallery/image01.jpeg" }, year: 2026 },
  { title: "Organizers", image: { src: "/gallery/image02.jpeg" }, year: 2026 },
  { title: "Games", image: { src: "/gallery/image03.jpeg" }, year: 2026 },
  { title: "Mafia", image: { src: "/gallery/image04.jpeg" }, year: 2026 },
  { title: "Discussions", image: { src: "/gallery/image05.jpeg" }, year: 2026 },
  { title: "Sunday", image: { src: "/gallery/image08.jpeg" }, year: 2026 },
  { title: "Outdoors", image: { src: "/gallery/image10.jpeg" }, year: 2026 },
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

const DRAG_THRESHOLD = 4;
const PRESS_ZOOM_DELAY = 120;

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

  // ---- Mutable Refs (Never trigger React Re-renders) --------------------
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

  const tileHandlesRef = useRef<Map<string, TileHandle>>(new Map());

  // Grid sizing & bounds state
  const [gridDims, setGridDims] = useState({ cols: 12, rows: 12 });
  const [windowOrigin, setWindowOrigin] = useState({ startX: 0, startY: 0 });

  // Store configurable props in refs so Ticker callback doesn't detach/reattach
  const configRef = useRef({
    arcAxis,
    arcMaxAngleDeg,
    arcAmount,
    edgeFade,
    parallaxEnabled,
    parallaxWhileDragging,
    parallaxEase,
    inertiaEnabled,
    throwFriction,
    cellSize,
  });

  useEffect(() => {
    configRef.current = {
      arcAxis,
      arcMaxAngleDeg,
      arcAmount,
      edgeFade,
      parallaxEnabled,
      parallaxWhileDragging,
      parallaxEase,
      inertiaEnabled,
      throwFriction,
      cellSize,
    };
  }, [
    arcAxis,
    arcMaxAngleDeg,
    arcAmount,
    edgeFade,
    parallaxEnabled,
    parallaxWhileDragging,
    parallaxEase,
    inertiaEnabled,
    throwFriction,
    cellSize,
  ]);

  // Handle Container Resizing
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      viewportRef.current = { w: width, h: height };

      const minCell = Math.max(1, cellSize * Math.min(1, zoomValue));
      // Added a padding buffer to prevent seeing pop-ins on fast drag
      const cols = Math.ceil(width / minCell) + 6;
      const rows = Math.ceil(height / minCell) + 6;

      setGridDims((prev) =>
        prev.cols === cols && prev.rows === rows ? prev : { cols, rows }
      );
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [cellSize, zoomValue]);

  // Vignette Entrance
  useEffect(() => {
    if (vignetteRef.current) {
      gsap.fromTo(vignetteRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 });
    }
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

  // ---------------------------------------------------------------------------
  // Optimized Main Animation Loop
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const tick = () => {
      const cfg = configRef.current;
      const dt = Math.min(0.05, gsap.ticker.deltaRatio(60) / 60);

      // Lerp Zoom
      currentCellSizeRef.current +=
        (targetCellSizeRef.current - currentCellSizeRef.current) * 0.15;

      // Lerp Base Offset (when not dragging)
      if (!draggingRef.current) {
        offsetRef.current.x +=
          (targetOffsetRef.current.x - offsetRef.current.x) * 0.15;
        offsetRef.current.y +=
          (targetOffsetRef.current.y - offsetRef.current.y) * 0.15;
      }

      // Physics Inertia
      if (cfg.inertiaEnabled && inertiaActiveRef.current) {
        const f = Math.pow(cfg.throwFriction, dt * 60);
        velocityRef.current.x *= f;
        velocityRef.current.y *= f;

        const speed = Math.hypot(velocityRef.current.x, velocityRef.current.y);
        if (speed < 0.5) {
          inertiaActiveRef.current = false;
        } else {
          inertiaRef.current.x += velocityRef.current.x * dt;
          inertiaRef.current.y += velocityRef.current.y * dt;
        }
      }

      // Parallax
      const wantParallax =
        cfg.parallaxEnabled && (cfg.parallaxWhileDragging || !draggingRef.current);
      const mtx = wantParallax ? targetMouseOffsetRef.current.x : 0;
      const mty = wantParallax ? targetMouseOffsetRef.current.y : 0;
      mouseOffsetRef.current.x += (mtx - mouseOffsetRef.current.x) * cfg.parallaxEase;
      mouseOffsetRef.current.y += (mty - mouseOffsetRef.current.y) * cfg.parallaxEase;

      const cellWithGap = currentCellSizeRef.current;
      const zoomScale = cellWithGap / cfg.cellSize;
      const effX =
        offsetRef.current.x + inertiaRef.current.x + mouseOffsetRef.current.x;
      const effY =
        offsetRef.current.y + inertiaRef.current.y + mouseOffsetRef.current.y;

      // Reposition Window on Boundary Crossing
      const halfCols = Math.floor(gridDims.cols / 2);
      const halfRows = Math.floor(gridDims.rows / 2);
      const startX = Math.floor(-effX / cellWithGap) - halfCols;
      const startY = Math.floor(-effY / cellWithGap) - halfRows;

      if (
        startX !== windowOriginRef.current.startX ||
        startY !== windowOriginRef.current.startY
      ) {
        windowOriginRef.current = { startX, startY };
        // Schedule state update outside synchronous loop execution
        requestAnimationFrame(() => setWindowOrigin({ startX, startY }));
      }

      const viewportW = viewportRef.current.w || 1;
      const viewportH = viewportRef.current.h || 1;

      // Direct Batch DOM Update via QuickSetters
      tileHandlesRef.current.forEach((handle, key) => {
        const commaIdx = key.indexOf(",");
        const x = Number(key.slice(0, commaIdx));
        const y = Number(key.slice(commaIdx + 1));

        const tileLeft = x * cellWithGap + effX;
        const tileTop = y * cellWithGap + effY;

        const { z, yawDeg, pitchDeg, edgeFactor } = calcArcTransform({
          cellCenterX: tileLeft + cellWithGap / 2,
          cellCenterY: tileTop + cellWithGap / 2,
          viewportW,
          viewportH,
          arcAxis: cfg.arcAxis,
          arcMaxAngleDeg: cfg.arcMaxAngleDeg,
          arcAmount: cfg.arcAmount,
        });

        const edgeScale = 1 - cfg.edgeFade * (edgeFactor * edgeFactor);
        const opacity = 1 - 0.4 * (edgeFactor * cfg.arcAmount);

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
    return () => gsap.ticker.remove(tick);
  }, [gridDims]);

  // External cellSize change pinning
  useEffect(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    const pivot = rect ? { x: rect.width / 2, y: rect.height / 2 } : { x: 0, y: 0 };
    const visibleOffset = {
      x: offsetRef.current.x + inertiaRef.current.x,
      y: offsetRef.current.y + inertiaRef.current.y,
    };
    targetCellSizeRef.current = cellSize;
    targetOffsetRef.current = computePinnedOffset(
      currentCellSizeRef.current,
      cellSize,
      pivot,
      visibleOffset
    );
  }, [cellSize]);

  // Pointer Handlers
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
          targetCellSizeRef.current = newSize;
          targetOffsetRef.current = computePinnedOffset(
            currentCellSizeRef.current,
            newSize,
            pivot,
            visibleOffset
          );
        }
      }, PRESS_ZOOM_DELAY);
    },
    [cellSize, zoomValue, commitInertiaToBase]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
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

      if (
        parallaxEnabled &&
        (parallaxWhileDragging || !draggingRef.current) &&
        containerRef.current &&
        !isPressingRef.current
      ) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        targetMouseOffsetRef.current = {
          x: (rect.width / 2 - mouseX) * parallaxStrength,
          y: (rect.height / 2 - mouseY) * parallaxStrength,
        };
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
    [
      parallaxEnabled,
      parallaxWhileDragging,
      parallaxStrength,
      throwVelocityScale,
      throwMaxSpeed,
    ]
  );

  const handlePointerUp = useCallback(() => {
    try {
      if (
        pointerIdRef.current != null &&
        containerRef.current?.releasePointerCapture
      ) {
        containerRef.current.releasePointerCapture(pointerIdRef.current);
      }
    } catch {
      // Ignore
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

    targetMouseOffsetRef.current = { x: 0, y: 0 };
    targetCellSizeRef.current = cellSize;
    targetOffsetRef.current = computePinnedOffset(
      currentCellSizeRef.current,
      cellSize,
      pivot,
      visibleOffset
    );
  }, [cellSize, inertiaEnabled, throwMinSpeed]);

  // Memorized grid rendering keys
  const gridCellKeys = useMemo(() => {
    const keys: { x: number; y: number; key: string; item: GalleryItem }[] = [];
    const { startX, startY } = windowOrigin;
    const len = items.length || 1;

    for (let y = startY; y < startY + gridDims.rows; y++) {
      for (let x = startX; x < startX + gridDims.cols; x++) {
        // Safe wrap math for mapping items continuously over spatial negative grid
        const itemIndex = (((x + y * 3) % len) + len) % len;
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

  const borderStyle = useMemo(
    () => ({
      borderTop: border.showTop
        ? `${border.width}px ${border.style} ${border.color}`
        : "none",
      borderLeft: border.showLeft
        ? `${border.width}px ${border.style} ${border.color}`
        : "none",
      borderRight: border.showRight
        ? `${border.width}px ${border.style} ${border.color}`
        : "none",
      borderBottom: border.showBottom
        ? `${border.width}px ${border.style} ${border.color}`
        : "none",
    }),
    [border]
  );

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
      onPointerLeave={() => {
        targetMouseOffsetRef.current = { x: 0, y: 0 };
      }}
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
        {gridCellKeys.map(({ key, item }) => (
          <div
            key={key}
            ref={registerTile(key)}
            className="phantom-gallery-tile absolute box-border flex flex-col cursor-pointer"
            style={{
              left: 0,
              top: 0,
              width: cellSize,
              height: cellSize,
              ...borderStyle,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              padding: cellPadding,
            }}
          >
            <div 
              className="relative flex-1 rounded overflow-hidden" 
              style={{ marginBottom: gap }}
            >
              <Image
                src={item?.image?.src || DEFAULT_ITEMS[0].image.src}
                alt={item?.title || "Gallery image"}
                fill
                sizes="(max-width: 640px) 180px, 300px"
                className="object-cover"
              />
            </div>
            <div
              className="flex items-center justify-between font-mono text-xs"
              style={{ color: textColor }}
            >
              <span className="font-bold uppercase">{item?.title || "Project"}</span>
              <span>{item?.year || 2026}</span>
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
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,1) 100%)",
        }}
      />
    </div>
  );
} 