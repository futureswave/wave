"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { ScamWarningBanner } from "@/components/ui/ScamWarningBanner";
import { SOCIAL_LINKS } from "@/lib/config/links";
import { FAQS } from "@/lib/content/faq";


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
          <span className="text-white/40 text-xs font-mono w-5 shrink-0">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-sm font-semibold text-white">{q}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-white/25 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pl-14">
          <p className="text-white/55 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none fixed top-0 right-0 bottom-0 left-14 z-0"
        aria-hidden
      >
        <Image
          src="/images/optimized/background.webp"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/75" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-black tracking-wide text-white mb-4">FAQ</h1>
        <p className="text-white/55 max-w-lg mx-auto">
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
          <a href={SOCIAL_LINKS.discord.url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white hover:underline font-semibold transition-colors">
            Join our Discord
          </a>{" "}
          and ask the community or team.
        </p>
      </div>
      </div>
    </div>
  );
}
