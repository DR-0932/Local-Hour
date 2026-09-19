"use client";

import type { InputHTMLAttributes } from "react";

type AdminInputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  className?: string;
  inputClassName?: string;
  fullWidth?: boolean;
};

export default function AdminInput({
  label,
  placeholder = "",
  value,
  onChange,
  type = "text",
  className = "",
  inputClassName = "",
  fullWidth = true,
}: AdminInputProps) {
  return (
    <label className={`block ${fullWidth ? "w-full" : ""} ${className}`.trim()}>
      {label ? (
        <span className="mb-2 block text-sm font-medium text-[#374151]">{label}</span>
      ) : null}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-[#dfe3e8] bg-[#f9fafb] px-4 py-3 text-base text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#60a5fa] focus:ring-2 focus:ring-[#60a5fa]/20 ${inputClassName}`.trim()}
      />
    </label>
  );
}
