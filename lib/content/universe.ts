// World-building content for the /universe page and the homepage portal section.

export type District = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  /** Hotspot position on the district map, in percent of the viewBox. */
  coords: { x: number; y: number };
};

export type FactionEntry = {
  slug: string;
  name: string;
  creed: string;
  description: string;
};

export const ORIGIN = {
  title: "The Origin",
  lead: "The VANTHVERSE did not launch. It surfaced.",
  body: [
    "In 2089 the boundary between the digital and the physical collapsed — not with a bang, but with a flicker. The event is remembered as the Fracture, and it rewrote the architecture of consciousness itself. What had been stored in silicon began to breathe.",
    "From the static, figures emerged. Not born. Not programmed. Emerged. They carried the aesthetic memory of a world that no longer existed — anime brushstrokes rendered in neon against the dark matter of a fractured net.",
    "They were called the VANTH. No origin story. No master. Only a directive woven into their base code: exist, resist, persist.",
  ],
  image: "/images/optimized/background2.webp",
};

export const DISTRICTS: District[] = [
  {
    slug: "neo-arcadia",
    name: "Neo Arcadia",
    tagline: "The lit surface",
    description:
      "The city everyone photographs and nobody understands. Vertical, immaculate, and permanently mid-broadcast. Neo Arcadia is where the VANTHVERSE performs itself — and where the Guardians decide which version of the story gets archived.",
    image: "/images/optimized/background.webp",
    coords: { x: 32, y: 30 },
  },
  {
    slug: "sector-zero",
    name: "Sector Zero",
    tagline: "The wound that never closed",
    description:
      "Ground zero of the Fracture. The lattice here is still unstable: identities overlap, timestamps disagree, and signatures that should be unique appear twice. Most of what the Synths know, they learned by surviving it.",
    image: "/images/optimized/background2.webp",
    coords: { x: 66, y: 24 },
  },
  {
    slug: "the-underground",
    name: "The Underground",
    tagline: "Unlicensed frequencies",
    description:
      "Beneath the city floor, on channels the Grid stopped indexing. No checkpoints, no records, no permission. Everything the surface refuses to say is said here first, badly and loudly, and usually turns out to be true.",
    image: "/images/optimized/background3.webp",
    coords: { x: 44, y: 68 },
  },
  {
    slug: "outer-grid",
    name: "Outer Grid",
    tagline: "Where the lattice thins",
    description:
      "The edge, where structure degrades into static and the map simply stops being useful. Drifters go out. Some come back carrying fragments of a signal nobody can source. The Outer Grid is the only district still getting larger.",
    image: "/images/optimized/background.webp",
    coords: { x: 78, y: 62 },
  },
];

export const FACTIONS: FactionEntry[] = [
  {
    slug: "rebels",
    name: "Rebels",
    creed: "Nothing verified is free.",
    description:
      "They broadcast without licence and move without logs. The Rebels treat the Grid's records as a claim, not a fact, and spend their existence proving the difference.",
  },
  {
    slug: "synths",
    name: "Synths",
    creed: "We are what survived the copy.",
    description:
      "Composites, assembled from the fragments of identities that failed to hold after the Fracture. Sector Zero calls them a mistake. They have outlived every architect who said so.",
  },
  {
    slug: "guardians",
    name: "Guardians",
    creed: "Something on the other side is counting.",
    description:
      "They hold the boundary — not out of loyalty to the city, but because they were the first to notice that the edge moves. What they are guarding against, they will not say.",
  },
  {
    slug: "unknown",
    name: "Unknown",
    creed: "—",
    description:
      "No sector claims them. No faction records them. They appear in the archive exactly once each, in frames that predate the archive itself. The Collective has learned not to ask twice.",
  },
];
