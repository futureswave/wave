import { TBABadge } from "@/components/ui/TBABadge";
import { CheckCircle, Clock, Loader } from "lucide-react";

export const metadata = {
  title: "Roadmap — VANTH NFT Collection",
  description: "VANTH development roadmap. Clear milestones, measurable delivery.",
};

const phases = [
  {
    id: 0,
    name: "Phase 0",
    title: "Foundation",
    status: "complete",
    items: [
      "Create a unique narrative and artistic vision for each special character in the collection.",
      "Build a strong community on social platforms (Twitter and Discord).",
      "Design and finalize the artwork, take inspiration from the best and ensure high quality.",
      "Collaborate with DAOs and other NFT projects to best promote the project.",
      "Integrate AI chatbots on our Discord server to instantly answer questions and direct new participants.",
      "Open the first mint phase to whitelisted contributors, followed by a transparent and fair public sale.",
      "Early adopters gain first access to key roles and interactive features.",
      "Special incentive services for Rare and Legend NFT owners.",
    ],
  },
  {
    id: 1,
    name: "Phase 1",
    title: "Launch & Community",
    status: "active",
    items: [
      "Assign specific roles to each owner and create a dedicated DAO.",
      "Special events within the project, raffles and access to decision-making within the project.",
      "Staking operations initiated — at least 80% of secondary market revenues paid back to the community through Vanth staking.",
      "Develop policies to protect the floor price and maintain stability.",
      "VNTH Token Launch: the VNTH token will be released to Vanth holders via airdrop.",
      "Collaborations: partner with established NFT collections for cross-community benefits and joint events.",
    ],
  },
  {
    id: 2,
    name: "Phase 2",
    title: "Utility & Expansion",
    status: "upcoming",
    items: [
      "AI + AR integrations: animate your NFT in the real world with the phone camera.",
      "Game integration: develop a play-to-earn (P2E) game featuring NFTs as in-game characters and assets.",
      "Private chat rooms created for owners to network and keep the community alive.",
      "Community-produced stories, songs and fan art — the best contributions get rewarded.",
      "Workshops with Web3 experts and career counselling opportunities for holders.",
    ],
    tba: true,
  },
];

const statusConfig = {
  complete: { icon: CheckCircle, color: "text-white/60", bg: "bg-white/5 border-white/10", label: "Complete" },
  active: { icon: Loader, color: "text-white", bg: "bg-white/8 border-white/15", label: "In Progress" },
  upcoming: { icon: Clock, color: "text-white/25", bg: "bg-[#111111] border-white/5", label: "Upcoming" },
};

export default function RoadmapPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-black tracking-wide text-white mb-4">Roadmap</h1>
        <p className="text-white/40 max-w-xl mx-auto leading-relaxed">
          Clear milestones, measurable delivery. Our roadmap may evolve — all updates are published on official channels and here.
        </p>
      </div>

      <div className="space-y-8">
        {phases.map((phase) => {
          const config = statusConfig[phase.status as keyof typeof statusConfig];
          return (
            <div key={phase.id} className={`border rounded-2xl p-6 sm:p-8 ${config.bg}`}>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <config.icon className={`w-4 h-4 ${config.color}`} />
                    <span className={`text-xs font-mono uppercase tracking-wider ${config.color}`}>
                      {phase.name} — {config.label}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{phase.title}</h2>
                </div>
                {phase.tba && <TBABadge label="Details TBA" />}
              </div>

              <ul className="space-y-3">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/40">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${phase.status === "complete" ? "bg-white/50" : phase.status === "active" ? "bg-white" : "bg-white/15"}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-12 p-4 rounded bg-white/3 border border-white/8">
        <p className="text-white/35 text-sm text-center font-mono">
          <span className="text-white/60 font-semibold">Transparency note:</span> This roadmap may evolve as the project develops.
          All changes will be announced on official{" "}
          <a href="https://x.com/vanth_nft" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white hover:underline">X</a> and{" "}
          <a href="https://discord.gg/vanth" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white hover:underline">Discord</a> channels before being reflected here.
        </p>
      </div>
    </div>
  );
}
