// Turns the raw trait artwork into what the site actually ships.
//
//   node scripts/build-trait-assets.mjs
//
// Reads the 2000x2000 source PNGs from man/ and women/ (git-ignored, ~140 MB)
// and writes two optimised derivatives per layer into private/traits — an 800px
// render layer and a 128px thumbnail — plus lib/content/trait-layers.ts, the
// manifest the builder reads.
//
// The manifest is built by walking the filesystem rather than the spreadsheet,
// because the two disagree: not every expression exists for every Type
// (Eyes/Human has 18 files, Eyes/Aegis has 12). Whatever is on disk wins.
//
// Safe to re-run: a derivative newer than its source is left alone.

import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const GENDERS = [
  { id: "man", dir: "man" },
  { id: "women", dir: "women" },
];
// Kept OUT of public/: the artwork is unreleased, so it is only ever served by
// the admin-gated route app/api/admin/traits/[...path]/route.ts.
const OUT_LAYERS = path.join(ROOT, "private", "traits");
const OUT_THUMBS = path.join(ROOT, "private", "traits", "thumbs");
const MANIFEST = path.join(ROOT, "lib", "content", "trait-layers.ts");

const RENDER = { size: 800, quality: 80 };
const THUMB = { size: 128, quality: 75 };

/** Layer folder -> the trait category it feeds. */
const LAYER_CATEGORY = {
  Background: "background",
  Type: "type",
  "Aura ARKA": "aura",
  "Aura ON": "aura",
  Hair: "hair",
  "Hair ARKA": "hair",
  "Hair AGIZ ON": "hair",
  Eyes: "eyes",
  "Eyes GLOW SIMSEKLER": "eyes",
  "Eyes SAC ON": "eyes",
  Mouths: "mouths",
  Earrings: "earrings",
  "Facewear ARKAgozluk": "facewear",
  "Facewear ARKAmask": "facewear",
  "Facewear ONgozluk": "facewear",
  "Facewear ONmask": "facewear",
  Outfit: "outfit",
  "Outfit YAKALAR": "outfit",
  Hands: "hands",
  "Hands ARKA": "hands",
  "Hands IPLER": "hands",
  "Hands ON": "hands",
};

/**
 * Bottom to top — the generator's own stacking order, copied from the
 * `layersOrder` block of the HashLips config.js the collection was minted with.
 *
 * That list covers the 20 layers both genders share. The two women-only
 * layers are not in it and are placed by what they are: `Eyes SAC ON` is hair
 * falling over the eyes, so it sits just above Hair, and `Hair AGIZ ON` is hair
 * over the mouth, so it sits just above Mouths. Those two placements are the
 * only inferred entries here.
 */
const LAYER_ORDER = [
  "Background",
  "Aura ARKA",
  "Hands ARKA",
  "Hands IPLER",
  "Type",
  "Hair ARKA",
  "Outfit",
  "Hands",
  "Eyes",
  "Facewear ARKAmask",
  "Facewear ARKAgozluk",
  "Hair",
  "Eyes SAC ON", // inferred: hair over the eyes, above Hair
  "Earrings",
  "Eyes GLOW SIMSEKLER",
  "Hands ON",
  "Mouths",
  "Hair AGIZ ON", // inferred: hair over the mouth, above Mouths
  "Outfit YAKALAR",
  "Facewear ONmask",
  "Facewear ONgozluk",
  "Aura ON",
];


const VANTH_TYPES = ["Aegis", "Cyberborn", "Frostbite", "Human"];

// --- helpers ---------------------------------------------------------------

async function isDir(p) {
  try {
    return (await stat(p)).isDirectory();
  } catch {
    return false;
  }
}

/** Only rebuild when the source is newer than what we already wrote. */
async function isStale(src, out) {
  if (!existsSync(out)) return true;
  const [a, b] = await Promise.all([stat(src), stat(out)]);
  return a.mtimeMs > b.mtimeMs;
}

async function convert(src, out, { size, quality }) {
  if (!(await isStale(src, out))) return false;
  await mkdir(path.dirname(out), { recursive: true });
  await sharp(src)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality })
    .toFile(out);
  return true;
}

/** Web path for a file under public/. */
const webPath = (abs) =>
  "/api/admin/traits/" +
  path.relative(OUT_LAYERS, abs).split(path.sep).map(encodeURIComponent).join("/");

// --- walk ------------------------------------------------------------------

/**
 * Collects every source PNG as { gender, layer, type, name, src }.
 * `type` is null for layers that are not split per Type.
 */
