"use client";
import { ArrowUpRight } from "lucide-react";

interface EventCardProps {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  bg: string;
  rotation: string;
  index: number;
  hovered: number | null;
  onHover: (index: number) => void;
}

export default function LandingPageEventCard({
  number,
  title,
  subtitle,
  description,
  image,
  bg,
  rotation,
  index,
  hovered,
  onHover,
}: EventCardProps) {
  const isHovered = hovered === index;

  let translate = "translate-x-0 translate-y-0";

  if (hovered !== null) {
    if (index < hovered) {
      translate = "md:-translate-x-16 md:translate-y-4";
    }
    if (index > hovered) {
      translate = "md:translate-x-16 md:translate-y-4";
    }
    if (index === hovered) {
      translate = "md:-translate-y-12";
    }
  }

  return (
    <article
      onMouseEnter={() => onHover(index)}
      className={`${bg} ${rotation} ${translate} relative w-full min-h-[480px] md:w-[340px] md:min-h-[570px] md:shrink-0
        border-2 border-ink p-5 sm:p-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${index !== 0 ? "md:-ml-8" : ""}
        ${isHovered ? "z-30 shadow-[14px_18px_0px_rgba(0,0,0,0.15)]" : "z-10"}
      `}
    >
      {/* Card header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-black">[{number}]</span>
        <ArrowUpRight size={18} color="#d9668c" />
      </div>

      {/* Image */}
      <div className="mt-6 aspect-[4/3] overflow-hidden border border-ink bg-paper sm:mt-8">
        <img
          src={image}
          alt={title}
          className={`h-full w-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
        />
      </div>

      {/* Content */}
      <div className="mt-6 sm:mt-7">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-graphite">
          {subtitle}
        </p>
        <h3 className="mt-3 text-3xl font-medium leading-[0.9] tracking-[-0.04em] text-ink sm:text-4xl">
          {title}
        </h3>
        <p className="mt-6 text-sm leading-6 text-ink">{description}</p>
      </div>
    </article>
  );
}