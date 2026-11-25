"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { VerseProvider } from "./VerseProvider";
import { ConnectWallet } from "./ConnectWallet";

const TABS = [
  { href: "/verse", label: "Leaderboard" },
  { href: "/verse/quests", label: "Quests" },
  { href: "/verse/passport", label: "Passport" },
  { href: "/verse/rules", label: "Rules" },
];

export function VerseShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const active = (href: string) =>
    href === "/verse" ? pathname === "/verse" : pathname.startsWith(href);

  return (
    <VerseProvider>
      <div className="relative min-h-screen">
        <div className="scanlines pointer-events-none fixed inset-0 left-14 z-0 opacity-40" aria-hidden />
        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
          <header className="mb-10 flex flex-col gap-6 border-b border-white/[0.06] pb-6">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
                VANTH <span className="text-white/15">/</span> verse registry
              </p>
              <ConnectWallet compact />
            </div>
            <nav className="-mb-6 flex gap-1 overflow-x-auto" aria-label="Verse sections">
              {TABS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  aria-current={active(t.href) ? "page" : undefined}
                  className={`shrink-0 border-b-2 px-3 pb-3 font-mono text-xs uppercase tracking-[0.2em] transition-colors sm:px-4 ${
                    active(t.href)
                      ? "border-signal text-white"
                      : "border-transparent text-white/35 hover:text-white/70"
                  }`}
                >
                  {t.label}
                </Link>
              ))}
            </nav>
          </header>
          {children}
        </div>
      </div>
    </VerseProvider>
  );
}
