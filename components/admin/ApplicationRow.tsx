"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Save } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export interface Application {
  id: string;
  applicant_wallet: string;
  twitter_handle: string;
  discord_handle: string;
  essay_alignment: string;
  essay_reputation: string;
  essay_value: string;
  reference_links: string[] | null;
  status: string;
  committee_score: number | null;
  committee_notes: string | null;
  created_at: string;
  updated_at: string;
  access_codes: { code: string } | null;
}

const STATUSES = ["SUBMITTED", "UNDER_REVIEW", "PENDING", "APPROVED", "REJECTED", "FLAGGED"];

interface Props {
  app: Application;
  onUpdate: (id: string, updates: Partial<Application>) => void;
}

export function ApplicationRow({ app, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(app.status);
  const [notes, setNotes] = useState(app.committee_notes ?? "");
  const [score, setScore] = useState(app.committee_score?.toString() ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  function truncate(addr: string) {
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  }

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch(`/api/admin/applications/${app.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          committee_notes: notes || null,
          committee_score: score ? parseInt(score) : null,
        }),
      });
      if (res.ok) {
        setSaved(true);
        onUpdate(app.id, {
          status,
          committee_notes: notes || null,
          committee_score: score ? parseInt(score) : null,
        });
        setTimeout(() => setSaved(false), 2500);
      } else {
        const data = await res.json();
        setSaveError(data.error ?? "Failed to save.");
      }
    } catch {
      setSaveError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-[#111111] border border-white/5 rounded overflow-hidden">
      {/* Row header */}
      <div
        className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-white/60">{truncate(app.applicant_wallet)}</span>
            <span className="text-white/20 text-xs">·</span>
            <span className="text-white/40 text-xs">@{app.twitter_handle}</span>
            {app.access_codes?.code && (
              <>
                <span className="text-white/20 text-xs">·</span>
                <span className="text-white/25 text-xs font-mono">{app.access_codes.code}</span>
              </>
            )}
          </div>
          <p className="text-white/25 text-xs mt-0.5">
            {new Date(app.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <StatusBadge status={app.status} />
        {expanded
          ? <ChevronUp className="w-4 h-4 text-white/25 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-white/25 shrink-0" />}
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-white/5 px-4 py-5 space-y-5">
          {/* Essays */}
          {[
            { label: "Alignment with VANTH vision", text: app.essay_alignment },
            { label: "Web3 reputation", text: app.essay_reputation },
            { label: "Concrete value", text: app.essay_value },
          ].map(({ label, text }) => (
            <div key={label}>
              <p className="text-xs font-mono text-white/30 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{text}</p>
            </div>
          ))}

          {/* Reference links */}
          {app.reference_links && app.reference_links.length > 0 && (
            <div>
              <p className="text-xs font-mono text-white/30 uppercase tracking-wider mb-2">Reference Links</p>
              <ul className="space-y-1">
                {app.reference_links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/50 hover:text-white text-xs hover:underline flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Review controls */}
          <div className="border-t border-white/5 pt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-white/30 font-mono mb-1 block">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/25"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/30 font-mono mb-1 block">Score (1–10)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/25"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`w-full py-2 rounded text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                    saved
                      ? "bg-white/8 text-white/60 border border-white/15"
                      : "bg-white text-black hover:bg-white/90"
                  } disabled:opacity-50`}
                >
                  <Save className="w-4 h-4" />
                  {saved ? "Saved!" : saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            {saveError && <p className="text-red-400 text-xs">{saveError}</p>}

            <div>
              <label className="text-xs text-white/30 font-mono mb-1 block">Committee Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/25 resize-y"
                placeholder="Internal notes (not visible to applicant)..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
