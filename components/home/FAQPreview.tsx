"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

const TOP_FAQS = [
  {
    q: "What is VANTH?",
    a: "VANTH is an anime + cyberpunk NFT collection on the Solana blockchain. It combines striking digital art with a long-term community and utility vision.",
  },
  {
    q: "Which blockchain is VANTH on?",
    a: "VANTH is on Solana — fast, low-fee, and built for scale.",
  },
  {
    q: "Where do I mint?",
    a: "Minting will happen exclusively on Magic Eden. Never mint from any other source. Always verify the contract address published on this website.",
  },
  {
    q: "How do I avoid scams?",
    a: "Only trust links from this website. We will never DM you first. Never connect your wallet to unofficial sites claiming to be VANTH.",
  },
  {
    q: "Is staking live?",
    a: "Not yet. Staking and VNTH token mechanics are coming in Phase 2. Details are TBA — follow official channels for updates.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/5 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/3 transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-white">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-slate-400 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export function FAQPreview() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Frequently Asked Questions</h2>
        <p className="text-slate-400">Common questions answered.</p>
      </div>

      <div className="space-y-2 mb-8">
        {TOP_FAQS.map((faq) => (
          <FAQItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/faq"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white font-mono text-sm transition-colors"
        >
          Read All FAQs <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
