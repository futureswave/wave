import Link from "next/link";
import { ShieldAlert, ExternalLink } from "lucide-react";
import { SOCIAL_LINKS, SITE_CONFIG } from "@/lib/config/links";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * PRD 7.10 — VERIFY VANTH. Every URL here comes from lib/config/links.ts so the
 * official-links list can never drift from /social.
 */
const OFFICIAL = [
  { label: "Official Website", value: "vanthverse.com", href: "https://vanthverse.com" as string | null },
  { label: "Official X", value: SOCIAL_LINKS.x.handle, href: SOCIAL_LINKS.x.url },
  { label: "Official Discord", value: "discord.gg/vanth", href: SOCIAL_LINKS.discord.url },
  {
    label: "Official Mint",
    value: SITE_CONFIG.mintVenue,
    href: SOCIAL_LINKS.mintVenue.url,
  },
];

export function Security() {
  return (
    <section
      id="security"
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28 border-t border-white/5 scroll-mt-20"
    >
      <SectionHeading
        eyebrow="Security"
        title="Verify VANTH"
        lead="These are the only channels we operate. Anything else is not us, however convincing it looks."
      />

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {OFFICIAL.map((item) => (
          <li
            key={item.label}
            className="rounded border border-white/8 bg-white/[0.02] px-5 py-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1.5">
              {item.label}
            </p>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm text-white/80 hover:text-white transition-colors"
              >
                {item.value} <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="font-mono text-sm text-white/60">{item.value}</span>
            )}
          </li>
        ))}
      </ul>

      <div className="rounded border border-white/15 bg-white/[0.04] p-6">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-white/60 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-white mb-2 font-mono text-sm uppercase tracking-widest">
              Never trust unofficial links
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-1">
              VANTH will never ask for your seed phrase. We will never DM you
              first on any platform.
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              {SITE_CONFIG.scamWarning.body}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/social"
          className="inline-flex items-center gap-2 font-mono text-sm text-white/50 hover:text-white transition-colors"
        >
          View all official links →
        </Link>
      </div>
    </section>
  );
}
