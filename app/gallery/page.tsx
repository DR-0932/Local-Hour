"use client"

import PhantomInfiniteGallery from "@/components/gallery/phantomGallery"
import Navbar from "@/ui/navbar";

export default function Page() {
  return (
    <main className=" h-screen w-full overflow-hidden bg-black">
      <Navbar/>

      <PhantomInfiniteGallery />
    </main>
  );
}