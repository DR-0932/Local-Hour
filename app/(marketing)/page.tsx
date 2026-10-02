"use client";

import EventSection from "@/components/landingPage/eventsSection";
import HeroSection from "@/components/landingPage/heroSection";
import MeetHostSection from "@/components/landingPage/meetHosts";
import OrbitProjects from "@/components/orbitanimaton/orbitAnimation";
import OrbitProjectsMobile from "@/components/orbitanimaton/orbitanimationMobile";
import Navbar from "@/ui/navbar";
import { useState, useEffect } from "react";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

export default function Page() {
  const isDesktop = useIsDesktop();

  return (
    <main className="wrapper">
      <div className="content">
        {/* Hero: stays pinned behind */}
        <div className="sticky top-0 z-0   bg-paper">
          <Navbar />
          <HeroSection />
        </div>

        {/* Everything else slides over it */}
        <div className="relative z-10">
          <section className="relative bg-paper">
            <EventSection />
          </section>

          <section className="relative bg-black">
            {isDesktop ? <OrbitProjects /> : <OrbitProjectsMobile />}
          </section>

          <section className="relative bg-white">
            <MeetHostSection />
          </section>
        </div>
      </div>
    </main>
  );
}