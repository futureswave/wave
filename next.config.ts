import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The roadmap page was renamed to /vision. Keep old links working.
      { source: "/roadmap", destination: "/vision", permanent: true },
    ];
  },
};

export default nextConfig;
