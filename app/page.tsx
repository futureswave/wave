import Image from "next/image";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { WhatIsVanth } from "@/components/home/WhatIsVanth";
import { RoadmapPreview } from "@/components/home/RoadmapPreview";
import { FAQPreview } from "@/components/home/FAQPreview";

export default function HomePage() {
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
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/75" />
      </div>

      <div className="relative z-10">
        <Hero />
        <TrustBar />
        <WhatIsVanth />
        <RoadmapPreview />

        <FAQPreview />
      </div>
    </div>
  );
}