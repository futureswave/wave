"use client";

import { useState } from "react";
import { Search, Loader2, Copy, Check } from "lucide-react";
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
  const [result, setResult] = useState<{ status: string; updated_at: string; invite_codes: { code: string; state: string }[] } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  async function handleCheck() {
    const trimmed = wallet.trim();
    if (!trimmed) return;
    setState("loading");
    try {
      const res = await fetch(`/api/access/status?wallet=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (data.found) {
        setResult({ ...data, invite_codes: data.invite_codes ?? [] });
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
          placeholder="Your Ethereum wallet address (0x...)"
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

          {result.status === "APPROVED" && result.invite_codes.length > 0 && (
            <div className="bg-white/[0.02] border border-white/5 rounded p-4 mt-2">
              <p className="text-xs font-mono text-white/25 uppercase tracking-wider mb-1">
                Your Invite Codes
              </p>
              <p className="text-white/30 text-xs mb-4">
                Share these with people you&apos;d like to invite.
              </p>
              <div className="space-y-2">
                {result.invite_codes.map(({ code, state: codeState }) => {
                  const stateLabel =
                    codeState === "AVAILABLE" ? "Available"
                    : codeState === "LOCKED" ? "In Use"
                    : "Used";
                  const stateColor =
                    codeState === "AVAILABLE" ? "text-green-400/70"
                    : codeState === "LOCKED" ? "text-amber-400/70"
                    : "text-white/20";

                  return (
                    <div key={code} className="flex items-center justify-between gap-3 py-2 border-b border-white/5 last:border-0">
                      <span className={`font-mono text-sm ${codeState === "FINALIZED" ? "line-through text-white/20" : "text-white/70"}`}>
                        {code}
                      </span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-mono ${stateColor}`}>{stateLabel}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(code);
                            setCopiedCode(code);
                            setTimeout(() => setCopiedCode(null), 1500);
                          }}
                          className="text-white/25 hover:text-white/60 transition-colors"
                          title="Copy code"
                        >
                          {copiedCode === code
                            ? <Check className="w-3.5 h-3.5 text-green-400" />
                            : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
