"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Wallet, X } from "lucide-react";
import { getWallet, WALLETS } from "@/lib/verse/wallet-client";
import { shortWallet } from "@/lib/verse/levels";
import { useVerse } from "./VerseProvider";

export function ConnectWallet({ compact = false }: { compact?: boolean }) {
  const { me, loading, connecting, error, connect, disconnect, clearError } = useVerse();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (loading) {
    return <div className="h-9 w-36 animate-pulse rounded-sm bg-white/5" aria-hidden />;
  }

  if (me) {
    return (
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 items-center gap-2 rounded-sm border border-white/10 px-3 font-mono text-xs text-white/70 transition-colors hover:border-signal/50 hover:text-white"
          aria-expanded={open}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
          {me.displayName ?? shortWallet(me.wallet)}
          <ChevronDown className="h-3 w-3 text-white/40" />
        </button>
        {open && (
          <div className="absolute right-0 z-30 mt-2 w-52 rounded-sm border border-white/10 bg-[#111] p-1 shadow-xl">
            <p className="px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-white/30">
              {shortWallet(me.wallet)}
            </p>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                disconnect();
              }}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm text-white/60 hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" /> Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          clearError();
          setOpen((v) => !v);
        }}
        disabled={connecting}
        className="flex h-9 items-center gap-2 rounded-sm bg-white px-4 text-sm font-semibold text-black transition-[background-color,box-shadow] hover:bg-white/90 hover:shadow-[0_0_24px_rgba(124,58,237,0.35)] disabled:opacity-60"
        aria-expanded={open}
      >
        <Wallet className="h-4 w-4" />
        {connecting ? "Check your wallet…" : compact ? "Connect" : "Connect wallet"}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-72 rounded-sm border border-white/10 bg-[#111] p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Select wallet</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-white/30 hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-1">
            {WALLETS.map((w) => {
              const installed = Boolean(getWallet(w.id));
              return installed ? (
                <button
                  key={w.id}
                  type="button"
                  onClick={async () => {
                    if (await connect(w.id)) setOpen(false);
                  }}
                  disabled={connecting}
                  className="flex w-full items-center justify-between rounded-sm border border-white/5 px-3 py-2.5 text-left text-sm text-white/80 transition-colors hover:border-signal/50 hover:bg-signal/[0.06] disabled:opacity-50"
                >
                  {w.name}
                  <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/70">Detected</span>
                </button>
              ) : (
                <a
                  key={w.id}
                  href={w.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-between rounded-sm border border-white/5 px-3 py-2.5 text-sm text-white/35 transition-colors hover:text-white/60"
                >
                  {w.name}
                  <span className="font-mono text-[10px] uppercase tracking-widest">Install</span>
                </a>
              );
            })}
          </div>
          {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
          <p className="mt-3 text-[11px] leading-relaxed text-white/35">
            You will sign a short message to prove wallet ownership. It is not a transaction and costs nothing.
            VANTH never asks for your seed phrase.
          </p>
        </div>
      )}
    </div>
  );
}
