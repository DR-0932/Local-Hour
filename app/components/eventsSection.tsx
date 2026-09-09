"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const events = [
  {
    number: "01",
    title: "Mafia Game",
    subtitle: "Silicon Valley's favorite game",
    description:
      "A social deduction game of secrets, strategy, deception and suspicion. Pick your role, find your allies, and figure out who you can trust.",
    image: "/events/mafia.jpg",
    bg: "bg-surface",
    rotation: "md:-rotate-2",
  },
  {
    number: "02",
    title: "Jamming Sessions",
    subtitle: "Music & people",
    description:
      "Bring an instrument, bring your voice, or simply come listen. Make music together, experiment, and see where the session takes you.",
    image: "/events/jamming.jpg",
    bg: "bg-fog",
    rotation: "md:rotate-2",
  },
  {
    number: "03",
    title: "Pick a Corner",
    subtitle: "Your time, your way",
    description:
      "Read. Draw. Write. Talk. Play a game. Find someone interesting. Do whatever you like — just remember, no phones during club hours.",
    image: "/events/corner.jpg",
    bg: "bg-stone",
    rotation: "md:-rotate-1",
  },
];

export default function EventSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="overflow-hidden bg-paper px-5 py-20 text-ink sm:px-6 md:px-12 md:py-28">

      <div className="mx-auto max-w-7xl">

        {/* Heading */}

        <div className="grid gap-7 md:grid-cols-2 md:gap-10">

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-graphite">
              [ What we do ]
            </p>

            <h2 className="mt-5 max-w-xl text-5xl font-medium leading-[0.9] tracking-[-0.05em] sm:text-6xl md:text-7xl">
              Pick your
              <br />
              experience.
            </h2>
          </div>

          <div className="flex items-end">
            <p className="max-w-md text-base leading-7 text-graphite">
              Every Sunday can look different. Play something competitive,
              make some music, or find your own corner and spend your time
              however you want.
            </p>
          </div>

        </div>


        {/* Cards */}

        <div
          className="relative mx-auto mt-12 flex max-w-[1100px] flex-col gap-5 md:mt-24 md:min-h-[600px] md:flex-row md:items-start md:justify-center md:gap-0"
          onMouseLeave={() => setHovered(null)}
        >

          {events.map((event, index) => {

            const isHovered = hovered === index;

            /*
             * How far each card moves when another card is hovered.
             */

            let translate = "translate-x-0";

            if (hovered !== null) {

              if (index < hovered) {
                translate = "md:-translate-x-16";
              }

              if (index > hovered) {
                translate = "md:translate-x-16";
              }

              if (index === hovered) {
                translate = "md:translate-y-[-20px]";
              }
            }

            return (
              <article
                key={event.title}
                onMouseEnter={() => setHovered(index)}
                className={`
                  ${event.bg}
                  ${event.rotation}
                  ${translate}

                  relative
                  w-full
                  min-h-[480px]
                  md:w-[340px]
                  md:min-h-[570px]
                  md:shrink-0

                  border-2
                  border-ink
                  p-5
                  sm:p-6

                  transition-all
                  duration-500
                  ease-[cubic-bezier(0.22,1,0.36,1)]

                  ${index !== 0 ? "md:-ml-8" : ""}

                  ${isHovered
                    ? "z-30 shadow-[14px_18px_0px_rgba(0,0,0,0.15)]"
                    : "z-10"
                  }
                `}
              >

                {/* Card header */}

                <div className="flex items-center justify-between">

                  <span className="text-sm font-medium">
                    [{event.number}]
                  </span>

                  <ArrowUpRight size={18} />

                </div>


                {/* Image */}

                <div className="mt-6 aspect-[4/3] overflow-hidden border border-ink bg-paper sm:mt-8">

                  <img
                    src={event.image}
                    alt={event.title}
                    className={`
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      ${isHovered ? "scale-105" : "scale-100"}
                    `}
                  />

                </div>


                {/* Content */}

                <div className="mt-6 sm:mt-7">

                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-graphite">
                    {event.subtitle}
                  </p>

                  <h3 className="mt-3 text-3xl font-medium leading-[0.9] tracking-[-0.04em] text-ink sm:text-4xl">
                    {event.title}
                  </h3>

                  <p className="mt-6 text-sm leading-6 text-graphite">
                    {event.description}
                  </p>

                </div>

              </article>
            );
          })}

        </div>


        {/* Bottom */}

        <div className="mt-10 flex flex-col gap-3 border-t border-ash pt-6 md:mt-8 md:flex-row md:items-center md:justify-between">

          <p className="text-sm text-graphite">
            Three ways to spend your Sunday.
          </p>

          <p className="text-sm font-medium">
            No phones during club hours.
          </p>

        </div>

      </div>

    </section>
  );
}
