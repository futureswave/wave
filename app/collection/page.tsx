import Image from "next/image";
import { getTraitCategories, getTraitTotals } from "@/lib/content/traits";
import { TraitAnatomy } from "@/components/traits/TraitAnatomy";
import { NumberTicker } from "@/components/ui/number-ticker";

export const metadata = {
  title: "Collection — VANTH NFT",
  description:
    "The anatomy of a VANTH. Ten trait categories, four types and two genders — every variant that makes up the First Generation.",
};

export default function CollectionPage() {
  const categories = getTraitCategories();
  const totals = getTraitTotals();

  const stats = [
    { value: totals.categories, label: "Categories" },
    { value: totals.genderSpecific, label: "Variants" },
    { value: totals.types, label: "Types" },
  ];

  return (
    <div className="relative">
      <div
        className="pointer-events-none fixed top-0 right-0 bottom-0 left-14 z-0"
        aria-hidden
      >
        <Image
          src="/images/optimized/background2.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/88" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-14 text-center">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">
            Anatomy of a VANTH
          </p>
          <h1 className="mb-6 text-5xl font-bold uppercase leading-none tracking-tight text-white sm:text-7xl">
            Collection
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-white/45">
            Every VANTH is assembled from ten layered categories. Pick a gender
            and a type, then follow any line back to the part of the body it
            belongs to.
          </p>

          <div className="mt-10 flex items-start justify-center gap-10 sm:gap-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <NumberTicker
                  value={stat.value}
                  className="block text-3xl font-bold tracking-tight text-white sm:text-4xl"
                />
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </header>

        <TraitAnatomy categories={categories} />
      </div>
    </div>
  );
}
