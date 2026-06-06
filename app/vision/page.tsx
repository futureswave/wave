import { Palette, Users, Layers, XCircle } from "lucide-react";
import { TBABadge } from "@/components/ui/TBABadge";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Vision — VANTH NFT Collection",
  description: "The long-term vision of VANTH. Art, community, and utility — without hype.",
};

const PILLARS = [
  {
    icon: Palette,
    title: "Art & Identity Expansion",
    description:
      "VANTH's visual universe is designed to grow. New art, collaborations, and editions will deepen the collection's identity over time — always rooted in the anime + cyberpunk aesthetic that defines us.",
    color: "text-white/60",
    bg: "bg-white/3 border-white/8",
  },
  {
    icon: Users,
    title: "Community Experiences",
    description:
      "Holders are not just owners — they are the community. We envision events, community votes, and shared experiences that make holding a VANTH NFT meaningful beyond the art itself.",
    color: "text-white/60",
    bg: "bg-white/3 border-white/8",
  },
  {
    icon: Layers,
    title: "Utility Exploration",
    description:
      "Staking and the VNTH token are the first step. We approach utility with care — only shipping what we can stand behind. Mechanics are TBA, and we will not announce what we cannot deliver.",
    color: "text-white/60",
    bg: "bg-white/3 border-white/8",
    badge: <TBABadge label="VNTH TBA" />,
  },
];

const WONT_DO = [
  "No hidden mints or surprise supply changes",
  "No fake giveaways or airdrop scams",
  "No promises of financial returns or investment advice",
  "No DMs from the team asking you to connect your wallet",
  "No rug — the team is public and accountable",
];

export default function VisionPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-black tracking-wide text-white mb-4">Our Vision</h1>
        <p className="text-white/40 max-w-xl mx-auto leading-relaxed">
          VANTH is a long-term project. We are building something that matters — not chasing short-term hype.
          Here is what we are working toward, and what we commit to never doing.
        </p>
      </div>

      {/* Vision statement */}
      <div className="bg-white/[0.04] border border-white/8 rounded p-8 mb-16 text-center">
        <blockquote className="text-xl sm:text-2xl font-semibold text-white leading-relaxed">
          &ldquo;To build an NFT ecosystem that earns its community&apos;s trust through consistent art, transparent operations, and utility that delivers on its promises.&rdquo;
        </blockquote>
        <p className="text-white/30 text-sm mt-4 font-mono">— VANTH Team</p>
      </div>

      {/* Pillars */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">Three Pillars</h2>
        <div className="space-y-4">
          {PILLARS.map((p) => (
            <div key={p.title} className={`border rounded p-6 ${p.bg}`}>
              <div className="flex items-start gap-4">
                <p.icon className={`w-6 h-6 ${p.color} shrink-0 mt-0.5`} />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-white">{p.title}</h3>
                    {p.badge}
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed">{p.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What we won't do */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-3">What We Won&apos;t Do</h2>
        <p className="text-white/40 text-sm mb-6">
          Trust is built by what you refuse to do as much as what you do. Here are our commitments.
        </p>
        <div className="bg-[#111111] border border-white/5 rounded p-6">
          <ul className="space-y-3">
            {WONT_DO.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-white/25 shrink-0 mt-0.5" />
                <span className="text-white/40 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="text-center">
        <Button href="/whitelist" variant="primary" size="lg">
          Request Access
        </Button>
      </div>
    </div>
  );
}
