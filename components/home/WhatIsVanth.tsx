import { Palette, Fingerprint, Globe } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { BorderBeam } from "@/components/ui/border-beam";
import { SectionHeading } from "@/components/ui/SectionHeading";

// PRD 7.03 — the three pillars.
const PILLARS = [
  {
    icon: Palette,
    title: "Art",
    description:
      "Anime brushwork rendered in neon against a fractured net. Every character is drawn to hold its own in any collection — the artwork always outranks the interface.",
  },
  {
    icon: Fingerprint,
    title: "Identity",
    description:
      "Your VANTH is not an avatar you borrow. It is a signature: a fixed point inside an unstable world, and the record of where you stand in it.",
  },
  {
    icon: Globe,
    title: "Universe",
    description:
      "Districts, factions, and a lore that keeps expanding. The collection is the entry point, not the destination — the VANTHVERSE grows with the Collective.",
  },
];

export function WhatIsVanth() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 border-t border-white/5">
      <SectionHeading
        eyebrow="What is VANTH?"
        title="More than a collection"
        lead="VANTH is not just something you own. It is something you become part of."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PILLARS.map((pillar) => (
          <MagicCard
            key={pillar.title}
            gradientColor="#1a1a1a"
            gradientOpacity={1}
            className="relative rounded border-white/8 bg-[#111111] overflow-hidden"
          >
            <div className="p-7">
              <pillar.icon className="w-8 h-8 text-white/70 mb-5" />
              <h3 className="text-xl font-black text-white uppercase tracking-display mb-3">
                {pillar.title}
              </h3>
              <p className="text-white/55 leading-relaxed">{pillar.description}</p>
            </div>
            <BorderBeam
              colorFrom="rgba(255,255,255,0.2)"
              colorTo="rgba(255,255,255,0.04)"
              size={150}
              duration={14}
              borderWidth={1}
            />
          </MagicCard>
        ))}
      </div>
    </section>
  );
}
