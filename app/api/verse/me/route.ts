import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getVerseSession } from "@/lib/verse/session";
import { fetchUserStanding, getActiveSeason, lifetimeXp } from "@/lib/verse/data";
import type { ActivityItem, MeResponse } from "@/lib/verse/types";

export const dynamic = "force-dynamic";

const NAME_RE = /^[A-Za-z0-9_.-]{2,24}$/;

export async function GET() {
  const session = await getVerseSession();
  if (!session) return NextResponse.json({ user: null });

  const sb = createServiceClient();
  const { data: user } = await sb
    .from("verse_users")
    .select("id, wallet, display_name, is_public")
    .eq("id", session.userId)
    .maybeSingle();
  if (!user) return NextResponse.json({ user: null });

  try {
    const season = await getActiveSeason(sb);
    const seasonId = season?.id ?? null;

    const [standing, lifetime, completions, verification, totalRes] = await Promise.all([
      fetchUserStanding(sb, seasonId, user.id),
      lifetimeXp(sb, user.id),
      sb
        .from("verse_quest_completions")
        .select("id, status, created_at, completed_at, reject_reason, verse_quests ( title, xp )")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30),
      sb
        .from("verse_wallet_verifications")
        .select("status, held_count, verified_at")
        .eq("user_id", user.id)
        .neq("status", "error")
        .order("verified_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      sb.rpc("verse_leaderboard", { p_season: seasonId }, { count: "exact", head: true }),
    ]);

    const activity: ActivityItem[] = (completions.data ?? []).map((c) => {
      const quest = c.verse_quests as unknown as { title: string; xp: number } | null;
      return {
        id: c.id,
        questTitle: quest?.title ?? "Quest",
        xp: quest?.xp ?? 0,
        status: c.status,
        at: c.completed_at ?? c.created_at,
        rejectReason: c.reject_reason,
      };
    });

    const me: MeResponse = {
      wallet: user.wallet,
      displayName: user.display_name,
      isPublic: user.is_public,
      seasonXp: seasonId ? standing.xp : lifetime,
      lifetimeXp: lifetime,
      rank: standing.rank,
      delta: standing.delta,
      totalRanked: totalRes.count ?? 0,
      neighbors: standing.neighbors,
      activity,
      holder: {
        verified: verification.data?.status === "verified",
        count: verification.data?.held_count ?? 0,
        checkedAt: verification.data?.verified_at ?? null,
      },
    };
    return NextResponse.json({ user: me, season });
  } catch (e) {
    console.error("verse me:", e);
    return NextResponse.json({ error: "Could not load your passport." }, { status: 500 });
  }
}

// Update alias / visibility.
export async function PATCH(req: NextRequest) {
  const session = await getVerseSession();
  if (!session) return NextResponse.json({ error: "Connect your wallet first." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const update: { display_name?: string | null; is_public?: boolean } = {};

  if ("displayName" in body) {
    const name = typeof body.displayName === "string" ? body.displayName.trim() : "";
    if (name && !NAME_RE.test(name)) {
      return NextResponse.json(
        { error: "Alias: 2–24 characters, letters, numbers, _ . - only." },
        { status: 400 },
      );
    }
    update.display_name = name || null;
  }
  if (typeof body.isPublic === "boolean") update.is_public = body.isPublic;

  const sb = createServiceClient();
  const { error } = await sb.from("verse_users").update(update).eq("id", session.userId);
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "That alias is taken." }, { status: 409 });
    console.error("verse me patch:", error);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
