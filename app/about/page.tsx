import Image from "next/image";
import { Shield, Eye, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "About — VANTH NFT Collection",
  description: "Meet the VANTH team. Transparent, safety-first, long-term focused.",
};

const TEAM = [
  { role: "CEO", description: "Vision, strategy, and community leadership. Oversees the project direction and partnerships." },
  { role: "CTO", description: "Technical architecture, smart contracts, staking system, and website infrastructure." },
  { role: "Designer", description: "Art direction, NFT design, and the unique anime + cyberpunk visual identity of VANTH." },
  { role: "Developer", description: "Frontend, backend, and Web3 integrations. Builds the tools holders use." },
];

const VALUES = [
  {
    icon: Eye,
    title: "Transparency",
    description: "We publish our roadmap, update it openly, and communicate changes before they happen — not after.",
  },
  {
    icon: Shield,
    title: "Safety-First Communication",
    description: "We will never DM you first. Every official link is verified on this page. Anti-scam posture is core to our identity.",
  },
  {
    icon: Target,
    title: "Long-Term Focus",
    description: "VANTH is not a quick flip. We are building art, community, and utility that holders value for the long haul.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Full-width header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-black tracking-wide text-white mb-4">About VANTH</h1>
        <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
          VANTH is built by a small, focused team with a shared belief: that great NFT projects earn trust through transparency, not hype.
        </p>
      </div>

      {/* Split section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-16">

          {/* Left: sticky image */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-16">
            <div className="relative h-80 lg:h-[calc(100vh-5rem)] rounded-xl overflow-hidden">
              <Image
                src="/images/gallery/1.jpg"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                alt="VANTH NFT"
                priority
              />
            </div>
          </div>

          {/* Right: scrolling content */}
          <div className="w-full lg:w-1/2 py-4 lg:py-8 pb-16 space-y-16">

            {/* Team */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-8">The Team</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TEAM.map((member) => (
                  <div
                    key={member.role}
                    className="bg-[#10101e] border border-white/5 rounded-xl p-6 hover:border-purple-500/20 transition-colors"
                  >
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-3">
                      <span className="text-purple-400 text-xs font-bold tracking-wider font-mono">{member.role}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{member.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Values */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-8">Our Values</h2>
              <div className="space-y-4">
                {VALUES.map((val) => (
                  <div
                    key={val.title}
                    className="flex items-start gap-4 bg-[#10101e] border border-white/5 rounded-xl p-6"
                  >
                    <val.icon className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-white mb-1">{val.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{val.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Full-width CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Verify Official Links</h2>
          <p className="text-slate-400 text-sm mb-6">
            Always use links from this site. Never trust links from DMs or unofficial sources.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button href="/social" variant="secondary" size="sm">
              View Official Links
            </Button>
            <Button href="/whitelist" variant="primary" size="sm">
              Request Access
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
