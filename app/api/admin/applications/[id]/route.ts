import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";

const APPROVED_MEMBER_CODE_COUNT = 3;
const FINAL_STATUSES = ["APPROVED", "REJECTED"];
const VALID_STATUSES = ["SUBMITTED", "UNDER_REVIEW", "PENDING", "APPROVED", "REJECTED", "FLAGGED"];

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "VANTH-";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  code += "-";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, committee_notes, committee_score } = body;

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: app, error: fetchErr } = await supabase
    .from("applications")
    .select("id, status, access_code_id, applicant_wallet")
    .eq("id", id)
    .single();

  if (fetchErr || !app) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const { error: updateErr } = await supabase
    .from("applications")
    .update({
      status,
      committee_notes: committee_notes ?? null,
      committee_score: committee_score ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateErr) {
    console.error("Update error:", updateErr);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }

  // Handle transitions to a final status
  if (FINAL_STATUSES.includes(status) && !FINAL_STATUSES.includes(app.status)) {
    const { data: codeData } = await supabase
      .from("access_codes")
      .update({ state: "FINALIZED" })
      .eq("id", app.access_code_id)
      .select("referrer_member_id")
      .single();

    if (status === "APPROVED") {
      // Create member record for approved applicant
      const { data: newMember } = await supabase
        .from("members")
        .insert({ role: "MEMBER", wallet_address: app.applicant_wallet, status: "ACTIVE" })
        .select("id")
        .single();

      if (newMember) {
        // Generate invite codes for the new member
        const memberCodes = Array.from({ length: APPROVED_MEMBER_CODE_COUNT }, () => ({
          code: generateCode(),
          referrer_member_id: newMember.id,
          state: "AVAILABLE",
        }));
        await supabase.from("access_codes").insert(memberCodes);
      }

      // Refill code for original referrer
      if (codeData?.referrer_member_id) {
        await supabase.from("access_codes").insert({
          code: generateCode(),
          referrer_member_id: codeData.referrer_member_id,
          state: "AVAILABLE",
        });
      }

      await supabase.from("audit_events").insert({
        event_type: "APPLICATION_APPROVED",
        application_id: id,
        access_code_id: app.access_code_id,
        metadata: { new_member_wallet: app.applicant_wallet },
      });
    } else {
      await supabase.from("audit_events").insert({
        event_type: "APPLICATION_REJECTED",
        application_id: id,
        access_code_id: app.access_code_id,
        metadata: {},
      });
    }
  }

  return NextResponse.json({ success: true });
}
