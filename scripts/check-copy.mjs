#!/usr/bin/env node
// Flags AI-sounding patterns and risky advertising claims in site copy.
// See docs/CONTENT_STYLE.md. Usage: npm run check:copy
import fs from "node:fs";
import path from "node:path";

const rules = [
  [/\b(it|this|that)(['’]s not|['’]s no|isn['’]t| is not)\b[^.!?]{0,60}[.!?,;]\s*(it|this|that)(['’]s| is)\b/i, "Binary contrast (\"It's not X. It's Y.\")"],
  [/\bhere['’]s the (thing|truth|deal)\b|\blet me be clear\b|\bthe honest answer\b/i, "Throat-clearing opener"],
  [/\bwhat (nobody|no one) tells you\b|\bthe part (everyone|most people) miss/i, "Faux insight"],
  [/\b(pivotal|a testament to|game[- ]chang|unlock|delve|in today['’]s|navigate the|landscape of)\b/i, "Puffery or stock AI phrasing"],
  [/\b(experts (agree|say)|studies (show|suggest)|research shows)\b/i, "Unattributed claim; name and link the source"],
  [/\bthat['’]s it\. that['’]s\b/i, "Dramatic fragments"],
  [/(?<!\b(not|never|no|or) )\bguarantee[ds]?\b|\byou will win\b|\bmaximum compensation\b|\bthe best (lawyers?|attorneys?)\b/i, "Advertising claim that needs review"],
  [/—/, "Em dash; use a comma, period or parentheses"],
];

const roots = ["content", "app", "components", "remotion/videos.ts"];
const exts = new Set([".mdx", ".md", ".tsx", ".ts"]);
const skip = [/app\/(terms|disclaimer|privacy)\//, /lib\//];

function walk(p, out = []) {
  if (!fs.existsSync(p)) return out;
  const st = fs.statSync(p);
  if (st.isDirectory()) for (const f of fs.readdirSync(p)) walk(path.join(p, f), out);
  else if (exts.has(path.extname(p)) && !skip.some((r) => r.test(p))) out.push(p);
  return out;
}

let count = 0;
for (const file of roots.flatMap((r) => walk(r))) {
  fs.readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    if (/^\s*(import|\/\/|\*)/.test(line)) return;
    for (const [re, label] of rules) {
      if (re.test(line)) {
        count++;
        console.log(`${file}:${i + 1}  ${label}\n    ${line.trim().slice(0, 140)}`);
      }
    }
  });
}
console.log(count ? `\n${count} issue(s) found.` : "No issues found.");
process.exit(count ? 1 : 0);
