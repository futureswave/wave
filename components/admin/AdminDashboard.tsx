"use client";

import { useState } from "react";
import { LogOut, RefreshCw } from "lucide-react";
import { ApplicationRow, type Application } from "./ApplicationRow";

const STATUS_TABS = ["ALL", "SUBMITTED", "UNDER_REVIEW", "PENDING", "APPROVED", "REJECTED"];

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Applications</h1>
          <p className="text-white/30 text-sm mt-0.5 font-mono">
            {applications.length} total · {applications.filter((a) => a.status === "SUBMITTED").length} new
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 text-white/30 hover:text-white text-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/30 hover:text-white/70 text-sm transition-colors font-mono"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {STATUS_TABS.map((tab) => {
          const count =
            tab === "ALL"
              ? applications.length
              : applications.filter((a) => a.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${activeTab === tab
                  ? "bg-white/8 text-white border border-white/15"
                  : "text-white/30 hover:text-white hover:bg-white/5"
                }`}
            >
              {tab}
              {count > 0 && (
                <span className="ml-1.5 opacity-60">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Applications list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-white/20 text-sm font-mono">
          No applications found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <ApplicationRow key={app.id} app={app} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
