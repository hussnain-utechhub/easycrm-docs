/*
 * The runner for manifest-2026-10.mjs - the October 2026 shots the pages ask for.
 *
 *   node shots/capture-2026-10.mjs                  every shot
 *   node shots/capture-2026-10.mjs --only lists/    shots whose id starts with this
 *   node shots/capture-2026-10.mjs --only a,b/c     several prefixes, comma-separated
 *
 * Same viewport, scale, locale and branding treatment as capture.mjs; raw PNGs go to
 * shots/raw-2026-10/ (never committed). Then optimise them into docs/img/shots with
 *
 *   node shots/optimise.mjs --raw raw-2026-10
 *
 * Differences from capture.mjs:
 *   - a shot may carry `after`, called once the picture is taken AND when setup fails, to put
 *     back what the setup staged (cancel inline edits, clear a ticked dashboard filter value);
 *   - a shot may carry `fresh: true` for screens that change the browser clock or end the
 *     session - those get their own signed-in context so the rest of the run is untouched;
 *   - a shot may carry `noSettle: true` when a spinner IS the subject (no wait for it to go);
 *   - a shot may carry `sf: true` for Salesforce-side screens, which sign in by frontdoor with
 *     the CLI's session (see sf.mjs) instead of signing in to the portal.
 *
 * The portal allows one session per person: never run two captures at once.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { config, launch, signIn, shoot, settle, VIEWPORT, SCALE } from "./portal.mjs";
import shots from "./manifest-2026-10.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.join(HERE, "raw-2026-10");

// shots/.env - key=value, one per line. Never committed. process.env wins.
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
const only = argOf("--only");

let queue = shots;
if (only) {
  const prefixes = only.split(",").map((s) => s.trim()).filter(Boolean);
  queue = queue.filter((s) => prefixes.some((p) => s.id.startsWith(p)));
}
if (!queue.length) {
  console.error("No shots matched. Check --only.");
  process.exit(1);
}

/*
 * Salesforce-side shots sign in by frontdoor, as sf.mjs does: SF_INSTANCE_URL + SF_ACCESS_TOKEN
 * from the environment if set, otherwise the CLI's own session for SF_ORG. Nothing is typed and
 * nothing is stored. Those screens are captured at the Salesforce harness's 1600 x 1000.
 */
function sfSession() {
  if (process.env.SF_INSTANCE_URL && process.env.SF_ACCESS_TOKEN) {
    return { url: process.env.SF_INSTANCE_URL.replace(/\/$/, ""), token: process.env.SF_ACCESS_TOKEN };
  }
  const org = process.env.SF_ORG || "EasyCrmNS32";
  const out = execFileSync("sf", ["org", "display", "--target-org", org, "--json"], {
    encoding: "utf8", maxBuffer: 1 << 24, shell: true,
  });
  const r = JSON.parse(out.slice(out.indexOf("{"))).result;
  if (!r?.accessToken) throw new Error(`No session for ${org}. Is it still alive?`);
  return { url: r.instanceUrl.replace(/\/$/, ""), token: r.accessToken };
}

async function sfSignIn(page) {
  const { url, token } = sfSession();
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto(`${url}/secur/frontdoor.jsp?sid=${encodeURIComponent(token)}`, {
    waitUntil: "domcontentloaded", timeout: 90_000,
  });
  await page.waitForTimeout(4000);
  if (!/lightning|salesforce/.test(page.url())) throw new Error("frontdoor did not sign in");
  return { url };
}

const cfg = config();
fs.mkdirSync(RAW, { recursive: true });
console.log(`Capturing ${queue.length} shot(s) -> ${path.relative(process.cwd(), RAW)}\n`);

const failures = [];
let done = 0;

const { browser, ctx } = await launch();
let signedIn = null; // the shared signed-in page
let sfPage = null; // the shared Salesforce page, signed in by frontdoor on first use

async function newContext() {
  const c = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: SCALE,
    locale: "en-GB",
    timezoneId: "UTC",
    reducedMotion: "reduce",
  });
  c.setDefaultTimeout(45_000);
  return c;
}

try {
  for (const shot of queue) {
    const label = `[${String(++done).padStart(3)}/${queue.length}] ${shot.id}`;
    let page;
    let ownContext = null;
    const h = { cfg };

    try {
      if (shot.sf) {
        if (!sfPage) {
          sfPage = await (await newContext()).newPage();
          process.stdout.write("      Salesforce frontdoor … ");
          sfPage._sf = await sfSignIn(sfPage);
          console.log("ok");
        }
        h.sf = sfPage._sf;
        page = sfPage;
      } else if (shot.fresh) {
        // Its own context: the clock it fakes, or the session it lets lapse, stays in here.
        // Signing in again ends the shared session, so the shared page signs in afresh after.
        ownContext = await newContext();
        page = await ownContext.newPage();
        if (shot.beforeSignIn) await shot.beforeSignIn(page, h);
        await signIn(page, cfg, shot.role || "superadmin");
        signedIn = null;
      } else {
        if (!signedIn) {
          signedIn = await ctx.newPage();
          process.stdout.write("      signing in … ");
          await signIn(signedIn, cfg, shot.role || "superadmin");
          console.log("ok");
        }
        page = signedIn;
      }

      await shot.setup(page, h);
      // noSettle: the screen is a passing state (a spinner is the subject) - shoot it as it is
      if (!shot.sf && !shot.noSettle) await settle(page, 400);
      const file = await shoot(page, RAW, shot.id, shot.opts || {});
      const kb = Math.round(fs.statSync(file).size / 1024);
      console.log(`${label}  ${kb} KB`);
    } catch (e) {
      const msg = String(e).split("\n")[0].slice(0, 160);
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
    } finally {
      // Put back whatever the setup staged, whether or not the picture was taken.
      if (shot.after && page) {
        try {
          await shot.after(page, h);
        } catch (e) {
          console.log(`      after() for ${shot.id} failed: ${String(e).split("\n")[0].slice(0, 120)}`);
        }
      }
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
  console.log(`\nDiagnostic images: ${path.join("shots", "raw-2026-10", "_failed")}`);
  process.exitCode = 1;
}
