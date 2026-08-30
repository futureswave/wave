"use client";

import { useMemo, useState } from "react";
import { CharacterCard } from "./CharacterCard";
import {
  FACTIONS,
  RARITIES,
  type VanthCharacter,
} from "@/lib/content/collection";

type FilterGroup = "all" | "genesis" | "faction" | "rarity";

const GROUPS: { key: FilterGroup; label: string }[] = [
  { key: "all", label: "All" },
  { key: "genesis", label: "Genesis" },
  { key: "faction", label: "Faction" },
  { key: "rarity", label: "Rarity" },
];

/**
 * PRD 8 — the collection grid with its filter bar. Filtering is a two-level
 * choice: pick a group, then (for faction/rarity) a value within it.
 */
export function CollectionExplorer({
  characters,
}: {
  characters: VanthCharacter[];
}) {
  const [group, setGroup] = useState<FilterGroup>("all");
  const [value, setValue] = useState<string | null>(null);

  const values = useMemo(() => {
    if (group === "faction") return FACTIONS as readonly string[];
    if (group === "rarity") return RARITIES as readonly string[];
    return null;
  }, [group]);

  const visible = useMemo(() => {
    if (group === "genesis") {
      return characters.filter((c) => c.class === "Genesis");
    }
    if (group === "faction" && value) {
      return characters.filter((c) => c.faction === value);
    }
    if (group === "rarity" && value) {
      return characters.filter((c) => c.rarity === value);
    }
    return characters;
  }, [characters, group, value]);

  function selectGroup(next: FilterGroup) {
    setGroup(next);
    setValue(null);
  }

  return (
    <>
      <div className="mb-10 space-y-3">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter collection"
        >
          {GROUPS.map((g) => (
            <button
              key={g.key}
              onClick={() => selectGroup(g.key)}
              aria-pressed={group === g.key}
              className={`px-4 py-2 rounded font-mono text-xs uppercase tracking-widest border transition-colors ${
                group === g.key
                  ? "border-white/60 bg-white text-black"
                  : "border-white/12 text-white/50 hover:text-white hover:border-white/35"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {values && (
          <div className="flex flex-wrap gap-2">
            {values.map((v) => (
              <button
                key={v}
                onClick={() => setValue(value === v ? null : v)}
                aria-pressed={value === v}
                className={`px-3 py-1.5 rounded font-mono text-[11px] uppercase tracking-widest border transition-colors ${
                  value === v
                    ? "border-white/50 text-white bg-white/10"
                    : "border-white/10 text-white/40 hover:text-white/80 hover:border-white/25"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        )}

        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/35 pt-1">
          {visible.length} {visible.length === 1 ? "signature" : "signatures"}
        </p>
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {visible.map((character, i) => (
            <CharacterCard
              key={character.id}
              character={character}
              priority={i < 4}
            />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center font-mono text-sm text-white/40">
          No signatures match this filter.
        </p>
      )}
    </>
  );
}
