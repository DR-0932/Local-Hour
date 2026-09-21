"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const events = [
  {
    number: "01",
    title: "Mafia Game",
    subtitle: "Silicon Valley's favorite game",
    description:
      "A social deduction game of secrets, strategy, deception and suspicion. Pick your role, find your allies, and figure out who you can trust.",
    image: "/playcards/table.png",
    bg: "bg-surface",
    rotation: "md:-rotate-2",
  },
  {
    number: "02",
    title: "Jamming Sessions",
    subtitle: "Music & people",
    description:
      "Bring an instrument, bring your voice, or simply come listen. Make music together, experiment, and see where the session takes you.",
    image: "/playcards/jamming02.png",
    bg: "bg-fog",
    rotation: "md:rotate-2",
  },
  {
    number: "03",
    title: "Pick a Corner",
    subtitle: "Your time, your way",
    description:
      "Read, write, draw, talk, crochet, play board games, uno. Do whatever you like.",
    image: "/playcards/tablecorner.jpeg",
    bg: "bg-stone",
    rotation: "md:-rotate-1",
  },
];

export default function EventSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const heading = gsap.utils.toArray<HTMLElement>(".heading-line");
    const copy = gsap.utils.toArray<HTMLElement>(".copy-line");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 90%",
        end: "bottom 20%",
        scrub: 0.8,
      },
    });

    tl.fromTo(
      copy,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      }
    ).fromTo(
      heading,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      },
      0.15
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="overflow-hidden bg-neutral-900 rounded-t-[50px] px-5 py-20 text-white sm:px-6 md:px-12 md:py-28">

      <div className="mx-auto max-w-7xl">

        {/* Heading */}

        <div className="grid gap-7 md:grid-cols-2 md:gap-10">
          <div>
            <h2 className="heading-line mt-5 max-w-xl text-5xl font-medium leading-[0.9] tracking-[-0.05em] sm:text-6xl md:text-7xl">
              Pick your
              <br />
              experience.
            </h2>
          </div>
          <div className="flex items-end">
            <p className="copy-line max-w-md text-base leading-7 text-[#df88f2]">
              Every Sunday can look different. Play something cool, sing some songs, or pick a hobby to spend your time however you want.
            </p>
          </div>
            {/* <p className="text-xs font-medium uppercase tracking-[0.2em] text-graphite">
              [ What we do ]
            </p> */}
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
                
                key={event.title}
                onMouseEnter={() => setHovered(index)}
                className={`${event.bg} ${event.rotation} ${translate} relative w-full min-h-[480px] md:w-[340px] md:min-h-[570px] md:shrink-0
                  border-2 border-ink p-5 sm:p-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                  ${index !== 0 ? "md:-ml-8" : ""}
                  ${isHovered
                    ? "z-30 shadow-[14px_18px_0px_rgba(0,0,0,0.15)]"
                    : "z-10"
                  }
                `}
              >
                  {/* Card header */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-black">
                      [{event.number}]
                    </span>
                    <ArrowUpRight size={18} color="#d9668c" />

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
                    <p className="mt-6 text-sm leading-6 text-ink"> 
                      {event.description}
                    </p>

                  </div>

              </article>
            );
          })}

        </div>


        {/* Bottom */}

        <div className="mt-10 flex flex-col gap-3 border-t border-ash pt-6 md:mt-8 md:flex-row md:items-center md:justify-between">

          {/* <p className="text-sm text-graphite">
            Three ways to spend your Sunday.
          </p> */}

          <p className="text-2xl font-medium">
            No phones during club hours.
          </p>

        </div>

      </div>

    </section>
  );
}
