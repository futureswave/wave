import Image from "next/image";
import { getCharacters } from "@/lib/content/collection";
import { CollectionExplorer } from "@/components/collection/CollectionExplorer";

export const metadata = {
  title: "Collection",
  description:
    "The First Generation. Every VANTH carries a unique identity — sector, class, faction, and a record of its own.",
};

export default function CollectionPage() {
  const characters = getCharacters();

  return (
    <div className="relative">
      <div
        className="pointer-events-none fixed top-0 right-0 bottom-0 left-14 z-0"
        aria-hidden
      >
        <Image
          src="/images/optimized/background.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/85" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-12">
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/40 mb-3">
            The First Generation
          </p>
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-display mb-4">
            Collection
          </h1>
          <p className="text-white/55 max-w-xl text-lg leading-relaxed">
            Not a grid of assets. A register of characters — each one a
            signature that held after the Fracture.
          </p>
        </header>

        <CollectionExplorer characters={characters} />
      </div>
    </div>
  );
}
