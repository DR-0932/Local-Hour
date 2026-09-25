"use client";

import { useRef, useState } from "react";
import { createEvent } from "@/lib/api"; // adjust path to where createEvent lives

const DEFAULTS = {
  venue: "Tealogy Makronia",
  venueLink: "https://maps.app.goo.gl/HD8t5YLFozFus5EK8",
  slots: "25",
  registrationFee: "0",
};

type Errors = Partial<Record<string, string>>;

// dd/mm/yy -> { y, m, d } or null
function parseDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return null;
  const d = Number(match[1]);
  const m = Number(match[2]);
  const y = 2000 + Number(match[3]);
  const check = new Date(y, m - 1, d);
  if (
    check.getFullYear() !== y ||
    check.getMonth() !== m - 1 ||
    check.getDate() !== d
  ) {
    return null;
  }
  return { y, m, d };
}

// Auto-insert slashes while typing: 240926 -> 24/09/26
function maskDate(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 6);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 6)];
  return parts.filter(Boolean).join("/");
}

// dd/mm/yy -> yyyy-mm-dd (for the native calendar)
function toIsoDate(value: string) {
  const p = parseDate(value);
  if (!p) return "";
  return `${p.y}-${String(p.m).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
}

// yyyy-mm-dd -> dd/mm/yy
function fromIsoDate(iso: string) {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}/${m}/${y.slice(2)}`;
}

function toDateTime(date: { y: number; m: number; d: number }, time: string) {
  const [hh, mm] = time.split(":").map(Number);
  return new Date(date.y, date.m - 1, date.d, hh, mm);
}

const inputClass =
  "w-full rounded-xl border border-[#dfe3e8] bg-[#f9fafb] px-4 py-3 text-base text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20";
