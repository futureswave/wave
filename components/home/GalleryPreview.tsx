import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";

const PLACEHOLDER_ITEMS = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
}));

export function GalleryPreview() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 border-t border-white/5">
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-2">The Art</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-2">Gallery Preview</h2>
          <p className="text-white/35 text-base">A glimpse of the VANTH universe.</p>
        </div>
        <Link
          href="/gallery"
          className="hidden sm:flex items-center gap-2 text-white/50 hover:text-white font-mono text-sm transition-colors group"
        >
          Full Gallery <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {PLACEHOLDER_ITEMS.map((item) => (
          <div
            key={item.id}
            className="relative aspect-square rounded overflow-hidden bg-[#111111] border border-white/5 group cursor-pointer"
          >
            {/* Center letter */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/4 text-6xl font-black select-none">V</span>
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-start p-4">
              <div>
                <p className="text-white text-xs font-bold font-mono">VANTH #{item.id}</p>
                <p className="text-white/40 text-[10px] font-mono">Solana NFT</p>
              </div>
            </div>
            {/* Border beam on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <BorderBeam colorFrom="rgba(255,255,255,0.3)" colorTo="rgba(255,255,255,0.06)" size={100} duration={4} borderWidth={1} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link href="/gallery" className="inline-flex items-center gap-2 text-white/50 font-mono text-sm">
          Full Gallery <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
