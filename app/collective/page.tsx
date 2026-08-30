import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COLLECTIVE_BENEFITS, COLLECTIVE_LEAD } from "@/lib/content/collective";
import { SOCIAL_LINKS } from "@/lib/config/links";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "The Collective",
  description:
    "The Collective is forming. Early members won't just watch VANTH being built — they'll help shape it.",
};

export default function CollectivePage() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none fixed top-0 right-0 bottom-0 left-14 z-0"
        aria-hidden
      >
        <Image
          src="/images/optimized/background2.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/85" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-16">
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/40 mb-3">
            The Collective
          </p>
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-display mb-5">
            The Collective
            <br />
            is forming
          </h1>
          <p className="text-white/60 max-w-2xl text-lg leading-relaxed">
            {COLLECTIVE_LEAD}
          </p>
        </header>

        <section className="border-t border-white/5 pt-16">
          <SectionHeading
            eyebrow="Membership"
            title="What members get"
            lead="The Collective is not an audience. It is the layer the universe is built on top of."
            align="left"
          />

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {COLLECTIVE_BENEFITS.map((benefit) => (
              <li
                key={benefit.title}
                className="rounded-xl border border-white/8 bg-white/[0.02] p-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white/50" aria-hidden>
                    ◉
                  </span>
                  <h3 className="font-mono text-sm uppercase tracking-widest text-white">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-white/55 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-white/5 mt-16 pt-16 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-display mb-8">
            Enter the Discord
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={SOCIAL_LINKS.discord.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 text-sm font-bold uppercase tracking-widest font-mono bg-white text-black hover:bg-white/90 transition-colors rounded w-full sm:w-auto"
            >
              Enter the Discord
            </a>
            <Link
              href="/whitelist"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 text-sm font-bold uppercase tracking-widest font-mono border border-white/20 text-white/80 hover:border-white/50 hover:text-white transition-colors rounded w-full sm:w-auto"
            >
              Request Access <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
