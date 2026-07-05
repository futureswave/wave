// Single source of truth for all official VANTH links
// Used by: Navbar, Footer, Social Links page, About page

export const SOCIAL_LINKS = {
  x: {
    label: "X (Twitter)",
    url: "https://x.com/vanthverse",
    handle: "@vanthverse",
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

  mintVenue: {
    label: "Mint Venue",
    url: null,

  },
} as const;

export const SITE_CONFIG = {
  name: "VANTH",
  tagline: "Vanth is a web3 focused project inspired by the best with an innovative and dynamic style.",

  chain: "Ethereum",
  mintVenue: "TBA",

  supply: null, // TBA
  mintDate: null, // TBA
  stakingToken: "VNTH",
  scamWarning: {
    title: "Stay Safe — Official Links Only",

    body: "We will never DM you first. Always verify links through this website. Official mint details will be announced before launch.",

  },
} as const;
