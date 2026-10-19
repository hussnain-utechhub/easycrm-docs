/*
 * Salesforce-side capture.
 *
 * The portal harness (portal.mjs) only drives the public Site. Half of what an administrator
 * does happens in Salesforce itself - the EasyCRM app, its five tabs, Setup - and none of that
 * was ever screenshotted. This signs into Lightning and captures those.
 *
 * Sign-in is by frontdoor with the CLI's own session, so no password is stored anywhere and the
 * org is only ever READ: every function here navigates and screenshots, nothing submits a form.
 *
 *   node shots/sf.mjs                  every shot
 *   node shots/sf.mjs --only app/      shots whose id starts with this
 *
 * The namespace prefix matters. In the packaging org the tabs are EasyCRM__Portal_Setup, not
 * Portal_Setup; without it Lightning answers with its generic "item doesn't exist" page, which
 * screenshots perfectly happily and looks like a real screen until someone reads it.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.join(HERE, "raw", "sf");
const ORG = process.env.SF_ORG || "EasyCrmNS31";
const NS = "EasyCRM__";

/** instanceUrl + accessToken straight from the CLI, so nothing is kept in this repo. */
function session() {
  // shell:true is required on Windows: the CLI is a .cmd shim, and execFileSync cannot spawn one
  // without a shell - it fails with EINVAL before the command ever runs.
  const out = execFileSync(
    "sf",
    ["org", "display", "--target-org", ORG, "--json"],
    { encoding: "utf8", maxBuffer: 1 << 24, shell: true }
  );
  const r = JSON.parse(out.slice(out.indexOf("{"))).result;
  if (!r?.accessToken) throw new Error(`No session for ${ORG}. Is it still alive?`);
  return { url: r.instanceUrl.replace(/\/$/, ""), token: r.accessToken };
}

/* id -> where to go. A plain path keeps this readable; anything needing clicks gets an `act`. */
const SHOTS = [
  { id: "app/launcher", path: "/lightning/page/home", act: openLauncher,
    note: "App Launcher with EasyCRM visible" },
  { id: "app/portal-setup", path: `/lightning/n/${NS}Portal_Setup` },
  { id: "app/portal-users", path: `/lightning/n/${NS}Portal_Users` },
  { id: "app/publish-reports", path: `/lightning/n/${NS}Publish_Portal_Reports` },
  { id: "app/sync-formulas", path: `/lightning/n/${NS}Sync_Report_Formulas` },
  { id: "app/license-console", path: `/lightning/n/${NS}License_Console` },
];

async function openLauncher(page) {
  await page.locator('div.slds-icon-waffle').first().click({ timeout: 20_000 });
  await page.waitForTimeout(1500);
}

/**
 * Lightning keeps painting after load; wait for the spinner to go and the frame to settle.
 *
 * The iframe wait is the part that matters. Three of the EasyCRM tabs are VISUALFORCE pages, and
 * Lightning renders those inside an iframe that loads on its own schedule - well after the outer
 * page reports domcontentloaded and after every spinner has gone. Screenshotting at that moment
 * produces a perfect picture of the app chrome with a COMPLETELY BLANK body, which no error check
 * catches because a blank page says nothing. That is how the first run of this script "succeeded"
 * on all six shots while two of them were empty.
 */
async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  for (const sel of ["div.slds-spinner", "lightning-spinner", ".forceInlineSpinner"]) {
    await page.locator(sel).first().waitFor({ state: "hidden", timeout: 15_000 }).catch(() => {});
  }
  await page.waitForTimeout(2000);
  await waitForContent(page, 45_000);
  await page.waitForTimeout(1200);
}

/** How much readable text the screen has, counting inside any Visualforce iframe. */
async function contentText(page) {
  let best = "";
  for (const fr of page.frames()) {
    const t = await fr.locator("body").innerText({ timeout: 4000 }).catch(() => "");
    if (t && t.trim().length > best.length) best = t.trim();
  }
  return best;
}

/** Poll until the screen actually has something on it, so the shot is not of an empty frame. */
async function waitForContent(page, ms) {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    if ((await contentText(page)).length > 60) return true;
    await page.waitForTimeout(1000);
  }
  return false;
}

const argv = process.argv.slice(2);
const i = argv.indexOf("--only");
const only = i >= 0 ? argv[i + 1] : null;
const queue = only ? SHOTS.filter((s) => s.id.startsWith(only)) : SHOTS;
if (!queue.length) { console.error("No shots matched."); process.exit(1); }

const { url, token } = session();
fs.mkdirSync(RAW, { recursive: true });
console.log(`Capturing ${queue.length} Salesforce shot(s) from ${ORG}\n`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

// frontdoor hands the browser the CLI's session; nothing is typed and no password exists here.
await page.goto(`${url}/secur/frontdoor.jsp?sid=${encodeURIComponent(token)}`, { waitUntil: "domcontentloaded", timeout: 90_000 });
await page.waitForTimeout(4000);
console.log(`  signed in … ${page.url().includes("lightning") || page.url().includes("salesforce") ? "ok" : "CHECK: " + page.url()}\n`);

const failures = [];
for (const [n, s] of queue.entries()) {
  const out = path.join(RAW, `${s.id.replace(/\//g, "-")}.png`);
  try {
    await page.goto(url + s.path, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await settle(page);
    if (s.act) await s.act(page);

    // Two ways a shot can look fine and be worthless, both of which have actually happened here.
    const body = await contentText(page);
    if (/item doesn't exist|insufficient privileges|page isn't available|refresh the page/i.test(body.slice(0, 600))) {
      throw new Error("Lightning error page: " + body.slice(0, 90).replace(/\s+/g, " "));
    }
    // A blank body. No error text to match on, so it has to be caught by absence.
    if (body.length < 60) {
      throw new Error(`blank page - only ${body.length} chars of text rendered`);
    }
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await page.screenshot({ path: out });
    console.log(`[${String(n + 1).padStart(2)}/${queue.length}] ${s.id.padEnd(24)} ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
  } catch (e) {
    console.log(`[${String(n + 1).padStart(2)}/${queue.length}] ${s.id.padEnd(24)} FAILED - ${e.message.slice(0, 80)}`);
    failures.push(s.id);
    await page.screenshot({ path: out.replace(/\.png$/, ".FAIL.png") }).catch(() => {});
  }
}

await browser.close();
console.log(`\n${queue.length - failures.length}/${queue.length} captured.`);
if (failures.length) { console.log("failed: " + failures.join(", ")); process.exit(1); }
