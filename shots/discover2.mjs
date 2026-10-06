/*
 * Second discovery pass: the deep screens the first pass never reached.
 *
 * The first pass only visited things addressable by #tab=. The builders, the layout editor
 * and the login designer all sit behind a click or two, which is exactly why they were
 * missed. This walks into each one and dumps its controls.
 *
 *   node shots/discover2.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config, launch, signIn, gotoTab, settle } from "./portal.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
for (const line of fs.readFileSync(path.join(HERE, ".env"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const inventory = () => {
  const roots = [document];
  const walk = (r) => {
    for (const el of r.querySelectorAll("*")) if (el.shadowRoot) { roots.push(el.shadowRoot); walk(el.shadowRoot); }
  };
  walk(document);
  const out = [];
  const seen = new Set();
  for (const root of roots) {
    for (const el of root.querySelectorAll("button, a, select, input, [role=button], [role=tab], summary, li[data-id], [data-tab]")) {
      const b = el.getBoundingClientRect();
      if (b.width < 4 || b.height < 4) continue;
      const text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 44);
      const rec = [
        el.tagName.toLowerCase(),
        text || "",
        el.getAttribute("title") || "",
        el.getAttribute("aria-label") || "",
        el.getAttribute("placeholder") || "",
        (el.getAttribute("class") || "").split(/\s+/)[0] || "",
        Object.keys(el.dataset || {}).length ? JSON.stringify(el.dataset) : "",
      ].join(" | ");
      if (seen.has(rec)) continue;
      seen.add(rec);
      out.push(rec);
    }
  }
  return out;
};

const cfg = config();
const { browser, ctx } = await launch();
const page = await ctx.newPage();
const report = {};

const grab = async (name, fn) => {
  try {
    await fn();
    report[name] = await page.evaluate(inventory);
    console.log(`${name.padEnd(34)} ${report[name].length}`);
  } catch (e) {
    report[name] = { error: String(e).split("\n")[0].slice(0, 110) };
    console.log(`${name.padEnd(34)} FAILED  ${String(e).split("\n")[0].slice(0, 70)}`);
  }
};

const openList = async (api) => {
  await gotoTab(page, cfg, api);
  await page.locator("button.portal-viewsel").first().click();
  await settle(page, 1200);
  const all = page.locator("li.pvm-item").filter({ hasText: /^All / }).first();
  if (await all.count()) await all.click();
  else await page.keyboard.press("Escape");
  await page.locator("tbody a:visible").first().waitFor({ state: "visible", timeout: 60_000 });
  await settle(page, 1500);
};
const openRecord = async (api) => {
  await openList(api);
  await page.locator("tbody a:visible").first().click();
  await settle(page, 4000);
};

try {
  await signIn(page, cfg, "superadmin");

  // ---- record page and everything on it ----
  await grab("record", () => openRecord("Account"));
  await grab("record/edit-page-layout", async () => {
    await openRecord("Account");
    await page.getByRole("button", { name: "Edit Page Layout", exact: false }).first().click();
    await settle(page, 3500);
  });
  await grab("record/change-owner", async () => {
    await openRecord("Account");
    await page.getByRole("button", { name: "Change Owner", exact: false }).first().click();
    await settle(page, 2500);
  });
  await grab("record/activities-filters", async () => {
    await openRecord("Account");
    await page.locator("button[title*='filter' i], .act-filter-btn, button[title*='Filters']").first().click();
    await settle(page, 2000);
  });

  // ---- report builder ----
  await grab("reports/new-report-picker", async () => {
    await gotoTab(page, cfg, "Reports");
    await page.getByRole("button", { name: "New Report", exact: false }).first().click();
    await settle(page, 4000);
  });
  await grab("reports/builder", async () => {
    await gotoTab(page, cfg, "Reports");
    await page.getByText("Summary Activity Report", { exact: false }).first().click();
    await settle(page, 7000);
    await page.getByRole("button", { name: "Edit", exact: false }).first().click();
    await settle(page, 7000);
  });

  // ---- dashboard builder ----
  await grab("dashboards/builder", async () => {
    await gotoTab(page, cfg, "Dashboards");
    await page.getByText("Calling Dashboard Test", { exact: false }).first().click();
    await settle(page, 8000);
    await page.getByRole("button", { name: "Edit", exact: false }).first().click();
    await settle(page, 7000);
  });

  // ---- admin screens that hide sub-tabs ----
  for (const [name, tab] of [
    ["admin/sharing", "sharing"],
    ["admin/branding", "branding"],
    ["admin/csv-import", "csvimport"],
    ["admin/buttons", "buttons"],
    ["admin/tabs", "navtabs"],
    ["admin/apps", "apps"],
    ["admin/reports-dashboards", "reports"],
    ["admin/publish-schedule", "pubsched"],
    ["admin/list-mappings", "listmappings"],
  ]) {
    await grab(name, async () => {
      await gotoTab(page, cfg, "Admin");
      await page.locator(`[data-tab="${tab}"]`).first().click();
      await settle(page, 3000);
    });
  }

  // ---- other tabs ----
  for (const [name, key] of [["files", "Files"], ["settings", "Settings"], ["profile", "Profile"]]) {
    await grab(name, () => gotoTab(page, cfg, key));
  }
} finally {
  await browser.close();
}

const out = path.join(HERE, "discovery2.json");
fs.writeFileSync(out, JSON.stringify(report, null, 1));
console.log(`\nWrote ${path.relative(process.cwd(), out)}`);
