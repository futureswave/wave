"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Download, Shuffle } from "lucide-react";
import { GenderTypeControls } from "@/components/traits/GenderTypeControls";
import { TraitList } from "@/components/traits/TraitList";
import {
  LAYER_ORDER,
  getBuildableCategories,
  getVariants,
} from "@/lib/content/trait-layers";
import type { TraitVariant, VariantLayer } from "@/lib/content/trait-layers";
import { getTraitCategories } from "@/lib/content/traits";
import type { Gender, TraitCategoryId, VanthType } from "@/lib/content/traits";

/** Edge of the exported PNG — matches the derivative size the layers ship at. */
const EXPORT_SIZE = 800;

type Selection = Partial<Record<TraitCategoryId, string>>;

/**
 * Live character composer. Every category picks one variant; the variants'
 * layers are flattened and painted in LAYER_ORDER, which is the same stacking
 * the collection itself was generated with.
 */
export function CharacterBuilder() {
  const categories = useMemo(() => {
    const byId = new Map(getTraitCategories().map((c) => [c.id, c]));
    return getBuildableCategories()
      .map((id) => byId.get(id))
      .filter((c) => c !== undefined);
  }, []);

  const [gender, setGender] = useState<Gender>("man");
  const [type, setType] = useState<VanthType>("Human");
  const [open, setOpen] = useState<TraitCategoryId | null>("hair");
  const [selection, setSelection] = useState<Selection>(() =>
    reconcile({}, "man", "Human", true),
  );
  const [exporting, setExporting] = useState(false);
  const reduceMotion = useReducedMotion();

  // The Type category drives which Eyes/Mouths files exist, so keep the two in
  // step: picking a Type trait is the same thing as switching the whole figure.
  const setTypeEverywhere = useCallback((next: VanthType) => {
    setType(next);
    setSelection((current) => ({ ...current, type: next }));
  }, []);

  // A variant chosen for one gender/type may not exist in another; anything
  // that no longer resolves falls back to the first variant on offer.
  useEffect(() => {
    setSelection((current) => reconcile(current, gender, type, false));
  }, [gender, type]);

  const layers = useMemo(() => {
    const flat: VariantLayer[] = [];
    for (const category of categories) {
      const variant = resolve(gender, category.id, type, selection[category.id]);
      if (variant) flat.push(...variant.layers);
    }
    return flat.sort(
      (a, b) => LAYER_ORDER.indexOf(a.layer) - LAYER_ORDER.indexOf(b.layer),
    );
  }, [categories, gender, type, selection]);

  const summary = categories
    .map((c) => `${c.label}: ${selection[c.id] ?? "—"}`)
    .join(", ");

  function randomize() {
    const next: Selection = {};
    for (const category of categories) {
      const variants = getVariants(gender, category.id, type);
      if (!variants.length) continue;
      next[category.id] = variants[Math.floor(Math.random() * variants.length)].name;
    }
    // Type is a trait like any other, so a roll can change the whole figure.
    if (next.type) setType(next.type as VanthType);
    setSelection(next);
  }

  async function download() {
    setExporting(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = EXPORT_SIZE;
      canvas.height = EXPORT_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      for (const layer of layers) {
        const image = await loadImage(layer.src);
        ctx.drawImage(image, 0, 0, EXPORT_SIZE, EXPORT_SIZE);
      }

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `vanth-${gender}-${type.toLowerCase()}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <section id="builder" className="scroll-mt-24">
      <header className="mb-8">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">
          Build your own
        </p>
        <h2 className="mb-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
          Character Lab
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-white/45">
          The same layers the collection was generated from, stacked live. Pick a
          trait in any category, roll the dice, or take the result home as a PNG.
        </p>
      </header>

      <div className="mb-8">
        <GenderTypeControls
          gender={gender}
          onGenderChange={setGender}
          type={type}
          onTypeChange={setTypeEverywhere}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        {/* ---------- Live render ---------- */}
        <div className="lg:sticky lg:top-24">
          <div
            role="img"
            aria-label={`VANTH preview — ${summary}`}
            className="relative aspect-square w-full overflow-hidden rounded-sm border border-white/[0.07] bg-[#0d0d0d]"
          >
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-1/3 animate-scan bg-gradient-to-b from-transparent via-[#7c3aed]/10 to-transparent motion-reduce:hidden"
            />
            {layers.map((layer, i) => (
              <Layer key={layer.src} src={layer.src} z={i} fade={!reduceMotion} />
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={randomize}
              className="flex items-center gap-2 rounded bg-white px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-white/90"
            >
              <Shuffle className="h-4 w-4" />
              Randomize
            </button>
            <button
              type="button"
              onClick={download}
              disabled={exporting}
              className="flex items-center gap-2 rounded border border-white/20 px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-white/80 transition-colors hover:border-white/50 hover:text-white disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
              {exporting ? "Rendering…" : "Download PNG"}
            </button>
          </div>
        </div>

        {/* ---------- Category pickers ---------- */}
        <ul className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {categories.map((category) => {
            const variants = getVariants(gender, category.id, type);
            const isOpen = open === category.id;
            const current = selection[category.id];

            return (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : category.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="min-w-0">
                    <span
                      className={`block font-mono text-[10px] uppercase tracking-[0.28em] ${
                        isOpen ? "text-[#a78bfa]" : "text-white/40"
                      }`}
                    >
                      {category.label}
                    </span>
                    <span className="mt-1 block truncate text-base text-white">
                      {current === "NONE" ? "None" : (current ?? "—")}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="font-mono text-[10px] text-white/25">
                      {variants.length}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-white/35 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6">
                        <TraitList
                          items={variants.map((v) => ({ name: v.name, thumb: v.thumb }))}
                          selected={current}
                          onSelect={(name) => {
                            if (category.id === "type") setTypeEverywhere(name as VanthType);
                            setSelection((s) => ({ ...s, [category.id]: name }));
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** One stacked layer, faded in so a slow file never flashes a half-drawn figure. */
function Layer({ src, z, fade }: { src: string; z: number; fade: boolean }) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // An image served from cache is already complete by the time React attaches
  // onLoad, and that event never fires — without this the layer stays hidden.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt=""
      aria-hidden
      onLoad={() => setLoaded(true)}
      style={{ zIndex: z }}
      className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-200 ${
        fade && !loaded ? "opacity-0" : "opacity-100"
      }`}
    />
  );
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function resolve(
  gender: Gender,
  category: TraitCategoryId,
  type: VanthType,
  name: string | undefined,
): TraitVariant | null {
  const variants = getVariants(gender, category, type);
  if (!variants.length) return null;
  return variants.find((v) => v.name === name) ?? variants[0];
}

/**
 * Drops any selection that does not exist for the new gender/type. `pinType`
 * keeps the Type category on the value the caller just chose.
 */
function reconcile(
  current: Selection,
  gender: Gender,
  type: VanthType,
  pinType: boolean,
): Selection {
  const next: Selection = {};
  for (const category of getBuildableCategories()) {
    const variants = getVariants(gender, category, type);
    if (!variants.length) continue;
    if (category === "type" && pinType) {
      next[category] = type;
      continue;
    }
    const kept = variants.find((v) => v.name === current[category]);
    next[category] = (kept ?? variants[0]).name;
  }
  return next;
}
