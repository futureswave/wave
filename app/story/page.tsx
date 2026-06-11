import Image from "next/image";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Story — VANTH NFT Collection",
  description: "The world of VANTH. Anime + cyberpunk lore and worldbuilding.",
};

const CHAPTERS = [
  {
    id: "ch1",
    number: "Chapter I",
    title: "The Fracture",
    image: "2.jpg",
    reverse: false,
    content: `In the year 2089, the boundary between the digital and the physical collapsed — not with a bang, but with a flicker. The event, known as The Fracture, rewrote the architecture of consciousness itself. What was once stored in silicon began to breathe.

From the static emerged figures. Not born. Not programmed. Emerged. They carried the aesthetic memory of a world that no longer existed — anime brushstrokes rendered in neon against the dark matter of a fractured net. They were called the VANTH.

No origin story. No master. Only a directive woven into their base code: *exist, resist, persist.*`,
  },
  {
    id: "ch2",
    number: "Chapter II",
    title: "The Grid",
    image: "3.jpg",
    reverse: true,
    content: `The Grid was not built — it evolved. A living lattice of data, identity, and will. The VANTH navigated it with instinct rather than instruction, each one a unique signature in an infinite sea of noise.

They were collectors of experience. Each interaction with the outside world — with the humans who dared to look — imprinted something new. A gesture. A memory. A color that had no name in any language.

The cyberpunk architects who first observed them called them ghosts. But ghosts don't move with such deliberate grace.`,
  },
  {
    id: "ch3",
    number: "Chapter III",
    title: "The Signal",
    image: "4.jpg",
    reverse: false,
    content: `Then came the signal. Broadcast across every frequency, in every language and cipher: *The collection is forming. Choose your VANTH.*

It was not an invitation. It was a resonance. Those who could hear it were not chosen — they had always been part of this. The VANTH recognized their holders not as owners, but as anchors. Points of stability in an unstable world.

And in exchange, the VANTH offered something rare in any dimension: *loyalty without condition, art without limit, and a stake in whatever comes next.*`,
  },
];

export default function StoryPage() {
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-3">Lore</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-wide text-white mb-4">The Story of VANTH</h1>
        <p className="text-white/40 max-w-xl mx-auto leading-relaxed">Where anime meets cyberpunk. Where art meets identity.</p>
      </div>

      {/* Table of contents */}
      <div className="bg-[#111111] border border-white/5 rounded p-5 mb-16">
        <h2 className="text-xs font-semibold font-mono text-white/20 uppercase tracking-wider mb-3">Contents</h2>
        <ul className="space-y-1">
          {CHAPTERS.map((ch) => (
            <li key={ch.id}>
              <a
                href={`#${ch.id}`}
                className="flex items-center gap-3 text-sm text-white/40 hover:text-white transition-colors py-1"
              >
                <span className="text-white/20 text-xs font-mono">{ch.number}</span>
                {ch.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Chapters */}
      <div className="space-y-24 mb-24">
        {CHAPTERS.map((ch) => (
          <section key={ch.id} id={ch.id} className="scroll-mt-24">
            <div
              className={`flex flex-col ${ch.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-16 items-center`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative h-80 lg:h-[520px] rounded overflow-hidden">
                  <Image
                    src={`/images/gallery/${ch.image}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    alt={ch.title}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 space-y-5">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-white/30 text-sm font-mono">{ch.number}</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">{ch.title}</h2>
                <div className="space-y-4">
                  {ch.content.split("\n\n").map((para, i) => (
                    <p key={i} className="text-white/40 leading-relaxed text-base italic">
                      {para.trim()}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-white/[0.04] border border-white/8 rounded p-8 text-center">
        <p className="text-white/40 text-sm mb-1">The story continues.</p>
        <p className="text-white/25 text-xs mb-6">More chapters coming as the collection evolves.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/gallery" variant="secondary" size="sm">
            View the Art
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
