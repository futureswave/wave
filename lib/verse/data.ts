import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { shortWallet } from "./levels";
import type { LeaderRow, SeasonInfo } from "./types";

type DbLeaderRow = {
  user_id: string;
  wallet: string;
  display_name: string | null;
  is_public: boolean;
  xp: number;
  quests_completed: number;
  reached_at: string;
  rank: number;
};

const DELTA_WINDOW_MS = 24 * 60 * 60 * 1000;

export function toSeasonInfo(row: Record<string, unknown>): SeasonInfo {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    startsAt: row.starts_at as string,
    endsAt: row.ends_at as string,
    status: row.status as SeasonInfo["status"],
    rewardsText: (row.rewards_text as string | null) ?? null,
  };
}

/** The running season, if any. */
export async function getActiveSeason(sb: SupabaseClient): Promise<SeasonInfo | null> {
  const now = new Date().toISOString();
  const { data } = await sb
    .from("verse_seasons")
    .select("*")
    .eq("status", "active")
    .lte("starts_at", now)
    .gte("ends_at", now)
    .maybeSingle();
  return data ? toSeasonInfo(data) : null;
}

function toLeaderRow(r: DbLeaderRow, delta: number | null, youId?: string): LeaderRow {
  return {
    rank: Number(r.rank),
    wallet: r.is_public ? r.wallet : null,
    short: shortWallet(r.wallet),
    name: r.display_name,
    xp: Number(r.xp),
    quests: Number(r.quests_completed),
    delta,
    isYou: youId ? r.user_id === youId : undefined,
  };
}

/** Rank movement over the last 24h for the given rows. */
async function attachDeltas(
  sb: SupabaseClient,
  season: string | null,
  rows: DbLeaderRow[],
  youId?: string,
): Promise<LeaderRow[]> {
  if (!rows.length) return [];
  const asOf = new Date(Date.now() - DELTA_WINDOW_MS).toISOString();
  const { data: prev } = await sb
    .rpc("verse_leaderboard", { p_season: season, p_as_of: asOf })
    .in("user_id", rows.map((r) => r.user_id));
  const prevRank = new Map((prev as DbLeaderRow[] | null)?.map((p) => [p.user_id, Number(p.rank)]) ?? []);
  return rows.map((r) => {
    const before = prevRank.get(r.user_id);
    return toLeaderRow(r, before === undefined ? null : before - Number(r.rank), youId);
  });
}

export async function fetchLeaderboard(
  sb: SupabaseClient,
  season: string | null,
  offset: number,
  limit: number,
  youId?: string,
): Promise<{ rows: LeaderRow[]; total: number }> {
  const { data, count, error } = await sb
    .rpc("verse_leaderboard", { p_season: season }, { count: "exact" })
    .order("rank", { ascending: true })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  const rows = await attachDeltas(sb, season, (data as DbLeaderRow[]) ?? [], youId);
  return { rows, total: count ?? rows.length };
}

export async function searchLeaderboard(
  sb: SupabaseClient,
  season: string | null,
  q: string,
): Promise<LeaderRow[]> {
  const term = q.trim();
  const isWallet = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(term);
  let query = sb.rpc("verse_leaderboard", { p_season: season });
  if (isWallet) {
    query = query.eq("wallet", term);
  } else {
    // Names only match public profiles (private ones expose no name).
    const safe = term.replace(/[%_,()\\]/g, "");
    if (safe.length < 2) return [];
    query = query.ilike("display_name", `%${safe}%`);
  }
  const { data, error } = await query.order("rank").limit(20);
  if (error) throw error;
  return attachDeltas(sb, season, (data as DbLeaderRow[]) ?? []);
}

/** The user's own rank plus two places either side. */
export async function fetchUserStanding(sb: SupabaseClient, season: string | null, userId: string) {
  const { data: mine } = await sb
    .rpc("verse_leaderboard", { p_season: season })
    .eq("user_id", userId)
    .maybeSingle();
  const me = mine as DbLeaderRow | null;
  if (!me) return { rank: null, xp: 0, delta: null, neighbors: [] as LeaderRow[] };

  const r = Number(me.rank);
  const { data: around } = await sb
    .rpc("verse_leaderboard", { p_season: season })
    .gte("rank", Math.max(1, r - 2))
    .lte("rank", r + 2)
    .order("rank");
  const neighbors = await attachDeltas(sb, season, (around as DbLeaderRow[]) ?? [], userId);
  const self = neighbors.find((n) => n.isYou);
  return { rank: r, xp: Number(me.xp), delta: self?.delta ?? null, neighbors };
}

export async function lifetimeXp(sb: SupabaseClient, userId: string): Promise<number> {
  const { data } = await sb.from("verse_xp_events").select("amount").eq("user_id", userId);
  return (data ?? []).reduce((sum, e) => sum + (e.amount as number), 0);
}

/** Writes an admin action to the shared audit trail. */
export async function audit(sb: SupabaseClient, eventType: string, metadata: Record<string, unknown>) {
  await sb.from("audit_events").insert({ event_type: eventType, metadata });
}
