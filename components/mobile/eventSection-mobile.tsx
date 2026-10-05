"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const events = [
  {
    number: "01",
    title: "Mafia Game",
    subtitle: "Silicon Valley's favorite game",
    description:
      "A social deduction game of secrets, strategy, deception and suspicion. Pick your role, find your allies, and figure out who you can trust.",
    image: "/playcards/table.png",
    bg: "bg-surface",
  },
  {
    number: "02",
    title: "Jamming Sessions",
    subtitle: "Music & people",
    description:
      "Bring an instrument, bring your voice, or simply come listen. Make music together, experiment, and see where the session takes you.",
    image: "/playcards/jamming02.png",
    bg: "bg-fog",
  },
  {
    number: "03",
    title: "Pick a Corner",
    subtitle: "Your time, your way",
    description:
      "Read, write, draw, talk, crochet, play board games, uno. Do whatever you like.",
    image: "/playcards/tablecorner.jpeg",
    bg: "bg-stone",
  },
  {
    number: "04",
    title: "Or Be A Part Of Events",
    subtitle: "Silly games & Offline events",
    description: "Check out events section to see upcoming events",
    image: "/club/all_ages.jpg", // leading slash added
    bg: "bg-[#91b2ff]",
  },
];

const spring = { type: "spring", stiffness: 220, damping: 30 } as const;

export default function MobileExpandingCards() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion ? { duration: 0 } : spring;

  return (
    // Mobile only. Keep your existing tilted row for md and up.
    <div className="flex flex-col gap-3 px-4 md:hidden py-18">
      {events.map((event, index) => {
        const isActive = index === active;
        const panelId = `event-panel-${index}`;

        return (
          <motion.div
            key={event.number}
            layout={!reduceMotion}
            transition={transition}
            className={`${event.bg} overflow-hidden rounded-2xl text-black/85`}
          >
            {/* Header: whole row is tappable */}
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-expanded={isActive}
              aria-controls={panelId}
              className="flex min-h-[64px] w-full items-center gap-3 p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-black/60 active:scale-[0.985] transition-transform"
            >
              <span className="w-7 shrink-0 text-sm tabular-nums text-black/55">
                {event.number}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-xl font-medium leading-tight">
                  {event.title}
                </span>
                {!isActive && (
                  <span className="mt-0.5 block truncate text-sm text-black/60">
                    {event.subtitle}
                  </span>
                )}
              </span>

              {/* Plus turns into a cross when open */}
              <motion.svg
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                animate={{ rotate: isActive ? 45 : 0 }}
                transition={transition}
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </motion.svg>
            </button>

            {/* Body */}
            <motion.div
              id={panelId}
              role="region"
              initial={false}
              animate={{
                height: isActive ? "auto" : 0,
                opacity: isActive ? 1 : 0,
              }}
              transition={transition}
              style={{ overflow: "hidden" }}
            >
              <div className="px-4 pb-5">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
                  {/* Swap for next/image if you prefer */}
                  <img
                    src={event.image}
                    alt={event.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-4 text-sm text-black/60">{event.subtitle}</p>
                <p className="mt-1 text-[15px] leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}