async function collectSources() {
  const found = [];

  for (const gender of GENDERS) {
    const genderDir = path.join(ROOT, gender.dir);
    if (!(await isDir(genderDir))) {
      throw new Error(
        `Source folder ${gender.dir}/ is missing. The raw artwork is git-ignored — ` +
          `restore it locally before running this script.`,
      );
    }

    for (const layer of await readdir(genderDir)) {
      const layerDir = path.join(genderDir, layer);
      if (!(await isDir(layerDir))) continue;
      if (!(layer in LAYER_CATEGORY)) {
        console.warn(`  ! unknown layer folder, skipped: ${gender.dir}/${layer}`);
        continue;
      }

      for (const entry of await readdir(layerDir)) {
        const entryPath = path.join(layerDir, entry);

        if (await isDir(entryPath)) {
          // Per-Type subfolder, e.g. Eyes/Aegis/Angry.png
          for (const file of await readdir(entryPath)) {
            if (!file.endsWith(".png")) continue;
            found.push({
              gender: gender.id,
              layer,
              type: entry,
              name: path.basename(file, ".png"),
              src: path.join(entryPath, file),
            });
          }
          continue;
        }

        if (!entry.endsWith(".png")) continue;
        found.push({
          gender: gender.id,
          layer,
          type: null,
          name: path.basename(entry, ".png"),
          src: entryPath,
        });
      }
    }
  }

  return found;
}

// --- manifest --------------------------------------------------------------

/**
 * Groups the flat file list into variants: one entry per
 * gender + category + Type + trait name, carrying every layer that contributes.
 *
 * A per-Type layer contributes only to that Type; everything else contributes
 * to all four, which is why Type is part of the key rather than a filter.
 */
function buildVariants(files) {
  // key: gender|category|type|name
  const variants = new Map();

  for (const file of files) {
    const category = LAYER_CATEGORY[file.layer];
    const types = file.type ? [file.type] : VANTH_TYPES;

    for (const type of types) {
      const key = `${file.gender}|${category}|${type}|${file.name}`;
      if (!variants.has(key)) {
        variants.set(key, {
          gender: file.gender,
          category,
          type,
          name: file.name,
          layers: [],
        });
      }
      variants.get(key).layers.push({ layer: file.layer, src: file.src });
    }
  }

  // Stack each variant bottom-to-top once, here, so the client never sorts.
  for (const variant of variants.values()) {
    variant.layers.sort(
      (a, b) => LAYER_ORDER.indexOf(a.layer) - LAYER_ORDER.indexOf(b.layer),
    );
  }

  return [...variants.values()];
}

