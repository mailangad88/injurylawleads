import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";
import { categories } from "./categories";

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

const frontmatterSchema = z.object({
  title: z.string().min(10),
  description: z.string().min(50).max(200),
  updated: z.coerce.date(),
  author: z.string().default("Editorial Team"),
  // Set reviewedBy only when a licensed attorney has actually reviewed the page.
  reviewedBy: z.string().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
});

export type GuideMeta = z.infer<typeof frontmatterSchema> & {
  slug: string;
  category: string;
  href: string;
  readingMinutes: number;
};

export type Guide = GuideMeta & { body: string };

function readGuideFile(category: string, file: string): Guide {
  const raw = fs.readFileSync(path.join(GUIDES_DIR, category, file), "utf8");
  const { data, content } = matter(raw);
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Invalid frontmatter in content/guides/${category}/${file}: ${parsed.error.message}`);
  }
  const slug = file.replace(/\.mdx?$/, "");
  return {
    ...parsed.data,
    slug,
    category,
    href: `/guides/${category}/${slug}`,
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    body: content,
  };
}

let cache: Guide[] | null = null;

export function getAllGuides(): Guide[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const known = new Set(categories.map((c) => c.slug));
  const guides: Guide[] = [];
  for (const category of fs.readdirSync(GUIDES_DIR)) {
    const dir = path.join(GUIDES_DIR, category);
    if (!fs.statSync(dir).isDirectory()) continue;
    if (!known.has(category)) {
      throw new Error(`content/guides/${category} is not a category in lib/categories.ts`);
    }
    for (const file of fs.readdirSync(dir)) {
      if (!/\.mdx?$/.test(file)) continue;
      const guide = readGuideFile(category, file);
      if (!guide.draft) guides.push(guide);
    }
  }
  guides.sort((a, b) => b.updated.getTime() - a.updated.getTime());
  cache = guides;
  return guides;
}

export function getGuidesByCategory(category: string) {
  return getAllGuides().filter((g) => g.category === category);
}

export function getGuide(category: string, slug: string) {
  return getAllGuides().find((g) => g.category === category && g.slug === slug);
}

export function getRelatedGuides(guide: GuideMeta, limit = 3) {
  const all = getAllGuides().filter((g) => g.href !== guide.href);
  const same = all.filter((g) => g.category === guide.category);
  const general = all.filter((g) => g.category === "claims-process" && g.category !== guide.category);
  return [...same, ...general].slice(0, limit);
}
