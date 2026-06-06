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
    <div>
      {/* Full-width header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 rounded-full px-4 py-1.5 mb-6">
          <span className="text-pink-400 text-xs font-semibold font-mono tracking-widest uppercase">Lore</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-wide text-white mb-4">The Story of VANTH</h1>
        <p className="text-slate-400">Where anime meets cyberpunk. Where art meets identity.</p>
      </div>

      {/* Table of contents */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <nav className="bg-[#10101e] border border-white/5 rounded-xl p-5">
          <h2 className="text-xs font-semibold font-mono text-slate-500 uppercase tracking-wider mb-3">Contents</h2>
          <ul className="space-y-1">
            {CHAPTERS.map((ch) => (
              <li key={ch.id}>
                <a
                  href={`#${ch.id}`}
                  className="flex items-center gap-3 text-sm text-slate-400 hover:text-purple-400 transition-colors py-1"
                >
                  <span className="text-slate-600 text-xs font-mono">{ch.number}</span>
                  {ch.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Chapters — alternating split layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 mb-24">
        {CHAPTERS.map((ch) => (
          <section key={ch.id} id={ch.id} className="scroll-mt-24">
            <div
              className={`flex flex-col ${ch.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-16 items-center`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative h-80 lg:h-[520px] rounded-xl overflow-hidden">
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
                  <span className="text-purple-500/60 text-sm font-mono">{ch.number}</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">{ch.title}</h2>
                <div className="space-y-4">
                  {ch.content.split("\n\n").map((para, i) => (
                    <p key={i} className="text-slate-400 leading-relaxed text-base italic">
                      {para.trim()}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Full-width CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="p-8 rounded-xl bg-gradient-to-br from-purple-900/20 to-cyan-900/10 border border-purple-500/20 text-center">
          <p className="text-slate-400 text-sm mb-1">The story continues.</p>
          <p className="text-slate-500 text-xs mb-6">More chapters coming as the collection evolves.</p>
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
