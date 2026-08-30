import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CHAPTERS } from "@/lib/content/lore";
import { DISTRICTS, FACTIONS, ORIGIN } from "@/lib/content/universe";
import { DistrictMap } from "@/components/universe/DistrictMap";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Universe",
  description:
    "The VANTHVERSE: its origin, its districts, its factions, and the characters that move between them.",
};

const NAV = [
  { href: "#origin", label: "The Origin" },
  { href: "#districts", label: "The Districts" },
  { href: "#factions", label: "The Factions" },
  { href: "#characters", label: "The Characters" },
];

export default function UniversePage() {
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
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/85" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/40 mb-3">
            Enter the Universe
          </p>
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-display mb-5">
            The Vanthverse
          </h1>
          <p className="text-white/55 max-w-2xl text-lg leading-relaxed mb-8">
            Beyond the collection exists a universe waiting to be discovered.
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </header>

        {/* The Origin */}
        <section
          id="origin"
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5 scroll-mt-8"
        >
          <SectionHeading
            eyebrow="01"
            title={ORIGIN.title}
            lead={ORIGIN.lead}
            align="left"
          />

          <div className="max-w-2xl space-y-5 mb-16">
            {ORIGIN.body.map((paragraph) => (
              <p key={paragraph} className="text-white/60 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* The founding chapters, previously the standalone /story page. */}
          <div className="space-y-16">
            {CHAPTERS.map((chapter) => (
              <article
                key={chapter.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div
                  className={`relative aspect-[4/5] rounded-xl overflow-hidden border border-white/10 ${
                    chapter.reverse ? "md:order-2" : ""
                  }`}
                >
                  <Image
                    src={chapter.image}
                    alt={chapter.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
                    {chapter.number}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-display text-white mb-5">
                    {chapter.title}
                  </h3>
                  <div className="space-y-4">
                    {chapter.content.split("\n\n").map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 40)}
                        className="text-white/60 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* The Districts */}
        <section
          id="districts"
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5 scroll-mt-8"
        >
          <SectionHeading
            eyebrow="02"
            title="The Districts"
            lead="Four regions of the Grid. Select a marker to read its record."
            align="left"
          />
          <DistrictMap districts={DISTRICTS} />
        </section>

        {/* The Factions */}
        <section
          id="factions"
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5 scroll-mt-8"
        >
          <SectionHeading
            eyebrow="03"
            title="The Factions"
            lead="Not teams. Answers to the same question, arrived at separately."
            align="left"
          />
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FACTIONS.map((faction) => (
              <li
                key={faction.slug}
                className="rounded-xl border border-white/8 bg-white/[0.02] p-6"
              >
                <h3 className="text-xl font-black uppercase tracking-display text-white mb-1">
                  {faction.name}
                </h3>
                <p className="font-mono text-[11px] tracking-[0.15em] text-white/45 mb-4">
                  {faction.creed}
                </p>
                <p className="text-white/55 text-sm leading-relaxed">
                  {faction.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* The Characters */}
        <section
          id="characters"
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5 scroll-mt-8"
        >
          <SectionHeading
            eyebrow="04"
            title="The Characters"
            lead="Every district and faction resolves to individuals. The register is open."
            align="left"
          />
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-widest font-mono bg-white text-black hover:bg-white/90 transition-colors rounded"
          >
            Enter the Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
