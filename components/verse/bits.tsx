"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-white/40">{children}</p>;
}

export function Panel({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <div className={`rounded-sm border border-white/[0.07] bg-[#0f0f0f]/90 ${className}`}>{children}</div>;
}

export function RankDelta({ delta }: { delta: number | null }) {
  if (delta === null) {
    return <span className="font-mono text-[10px] uppercase tracking-widest text-signal">new</span>;
  }
  if (delta === 0) return <Minus className="h-3 w-3 text-white/20" aria-label="No change" />;
  const up = delta > 0;
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <span
      className={`inline-flex items-center gap-0.5 font-mono text-[11px] ${up ? "text-emerald-400" : "text-red-400/80"}`}
      aria-label={`${up ? "Up" : "Down"} ${Math.abs(delta)}`}
    >
      <Icon className="h-3 w-3" />
      {Math.abs(delta)}
    </span>
  );
}

/** Wallet-derived glyph so every row has a stable "avatar" without storing images. */
export function Glyph({ seed, size = 32 }: { seed: string; size?: number }) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const hue = 250 + (h % 70); // stays in the violet/indigo family
  const cells = Array.from({ length: 9 }, (_, i) => (h >> i) & 1);
  return (
    <span
      className="grid shrink-0 grid-cols-3 gap-px overflow-hidden rounded-sm border border-white/10 bg-black/40 p-[3px]"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {cells.map((on, i) => (
        <span key={i} style={{ background: on ? `hsl(${hue} 70% ${45 + (i % 3) * 8}%)` : "transparent" }} />
      ))}
    </span>
  );
}

export function useCountdown(target: string | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!target) return;
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, [target]);
  if (!target) return null;
  const ms = Math.max(0, Date.parse(target) - now);
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return { ms, label: d > 0 ? `${d}d ${h}h` : `${h}h ${m}m` };
}

export function formatXp(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function timeAgo(iso: string) {
  const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
