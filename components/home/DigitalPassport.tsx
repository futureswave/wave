"use client";

import { motion } from "framer-motion";
import { PASSPORT_LAYERS, PASSPORT_LEAD } from "@/lib/content/passport";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * PRD 7.05 — the ownership narrative, and the most important section on the
 * page. IDENTITY → ACCESS → COMMUNITY → EXPERIENCES revealed as you descend.
 */
export function DigitalPassport() {
  return (
    <section
      id="passport"
      className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28 border-t border-white/5 scroll-mt-20"
    >
      <SectionHeading
        eyebrow="Vanth Passport"
        title="Your digital passport to the Vanthverse"
        lead={PASSPORT_LEAD}
      />

      <ol className="relative">
        {/* The spine connecting the four layers. */}
        <div
          className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-white/5 via-white/25 to-white/5"
          aria-hidden
        />

        {PASSPORT_LAYERS.map((layer, i) => (
          <motion.li
            key={layer.num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="relative pl-16 pb-12 last:pb-0"
          >
            <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#0a0a0a] font-mono text-[11px] text-white/60">
              {layer.num}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-display text-white">
              {layer.title}
            </h3>
            <p className="text-white/55 leading-relaxed mt-3 max-w-xl">
              {layer.description}
            </p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
