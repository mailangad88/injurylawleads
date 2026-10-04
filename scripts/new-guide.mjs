#!/usr/bin/env node
// Scaffold a new guide: npm run new-guide -- car-accidents "Rear-End Collision Claims"
import fs from "node:fs";
import path from "node:path";

const [category, ...titleParts] = process.argv.slice(2);
const title = titleParts.join(" ");
if (!category || !title) {
  console.error('Usage: npm run new-guide -- <category> "<Title>"');
  process.exit(1);
}
const dir = path.join("content", "guides", category);
if (!fs.existsSync(dir)) {
  console.error(`No folder ${dir}. Add the category to lib/categories.ts and create the folder first.`);
  process.exit(1);
}
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const file = path.join(dir, `${slug}.mdx`);
if (fs.existsSync(file)) {
  console.error(`${file} already exists`);
  process.exit(1);
}
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  file,
  `---
title: "${title}"
description: "Write a 50 to 200 character summary that answers the searcher's question and earns the click."
updated: ${today}
draft: true
faqs:
  - q: "A question people actually search for?"
    a: "A direct, accurate two-sentence answer."
---

Open with the answer to the reader's main question in two or three sentences.

<KeyTakeaways>

- Point one
- Point two

</KeyTakeaways>

## First section

<CaseReviewCTA />
`,
);
console.log(`Created ${file} (draft: true). Remove the draft line to publish.`);
