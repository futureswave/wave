import type { MetadataRoute } from "next";
import { getCharacters } from "@/lib/content/collection";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vanth.example.com";

// Public, indexable routes (admin/api intentionally excluded).
const ROUTES = [
  "",
  "/collection",
  "/universe",
  "/vision",
  "/collective",
  "/about",
  "/faq",
  "/social",
  "/stake",
  "/whitelist",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const characterRoutes = getCharacters().map((c) => `/collection/${c.id}`);

  return [...ROUTES, ...characterRoutes].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : route.startsWith("/collection/") ? 0.5 : 0.7,
  }));
}
