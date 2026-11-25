import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { getVerseSession } from "@/lib/verse/session";
import { fetchLeaderboard, getActiveSeason, searchLeaderboard } from "@/lib/verse/data";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;
const MAX_ROWS = 250; // PRD §7: top 100/250, paginated

// GET /api/verse/leaderboard?scope=season|all&page=0&q=
export async function GET(req: NextRequest) {
  if (!rateLimit(getClientIp(req.headers), { namespace: "verse-board", max: 60, windowMs: 60 * 1000 })) {
    return NextResponse.json({ error: "Slow down." }, { status: 429 });
  }

  const params = req.nextUrl.searchParams;
  const page = Math.max(0, Math.min(Number(params.get("page")) || 0, MAX_ROWS / PAGE_SIZE - 1));
  const q = params.get("q")?.slice(0, 64) ?? "";

  const sb = createServiceClient();
  const session = await getVerseSession();
  try {
    const season = await getActiveSeason(sb);
    // Without a running season the board falls back to all-time.
    const scope = params.get("scope") === "all" || !season ? "all" : "season";
    const seasonId = scope === "season" ? season!.id : null;

    if (q) {
      const rows = await searchLeaderboard(sb, seasonId, q);
      return NextResponse.json({ season, scope, rows, total: rows.length, updatedAt: new Date().toISOString() });
    }

    const { rows, total } = await fetchLeaderboard(sb, seasonId, page * PAGE_SIZE, PAGE_SIZE, session?.userId);
    return NextResponse.json({
      season,
      scope,
      rows,
      total,
      page,
      pageSize: PAGE_SIZE,
      hasMore: (page + 1) * PAGE_SIZE < Math.min(total, MAX_ROWS),
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("verse leaderboard:", e);
    return NextResponse.json({ error: "Could not load the leaderboard." }, { status: 500 });
  }
}
