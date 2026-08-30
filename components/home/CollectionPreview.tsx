import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedCharacters } from "@/lib/content/collection";
import { CharacterCard } from "@/components/collection/CharacterCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** PRD 7.02 — THE FIRST GENERATION. */
export function CollectionPreview() {
  const characters = getFeaturedCharacters(6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
      <SectionHeading
        eyebrow="The First Generation"
        title="Every VANTH carries a unique identity"
        lead="Six of the first signatures to stabilise after the Fracture. Hover to read their record."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {characters.map((character, i) => (
          <CharacterCard
            key={character.id}
            character={character}
            priority={i < 3}
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/collection"
          className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-widest font-mono border border-white/20 text-white/80 hover:border-white/50 hover:text-white transition-colors rounded"
        >
          Explore Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
