"use client";

import { useState } from "react";

const initialForm = {
  title: "",
  description: "",
  dateOfEvent: "",
  venue: "",
  venueLink: "",
  numberOfParticipants: "",
  image: "",
  registrationFee: "49",
};

export default function Page() {
  const [form, setForm] = useState(initialForm);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Create event payload", form);
  };

  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 py-10 text-[#1f1d1a] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#765c9b]">
              admin panel
            </p>
            <h1 className="mt-3 text-4xl font-medium tracking-[-0.06em] sm:text-5xl">
              Event dashboard
            </h1>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-[16px] border-[1.5px] border-[#1f1d1a] bg-[#1f1d1a] px-5 py-3 text-sm font-medium text-[#f6f1e8] shadow-[4px_4px_0_rgba(31,29,26,0.08)] transition hover:bg-[#2f2a27]"
          >
            Publish event
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[22px] border-[1.5px] border-[#1f1d1a] bg-[#efe6de] p-5 shadow-[8px_8px_0_rgba(31,29,26,0.06)]">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4f4a42]">
              total events
            </p>
            <p className="mt-4 text-4xl font-medium tracking-[-0.07em]">18</p>
          </div>

          <div className="rounded-[22px] border-[1.5px] border-[#1f1d1a] bg-[#dfe9db] p-5 shadow-[8px_8px_0_rgba(31,29,26,0.06)]">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4f4a42]">
              registrations
            </p>
            <p className="mt-4 text-4xl font-medium tracking-[-0.07em]">642</p>
          </div>

          <div className="rounded-[22px] border-[1.5px] border-[#1f1d1a] bg-[#e9e5f4] p-5 shadow-[8px_8px_0_rgba(31,29,26,0.06)]">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#4f4a42]">
              fee collected
            </p>
            <p className="mt-4 text-4xl font-medium tracking-[-0.07em]">₹31,458</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border-[1.5px] border-[#1f1d1a] bg-[#fffdf9] p-6 shadow-[12px_12px_0_rgba(31,29,26,0.06)] sm:p-8"
          >
            <div className="mb-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#765c9b]">
                create event
              </p>
              <h2 className="mt-3 text-3xl font-medium tracking-[-0.06em] text-[#1f1d1a] sm:text-4xl">
                Add a new experience
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-[#1f1d1a]">
                  Event title
                </span>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Mafia Night"
                  className="w-full rounded-[16px] border-[1.5px] border-[#1f1d1a]/70 bg-[#f5f0ea] px-4 py-3 text-base text-[#1f1d1a] placeholder:text-[#4f4a42]/70 focus:border-[#1f1d1a] focus:outline-none focus:ring-2 focus:ring-[#1f1d1a]/10"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-[#1f1d1a]">
                  Description
                </span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tell people what this event is about"
                  rows={5}
                  className="w-full rounded-[16px] border-[1.5px] border-[#1f1d1a]/70 bg-[#f5f0ea] px-4 py-3 text-base text-[#1f1d1a] placeholder:text-[#4f4a42]/70 focus:border-[#1f1d1a] focus:outline-none focus:ring-2 focus:ring-[#1f1d1a]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#1f1d1a]">
                  Date & time
                </span>
                <input
                  type="datetime-local"
                  name="dateOfEvent"
                  value={form.dateOfEvent}
                  onChange={handleChange}
                  className="w-full rounded-[16px] border-[1.5px] border-[#1f1d1a]/70 bg-[#f5f0ea] px-4 py-3 text-base text-[#1f1d1a] focus:border-[#1f1d1a] focus:outline-none focus:ring-2 focus:ring-[#1f1d1a]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#1f1d1a]">
                  Venue
                </span>
                <input
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  placeholder="Tealogy, Sagar"
                  className="w-full rounded-[16px] border-[1.5px] border-[#1f1d1a]/70 bg-[#f5f0ea] px-4 py-3 text-base text-[#1f1d1a] placeholder:text-[#4f4a42]/70 focus:border-[#1f1d1a] focus:outline-none focus:ring-2 focus:ring-[#1f1d1a]/10"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-[#1f1d1a]">
                  Venue link
                </span>
                <input
                  name="venueLink"
                  value={form.venueLink}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/..."
                  className="w-full rounded-[16px] border-[1.5px] border-[#1f1d1a]/70 bg-[#f5f0ea] px-4 py-3 text-base text-[#1f1d1a] placeholder:text-[#4f4a42]/70 focus:border-[#1f1d1a] focus:outline-none focus:ring-2 focus:ring-[#1f1d1a]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#1f1d1a]">
                  Capacity
                </span>
                <input
                  type="number"
                  name="numberOfParticipants"
                  value={form.numberOfParticipants}
                  onChange={handleChange}
                  placeholder="60"
                  className="w-full rounded-[16px] border-[1.5px] border-[#1f1d1a]/70 bg-[#f5f0ea] px-4 py-3 text-base text-[#1f1d1a] placeholder:text-[#4f4a42]/70 focus:border-[#1f1d1a] focus:outline-none focus:ring-2 focus:ring-[#1f1d1a]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#1f1d1a]">
                  Registration fee
                </span>
                <input
                  type="number"
                  name="registrationFee"
                  value={form.registrationFee}
                  onChange={handleChange}
                  placeholder="49"
                  className="w-full rounded-[16px] border-[1.5px] border-[#1f1d1a]/70 bg-[#f5f0ea] px-4 py-3 text-base text-[#1f1d1a] placeholder:text-[#4f4a42]/70 focus:border-[#1f1d1a] focus:outline-none focus:ring-2 focus:ring-[#1f1d1a]/10"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-[#1f1d1a]">
                  Event image URL
                </span>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-[16px] border-[1.5px] border-[#1f1d1a]/70 bg-[#f5f0ea] px-4 py-3 text-base text-[#1f1d1a] placeholder:text-[#4f4a42]/70 focus:border-[#1f1d1a] focus:outline-none focus:ring-2 focus:ring-[#1f1d1a]/10"
                />
              </label>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-[16px] border-[1.5px] border-[#1f1d1a] bg-transparent px-5 py-3 text-sm font-medium text-[#1f1d1a] transition hover:bg-[#f1ece7]"
              >
                Save draft
              </button>

              <button
                type="submit"
                className="rounded-[16px] border-[1.5px] border-[#1f1d1a] bg-[#1f1d1a] px-5 py-3 text-sm font-medium text-[#f6f1e8] shadow-[4px_4px_0_rgba(31,29,26,0.08)] transition hover:bg-[#2f2a27]"
              >
                Create event
              </button>
            </div>
          </form>

          <aside className="space-y-5">
            <div className="rounded-[28px] border-[1.5px] border-[#1f1d1a] bg-[#efe6de] p-6 shadow-[10px_10px_0_rgba(31,29,26,0.06)]">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#4f4a42]">
                quick actions
              </p>
              <div className="mt-5 space-y-3">
                {[
                  "Create event",
                  "Delete event",
                  "Reschedule event",
                  "Hide event",
                ].map((action) => (
                  <button
                    key={action}
                    type="button"
                    className="flex w-full items-center justify-between rounded-[16px] border-[1.5px] border-[#1f1d1a] bg-[#f8f5f1] px-4 py-3 text-left text-sm font-medium text-[#1f1d1a] transition hover:bg-[#f1ece7]"
                  >
                    <span>{action}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border-[1.5px] border-[#1f1d1a] bg-[#dfe9db] p-6 shadow-[10px_10px_0_rgba(31,29,26,0.06)]">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#4f4a42]">
                recent activity
              </p>
              <ul className="mt-5 space-y-3 text-sm text-[#1f1d1a]">
                <li className="rounded-[14px] border border-[#1f1d1a]/50 bg-[#f7f4ef] px-3 py-2">
                  Friday social updated
                </li>
                <li className="rounded-[14px] border border-[#1f1d1a]/50 bg-[#f7f4ef] px-3 py-2">
                  12 new registrations today
                </li>
                <li className="rounded-[14px] border border-[#1f1d1a]/50 bg-[#f7f4ef] px-3 py-2">
                  Open Jam moved to 7:30 PM
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}