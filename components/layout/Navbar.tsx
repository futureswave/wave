"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BorderBeam } from "@/components/ui/border-beam";
import { ComingSoonBadge } from "@/components/ui/TBABadge";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/story", label: "Story" },
  { href: "/vision", label: "Vision" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#080810]/70 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Zap className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            </div>
            <span className="text-xl font-black tracking-[0.2em] text-white group-hover:text-purple-300 transition-colors">
              VANTH
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 text-sm font-medium font-mono tracking-wider transition-all duration-200 rounded-lg ${
                  pathname === link.href
                    ? "text-purple-400"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                {pathname === link.href && (
                  <span className="absolute inset-0 rounded-lg bg-purple-500/10" />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/stake"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-white/8 text-slate-500 hover:text-slate-300 hover:border-white/15 transition-all duration-200"
            >
              Stake <ComingSoonBadge />
            </Link>
            <Link href="/whitelist">
              <ShimmerButton
                shimmerColor="#a855f7"
                shimmerDuration="3s"
                background="linear-gradient(135deg, #7c3aed, #6d28d9)"
                borderRadius="12px"
                className="px-5 py-2.5 text-sm font-bold text-white"
              >
                Request Access
              </ShimmerButton>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0d0d1a]/95 backdrop-blur-xl border-t border-white/5">
          <nav className="px-4 py-4 space-y-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  pathname === link.href
                    ? "text-purple-400 bg-purple-500/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 space-y-2 border-t border-white/5 mt-3">
              <Link
                href="/stake"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium rounded-xl border border-white/8 text-slate-500"
              >
                Stake <ComingSoonBadge />
              </Link>
              <Link href="/whitelist" onClick={() => setMobileOpen(false)}>
                <ShimmerButton
                  shimmerColor="#a855f7"
                  shimmerDuration="3s"
                  background="linear-gradient(135deg, #7c3aed, #6d28d9)"
                  borderRadius="12px"
                  className="w-full py-3 text-sm font-bold text-white justify-center"
                >
                  Request Access
                </ShimmerButton>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
