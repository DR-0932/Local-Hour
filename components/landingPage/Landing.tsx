"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import FloatingIcons from "./FloatingIcons";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollMaskHero() {
  const wrapper = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const leftText = useRef<HTMLParagraphElement>(null);
  const rightText = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper.current,
          start: "top top",
          end: "+=500",
          scrub: true,
        },
      });

      tl.to(box.current, {
        width: "150vw",
        height: "200vh",
        borderRadius: 10,
        ease: "none",
      })
        .to(leftText.current, { x: -1500, opacity: 0, ease: "none" }, "<")
        .to(rightText.current, { x: 1500, opacity: 0, ease: "none" }, "<");
    },
    { scope: wrapper }
  );

  return (
    <div ref={wrapper} className="relative h-[200vh] overflow-hidden bg-[#f5efe7]">
      <div className="sticky top-0 grid h-screen place-items-center" style={{ gridTemplateAreas: '"stack"' }}>
        <div
          ref={box}
          className="pointer-events-none overflow-hidden rounded-[20px]"
          style={{ gridArea: "stack", width: "8px", height: "2px" }}
        >
        <img src="image.png" alt="image" />
          
        </div>

        <FloatingIcons />

        <p
          ref={leftText}
          className=" justify-self-center text-4xl font-bold text-[#111111]"
          style={{ gridArea: "stack", transform: "translateX(-60px)" }}
        >
          Anti
        </p>

        <p
          ref={rightText}
          className="justify-self-center text-4xl font-bold text-[#111111]"
          style={{ gridArea: "stack", transform: "translateX(100px)" }}
        >
          BrainRot
        </p>
      </div>
    </div>
  );
}
