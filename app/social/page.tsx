import { ExternalLink } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/config/links";
import { ScamWarningBanner } from "@/components/ui/ScamWarningBanner";
<<<<<<< HEAD
import { TBABadge } from "@/components/ui/TBABadge";
=======
import { ComingSoonBadge } from "@/components/ui/TBABadge";
>>>>>>> ce00058c012544fa08b4127b8be3e2c7e2963f8d

export const metadata = {
  title: "Official Links — VANTH NFT",
  description: "Official VANTH community links. Always verify links through this page to stay safe.",
};

const links = [
  {
    label: "X (Twitter)",
    description: "Follow for announcements, art drops, and updates.",
    url: SOCIAL_LINKS.x.url,
    handle: SOCIAL_LINKS.x.handle,
    available: true,
  },
  {
    label: "Discord",
    description: "Join the community. Ask questions, get whitelist help, connect with the team.",
    url: SOCIAL_LINKS.discord.url,
    handle: "Official Server",
    available: true,
  },
  {
    label: "GitBook",
    description: "Documentation: project overview, lore, roadmap, and more.",
    url: SOCIAL_LINKS.gitbook.meetVanth.url,
    handle: SOCIAL_LINKS.gitbook.meetVanth.url,
    available: true,
  },
  {
<<<<<<< HEAD
    label: SOCIAL_LINKS.mintVenue.label,
    description: "Minting platform details will be announced before launch.",
    url: SOCIAL_LINKS.mintVenue.url,
    handle: "TBA",
=======
    label: "Magic Eden",
    description: "The only authorized minting and marketplace venue for VANTH NFTs.",
    url: null,
    handle: "Coming when collection is live",
>>>>>>> ce00058c012544fa08b4127b8be3e2c7e2963f8d
    available: false,
  },
];

export default function SocialPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-black tracking-wide text-white mb-4">Official Links</h1>
        <p className="text-white/40 max-w-lg mx-auto leading-relaxed">
          This page is the single source of truth for all VANTH links. Bookmark it and always verify before clicking any link claiming to be VANTH.
        </p>
      </div>

      <div className="mb-8">
        <ScamWarningBanner />
      </div>

      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.label} className="border border-white/8 rounded bg-white/3 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-white/80">{link.label}</h2>
<<<<<<< HEAD
                  {!link.available && <TBABadge />}
=======
                  {!link.available && <ComingSoonBadge />}
>>>>>>> ce00058c012544fa08b4127b8be3e2c7e2963f8d
                </div>
                <p className="text-white/40 text-sm mb-2">{link.description}</p>
                <p className="text-white/20 text-xs font-mono">{link.url || link.handle}</p>
              </div>
              {link.available && link.url ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded border border-white/12 text-white/60 hover:border-white/25 hover:text-white transition-all text-sm font-mono"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Visit
                </a>
              ) : (
<<<<<<< HEAD
                <span className="shrink-0 cursor-not-allowed">
                  <TBABadge />
=======
                <span className="shrink-0 px-4 py-2 rounded border border-white/5 text-white/20 text-sm cursor-not-allowed font-mono">
                  Soon
>>>>>>> ce00058c012544fa08b4127b8be3e2c7e2963f8d
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded bg-white/3 border border-white/8 text-center">
        <p className="text-white/35 text-sm">
          <span className="text-white/60 font-semibold">Remember:</span> The VANTH team will never DM you first on any platform. If someone claims to be from VANTH and messages you, it is a scam.
        </p>
      </div>
    </div>
  );
}
