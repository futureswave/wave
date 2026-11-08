"use client";

import { LogOut } from "lucide-react";

export function AdminSignOut() {
  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-1.5 font-mono text-xs text-white/30 transition-colors hover:text-white/70"
    >
      <LogOut className="h-3.5 w-3.5" />
      Sign out
    </button>
  );
}
