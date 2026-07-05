import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vanth.example.com";

// Public, indexable routes (admin/api intentionally excluded).
const ROUTES = [
  "",
  "/about",
  "/story",
  "/vision",
  "/gallery",
  "/roadmap",
  "/faq",
  "/social",
  "/stake",
  "/whitelist",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
