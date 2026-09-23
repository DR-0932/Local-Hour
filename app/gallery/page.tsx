"use client";

import { useEffect, useState } from "react";
import PhantomInfiniteGallery from "@/components/gallery/phantomGallery";
import Navbar from "@/ui/navbar";

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
    <main className=" h-screen w-full overflow-hidden bg-black">
      <Navbar />

      <PhantomInfiniteGallery
        cellSize={isMobile ? 180 : 300}
        cellPadding={isMobile ? 6 : 10}
        gap={isMobile ? 6 : 12}
        border={{
          width: 1,
          style: "dotted", // or "dashed", "dotted"
          color: "#444444", // change this — currently "#FFFFFF"
          showTop: false,
          showBottom: true,
          showLeft: true,
          showRight: true,
        }}
      />
    </main>
  );
}