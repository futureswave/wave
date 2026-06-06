"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { validateWhitelistForm, normalizeXHandle, type FormErrors } from "@/lib/validation";
import { trackEvent } from "@/lib/analytics";

type SubmitState = "idle" | "loading" | "success" | "duplicate" | "rate_limited" | "error";

export function WhitelistForm() {
  const [form, setForm] = useState({
    wallet_address: "",
    twitter_handle: "",
    discord_handle: "",
    ack_magiceden_only: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateWhitelistForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitState("loading");
    trackEvent("click_whitelist");

    try {
      const res = await fetch("/api/whitelist/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          twitter_handle: normalizeXHandle(form.twitter_handle),
        }),
      });

      if (res.ok) {
        setSubmitState("success");
        trackEvent("submit_whitelist_success");
        return;
      }

      const data = await res.json();

      if (res.status === 409) {
        setSubmitState("duplicate");
        trackEvent("submit_whitelist_duplicate");
      } else if (res.status === 429) {
        setSubmitState("rate_limited");
        trackEvent("submit_whitelist_error", { reason: "rate_limit" });
      } else {
        setSubmitState("error");
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        trackEvent("submit_whitelist_error", { reason: "server" });
      }
    } catch {
      setSubmitState("error");
      setErrorMessage("Network error. Please check your connection and try again.");
      trackEvent("submit_whitelist_error", { reason: "network" });
    }
  }

  if (submitState === "success") {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">You&apos;re on the list!</h2>
        <p className="text-slate-400 mb-6 text-sm leading-relaxed">
          Your whitelist submission has been received. Follow our official{" "}
          <a href="https://x.com/vanth_nft" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">X</a>{" "}
          and{" "}
          <a href="https://discord.gg/vanth" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Discord</a>{" "}
          for mint date announcements.
        </p>
        <p className="text-amber-400 text-xs">Remember: Minting will only happen on Magic Eden. Never mint from another source.</p>
      </div>
    );
  }

  if (submitState === "duplicate") {
    return (
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Already submitted!</h2>
        <p className="text-slate-400 text-sm">
          This wallet address is already on the whitelist. You&apos;re good to go.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Top error */}
      {submitState === "error" && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-semibold text-sm">Submission failed</p>
            <p className="text-slate-400 text-sm">{errorMessage} If the issue persists, reach out on Discord.</p>
          </div>
        </div>
      )}

      {submitState === "rate_limited" && (
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-yellow-300 text-sm">Too many submissions. Please wait a few minutes and try again.</p>
        </div>
      )}

      {/* Wallet */}
      <div>
        <label htmlFor="wallet_address" className="block text-sm font-semibold text-slate-300 mb-1.5">
          Solana Wallet Address <span className="text-red-400">*</span>
        </label>
        <input
          id="wallet_address"
          name="wallet_address"
          type="text"
          value={form.wallet_address}
          onChange={handleChange}
          placeholder="e.g. 7xKXtg2CW..."
          className={`w-full bg-[#10101e] border rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-colors font-mono ${
            errors.wallet_address
              ? "border-red-500/60 focus:ring-red-500/40"
              : "border-white/10 focus:ring-purple-500/40 focus:border-purple-500/50"
          }`}
          autoComplete="off"
          spellCheck={false}
        />
        {errors.wallet_address && (
          <p className="mt-1.5 text-red-400 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.wallet_address}
          </p>
        )}
      </div>

      {/* X handle */}
      <div>
        <label htmlFor="twitter_handle" className="block text-sm font-semibold text-slate-300 mb-1.5">
          X (Twitter) Username <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">@</span>
          <input
            id="twitter_handle"
            name="twitter_handle"
            type="text"
            value={form.twitter_handle}
            onChange={handleChange}
            placeholder="yourhandle"
            className={`w-full bg-[#10101e] border rounded-xl pl-8 pr-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-colors ${
              errors.twitter_handle
                ? "border-red-500/60 focus:ring-red-500/40"
                : "border-white/10 focus:ring-purple-500/40 focus:border-purple-500/50"
            }`}
            autoComplete="off"
          />
        </div>
        {errors.twitter_handle && (
          <p className="mt-1.5 text-red-400 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.twitter_handle}
          </p>
        )}
      </div>

      {/* Discord */}
      <div>
        <label htmlFor="discord_handle" className="block text-sm font-semibold text-slate-300 mb-1.5">
          Discord Username <span className="text-red-400">*</span>
        </label>
        <input
          id="discord_handle"
          name="discord_handle"
          type="text"
          value={form.discord_handle}
          onChange={handleChange}
          placeholder="username or username#1234"
          className={`w-full bg-[#10101e] border rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-colors ${
            errors.discord_handle
              ? "border-red-500/60 focus:ring-red-500/40"
              : "border-white/10 focus:ring-purple-500/40 focus:border-purple-500/50"
          }`}
          autoComplete="off"
        />
        {errors.discord_handle && (
          <p className="mt-1.5 text-red-400 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.discord_handle}
          </p>
        )}
      </div>

      {/* Acknowledgement */}
      <div>
        <label className={`flex items-start gap-3 cursor-pointer group ${errors.ack_magiceden_only ? "text-red-400" : ""}`}>
          <input
            type="checkbox"
            name="ack_magiceden_only"
            checked={form.ack_magiceden_only}
            onChange={handleChange}
            className="mt-0.5 w-4 h-4 rounded border-white/20 bg-[#10101e] accent-purple-500 cursor-pointer"
          />
          <span className={`text-sm leading-relaxed ${errors.ack_magiceden_only ? "text-red-400" : "text-slate-400 group-hover:text-slate-300 transition-colors"}`}>
            I understand that minting happens on{" "}
            <span className="font-semibold text-purple-400">Magic Eden only</span>. I will not mint from any other source.
          </span>
        </label>
        {errors.ack_magiceden_only && (
          <p className="mt-1.5 text-red-400 text-xs flex items-center gap-1 pl-7">
            <AlertCircle className="w-3 h-3" /> {errors.ack_magiceden_only}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitState === "loading"}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-pink-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2"
      >
        {submitState === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Join the Whitelist"
        )}
      </button>
    </form>
  );
}
