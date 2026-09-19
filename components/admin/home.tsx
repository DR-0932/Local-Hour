"use client";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  accent?: "blue" | "purple" | "green" | "orange";
};

function MetricCard({ label, value, detail, accent = "blue" }: MetricCardProps) {
  const accentClasses: Record<string, string> = {
    blue: "bg-[#eff6ff] text-[#1d4ed8]",
    purple: "bg-[#eef2ff] text-[#4338ca]",
    green: "bg-[#ecfdf5] text-[#047857]",
    orange: "bg-[#fff7ed] text-[#c2410c]",
  };

  return (
    <div className="rounded-[22px] border border-[#e5e7eb] bg-white p-5 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
      <div className={`mb-4 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${accentClasses[accent]}`}>
        {label}
      </div>
      <div className="text-3xl font-semibold tracking-[-0.06em] text-[#111827]">{value}</div>
      <div className="mt-2 text-sm text-[#6b7280]">{detail}</div>
    </div>
  );
}

function PieChartCard() {
  return (
    <div className="rounded-[22px] border border-[#e5e7eb] bg-white p-5 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-[-0.04em] text-[#111827]">Event split</h3>
        <span className="text-sm text-[#6b7280]">This month</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative h-36 w-36 shrink-0 rounded-full bg-[conic-gradient(#2563eb_0_42%,#60a5fa_42%_68%,#dbeafe_68%_100%)]">
          <div className="absolute inset-[22%] rounded-full bg-white" />
          <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-[#111827]">68%</div>
        </div>

        <div className="flex-1 space-y-3 text-sm text-[#374151]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2563eb]" />
              <span>Workshops</span>
            </div>
            <span className="font-medium">42%</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#60a5fa]" />
              <span>Meetups</span>
            </div>
            <span className="font-medium">26%</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#dbeafe]" />
              <span>Others</span>
            </div>
            <span className="font-medium">32%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RevenueCard() {
  return (
    <div className="rounded-[22px] border border-[#e5e7eb] bg-white p-5 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-[-0.04em] text-[#111827]">Total revenue</h3>
        <span className="rounded-full bg-[#e0f2fe] px-2.5 py-1 text-xs font-semibold text-[#0369a1]">+18.4%</span>
      </div>

      <div className="text-4xl font-semibold tracking-[-0.08em] text-[#111827]">₹1,24,800</div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-[#f8fafc] px-3 py-2 text-sm text-[#374151]">
          <span>Gross sales</span>
          <span className="font-semibold text-[#111827]">₹1,44,000</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-[#f8fafc] px-3 py-2 text-sm text-[#374151]">
          <span>Expenses</span>
          <span className="font-semibold text-[#111827]">₹19,200</span>
        </div>
      </div>
    </div>
  );
}

export default function HomeDashboard() {
  const metrics = [
    { label: "Events", value: "24", detail: "Across 5 active categories", accent: "blue" as const },
    { label: "Registrations", value: "1,248", detail: "+12% from last month", accent: "purple" as const },
    { label: "Revenue", value: "₹1.24L", detail: "Average ticket revenue", accent: "green" as const },
    { label: "Attendees", value: "842", detail: "Confirmed participants", accent: "orange" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#6b7280]">Overview</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.06em] text-[#111827]">Dashboard</h1>
        </div>
        <button
          type="button"
          className="rounded-xl border border-[#dfe3e8] bg-white px-4 py-2 text-sm font-medium text-[#111827] shadow-sm transition hover:border-[#60a5fa] hover:text-[#1d4ed8]"
        >
          Export report
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <PieChartCard />
        <RevenueCard />
      </div>

      <div className="rounded-[22px] border border-[#e5e7eb] bg-white p-5 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-[-0.04em] text-[#111827]">Recent activity</h3>
          <span className="text-sm text-[#6b7280]">Last 7 days</span>
        </div>

        <div className="space-y-3">
          {[
            ["AI Bootcamp", "86 registrations", "2 hours ago"],
            ["Startup Meetup", "42 registrations", "6 hours ago"],
            ["Women in Tech", "31 registrations", "Today"],
          ].map(([title, meta, time]) => (
            <div key={title} className="flex items-center justify-between rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-4 py-3">
              <div>
                <div className="font-medium text-[#111827]">{title}</div>
                <div className="text-sm text-[#6b7280]">{meta}</div>
              </div>
              <div className="text-sm text-[#6b7280]">{time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
