"use client";

import { useState } from "react";
import { ChevronDown, ShieldAlert } from "lucide-react";
import { ScamWarningBanner } from "@/components/ui/ScamWarningBanner";

const FAQS = [
  {
    q: "What is VANTH?",
    a: "VANTH is an anime + cyberpunk NFT collection built on the Solana blockchain. It combines striking digital art with a long-term community and utility vision — including future staking and the VNTH token.",
  },
  {
    q: "Which blockchain is VANTH on?",
    a: "VANTH is on Solana — fast, low transaction fees, and built for scale. No Ethereum gas wars here.",
  },
  {
    q: "Where do I mint?",
    a: "Minting will happen exclusively on Magic Eden. Never mint from any other source or website. Always verify the contract address published on this website before interacting.",
  },
  {
    q: "Is the mint date announced?",
    a: "Not yet. The mint date is TBA. Follow our official X and Discord for announcements. We will never announce a mint date via DM.",
  },
  {
    q: "Is supply announced?",
    a: "Supply is TBA. It will be announced on official channels and updated on this website.",
  },
  {
    q: "How do I join the whitelist?",
    a: "Visit the Whitelist page on this site and fill out the form with your Solana wallet address, X username, and Discord username. No wallet connection required — just the address.",
  },
  {
    q: "Do I need to connect my wallet to join the whitelist?",
    a: "No. The whitelist form only requires your Solana wallet address (text input). You do not need to connect your wallet to any site to join the whitelist.",
  },
  {
    q: "Is staking live?",
    a: "Not yet. Staking is coming in Phase 2. The staking contract address and mechanics (VNTH token details) are TBA. Only trust the contract address that is published on this website.",
  },
  {
    q: "What is VNTH?",
    a: "VNTH is a future utility token that VANTH NFT holders will earn through staking. Full token mechanics and utility details are TBA — we will not overpromise on financial returns.",
  },
  {
    q: "How do I avoid scams?",
    a: "Only use links from this website. We will never DM you first on any platform. Never connect your wallet to a site that is not listed here. Minting only happens on Magic Eden — never on unofficial sites.",
  },
  {
    q: "What wallets are supported?",
    a: "Phantom and Solflare are the recommended Solana wallets for VANTH. Both are supported for wallet connect on the Stake page (coming soon).",
  },
  {
    q: "Will there be royalties?",
    a: "Royalty structure is TBA. Details will be published before the collection launches on Magic Eden.",
  },
  {
    q: "Is the team public?",
    a: "Yes. The VANTH team includes a CEO, CTO, Designer, and Developer. You can learn more about the team on the About page.",
  },
  {
    q: "Where will updates be posted?",
    a: "All updates are posted on our official X account, Discord server, and GitBook documentation — and reflected on this website. See the Official Links page for verified URLs.",
  },
  {
    q: "Can the roadmap change?",
    a: "Yes, transparently. The roadmap may evolve as the project develops. Any changes will be announced on official X and Discord before being updated here.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/5 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/3 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="text-white/20 text-xs font-mono w-5 shrink-0">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-sm font-semibold text-white">{q}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-white/25 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pl-14">
          <p className="text-white/40 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-black tracking-wide text-white mb-4">FAQ</h1>
        <p className="text-white/40 max-w-lg mx-auto">
          Common questions answered. If you have a question not covered here, ask in our Discord.
        </p>
      </div>

      <div className="mb-8">
        <ScamWarningBanner compact />
      </div>

      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
        ))}
      </div>

      <div className="mt-10 p-5 rounded bg-white/3 border border-white/8 text-center">
        <p className="text-white/35 text-sm">
          Still have questions?{" "}
          <a href="https://discord.gg/vanth" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white hover:underline font-semibold transition-colors">
            Join our Discord
          </a>{" "}
          and ask the community or team.
        </p>
      </div>
    </div>
  );
}
