/*
 * Turn shots/raw/**.png into docs/img/shots/**.png, small enough to commit.
 *
 *   node shots/optimise.mjs
 *
 * Captures are taken at deviceScaleFactor 2 (2880 wide) because text rendered at 1x and then
 * upscaled by the browser looks soft. 2880 is wider than any column this site has, so each is
 * resized to 1760 - still retina-sharp in a ~880px column - and palette-reduced. That is the
 * difference between ~400 KB and ~90 KB a shot, and over a hundred and seventy shots it is the
 * difference between a repo people can clone and one they cannot.
 *
 * Output lives under docs/, not static/, on purpose: pages reference images with RELATIVE
 * paths, which webpack resolves and rewrites for whatever baseUrl the site is built with. An
 * absolute "/img/..." in markdown is emitted unchanged and 404s the moment the site is served
 * from a subpath, which is exactly how this site is served on GitHub Pages.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.join(HERE, "raw");
const OUT = path.join(HERE, "..", "docs", "img", "shots");

const TARGET_WIDTH = 1760;

if (!fs.existsSync(RAW)) {
  console.error("No shots/raw. Run `node shots/capture.mjs` first.");
  process.exit(1);
}

function* walk(dir, base = "") {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (e.name === "_failed") continue; // diagnostics, never shipped
      yield* walk(full, rel);
    } else if (e.name.endsWith(".png")) {
      yield { full, rel };
    }
  }
}

let n = 0;
let rawTotal = 0;
let outTotal = 0;

for (const { full, rel } of walk(RAW)) {
  const dest = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  const meta = await sharp(full).metadata();
  const width = Math.min(TARGET_WIDTH, meta.width || TARGET_WIDTH);

  await sharp(full)
    .resize({ width, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 82, effort: 9 })
    .toFile(dest);

  const a = fs.statSync(full).size;
  const b = fs.statSync(dest).size;
  rawTotal += a;
  outTotal += b;
  n++;
  console.log(
    `${rel.padEnd(42)} ${String(Math.round(a / 1024)).padStart(5)} KB -> ${String(
      Math.round(b / 1024)
    ).padStart(4)} KB`
  );
}

const mb = (x) => (x / 1024 / 1024).toFixed(1);
console.log(`\n${n} images.  ${mb(rawTotal)} MB -> ${mb(outTotal)} MB`);
