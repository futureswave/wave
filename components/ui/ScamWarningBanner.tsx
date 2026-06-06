import { ShieldAlert } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config/links";

interface ScamWarningBannerProps {
  compact?: boolean;
}

export function ScamWarningBanner({ compact = false }: ScamWarningBannerProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded px-4 py-2 text-white/50 text-sm">
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span className="font-mono text-xs">{SITE_CONFIG.scamWarning.body}</span>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded p-4 md:p-6">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-white/40 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-white/60 mb-1 font-mono text-sm">{SITE_CONFIG.scamWarning.title}</h3>
          <p className="text-white/35 text-sm leading-relaxed">{SITE_CONFIG.scamWarning.body}</p>
        </div>
      </div>
    </div>
  );
}
