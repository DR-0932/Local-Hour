"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import LandingPageEventCard from "@/ui/cardComponent/landingPageEventCard";

const events = [
  {
    number: "01",
    title: "Mafia Game",
    subtitle: "Silicon Valley's favorite game",
    description:
      "A social deduction game of secrets, strategy, deception and suspicion. Pick your role, find your allies, and figure out who you can trust.",
    image: "/playcards/table.png",
    bg: "bg-surface",
    rotation: "md:-rotate-2",
  },
  {
    number: "02",
    title: "Jamming Sessions",
    subtitle: "Music & people",
    description:
      "Bring an instrument, bring your voice, or simply come listen. Make music together, experiment, and see where the session takes you.",
    image: "/playcards/jamming02.png",
    bg: "bg-fog",
    rotation: "md:rotate-2",
  },
  {
    number: "03",
    title: "Pick a Corner",
    subtitle: "Your time, your way",
    description:
      "Read, write, draw, talk, crochet, play board games, uno. Do whatever you like.",
    image: "/playcards/tablecorner.jpeg",
    bg: "bg-stone",
    rotation: "md:-rotate-1",
  },
  {
    number: "04",
    title: "Or Be A Part Of Events",
    subtitle: "Silly games & Offline events",
    description: "Check out events section to see upcoming events",
    image: "club/all_ages.jpg",
    bg: "bg-[#91b2ff]",
    rotation: "md:-rotate-1",
  },
];

export default function EventSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();

  useGSAP(() => {
    const heading = gsap.utils.toArray<HTMLElement>(".heading-line");
    const copy = gsap.utils.toArray<HTMLElement>(".copy-line");
    const cards = gsap.utils.toArray<HTMLElement>(".card-item");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%",
        scrub: 1,
        pin:true,
        anticipatePin:1,
      },
    });

    tl.fromTo(
      heading,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
  
    ).fromTo(
      copy,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 3, ease: "power3.out" },
      "<0.2"
    )

    .fromTo(
      cards,
      { y:150, opacity:0},
      { y:0, opacity:1, duration:3,ease:"power3.out"},
      "<0.7"
    )

    .to({},{duration:1})

    .to(cards,{
      y:-200, opacity:0,duration:1,ease:"power2.in"
    },"<0.2");


  }, { scope: sectionRef }



);

  

return (
  <section
    ref={sectionRef}
    className="overflow-hidden bg-[#171717]  px-5 py-12 text-white sm:px-6 md:flex md:h-screen md:items-center md:px-12 md:py-10"
  >
    <div className="mx-auto w-full max-w-6xl">
      {/* Heading */}
      <div className="grid gap-5 md:grid-cols-2 md:gap-10">
        <h2 className="heading-line max-w-xl text-4xl font-medium leading-[0.9] tracking-[-0.05em] sm:text-3xl md:text-3xl pt-12">
          Pick your
          <br />
          experience.
        </h2>
        <div className="flex items-end">
          <p className="copy-line max-w-md text-sm leading-6 text-[#df88f2] md:text-base">
            How our sundays look. <br /> Play something cool, sing some songs, or pick a hobby to spend your time however you want.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div
      style={{ zoom: 0.75 }}
        className="card-item relative mx-auto mt-8 flex max-w-[700px] flex-col gap-5 md:mt-10 md:min-h-[360px] md:flex-row md:items-start md:justify-center md:gap-0"
        onMouseLeave={() => setHovered(null)}
      >
        {events.map((event, index) => (
          <LandingPageEventCard
            key={event.title}
            {...event}
            index={index}
            hovered={hovered}
            onHover={setHovered}
            onClick={() => router.push("/event")}
          />
        ))}
      </div>

      {/* Bottom */}
      <div className="mt-6 flex flex-col gap-3 border-t border-ash pt-4 md:mt-6 md:flex-row md:items-center md:justify-between">
        <p className="card-item text-xl font-medium md:text-2xl">No phones during club hours.</p>
      </div>
    </div>
  </section>
);
}