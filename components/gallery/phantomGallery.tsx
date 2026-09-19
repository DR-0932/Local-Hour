"use client";

/**
 * PhantomInfiniteGallery
 *
 * Draggable, infinitely-tiling image grid with a subtle 3D "arc" curvature,
 * inertial throwing, press-to-zoom, and mouse parallax.
 *
 * Ported from a Framer code component to plain Next.js/React. All Framer-only
 * APIs (the `framer` import, `addPropertyControls`, `__FramerMetadata__`) have
 * been removed; styling that was previously static inline CSS has been moved
 * to Tailwind utility classes, and Framer Motion now drives the tile hover
 * state and the vignette's entrance fade. Per-tile position/size/3D transform
 * still has to be inline styles, since every tile's numbers are computed per
 * frame from drag/inertia/zoom state and can't be expressed as static classes.
 */

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  startTransition,
} from "react";
import { motion } from "framer-motion";

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
// Pure helpers
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

/** Compute the pseudo-3D "arc wall" transform for a tile at a given center. */
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
    const dx = (cellCenterX - viewportW / 2) / (viewportW / 2); // -1..1
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
  {
    title: "Tealogy",
    image: { src: "/gallery/image01.jpeg", alt: "Motion Study" },
    year: 2026,
  },
  {
    title: "organizers",
    image: { src: "/gallery/image02.jpeg", alt: "Idle Form" },
    year: 2026,
  },
  {
    title: "games",
    image: { src: "/gallery/image03.jpeg", alt: "Blur Signal" },
    year: 2026,
  },
  {
    title: "Mafia",
    image: { src: "/gallery/image04.jpeg", alt: "Still Drift" },
    year: 2026,
  },
  {
    title: "Discussions",
    image: { src: "/gallery/image05.jpeg", alt: "Tidewalk" },
    year: 2026,
  },
  {
    title: "hmmm",
    image: { src: "/gallery/image06.jpeg", alt: "Tidewalk" },
    year: 2026,
  },

  {
    title: "Sunday",
    image: { src: "/gallery/image08.jpeg", alt: "Tidewalk" },
    year: 2026,
  },
  {
    title: "Fun games",
    image: { src: "/gallery/image09.jpeg", alt: "Tidewalk" },
    year: 2026,
  },
  {
    title: "Outfoors",
    image: { src: "/gallery/image10.jpeg", alt: "Tidewalk" },
    year: 2026,
  },
  {
    title: "The Boys",
    image: { src: "/gallery/image11.jpeg", alt: "Tidewalk" },
    year: 2026,
  },
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

// Timing constants
const DRAG_THRESHOLD = 4; // px before a press becomes a drag
const PRESS_ZOOM_DELAY = 120; // ms before an unmoved press triggers the zoom-out

/**
 * @param {object} props
 * @param {Array<{title:string, image:{src:string, alt?:string}, year:number}>} [props.items]
 * @param {number} [props.cellSize=200]
 * @param {string} [props.backgroundColor="#000000"]
 * @param {string} [props.textColor="#808080"]
 * @param {number} [props.cellPadding=10]
 * @param {number} [props.gap=12]
 * @param {number} [props.arcAmount=0.6]        0..1, how much of the max arc angle to apply
 * @param {number} [props.arcMaxAngleDeg=28]
 * @param {"horizontal"|"vertical"} [props.arcAxis="horizontal"]
 * @param {number} [props.edgeFade=0.25]
 * @param {{width:number, style:string, color:string, showTop:boolean, showBottom:boolean, showLeft:boolean, showRight:boolean}} [props.border]
 * @param {string} [props.hoverColor="#FF5588"]
 * @param {number} [props.zoomValue=0.7]        cellSize multiplier while pressed-and-held
 * @param {boolean} [props.parallaxEnabled=true]
 * @param {number} [props.parallaxStrength=0.1]
 * @param {number} [props.parallaxEase=0.12]
 * @param {boolean} [props.parallaxWhileDragging=false]
 * @param {boolean} [props.inertiaEnabled=true]
 * @param {number} [props.throwFriction=0.92]
 * @param {number} [props.throwVelocityScale=1]
 * @param {number} [props.throwMinSpeed=80]
 * @param {number} [props.throwMaxSpeed=2500]
 */
