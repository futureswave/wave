# Trait page artwork

The `/traits` page renders a bare base figure with callout lines pointing at it.

## Base renders

```
public/images/traits/base/
  m-Aegis.png      w-Aegis.png
  m-Cyberborn.png  w-Cyberborn.png
  m-Frostbite.png  w-Frostbite.png
  m-Human.png      w-Human.png
```

`m-` is male, `w-` is female; the suffix is the Type exactly as spelled in
`VANTH_TYPES`. The filename is built in `components/traits/BaseFigure.tsx`; a
missing file falls back to a drawn silhouette rather than a broken frame.

**Current files:** 2000×2000 transparent PNG, bust crop — skull top around 10%,
head down to ~58%, shoulders from ~65% to the bottom edge, subject facing right.

**Replacing them:** keep the square ratio and that framing. The callout anchors
in `lib/content/traits.ts` are percentages of this box, so a reframed render
will pull the lines off the body — adjust the `anchor` values if the crop moves.

## Regenerating the trait data

`lib/content/traits.ts` was generated from
`NFT_Trait_Listesi_Kategori_Sayilari.xlsx` and is committed as plain TypeScript.
If the trait set changes, regenerate the file rather than hand-editing it; the
`blurb` and `anchor` fields are authored by hand and should be carried over.
