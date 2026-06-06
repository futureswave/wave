import Image from "next/image";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { WhatIsVanth } from "@/components/home/WhatIsVanth";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { RoadmapPreview } from "@/components/home/RoadmapPreview";
import { FAQPreview } from "@/components/home/FAQPreview";
import { ScamWarningBanner } from "@/components/ui/ScamWarningBanner";
import { Button } from "@/components/ui/Button";

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
        <GalleryPreview />
        <RoadmapPreview />

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ScamWarningBanner />
        </section>

        <FAQPreview />

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Join?
          </h2>
          <p className="text-white/40 mb-8 max-w-md mx-auto">
            Secure your spot on the VANTH whitelist before launch.
          </p>
          <Button href="/whitelist" variant="primary" size="lg">
            Request Access
          </Button>
        </section>
      </div>
    </div>
  );
}