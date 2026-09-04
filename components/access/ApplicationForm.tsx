"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { validateSolanaWallet, validateXHandle, validateDiscordHandle } from "@/lib/validation";

interface Props {
  accessCode: string;
  onSuccess: () => void;
}

type FormState = {
  wallet_address: string;
  twitter_handle: string;
  discord_handle: string;
  ack_opensea_only: boolean;
};

export function ApplicationForm({ accessCode, onSuccess }: Props) {
  const [form, setForm] = useState<FormState>({
    wallet_address: "",
    twitter_handle: "",
    discord_handle: "",
    ack_opensea_only: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function setField(key: keyof FormState, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    const walletErr = validateSolanaWallet(form.wallet_address);
    if (walletErr) errs.wallet_address = walletErr;
    const xErr = validateXHandle(form.twitter_handle);
    if (xErr) errs.twitter_handle = xErr;
    const discordErr = validateDiscordHandle(form.discord_handle);
    if (discordErr) errs.discord_handle = discordErr;
    if (!form.ack_opensea_only) {
      errs.ack_opensea_only = "You must acknowledge this.";
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
          essay_alignment: "",
          essay_reputation: "",
          essay_value: "",
          reference_links: null,
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

  const inputBase = "w-full bg-white/5 border rounded px-4 py-3 text-white placeholder:text-white/35 text-sm focus:outline-none transition-colors";
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

      {/* Acknowledgement */}
      <div>
        <label className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition-colors ${errors.ack_opensea_only ? "border-red-500/30 bg-red-500/5" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}>
          <input
            type="checkbox"
            checked={form.ack_opensea_only}
            onChange={(e) => setField("ack_opensea_only", e.target.checked)}
            className="mt-0.5"
          />
          <span className="text-white/50 text-sm">
            I understand that minting details will be announced through official channels only.
            I will never send funds to any address claiming to be VANTH without verifying first.
          </span>
        </label>
        {errors.ack_opensea_only && (
          <p className="text-red-400 text-xs mt-1">{errors.ack_opensea_only}</p>
        )}
      </div>

      {submitState === "error" && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded">
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

      <p className="text-white/45 text-xs text-center font-mono">
        Codes are limited. Having a code does not guarantee acceptance.
      </p>
    </form>
  );
}
