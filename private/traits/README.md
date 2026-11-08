# Trait layer artwork

> **Confidential until mint.** This folder is deliberately outside `public/`.
> Nothing here is served statically — every file goes through
> `app/api/admin/traits/[...path]/route.ts`, which requires a valid admin
> session and answers 404 otherwise. Never move these files back into
> `public/`, and never import `lib/content/trait-layers.ts` from a client
> component (it is marked `server-only`, so the build will refuse).

Everything in this folder is **generated**. Do not edit it by hand.

```
node scripts/build-trait-assets.mjs
```

reads the raw 2000×2000 PNGs from `man/` and `women/` at the repo root and
writes:

- `private/traits/{gender}/{layer}/[{Type}/]{name}.webp` — 800px render layers
- `private/traits/thumbs/…` — 128px previews for the pickers
- `lib/content/trait-layers.ts` — the manifest the builder reads

The script is idempotent: a derivative newer than its source is skipped, so
re-running after adding a few files only converts those.

## The raw artwork is not in git

`man/` and `women/` are ~140 MB across 840 files and are git-ignored. Keep them
locally (or in shared storage) — they are needed only to regenerate this folder,
never to run or deploy the site. If they are missing the script exits with a
message rather than producing a half-built manifest.

## Layer order

`LAYER_ORDER` in `scripts/build-trait-assets.mjs` is the single source of truth
for stacking, and it is copied from the `layersOrder` block of the HashLips
`config.js` the collection was generated with — so the site stacks layers
exactly the way the minted art does.

That list covers the 20 layers both genders share. Two women-only layers are not
in it and are placed by what they are:

- `Eyes SAC ON` — hair falling over the eyes, so just above `Hair`
- `Hair AGIZ ON` — hair over the mouth, so just above `Mouths`

Those two positions are the only inferred entries. If a women character ever
looks wrong around the eyes or mouth, they are the first thing to check.

## The spreadsheet is not authoritative

`NFT_Trait_Listesi_Kategori_Sayilari.xlsx` lists which layers make up each trait,
but it disagrees with the files in one important way: not every expression
exists for every Type (`Eyes/Human` has 18 files, `Eyes/Aegis` has 12). The
manifest is therefore built by walking the filesystem, so the builder can only
ever offer combinations that were actually drawn.
