import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminSignOut } from "@/components/admin/AdminSignOut";
import { VerseAdmin } from "@/components/admin/verse/VerseAdmin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verse — VANTH Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminVersePage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login?next=/admin/verse");
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="border-b border-white/5 bg-[#0a0a0a]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-mono text-sm font-bold tracking-[0.2em] text-white">
              VANTH
            </Link>
            <span className="text-sm text-white/15">/</span>
            <Link href="/admin" className="font-mono text-sm text-white/40 hover:text-white/70">
              admin
            </Link>
            <span className="text-sm text-white/15">/</span>
            <span className="font-mono text-sm text-white/40">verse</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/verse" className="font-mono text-xs text-white/30 hover:text-white">
              View public board ↗
            </Link>
            <AdminSignOut />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="mb-1 text-2xl font-bold text-white">Verse</h1>
        <p className="mb-8 font-mono text-sm text-white/30">Quests, proof reviews, XP adjustments and seasons. Every action is audited.</p>
        <VerseAdmin />
      </div>
    </div>
  );
}