const labelClass = "mb-2 block text-sm font-medium text-[#374151]";
const errorClass = "mt-1.5 text-sm text-[#dc2626]";

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-sm text-[#6b7280]">{hint}</p>}
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

export default function CreateEventForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const datePickerRef = useRef<HTMLInputElement>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slots, setSlots] = useState(DEFAULTS.slots);
  const [venue, setVenue] = useState(DEFAULTS.venue);
  const [venueLink, setVenueLink] = useState(DEFAULTS.venueLink);
  const [image, setImage] = useState("");
  const [registrationFee, setRegistrationFee] = useState(DEFAULTS.registrationFee);

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  function validate() {
    const e: Errors = {};
    if (!title.trim()) e.title = "Enter an event title.";
    if (!description.trim()) e.description = "Enter a description.";

    const parsed = parseDate(date);
    if (!parsed) e.date = "Use dd/mm/yy, for example 24/09/26.";

    if (!startTime) e.startTime = "Pick a start time.";
    if (!endTime) e.endTime = "Pick an end time.";
    if (startTime && endTime && endTime <= startTime) {
      e.endTime = "End time must be after start time.";
    }

    const slotsNum = Number(slots);
    if (!Number.isInteger(slotsNum) || slotsNum < 1) e.slots = "Enter a whole number, 1 or more.";

    if (!venue.trim()) e.venue = "Enter a venue.";

    try {
      const url = new URL(venueLink);
      if (!/^https?:$/.test(url.protocol)) throw new Error();
    } catch {
      e.venueLink = "Enter a valid link.";
    }

    try {
      const url = new URL(image);
      if (!/^https?:$/.test(url.protocol)) throw new Error();
    } catch {
      e.image = "Enter a valid image link.";
    }

    const fee = Number(registrationFee);
    if (registrationFee.trim() === "" || Number.isNaN(fee) || fee < 0) {
      e.registrationFee = "Enter 0 or more.";
    }

    setErrors(e);
    return { ok: Object.keys(e).length === 0, parsed };
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setStatus(null);

    const { ok, parsed } = validate();
    if (!ok || !parsed) return;

    setSubmitting(true);
    try {
      // Same shape as the payload that works in Postman
      await createEvent({
        title: title.trim(),
        description: description.trim(),
        startTime: toDateTime(parsed, startTime).toISOString(),
        endTime: toDateTime(parsed, endTime).toISOString(),
        venue: venue.trim(),
        venueLink: venueLink.trim(),
        numberOfParticipants: Number(slots),
        image: image.trim(),
        registrationFee: Number(registrationFee),
      } as any);

      setStatus({ type: "ok", text: "Event created." });
      setTitle("");
      setDescription("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setSlots(DEFAULTS.slots);
      setVenue(DEFAULTS.venue);
      setVenueLink(DEFAULTS.venueLink);
      setImage("");
      setRegistrationFee(DEFAULTS.registrationFee);
      setErrors({});
    } catch (err) {
      setStatus({
        type: "error",
        text: err instanceof Error ? err.message : "Could not create the event. Try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="min-h-screen w-full px-6 py-8">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto max-w-5xl rounded-[26px] border border-[#e5e7eb] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] md:p-8"
      >
        <div className="mb-6 border-b border-[#e5e7eb] pb-4">
          <h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#111827]">
            Create your experience
          </h1>
          <p className="mt-2 text-base text-[#6b7280]">What are we planning today?</p>
        </div>

        <div className="space-y-6">
          <Field label="Event title" htmlFor="title" error={errors.title}>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Description" htmlFor="description" error={errors.description}>
            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-3">
            <Field label="Date" htmlFor="date" error={errors.date}>
              <div className="relative">
                <input
                  id="date"
                  inputMode="numeric"
                  placeholder="dd/mm/yy"
                  maxLength={8}
                  value={date}
                  onChange={(e) => setDate(maskDate(e.target.value))}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  aria-label="Open calendar"
                  onClick={() => datePickerRef.current?.showPicker?.()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#6b7280] transition hover:bg-[#eff6ff] hover:text-[#111827]"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </button>
                {/* Hidden native calendar; shows the picker, writes back as dd/mm/yy */}
                <input
                  ref={datePickerRef}
                  type="date"
                  tabIndex={-1}
                  aria-hidden="true"
                  value={toIsoDate(date)}
                  onChange={(e) => setDate(fromIsoDate(e.target.value))}
                  className="pointer-events-none absolute bottom-0 right-0 h-0 w-0 opacity-0"
                />
              </div>
            </Field>
            <Field label="Start time" htmlFor="startTime" error={errors.startTime}>
              <input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="End time" htmlFor="endTime" error={errors.endTime}>
              <input
                id="endTime"
                type="time"
                value={endTime}
                min={startTime || undefined}
                onChange={(e) => setEndTime(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Slots" htmlFor="slots" error={errors.slots}>
              <input
                id="slots"
                type="number"
                min={1}
                step={1}
                value={slots}
                onChange={(e) => setSlots(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field
              label="Registration fee (₹)"
              htmlFor="registrationFee"
              error={errors.registrationFee}
              hint="Enter 0 for a free event."
            >
              <input
                id="registrationFee"
                type="number"
                min={0}
                step="any"
                value={registrationFee}
                onChange={(e) => setRegistrationFee(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Venue" htmlFor="venue" error={errors.venue}>
              <input
                id="venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Google Maps link" htmlFor="venueLink" error={errors.venueLink}>
              <input
                id="venueLink"
                type="url"
                value={venueLink}
                onChange={(e) => setVenueLink(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Image link" htmlFor="image" error={errors.image}>
            <input
              id="image"
              type="url"
              placeholder="https://"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={inputClass}
            />
          </Field>

          {status && (
            <p
              role="status"
              className={`rounded-xl px-4 py-3 text-sm ${
                status.type === "ok"
                  ? "bg-[#ecfdf5] text-[#047857]"
                  : "bg-[#fef2f2] text-[#b91c1c]"
              }`}
            >
              {status.text}
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="mx-auto block w-full rounded-xl border border-[#dfe3e8] bg-[#f3f4f6] px-5 py-3 text-base font-medium text-[#111827] transition hover:border-[#60a5fa] hover:bg-[#eff6ff] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating event..." : "Create event"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}