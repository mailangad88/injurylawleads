import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { getAllGuides } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/guides", "/settlement-calculator", "/free-case-review", "/how-it-works", "/videos"].map((p) => ({
    url: `${site.url}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const hubs = categories.map((c) => ({ url: `${site.url}/guides/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.7 }));
  const guides = getAllGuides().map((g) => ({ url: `${site.url}${g.href}`, lastModified: g.updated, priority: 0.6 }));
  return [...pages, ...hubs, ...guides];
}
