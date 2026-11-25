import type { Metadata } from "next";
import { RULE_SECTIONS, RULES_UPDATED, RULES_VERSION, XP_TABLE } from "@/lib/content/verse-rules";

export const metadata: Metadata = {
  title: "Scoring & Rules — VANTH Verse",
  description: "How XP, seasons, tie-breakers, fair play and privacy work in the VANTH Verse.",
};

export default function RulesPage() {
  return (
    <div className="max-w-3xl">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-white/40">
        Rules v{RULES_VERSION} · updated {RULES_UPDATED}
      </p>
      <h1 className="tracking-display mb-10 text-4xl font-bold uppercase leading-[1.05] text-white sm:text-6xl">
        Scoring &amp; Rules
      </h1>

      <div className="mb-14 overflow-x-auto rounded-sm border border-white/[0.07]">
        <table className="w-full text-left text-sm">
          <thead className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
            <tr className="border-b border-white/[0.06]">
              <th className="px-4 py-3 font-normal">Quest class</th>
              <th className="px-4 py-3 font-normal">XP</th>
              <th className="px-4 py-3 font-normal">Notes</th>
            </tr>
          </thead>
          <tbody>
            {XP_TABLE.map((r) => (
              <tr key={r.cls} className="border-b border-white/[0.04] last:border-0">
                <td className="px-4 py-3 text-white">{r.cls}</td>
                <td className="px-4 py-3 font-mono text-white/70">{r.xp}</td>
                <td className="px-4 py-3 text-white/45">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-12">
        {RULE_SECTIONS.map((s, i) => (
          <section key={s.title}>
            <h2 className="mb-4 flex items-baseline gap-3 text-2xl font-bold uppercase text-white">
              <span className="font-mono text-sm text-white/25">{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </h2>
            <ul className="space-y-3">
              {s.items.map((item) => (
                <li key={item} className="flex gap-3 text-white/60">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" aria-hidden />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
