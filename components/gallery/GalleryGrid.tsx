"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "./Lightbox";
import { trackEvent } from "@/lib/analytics";

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
}

const GALLERY_ITEMS: GalleryItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  src: `/images/gallery/${i + 1}.jpg`,
  alt: `VANTH NFT #${i + 1}`,
}));

export function GalleryGrid() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  function openLightbox(index: number) {
    setSelectedIndex(index);
    trackEvent("view_gallery_lightbox");
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {GALLERY_ITEMS.map((item, index) => (
          <button
            key={item.id}
            onClick={() => openLightbox(index)}
            className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#10101e]"
            aria-label={`View ${item.alt}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-start p-3">
              <span className="text-white text-xs font-bold">VANTH #{item.id}</span>
            </div>
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <Lightbox
          items={GALLERY_ITEMS}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNavigate={setSelectedIndex}
        />
      )}
    </>
  );
}
