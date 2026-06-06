// Single source of truth for all official VANTH links
// Used by: Navbar, Footer, Social Links page, About page

export const SOCIAL_LINKS = {
  x: {
    label: "X (Twitter)",
    url: "https://x.com/joinvanth",
    handle: "@joinvanth",
  },
  discord: {
    label: "Discord",
    url: "https://discord.gg/vanth",
    description: "Join our community",
  },
  gitbook: {
    meetVanth: {
      label: "VANTH",
      url: "https://vanth.gitbook.io/vanth",
    },
  },
<<<<<<< HEAD
  mintVenue: {
    label: "Mint Venue",
    url: null,
=======
  magicEden: {
    label: "Magic Eden",
    url: null, // add when collection is live
    comingSoon: true,
>>>>>>> ce00058c012544fa08b4127b8be3e2c7e2963f8d
  },
} as const;

export const SITE_CONFIG = {
  name: "VANTH",
  tagline: "Vanth is a web3 focused project inspired by the best with an innovative and dynamic style.",
<<<<<<< HEAD
  chain: "TBA",
  mintVenue: "TBA",
=======
  chain: "Solana",
  mintVenue: "Magic Eden",
>>>>>>> ce00058c012544fa08b4127b8be3e2c7e2963f8d
  supply: null, // TBA
  mintDate: null, // TBA
  stakingToken: "VNTH",
  scamWarning: {
    title: "Stay Safe — Official Links Only",
<<<<<<< HEAD
    body: "We will never DM you first. Always verify links through this website. Official mint details will be announced before launch.",
=======
    body: "We will never DM you first. Always verify links through this website. Minting will happen on Magic Eden only.",
>>>>>>> ce00058c012544fa08b4127b8be3e2c7e2963f8d
  },
} as const;
