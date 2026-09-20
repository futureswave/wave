// Trait taxonomy for the VANTH collection.
//
// Generated once from NFT_Trait_Listesi_Kategori_Sayilari.xlsx and committed as
// plain TypeScript: the spreadsheet is not read at build or request time. When
// the trait set changes, regenerate this file rather than editing it by hand.
//
// Follows the same shape as lib/content/collection.ts — exported types, a const
// table, and small accessor functions consumed by the /traits page.

export type Gender = "man" | "women";

export type VanthType = "Aegis" | "Cyberborn" | "Frostbite" | "Human";

export const GENDERS: { id: Gender; label: string }[] = [
  { id: "man", label: "Man" },
  { id: "women", label: "Women" },
];

export const VANTH_TYPES: VanthType[] = ["Aegis", "Cyberborn", "Frostbite", "Human"];

export type TraitCategoryId =
  | "type"
  | "background"
  | "aura"
  | "hair"
  | "eyes"
  | "mouths"
  | "facewear"
  | "earrings"
  | "outfit"
  | "hands";

export type TraitCategory = {
  id: TraitCategoryId;
  label: string;
  /** One-line description shown above the variant list. */
  blurb: string;
  /** Variant names per gender, alphabetical, NONE last. */
  traits: Record<Gender, string[]>;
  /**
   * Callout anchor on the base figure, in percent of the square figure box.
   * Authored by hand against the base renders in public/images/traits/base —
   * a bust crop with the head at y10-58 facing right and shoulders below y65.
   * `side` decides which way the leader line leaves the body.
   */
  anchor: { x: number; y: number; side: "left" | "right" };
};

