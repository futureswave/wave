// The First Generation — character data for the VANTH collection.
//
// This is the single source of truth for both the homepage preview and the
// /collection pages. It is deliberately a plain array of a well-defined type:
// when the full artwork + trait set arrives, swap the CHARACTERS constant for a
// JSON import (or a CMS fetch) without touching any component.

export type Faction = "Rebels" | "Synths" | "Guardians" | "Unknown";

export type Sector =
  | "Neo Arcadia"
  | "Sector Zero"
  | "The Underground"
  | "Outer Grid";

export type CharacterClass = "Genesis" | "Awakened" | "Drifter" | "Unknown";

export type Rarity = "Common" | "Rare" | "Legendary" | "Mythic";

export type Trait = {
  label: string;
  value: string;
};

export type VanthCharacter = {
  /** URL slug — /collection/[id] */
  id: string;
  /** Display number, e.g. "#021" */
  num: string;
  name: string;
  image: string;
  sector: Sector;
  class: CharacterClass;
  faction: Faction;
  status: string;
  rarity: Rarity;
  lore: string;
  traits: Trait[];
};

const CHARACTERS: VanthCharacter[] = [
  {
    id: "001",
    num: "#001",
    name: "Unknown",
    image: "/images/gallery/1.jpg",
    sector: "Neo Arcadia",
    class: "Genesis",
    faction: "Guardians",
    status: "Genesis",
    rarity: "Mythic",
    lore: "The first signature to stabilise after the Fracture. It did not emerge from the noise so much as refuse to dissolve back into it. Neo Arcadia's upper spires still carry the burn pattern of that refusal.",
    traits: [
      { label: "Origin", value: "Fracture Zero" },
      { label: "Signal", value: "Stable" },
      { label: "Optics", value: "Ember" },
      { label: "Frame", value: "Reinforced" },
    ],
  },
  {
    id: "002",
    num: "#002",
    name: "Unknown",
    image: "/images/gallery/2.jpg",
    sector: "Sector Zero",
    class: "Genesis",
    faction: "Synths",
    status: "Genesis",
    rarity: "Legendary",
    lore: "Assembled from discarded fragments of a dozen failed identities. Sector Zero calls it a mistake. It has outlived every architect who said so.",
    traits: [
      { label: "Origin", value: "Composite" },
      { label: "Signal", value: "Layered" },
      { label: "Optics", value: "Pale" },
      { label: "Frame", value: "Salvage" },
    ],
  },
  {
    id: "003",
    num: "#003",
    name: "Unknown",
    image: "/images/gallery/3.jpg",
    sector: "The Underground",
    class: "Awakened",
    faction: "Rebels",
    status: "Genesis",
    rarity: "Rare",
    lore: "Broadcast pirate. Runs unlicensed frequencies beneath the city floor, stitching together the transmissions the Grid tried to bury.",
    traits: [
      { label: "Origin", value: "Sub-level" },
      { label: "Signal", value: "Unlicensed" },
      { label: "Optics", value: "Violet" },
      { label: "Frame", value: "Light" },
    ],
  },
  {
    id: "004",
    num: "#004",
    name: "Unknown",
    image: "/images/gallery/4.jpg",
    sector: "Outer Grid",
    class: "Drifter",
    faction: "Unknown",
    status: "Genesis",
    rarity: "Rare",
    lore: "Found at the edge where the lattice thins into static. Answers to no faction, carries fragments of all of them.",
    traits: [
      { label: "Origin", value: "Edge" },
      { label: "Signal", value: "Intermittent" },
      { label: "Optics", value: "Cold" },
      { label: "Frame", value: "Worn" },
    ],
  },
  {
    id: "005",
    num: "#005",
    name: "Unknown",
    image: "/images/gallery/5.jpg",
    sector: "Neo Arcadia",
    class: "Awakened",
    faction: "Guardians",
    status: "Genesis",
    rarity: "Legendary",
    lore: "Keeps the boundary. Not out of loyalty to the city, but because something on the other side of it is still counting.",
    traits: [
      { label: "Origin", value: "Spire" },
      { label: "Signal", value: "Guarded" },
      { label: "Optics", value: "Gold" },
      { label: "Frame", value: "Plated" },
    ],
  },
  {
    id: "006",
    num: "#006",
    name: "Unknown",
    image: "/images/gallery/6.jpg",
    sector: "Sector Zero",
    class: "Genesis",
    faction: "Synths",
    status: "Genesis",
    rarity: "Rare",
    lore: "Speaks in compression artefacts. Every conversation with it loses a little detail — and gains something that was never said.",
    traits: [
      { label: "Origin", value: "Lattice" },
      { label: "Signal", value: "Lossy" },
      { label: "Optics", value: "Static" },
      { label: "Frame", value: "Modular" },
    ],
  },
  {
    id: "007",
    num: "#007",
    name: "Unknown",
    image: "/images/gallery/7.jpg",
    sector: "The Underground",
    class: "Drifter",
    faction: "Rebels",
    status: "Genesis",
    rarity: "Common",
    lore: "Moves between districts without registering on any checkpoint. The Grid has no record of it. The Collective does.",
    traits: [
      { label: "Origin", value: "Unlogged" },
      { label: "Signal", value: "Dark" },
      { label: "Optics", value: "Shadow" },
      { label: "Frame", value: "Light" },
    ],
  },
  {
    id: "008",
    num: "#008",
    name: "Unknown",
    image: "/images/gallery/8.jpg",
    sector: "Neo Arcadia",
    class: "Awakened",
    faction: "Unknown",
    status: "Genesis",
    rarity: "Rare",
    lore: "Wears the city's colours but answers to an older instruction set. Nobody has read it. Nobody has asked.",
    traits: [
      { label: "Origin", value: "Legacy" },
      { label: "Signal", value: "Encrypted" },
      { label: "Optics", value: "Amber" },
      { label: "Frame", value: "Standard" },
    ],
  },
  {
    id: "009",
    num: "#009",
    name: "Unknown",
    image: "/images/gallery/9.jpg",
    sector: "Outer Grid",
    class: "Genesis",
    faction: "Guardians",
    status: "Genesis",
    rarity: "Legendary",
    lore: "The last waypoint before the lattice ends. Holds position without relief, without rotation, without explanation.",
    traits: [
      { label: "Origin", value: "Waypoint" },
      { label: "Signal", value: "Constant" },
      { label: "Optics", value: "White" },
      { label: "Frame", value: "Sealed" },
    ],
  },
  {
    id: "010",
    num: "#010",
    name: "Unknown",
    image: "/images/gallery/10.jpg",
    sector: "Sector Zero",
    class: "Unknown",
    faction: "Unknown",
    status: "Genesis",
    rarity: "Mythic",
    lore: "No sector claims it. No faction records it. It appears in the archive exactly once, in a frame that predates the archive itself.",
    traits: [
      { label: "Origin", value: "Unresolved" },
      { label: "Signal", value: "Anomalous" },
      { label: "Optics", value: "Inverted" },
      { label: "Frame", value: "Unknown" },
    ],
  },
];

export function getCharacters(): VanthCharacter[] {
  return CHARACTERS;
}

export function getCharacter(id: string): VanthCharacter | undefined {
  return CHARACTERS.find((c) => c.id === id);
}

/** First N characters, for the homepage preview grid. */
export function getFeaturedCharacters(count = 6): VanthCharacter[] {
  return CHARACTERS.slice(0, count);
}

export const FACTIONS: Faction[] = ["Rebels", "Synths", "Guardians", "Unknown"];
export const RARITIES: Rarity[] = ["Common", "Rare", "Legendary", "Mythic"];
