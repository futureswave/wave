import { TBABadge } from "@/components/ui/TBABadge";
import { Shield, Zap, Store, Calendar } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config/links";

// Values come from lib/config/links.ts; anything still null renders as TBA.
const items: { icon: typeof Zap; label: string; value: string | null }[] = [
  { icon: Zap, label: "Chain", value: SITE_CONFIG.chain },
  { icon: Store, label: "Mint Venue", value: SITE_CONFIG.mintVenue },
  { icon: Shield, label: "Supply", value: SITE_CONFIG.supply },
  { icon: Calendar, label: "Mint Date", value: SITE_CONFIG.mintDate },
];

export function TrustBar() {
  return (
    <section className="relative border-y border-white/5 bg-[#0f0f0f] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon className="w-4 h-4 text-white/25" />
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-white/20 uppercase tracking-widest leading-none mb-0.5 font-mono">{item.label}</span>
                {item.value ? (
                  <span className="text-sm font-semibold font-mono text-white/80 leading-none py-0.5">{item.value}</span>
                ) : (
                  <TBABadge />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
