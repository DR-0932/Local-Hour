"use client"
import UpcomingEventSection from "@/components/events/upcomingEvents";
import EventSection from "@/components/landingPage/eventsSection";
import HeroSection from "@/components/landingPage/heroSection";
import MeetHostSection from "@/components/landingPage/meetHosts";
import OrbitProjects from "@/components/orbitanimaton/orbitAnimation";
import OrbitProjectsMobile from "@/components/orbitanimaton/orbitanimationMobile";
import Navbar from "@/ui/navbar";
import { useState,useEffect } from "react";

export default function Page(){

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)"); // 1024px is Tailwind's default 'lg'
    setIsDesktop(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

const isDesktop = useIsDesktop();
    return(<>
<main className="wrapper">
  <div className="content">
    
    <div className="relative">
      <Navbar />
      <HeroSection />
    </div>

    <section className="relative">
      <EventSection />
    </section>

    <section className="relative">
      {isDesktop ? <OrbitProjects /> : <OrbitProjectsMobile />}
    </section>

    <section className="relative bg-white">
      <MeetHostSection />
    </section>

  </div>
</main>
    </>)
}