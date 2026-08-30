import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The roadmap page was renamed to /vision. Keep old links working.
      { source: "/roadmap", destination: "/vision", permanent: true },
      // V2 information architecture: the standalone lore and gallery pages were
      // folded into /universe and /collection.
      { source: "/story", destination: "/universe", permanent: true },
      { source: "/gallery", destination: "/collection", permanent: true },
    ];
  },
};

export default nextConfig;
