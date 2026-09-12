type RegistrationFormProps = {
  eventId?: string;
  title?: string;
  userId?: string | null;
};

export default function RegistrationForm({
  eventId,
  title = "Selected Event",
  userId = null,
}: RegistrationFormProps) {
  return (
    <main className="min-h-screen bg-[#f7f2ea] px-4 py-10 text-[#1f1d1a] sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="overflow-hidden rounded-[28px] border-[1.5px] border-[#1f1d1a] bg-[#efe6de] p-6 shadow-[10px_10px_0_rgba(31,29,26,0.06)] sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <span className="rounded-full border border-[#1f1d1a] bg-[#f6f1e8] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#4f4a42]">
              Event Registration
            </span>
          </div>

          <div className="space-y-4">
            <div className="rounded-[22px] border-[1.5px] border-[#1f1d1a] bg-[#f8f5f1] p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#4f4a42]">
                Selected event
              </p>
              <h1 className="mt-3 text-3xl font-medium tracking-[-0.07em] text-[#1f1d1a] sm:text-4xl">
                {title}
              </h1>
            </div>

            <div className="rounded-[22px] border-[1.5px] border-[#1f1d1a] bg-[#dfe9db] p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#4f4a42]">
                Event ID
              </p>
              <p className="mt-2 text-lg font-medium tracking-[-0.04em] text-[#1f1d1a]">
                {eventId || "Not provided"}
              </p>
            </div>

            <div className="rounded-[22px] border-[1.5px] border-[#1f1d1a] bg-[#e9e5f4] p-4 text-sm leading-6 text-[#4f4a42]">
              Secure your spot and keep your details ready for the host team. This form
              is currently styled for submission wiring later.
            </div>
          </div>
        </aside>

        <section className="rounded-[28px] border-[1.5px] border-[#1f1d1a] bg-[#fffdf9] p-6 shadow-[12px_12px_0_rgba(31,29,26,0.06)] sm:p-8">
          <div className="mb-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#765c9b]">
              RSVP Form
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.06em] text-[#1f1d1a] sm:text-4xl">
              Register your spot
            </h2>
          </div>

          <form className="space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-[#1f1d1a]">
                  Full name
                </span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full rounded-[16px] border-[1.5px] border-[#1f1d1a]/70 bg-[#f5f0ea] px-4 py-3 text-base text-[#1f1d1a] placeholder:text-[#4f4a42]/70 focus:border-[#1f1d1a] focus:outline-none focus:ring-2 focus:ring-[#1f1d1a]/10"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-[#1f1d1a]">
                  Email address
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-[16px] border-[1.5px] border-[#1f1d1a]/70 bg-[#f5f0ea] px-4 py-3 text-base text-[#1f1d1a] placeholder:text-[#4f4a42]/70 focus:border-[#1f1d1a] focus:outline-none focus:ring-2 focus:ring-[#1f1d1a]/10"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-[#1f1d1a]">
                  Contact number
                </span>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full rounded-[16px] border-[1.5px] border-[#1f1d1a]/70 bg-[#f5f0ea] px-4 py-3 text-base text-[#1f1d1a] placeholder:text-[#4f4a42]/70 focus:border-[#1f1d1a] focus:outline-none focus:ring-2 focus:ring-[#1f1d1a]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#1f1d1a]">
                  Event ID
                </span>
                <input
                  type="text"
                  value={eventId || ""}
                  readOnly
                  className="w-full rounded-[16px] border-[1.5px] border-[#1f1d1a]/70 bg-[#f0eee9] px-4 py-3 text-base text-[#1f1d1a] read-only:cursor-not-allowed"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#1f1d1a]">
                  User ID
                </span>
                <input
                  type="text"
                  value={userId ?? "null"}
                  readOnly
                  className="w-full rounded-[16px] border-[1.5px] border-[#1f1d1a]/70 bg-[#f0eee9] px-4 py-3 text-base text-[#1f1d1a] read-only:cursor-not-allowed"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#4f4a42]">
                No backend submission is connected yet.
              </p>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-[16px] border-[1.5px] border-[#1f1d1a] bg-[#1f1d1a] px-5 py-3 text-sm font-medium text-[#f6f1e8] shadow-[4px_4px_0_rgba(31,29,26,0.08)] transition hover:bg-[#2f2a27]"
              >
                Submit registration
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}