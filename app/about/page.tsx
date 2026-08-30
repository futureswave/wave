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
          src="/images/optimized/background.webp"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/75" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Minimal page header */}
        <div className="pt-16 pb-10 text-center">
          <span className="text-[10px] tracking-[0.35em] text-white/45 uppercase font-medium mb-5 block">
            The Collective
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black tracking-wide text-white mb-6 leading-none">
            About VANTH
          </h1>
          <div className="flex items-center justify-center gap-3 mb-7">
            <div className="h-px w-16 bg-white/10" />
            <div className="w-[3px] h-[3px] rounded-full bg-white/20" />
            <div className="h-px w-16 bg-white/10" />
          </div>
          <p className="text-white/45 max-w-lg mx-auto text-base sm:text-lg leading-relaxed">
            A brand that defies conventions while staying true to the decentralized spirit of Web3. It doesn&apos;t just follow innovations — it aims to shape them.
          </p>
        </div>

        {/* Featured image — framed, contained */}
        <div className="mb-16">
          <div className="relative w-full aspect-[16/7] overflow-hidden rounded border border-white/[0.07] shadow-[0_8px_48px_rgba(0,0,0,0.7)]">
            <Image
              src="/images/optimized/about.webp"
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover object-center"
              alt="About VANTH"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/25 to-transparent" />
          </div>
        </div>

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
        <div className="bg-white/[0.04] border border-white/8 rounded p-8 text-center mb-16">
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
  );
}
