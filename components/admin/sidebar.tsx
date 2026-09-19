//create event.
//see events.
//see registrations event-wise filter.

import AdminButton from "@/ui/admin/adminButtons";
import { useState } from "react";

type SidebarProps = {
  activeTab?: string;
  setActiveTab?: (value: string) => void;
};

export default function Sidebar({
  activeTab: controlledTab,
  setActiveTab: controlledSetActiveTab,
}: SidebarProps) {
  const [internalTab, setInternalTab] = useState("Home");

  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = controlledSetActiveTab ?? setInternalTab;

  return (
    <aside className="flex h-full w-[280px] flex-col bg-[#111315] px-3 py-4 text-white">
      <div className="mb-5 flex items-center justify-between px-2 pt-1">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-[11px] font-bold text-white">
            D
          </div>
          <span className="text-xl font-semibold tracking-[-0.05em]">Deviaskit</span>
        </div>
        <div className="h-7 w-7 rounded-full border border-white/10 bg-white/5" />
      </div>

      <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>Workspace</span>
          <span className="rounded-full border border-white/10 px-1.5 py-0.5 text-[10px]">⌄</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-base font-medium text-white">
          <div className="h-2.5 w-2.5 rounded-full bg-violet-400" />
          <span>Devias</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        <AdminButton
          icon={<span>◢</span>}
          label="Home"
          active={activeTab === "Home"}
          onClick={() => setActiveTab("Home")}
        />

        <AdminButton
          icon={<span>＋</span>}
          label="Create Event"
          active={activeTab === "Create Event"}
          onClick={() => setActiveTab("Create Event")}
        />

        <AdminButton
          icon={<span></span>}
          label="Events"
          active={activeTab === "Events"}
          onClick={() => setActiveTab("Events")}
        />
      </div>
    </aside>
  );
}