import Image from "next/image";
import type { GalleryImage } from "./galleryData";

interface GalleryCardProps {
  image: GalleryImage;
  index: number;
}

export default function GalleryCard({
  image,
  index,
}: GalleryCardProps) {
  return (
    <article
      className="
        group relative
        h-[42vh] min-h-[280px]
        overflow-hidden rounded-2xl
        bg-black
        md:h-[58vh]
      "
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={index < 4}
        sizes="(max-width: 768px) 50vw, 25vw"
        className="
          object-cover
          scale-[1.08]
          transition-transform
          duration-[1200ms]
          ease-[cubic-bezier(.16,1,.3,1)]
          group-hover:scale-[1.18]
        "
      />

      {/* Cinematic overlay */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-black/60
          via-black/5
          to-transparent
        "
      />

      {/* Image number */}
      <span
        className="
          absolute left-4 top-4
          text-[10px]
          font-medium
          tracking-[0.25em]
          text-white/70
        "
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Card information */}
      <div
        className="
          absolute bottom-5 left-5 right-5
          translate-y-4
          opacity-0
          transition-all
          duration-500
          group-hover:translate-y-0
          group-hover:opacity-100
        "
      >
        <p
          className="
            text-[9px]
            uppercase
            tracking-[0.25em]
            text-white/60
          "
        >
          LocalHour
        </p>

        <h3 className="mt-1 text-sm font-medium text-white">
          {image.label ?? image.alt}
        </h3>
      </div>

      {/* Hover border */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          rounded-2xl
          border border-white/0
          transition-colors
          duration-500
          group-hover:border-white/30
        "
      />
    </article>
  );
}