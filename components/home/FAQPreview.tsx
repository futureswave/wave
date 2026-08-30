"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { FEATURED_FAQS } from "@/lib/content/faq";
import { SectionHeading } from "@/components/ui/SectionHeading";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/8 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-white">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-white/40 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-white/55 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export function FAQPreview() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28 border-t border-white/5">
      <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />

      <div className="space-y-2 mb-8">
        {FEATURED_FAQS.map((faq) => (
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