const TRAIT_CATEGORIES: TraitCategory[] = [
  {
    id: "type",
    label: "Type",
    blurb:
      "The bloodline a VANTH is born into. Four origins, one silhouette.",
    anchor: { x: 40, y: 62, side: "left" },
    traits: {
      man: ["Aegis", "Cyberborn", "Frostbite", "Human"],
      women: ["Aegis", "Cyberborn", "Frostbite", "Human"],
    },
  },
  {
    id: "background",
    label: "Background",
    blurb:
      "The field it stands against. Twelve colourways tuned to the signal palette.",
    anchor: { x: 14, y: 16, side: "left" },
    traits: {
      man: ["Amaranth", "Aquamarine", "Celadon", "Cobalt", "Ironstone", "Lunaria", "Oxblood", "Royal Plum", "Sapphire", "Silvermist", "Terracotta", "Vermilion"],
      women: ["Amaranth", "Aquamarine", "Celadon", "Cobalt", "Ironstone", "Lunaria", "Oxblood", "Royal Plum", "Sapphire", "Silvermist", "Terracotta", "Vermilion"],
    },
  },
  {
    id: "aura",
    label: "Aura",
    blurb:
      "Energy bleeding through the frame — rendered behind and in front of the body.",
    anchor: { x: 80, y: 24, side: "right" },
    traits: {
      man: ["Abyssal Tide", "Bloodreign", "Dragon Coil", "Glacial Shard", "Inferno", "Phantom Nexus", "Raven Swarm", "Sakura Bloom", "Thunderstrike", "NONE"],
      women: ["Abyssal Tide", "Bloodreign", "Dragon Coil", "Glacial Shard", "Inferno", "Phantom Nexus", "Raven Swarm", "Sakura Bloom", "Thunderstrike", "NONE"],
    },
  },
  {
    id: "hair",
    label: "Hair",
    blurb:
      "Crowns, cuts, horns and headwear. The loudest single tell in the collection.",
    anchor: { x: 56, y: 14, side: "right" },
    traits: {
      man: ["Amber Flow", "Azure Spikes", "Bandana Cap", "Black Bangs", "Bloodbound", "Brown Slickback", "Celestial Horns", "Crimson Cyber Feral", "Cyber Feral", "Dark Bucket", "Emerald Flow", "Flame Braid", "Frost Combed", "Frost Slickback", "Golden Braid", "Golden Frequency", "Golden Horns", "Golden Sweep", "Golden Tress", "Inferno Frequency", "Ivory Sweep", "Midnight Beanie", "Midnight Fringe", "Mustard Beanie", "Night Aviator", "Raven Fade", "Red Tennis Cap", "Ruby Bangs", "Sapphire Quill", "Scarlet Aviator", "Shadow Combed", "Shadowbound", "Silk Ribbon", "Silver Spikes", "Snow Bucket", "Street Cap", "Sunbound", "Venom Fringe", "Vermilion Flow", "Warbraid", "Yellow Silk Ribbon", "NONE"],
      women: ["Amethyst War Weave", "Asymmetrical Sweep", "Buttercurl", "Butterscotch Crown", "Carmine Flow", "Cerulean Twin Tails", "Chainfall", "Charcoal Crown", "Cherry Long Bob", "Cobalt Flick", "Crimson Cascade", "Curlcap", "Espresso Tail", "Espresso Tail Cap", "Flaxen Crop", "Garnet Fringe", "Garnet Spikes", "Glacier Bob", "Graphite Long Bob", "Honey Braid", "Honey Headphones", "Ink Crop", "Ink Twin Tails", "Jade Headphones", "Jet Bob", "Lilac Cat Ears", "Lime Spikes", "Maroon Flick", "Meadow Buns", "Pearl Cat Ears", "Pinkflare", "Platinum Buns", "Raven Braid", "Rosecut", "Sunbeam", "Tangerine Bob", "Tangerine Flow", "Teal Tail", "Tidal Wave", "Warbraid", "NONE"],
    },
  },
  {
    id: "eyes",
    label: "Eyes",
    blurb:
      "Where the character actually lives. Includes glow variants with their own layer.",
    anchor: { x: 64, y: 36, side: "right" },
    traits: {
      man: ["Angry", "Blessed", "Blessed Glow", "Condescending", "Confident", "Disgusted", "Dreamy", "Furious", "Happy", "Hopeful", "Mocking", "Natural", "Serious", "Shocked", "Shy", "Thoughtful", "White Glow", "Wink", "NONE"],
      women: ["Angry", "Blessed", "Blessed Glow", "Condescending", "Confident", "Disgusted", "Dreamy", "Furious", "Happy", "Hopeful", "Mocking", "Natural", "Serious", "Shocked", "Shy", "Thoughtful", "White Glow", "Wink", "NONE"],
    },
  },
  {
    id: "mouths",
    label: "Mouths",
    blurb:
      "Expression, attitude, hardware. Read it with the eyes, never alone.",
    anchor: { x: 62, y: 50, side: "right" },
    traits: {
      man: ["Angry", "Blessed", "Bubblegum", "Cigarette", "Condescending", "Confident", "Disgusted", "Dreamy", "Furious", "Golden Fang", "Golden Tongue Piercing", "Half Smile", "Happy", "Mocking", "Natural", "Serious", "Shocked", "Shy", "Silver Tongue Piercing", "Vampire Fang", "NONE"],
      women: ["Angry", "Blessed", "Bubblegum", "Cigarette", "Condescending", "Confident", "Disgusted", "Dreamy", "Furious", "Golden Fang", "Golden Tongue Piercing", "Half Smile", "Happy", "Mocking", "Natural", "Serious", "Shocked", "Shy", "Silver Tongue Piercing", "Vampire Fang", "NONE"],
    },
  },
  {
    id: "facewear",
    label: "Facewear",
    blurb:
      "Masks and optics, split into front and back layers so they sit around the face.",
    anchor: { x: 68, y: 44, side: "right" },
    traits: {
      man: ["Acid Glasses", "Aureon Mask", "Bloodfang Mask", "Cybercore Mask", "Gilded Glasses", "Glacier Glasses", "Halo Glasses", "Inferno Glasses", "Ironclad Mask", "Noir Glasses", "Obsidian Glasses", "Redline Glasses", "Smokeshade Glasses", "Vanguard Mask", "Wireframe Glasses", "NONE"],
      women: ["Acid Glasses", "Aureon Mask", "Bloodfang Mask", "Cybercore Mask", "Gilded Glasses", "Glacier Glasses", "Halo Glasses", "Inferno Glasses", "Ironclad Mask", "Noir Glasses", "Obsidian Glasses", "Redline Glasses", "Smokeshade Glasses", "Vanguard Mask", "Wireframe Glasses", "NONE"],
    },
  },
  {
    id: "earrings",
    label: "Earrings",
    blurb:
      "Small metal, big signal. Gold and silver runs across six placements.",
    anchor: { x: 37, y: 34, side: "left" },
    traits: {
      man: ["Gold Bridge", "Gold Combo", "Gold Double Hoops", "Gold Helix", "Gold Tragus", "Pearl Earring", "Silver Bridge", "Silver Combo", "Silver Double Hoops", "Silver Helix", "Silver Tragus", "NONE"],
      women: ["Gold Bridge", "Gold Combo", "Gold Double Hoops", "Gold Helix", "Gold Tragus", "Pearl Earring", "Silver Bridge", "Silver Combo", "Silver Double Hoops", "Silver Helix", "Silver Tragus", "NONE"],
    },
  },
  {
    id: "outfit",
    label: "Outfit",
    blurb:
      "Jackets, armour, tees — each one paired with its own collar layer.",
    anchor: { x: 30, y: 78, side: "left" },
    traits: {
      man: ["Academy Regent Jacket", "Black Armored Outfit", "Black Baseball Tee", "Black Biker Jacket", "Black Jacket", "Black Leather Jacket", "Blue Hoodie", "Blue Tech Jacket", "Brown Biker Jacket", "Cream Punk Jacket", "Crimson Porcelain Fur Jacket", "Crimsonborn", "Crystalborn", "Futuristic Latex Armor", "Green High Collar Track Top", "Harness Tee", "Legacy Jacket", "Lionheart", "Military Tactical Vest", "Mustard Track Top", "Neon Warlord", "Nightfall Shirt", "Orange Peace Tee", "Outlaw", "Pure Shirt", "Purple Peace Tee", "Purple Puffer Jacket", "Red Hoodie", "Red Puffer Jacket", "Red Track Jacket", "Royal Officer Uniform", "Shadow Veil", "Solar Vanguard", "Tank Top", "Vanth Ascendant", "Vanth Golden Legacy", "Velocity Racer", "White Suit", "White Track Jacket", "Winter Nobility", "Yellow Tactical Armor"],
      women: ["Aquaflux Tie", "Ascendant Armor", "Aurelia Armor", "Aurex Top", "Black Button Up", "Black Sash", "Burgundy Knit", "Cardinal Bomber", "Cobalt Track Jacket", "Cyber Jacket", "Dark Latex", "Eastern Shirt", "Gilded Harness", "Jade Track Jacket", "Lemon Racer", "Majestic Warborn", "Minkline Blazer", "Navy Knit", "Navy Stand Collar", "Nightgrid Tee", "Ochre Harness", "Pinkline Tie", "Rose Racer", "Ruby Latex", "Sheer Veil", "Sovereign Armor", "Strapped Shoulder Top", "Strappy Top", "Track Pullover", "Ultraviolet Tee", "Utility Harness", "Vanth Relic", "Vanth Sash", "Violet Harness", "White Button Up", "White Sash"],
    },
  },
  {
    id: "hands",
    label: "Hands",
    blurb:
      "What it carries. Bows, rifles, relics and rings, some with rigging layers.",
    anchor: { x: 10, y: 92, side: "left" },
    traits: {
      man: ["Aether", "Aether Ring", "Aqua Viper", "Aquacrest Recurve", "Arc Launcher", "Arcane Card", "Aureate Raptor", "Bloodline", "Carbon Viper", "Cobalt Raptor", "Ember Bow", "Ember Raptor", "Frost Rifle", "Gold Longshot", "Gravity Orb", "Neon Havoc", "Obsidian Striker", "Power Cell", "Pulse Rifle", "Regalia", "Rose Havoc", "Ruby Striker", "Scarletcrest Recurve", "Shadowcurve", "Solara", "Solcrest Bow", "Specter Rifle", "Steel Longshot", "Suncrest Recurve", "Tri Shuriken", "Valkyr", "Vector Rifle", "Verdant Edge", "Violetcrest Recurve", "Voltedge", "NONE"],
      women: ["Aether", "Aether Ring", "Aqua Viper", "Aquacrest Recurve", "Arc Launcher", "Arcane Card", "Aureate Raptor", "Bloodline", "Carbon Viper", "Cobalt Raptor", "Ember Bow", "Ember Raptor", "Frost Rifle", "Gold Longshot", "Gravity Orb", "Neon Havoc", "Obsidian Striker", "Power Cell", "Pulse Rifle", "Regalia", "Rose Havoc", "Ruby Striker", "Scarletcrest Recurve", "Shadowcurve", "Solara", "Solcrest Bow", "Specter Rifle", "Steel Longshot", "Suncrest Recurve", "Tri Shuriken", "Valkyr", "Vector Rifle", "Verdant Edge", "Violetcrest Recurve", "Voltedge", "NONE"],
    },
  },
];

