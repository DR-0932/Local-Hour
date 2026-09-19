"use client";

import AdminInput from "@/ui/admin/adminInput";

export default function CreateEventForm() {
  return (
    <section className="min-h-screen w-full px-6 py-8">
      <div className="mx-auto max-w-5xl rounded-[26px] border border-[#e5e7eb] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] md:p-8">
        <div className="mb-6 border-b border-[#e5e7eb] pb-4">
          <h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#111827]">Create Your experience</h1>
          <p className="mt-2 text-base text-[#6b7280]">What are we planning today?</p>
        </div>

        <div className="space-y-6">
          <AdminInput label="Event Title" placeholder="" />

          <div>
            <label className="mb-2 block text-sm font-medium text-[#374151]">Description</label>
            <textarea
              rows={5}
              className="w-full resize-none rounded-xl border border-[#dfe3e8] bg-[#f9fafb] px-4 py-3 text-base text-[#111827] outline-none transition focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <AdminInput label="Date" type="date" />
            <AdminInput label="Time" type="time" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <AdminInput label="Slots" placeholder="" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <AdminInput
                label="Venue"
                placeholder=""
                inputClassName="focus:border-[#dfe3e8]"
              />
            </div>

            <AdminInput label="Venue Link googleMaps" placeholder="" />
          </div>

          <AdminInput label="Registration Fee" placeholder="" />

          <div className="pt-2">
            <button
              type="button"
              className="mx-auto block w-full rounded-xl border border-[#dfe3e8] bg-[#f3f4f6] px-5 py-3 text-base font-medium text-[#111827] transition hover:border-[#60a5fa] hover:bg-[#eff6ff]"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
