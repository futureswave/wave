"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";

const STATUS_COPY: Record<string, string> = {
  SUBMITTED: "Your application has been received. We read every application carefully.",
  UNDER_REVIEW: "Your application is currently being reviewed by the committee.",
  PENDING: "We review carefully. We cannot provide an ETA.",
  APPROVED: "Congratulations — your application has been approved. Welcome to VANTH.",
  REJECTED: "Decision is final. Re-applications are not accepted.",
  FLAGGED: "Your application requires additional review.",
};

export function StatusChecker() {
  const [wallet, setWallet] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "found" | "not_found" | "error">("idle");
  const [result, setResult] = useState<{ status: string; updated_at: string } | null>(null);

  async function handleCheck() {
    const trimmed = wallet.trim();
    if (!trimmed) return;
    setState("loading");
    try {
      const res = await fetch(`/api/access/status?wallet=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (data.found) {
        setResult(data);
        setState("found");
      } else {
        setState("not_found");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <div className="bg-[#111111] border border-white/5 rounded p-6">
      <h3 className="text-sm font-mono text-white/30 uppercase tracking-wider mb-4">
        Check Application Status
      </h3>
      <div className="flex gap-3 mb-4">
        <input
          value={wallet}
          onChange={(e) => { setWallet(e.target.value); setState("idle"); }}
          placeholder="Your Solana wallet address"
          className="flex-1 bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder:text-white/20 font-mono text-sm focus:outline-none focus:border-white/20 transition-colors"
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
        />
        <button
          onClick={handleCheck}
          disabled={state === "loading" || !wallet.trim()}
          className="px-4 py-3 rounded bg-white/5 border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-colors disabled:opacity-40 flex items-center gap-2"
        >
          {state === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </div>

      {state === "found" && result && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-white/30 text-xs font-mono">Status:</span>
            <StatusBadge status={result.status} />
          </div>
          <p className="text-white/40 text-sm">{STATUS_COPY[result.status] ?? "Status unknown."}</p>
          <p className="text-white/20 text-xs font-mono">
            Last updated:{" "}
            {new Date(result.updated_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}

      {state === "not_found" && (
        <p className="text-white/30 text-sm">No application found for this wallet address.</p>
      )}

      {state === "error" && (
        <p className="text-white/40 text-sm">Failed to check status. Please try again.</p>
      )}
    </div>
  );
}
