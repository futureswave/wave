import Image from "next/image";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "About — VANTH NFT Collection",
  description: "Meet the VANTH team. Transparent, safety-first, long-term focused.",
};

export default function AboutPage() {
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
      {/* Full-width banner hero */}
      <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden">
        <Image
          src="/images/gallery/about.png"
          fill
          sizes="100vw"
          className="object-cover object-center"
          alt="About VANTH"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />
        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 lg:px-16 pb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-wide text-white mb-4">About VANTH</h1>
          <p className="text-white/60 max-w-2xl leading-relaxed text-base sm:text-lg">
            Vanth is a brand that defies conventions while staying true to the decentralized spirit of Web3. It doesn&apos;t just follow innovations—it aims to shape them. By transcending the boundaries of the digital realm, it seeks to touch your physical world as well.
          </p>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Content */}
        <section className="mb-16 space-y-6">
          <div className="bg-[#111111] border border-white/5 rounded p-6">
            <p className="text-white/60 leading-relaxed">
              For us, leadership is not a goal, but a responsibility. Because leadership requires vision, courage, and continuous growth.
            </p>
          </div>
          <div className="bg-[#111111] border border-white/5 rounded p-6">
            <p className="text-white/60 leading-relaxed">
              A high-quality appearance equates to high-quality brand value. That is why Vanth was created with a professional artistic approach to ensure the highest quality.
            </p>
          </div>
          <div className="bg-[#111111] border border-white/5 rounded p-6">
            <p className="text-white/60 leading-relaxed">
              We are proud to passionately deliver game integrations, reward-focused events, AI tools, and even more revolutionary experiences.
            </p>
          </div>
          <div className="bg-[#111111] border border-white/5 rounded p-6">
            <p className="text-white/60 leading-relaxed">
              Owning Vanth is not merely about owning an asset. It means possessing your digital passport to the Vanth universe. This passport is the key to accessing countless opportunities, experiences, and privileges within our ecosystem.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-white/[0.04] border border-white/8 rounded p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Verify Official Links</h2>
          <p className="text-white/40 text-sm mb-6">
            Always use links from this site. Never trust links from DMs or unofficial sources.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button href="/social" variant="secondary" size="sm">
              View Official Links
            </Button>
            <Button href="/whitelist" variant="primary" size="sm">
              Request Access
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
