"use client";

import CtaSection from "@/components/cta/calltoaction";
import EventSection from "@/components/landingPage/eventsSection";
import HeroSection from "@/components/landingPage/heroSection";
import MeetHostSection from "@/components/landingPage/meetHosts";
import MobileExpandingCards from "@/components/mobile/eventSection-mobile";
import OrbitProjects from "@/components/orbitanimaton/orbitAnimation";
import OrbitProjectsMobile from "@/components/orbitanimaton/orbitanimationMobile";

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
        <div className="sticky top-0 z-0    bg-paper " >
          <HeroSection />
        </div>

        {/* Everything else slides over it */}
        <div className="relative z-10 ">
          <section className="relative bg-[#171717]">
              {isDesktop ? <EventSection /> : <MobileExpandingCards />}
          </section>

          <section className="relative z-10 bg-paper  ">
            {isDesktop ? <OrbitProjects background="#171717"/> : <OrbitProjectsMobile />}
          </section>
          <section>
            <CtaSection/>
          </section>

          <section className="relative bg-white mt-40">
            <MeetHostSection />
          </section>
        </div>
      </div>
    </main>
  );
}