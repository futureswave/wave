"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface VisionCard {
  num: string;
  title: string;
  image: string;
  description: string;
}

interface VisionModalProps {
  card: VisionCard;
  onClose: () => void;
}

export function VisionModal({ card, onClose }: VisionModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-vision-modal"
        style={{ maxHeight: "80vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full aspect-[3/4]">
          <Image
            src={card.image}
            fill
            sizes="420px"
            className="object-cover"
            alt={card.title}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/50 text-white/60 hover:text-white hover:bg-black/80 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-white/20 font-mono text-5xl font-black leading-none mb-3">{card.num}</p>
            <h3 className="text-white font-black text-2xl tracking-wide mb-2">{card.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{card.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
