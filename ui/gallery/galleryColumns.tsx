"use client";

import { useEffect, useRef, useState } from "react";
import GalleryCard from "./galleryCard";
import type { GalleryImage } from "./galleryData";


interface GalleryColumnProps {
  images: GalleryImage[];
  direction: "up" | "down";
  speed?: number;
  className?: string;
}

export default function GalleryColumn({
  images,
  direction,
  speed = 1,
  className = "",
}: GalleryColumnProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    let animationFrame = 0;

    const update = () => {
      const rect = element.getBoundingClientRect();

      const viewportCenter = window.innerHeight / 2;

      const elementCenter =
        rect.top + rect.height / 2;

      const progress =
        (viewportCenter - elementCenter) /
        window.innerHeight;

      const directionMultiplier =
        direction === "up" ? 1 : -1;

      setOffset(
        progress *
          speed *
          120 *
          directionMultiplier
      );

      animationFrame = 0;
    };

    const handleScroll = () => {
      if (!animationFrame) {
        animationFrame =
          requestAnimationFrame(update);
      }
    };

    update();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        handleScroll
      );

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [direction, speed]);

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-4 md:gap-6 ${className}`}
      style={{
        transform: `translate3d(0, ${offset}px, 0)`,
        willChange: "transform",
      }}
    >
      {images.map((image, index) => (
        <GalleryCard
          key={`${image.src}-${index}`}
          image={image}
          index={index}
        />
      ))}
    </div>
  );
}