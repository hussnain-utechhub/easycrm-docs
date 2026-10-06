/*
 * The capture runner.
 *
 *   node shots/capture.mjs                 every shot
 *   node shots/capture.mjs --wave A        one wave
 *   node shots/capture.mjs --only home/    shots whose id starts with this
 *
 * Signed-in shots reuse one browser context, so the portal is signed into once rather than
 * once per shot. Anonymous shots (the sign-in page itself) get a fresh context each time, or
 * they would inherit the session from the shot before.
 *
 * A failing shot is recorded and the run continues: one broken selector should not cost the
 * other hundred and sixty captures. Failures are listed at the end and a diagnostic image is
 * written for each.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { config, launch, signIn, shoot, settle } from "./portal.mjs";
import shots from "./manifest.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.join(HERE, "raw");

// shots/.env - key=value, one per line. Never committed.
function loadEnv() {
  const f = path.join(HERE, ".env");
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnv();

const argv = process.argv.slice(2);
const argOf = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : null;
};
const wave = argOf("--wave");
const only = argOf("--only");

let queue = shots;
if (wave) queue = queue.filter((s) => s.wave === wave.toUpperCase());
if (only) queue = queue.filter((s) => s.id.startsWith(only));

if (!queue.length) {
  console.error("No shots matched. Check --wave / --only.");
  process.exit(1);
}

const cfg = config();
fs.mkdirSync(RAW, { recursive: true });

console.log(`Capturing ${queue.length} shot(s) -> ${path.relative(process.cwd(), RAW)}\n`);

const failures = [];
let done = 0;

const { browser, ctx } = await launch();
let signedIn = null; // the shared signed-in page

try {
  for (const shot of queue) {
    const label = `[${String(++done).padStart(3)}/${queue.length}] ${shot.id}`;
    let page;
    let ownContext = null;

    try {
      if (shot.anonymous) {
        // A clean context, so no session leaks in from a previous shot.
        ownContext = await browser.newContext({
          viewport: ctx._options?.viewport || { width: 1440, height: 900 },
          deviceScaleFactor: 2,
          locale: "en-GB",
          timezoneId: "UTC",
          reducedMotion: "reduce",
        });
        ownContext.setDefaultTimeout(45_000);
        page = await ownContext.newPage();
      } else {
        if (!signedIn) {
          signedIn = await ctx.newPage();
          process.stdout.write("      signing in … ");
          await signIn(signedIn, cfg, shot.role || "superadmin");
          console.log("ok");
        }
        page = signedIn;
      }

      await shot.setup(page, { cfg });
      await settle(page, 400);
      const file = await shoot(page, RAW, shot.id, shot.opts || {});
      const kb = Math.round(fs.statSync(file).size / 1024);
      console.log(`${label}  ${kb} KB`);
    } catch (e) {
      const msg = String(e).split("\n")[0].slice(0, 120);
      console.log(`${label}  FAILED: ${msg}`);
      failures.push({ id: shot.id, error: msg });
      try {
        if (page) {
          fs.mkdirSync(path.join(RAW, "_failed"), { recursive: true });
          await page.screenshot({
            path: path.join(RAW, "_failed", `${shot.id.replace(/\//g, "__")}.png`),
          });
        }
      } catch {
        /* nothing more to learn here */
      }
      // A failed shot can leave the shared page on a modal. Reset it.
      if (!shot.anonymous && signedIn) {
        try {
          await signedIn.goto(cfg.portal + "#tab=Home", { waitUntil: "domcontentloaded" });
          await settle(signedIn, 1500);
        } catch {
          /* the next shot will report it */
        }
      }
    } finally {
      if (ownContext) await ownContext.close();
    }
  }
} finally {
  await browser.close();
}

console.log(`\n${queue.length - failures.length}/${queue.length} captured.`);
if (failures.length) {
  console.log(`\n${failures.length} failed:`);
  for (const f of failures) console.log(`  ${f.id}\n    ${f.error}`);
  console.log(`\nDiagnostic images: ${path.join("shots", "raw", "_failed")}`);
  process.exitCode = 1;
}
