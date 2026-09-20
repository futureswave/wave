"use client";

import { motion } from "framer-motion";
import { GENDERS, VANTH_TYPES } from "@/lib/content/traits";
import type { Gender, VanthType } from "@/lib/content/traits";

type Props = {
  gender: Gender;
  onGenderChange: (gender: Gender) => void;
  type: VanthType;
  onTypeChange: (type: VanthType) => void;
};

export function GenderTypeControls({
  gender,
  onGenderChange,
  type,
  onTypeChange,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      {/* Gender — a two-up segmented control with a sliding backdrop. */}
      <div
        role="radiogroup"
        aria-label="Gender"
        className="relative flex rounded-full border border-white/[0.08] bg-[#111]/80 p-1 backdrop-blur"
      >
        {GENDERS.map((option) => {
          const active = option.id === gender;
          return (
            <button
              key={option.id}
              role="radio"
              aria-checked={active}
              onClick={() => onGenderChange(option.id)}
              className={`relative px-6 py-2 font-mono text-[11px] uppercase tracking-[0.3em] transition-colors ${
                active ? "text-white" : "text-white/35 hover:text-white/70"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="trait-gender-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  className="absolute inset-0 rounded-full bg-[#7c3aed]/25 ring-1 ring-[#7c3aed]/50"
                />
              )}
              <span className="relative">{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Type — four origins. */}
      <div
        role="radiogroup"
        aria-label="Type"
        className="flex flex-wrap justify-center gap-2"
      >
        {VANTH_TYPES.map((option) => {
          const active = option === type;
          return (
            <button
              key={option}
              role="radio"
              aria-checked={active}
              onClick={() => onTypeChange(option)}
              className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-all ${
                active
                  ? "border-[#7c3aed]/60 bg-[#7c3aed]/15 text-white"
                  : "border-white/[0.08] text-white/35 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
