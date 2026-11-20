import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminLoginScreen } from "@/components/admin/AdminLoginScreen";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false, nocache: true },
};

/** Only same-app admin paths are allowed as a post-login destination. */
function safeNext(value: string | string[] | undefined): string {
  const next = Array.isArray(value) ? value[0] : value;
  if (!next || !next.startsWith("/admin") || next.startsWith("/admin/login")) return "/admin";
  if (next.includes("//") || next.includes("\\")) return "/admin";
  return next;
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const next = safeNext((await searchParams).next);
  if (await isAdminAuthenticated()) redirect(next);

  return <AdminLoginScreen next={next} />;
}
