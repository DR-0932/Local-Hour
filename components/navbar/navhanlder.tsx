"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, CalendarDays, Images } from "lucide-react";
import { NotchNav } from "@/components/navbar/notchNav";

const navItems = [
  { id: "/", label: "Home", icon: Home },
  { id: "/event", label: "Events", icon: CalendarDays },
  { id: "/gallery", label: "Gallery", icon: Images },
];

export default function SiteNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <NotchNav
      overlay
      items={navItems}
      activeId={pathname}
      onActiveChange={(id) => router.push(id)}
      logo={<span className="text-sm font-semibold">Local Hour</span>}
    />
  );
}
