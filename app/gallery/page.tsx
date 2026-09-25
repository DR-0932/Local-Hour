"use client";

import { useEffect, useState } from "react";
import PhantomInfiniteGallery from "@/components/gallery/phantomGallery";
import Navbar from "@/ui/navbar";
import ParallaxGallery from "@/components/gallery/parallaxGallery";

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return isMobile;
}

export default function Page() {
  const isMobile = useIsMobile();

  return (
    <main className=" h-screen w-full  bg-black">
      <Navbar />
       <ParallaxGallery/> 
    </main>
  );
}