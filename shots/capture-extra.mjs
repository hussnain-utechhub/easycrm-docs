/*
 * The sub-states the main manifest never reached.
 *
 * Every shot here only LOOKS at a screen. Nothing is saved, published, imported or regenerated,
 * so the org is unchanged by running this:
 *   - the CSV wizard is captured at step 1 only, the empty drop zone, with no file
 *   - the login design editor is opened but never published; edits there are drafts anyway
 *   - an API key is opened for viewing; Regenerate is deliberately NOT captured, because it
 *     would issue a new secret and break whatever is using the old one
 *
 * Selectors come from shots/discover-wizards.mjs rather than from guesswork, which is what
 * stopped the Salesforce harness capturing blank pages.
 *
 *   node shots/capture-extra.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config, launch, signIn, gotoTab, settle, shoot } from "./portal.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.join(HERE, "raw");
for (const line of fs.readFileSync(path.join(HERE, ".env"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

/** Open an admin tab, then click a control on it by its visible name. */
const onTab = (tabKey, name, wait = 2500) => async (page, cfg) => {
  await gotoTab(page, cfg, "Admin");
  await page.locator(`[data-tab="${tabKey}"]`).first().click({ timeout: 20_000 });
  await settle(page, 2000);
  if (name) {
    await page.getByRole("button", { name, exact: false }).first().click({ timeout: 20_000 });
    await settle(page, wait);
  }
};

const SHOTS = [
  { id: "admin/csv-import-new-list", go: onTab("csvimport", "Submit a new list"),
    note: "wizard step 1 - the empty drop zone, no file" },
  { id: "admin/csv-import-reports",  go: onTab("csvimport", "Reports") },
  { id: "admin/csv-import-help",     go: onTab("csvimport", "Help & guides") },
  // Two clicks, not one. "Login Design" only reaches the sub-tab, which is already captured as
  // branding-login-design; the editor itself is behind "Open the design editor". Capturing the
  // sub-tab and calling it the editor is the mistake this comment exists to stop repeating.
  { id: "admin/login-design-editor", go: async (page, cfg) => {
      await onTab("branding", "Login Design", 2500)(page, cfg);
      await page.getByRole("button", { name: "Open the design editor", exact: false }).first().click({ timeout: 20_000 });
      await settle(page, 4000);
    } },
  { id: "admin/api-who-can-configure", go: onTab("apiint", "Who can configure", 3000) },
  { id: "admin/api-edit-key",        go: onTab("apiint", "Edit", 3000) },
];

const cfg = config();
const { browser, ctx } = await launch();
const page = await ctx.newPage();
await signIn(page, cfg);
console.log(`Capturing ${SHOTS.length} extra shot(s)\n`);

const failures = [];
for (const [n, s] of SHOTS.entries()) {
  try {
    await s.go(page, cfg);

    // A shot of an unchanged screen is the failure mode here: the click missed, the state never
    // opened, and the result looks like a perfectly good picture of the wrong thing.
    const text = (await page.locator("body").innerText().catch(() => "")) || "";
    if (text.trim().length < 80) throw new Error("page looks empty");

    await shoot(page, RAW, s.id);
    const f = path.join(RAW, s.id + ".png");
    console.log(`[${n + 1}/${SHOTS.length}] ${s.id.padEnd(32)} ${fs.existsSync(f) ? (fs.statSync(f).size / 1024).toFixed(0) + " KB" : "written"}`);
  } catch (e) {
    console.log(`[${n + 1}/${SHOTS.length}] ${s.id.padEnd(32)} FAILED - ${e.message.slice(0, 60)}`);
    failures.push(s.id);
    await page.screenshot({ path: path.join(RAW, s.id.replace(/\//g, "-") + ".FAIL.png") }).catch(() => {});
  }
}

await browser.close();
console.log(`\n${SHOTS.length - failures.length}/${SHOTS.length} captured.`);
if (failures.length) console.log("failed: " + failures.join(", "));
