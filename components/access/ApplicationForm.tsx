"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { validateSolanaWallet, validateXHandle, validateDiscordHandle } from "@/lib/validation";

interface Props {
  accessCode: string;
  onSuccess: () => void;
}

const ESSAY_MIN = 100;

const ESSAYS = [
  {
    id: "essay_alignment" as const,
    label: "Your alignment with VANTH vision",
    placeholder: "Describe why you resonate with VANTH's vision, aesthetics, and values...",
  },
  {
    id: "essay_reputation" as const,
    label: "Your Web3 reputation & contributions",
    placeholder: "Share your history in Web3 — projects, communities, on-chain activity, contributions...",
  },
  {
    id: "essay_value" as const,
    label: "Concrete value you will bring",
    placeholder: "Be specific: What will you actively contribute to VANTH and its community?",
  },
];

type FormState = {
  wallet_address: string;
  twitter_handle: string;
  discord_handle: string;
  essay_alignment: string;
  essay_reputation: string;
  essay_value: string;
  ack_magiceden_only: boolean;
};

export function ApplicationForm({ accessCode, onSuccess }: Props) {
  const [form, setForm] = useState<FormState>({
    wallet_address: "",
    twitter_handle: "",
    discord_handle: "",
    essay_alignment: "",
    essay_reputation: "",
    essay_value: "",
    ack_magiceden_only: false,
  });
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function setField(key: keyof FormState, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function addLink() {
    const trimmed = linkInput.trim();
    if (!trimmed || links.length >= 5) return;
    setLinks((l) => [...l, trimmed]);
    setLinkInput("");
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    const walletErr = validateSolanaWallet(form.wallet_address);
    if (walletErr) errs.wallet_address = walletErr;
    const xErr = validateXHandle(form.twitter_handle);
    if (xErr) errs.twitter_handle = xErr;
    const discordErr = validateDiscordHandle(form.discord_handle);
    if (discordErr) errs.discord_handle = discordErr;

    for (const essay of ESSAYS) {
      if (form[essay.id].trim().length < ESSAY_MIN) {
        errs[essay.id] = `Minimum ${ESSAY_MIN} characters required.`;
      }
    }
    if (!form.ack_magiceden_only) {
      errs.ack_magiceden_only = "You must acknowledge this.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitState("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/access/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: accessCode,
          ...form,
          reference_links: links.length > 0 ? links : null,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        onSuccess();
      } else {
        setSubmitState("error");
        setErrorMessage(
          res.status === 429
            ? "Too many requests. Please wait a few minutes."
            : data.error ?? "Submission failed. Please try again."
        );
      }
    } catch {
      setSubmitState("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  const inputBase = "w-full bg-white/5 border rounded px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none transition-colors";
  const inputOk = "border-white/10 focus:border-white/25";
  const inputErr = "border-red-500/40";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Identity fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-white/60 mb-1.5">
            Solana Wallet Address <span className="text-white/40">*</span>
          </label>
          <input
            value={form.wallet_address}
            onChange={(e) => setField("wallet_address", e.target.value)}
            placeholder="Your Solana wallet address"
            className={`${inputBase} font-mono ${errors.wallet_address ? inputErr : inputOk}`}
          />
          {errors.wallet_address && <p className="text-red-400 text-xs mt-1">{errors.wallet_address}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-white/60 mb-1.5">
            X (Twitter) Username <span className="text-white/40">*</span>
          </label>
          <input
            value={form.twitter_handle}
            onChange={(e) => setField("twitter_handle", e.target.value)}
            placeholder="@yourhandle"
            className={`${inputBase} ${errors.twitter_handle ? inputErr : inputOk}`}
          />
          {errors.twitter_handle && <p className="text-red-400 text-xs mt-1">{errors.twitter_handle}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-white/60 mb-1.5">
            Discord Username <span className="text-white/40">*</span>
          </label>
          <input
            value={form.discord_handle}
            onChange={(e) => setField("discord_handle", e.target.value)}
            placeholder="yourname"
            className={`${inputBase} ${errors.discord_handle ? inputErr : inputOk}`}
          />
          {errors.discord_handle && <p className="text-red-400 text-xs mt-1">{errors.discord_handle}</p>}
        </div>
      </div>

      {/* Essays */}
      {ESSAYS.map((essay) => (
        <div key={essay.id}>
          <div className="flex items-baseline justify-between mb-1.5">
            <label className="text-sm font-semibold text-white/60">
              {essay.label} <span className="text-white/40">*</span>
            </label>
            <span className={`text-xs font-mono ${form[essay.id].trim().length >= ESSAY_MIN ? "text-white/50" : "text-white/20"}`}>
              {form[essay.id].trim().length} / {ESSAY_MIN}+ chars
            </span>
          </div>
          <textarea
            value={form[essay.id]}
            onChange={(e) => setField(essay.id, e.target.value)}
            placeholder={essay.placeholder}
            rows={4}
            className={`w-full bg-white/5 border rounded px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none transition-colors resize-y min-h-[100px] ${errors[essay.id] ? inputErr : inputOk}`}
          />
          {errors[essay.id] && <p className="text-red-400 text-xs mt-1">{errors[essay.id]}</p>}
        </div>
      ))}

      {/* Reference links */}
      <div>
        <label className="block text-sm font-semibold text-white/60 mb-1.5">
          Reference Links{" "}
          <span className="text-white/25 font-normal">(optional, max 5)</span>
        </label>
        <div className="space-y-2">
          {links.map((link, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded px-3 py-2">
              <span className="flex-1 text-white/40 text-xs truncate font-mono">{link}</span>
              <button
                type="button"
                onClick={() => setLinks((l) => l.filter((_, idx) => idx !== i))}
                className="text-white/25 hover:text-white/60 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {links.length < 5 && (
            <div className="flex gap-2">
              <input
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLink(); } }}
                placeholder="https://github.com/you or on-chain proof"
                className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-white/25"
              />
              <button
                type="button"
                onClick={addLink}
                disabled={!linkInput.trim()}
                className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-colors disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Acknowledgement */}
      <div>
        <label className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition-colors ${errors.ack_magiceden_only ? "border-red-500/30 bg-red-500/5" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}>
          <input
            type="checkbox"
            checked={form.ack_magiceden_only}
            onChange={(e) => setField("ack_magiceden_only", e.target.checked)}
            className="mt-0.5"
          />
          <span className="text-white/50 text-sm">
            I understand that minting happens on{" "}
            <span className="text-white font-semibold">Magic Eden only</span>.
            I will never send funds to any other address claiming to be VANTH.
          </span>
        </label>
        {errors.ack_magiceden_only && (
          <p className="text-red-400 text-xs mt-1">{errors.ack_magiceden_only}</p>
        )}
      </div>

      {submitState === "error" && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitState === "loading"}
        className="w-full py-4 rounded bg-white text-black font-bold text-base hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitState === "loading" ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
        ) : "Submit Application"}
      </button>

      <p className="text-white/20 text-xs text-center font-mono">
        Codes are limited. Having a code does not guarantee acceptance.
      </p>
    </form>
  );
}
