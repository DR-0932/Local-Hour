"use client";

import { useEffect, useRef, useState } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  field_name?: string;
  placeholder?: string;
  options: SelectOption[];
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
};

export default function SelectField({
  field_name,
  placeholder = "Select an option",
  options,
  name,
  value,
  onChange,
  className = "",
  disabled = false,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (nextValue: string) => {
    setIsOpen(false);
    onChange?.(nextValue);
  };

  return (
    <label className="block sm:col-span-2">
      <span className="mb-2 block text-sm font-medium text-[#1f1d1a]">
        {field_name}
      </span>

      <div className="relative" ref={containerRef}>
        <button
          type="button"
          name={name}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={`flex w-full items-center justify-between rounded-[16px] border-[1.5px] border-[#1f1d1a]/70 bg-[#f5f0ea] px-4 py-3 text-left text-base text-[#1f1d1a] focus:border-[#1f1d1a] focus:outline-none focus:ring-2 focus:ring-[#1f1d1a]/10 disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
        >
          <span
            className={selectedOption ? "text-[#1f1d1a]" : "text-[#4f4a42]/70"}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="ml-3 text-lg text-[#1f1d1a]">▾</span>
        </button>

        {isOpen && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-[16px] border-[1.5px] border-[#1f1d1a]/70 bg-[#f5f0ea] shadow-[10px_10px_0_rgba(31,29,26,0.06)]">
            <button
              type="button"
              onClick={() => handleSelect("")}
              className="flex w-full items-center px-4 py-3 text-left text-base text-[#4f4a42]/70 transition hover:bg-[#efe6de]"
            >
              {placeholder}
            </button>

            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`flex w-full items-center px-4 py-3 text-left text-base transition ${
                    isSelected
                      ? "bg-[#1f1d1a] text-[#f6f1e8]"
                      : "text-[#1f1d1a] hover:bg-[#efe6de]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </label>
  );
}
