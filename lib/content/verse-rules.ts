// Public scoring, season, anti-abuse and privacy rules for the Verse
// (PRD §9, §11, §15: "scoring and privacy rules must be accessible").
// Bump RULES_VERSION and the date whenever the substance changes.

export const RULES_VERSION = "1.0";
export const RULES_UPDATED = "2026-11-25";

export const XP_TABLE: { cls: string; xp: string; note: string }[] = [
  { cls: "Daily / quick", xp: "10–25", note: "Low effort, once per UTC day" },
  { cls: "Lore / quiz", xp: "25–75", note: "All answers must be correct" },
  { cls: "Weekly / community", xp: "50–150", note: "Proof required, reviewed" },
  { cls: "Holder verification", xp: "50–100", note: "One time, read-only on-chain check" },
  { cls: "Creative / review", xp: "100–300", note: "Judged on originality and effort" },
];

export const RULE_SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "Scoring",
    items: [
      "Every quest has a fixed XP reward, shown before you start. There are no hidden multipliers.",
      "XP is recorded in an append-only ledger. Corrections are made as new, visible entries — never silent edits.",
      "Each quest can be rewarded at most once per period (once, per UTC day, or per ISO week). Limits are shown on the card.",
      "Proof quests are reviewed by the team. A rejection always includes a reason, and you can resubmit.",
      "Levels are cosmetic. XP and levels say nothing about the value or rarity of any NFT.",
    ],
  },
  {
    title: "Seasons",
    items: [
      "The pilot season runs for 4 weeks. Season XP resets at the end of each season; lifetime XP stays.",
      "At the end of a season the ranking is snapshotted at the published cutoff time (UTC).",
      "Ties are broken by who reached the score first, then by the number of completed quests.",
      "Rankings are for status and recognition. Any reward will be announced together with its rules before it applies — no financial return is promised.",
    ],
  },
  {
    title: "Fair play",
    items: [
      "One person, one wallet. Farming with multiple wallets, bots or scripts leads to removal from the rankings.",
      "Fake, copied or AI-spam submissions are rejected; repeated abuse disqualifies the wallet for the season.",
      "The team may adjust XP to correct errors or abuse. Every adjustment carries a reason and is logged.",
      "Disagree with a decision? Open a ticket in the official Discord within 7 days; it will be reviewed by a different team member.",
    ],
  },
  {
    title: "Wallet safety & privacy",
    items: [
      "Signing in only asks you to sign a plain-text message. It is never a transaction and never costs anything.",
      "No quest will ever ask for your seed phrase, private key, a transfer or an approval. Anyone who does is a scammer.",
      "We store your wallet address, optional alias, quest history and XP — nothing else.",
      "The public board shows a shortened wallet. Turn off your public profile any time to hide your alias and profile page.",
    ],
  },
];