function renderManifest(variants) {
  const quote = (s) => JSON.stringify(s);

  // gender -> category -> type -> variants
  const tree = {};
  for (const v of variants) {
    ((tree[v.gender] ??= {})[v.category] ??= {})[v.type] ??= [];
    tree[v.gender][v.category][v.type].push(v);
  }

  const lines = [];
  const w = (s = "") => lines.push(s);

  w("// Layer manifest for the admin-only Character Lab (/admin/lab).");
  w("//");
  w("// GENERATED by scripts/build-trait-assets.mjs from the raw artwork in");
  w("// man/ and women/ — do not edit by hand. It lists only files that exist on");
  w("// disk, so the builder can never request a layer that was never drawn.");
  w("//");
  w("// SERVER-ONLY: this lists every unreleased trait. Never import it from a");
  w("// client component — the build fails if you do.");
  w("");
  w('import "server-only";');
  w('import type { Gender, TraitCategoryId, VanthType } from "./traits";');
  w("");
  w("export type LayerId =");
  for (const id of LAYER_ORDER) w(`  | ${quote(id)}`);
  w("  ;");
  w("");
  w("/**");
  w(" * Bottom to top. Every variant's layers are already sorted by this, so the");
  w(" * builder can flatten selections and paint them in array order.");
  w(" */");
  w("export const LAYER_ORDER: LayerId[] = [");
  for (const id of LAYER_ORDER) w(`  ${quote(id)},`);
  w("];");
  w("");
  w("export type VariantLayer = { layer: LayerId; src: string };");
  w("");
  w("export type TraitVariant = {");
  w("  name: string;");
  w("  /** Contributing layers, already ordered bottom to top. */");
  w("  layers: VariantLayer[];");
  w("  /** 128px preview of the variant's most representative layer. */");
  w("  thumb: string;");
  w("};");
  w("");
  w(
    "type VariantTree = Record<Gender, Partial<Record<TraitCategoryId, Record<VanthType, TraitVariant[]>>>>;",
  );
  w("");
  w("const VARIANTS: VariantTree = {");

  for (const gender of Object.keys(tree).sort()) {
    w(`  ${gender}: {`);
    for (const category of Object.keys(tree[gender]).sort()) {
      w(`    ${category}: {`);
      for (const type of VANTH_TYPES) {
        const list = (tree[gender][category][type] ?? []).slice().sort(byName);
        w(`      ${type}: [`);
        for (const v of list) {
          const layers = v.layers
            .map((l) => `{ layer: ${quote(l.layer)}, src: ${quote(l.web)} }`)
            .join(", ");
          w(
            `        { name: ${quote(v.name)}, thumb: ${quote(v.thumb)}, layers: [${layers}] },`,
          );
        }
        w("      ],");
      }
      w("    },");
    }
    w("  },");
  }

  w("};");
  w("");
  w("/** Variants offered for one gender/category/type, alphabetical, NONE last. */");
  w("export function getVariants(");
  w("  gender: Gender,");
  w("  category: TraitCategoryId,");
  w("  type: VanthType,");
  w("): TraitVariant[] {");
  w("  return VARIANTS[gender][category]?.[type] ?? [];");
  w("}");
  w("");
  w("/** Categories the builder can offer, in the order they are presented. */");
  w("export function getBuildableCategories(): TraitCategoryId[] {");
  w("  return [");
  for (const c of BUILDER_CATEGORY_ORDER) w(`    ${quote(c)},`);
  w("  ];");
  w("}");
  w("");
  w("/**");
  w(" * Thumbnail for a trait name without knowing its Type — used by the anatomy");
  w(" * panel, which lists every variant of a category regardless of Type.");
  w(" */");
  w("export function findThumb(");
  w("  gender: Gender,");
  w("  category: TraitCategoryId,");
  w("  name: string,");
  w("): string | null {");
  w("  const byType = VARIANTS[gender][category];");
  w("  if (!byType) return null;");
  w("  for (const variants of Object.values(byType)) {");
  w("    const hit = variants.find((v) => v.name === name);");
  w("    if (hit) return hit.thumb;");
  w("  }");
  w("  return null;");
  w("}");
  w("");
  w("/** A variant with no artwork at all — renders as nothing. */");
  w('export const NONE_NAME = "NONE";');
  w("");

  return lines.join("\n");
}

/** Order the builder presents categories in — roughly back-to-front. */
const BUILDER_CATEGORY_ORDER = [
  "type",
  "background",
  "aura",
  "hair",
  "eyes",
  "mouths",
  "facewear",
  "earrings",
  "outfit",
  "hands",
];

/** Alphabetical, but NONE always sinks to the bottom of a list. */
function byName(a, b) {
  if (a.name === "NONE") return 1;
  if (b.name === "NONE") return -1;
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
}

/**
 * The layer whose thumbnail best represents a variant: the topmost one, which
 * for a glasses/mask/aura pair is the front half rather than the hidden back.
 */
function thumbLayer(variant) {
  return variant.layers[variant.layers.length - 1];
}

// --- main ------------------------------------------------------------------

async function main() {
  console.log("Scanning source artwork...");
  const files = await collectSources();
  console.log(`  ${files.length} source PNGs`);

  console.log("Writing derivatives...");
  let written = 0;
  const outFor = new Map();

  for (const file of files) {
    const rel = path.join(
      file.gender,
      file.layer,
      ...(file.type ? [file.type] : []),
      `${file.name}.webp`,
    );
    const layerOut = path.join(OUT_LAYERS, rel);
    const thumbOut = path.join(OUT_THUMBS, rel);

    if (await convert(file.src, layerOut, RENDER)) written++;
    if (await convert(file.src, thumbOut, THUMB)) written++;

    outFor.set(file.src, {
      web: webPath(layerOut),
      thumb: webPath(thumbOut),
    });
    if (written && written % 200 === 0) process.stdout.write(`  ${written} written\r`);
  }
  console.log(`  ${written} files written, ${files.length * 2 - written} already current`);

  console.log("Building manifest...");
  const variants = buildVariants(files);
  for (const variant of variants) {
    for (const layer of variant.layers) layer.web = outFor.get(layer.src).web;
    variant.thumb = outFor.get(thumbLayer(variant).src).thumb;
  }

  await mkdir(path.dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, renderManifest(variants), "utf8");
  console.log(`  ${variants.length} variants -> ${path.relative(ROOT, MANIFEST)}`);
  console.log("Done.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
