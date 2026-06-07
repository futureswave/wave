"use client";

import { useState } from "react";
import { LogOut, RefreshCw, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { ApplicationRow, type Application } from "./ApplicationRow";

const STATUS_TABS = ["ALL", "SUBMITTED", "UNDER_REVIEW", "PENDING", "APPROVED", "REJECTED", "FLAGGED"];

interface Props {
  initialApplications: Application[];
}

export function AdminDashboard({ initialApplications }: Props) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [activeTab, setActiveTab] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);

  const filtered =
    activeTab === "ALL"
      ? applications
      : applications.filter((a) => a.status === activeTab);

  const stats = {
    total: applications.length,
    new: applications.filter((a) => a.status === "SUBMITTED").length,
    inReview: applications.filter((a) => a.status === "UNDER_REVIEW" || a.status === "PENDING").length,
    approved: applications.filter((a) => a.status === "APPROVED").length,
    rejected: applications.filter((a) => a.status === "REJECTED").length,
  };

  function handleUpdate(id: string, updates: Partial<Application>) {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  }

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/applications");
      const data = await res.json();
      if (data.applications) setApplications(data.applications);
    } finally {
      setRefreshing(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Top bar */}
      <div className="border-b border-white/5 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-black tracking-[0.2em] text-white font-mono">VANTH</span>
            <span className="text-white/15 text-sm">/</span>
            <span className="text-sm text-white/40 font-mono">admin</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-white/30 hover:text-white text-xs font-mono transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-white/30 hover:text-white/70 text-xs font-mono transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-1">Applications</h1>
          <p className="text-white/30 text-sm font-mono">
            {stats.new > 0
              ? `${stats.new} new application${stats.new > 1 ? "s" : ""} awaiting review`
              : "No new applications"}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total", value: stats.total, icon: Users, color: "text-white/50" },
            { label: "New", value: stats.new, icon: Clock, color: "text-blue-400" },
            { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-green-400" },
            { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#111111] border border-white/5 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-white/30 uppercase tracking-wider">{stat.label}</span>
                <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
              </div>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {STATUS_TABS.map((tab) => {
            const count =
              tab === "ALL"
                ? applications.length
                : applications.filter((a) => a.status === tab).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded text-xs font-mono whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-white text-black font-semibold"
                    : "text-white/35 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {tab}
                {count > 0 && (
                  <span className={`ml-1.5 ${isActive ? "opacity-60" : "opacity-40"}`}>
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Applications list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/20">
            <Users className="w-8 h-8 mb-3 opacity-30" />
            <p className="text-sm font-mono">No applications in this category.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((app) => (
              <ApplicationRow key={app.id} app={app} onUpdate={handleUpdate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
