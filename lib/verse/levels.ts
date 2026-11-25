// Display-only level derived from lifetime XP. Levels carry no financial
// meaning and say nothing about NFT rarity (PRD §4 non-goals).

export const LEVELS = [
  { level: 1, title: "Static", xp: 0 },
  { level: 2, title: "Flicker", xp: 50 },
  { level: 3, title: "Signal", xp: 150 },
  { level: 4, title: "Runner", xp: 350 },
  { level: 5, title: "Anchor", xp: 700 },
  { level: 6, title: "Archivist", xp: 1200 },
  { level: 7, title: "Resonant", xp: 2000 },
] as const;

export function levelFor(xp: number) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xp) idx = i;
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1] ?? null;
  const progress = next ? (xp - current.xp) / (next.xp - current.xp) : 1;
  return { level: current.level, title: current.title, next, toNext: next ? next.xp - xp : 0, progress };
}

export function shortWallet(w: string): string {
  return w.length > 10 ? `${w.slice(0, 4)}…${w.slice(-4)}` : w;
}
