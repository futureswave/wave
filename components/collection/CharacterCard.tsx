"use client";

import Image from "next/image";
import Link from "next/link";
import type { VanthCharacter } from "@/lib/content/collection";

/**
 * The one character tile used by both the homepage preview grid and the
 * /collection grid. Hover reveals the identity panel described in PRD 7.02.
 */
export function CharacterCard({
  character,
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
}: {
  character: VanthCharacter;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Link
      href={`/collection/${character.id}`}
      className="group relative block aspect-[3/4] overflow-hidden rounded-xl bg-[#111111] border border-white/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      aria-label={`View VANTH ${character.num}`}
    >
      <Image
        src={character.image}
        alt={`VANTH ${character.num}`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />

      {/* Resting state: identifier only. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 group-hover:opacity-0">
        <p className="font-mono text-sm text-white tracking-widest">
          VANTH {character.num}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 mt-1">
          {character.sector}
        </p>
      </div>

      {/* Hover / focus state: the data reveal. */}
      <div className="absolute inset-0 flex flex-col justify-end gap-4 bg-black/80 p-4 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <p className="font-mono text-sm text-white tracking-widest">
          VANTH {character.num}
        </p>
        <dl className="space-y-2">
          {(
            [
              ["Sector", character.sector],
              ["Class", character.class],
              ["Status", character.status],
            ] as const
          ).map(([label, value]) => (
            <div key={label}>
              <dt className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
                {label}
              </dt>
              <dd className="font-mono text-xs text-white/85">{value}</dd>
            </div>
          ))}
        </dl>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 border-t border-white/15 pt-3">
          View Profile →
        </span>
      </div>
    </Link>
  );
}
