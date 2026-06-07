"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Save, Copy, Check } from "lucide-react";
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

const ESSAY_LABELS: Record<string, string> = {
  essay_alignment:  "Alignment with VANTH vision",
  essay_reputation: "Web3 reputation & contributions",
  essay_value:      "Concrete value they will bring",
};

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
  const [copied, setCopied] = useState(false);

  function truncate(addr: string) {
    if (addr.length <= 14) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  }

  function copyWallet() {
    navigator.clipboard.writeText(app.applicant_wallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
    <div className={`border rounded overflow-hidden transition-colors ${
      expanded ? "border-white/10 bg-[#111111]" : "border-white/5 bg-[#0d0d0d] hover:border-white/8"
    }`}>
      {/* Row header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Left: identity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-white/70">{truncate(app.applicant_wallet)}</span>
            <span className="text-white/15 text-xs">·</span>
            <span className="text-white/50 text-xs font-mono">@{app.twitter_handle}</span>
            <span className="text-white/15 text-xs">·</span>
            <span className="text-white/30 text-xs font-mono">{app.discord_handle}</span>
            {app.access_codes?.code && (
              <>
                <span className="text-white/15 text-xs">·</span>
                <span className="text-white/20 text-xs font-mono">{app.access_codes.code}</span>
              </>
            )}
          </div>
          <p className="text-white/20 text-xs mt-0.5 font-mono">
            {new Date(app.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {app.committee_score !== null && (
              <span className="ml-2 text-white/35">Score: {app.committee_score}/10</span>
            )}
          </p>
        </div>

        {/* Right: status + toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={app.status} />
          {expanded
            ? <ChevronUp className="w-4 h-4 text-white/20" />
            : <ChevronDown className="w-4 h-4 text-white/20" />}
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-white/5">
          {/* Identity details */}
          <div className="px-4 py-4 bg-white/[0.02] border-b border-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-white/25 font-mono uppercase tracking-wider mb-1">Wallet</p>
                <div className="flex items-center gap-2">
                  <span className="text-white/60 font-mono break-all">{app.applicant_wallet}</span>
                  <button
                    onClick={copyWallet}
                    className="text-white/25 hover:text-white/60 transition-colors shrink-0"
                    title="Copy wallet address"
                  >
                    {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-white/25 font-mono uppercase tracking-wider mb-1">X (Twitter)</p>
                <a
                  href={`https://x.com/${app.twitter_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors flex items-center gap-1"
                >
                  @{app.twitter_handle}
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              </div>
              <div>
                <p className="text-white/25 font-mono uppercase tracking-wider mb-1">Discord</p>
                <span className="text-white/60">{app.discord_handle}</span>
              </div>
            </div>
          </div>

          {/* Essays */}
          <div className="px-4 py-5 space-y-6 border-b border-white/5">
            {(["essay_alignment", "essay_reputation", "essay_value"] as const).map((key) => (
              <div key={key}>
                <p className="text-xs font-mono text-white/25 uppercase tracking-wider mb-2">
                  {ESSAY_LABELS[key]}
                </p>
                <p className="text-sm text-white/55 leading-relaxed whitespace-pre-wrap bg-white/[0.02] rounded p-3 border border-white/5">
                  {app[key]}
                </p>
              </div>
            ))}

            {app.reference_links && app.reference_links.length > 0 && (
              <div>
                <p className="text-xs font-mono text-white/25 uppercase tracking-wider mb-2">Reference Links</p>
                <ul className="space-y-1">
                  {app.reference_links.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/45 hover:text-white text-xs hover:underline flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Review controls */}
          <div className="px-4 py-4 bg-[#0d0d0d]">
            <p className="text-xs font-mono text-white/20 uppercase tracking-wider mb-3">Review</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-xs text-white/30 font-mono mb-1 block">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
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
                  placeholder="—"
                  className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`w-full py-2 rounded text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    saved
                      ? "bg-green-500/15 text-green-300 border border-green-500/25"
                      : "bg-white text-black hover:bg-white/90"
                  } disabled:opacity-50`}
                >
                  {saved ? (
                    <><Check className="w-4 h-4" /> Saved</>
                  ) : (
                    <><Save className="w-4 h-4" /> {saving ? "Saving…" : "Save"}</>
                  )}
                </button>
              </div>
            </div>

            {saveError && (
              <p className="text-red-400 text-xs mb-3">{saveError}</p>
            )}

            <div>
              <label className="text-xs text-white/30 font-mono mb-1 block">Committee Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/25 transition-colors resize-y"
                placeholder="Internal notes — not visible to applicant…"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
