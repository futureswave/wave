import { Shield } from "lucide-react";
import { AccessFlow } from "@/components/access/AccessFlow";
import { ScamWarningBanner } from "@/components/ui/ScamWarningBanner";

export const metadata = {
  title: "Request Access — VANTH",
  description: "VANTH access is invite-only. Apply with your Access Code.",
};

export default function WhitelistPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-3">
            Proof of Reputation
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-wide text-white mb-4">
            Request Access
          </h1>
          <p className="text-white/40 leading-relaxed max-w-md mx-auto">
            VANTH access is invite-only. An Access Code lets you apply, but acceptance is not guaranteed.
          </p>
        </div>

        {/* Scam warning */}
        <ScamWarningBanner compact />

        {/* Interactive flow (client component) */}
        <AccessFlow />

        {/* Privacy notice */}
        <div className="bg-[#111111] border border-white/5 rounded p-5">
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-white/25 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-mono text-white/30 uppercase tracking-wider mb-2">
                Privacy Notice
              </h3>
              <ul className="space-y-1 text-xs text-white/30 leading-relaxed">
                <li>We store: wallet address, X username, Discord username, and application essays.</li>
                <li>Purpose: Whitelist processing and eligibility review.</li>
                <li>No email is collected. Data is not sold or shared with third parties.</li>
                <li>Stored securely with no public read access.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
