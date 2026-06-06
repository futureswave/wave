import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import type { Application } from "@/components/admin/ApplicationRow";

export const metadata = {
  title: "Admin — VANTH",
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vanth_admin")?.value;

  if (!token || !verifyAdminToken(token)) {
    redirect("/admin/login");
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
    console.error("Admin page fetch error:", error);
  }

  return <AdminDashboard initialApplications={(data as unknown as Application[]) ?? []} />;
}
