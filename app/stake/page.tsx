"use client";

import { useState } from "react";
import { Shield, Wallet, Grid3x3, TrendingUp, Gift, AlertTriangle, ChevronRight } from "lucide-react";
import { ScamWarningBanner } from "@/components/ui/ScamWarningBanner";
import { ComingSoonBadge, TBABadge } from "@/components/ui/TBABadge";
import { trackEvent } from "@/lib/analytics";

// Minimal wallet state simulation (no real transactions)
function useWalletSimulator() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  async function connect(walletName: string) {
    setConnecting(true);
    try {
      // Try actual Phantom/Solflare connection
      const win = window as unknown as { phantom?: { solana?: { connect: () => Promise<{ publicKey: { toString: () => string } }> } }; solflare?: { connect: () => Promise<void>; publicKey?: { toString: () => string } } };
      if (walletName === "Phantom" && win.phantom?.solana) {
        const resp = await win.phantom.solana.connect();
        setAddress(resp.publicKey.toString());
        trackEvent("wallet_connect_success");
      } else if (walletName === "Solflare" && win.solflare) {
        await win.solflare.connect();
        setAddress(win.solflare.publicKey?.toString() ?? "Connected");
        trackEvent("wallet_connect_success");
      } else {
        // Wallet not installed
        alert(`${walletName} wallet not detected. Please install it first.`);
      }
    } catch {
      // User rejected or error
    } finally {
      setConnecting(false);
    }
  }

  function disconnect() {
    setAddress(null);
    trackEvent("wallet_disconnect");
  }

  return { address, connecting, connect, disconnect };
}

const STAKING_STEPS = [
  { icon: Wallet, label: "Connect", description: "Connect your Solana wallet (Phantom or Solflare)" },
  { icon: Grid3x3, label: "Select NFTs", description: "Choose which VANTH NFTs you want to stake" },
  { icon: TrendingUp, label: "Stake", description: "Stake your selected NFTs to start earning VNTH" },
  { icon: TrendingUp, label: "Track", description: "Monitor your staking rewards in real time" },
  { icon: Gift, label: "Claim VNTH", description: "Claim your earned VNTH tokens whenever you want" },
];

export default function StakePage() {
  const { address, connecting, connect, disconnect } = useWalletSimulator();

  function truncate(addr: string) {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-wide text-white">Stake</h1>
          <ComingSoonBadge />
        </div>
        <p className="text-white/40 leading-relaxed">
          Stake your VANTH NFTs to earn VNTH tokens. The staking system is currently in development.
        </p>
      </div>

      {/* Status banner */}
      <div className="bg-white/5 border border-white/10 rounded p-5 mb-8 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-white/40 shrink-0 mt-0.5" />
        <div>
          <p className="text-white/60 font-semibold text-sm mb-1 font-mono">Staking is not live yet</p>
          <p className="text-white/35 text-sm">
            Contract address and launch date are <TBABadge className="inline-flex mx-1" />. Only trust the contract address published on this website when staking goes live.
          </p>
        </div>
      </div>

      {/* Wallet connect */}
      <div className="bg-[#111111] border border-white/5 rounded p-6 mb-8">
        <h2 className="text-sm font-mono text-white/30 uppercase tracking-wider mb-4">Wallet</h2>

        {address ? (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <div>
                <p className="text-white font-mono text-sm font-semibold">{truncate(address)}</p>
                <p className="text-white/30 text-xs mt-0.5">Connected · No staking available yet</p>
              </div>
            </div>
            <button
              onClick={disconnect}
              className="text-white/30 hover:text-white text-xs transition-colors border border-white/10 hover:border-white/25 rounded px-3 py-1.5"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-white/35 text-sm mb-4">Connect your wallet to see your future staking position.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Phantom", "Solflare"].map((wallet) => (
                <button
                  key={wallet}
                  onClick={() => connect(wallet)}
                  disabled={connecting}
                  className="flex items-center justify-between gap-3 bg-white/3 border border-white/10 hover:border-white/20 hover:bg-white/5 rounded px-4 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className="text-white font-semibold text-sm">{wallet}</span>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* How it will work */}
      <div className="bg-[#111111] border border-white/5 rounded p-6 mb-8">
        <h2 className="text-sm font-mono text-white/30 uppercase tracking-wider mb-6">How Staking Will Work</h2>
        <div className="space-y-4">
          {STAKING_STEPS.map((step, i) => (
            <div key={step.label} className="flex items-start gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded bg-white/5 border border-white/10 text-white/40 font-bold text-xs shrink-0 font-mono">
                {i + 1}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <step.icon className="w-3.5 h-3.5 text-white/25" />
                  <span className="text-white/80 font-semibold text-sm">{step.label}</span>
                </div>
                <p className="text-white/30 text-xs mt-0.5">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security block */}
      <div className="mb-8">
        <ScamWarningBanner />
      </div>

      <div className="bg-white/3 border border-white/8 rounded p-5 text-center">
        <Shield className="w-5 h-5 text-white/30 mx-auto mb-2" />
        <p className="text-white/40 text-sm">
          <span className="text-white/70 font-semibold">Only trust the contract address published on this website.</span>{" "}
          We will never announce a staking contract address through DMs. Always verify here first.
        </p>
      </div>
    </div>
  );
}
