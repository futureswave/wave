"use client";

import { motion } from "framer-motion";
import { EVOLUTION } from "@/lib/content/evolution";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** PRD 7.07 — THE VANTH EVOLUTION, in place of a conventional roadmap. */
export function Evolution() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28 border-t border-white/5">
      <SectionHeading
        eyebrow="The Vanth Evolution"
        title="Now · Next · Future"
        lead="Not a roadmap of promises. A record of what is being built, what follows, and where it leads."
      />

      <div className="relative">
        {/* The timeline rail, drawn in as the section enters view. */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
          className="hidden md:block absolute top-[7px] left-[8.33%] right-[8.33%] h-px bg-gradient-to-r from-white/15 via-white/40 to-white/15"
          aria-hidden
        />

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {EVOLUTION.map((phase, i) => (
            <motion.li
              key={phase.marker}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.15 }}
              className="relative md:text-center"
            >
              <span
                className="block w-[15px] h-[15px] rounded-full border border-white/40 bg-[#0a0a0a] md:mx-auto mb-6"
                aria-hidden
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/40 mb-2">
                {phase.marker}
              </p>
              <h3 className="text-xl font-black uppercase tracking-display text-white mb-4">
                {phase.title}
              </h3>
              <ul className="space-y-1.5">
                {phase.items.map((item) => (
                  <li key={item} className="text-white/50 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
