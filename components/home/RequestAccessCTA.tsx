import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

/** PRD 7.09 — the funnel into the access flow. */
export function RequestAccessCTA() {
  return (
    <section className="relative py-28 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 z-0" aria-hidden>
        <Image
          src="/images/optimized/background3.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/80" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/40 mb-4">
          Request Access
        </p>
        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-display leading-tight">
          Request access to
          <br />
          the Vanthverse
        </h2>
        <p className="text-white/60 text-lg mt-5">Join the early collective.</p>

        <Link
          href="/whitelist"
          className="inline-flex items-center gap-2 mt-10 px-10 py-4 text-sm font-bold uppercase tracking-widest font-mono bg-white text-black hover:bg-white/90 transition-colors rounded"
        >
          Request Access <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
