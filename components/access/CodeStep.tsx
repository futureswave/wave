"use client";

import { useState } from "react";
import { Check, X, Lock, AlertTriangle, Loader2 } from "lucide-react";

interface CodeStepProps {
  onValidCode: (code: string) => void;
}

export function CodeStep({ onValidCode }: CodeStepProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "valid" | "locked" | "invalid">("idle");
  const [message, setMessage] = useState("");

  async function handleValidate() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`/api/access/validate?code=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (data.valid) {
        setStatus("valid");
        setMessage(data.message ?? "Code accepted.");
      } else if (data.state === "LOCKED") {
        setStatus("locked");
        setMessage(data.message ?? "This code is currently locked.");
      } else {
        setStatus("invalid");
        setMessage(data.message ?? "Invalid access code.");
      }
    } catch {
      setStatus("invalid");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-mono text-white/50 mb-2">
          Access Code
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              if (status !== "idle") setStatus("idle");
            }}
            placeholder="VANTH-XXXX-XXXX"
            className="flex-1 bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder:text-white/20 font-mono text-sm focus:outline-none focus:border-white/25 transition-colors"
            onKeyDown={(e) => e.key === "Enter" && handleValidate()}
            disabled={status === "loading" || status === "valid"}
          />
          <button
            onClick={handleValidate}
            disabled={status === "loading" || !code.trim() || status === "valid"}
            className="px-5 py-3 rounded bg-white text-black font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/90 transition-colors flex items-center gap-2 shrink-0"
          >
            {status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : "Validate"}
          </button>
        </div>
      </div>

      {status === "valid" && (
        <div className="flex items-start gap-3 p-4 bg-white/8 border border-white/15 rounded">
          <Check className="w-4 h-4 text-white/70 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-white/70 text-sm font-semibold">{message}</p>
          </div>
          <button
            onClick={() => onValidCode(code.trim().toUpperCase())}
            className="px-4 py-1.5 rounded bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors shrink-0"
          >
            Continue →
          </button>
        </div>
      )}

      {status === "locked" && (
        <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded">
          <Lock className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
          <p className="text-white/50 text-sm">{message}</p>
        </div>
      )}

      {status === "invalid" && (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded">
            <X className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
            <p className="text-white/50 text-sm">{message}</p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white/3 border border-white/8 rounded">
            <AlertTriangle className="w-4 h-4 text-white/35 shrink-0 mt-0.5" />
            <p className="text-white/35 text-xs">
              <span className="text-white/55 font-semibold">Stay safe:</span>{" "}
              Access codes are distributed only through official VANTH channels. Never pay for an access code.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
