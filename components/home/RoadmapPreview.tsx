import Link from "next/link";
import { ArrowRight, Check, Clock, Loader } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { BorderBeam } from "@/components/ui/border-beam";

const phases = [
  {
    id: 0,
    name: "Phase 0",
    title: "Foundation",
    status: "complete",
    items: ["Project concept & art direction", "Team formation", "Website + social setup", "Whitelist collection"],
    gradientColor: "#141414",
    beamFrom: "rgba(255,255,255,0.15)",
    beamTo: "rgba(255,255,255,0.03)",
  },
  {
    id: 1,
    name: "Phase 1",
    title: "Launch Readiness",
    status: "active",
    items: ["Final art completion", "Magic Eden listing", "Community building", "Whitelist snapshot"],
    gradientColor: "#1a1a1a",
    beamFrom: "rgba(255,255,255,0.3)",
    beamTo: "rgba(255,255,255,0.06)",
  },
  {
    id: 2,
    name: "Phase 2",
    title: "Post-Launch Utility",
    status: "upcoming",
    items: ["Staking contract deployment", "VNTH token mechanics (TBA)", "Holder rewards", "Community experiences"],
    gradientColor: "#0f0f0f",
    beamFrom: "rgba(255,255,255,0.08)",
    beamTo: "rgba(255,255,255,0.02)",
  },
];

const statusConfig = {
  complete: { icon: Check, color: "text-white/70", dot: "bg-white/50", label: "Complete" },
  active: { icon: Loader, color: "text-white", dot: "bg-white animate-pulse", label: "In Progress" },
  upcoming: { icon: Clock, color: "text-white/25", dot: "bg-white/15", label: "Upcoming" },
};

export function RoadmapPreview() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 border-t border-white/5">
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-2">Development</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-2">Roadmap</h2>
          <p className="text-white/35 text-base">Clear milestones. Measurable delivery.</p>
        </div>
        <Link
          href="/roadmap"
          className="hidden sm:flex items-center gap-2 text-white/50 hover:text-white font-mono text-sm transition-colors group"
        >
          Full Roadmap <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {phases.map((phase) => {
          const config = statusConfig[phase.status as keyof typeof statusConfig];
          return (
            <MagicCard
              key={phase.id}
              gradientColor={phase.gradientColor}
              gradientOpacity={1}
              className="relative rounded border-white/8 bg-[#111111] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                    <span className={`text-xs font-mono uppercase tracking-wider ${config.color}`}>
                      {phase.name}
                    </span>
                  </div>
                  <config.icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{phase.title}</h3>
                <ul className="space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-white/40">
                      <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${
                        phase.status === "complete" ? "bg-white/50" :
                        phase.status === "active" ? "bg-white" : "bg-white/15"
                      }`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {phase.status === "active" && (
                <BorderBeam
                  colorFrom={phase.beamFrom}
                  colorTo={phase.beamTo}
                  size={180}
                  duration={8}
                  borderWidth={1.5}
                />
              )}
            </MagicCard>
          );
        })}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link href="/roadmap" className="inline-flex items-center gap-2 text-white/50 font-mono text-sm">
          Full Roadmap <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
