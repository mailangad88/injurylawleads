#!/usr/bin/env node
// Render every Remotion composition to public/videos/<slug>.mp4.
// Usage: npm run video:render            (all videos)
//        npm run video:render -- <slug>  (one video)
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const src = fs.readFileSync("remotion/videos.ts", "utf8");
const all = [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const only = process.argv[2];
const slugs = only ? all.filter((s) => s === only) : all;
if (!slugs.length) {
  console.error(only ? `No video with slug "${only}"` : "No videos found");
  process.exit(1);
}
fs.mkdirSync("public/videos", { recursive: true });
for (const slug of slugs) {
  console.log(`Rendering ${slug}...`);
  execFileSync("npx", ["remotion", "render", "remotion/index.ts", slug, `public/videos/${slug}.mp4`], { stdio: "inherit" });
}