export function getTraitCategories(): TraitCategory[] {
  return TRAIT_CATEGORIES;
}

/** Number of variants in a category for one gender. */
export function countFor(category: TraitCategory, gender: Gender): number {
  return category.traits[gender].length;
}

export type TraitTotals = {
  categories: number;
  /** Every gender-specific variant across the whole taxonomy. */
  genderSpecific: number;
  /** Distinct variant names, counting a shared name once. */
  unique: number;
  types: number;
};

export function getTraitTotals(): TraitTotals {
  let genderSpecific = 0;
  const names = new Set<string>();

  for (const category of TRAIT_CATEGORIES) {
    for (const gender of ["man", "women"] as const) {
      genderSpecific += category.traits[gender].length;
      for (const name of category.traits[gender]) names.add(`${category.id}:${name}`);
    }
  }

  return {
    categories: TRAIT_CATEGORIES.length,
    genderSpecific,
    unique: names.size,
    types: VANTH_TYPES.length,
  };
}

/**
 * Splits a category's variants into the ones both genders share and the ones
 * exclusive to each — only Hair and Outfit actually diverge.
 */
export function splitByExclusivity(category: TraitCategory, gender: Gender) {
  const other: Gender = gender === "man" ? "women" : "man";
  const otherSet = new Set(category.traits[other]);
  return category.traits[gender].map((name) => ({
    name,
    exclusive: !otherSet.has(name),
  }));
}
