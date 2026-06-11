"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { VISION_CARDS } from "@/lib/vision-cards";
import { VisionModal } from "@/components/ui/VisionModal";

export function RoadmapPreview() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 border-t border-white/5">
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-2">Where We&apos;re Headed</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-2">Our Vision</h2>
          <p className="text-white/35 text-base">Six pillars. One universe.</p>
        </div>
        <Link
          href="/roadmap"
          className="hidden sm:flex items-center gap-2 text-white/50 hover:text-white font-mono text-sm transition-colors group"
        >
          Explore Vision <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {VISION_CARDS.map((card, i) => (
          <button
            key={card.num}
            onClick={() => setSelectedIndex(i)}
            className="relative rounded-xl overflow-hidden aspect-[3/4] group text-left"
          >
            <Image
              src={card.image}
              fill
              sizes="(max-width: 768px) 33vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              alt={card.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white/25 font-mono text-xs leading-none mb-0.5">{card.num}</p>
              <p className="text-white font-black text-sm tracking-wide">{card.title}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link href="/roadmap" className="inline-flex items-center gap-2 text-white/50 font-mono text-sm">
          Explore Vision <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {selectedIndex !== null && (
        <VisionModal
          card={VISION_CARDS[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </section>
  );
}
