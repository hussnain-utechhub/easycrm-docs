/*
 * What is clickable on the screens behind the pages that still have no screenshot.
 *
 * Seven doc pages carry no image at all - report formulas, bucket columns, filter logic,
 * inline editing, dashboard tiles, deactivating a user, account scoping - and none of them
 * has a shot in the manifest either. This prints the real control names on each of those
 * screens so the capture can address them exactly, for the same reason discover-wizards.mjs
 * exists: a guessed selector produces a shot that passes while showing the wrong screen.
 *
 *   node shots/discover-gaps.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config, launch, signIn, gotoTab, settle } from "./portal.mjs";
import { openReportBuilder, openDashboardBuilder, openList, byName } from "./nav.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
for (const line of fs.readFileSync(path.join(HERE, ".env"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const REPORT = "Summary Activity Report";
const DASHBOARD = "Calling Dashboard Test";

/** Everything clickable, including inside open shadow roots. */
const probe = (page) =>
  page.evaluate(() => {
    const out = { buttons: [], tabs: [], inputs: [], adders: [], headings: [] };
    const txt = (e) =>
      (e.innerText || e.textContent || e.value || "").trim().replace(/\s+/g, " ").slice(0, 46);
    const seen = new Set();
    const push = (arr, key, v) => {
      if (v && v.length > 1 && !seen.has(key + v)) {
        seen.add(key + v);
        arr.push(v);
      }
    };
    const all = [];
    const walk = (root) => {
      all.push(...root.querySelectorAll("*"));
      for (const el of root.querySelectorAll("*")) if (el.shadowRoot) walk(el.shadowRoot);
    };
    walk(document);
    for (const el of all) {
      const tag = el.tagName.toLowerCase();
      if (el.dataset?.adder) push(out.adders, "a", `[data-adder="${el.dataset.adder}"] ${el.placeholder || ""}`);
      else if (el.dataset?.tab) push(out.tabs, "t", `${el.dataset.tab} = ${txt(el)}`);
      else if (tag === "button" || el.getAttribute?.("role") === "button") push(out.buttons, "b", txt(el));
      else if (tag === "input" || tag === "select" || tag === "textarea")
        push(out.inputs, "i", el.placeholder || el.name || `${tag}:${el.type || ""}`);
      else if (/^h[1-4]$/.test(tag)) push(out.headings, "h", txt(el));
    }
    return out;
  });

async function report(page, title) {
  console.log(`\n=== ${title} ===`);
  const f = await probe(page);
  for (const [k, v] of Object.entries(f)) {
    if (!v.length) continue;
    console.log(`  ${k} (${v.length}):`);
    console.log("     " + v.slice(0, 40).join(" | "));
  }
}

const cfg = config();
const { browser, ctx } = await launch();
const page = await ctx.newPage();
await signIn(page, cfg);
const h = { cfg };

const STEPS = [
  [
    "Report builder - top level (looking for formula / bucket controls)",
    async () => {
      await openReportBuilder(REPORT)(page, h);
    },
  ],
  [
    "Report builder - the Columns adder open (buckets usually live here)",
    async () => {
      await openReportBuilder(REPORT)(page, h);
      await page.locator('input[data-adder="col"]').first().click();
      await settle(page, 2200);
    },
  ],
  [
    "Report builder - Filters tab (looking for Filter Logic)",
    async () => {
      await openReportBuilder(REPORT)(page, h);
      await page.locator('[data-tab="filters"]').first().click();
      await settle(page, 2200);
    },
  ],
  [
    "Dashboard builder - the widget dialog (tile kinds)",
    async () => {
      await openDashboardBuilder(DASHBOARD)(page, h);
      const b = byName(page, "Widget");
      if (await b.count()) {
        await b.first().click();
        await settle(page, 2500);
      }
    },
  ],
  [
    "A list - inline editing affordance",
    async () => {
      await openList("Account")(page, h);
    },
  ],
  [
    "Admin console - every tab key",
    async () => {
      await gotoTab(page, cfg, "Admin");
      await settle(page, 2500);
    },
  ],
  [
    "Admin - Users (looking for the row menu / Deactivate)",
    async () => {
      await gotoTab(page, cfg, "Admin");
      await page.locator('[data-tab="users"]').first().click({ timeout: 15_000 });
      await settle(page, 2500);
    },
  ],
];

for (const [title, go] of STEPS) {
  try {
    await go();
    await report(page, title);
  } catch (e) {
    console.log(`\n=== ${title} ===\n  could not open: ${String(e.message).slice(0, 90)}`);
  }
}

await browser.close();
