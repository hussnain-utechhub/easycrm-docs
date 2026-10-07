/*
 * Repair cross-page links after the restructure.
 *
 *   node scripts/fix-links.mjs
 *
 * Every page linked to its neighbours by relative path. Those paths were correct in the flat
 * layout and are wrong in the two-track one. Rather than guess, this resolves each link
 * against the file it sits in, looks the target up in the move map, and writes the new
 * relative path from the page's new home.
 *
 * Docusaurus fails the build on a broken internal link (onBrokenLinks: "throw"), so anything
 * this misses surfaces immediately rather than shipping as a dead link.
 */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");

/* The same map restructure.mjs used, as old -> new. */
const MOVES = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "moves.json"), "utf8"));

/** every .md now on disk, as a doc-root-relative path */
function allPages(dir = DOCS, base = "") {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (e.name === "img") continue;
      out.push(...allPages(path.join(dir, e.name), rel));
    } else if (e.name.endsWith(".md")) out.push(rel);
  }
  return out;
}

const pages = allPages();
const exists = new Set(pages);

/*
 * new path -> old path.
 *
 * A link has to be resolved against where the page USED to live, not where it is now.
 * admin/index.md came from administration/console.md, so its "./companies.md" meant
 * administration/companies.md - resolving it against admin/ looks for admin/companies.md,
 * which never existed.
 */
const ORIGIN = {};
for (const [oldP, newP] of Object.entries(MOVES)) ORIGIN[newP] = oldP;

let changed = 0;
let fixed = 0;
const unresolved = [];

for (const page of pages) {
  const file = path.join(DOCS, page);
  let body = fs.readFileSync(file, "utf8");
  const before = body;

  body = body.replace(/\]\(([^)]+\.md)(#[^)]*)?\)/g, (whole, target, hash = "") => {
    const fromDir = path.posix.dirname(page);

    // Resolve from the page's ORIGINAL directory - that is the context the link was written in.
    const originDir = path.posix.dirname(ORIGIN[page] || page);
    const resolved = path.posix.normalize(path.posix.join(originDir, target));

    // Already valid? leave it.
    if (exists.has(resolved)) return whole;

    // Was it a path that has since moved?
    const moved = MOVES[resolved];
    if (moved && exists.has(moved)) {
      let rel = path.posix.relative(fromDir, moved);
      if (!rel.startsWith(".")) rel = "./" + rel;
      fixed++;
      return `](${rel}${hash})`;
    }

    unresolved.push({ page, target, resolved });
    return whole;
  });

  if (body !== before) {
    fs.writeFileSync(file, body, "utf8");
    changed++;
  }
}

console.log(`${pages.length} pages scanned`);
console.log(`${fixed} links repaired across ${changed} files`);

if (unresolved.length) {
  console.log(`\n${unresolved.length} link(s) could not be resolved automatically:`);
  for (const u of unresolved.slice(0, 25)) console.log(`  ${u.page}  ->  ${u.target}`);
}
process.exitCode = unresolved.length ? 1 : 0;
