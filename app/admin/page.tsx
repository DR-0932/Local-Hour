"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/sidebar";
import CreateEventForm from "@/components/admin/createEventForm";
import HomeDashboard from "@/components/admin/home";
import EventsPanel from "@/components/admin/events";

export default function Page() {
  const [activeTab, setActiveTab] = useState("Home");

  const renderMainPanel = () => {
    if (activeTab === "Create Event") {
      return <CreateEventForm />;
    }

    if (activeTab === "Home") {
      return <HomeDashboard />;
    }

    if (activeTab === "Events") {
      return <EventsPanel />;
    }

    return (
      <div className="flex min-h-[70vh] items-center justify-center rounded-[24px] border border-dashed border-[#dfe3e8] bg-white/60 p-10 text-center text-[#6b7280]">
        <div>
          <p className="text-2xl font-semibold tracking-[-0.05em] text-[#111827]">{activeTab}</p>
          <p className="mt-2 text-sm">This panel is ready for the {activeTab.toLowerCase()} section.</p>
        </div>
      </div>
    );
  };

  return (
    <main className="flex min-h-screen bg-[#f2f1ee] text-[#111827]">
      <div className="w-[270px] shrink-0 bg-[#111315]">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="flex-1 bg-[#f5f4f2]">
        <header className="flex h-20 items-center justify-between border-b border-[#e5e7eb] bg-[#f6f6f4] px-6">
          <div className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-[#dfe3e8] bg-white px-4 py-2.5 shadow-sm">
            <span className="text-lg text-[#6b7280]">⌕</span>
            <input
              aria-label="Search"
              placeholder="Search"
              className="w-full border-none bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#6b7280]"
            />
            <span className="rounded-md border border-[#e5e7eb] bg-[#f8fafc] px-2 py-1 text-[10px] font-medium text-[#6b7280]">
              ⌘K
            </span>
          </div>

          <div className="ml-5 flex items-center gap-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfe3e8] bg-white text-[#374151]">
              ⌁
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfe3e8] bg-white text-[#374151]">
              ◌
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#f7d0c6] via-[#d7d3f6] to-[#b5d4ff] text-sm font-semibold text-[#111827]">
              A
            </div>
          </div>
        </header>

        <div className="p-6">{renderMainPanel()}</div>
      </div>
    </main>
  );
}
