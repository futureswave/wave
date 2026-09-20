"use client";

import { splitByExclusivity } from "@/lib/content/traits";
import type { Gender, TraitCategory } from "@/lib/content/traits";

type Props = {
  category: TraitCategory;
  gender: Gender;
};

/**
 * Variant grid for one category. Shared between the desktop detail panel and
 * the mobile accordion, so it carries no layout chrome of its own.
 */
export function TraitList({ category, gender }: Props) {
  const variants = splitByExclusivity(category, gender);
  const exclusiveCount = variants.filter((v) => v.exclusive).length;
  const genderLabel = gender === "man" ? "Man" : "Women";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
          {variants.length} variants · {genderLabel}
        </span>
        {exclusiveCount > 0 && (
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#a78bfa]/70">
            {exclusiveCount} {genderLabel}-only
          </span>
        )}
      </div>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {variants.map(({ name, exclusive }) => {
          const none = name === "NONE";
          return (
            <li
              key={name}
              className={`group flex items-center gap-3 rounded-sm border px-3 py-2.5 transition-colors ${
                exclusive
                  ? "border-[#7c3aed]/35 bg-[#7c3aed]/[0.06] hover:border-[#7c3aed]/60"
                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/20"
              }`}
            >
              {/* Thumbnail slot — monogram until the trait art ships. */}
              <span
                aria-hidden
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-white/[0.07] font-mono text-[11px] ${
                  none ? "text-white/20" : "text-white/45"
                } bg-[#0d0d0d]`}
              >
                {none ? "—" : name.charAt(0).toUpperCase()}
              </span>
              <span
                className={`truncate text-sm ${
                  none ? "italic text-white/35" : "text-white/70"
                } group-hover:text-white`}
                title={name}
              >
                {none ? "None" : name}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
