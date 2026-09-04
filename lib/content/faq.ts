// Single source of truth for FAQ content.
// Consumed by app/faq/page.tsx (full list) and components/home/FAQPreview.tsx
// (the `featured` subset).

export type FAQEntry = {
  q: string;
  a: string;
  /** Shown in the homepage preview accordion. */
  featured?: boolean;
};

export const FAQS: FAQEntry[] = [
  {
    q: "What is VANTH?",
    a: "VANTH is a collection of characters — anime art and cyberpunk culture rendered as digital identities. Owning one is not just holding an asset; it is your place inside an expanding universe.",
    featured: true,
  },
  {
    q: "What is the VANTHVERSE?",
    a: "The VANTHVERSE is the world the collection lives in: its origin, its districts (Neo Arcadia, Sector Zero, The Underground, Outer Grid), its factions, and the characters that move between them. It expands as the Collective grows.",
    featured: true,
  },
  {
    q: "What is Request Access?",
    a: "Request Access is how you join the early Collective. You submit your X and Discord identity (and wallet address for the allowlist) and your request is logged for review. It is not a mint, and it never requires connecting your wallet.",
    featured: true,
  },
  {
    q: "Which blockchain is VANTH on?",
    a: "VANTH is built on Solana.",
  },
  {
    q: "What is the supply?",
    a: "Supply is TBA. It will be announced on official channels and updated on this website.",
  },
  {
    q: "When is the mint?",
    a: "Not yet announced. The mint date is TBA. Follow our official X and Discord for announcements. We will never announce a mint date via DM.",
  },
  {
    q: "Where do I mint?",
    a: "Minting will happen exclusively on OpenSea. Never mint from any other source or website. Always verify the contract address published on this website before interacting.",
    featured: true,
  },
  {
    q: "How can I join?",
    a: "Use the Request Access page on this site. Fill in your Solana wallet address (Phantom), X username, and Discord username. No wallet connection required — just the address.",
  },
  {
    q: "Do I need to connect my wallet to request access?",
    a: "No. The form only requires your Solana wallet address as a text input. You do not need to connect your wallet to any site to join.",
  },
  {
    q: "Will there be holder benefits?",
    a: "Yes. Holders form The Collective: early announcements, exclusive previews, community discussions, access opportunities, and future experiences. Staking toward the VNTH token is planned — mechanics are TBA and we will not overpromise on financial returns.",
  },
  {
    q: "Is staking live?",
    a: "Not yet. Staking is coming in a later phase. The staking contract address and VNTH token mechanics are TBA. Only trust the contract address published on this website.",
    featured: true,
  },
  {
    q: "What is VNTH?",
    a: "VNTH is a future utility token that VANTH holders will earn through staking. Full token mechanics and utility details are TBA.",
  },
  {
    q: "Where are the official links?",
    a: "Every verified link lives on this website — see the Security section on the homepage and the Official Links page. Nothing outside those URLs is official, regardless of how convincing it looks.",
  },
  {
    q: "How can I avoid scams?",
    a: "Only use links from this website. We will never DM you first on any platform. VANTH will never ask for your seed phrase. Never connect your wallet to a site that is not listed here.",
    featured: true,
  },
  {
    q: "What wallets are supported?",
    a: "Phantom is the recommended wallet for VANTH. It is supported on the Stake page (coming soon).",
  },
  {
    q: "Will there be royalties?",
    a: "Royalty structure is TBA. Details will be published before the collection launches on OpenSea.",
  },
  {
    q: "Is the team public?",
    a: "Yes. The VANTH team includes a CEO, CTO, Designer, and Developer. You can learn more about the team on the About page.",
  },
  {
    q: "Where will updates be posted?",
    a: "All updates are posted on our official X account, Discord server, and GitBook documentation — and reflected on this website. See the Official Links page for verified URLs.",
  },
  {
    q: "Can the vision change?",
    a: "Yes, transparently. The vision may evolve as the project develops. Any changes will be announced on official X and Discord before being updated here.",
  },
];

export const FEATURED_FAQS = FAQS.filter((f) => f.featured);
