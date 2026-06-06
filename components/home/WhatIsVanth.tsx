import { Palette, Map, Coins } from "lucide-react";
import { ComingSoonBadge } from "@/components/ui/TBABadge";
import { MagicCard } from "@/components/ui/magic-card";
import { BorderBeam } from "@/components/ui/border-beam";

const cards = [
  {
    icon: Palette,
    title: "Art-First",
    description:
      "Striking anime + cyberpunk aesthetics crafted with a unique vision. Every piece is designed to stand out in any collection.",
    gradientColor: "#1a1a1a",
    beamFrom: "rgba(255,255,255,0.2)",
    beamTo: "rgba(255,255,255,0.04)",
    accent: "text-white/60",
  },
  {
    icon: Map,
    title: "Transparent Roadmap",
    description:
      "Clear milestones, measurable delivery. Our roadmap evolves openly — every update is published on official channels.",
    gradientColor: "#1a1a1a",
    beamFrom: "rgba(255,255,255,0.2)",
    beamTo: "rgba(255,255,255,0.04)",
    accent: "text-white/60",
  },
  {
    icon: Coins,
    title: "Future Staking → VNTH",
    description:
      "Holders will be able to stake VANTH NFTs to earn VNTH, a future utility token. Details and mechanics are coming soon.",
    gradientColor: "#1a1a1a",
    beamFrom: "rgba(255,255,255,0.2)",
    beamTo: "rgba(255,255,255,0.04)",
    accent: "text-white/60",
    badge: <ComingSoonBadge />,
  },
];

export function WhatIsVanth() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
      <div className="text-center mb-16">
        <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-3">The Collection</p>
        <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">What is VANTH?</h2>
        <p className="text-white/40 max-w-xl mx-auto text-lg">
<<<<<<< HEAD
          A collection where anime art, cyberpunk culture, and the power community intersect.
=======
          A collection at the intersection of anime art, cyberpunk culture, and Solana&apos;s speed.
>>>>>>> ce00058c012544fa08b4127b8be3e2c7e2963f8d
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <MagicCard
            key={card.title}
            gradientColor={card.gradientColor}
            gradientOpacity={1}
            className="relative rounded border-white/8 bg-[#111111] overflow-hidden"
          >
            <div className="p-7">
              <card.icon className={`w-8 h-8 ${card.accent} mb-5`} />
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-white">{card.title}</h3>
                {card.badge}
              </div>
              <p className="text-white/40 leading-relaxed">{card.description}</p>
            </div>
            <BorderBeam
              colorFrom={card.beamFrom}
              colorTo={card.beamTo}
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
