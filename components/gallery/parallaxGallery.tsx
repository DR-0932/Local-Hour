"use client";

import GalleryColumn from "@/ui/gallery/galleryColumns";
import { galleryImages } from "@/ui/gallery/galleryData";

const COLUMN_COUNT = 4;

function distributeImages() {
  return Array.from(
    { length: COLUMN_COUNT },
    (_, columnIndex) =>
      galleryImages.filter(
        (_, imageIndex) =>
          imageIndex % COLUMN_COUNT === columnIndex
      )
  );
}

export default function ParallaxGallery() {
  const columns = distributeImages();

  return (
    <section className="relative overflow-hidden bg-paper text-ink">

      {/* =========================
          HERO
      ========================= */}

      <div
        className="
          relative z-20
          flex min-h-[72vh]
          items-center
          px-5 pt-24
          md:px-12
        "
      >
        <div className="mx-auto w-full max-w-7xl">

          {/* Eyebrow */}

          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-ink" />

            <span
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-graphite
              "
            >
              LocalHour / Gallery
            </span>
          </div>

          {/* Heading */}

          <h2
            className="
              max-w-6xl
              text-[clamp(4rem,10vw,10rem)]
              font-medium
              leading-[0.78]
              tracking-[-0.07em]
            "
          >
            Moments

            <br />

            <span className="ml-[8vw] italic">
              from Sunday.
            </span>
          </h2>

          {/* Description */}

          <div className="mt-10 flex items-end justify-between">

            <p
              className="
                max-w-xs
                text-sm
                leading-relaxed
                text-graphite
              "
            >
              No phones. No rush.
              <br />
              Just people doing things together.
            </p>

            <div className="hidden text-right md:block">
              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-graphite
                "
              >
                Scroll to explore
              </p>

              <div
                className="
                  mx-auto
                  mt-3
                  h-10
                  w-px
                  bg-ink/30
                "
              />
            </div>

          </div>
        </div>
      </div>

      {/* =========================
          PARALLAX GALLERY
      ========================= */}

      <div
        className="
    relative z-10
    px-3
    pb-40
    pt-18
    sm:px-5
    md:px-8
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-[1800px]
            grid-cols-2
            gap-3
            md:grid-cols-4
            md:gap-5
          "
        >

          {/* Column 1 */}

          <GalleryColumn
            images={columns[0]}
            direction="up"
            speed={0.8}
          />

          {/* Column 2 */}

          <GalleryColumn
            images={columns[1]}
            direction="down"
            speed={1}
            className="pt-[15vh]"
          />

          {/* Column 3 */}

          <GalleryColumn
            images={columns[2]}
            direction="up"
            speed={1.15}
            className="hidden md:flex"
          />

          {/* Column 4 */}

          <GalleryColumn
            images={columns[3]}
            direction="down"
            speed={0.9}
            className="hidden pt-[22vh] md:flex"
          />

        </div>
      </div>

      {/* =========================
          ENDING
      ========================= */}

      <div
        className="
          flex min-h-[70vh]
          items-center
          justify-center
          px-6
          py-32
        "
      >
        <div className="text-center">

          <p
            className="
              mb-6
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-graphite
            "
          >
            Every Sunday
          </p>

          <h3
            className="
              text-[clamp(3rem,7vw,7rem)]
              font-medium
              leading-[0.85]
              tracking-[-0.06em]
            "
          >
            Come for the game.

            <br />

            <span className="italic">
              Stay for the people.
            </span>
          </h3>

        </div>
      </div>

    </section>
  );
}