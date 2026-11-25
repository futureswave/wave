import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { adminGuard } from "@/lib/verse/admin";
import { audit } from "@/lib/verse/data";

// GET ?status=submitted|completed|rejected — proof queue (oldest first for pending).
export async function GET(req: NextRequest) {
  const denied = await adminGuard();
  if (denied) return denied;
  const status = req.nextUrl.searchParams.get("status") ?? "submitted";
  if (!["submitted", "completed", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  const sb = createServiceClient();
  const { data, error } = await sb
    .from("verse_quest_completions")
    .select(
      "id, status, period_key, proof_url, proof_text, reviewer, reject_reason, created_at, reviewed_at, verse_users ( wallet, display_name, flagged ), verse_quests!inner ( title, xp, verification )",
    )
    .eq("status", status)
    .eq("verse_quests.verification", "proof")
    .order("created_at", { ascending: status === "submitted" })
    .limit(200);
  if (error) {
    console.error("admin reviews:", error);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
  return NextResponse.json({ submissions: data });
}

// POST { id, approve, reason } — approve writes XP atomically; reject needs a reason.
export async function POST(req: NextRequest) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await req.json().catch(() => ({}));
  const id = typeof body.id === "string" ? body.id : "";
  const approve = body.approve === true;
  const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 300) : "";
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  if (!approve && !reason) return NextResponse.json({ error: "A rejection reason is required." }, { status: 400 });

  const sb = createServiceClient();
  const { data, error } = await sb.rpc("verse_review_completion", {
    p_completion: id,
    p_approve: approve,
    p_reviewer: "admin",
    p_reason: reason || null,
  });
  if (error) {
    if (error.message.includes("NOT_PENDING")) {
      return NextResponse.json({ error: "Already reviewed." }, { status: 409 });
    }
    console.error("admin review:", error);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
  await audit(sb, approve ? "VERSE_PROOF_APPROVED" : "VERSE_PROOF_REJECTED", { completion_id: id, reason: reason || null });
  return NextResponse.json({ completion: data });
}
