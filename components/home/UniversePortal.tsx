import Link from "next/link";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";

// PRD 7.04 — four doors into the universe.
const GATES = [
  {
    label: "The Origin",
    href: "/universe#origin",
    caption: "How the VANTHVERSE surfaced",
  },
  {
    label: "The Districts",
    href: "/universe#districts",
    caption: "Neo Arcadia to the Outer Grid",
  },
  {
    label: "The Factions",
    href: "/universe#factions",
    caption: "Rebels, Synths, Guardians, Unknown",
  },
  {
    label: "The Collective",
    href: "/collective",
    caption: "The community's role in the world",
  },
];

export function UniversePortal() {
  return (
    <section className="relative py-28 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 z-0" aria-hidden>
        <Image
          src="/images/optimized/background2.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Enter the Universe"
          title="The Vanthverse awaits"
          lead="Beyond the collection exists a universe waiting to be discovered."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GATES.map((gate) => (
            <Link
              key={gate.href}
              href={gate.href}
              className="group relative rounded border border-white/10 bg-black/40 backdrop-blur-sm p-7 transition-colors hover:border-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
                {gate.caption}
              </p>
              <p className="text-2xl font-black uppercase tracking-display text-white/80 group-hover:text-white transition-colors">
                {gate.label}
              </p>
              <span
                className="absolute bottom-6 right-7 font-mono text-white/25 group-hover:text-white/70 group-hover:translate-x-1 transition-all"
                aria-hidden
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
