"use client";

import { useState } from "react";
import Image from "next/image";
import type { District } from "@/lib/content/universe";

/**
 * PRD 9 / Phase 3 — the interactive district map. An SVG-free hotspot layer over
 * the city plate; selecting a hotspot opens that district's record beneath it.
 * Deliberately not 3D: the artwork is already the heaviest thing on the page.
 */
export function DistrictMap({ districts }: { districts: District[] }) {
  const [activeSlug, setActiveSlug] = useState(districts[0]?.slug ?? "");
  const active = districts.find((d) => d.slug === activeSlug) ?? districts[0];

  return (
    <div className="space-y-6">
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-[#0d0d0d] scanlines">
        <Image
          src="/images/optimized/background3.webp"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 900px"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 to-[#0a0a0a]/80" />

        {/* Hotspot layer. Positions come from each district's `coords`. */}
        {districts.map((district) => {
          const isActive = district.slug === active?.slug;
          return (
            <button
              key={district.slug}
              onClick={() => setActiveSlug(district.slug)}
              aria-pressed={isActive}
              style={{ left: `${district.coords.x}%`, top: `${district.coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
            >
              <span
                className={`block w-3 h-3 rounded-full border transition-all ${
                  isActive
                    ? "border-white bg-white scale-125"
                    : "border-white/50 bg-white/20 group-hover:bg-white/60"
                }`}
              />
              {isActive && (
                <span
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/40 animate-ping"
                  aria-hidden
                />
              )}
              <span
                className={`absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                  isActive ? "text-white" : "text-white/45 group-hover:text-white/80"
                }`}
              >
                {district.name}
              </span>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
            {active.tagline}
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-display text-white mb-4">
            {active.name}
          </h3>
          <p className="text-white/60 leading-relaxed max-w-2xl">
            {active.description}
          </p>
        </div>
      )}
    </div>
  );
}
