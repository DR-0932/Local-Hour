"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/sidebar";
import CreateEventForm from "@/components/admin/createEventForm";
import HomeDashboard from "@/components/admin/home";
import EventsPanel from "@/components/admin/events";

export default function Page() {
  const [activeTab, setActiveTab] = useState("Home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTab = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false); // close drawer after picking a tab
  };

  const renderMainPanel = () => {
    if (activeTab === "Create Event") return <CreateEventForm />;
    if (activeTab === "Home") return <HomeDashboard />;
    if (activeTab === "Events") return <EventsPanel />;
    if (activeTab === "gallery") return <EventsPanel />;

    return (
      <div className="flex min-h-[70vh] items-center justify-center rounded-[24px] border border-dashed border-[#dfe3e8] bg-white/60 p-6 text-center text-[#6b7280] md:p-10">
        <div>
          <p className="text-2xl font-semibold tracking-[-0.05em] text-[#111827]">{activeTab}</p>
          <p className="mt-2 text-sm">This panel is ready for the {activeTab.toLowerCase()} section.</p>
        </div>
      </div>
    );
  };

  return (
    <main className="flex min-h-screen bg-[#f2f1ee] text-[#111827]">
      {/* Backdrop (mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar: drawer on mobile, static on lg+ */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-[270px] shrink-0 bg-[#111315] transition-transform duration-200",
          "lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <Sidebar activeTab={activeTab} setActiveTab={handleTab} />
      </aside>

      <div className="min-w-0 flex-1 bg-[#f5f4f2]">
        <header className="flex h-16 items-center gap-3 border-b border-[#e5e7eb] bg-[#f6f6f4] px-4 md:h-20 md:px-6">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#dfe3e8] bg-white text-lg text-[#374151] lg:hidden"
          >
            ☰
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#dfe3e8] bg-white px-3 py-2 shadow-sm md:max-w-xl md:px-4 md:py-2.5">
            <span className="text-lg text-[#6b7280]">⌕</span>
            <input
              aria-label="Search"
              placeholder="Search"
              className="w-full min-w-0 border-none bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#6b7280]"
            />
            <span className="hidden rounded-md border border-[#e5e7eb] bg-[#f8fafc] px-2 py-1 text-[10px] font-medium text-[#6b7280] md:inline">
              ⌘K
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <button className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#dfe3e8] bg-white text-[#374151] sm:flex">
              ⌁
            </button>
            <button className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#dfe3e8] bg-white text-[#374151] sm:flex">
              ◌
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#f7d0c6] via-[#d7d3f6] to-[#b5d4ff] text-sm font-semibold text-[#111827]">
              A
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">{renderMainPanel()}</div>
      </div>
    </main>
  );
}