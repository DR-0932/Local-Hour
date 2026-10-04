"use client";

import ExpandableCardDemo, {
  EventCard,
} from "@/components/landingPage/expandable-card-demo-standard";

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


type EventData = {
  id: string;
  title: string;
  description: string;
  image: string;
  venue: string;
  startTime: string; // ISO string from the cache
  registrationFee:number
};

export default function EventsClient({ events }: { events: EventData[] }) {
  const cards: EventCard[] = events.length
    ? events.map((event) => ({
        id: event.id,
        title: event.title,
        src: event.image,
        dateOfEvent: event.startTime,
        venue: event.venue,
        fee: event.registrationFee > 0 ? `₹${event.registrationFee}/-` : "Free",
        ctaText: "Register",
        ctaLink: `/register?eventId=${encodeURIComponent(event.id)}&title=${encodeURIComponent(event.title)}`,
        description: event.description,
        content: () => <p>{event.description}</p>,
      }))
    : demoCards;

  return (
    <ExpandableCardDemo
      cards={cards}
      loading={false}
      error={null}
      variant="grid"
    />
  );
}