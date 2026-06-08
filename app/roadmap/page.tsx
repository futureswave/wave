"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, CheckCircle, Loader, Clock } from "lucide-react";
import { TBABadge } from "@/components/ui/TBABadge";
import { SOCIAL_LINKS } from "@/lib/config/links";

const VISION_CARDS = [
  {
    num: "01",
    title: "Brand",
    image: "/images/gallery/1.jpg",
    description: "A Web3 brand that defies conventions and shapes the future.",
  },
  {
    num: "02",
    title: "Art",
    image: "/images/gallery/2.jpg",
    description: "High-quality anime + cyberpunk artwork crafted with vision.",
  },
  {
    num: "03",
    title: "Community",
    image: "/images/gallery/3.jpg",
    description: "DAO, exclusive events, and reward-focused holder experiences.",
  },
  {
    num: "04",
    title: "Token",
    image: "/images/gallery/4.jpg",
    description: "VNTH Token airdrop and staking for long-term holders.",
  },
  {
    num: "05",
    title: "AI & AR",
    image: "/images/gallery/5.jpg",
    description: "Animate your NFT in the real world with AI and AR integration.",
  },
  {
    num: "06",
    title: "Game",
    image: "/images/gallery/6.jpg",
    description: "Play-to-earn game featuring NFTs as in-game characters.",
  },
];

const phases = [
  {
    id: 0,
    name: "Phase 0",
    title: "Foundation",
    status: "complete",
    items: [
      "Create a unique narrative and artistic vision for each special character in the collection.",
      "Build a strong community on social platforms (Twitter and Discord).",
      "Design and finalize the artwork, take inspiration from the best and ensure high quality.",
      "Collaborate with DAOs and other NFT projects to best promote the project.",
      "Integrate AI chatbots on our Discord server to instantly answer questions.",
      "Open the first mint phase to whitelisted contributors, followed by a fair public sale.",
      "Early adopters gain first access to key roles and interactive features.",
      "Special incentive services for Rare and Legend NFT owners.",
    ],
  },
  {
    id: 1,
    name: "Phase 1",
    title: "Launch & Community",
    status: "active",
    items: [
      "Assign specific roles to each owner and create a dedicated DAO.",
      "Special events within the project, raffles and access to decision-making.",
      "Staking operations initiated — at least 80% of secondary market revenues paid back via staking.",
      "Develop policies to protect the floor price and maintain stability.",
      "VNTH Token Launch: the VNTH token will be released to Vanth holders via airdrop.",
      "Collaborations: partner with established NFT collections for cross-community benefits.",
    ],
  },
  {
    id: 2,
    name: "Phase 2",
    title: "Utility & Expansion",
    status: "upcoming",
    items: [
      "AI + AR integrations: animate your NFT in the real world with the phone camera.",
      "Game integration: develop a play-to-earn (P2E) game featuring NFTs as in-game characters.",
      "Private chat rooms created for owners to network and keep the community alive.",
      "Community-produced stories, songs and fan art — best contributions get rewarded.",
      "Workshops with Web3 experts and career counselling opportunities for holders.",
    ],
    tba: true,
  },
];

const statusConfig = {
  complete: { icon: CheckCircle, color: "text-white/60", bg: "bg-white/5 border-white/10", label: "Complete" },
  active: { icon: Loader, color: "text-white", bg: "bg-white/8 border-white/15", label: "In Progress" },
  upcoming: { icon: Clock, color: "text-white/25", bg: "bg-[#111111] border-white/5", label: "Upcoming" },
};

export default function RoadmapPage() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + VISION_CARDS.length) % VISION_CARDS.length);
  const next = () => setActive((i) => (i + 1) % VISION_CARDS.length);

  return (
    <div>
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-black tracking-wide text-white mb-4">Our Vision</h1>
        <p className="text-white/40 max-w-xl mx-auto leading-relaxed">
          Six pillars that define where Vanth is headed — and what we are building for our holders.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative px-4 sm:px-10 lg:px-20 pb-16">
        {/* Cards track */}
        <div className="flex items-center justify-center gap-4 overflow-hidden">
          {VISION_CARDS.map((card, i) => {
            const offset = i - active;
            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            return (
              <button
                key={card.num}
                onClick={() => setActive(i)}
                className={`relative shrink-0 rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer
                  ${isActive ? "w-[280px] sm:w-[300px] h-[420px] scale-105 z-10 ring-1 ring-white/20" : "w-[200px] sm:w-[220px] h-[340px] scale-95 opacity-50 z-0"}
                `}
                style={{ outline: "none" }}
              >
                <Image
                  src={card.image}
                  fill
                  sizes="300px"
                  className="object-cover"
                  alt={card.title}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white/20 font-mono text-4xl font-black leading-none mb-2">{card.num}</p>
                  <h3 className="text-white font-black text-xl tracking-wide mb-1">{card.title}</h3>
                  {isActive && (
                    <p className="text-white/50 text-xs leading-relaxed">{card.description}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Prev / Next */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-7 h-7" />
        </button>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {VISION_CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${i === active ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"}`}
              aria-label={`Go to ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-white/5 mb-16" />
      </div>

      {/* Roadmap Phases */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-white mb-3">Roadmap</h2>
        <p className="text-white/40 text-sm mb-10">
          Clear milestones, measurable delivery. All updates are published on official channels.
        </p>

        <div className="space-y-6">
          {phases.map((phase) => {
            const config = statusConfig[phase.status as keyof typeof statusConfig];
            return (
              <div key={phase.id} className={`border rounded-2xl p-6 sm:p-8 ${config.bg}`}>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <config.icon className={`w-4 h-4 ${config.color}`} />
                      <span className={`text-xs font-mono uppercase tracking-wider ${config.color}`}>
                        {phase.name} — {config.label}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                  </div>
                  {phase.tba && <TBABadge label="Details TBA" />}
                </div>
                <ul className="space-y-3">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/40">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${phase.status === "complete" ? "bg-white/50" : phase.status === "active" ? "bg-white" : "bg-white/15"}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-10 p-4 rounded bg-white/3 border border-white/8">
          <p className="text-white/35 text-sm text-center font-mono">
            <span className="text-white/60 font-semibold">Transparency note:</span> This roadmap may evolve.
            All changes will be announced on{" "}
            <a href={SOCIAL_LINKS.x.url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white hover:underline">X</a> and{" "}
            <a href={SOCIAL_LINKS.discord.url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white hover:underline">Discord</a> before being reflected here.
          </p>
        </div>
      </div>
    </div>
  );
}
