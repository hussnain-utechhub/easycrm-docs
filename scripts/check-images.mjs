/*
 * Reconcile the pages against the captures.
 *
 *   node scripts/check-images.mjs
 *
 * Reports three things, and the third is the one that matters:
 *
 *   MISSING   a page references an image that was never captured. The Docusaurus build fails
 *             on these, because relative image paths are resolved by webpack - so this is
 *             just a faster, clearer version of the same error.
 *   UNUSED    an image was captured but no page shows it. Not an error; it is a prompt to
 *             either write the page or drop the shot.
 *   OK        both sides agree.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DOCS = path.join(ROOT, "docs");
const SHOTS = path.join(DOCS, "img", "shots");

function* mdFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "img") continue;
      yield* mdFiles(full);
    } else if (e.name.endsWith(".md") || e.name.endsWith(".mdx")) {
      yield full;
    }
  }
}

function* pngFiles(dir, base = "") {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) yield* pngFiles(full, rel);
    else if (e.name.endsWith(".png")) yield rel;
  }
}

const referenced = new Map(); // shot id -> [pages]
const missing = [];

for (const file of mdFiles(DOCS)) {
  const body = fs.readFileSync(file, "utf8");
  for (const m of body.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    const src = m[1].trim();
    if (/^https?:/.test(src)) continue;
    const abs = path.resolve(path.dirname(file), src);
    const rel = path.relative(SHOTS, abs).split(path.sep).join("/");
    const page = path.relative(DOCS, file).split(path.sep).join("/");
    if (!referenced.has(rel)) referenced.set(rel, []);
    referenced.get(rel).push(page);
    if (!fs.existsSync(abs)) missing.push({ page, src, rel });
  }
}

const onDisk = new Set(pngFiles(SHOTS));
const unused = [...onDisk].filter((p) => !referenced.has(p)).sort();

console.log(`pages referencing images : ${new Set([...referenced.values()].flat()).size}`);
console.log(`images referenced        : ${referenced.size}`);
console.log(`images on disk           : ${onDisk.size}`);

if (missing.length) {
  console.log(`\nMISSING (${missing.length}) - the build will fail on these:`);
  for (const m of missing) console.log(`  ${m.page}\n    wants ${m.rel}`);
}

if (unused.length) {
  console.log(`\nUNUSED (${unused.length}) - captured but shown nowhere:`);
  for (const u of unused) console.log(`  ${u}`);
}

if (!missing.length) console.log("\nNo missing images.");
process.exitCode = missing.length ? 1 : 0;
