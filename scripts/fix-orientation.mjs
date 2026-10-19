/*
 * Say which SYSTEM you are in, on every procedure in the documentation.
 *
 * The reported fault: a page says "Click Reports in the top menu" and never says whether that
 * menu is in the portal or in Salesforce. Measured across the whole set, 138 of 139 "Where:"
 * lines named no system at all. Someone sitting in Salesforce looking for a Reports top menu
 * will not find one, and nothing on the page tells them why.
 *
 * The fix is one hop on the front of each Where line. Which system is decided by FOLDER, which
 * is safe here because the split is clean and was checked rather than assumed:
 *
 *   docs/use, docs/admin            the portal. docs/admin is the portal's own admin console -
 *                                   verified it has no "Setup" area of its own, so nothing in
 *                                   there can be mistaken for Salesforce Setup.
 *   docs/standard-build, frontspin  Salesforce. Every Where line in these two either says
 *                                   "Salesforce" already or starts at Setup.
 *   docs/api, docs/features         left alone: no procedures of this kind.
 *
 * A line that already names its system is left exactly as it is, so this can be re-run.
 */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const PORTAL = ["use", "admin"];
const SALESFORCE = ["standard-build", "frontspin"];

const WHERE = /^\*\*Where:\*\*[ \t]*(.+)$/gm;
// Already oriented: names a system, or is a plain-English location rather than a menu path.
const ALREADY = /\b(in (the )?portal|in salesforce|salesforce|sign-in page|the web address)\b/i;

function systemFor(rel) {
  const top = rel.split(path.sep)[0];
  if (PORTAL.includes(top)) return "In the portal";
  if (SALESFORCE.includes(top)) return "In Salesforce";
  return null;
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

const dry = process.argv.includes("--dry");
let filesChanged = 0, linesChanged = 0, skipped = 0;
const samples = [];

for (const file of walk(DOCS)) {
  const rel = path.relative(DOCS, file);
  const sys = systemFor(rel);
  if (!sys) continue;

  const src = fs.readFileSync(file, "utf8");
  let touched = 0;
  const out = src.replace(WHERE, (full, rest) => {
    if (ALREADY.test(rest)) { skipped++; return full; }
    touched++; linesChanged++;
    const line = `**Where:** ${sys} → ${rest}`;
    if (samples.length < 8) samples.push(`${rel.replace(/\\/g, "/")}\n      - ${full}\n      + ${line}`);
    return line;
  });

  if (touched) {
    filesChanged++;
    if (!dry) fs.writeFileSync(file, out, "utf8");
  }
}

console.log(`${dry ? "[dry run] " : ""}orientation added to ${linesChanged} lines across ${filesChanged} files`);
console.log(`already oriented, left alone: ${skipped}`);
if (samples.length) {
  console.log("\nsamples:");
  for (const s of samples) console.log("  " + s);
}
