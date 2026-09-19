"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteEvent, getEvents, type Event } from "@/lib/api";

export default function EventsPanel() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEvents();
      setEvents(data);
      if (data.length > 0) {
        setSelectedEventId(data[0].id);
      } else {
        setSelectedEventId(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? events[0] ?? null,
    [events, selectedEventId]
  );

  const handleDelete = async () => {
    if (!selectedEvent) return;

    const confirmed = window.confirm(`Delete "${selectedEvent.title}"?`);
    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteEvent(selectedEvent.id);
      const remaining = events.filter((event) => event.id !== selectedEvent.id);
      setEvents(remaining);
      setSelectedEventId(remaining[0]?.id ?? null);
    } catch (err: any) {
      setError(err.message || "Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[26px] border border-[#e5e7eb] bg-[#f8fafc] p-6 text-[#374151] shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        Loading events...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[26px] border border-[#fca5a5] bg-[#fff1f2] p-6 text-[#991b1b] shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        {error}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="rounded-[26px] border border-[#e5e7eb] bg-[#f8fafc] p-6 text-[#374151] shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        No events found.
      </div>
    );
  }

  return (
    <section className="w-full rounded-[26px] border border-[#e5e7eb] bg-[#f8fafc] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">
      <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-[#dfe3e8] pb-4">
        {events.map((event) => {
          const active = event.id === selectedEvent?.id;

          return (
            <button
              key={event.id}
              type="button"
              onClick={() => setSelectedEventId(event.id)}
              className={[
                "rounded-xl border px-5 py-2.5 text-lg font-semibold tracking-[-0.04em] transition-all duration-200 ease-out",
                active
                  ? "border-[#2563eb] bg-[#2563eb] text-white shadow-[0_10px_24px_rgba(37,99,235,0.25)]"
                  : "border-[#dfe3e8] bg-white text-[#374151] hover:border-[#93c5fd] hover:bg-[#f8fbff] hover:text-[#111827]",
              ].join(" ")}
            >
              {event.title}
            </button>
          );
        })}
      </div>

      {selectedEvent && (
        <div className="rounded-[18px] border border-[#e5e7eb] bg-white px-4 py-4 shadow-sm md:px-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-semibold tracking-[-0.05em] text-[#111827]">{selectedEvent.title}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full border border-[#dfe3e8] bg-[#f8fafc] px-3 py-1.5 text-sm font-medium text-[#374151]">
                Registrations: {selectedEvent.registrationCount ?? 0}
              </div>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl border border-[#fca5a5] bg-[#fff1f2] px-3 py-2 text-sm font-medium text-[#b91c1c] transition hover:bg-[#fee2e2] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-[#f9fafb]">
            <div className="grid grid-cols-[1.2fr_1.2fr_1.5fr_1fr] gap-0 border-b border-[#e5e7eb] bg-[#f3f4f6] text-sm font-medium text-[#374151]">
              <div className="px-4 py-3">Name</div>
              <div className="px-4 py-3">Contact</div>
              <div className="px-4 py-3">Email</div>
              <div className="px-4 py-3">Payment</div>
            </div>

            <div className="min-h-[380px] bg-white" />
          </div>
        </div>
      )}
    </section>
  );
}