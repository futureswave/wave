import Image from "next/image";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { CollectionPreview } from "@/components/home/CollectionPreview";
import { WhatIsVanth } from "@/components/home/WhatIsVanth";
// Hidden while /universe is being reworked:
// import { UniversePortal } from "@/components/home/UniversePortal";
import { DigitalPassport } from "@/components/home/DigitalPassport";
import { Collective } from "@/components/home/Collective";
import { Evolution } from "@/components/home/Evolution";
import { RoadmapPreview } from "@/components/home/RoadmapPreview";
import { RequestAccessCTA } from "@/components/home/RequestAccessCTA";
import { Security } from "@/components/home/Security";
import { FAQPreview } from "@/components/home/FAQPreview";

// Section order follows the PRD homepage wireframe:
// hero → collection → what is VANTH → passport → collective →
// evolution → vision → request access → security → FAQ.
export default function HomePage() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none fixed top-0 right-0 bottom-0 left-14 z-0"
        aria-hidden
      >
        <Image
          src="/images/optimized/background.webp"
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
        <CollectionPreview />
        <WhatIsVanth />
        {/* <UniversePortal /> */}
        <DigitalPassport />
        <Collective />
        <Evolution />
        <RoadmapPreview />
        <RequestAccessCTA />
        <Security />
        <FAQPreview />
      </div>
    </div>
  );
}
