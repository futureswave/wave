import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { createServiceClient } from "@/lib/supabase";
import { validateSolanaWallet } from "@/lib/validation";
import { fetchUserStanding, getActiveSeason, lifetimeXp } from "@/lib/verse/data";
import { levelFor, shortWallet } from "@/lib/verse/levels";
import { Glyph } from "@/components/verse/bits";

export const dynamic = "force-dynamic";

const loadProfile = cache(async (wallet: string) => {
  if (validateSolanaWallet(wallet)) return null;
  const sb = createServiceClient();
  const { data: user } = await sb
    .from("verse_users")
    .select("id, wallet, display_name, is_public, flagged, created_at")
    .eq("wallet", wallet)
    .maybeSingle();
  // Private profiles behave exactly like missing ones.
  if (!user || !user.is_public) return null;

  const season = await getActiveSeason(sb);
  const [standing, lifetime, completions] = await Promise.all([
    fetchUserStanding(sb, season?.id ?? null, user.id),
    lifetimeXp(sb, user.id),
    sb
      .from("verse_quest_completions")
      .select("id, completed_at, verse_quests ( title, xp )")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(12),
  ]);
  return { user, season, standing, lifetime, completions: completions.data ?? [] };
});

export async function generateMetadata({ params }: { params: Promise<{ wallet: string }> }): Promise<Metadata> {
  const { wallet } = await params;
  const p = await loadProfile(wallet);
  if (!p) return { title: "Passport — VANTH Verse", robots: { index: false } };
  const name = p.user.display_name ?? shortWallet(p.user.wallet);
  const rank = p.standing.rank ? `Rank #${p.standing.rank} · ` : "";
  return {
    title: `${name} — Vanth Passport`,
    description: `${rank}${p.lifetime} XP in the VANTH Verse.`,
    robots: { index: false, follow: true },
    openGraph: { title: `${name} — Vanth Passport`, description: `${rank}${p.lifetime} XP in the VANTH Verse.` },
  };
}

export default async function PublicPassportPage({ params }: { params: Promise<{ wallet: string }> }) {
  const { wallet } = await params;
  const p = await loadProfile(wallet);
  if (!p) notFound();

  const level = levelFor(p.lifetime);
  const name = p.user.display_name ?? shortWallet(p.user.wallet);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-sm border border-white/[0.07] bg-[#0f0f0f]/90 p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-signal/10 blur-3xl" aria-hidden />
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-white/40">Vanth Passport</p>
        <div className="mb-10 flex items-center gap-4">
          <Glyph seed={shortWallet(p.user.wallet)} size={64} />
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-bold text-white sm:text-4xl">{name}</h1>
            <p className="font-mono text-xs text-white/35">
              {shortWallet(p.user.wallet)} · since {new Date(p.user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: p.season ? "Season rank" : "Rank", value: p.standing.rank ? `#${p.standing.rank}` : "—" },
            { label: "Lifetime XP", value: p.lifetime.toLocaleString("en-US") },
            { label: "Level", value: `${level.level} · ${level.title}` },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">{s.label}</p>
              <p className="mt-1 font-mono text-xl font-bold text-white sm:text-2xl">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
          <div className="h-full bg-signal" style={{ width: `${Math.round(level.progress * 100)}%` }} />
        </div>
      </div>

      <div className="mt-6 rounded-sm border border-white/[0.07] bg-[#0f0f0f]/90">
        <p className="border-b border-white/[0.06] px-5 py-4 font-mono text-xs uppercase tracking-[0.3em] text-white/40">
          Completed quests
        </p>
        {p.completions.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-white/45">No completed quests yet.</p>
        ) : (
          <ul>
            {p.completions.map((c) => {
              const q = c.verse_quests as unknown as { title: string; xp: number } | null;
              return (
                <li key={c.id} className="flex justify-between gap-4 border-b border-white/[0.04] px-5 py-3 last:border-0">
                  <span className="truncate text-sm text-white/80">{q?.title ?? "Quest"}</span>
                  <span className="shrink-0 font-mono text-xs text-emerald-400">+{q?.xp ?? 0} XP</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="mt-8 text-center">
        <Link href="/verse" className="font-mono text-xs uppercase tracking-widest text-white/40 hover:text-white">
          ← Back to the leaderboard
        </Link>
      </p>
    </div>
  );
}
