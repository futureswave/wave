import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { SOCIAL_LINKS, SITE_CONFIG } from "@/lib/config/links";

export function Footer() {
  return (
    <footer className="relative z-20 bg-[#0a0a0a] border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="flex-1 max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <Image src="/images/gallery/logo.png" width={24} height={24} alt="VANTH" className="opacity-70" />
              <span className="text-lg font-black tracking-[0.2em] text-white/80 font-mono">VANTH</span>
            </div>
            <p className="text-white/25 text-sm leading-relaxed mb-4">
              {SITE_CONFIG.tagline}
            </p>
            <Link
              href="/whitelist"
              className="inline-flex items-center px-4 py-2 text-xs font-bold bg-white text-black hover:bg-white/90 transition-colors rounded"
            >
              Request Access
            </Link>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            {/* Navigation */}
            <div>
              <h4 className="text-xs font-mono text-white/20 uppercase tracking-widest mb-3">Pages</h4>
              <ul className="space-y-2">
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
              <h4 className="text-xs font-mono text-white/20 uppercase tracking-widest mb-3">Community</h4>
              <ul className="space-y-2">
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
                <li>
                  <Link href="/social" className="text-white/30 hover:text-white text-sm transition-colors">
                    Official Links
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
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
