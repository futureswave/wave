import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCharacter, getCharacters } from "@/lib/content/collection";

export function generateStaticParams() {
  return getCharacters().map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = getCharacter(id);
  if (!character) return { title: "Not found" };

  return {
    title: `VANTH ${character.num}`,
    description: character.lore,
    openGraph: {
      title: `VANTH ${character.num} — ${character.sector}`,
      description: character.lore,
      images: [character.image],
    },
  };
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = getCharacter(id);
  if (!character) notFound();

  const facts = [
    ["Name", character.name],
    ["Sector", character.sector],
    ["Class", character.class],
    ["Faction", character.faction],
    ["Rarity", character.rarity],
  ] as const;

  return (
    <div className="relative">
      <div
        className="pointer-events-none fixed top-0 right-0 bottom-0 left-14 z-0"
        aria-hidden
      >
        <Image
          src={character.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-20 blur-2xl"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/85" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/collection"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-white/45 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Full artwork */}
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-[#111111]">
            <Image
              src={character.image}
              alt={`VANTH ${character.num}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div>
            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-display">
              VANTH {character.num}
            </h1>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40 mt-3">
              {character.status}
            </p>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 mt-10 pt-8 border-t border-white/10">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1">
                    {label}
                  </dt>
                  <dd className="font-mono text-sm text-white/85">{value}</dd>
                </div>
              ))}
            </dl>

            <section className="mt-10 pt-8 border-t border-white/10">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">
                Lore
              </h2>
              <p className="text-white/60 leading-relaxed">{character.lore}</p>
            </section>

            <section className="mt-10 pt-8 border-t border-white/10">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
                Traits
              </h2>
              <ul className="grid grid-cols-2 gap-2">
                {character.traits.map((trait) => (
                  <li
                    key={trait.label}
                    className="rounded border border-white/8 bg-white/[0.02] px-4 py-3"
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
                      {trait.label}
                    </p>
                    <p className="font-mono text-sm text-white/85 mt-1">
                      {trait.value}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
