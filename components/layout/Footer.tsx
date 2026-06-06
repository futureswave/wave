import Link from "next/link";
import { ExternalLink, Zap, ShieldAlert } from "lucide-react";
import { SOCIAL_LINKS, SITE_CONFIG } from "@/lib/config/links";

export function Footer() {
  return (
    <footer className="relative z-20 bg-[#0a0a0a] border-t border-white/5 mt-auto">
      {/* Scam warning strip */}
      <div className="bg-white/[0.03] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-white/40" />
            <span className="font-semibold text-white/50 font-mono text-xs">{SITE_CONFIG.scamWarning.title}:</span>
            <span className="text-white/25 text-xs font-mono">{SITE_CONFIG.scamWarning.body}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-white/50" />
              <span className="text-lg font-black tracking-[0.2em] text-white/80 font-mono">VANTH</span>
            </div>
            <p className="text-white/25 text-sm leading-relaxed mb-5 max-w-xs">
              {SITE_CONFIG.tagline}
            </p>
            <Link
              href="/whitelist"
              className="inline-flex items-center px-4 py-2 text-xs font-bold bg-white text-black hover:bg-white/90 transition-colors rounded"
            >
              Request Access
            </Link>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-mono text-white/20 uppercase tracking-widest mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              {[
                ["Gallery", "/gallery"],
                ["Roadmap", "/roadmap"],
                ["Story", "/story"],
                ["Vision", "/vision"],
                ["About", "/about"],
                ["FAQ", "/faq"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-white/30 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-mono text-white/20 uppercase tracking-widest mb-4">Community</h4>
            <ul className="space-y-2.5">
              <li>
                <a href={SOCIAL_LINKS.x.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/30 hover:text-white text-sm transition-colors">
                  <ExternalLink className="w-3 h-3" /> X (Twitter)
                </a>
              </li>
              <li>
                <a href={SOCIAL_LINKS.discord.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/30 hover:text-white text-sm transition-colors">
                  <ExternalLink className="w-3 h-3" /> Discord
                </a>
              </li>
              <li>
                <a href={SOCIAL_LINKS.gitbook.meetVanth.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/30 hover:text-white text-sm transition-colors">
                  <ExternalLink className="w-3 h-3" /> GitBook
                </a>
              </li>
            </ul>
          </div>

          {/* Safety */}
          <div>
            <h4 className="text-xs font-mono text-white/20 uppercase tracking-widest mb-4">Safety</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/social" className="text-white/30 hover:text-white text-sm transition-colors">
                  Official Links
                </Link>
              </li>
              <li>
                <Link href="/whitelist#privacy" className="text-white/30 hover:text-white text-sm transition-colors">
                  Privacy Notice
                </Link>
              </li>
              <li>
                <Link href="/faq#scam" className="text-white/30 hover:text-white text-sm transition-colors">
                  Anti-Scam Guide
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/15 text-xs font-mono">
            © 2026 VANTH · All rights reserved
          </p>
          <p className="text-white/10 text-xs font-mono">
            Mint Venue: TBA
          </p>
        </div>
      </div>
    </footer>
  );
}
