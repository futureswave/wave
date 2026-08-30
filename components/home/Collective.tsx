import { COLLECTIVE_BENEFITS, COLLECTIVE_LEAD } from "@/lib/content/collective";
import { SOCIAL_LINKS } from "@/lib/config/links";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** PRD 7.06 — THE COLLECTIVE IS FORMING. */
export function Collective() {
  return (
    <section
      id="collective"
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-28 border-t border-white/5 scroll-mt-20"
    >
      <SectionHeading
        eyebrow="The Collective"
        title="The Collective is forming"
        lead={COLLECTIVE_LEAD}
      />

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {COLLECTIVE_BENEFITS.map((benefit) => (
          <li
            key={benefit.title}
            className="rounded border border-white/8 bg-white/[0.02] p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/50" aria-hidden>
                ◉
              </span>
              <h3 className="font-mono text-sm uppercase tracking-widest text-white">
                {benefit.title}
              </h3>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              {benefit.description}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-12 text-center">
        <a
          href={SOCIAL_LINKS.discord.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-10 py-4 text-sm font-bold uppercase tracking-widest font-mono bg-white text-black hover:bg-white/90 transition-colors rounded"
        >
          Enter the Discord
        </a>
      </div>
    </section>
  );
}
