import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The unreleased trait artwork lives outside public/ and is only read by the
  // admin-gated route, so it has to be bundled into that function explicitly.
  outputFileTracingIncludes: {
    "/api/admin/traits/[...path]": ["./private/traits/**/*"],
  },
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