export default function PhantomInfiniteGallery({
  items = DEFAULT_ITEMS,
  cellSize = 300,
  backgroundColor = "#000000",
  textColor = "#808080",
  cellPadding = 10,
  gap = 12,
  arcAmount = 0.6,
  arcMaxAngleDeg = 28,
  arcAxis = "horizontal",
  edgeFade = 0.25,
  border = DEFAULT_BORDER,
  hoverColor = "#FF5588",
  zoomValue = 0.7,
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

  // Base offset (tweened toward targetOffset when not dragging)
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [targetOffset, setTargetOffset] = useState<Point>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Zoom (cellSize tweens toward targetCellSize)
  const [currentCellSize, setCurrentCellSize] = useState<number>(cellSize);
  const [targetCellSize, setTargetCellSize] = useState<number>(cellSize);

  // Mouse parallax (tweens toward targetMouseOffset)
  const [mouseOffset, setMouseOffset] = useState<Point>({ x: 0, y: 0 });
  const [targetMouseOffset, setTargetMouseOffset] = useState<Point>({ x: 0, y: 0 });

  // Inertia delta, added on top of the base offset
  const [inertia, setInertia] = useState<Point>({ x: 0, y: 0 });
  const inertiaRef = useRef<Point>(inertia);
  useEffect(() => {
    inertiaRef.current = inertia;
  }, [inertia]);

  // Container size (drives the arc/vignette math)
  const [viewport, setViewport] = useState<Viewport>({ w: 0, h: 0 });

  // Mutable refs mirroring the state above, so the RAF loop and pointer
  // handlers always read the latest value without becoming stale closures.
  const velocityRef = useRef<Point>({ x: 0, y: 0 });
  const lastMoveRef = useRef<{ x: number; y: number; t: number }>({ x: 0, y: 0, t: 0 });
  const inertiaActiveRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const isPressingRef = useRef(false);
  const draggingRef = useRef(false);
  const offsetRef = useRef<Point>(offset);
  const targetOffsetRef = useRef<Point>(targetOffset);
  const mouseOffsetRef = useRef<Point>(mouseOffset);
  const targetMouseOffsetRef = useRef<Point>(targetMouseOffset);
  const pressPosRef = useRef<Point>({ x: 0, y: 0 });
  const startOffsetRef = useRef<Point>({ x: 0, y: 0 });
  const pressTimerRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    draggingRef.current = isDragging;
  }, [isDragging]);
  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);
  useEffect(() => {
    targetOffsetRef.current = targetOffset;
  }, [targetOffset]);
  useEffect(() => {
    mouseOffsetRef.current = mouseOffset;
  }, [mouseOffset]);
  useEffect(() => {
    targetMouseOffsetRef.current = targetMouseOffset;
  }, [targetMouseOffset]);

  /** Snap the visible (offset + inertia) position into the base offset, then zero inertia. */
  const commitInertiaToBase = useCallback(() => {
    const currentOffset = offsetRef.current;
    const currentInertia = inertiaRef.current || { x: 0, y: 0 };
    const committed = {
      x: currentOffset.x + currentInertia.x,
      y: currentOffset.y + currentInertia.y,
    };
    setOffset(committed);
    setTargetOffset(committed);
    setInertia({ x: 0, y: 0 });
    inertiaActiveRef.current = false;
  }, []);

  // Track container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const cr = entry.contentRect;
      setViewport({ w: cr.width, h: cr.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Main animation loop: tweens size/offset/parallax and integrates inertia.
  useEffect(() => {
    lastTimeRef.current = performance.now();
    let raf = 0;

    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000); // cap 50ms
      lastTimeRef.current = now;

      // Lerp zoom
      setCurrentCellSize((prev) => {
        const next = prev + (targetCellSize - prev) * 0.15;
        return Math.abs(next - targetCellSize) < 0.05 ? targetCellSize : next;
      });

      // Lerp base offset only while not actively dragging
      if (!draggingRef.current) {
        setOffset((prev) => {
          const tx = targetOffsetRef.current.x;
          const ty = targetOffsetRef.current.y;
          const nx = prev.x + (tx - prev.x) * 0.15;
          const ny = prev.y + (ty - prev.y) * 0.15;
          return {
            x: Math.abs(nx - tx) < 0.1 ? tx : nx,
            y: Math.abs(ny - ty) < 0.1 ? ty : ny,
          };
        });
      }

      // Inertia integration (independent of the base offset)
      if (inertiaEnabled && inertiaActiveRef.current) {
        const f = Math.pow(throwFriction, dt * 60); // friction scaled to ~60fps baseline
        velocityRef.current.x *= f;
        velocityRef.current.y *= f;
        const speed = Math.hypot(velocityRef.current.x, velocityRef.current.y);
        if (speed < 1) {
          // Never fully stop -- keep a whisper of drift alive.
          const direction = Math.atan2(velocityRef.current.y, velocityRef.current.x);
          velocityRef.current.x = Math.cos(direction) * 1e-4;
          velocityRef.current.y = Math.sin(direction) * 1e-4;
        }
        setInertia((prev) => ({
          x: prev.x + velocityRef.current.x * dt,
          y: prev.y + velocityRef.current.y * dt,
        }));
      }

      // Eased mouse parallax
      if (parallaxEnabled && (parallaxWhileDragging || !draggingRef.current)) {
        setMouseOffset((prev) => {
          const tx = targetMouseOffsetRef.current.x;
          const ty = targetMouseOffsetRef.current.y;
          const nx = prev.x + (tx - prev.x) * parallaxEase;
          const ny = prev.y + (ty - prev.y) * parallaxEase;
          return {
            x: Math.abs(nx - tx) < 0.1 ? tx : nx,
            y: Math.abs(ny - ty) < 0.1 ? ty : ny,
          };
        });
      } else {
        setMouseOffset((prev) => {
          const nx = prev.x + (0 - prev.x) * parallaxEase;
          const ny = prev.y + (0 - prev.y) * parallaxEase;
          return { x: Math.abs(nx) < 0.1 ? 0 : nx, y: Math.abs(ny) < 0.1 ? 0 : ny };
        });
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inertiaEnabled, throwFriction, targetCellSize, parallaxEnabled, parallaxWhileDragging, parallaxEase]);

  // If the `cellSize` prop changes externally, re-pin the view around the center.
  useEffect(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    const pivot = rect ? { x: rect.width / 2, y: rect.height / 2 } : { x: 0, y: 0 };
    const visibleOffset = {
      x: offsetRef.current.x + (inertiaRef.current?.x || 0),
      y: offsetRef.current.y + (inertiaRef.current?.y || 0),
    };
    const newTargetOffset = computePinnedOffset(currentCellSize, cellSize, pivot, visibleOffset);
    setTargetCellSize(cellSize);
    setTargetOffset(newTargetOffset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellSize]);

  // ---- Pointer handlers -----------------------------------------------

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Prevent default browser behaviors (scrolling, text selection)
      if (e && e.preventDefault) e.preventDefault();
      // Commit any running inertia first so the grid doesn't jump.
      if (
        inertiaActiveRef.current ||
        (inertiaRef.current?.x || 0) !== 0 ||
        (inertiaRef.current?.y || 0) !== 0
      ) {
        commitInertiaToBase();
      }

      pointerIdRef.current = e.pointerId;
      e.currentTarget.setPointerCapture(e.pointerId);
      isPressingRef.current = true;
      setIsDragging(false);

      lastMoveRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
      velocityRef.current = { x: 0, y: 0 };
      pressPosRef.current = { x: e.clientX, y: e.clientY };
      startOffsetRef.current = offsetRef.current;

      // Only zoom out if the press is actually held (avoids fighting quick drags).
      if (pressTimerRef.current) window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = window.setTimeout(() => {
        if (!draggingRef.current && isPressingRef.current) {
          const rect = containerRef.current?.getBoundingClientRect();
          const pivot = rect ? { x: rect.width / 2, y: rect.height / 2 } : { x: 0, y: 0 };
          const newSize = cellSize * zoomValue;
          const visibleOffset = {
            x: offsetRef.current.x + (inertiaRef.current?.x || 0),
            y: offsetRef.current.y + (inertiaRef.current?.y || 0),
          };
          const pinned = computePinnedOffset(currentCellSize, newSize, pivot, visibleOffset);
          setTargetCellSize(newSize);
          setTargetOffset(pinned);
        }
      }, PRESS_ZOOM_DELAY);
    },
    [cellSize, zoomValue, currentCellSize, commitInertiaToBase]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Prevent default to stop touch scrolling/gestures while dragging
      if (e && e.preventDefault) e.preventDefault();
      // Velocity tracking while pressing/dragging
      if (isPressingRef.current) {
        const now = performance.now();
        const dt = Math.max(0.001, (now - lastMoveRef.current.t) / 1000);
        const dx = e.clientX - lastMoveRef.current.x;
        const dy = e.clientY - lastMoveRef.current.y;
        const vx = clamp((dx / dt) * throwVelocityScale, -throwMaxSpeed, throwMaxSpeed);
        const vy = clamp((dy / dt) * throwVelocityScale, -throwMaxSpeed, throwMaxSpeed);
        // EMA smoothing: 60% new sample, 40% previous
        velocityRef.current.x = vx * 0.6 + velocityRef.current.x * 0.4;
        velocityRef.current.y = vy * 0.6 + velocityRef.current.y * 0.4;
        lastMoveRef.current = { x: e.clientX, y: e.clientY, t: now };
      }

      // Suppress parallax while pressing/dragging to avoid a "yank"
      const suppressParallax = isPressingRef.current || isDragging;
      if (
        parallaxEnabled &&
        (parallaxWhileDragging || !draggingRef.current) &&
        containerRef.current &&
        !suppressParallax
      ) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const reverseX = (centerX - mouseX) * parallaxStrength;
        const reverseY = (centerY - mouseY) * parallaxStrength;
        setTargetMouseOffset({ x: reverseX, y: reverseY });
      }

      if (!isPressingRef.current) return;

      const dx = e.clientX - pressPosRef.current.x;
      const dy = e.clientY - pressPosRef.current.y;

      // Only start an actual drag past the threshold.
      if (!isDragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        setIsDragging(true);
        draggingRef.current = true;
        startOffsetRef.current = offsetRef.current;
      }

      if (draggingRef.current) {
        const nx = startOffsetRef.current.x + dx;
        const ny = startOffsetRef.current.y + dy;
        // Update immediately for snappy dragging (don't defer with startTransition)
        setOffset({ x: nx, y: ny });
        setTargetOffset({ x: nx, y: ny });
      }
    },
    [isDragging, parallaxEnabled, parallaxWhileDragging, parallaxStrength, throwVelocityScale, throwMaxSpeed]
  );

  const handlePointerUp = useCallback(() => {
    // Release pointer capture to stop receiving pointer events from this pointer
    try {
      if (pointerIdRef.current != null && containerRef.current?.releasePointerCapture) {
        containerRef.current.releasePointerCapture(pointerIdRef.current);
      }
    } catch (err) {
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
      setInertia({ x: 0, y: 0 });
    }

    setIsDragging(false);
    draggingRef.current = false;

    // Zoom back in, pinned to center.
    const rect = containerRef.current?.getBoundingClientRect();
    const pivot = rect ? { x: rect.width / 2, y: rect.height / 2 } : { x: 0, y: 0 };
    const visibleOffset = {
      x: offsetRef.current.x + (inertiaRef.current?.x || 0),
      y: offsetRef.current.y + (inertiaRef.current?.y || 0),
    };
    const pinnedBack = computePinnedOffset(currentCellSize, cellSize, pivot, visibleOffset);
    setTargetMouseOffset({ x: 0, y: 0 });
    startTransition(() => {
      setTargetCellSize(cellSize);
      setTargetOffset(pinnedBack);
    });
  }, [cellSize, currentCellSize, inertiaEnabled, throwMinSpeed]);

  const handlePointerLeave = useCallback(() => {
    setTargetMouseOffset({ x: 0, y: 0 });
  }, []);

  // ---- Grid generation ---------------------------------------------------

  const gridCells = useMemo(() => {
    const cells = [];
    const gridSize = 20; // 20x20 window for the "infinite" feel
    const cellWithGap = currentCellSize;
    const startX = Math.floor(-offset.x / cellWithGap) - 5;
    const startY = Math.floor(-offset.y / cellWithGap) - 5;

    for (let y = startY; y < startY + gridSize; y++) {
      for (let x = startX; x < startX + gridSize; x++) {
        const itemIndex = Math.abs((x + y * 3) % items.length);
        const item = items[itemIndex];

        const tileLeft = x * cellWithGap + offset.x + mouseOffset.x + inertia.x;
        const tileTop = y * cellWithGap + offset.y + mouseOffset.y + inertia.y;
        const tileW = currentCellSize;
        const tileH = currentCellSize;
        const cellCenterX = tileLeft + tileW / 2;
        const cellCenterY = tileTop + tileH / 2;

        const { z, yawDeg, pitchDeg, edgeFactor } = calcArcTransform({
          cellCenterX,
          cellCenterY,
          viewportW: viewport.w || 1,
          viewportH: viewport.h || 1,
          arcAxis,
          arcMaxAngleDeg,
          arcAmount,
        });

        const scale = 1 - edgeFade * (edgeFactor * edgeFactor);
        const opacity = 1 - 0.4 * (edgeFactor * arcAmount);

        cells.push(
          <motion.div
            key={`${x}-${y}`}
            className="absolute box-border flex flex-col cursor-pointer"
            initial={false}
            whileHover={{ backgroundColor: hoverColor }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              left: tileLeft,
              top: tileTop,
              width: tileW,
              height: tileH,
              borderTop: border.showTop ? `${border.width}px ${border.style} ${border.color}` : "none",
              borderLeft: border.showLeft ? `${border.width}px ${border.style} ${border.color}` : "none",
              borderRight: border.showRight ? `${border.width}px ${border.style} ${border.color}` : "none",
              borderBottom: border.showBottom ? `${border.width}px ${border.style} ${border.color}` : "none",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              padding: cellPadding,
              transformStyle: "preserve-3d",
              transform: `translate3d(0, 0, ${z}px) rotateY(${yawDeg}deg) rotateX(${pitchDeg}deg) scale(${scale})`,
              opacity,
            }}
          >
            <div
              className="flex-1 rounded"
              style={{
                backgroundImage: `url(${
                  item?.image?.src || DEFAULT_ITEMS[0].image.src
                })`,
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
          </motion.div>
        );
      }
    }

    return cells;
  }, [
    items,
    currentCellSize,
    offset,
    mouseOffset,
    inertia,
    viewport,
    arcAxis,
    arcMaxAngleDeg,
    arcAmount,
    edgeFade,
    border,
    cellPadding,
    gap,
    textColor,
    hoverColor,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none [touch-action:none] [perspective:1000px] [transform-style:preserve-3d]"
      style={{
        backgroundColor,
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
        overscrollBehavior: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      <div className="absolute w-full h-full [transform-style:preserve-3d]">{gridCells}</div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.8) 90%, rgba(0,0,0,1) 100%)",
        }}
      />
    </div>
  );
}