import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("applications")
    .select(
      `id, applicant_wallet, twitter_handle, discord_handle,
       essay_alignment, essay_reputation, essay_value,
       reference_links, status, committee_score, committee_notes,
       created_at, updated_at,
       access_codes ( code, referrer_member_id )`
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin applications fetch error:", error);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }

  return NextResponse.json({ applications: data });
}
