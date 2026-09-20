"use client"

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const lines = gsap.utils.toArray<HTMLDivElement>(".text-line")

    // paused timeline — we control when it plays
    const tl = gsap.timeline({ paused: true }).fromTo(
      lines,
      { 
        y: 56, opacity: 0, filter: "blur(16px)" 
      },
      {
        y:0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.75,
        stagger: 0.5,
        ease: "power3.out",
      }
    )

    tl.play() // play once immediately on page load

    ScrollTrigger.create({
      trigger: container.current,
      start: "top top",
      end: "bottom top",
      // markers: true, // uncomment to debug
      onLeave: () => tl.progress(0).pause(),  // scrolled past hero → reset, ready to replay
      onEnterBack: () => tl.restart(),        // scrolled back up into hero → replay
    })
  }, { scope: container });

  return (
    <section className="bg-paper px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-36 lg:px-16 min-h-[50vh] sm:min-h-[70vh] lg:min-h-[60vh]">
      <div ref={container} className="mx-auto max-w-7xl min-h-[inherit]">
        <p className="text-line text-xs font-medium uppercase tracking-[0.2em] text-graphite">
          localHour / Sagar
        </p>
        <h1 className="text-line mt-7 max-w-5xl text-[clamp(4.5rem,13vw,11rem)] font-semibold leading-[0.78] tracking-[-0.09em] text-ink">
          Anti Brain-Rot.
          <br />
          Social Club.
        </h1>
        <p className="text-line mt-10 max-w-md text-lg leading-8 text-graphite sm:text-xl">
          Disconnect with screens and scrolls.
        </p>
      </div>
    </section>
  );
}


// "use client"

// import { useGSAP } from "@gsap/react";
// import { useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// gsap.registerPlugin(ScrollTrigger);

// export default function HeroSection() {
//   const container = useRef<HTMLDivElement>(null)



//   useGSAP(()=>{
//     const lines = gsap.utils.toArray<HTMLDivElement>(".text-line")
  
//     gsap.fromTo(
//       lines,
//       {
//         y:50,
//         opacity:0,
//         filter:"blur(6px)"
//       },{
//         y:0,
//         opacity:1,
//         filter:"blur(0px)",
//         duration:0.75,
//         stagger:0.2,
//         ease:"power3.out",
//         scrollTrigger:{
//           trigger:container.current,
//           start:"top 80%",
//             toggleActions: "play none none reverse",
//         }
//       }
//     )
//   },{scope:container});


//   return (
//     <section className="bg-paper px-5 py-20 sm:px-6 sm:py-28 md:px-12 md:py-36 lg:px-16 min-h-[50vh]  sm:min-h-[70vh] lg:min-h-[60vh]">
//       {/* <WaterDropGrid/> */}

//       <div
//         ref = {container} 
//         className="mx-auto max-w-7xl min-h-[inherit]">
//         <p className="text-line text-xs font-medium uppercase tracking-[0.2em] text-graphite">
//           localHour / Sagar
//         </p>

//         <h1 className="text-line mt-7 max-w-5xl text-[clamp(4.5rem,13vw,11rem)] font-semibold leading-[0.78] tracking-[-0.09em] text-ink">
//           Anti Brain-Rot.
//           <br />
//           Social Club.
//         </h1>

//         <p className=" text-line mt-10 max-w-md text-lg leading-8 text-graphite sm:text-xl">
//           Disconnect with screens and scrolls.
//         </p>
//       </div>
//     </section>
//   );
// }
