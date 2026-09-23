#!/usr/bin/env node
/*
 * Builds search-index.json from the documentation sources.
 *
 * Why a script instead of a Jekyll template: a Liquid-generated index would
 * have to read other pages' content mid-render and strip Liquid tags out of
 * it, and a mistake there fails the whole GitHub Pages build. This runs
 * locally, its output is reviewed before committing, and it cannot break the
 * build at all.
 *
 * Run it whenever a page under smmo/, vhack/ or api/ changes:
 *
 *   node tools/build-docs-index.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const SOURCES = ["smmo", "vhack", "api"];
const MAX_SECTION_CHARS = 400;
const MAX_PAGE_CHARS = 600;

/* kramdown generates heading ids the same way: drop anything that is not a
   word character, hyphen or space, turn spaces into hyphens, lower-case it. */
const slug = (text) =>
  text
    .replace(/[^\p{L}\p{N}_\- ]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();

const stripMarkdown = (md) =>
  md
    .replace(/\{%[\s\S]*?%\}/g, " ")        // Liquid tags
    .replace(/\{\{[\s\S]*?\}\}/g, " ")      // Liquid output
    .replace(/<!--[\s\S]*?-->/g, " ")       // HTML comments
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```[a-z]*\n?/gi, " ")) // keep code, drop fences
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")  // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> label
    .replace(/<[^>]+>/g, " ")               // raw HTML
    .replace(/^\s{0,3}#{1,6}\s+/gm, " ")    // heading markers
    .replace(/^\s*\|[\s:|-]+\|\s*$/gm, " ") // table separator rows (|---|---|)
    .replace(/^\s*\|.*\|\s*$/gm, (row) => row.replace(/\|/g, " ")) // table cells
    .replace(/^\s*[-*+]\s+/gm, " ")         // list bullets
    .replace(/^\s*>\s?/gm, " ")             // blockquotes
    .replace(/[*_]{1,3}/g, "")              // emphasis
    .replace(/\s+/g, " ")
    .trim();

const walk = (dir) => {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith(".md")) out.push(full);
  }
  return out;
};

const parseFrontMatter = (src) => {
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: src };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return { data, body: src.slice(match[0].length) };
};

const files = SOURCES.flatMap((dir) => walk(join(ROOT, dir))).sort();
const index = [];

for (const file of files) {
  const { data, body } = parseFrontMatter(readFileSync(file, "utf8"));
  if (!data.permalink) {
    console.warn(`skipped (no permalink): ${relative(ROOT, file)}`);
    continue;
  }

  // "Getting Started — SimpleMMO Bot" reads better as just "Getting Started".
  const title = (data.title || "").split(" — ")[0].split(" – ")[0].trim();
  const product = data.product || "developer";

  // Split on level-2 headings; anything before the first one is the intro.
  const chunks = body.split(/^##\s+/m);
  const intro = stripMarkdown(chunks.shift() || "");
  if (intro.length > 40) {
    index.push({
      title, product, url: data.permalink, section: "", anchor: "",
      text: intro.slice(0, MAX_PAGE_CHARS),
    });
  }

  const seen = new Map();
  for (const chunk of chunks) {
    const nl = chunk.indexOf("\n");
    const heading = (nl === -1 ? chunk : chunk.slice(0, nl)).trim();
    const text = stripMarkdown(nl === -1 ? "" : chunk.slice(nl + 1));
    if (!heading || text.length < 20) continue;

    let anchor = slug(heading);
    // kramdown de-duplicates repeated headings with -1, -2, …
    const count = seen.get(anchor) || 0;
    seen.set(anchor, count + 1);
    if (count) anchor = `${anchor}-${count}`;

    index.push({
      title, product, url: data.permalink, section: heading, anchor,
      text: text.slice(0, MAX_SECTION_CHARS),
    });
  }
}

const json = JSON.stringify(index);
writeFileSync(join(ROOT, "search-index.json"), json + "\n");

const kb = (json.length / 1024).toFixed(1);
console.log(`indexed ${files.length} pages into ${index.length} sections — ${kb} KB`);
