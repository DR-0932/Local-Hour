"use client";

import { useEffect, useMemo, useState } from "react";
import { getEvents } from "@/lib/api";
import ExpandableCardDemo, {
  type EventCard,
} from "./expandable-card-demo-standard";

const fallbackCards: EventCard[] = [
  {
    id: "fallback-1",
    title: "Hilton Palm Jumeirah",
    src: "https://images.unsplash.com/photo-1505761671935-60e5b5f6f2d8?auto=format&fit=crop&w=1200&q=80",
    dateOfEvent: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    venue: "Dubai, UAE",
    fee: "₹49/-",
    ctaText: "Register",
    ctaLink: "/register?eventId=fallback-1&title=Hilton%20Palm%20Jumeirah",
    description:
      "A sunset social designed for warm conversations, scenic arrivals, and a polished first impression.",
    content: () => (
      <p>
        A sunset social designed for warm conversations, scenic arrivals, and a
        polished first impression.
      </p>
    ),
  },
  {
    id: "fallback-2",
    title: "Convene at 225 Liberty",
    src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    dateOfEvent: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    venue: "New York, USA",
    fee: "₹49/-",
    ctaText: "Register",
    ctaLink: "/register?eventId=fallback-2&title=Convene%20at%20225%20Liberty",
    description:
      "An intimate city gathering with thoughtful conversations, collaborative energy, and a beautifully hosted evening.",
    content: () => (
      <p>
        An intimate city gathering with thoughtful conversations, collaborative
        energy, and a beautifully hosted evening.
      </p>
    ),
  },
  {
    title: "Hotel Grand Hyatt São Paulo",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    dateOfEvent: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString(),
    venue: "São Paulo, Brazil",
    fee: "₹49/-",
    ctaText: "Register",
    ctaLink: "/register?eventId=fallback-3&title=Hotel%20Grand%20Hyatt%20S%C3%A3o%20Paulo",
    description:
      "A warm evening of meaningful networking, city rhythms, and a room full of people who value good conversation.",
    content: () => (
      <p>
        A warm evening of meaningful networking, city rhythms, and a room full of
        people who value good conversation.
      </p>
    ),
  },
  {
    id: "fallback-4",
    title: "Open Mic Poetry Evening",
    src: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    dateOfEvent: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    venue: "Cafe Turtle, New Delhi",
    fee: "₹49/-",
    ctaText: "Register",
    ctaLink: "/register?eventId=fallback-4&title=Open%20Mic%20Poetry%20Evening",
    description:
      "A mellow night of poetry, open mic performances, and slow conversation in a room built for listening.",
    content: () => (
      <p>
        A mellow night of poetry, open mic performances, and slow conversation in
        a room built for listening.
      </p>
    ),
  },
  {
    id: "fallback-5",
    title: "Weekend Trail Run",
    src: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1200&q=80",
    dateOfEvent: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
    venue: "Central Park, Lucknow",
    fee: "₹49/-",
    ctaText: "Register",
    ctaLink: "/register?eventId=fallback-5&title=Weekend%20Trail%20Run",
    description:
      "A mindful start to the weekend with movement, fresh air, and a post-run coffee and chat circle.",
    content: () => (
      <p>
        A mindful start to the weekend with movement, fresh air, and a post-run
        coffee and chat circle.
      </p>
    ),
  },
];

function mapApiEventToCard(event: Awaited<ReturnType<typeof getEvents>>[number]): EventCard {
  return {
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
  };
}

export default function UpcomingEventSection() {
  const [cards, setCards] = useState<EventCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setFetchError(null);

    getEvents()
      .then((events) => {
        if (!mounted) return;
        setCards(events.map(mapApiEventToCard));
        setLoading(false);
      })
      .catch((error) => {
        if (!mounted) return;
        console.error(error);
        setCards(fallbackCards);
        setFetchError(null);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const marqueeCards = useMemo(() => (cards.length ? [...cards, ...cards] : []), [cards]);

  return (
    <section className="overflow-hidden bg-paper text-ink">
      <ExpandableCardDemo
        cards={marqueeCards}
        loading={loading}
        error={fetchError}
      />
    </section>
  );
}
