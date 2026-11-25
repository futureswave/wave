"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { signInWithWallet, signOutWallet, type WalletId } from "@/lib/verse/wallet-client";
import type { MeResponse, SeasonInfo } from "@/lib/verse/types";
import { trackEvent } from "@/lib/analytics";

interface VerseContextValue {
  me: MeResponse | null;
  season: SeasonInfo | null;
  loading: boolean;
  connecting: boolean;
  error: string | null;
  connect: (id: WalletId) => Promise<boolean>;
  disconnect: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

const VerseContext = createContext<VerseContextValue | null>(null);

export function VerseProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [season, setSeason] = useState<SeasonInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/verse/me", { cache: "no-store" });
      const data = await res.json();
      setMe(data.user ?? null);
      if (data.season !== undefined) setSeason(data.season);
    } catch {
      setMe(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const connect = useCallback(
    async (id: WalletId) => {
      setConnecting(true);
      setError(null);
      try {
        await signInWithWallet(id);
        trackEvent("verse_wallet_signin", { wallet: id });
        await refresh();
        return true;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Sign-in failed.";
        if (msg === "WALLET_NOT_FOUND") setError("Wallet extension not detected in this browser.");
        else if (/reject|denied|cancel/i.test(msg)) setError("Request cancelled in your wallet.");
        else setError(msg);
        return false;
      } finally {
        setConnecting(false);
      }
    },
    [refresh],
  );

  const disconnect = useCallback(async () => {
    await signOutWallet();
    trackEvent("wallet_disconnect");
    setMe(null);
  }, []);

  return (
    <VerseContext.Provider
      value={{ me, season, loading, connecting, error, connect, disconnect, refresh, clearError: () => setError(null) }}
    >
      {children}
    </VerseContext.Provider>
  );
}

export function useVerse(): VerseContextValue {
  const ctx = useContext(VerseContext);
  if (!ctx) throw new Error("useVerse must be used inside <VerseProvider>");
  return ctx;
}
