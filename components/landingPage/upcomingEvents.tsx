"use client";

import { useState, useRef } from "react";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

interface UpcomingEvent {
  date: string;
  day: string;
  month: string;
  title: string;
  location: string;
  time: string;
  tag: string;
  status: "open" | "few-left" | "sold-out";
}

const upcomingEvents: UpcomingEvent[] = [
  {
    date: "12",
    day: "Sun",
    month: "Oct",
    title: "Mafia Night",
    location: "The Loft, Koramangala",
    time: "6:00 PM – 9:00 PM",
    tag: "Social Deduction",
    status: "open",
  },
  {
    date: "19",
    day: "Sun",
    month: "Oct",
    title: "Jamming Session",
    location: "The Loft, Koramangala",
    time: "5:00 PM – 8:00 PM",
    tag: "Music",
    status: "few-left",
  },
  {
    date: "26",
    day: "Sun",
    month: "Oct",
    title: "Board Games & Chill",
    location: "The Loft, Koramangala",
    time: "4:00 PM – 9:00 PM",
    tag: "Pick a Corner",
    status: "open",
  },
];

const statusLabel: Record<UpcomingEvent["status"], string> = {
  open: "Spots open",
  "few-left": "Few spots left",
  "sold-out": "Sold out",
};

const statusColor: Record<UpcomingEvent["status"], string> = {
  open: "text-emerald-700",
  "few-left": "text-amber-700",
  "sold-out": "text-red-700",
};

export default function UpcomingEvents() {
  const [hovered, setHovered] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>(".event-row");
      const heading = gsap.utils.toArray<HTMLElement>(".upcoming-heading");

      gsap.fromTo(
        heading,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        rows,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-red-50 px-5 py-20 text-ink sm:px-6 md:px-12 md:py-28"
    >
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div className="upcoming-heading flex flex-col gap-4 border-b border-ash pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-graphite">
              [ What's next ]
            </p>
            <h2 className="mt-3 text-5xl font-medium leading-[0.9] tracking-[-0.05em] sm:text-6xl">
              Upcoming events.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-graphite">
            Reserve your spot before the room fills up. New Sundays are added every week.
          </p>
        </div>

        {/* Event rows */}
        <div className="mt-4 flex flex-col divide-y divide-ash">
          {upcomingEvents.map((event, index) => {
            const isHovered = hovered === index;
            const isSoldOut = event.status === "sold-out";

            return (
              <div
                key={`${event.title}-${event.date}`}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                className={`event-row group flex flex-col gap-4 border-2 border-transparent py-6 transition-all duration-300 sm:flex-row sm:items-center sm:gap-8 sm:px-4 ${
                  isHovered ? "border-ink bg-surface -translate-y-1 shadow-[6px_8px_0px_rgba(0,0,0,0.12)]" : ""
                }`}
              >
                {/* Date block */}
                <div className="flex w-20 shrink-0 flex-col items-center justify-center border border-ink bg-fog py-3">
                  <span className="text-2xl font-medium leading-none tracking-[-0.03em]">
                    {event.date}
                  </span>
                  <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-graphite">
                    {event.month}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-graphite">
                    {event.tag} · {event.day}
                  </p>
                  <h3 className="mt-1 text-2xl font-medium leading-[0.95] tracking-[-0.03em] sm:text-3xl">
                    {event.title}
                  </h3>

                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-graphite">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {event.location}
                    </span>
                  </div>
                </div>

                {/* Status + CTA */}
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-2">
                  <span className={`text-xs font-medium ${statusColor[event.status]}`}>
                    {statusLabel[event.status]}
                  </span>
                  <button
                    disabled={isSoldOut}
                    className={`flex items-center gap-1 border border-ink px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      isSoldOut
                        ? "cursor-not-allowed opacity-40"
                        : "hover:bg-ink hover:text-paper"
                    }`}
                  >
                    {isSoldOut ? "Sold out" : "Reserve"}
                    {!isSoldOut && <ArrowUpRight size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}