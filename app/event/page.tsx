import { getUpcomingEvents } from "@/lib/data";
import Navbar from "@/ui/navbar";
import EventsClient from "./EventsClient";

export default async function Page() {
  const events = await getUpcomingEvents();

  return (
    <>
      <main className="bg-paper px-4 py-24 h-screen text-ink sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-graphite">
              upcoming
            </p>
            <h1 className="mt-3 text-4xl font-medium tracking-[-0.06em] sm:text-5xl">
              All events
            </h1>
          </div>

          <EventsClient events={events} />
        </div>
      </main>
    </>
  );
}