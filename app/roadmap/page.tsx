"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { VISION_CARDS } from "@/lib/vision-cards";
import { VisionModal } from "@/components/ui/VisionModal";

export default function RoadmapPage() {
  const [active, setActive] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const prev = () => setActive((i) => (i - 1 + VISION_CARDS.length) % VISION_CARDS.length);
  const next = () => setActive((i) => (i + 1) % VISION_CARDS.length);

  return (
    <div className="relative">
      <div
        className="pointer-events-none fixed top-0 right-0 bottom-0 left-14 z-0"
        aria-hidden
      >
        <Image
          src="/images/gallery/background.png"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/75" />
      </div>

      <div className="relative z-10">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-black tracking-wide text-white mb-4">Our Vision</h1>
        <p className="text-white/40 max-w-xl mx-auto leading-relaxed">
          Six pillars that define where Vanth is headed — and what we are building for our holders.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative px-4 sm:px-10 lg:px-20 pb-24">
        <div className="flex items-center justify-center gap-4 overflow-hidden">
          {VISION_CARDS.map((card, i) => {
            const offset = i - active;
            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            return (
              <button
                key={card.num}
                onClick={() => {
                  if (isActive) {
                    setModalIndex(i);
                  } else {
                    setActive(i);
                  }
                }}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {isActive && (
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white/50">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                )}

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

      {modalIndex !== null && (
        <VisionModal
          card={VISION_CARDS[modalIndex]}
          onClose={() => setModalIndex(null)}
        />
      )}
      </div>
    </div>
  );
}
