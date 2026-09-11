"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { getEvents, Event as ApiEvent } from "@/lib/api";

type Card = {
  id?: string;
  title: string;
  src?: string;
  dateOfEvent?: string;
  venue?: string;
  ctaText?: string;
  ctaLink?: string;
  content?: any;
  description?: string;
};

export default function ExpandableCardDemo() {
  const [active, setActive] = useState<Card | boolean | null>(null);
  const [fetched, setFetched] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getEvents()
      .then((ev) => {
        if (!mounted) return;
        setFetched(
          ev.map((e) => ({
            id: e.id,
            title: e.title,
            src: e.image ?? undefined,
            dateOfEvent: e.dateOfEvent,
            venue: e.venue,
            ctaText: "Register",
            ctaLink: `#/events/${e.id}`,
            content: () => <p>{e.description}</p>,
            description: e.description,
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setFetched(cards);
        setFetchError(null);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const displayCards = fetched.length ? fetched : cards;
  const marqueeCards = [...displayCards, ...displayCards];

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.div
              layoutId={`image-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[700px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-paper dark:bg-neutral-900 sm:rounded-3xl overflow-hidden border-2 border-ink"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={600}
                  height={360}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-64 lg:h-72 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-6">
                  <div className="max-w-[70%]">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-semibold text-ink dark:text-neutral-200 text-3xl"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p className="text-graphite mt-2">
                      {formatDateTime(active.dateOfEvent)} • {active.venue}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-6 pb-6">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-graphite text-sm md:text-base lg:text-base h-56 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <section className="mx-auto w-full px-0 py-10 sm:py-12 lg:py-16">
        {loading ? (
          <div className="max-w-5xl mx-auto py-12 text-center text-graphite">Loading events…</div>
        ) : fetchError && !fetched.length ? (
          <div className="max-w-5xl mx-auto py-12 text-center text-red-600">{fetchError}</div>
        ) : (
          <div className="relative overflow-hidden border-y-[1.5px] border-[#1f1d1a]/80 bg-[#f3efe6] py-3">
            <div className="marquee-track flex min-w-max items-stretch gap-5 px-4 sm:gap-6 sm:px-6">
              {marqueeCards.map((card, index) => {
                const hasImage = Boolean(card.src);
                const tone = [
                  "bg-[#efe6de]",
                  "bg-[#dde7ec]",
                  "bg-[#dfe9db]",
                  "bg-[#e9e5f4]",
                  "bg-[#f3e7d8]",
                ][index % 5];

                return (
                  <motion.article
                    layoutId={`card-${card.title}-${id}-${index}`}
                    key={`${card.title}-${index}`}
                    onClick={() => setActive(card)}
                    className={`group relative flex h-[400px] w-[320px] cursor-pointer flex-col overflow-hidden rounded-[26px] border-[1.5px] border-[#1f1d1a] ${tone} text-left shadow-[8px_8px_0_rgba(31,29,26,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[10px_10px_0_rgba(31,29,26,0.09)] sm:h-[430px] sm:w-[360px]`}
                  >
                    <div className="relative h-[52%] overflow-hidden border-b-[1.5px] border-[#1f1d1a] bg-[#d7d7d7]">
                      {hasImage ? (
                        <img
                          src={card.src}
                          alt={card.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.32em] text-[#4f4a42]">
                          Event
                        </div>
                      )}

                      <div className="absolute left-4 top-4 flex flex-col gap-2 text-left">
                        <div className="flex h-[72px] w-[72px] flex-col items-center justify-center rounded-[18px] border-[1.5px] border-[#1f1d1a] bg-[#edf0f5]/90 shadow-[4px_4px_0_rgba(31,29,26,0.05)] backdrop-blur-sm">
                          <span className="text-[11px] uppercase tracking-[0.22em] text-[#4f4a42]">
                            {formatDayLabel(card.dateOfEvent)}
                          </span>
                          <span className="mt-1 text-3xl font-medium leading-none tracking-[-0.06em] text-[#1f1d1a]">
                            {formatDayNumber(card.dateOfEvent)}
                          </span>
                          <span className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#4f4a42]">
                            {formatMonthLabel(card.dateOfEvent)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-[#1f1d1a] bg-[#f7f4ef]/90 text-[16px] text-[#1f1d1a] shadow-[3px_3px_0_rgba(31,29,26,0.06)]"
                        aria-label={`More details for ${card.title}`}
                      >
                        i
                      </button>
                    </div>

                    <div className="flex flex-1 flex-col justify-between px-5 py-5">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-[#4f4a42]">
                          <span className="rounded-full border border-[#1f1d1a]/70 px-2 py-1">{card.venue?.split(" ")[0] ?? "Event"}</span>
                        </div>

                        <h3 className="max-w-[220px] text-[2.2rem] leading-[0.9] tracking-[-0.07em] text-[#1f1d1a] sm:text-[2.5rem]">
                          {card.title}
                        </h3>
                      </div>

                      <div className="mt-4 space-y-3">
                        <p className="text-sm font-medium text-[#1f1d1a]">{formatTimeOnly(card.dateOfEvent)}</p>
                        <p className="text-sm leading-5 text-[#4f4a42]">{card.venue}</p>
                      </div>

                      <button
                        type="button"
                        className="mt-5 w-full rounded-[14px] border-[1.5px] border-[#1f1d1a] bg-[#1f1d1a] px-4 py-3 text-sm font-medium text-[#f6f1e8] shadow-[4px_4px_0_rgba(31,29,26,0.08)] transition hover:bg-[#2f2a27]"
                      >
                        Register Now
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <style jsx>{`
        .marquee-track {
          width: max-content;
          animation: marquee 28s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
}

function formatDateTime(iso?: string) {
  if (!iso) return "TBA";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatDayLabel(iso?: string) {
  if (!iso) return "Tue";
  try {
    return new Date(iso).toLocaleDateString(undefined, { weekday: "short" });
  } catch {
    return "Tue";
  }
}

function formatDayNumber(iso?: string) {
  if (!iso) return "21";
  try {
    return new Date(iso).getDate().toString();
  } catch {
    return "21";
  }
}

function formatMonthLabel(iso?: string) {
  if (!iso) return "Jan";
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short" });
  } catch {
    return "Jan";
  }
}

function formatTimeOnly(iso?: string) {
  if (!iso) return "TBA";
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    title: "Hilton Palm Jumeirah",
    src: "https://images.unsplash.com/photo-1505761671935-60e5b5f6f2d8?auto=format&fit=crop&w=1200&q=80",
    dateOfEvent: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    venue: "Dubai, UAE",
    ctaText: "Details",
    ctaLink: "#",
    content: () => (
      <p>
        A sunset social designed for warm conversations, scenic arrivals, and a polished first impression.
      </p>
    ),
  },
  {
    title: "Convene at 225 Liberty",
    src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    dateOfEvent: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    venue: "New York, USA",
    ctaText: "Details",
    ctaLink: "#",
    content: () => (
      <p>
        An intimate city gathering with thoughtful conversations, collaborative energy, and a beautifully hosted evening.
      </p>
    ),
  },
  {
    title: "Hotel Grand Hyatt São Paulo",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    dateOfEvent: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString(),
    venue: "São Paulo, Brazil",
    ctaText: "Details",
    ctaLink: "#",
    content: () => (
      <p>
        A warm evening of meaningful networking, city rhythms, and a room full of people who value good conversation.
      </p>
    ),
  },
  {
    title: "Open Mic Poetry Evening",
    src: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    dateOfEvent: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    venue: "Cafe Turtle, New Delhi",
    ctaText: "Details",
    ctaLink: "#",
    content: () => (
      <p>
        A mellow night of poetry, open mic performances, and slow conversation in a room built for listening.
      </p>
    ),
  },
  {
    title: "Weekend Trail Run",
    src: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1200&q=80",
    dateOfEvent: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
    venue: "Central Park, Lucknow",
    ctaText: "Details",
    ctaLink: "#",
    content: () => (
      <p>
        A mindful start to the weekend with movement, fresh air, and a post-run coffee and chat circle.
      </p>
    ),
  },
];
