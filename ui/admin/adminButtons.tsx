"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type AdminButtonProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export default function AdminButton({
  icon,
  label,
  active: controlledActive,
  onClick,
}: AdminButtonProps) {
  const isControlled = controlledActive !== undefined;
  const [internalActive, setInternalActive] = useState(false);
  const active = isControlled ? controlledActive : internalActive;

  const handleClick = () => {
    if (!isControlled) {
      setInternalActive((prev) => !prev);
    }

    onClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200",
        active
          ? "bg-[#4f46e5] text-white shadow-[0_8px_18px_rgba(79,70,229,0.28)]"
          : "bg-transparent text-[#e5e7eb] hover:bg-white/5",
      ].join(" ")}
      aria-pressed={active}
    >
      <span
        className={[
          "flex h-5 w-5 items-center justify-center rounded-md border text-[13px] leading-none",
          active
            ? "border-white/35 bg-white/10 text-white"
            : "border-white/20 bg-transparent text-[#d1d5db]",
        ].join(" ")}
      >
        {icon || "◌"}
      </span>

      <span className="text-[15px] font-medium tracking-[-0.01em]">{label}</span>
    </button>
  );
}
