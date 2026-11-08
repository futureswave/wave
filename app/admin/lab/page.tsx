import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  LAYER_ORDER,
  getBuildableCategories,
  getVariants,
} from "@/lib/content/trait-layers";
import { GENDERS, VANTH_TYPES } from "@/lib/content/traits";
import { CharacterLab, type LabVariants } from "@/components/admin/CharacterLab";
import { AdminSignOut } from "@/components/admin/AdminSignOut";

// Never prerender or cache: the manifest below must only ever be rendered
// into a response for a request that carries a valid admin session.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Character Lab — VANTH Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLabPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const buildable = getBuildableCategories();
  const variants = {} as LabVariants;
  for (const { id: gender } of GENDERS) {
    variants[gender] = {};
    for (const category of buildable) {
      const byType: Partial<Record<(typeof VANTH_TYPES)[number], ReturnType<typeof getVariants>>> = {};
      for (const type of VANTH_TYPES) {
        const list = getVariants(gender, category, type);
        if (list.length) byType[type] = list;
      }
      variants[gender][category] = byType;
    }
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="border-b border-white/5 bg-[#0a0a0a]">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-mono text-sm font-bold tracking-[0.2em] text-white">
              VANTH
            </Link>
            <span className="text-sm text-white/15">/</span>
            <Link href="/admin" className="font-mono text-sm text-white/40 hover:text-white/70">
              admin
            </Link>
            <span className="text-sm text-white/15">/</span>
            <span className="font-mono text-sm text-white/40">lab</span>
          </div>
          <AdminSignOut />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <CharacterLab
          data={{ variants, layerOrder: LAYER_ORDER, buildable }}
        />
      </div>
    </div>
  );
}
