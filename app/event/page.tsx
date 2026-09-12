"use client";

import { useEffect, useState } from "react";
import ExpandableCardDemo, {
  type EventCard,
} from "../components/expandable-card-demo-standard";
import { getEvents } from "@/lib/api";

const demoCards: EventCard[] = [
  {
    id: "demo-1",
    title: "Mafia Night",
    src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    dateOfEvent: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    venue: "Tealogy, Sagar",
    ctaText: "Register",
    ctaLink: "#",
    description:
      "A social deduction evening full of bluffing, strategy, and laughter with a new group every Sunday.",
    content: () => (
      <p>
        A social deduction evening full of bluffing, strategy, and laughter with a
        new group every Sunday.
      </p>
    ),
  },
  {
    id: "demo-2",
    title: "Open Jam",
    src: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    dateOfEvent: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    venue: "Cafe Corner, Sagar",
    ctaText: "Register",
    ctaLink: "#",
    description:
      "Bring a guitar, a voice, or just your curiosity. Music, conversations, and creative energy in one room.",
    content: () => (
      <p>
        Bring a guitar, a voice, or just your curiosity. Music, conversations, and
        creative energy in one room.
      </p>
    ),
  },
  {
    id: "demo-3",
    title: "Pick a Corner",
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    dateOfEvent: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8).toISOString(),
    venue: "Library Lounge, Sagar",
    ctaText: "Register",
    ctaLink: "#",
    description:
      "Read, sketch, journal, talk, or simply exist in a space designed for calm and connection.",
    content: () => (
      <p>
        Read, sketch, journal, talk, or simply exist in a space designed for calm
        and connection.
      </p>
    ),
  },
  {
    id: "demo-4",
    title: "Coffee + Conversations",
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    dateOfEvent: new Date(Date.now() + 1000 * 60 * 60 * 24 * 11).toISOString(),
    venue: "The Common Table, Sagar",
    ctaText: "Register",
    ctaLink: "#",
    description:
      "A slow-paced meet-up for connecting with interesting people over coffee and easy conversation.",
    content: () => (
      <p>
        A slow-paced meet-up for connecting with interesting people over coffee and
        easy conversation.
      </p>
    ),
  },
  {
    id: "demo-5",
    title: "Sunday Social",
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    dateOfEvent: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
    venue: "Open Courtyard, Sagar",
    ctaText: "Register",
    ctaLink: "#",
    description:
      "A relaxed group gathering with games, conversations, and a welcoming community atmosphere.",
    content: () => (
      <p>
        A relaxed group gathering with games, conversations, and a welcoming
        community atmosphere.
      </p>
    ),
  },
];

export default function Page() {
  const [cards, setCards] = useState<EventCard[]>(demoCards);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    getEvents()
      .then((events) => {
        if (!mounted) return;
        if (events?.length) {
          setCards(
            events.map((event) => ({
              id: event.id,
              title: event.title,
              src: event.image ?? undefined,
              dateOfEvent: event.dateOfEvent,
              venue: event.venue,
              fee: "₹49/-",
              ctaText: "Register",
              ctaLink: `/register?eventId=${encodeURIComponent(event.id)}&title=${encodeURIComponent(event.title)}`,
              description: event.description,
              content: () => <p>{event.description}</p>,
            }))
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error(err);
        setCards(demoCards);
        setError(null);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="bg-paper px-4 py-12 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-graphite">
            upcoming
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-[-0.06em] sm:text-5xl">
            All events
          </h1>
        </div>

        <ExpandableCardDemo cards={cards} loading={loading} error={error} variant="grid" />
      </div>
    </main>
  );
}