import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { adminGuard } from "@/lib/verse/admin";
import { audit } from "@/lib/verse/data";

function csvCell(v: unknown): string {
  let s = v === null || v === undefined ? "" : String(v);
  // Neutralise spreadsheet formula injection from user-supplied text.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(header: string[], rows: unknown[][]): string {
  return [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n");
}

// GET ?type=leaderboard&season=<id|all>  |  ?type=submissions
export async function GET(req: NextRequest) {
  const denied = await adminGuard();
  if (denied) return denied;
  const sb = createServiceClient();
  const type = req.nextUrl.searchParams.get("type");
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  let csv: string;

  if (type === "leaderboard") {
    const seasonParam = req.nextUrl.searchParams.get("season");
    const season = seasonParam && seasonParam !== "all" ? seasonParam : null;
    const { data, error } = await sb.rpc("verse_leaderboard", { p_season: season }).order("rank").limit(5000);
    if (error) return NextResponse.json({ error: "Database error." }, { status: 500 });
    csv = toCsv(
      ["rank", "wallet", "display_name", "xp", "quests_completed", "reached_at"],
      (data ?? []).map((r: Record<string, unknown>) => [r.rank, r.wallet, r.display_name, r.xp, r.quests_completed, r.reached_at]),
    );
  } else if (type === "submissions") {
    const { data, error } = await sb
      .from("verse_quest_completions")
      .select("id, status, period_key, proof_url, proof_text, reviewer, reject_reason, created_at, reviewed_at, verse_users ( wallet ), verse_quests ( slug, xp )")
      .order("created_at", { ascending: false })
      .limit(10000);
    if (error) return NextResponse.json({ error: "Database error." }, { status: 500 });
    csv = toCsv(
      ["id", "wallet", "quest", "xp", "status", "period", "proof_url", "proof_text", "reviewer", "reject_reason", "created_at", "reviewed_at"],
      (data ?? []).map((r) => {
        const u = r.verse_users as unknown as { wallet: string } | null;
        const q = r.verse_quests as unknown as { slug: string; xp: number } | null;
        return [r.id, u?.wallet, q?.slug, q?.xp, r.status, r.period_key, r.proof_url, r.proof_text, r.reviewer, r.reject_reason, r.created_at, r.reviewed_at];
      }),
    );
  } else {
    return NextResponse.json({ error: "type must be leaderboard or submissions." }, { status: 400 });
  }

  await audit(sb, "VERSE_EXPORT", { type });
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="verse-${type}-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
