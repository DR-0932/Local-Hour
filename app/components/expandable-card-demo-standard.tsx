"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";

export type EventCard = {
  id?: string;
  title: string;
  src?: string;
  dateOfEvent?: string;
  venue?: string;
  fee?: string;
  ctaText?: string;
  ctaLink?: string;
  description?: string;
  content?: React.ReactNode | (() => React.ReactNode);
};

type ExpandableCardDemoProps = {
  cards: EventCard[];
  loading?: boolean;
  error?: string | null;
  variant?: "marquee" | "grid";
};

export default function ExpandableCardDemo({
  cards,
  loading = false,
  error = null,
  variant = "marquee",
}: ExpandableCardDemoProps) {
  const [active, setActive] = useState<EventCard | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleRegister = (card: EventCard) => {
    if (!card.ctaLink) return;

    if (typeof window !== "undefined") {
      window.location.assign(card.ctaLink);
      return;
    }

    router.push(card.ctaLink);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
      }
    };

    document.body.style.overflow = active ? "hidden" : "auto";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const displayCards = cards.length ? cards : [];

  return (
    <>
      <AnimatePresence>
        {active ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10 h-full w-full bg-black/20"
            />

            <div className="fixed inset-0 z-[100] grid place-items-center">
              <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex h-full w-full max-w-[700px] flex-col overflow-hidden border-2 border-ink bg-paper sm:rounded-3xl md:h-fit md:max-h-[90%]"
              >
                {active.src ? (
                  <img
                    width={600}
                    height={360}
                    src={active.src}
                    alt={active.title}
                    className="h-64 w-full object-cover object-top lg:h-72"
                  />
                ) : (
                  <div className="flex h-64 w-full items-center justify-center bg-[#e9e5f4] text-xs uppercase tracking-[0.28em] text-[#4f4a42] lg:h-72">
                    Event Preview
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="max-w-[70%]">
                      <h3 className="text-3xl font-semibold text-ink">{active.title}</h3>
                      <p className="mt-2 text-graphite">
                        {formatDateTime(active.dateOfEvent)} • {active.venue}
                      </p>
                    </div>

                    <a
                      href={active.ctaLink ?? "#"}
                      target="_blank"
                      className="rounded-full bg-green-500 px-4 py-3 text-sm font-bold text-white"
                    >
                      {active.ctaText ?? "Details"}
                    </a>
                  </div>

                  <div className="relative mt-5 overflow-auto pb-6 text-sm text-graphite md:text-base [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]">
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content ?? (
                          <p>{active.description ?? "More details coming soon."}</p>
                        )}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        ) : null}
      </AnimatePresence>

      <section className="mx-auto w-full px-0 py-10 sm:py-12 lg:py-16">
        {loading ? (
          <div className="mx-auto max-w-5xl py-12 text-center text-graphite">
            Loading events…
          </div>
        ) : error && !displayCards.length ? (
          <div className="mx-auto max-w-5xl py-12 text-center text-red-600">
            {error}
          </div>
        ) : variant === "grid" ? (
          <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-0">
            {displayCards.map((card, index) => {
              const titleKey = card.id ?? `${card.title}-${index}`;
              const tone = [
                "bg-[#efe6de]",
                "bg-[#dde7ec]",
                "bg-[#dfe9db]",
                "bg-[#e9e5f4]",
                "bg-[#f3e7d8]",
              ][index % 5];

              return (
                <motion.article
                  key={titleKey}
                  onClick={() => setActive(card)}
                  whileHover={{ y: -4 }}
                  className={`group relative flex h-[430px] w-full cursor-pointer flex-col overflow-hidden rounded-[26px] border-[1.5px] border-[#1f1d1a] ${tone} text-left shadow-[8px_8px_0_rgba(31,29,26,0.06)] transition-all duration-300 hover:shadow-[10px_10px_0_rgba(31,29,26,0.09)]`}
                >
                  <div className="relative h-[52%] overflow-hidden border-b-[1.5px] border-[#1f1d1a] bg-[#d7d7d7]">
                    {card.src ? (
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
                        <span className="rounded-full border border-[#1f1d1a]/70 px-2 py-1">
                          {card.venue?.split(" ")[0] ?? "Event"}
                        </span>
                      </div>

                      <h3 className="max-w-[220px] text-[2.2rem] leading-[0.9] tracking-[-0.07em] text-[#1f1d1a] sm:text-[2.5rem]">
                        {card.title}
                      </h3>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-[#1f1d1a]">
                          {formatTimeOnly(card.dateOfEvent)}
                        </p>
                        <span className="rounded-full border border-[#1f1d1a] bg-[#f7f4ef] px-2 py-1 text-[11px] font-medium text-[#1f1d1a]">
                          {card.fee ?? "₹49/-"}
                        </span>
                      </div>
                      <p className="text-sm leading-5 text-[#4f4a42]">{card.venue}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRegister(card);
                      }}
                      className="mt-5 w-full rounded-[14px] border-[1.5px] border-[#1f1d1a] bg-[#1f1d1a] px-4 py-3 text-sm font-medium text-[#f6f1e8] shadow-[4px_4px_0_rgba(31,29,26,0.08)] transition hover:bg-[#2f2a27]"
                    >
                      Register Now
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="relative overflow-hidden border-y-[1.5px] border-[#1f1d1a]/80 bg-[#f3efe6] py-3">
            <div className="marquee-track flex min-w-max items-stretch gap-5 px-4 sm:gap-6 sm:px-6">
              {displayCards.map((card, index) => {
                const titleKey = card.id ?? `${card.title}-${index}`;
                const tone = [
                  "bg-[#efe6de]",
                  "bg-[#dde7ec]",
                  "bg-[#dfe9db]",
                  "bg-[#e9e5f4]",
                  "bg-[#f3e7d8]",
                ][index % 5];

                return (
                  <motion.article
                    key={titleKey}
                    onClick={() => setActive(card)}
                    whileHover={{ y: -4 }}
                    className={`group relative flex h-[400px] w-[320px] cursor-pointer flex-col overflow-hidden rounded-[26px] border-[1.5px] border-[#1f1d1a] ${tone} text-left shadow-[8px_8px_0_rgba(31,29,26,0.06)] transition-all duration-300 hover:shadow-[10px_10px_0_rgba(31,29,26,0.09)] sm:h-[430px] sm:w-[360px]`}
                  >
                    <div className="relative h-[52%] overflow-hidden border-b-[1.5px] border-[#1f1d1a] bg-[#d7d7d7]">
                      {card.src ? (
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
                          <span className="rounded-full border border-[#1f1d1a]/70 px-2 py-1">
                            {card.venue?.split(" ")[0] ?? "Event"}
                          </span>
                        </div>

                        <h3 className="max-w-[220px] text-[2.2rem] leading-[0.9] tracking-[-0.07em] text-[#1f1d1a] sm:text-[2.5rem]">
                          {card.title}
                        </h3>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-[#1f1d1a]">
                            {formatTimeOnly(card.dateOfEvent)}
                          </p>
                          <span className="rounded-full border border-[#1f1d1a] bg-[#f7f4ef] px-2 py-1 text-[16px] font-medium text-[#1f1d1a]">
                            {card.fee ?? "₹49/-"}
                          </span>
                        </div>
                        <p className="text-sm leading-5 text-[#4f4a42]">{card.venue}</p>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRegister(card);
                        }}
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
    return new Date(iso).toLocaleString(undefined, {
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
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
