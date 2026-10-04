"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

type CtaButtonProps = {
  href: string;
  label: string;
  fill: string;   // colour that sweeps up on hover
  shadow: string; // hard shadow colour
  arrow?: boolean;
};

function CtaButton({ href, label, fill, shadow ,arrow = true}: CtaButtonProps) {
  return (
    <Link
      href={href}
      style={{ "--shadow": shadow } as CSSProperties}
      className="group relative inline-flex items-center gap-4 overflow-hidden border-2 border-[#fcf8ec] bg-stone px-6 py-4 text-ink
                 shadow-[6px_6px_0px_var(--shadow)]
                 transition-all duration-300 ease-out
                 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_var(--shadow)]
                 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
    >
      <span
        aria-hidden
        style={{ backgroundColor: fill }}
        className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100"
      />
      <span className="relative text-sm font-semibold uppercase tracking-[0.18em]">
        {label}
      </span>
          {arrow &&(
      <span className="relative flex h-6 w-6 items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="absolute h-5 w-5 transition-all duration-300 ease-out group-hover:translate-x-6"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>

           <svg
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           strokeWidth="2"
           className="absolute h-5 w-5 -translate-x-6 transition-all duration-300 ease-out group-hover:translate-x-0"
           >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
        )}
    </Link>
  );
}

export default function CtaSection() {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center gap-8 rounded-b-[56px] bg-[#171717] px-5 py-2 md:min-h-[320px] md:flex-row md:gap-10">
        <CtaButton
          href="/gallery"
          label="Gallery"
          fill="#ffc48a"
          shadow="#91b2ff"
          arrow={false}
        />
      <CtaButton
        href="/event"
        label="Upcoming events"
        fill="#91b2ff"
        shadow="#FF6363"
      />
    </div>
  );
}