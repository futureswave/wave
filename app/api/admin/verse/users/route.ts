import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { adminGuard } from "@/lib/verse/admin";
import { audit, lifetimeXp } from "@/lib/verse/data";

// GET ?q=wallet-or-alias → matches; GET ?id=uuid → full history.
export async function GET(req: NextRequest) {
  const denied = await adminGuard();
  if (denied) return denied;
  const sb = createServiceClient();
  const id = req.nextUrl.searchParams.get("id");

  if (id) {
    const [user, events, completions, xp] = await Promise.all([
      sb.from("verse_users").select("*").eq("id", id).single(),
      sb
        .from("verse_xp_events")
        .select("id, amount, source, reason, actor, created_at, season_id")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(200),
      sb
        .from("verse_quest_completions")
        .select("id, status, period_key, created_at, reject_reason, verse_quests ( title, xp )")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(200),
      lifetimeXp(sb, id),
    ]);
    if (!user.data) return NextResponse.json({ error: "User not found." }, { status: 404 });
    return NextResponse.json({
      user: user.data,
      lifetimeXp: xp,
      events: events.data ?? [],
      completions: completions.data ?? [],
    });
  }

  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().replace(/[%_,()\\]/g, "");
  let query = sb.from("verse_users").select("id, wallet, display_name, is_public, flagged, created_at, last_seen_at");
  if (q) query = query.or(`wallet.ilike.%${q}%,display_name.ilike.%${q}%`);
  const { data, error } = await query.order("last_seen_at", { ascending: false }).limit(50);
  if (error) return NextResponse.json({ error: "Database error." }, { status: 500 });
  return NextResponse.json({ users: data });
}

// POST { userId, amount, reason } — XP adjustment as a new ledger event.
export async function POST(req: NextRequest) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await req.json().catch(() => ({}));
  const userId = typeof body.userId === "string" ? body.userId : "";
  const amount = Number(body.amount);
  const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 300) : "";
  if (!userId || !Number.isInteger(amount) || amount === 0 || Math.abs(amount) > 10000) {
    return NextResponse.json({ error: "Amount must be a non-zero integer (±10000)." }, { status: 400 });
  }
  if (reason.length < 5) return NextResponse.json({ error: "A reason (5+ chars) is required." }, { status: 400 });

  const sb = createServiceClient();
  const { data: season } = await sb.rpc("verse_active_season_id");
  const { data, error } = await sb
    .from("verse_xp_events")
    .insert({
      user_id: userId,
      season_id: (season as string | null) ?? null,
      amount,
      source: amount < 0 ? "reversal" : "adjustment",
      reason,
      actor: "admin",
    })
    .select("*")
    .single();
  if (error) {
    console.error("admin xp adjust:", error);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
  await audit(sb, "VERSE_XP_ADJUSTED", { user_id: userId, amount, reason, event_id: data.id });
  return NextResponse.json({ event: data });
}

// PATCH { userId, flagged, flagReason?, clearAlias? } — anti-abuse controls.
export async function PATCH(req: NextRequest) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await req.json().catch(() => ({}));
  const userId = typeof body.userId === "string" ? body.userId : "";
  if (!userId) return NextResponse.json({ error: "Missing userId." }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (typeof body.flagged === "boolean") {
    update.flagged = body.flagged;
    update.flag_reason = body.flagged ? String(body.flagReason ?? "").slice(0, 300) || null : null;
  }
  if (body.clearAlias === true) update.display_name = null;
  if (!Object.keys(update).length) return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

  const sb = createServiceClient();
  const { error } = await sb.from("verse_users").update(update).eq("id", userId);
  if (error) return NextResponse.json({ error: "Database error." }, { status: 500 });
  await audit(sb, "VERSE_USER_UPDATED", { user_id: userId, ...update });
  return NextResponse.json({ ok: true });
}
