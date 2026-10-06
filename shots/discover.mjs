/*
 * Discovery pass.
 *
 * Writes shots/discovery.json: for each major screen, every control that can be clicked and
 * how to address it. Guessing a hundred selectors and watching them time out one at a time
 * costs an hour per wave; reading them off the real pages costs one run.
 *
 *   node shots/discover.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config, launch, signIn, gotoTab, settle } from "./portal.mjs";
import { ADMIN_TABS } from "./manifest.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const f = path.join(HERE, ".env");
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnv();

/** Runs in the page. Walks open shadow roots and reports visible, addressable controls. */
function inventory() {
  const roots = [document];
  const walk = (r) => {
    for (const el of r.querySelectorAll("*")) {
      if (el.shadowRoot) {
        roots.push(el.shadowRoot);
        walk(el.shadowRoot);
      }
    }
  };
  walk(document);

  const seen = new Set();
  const out = [];

  for (const root of roots) {
    for (const el of root.querySelectorAll("button, a, [role=button], select, input, summary")) {
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue; // not on screen

      const text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60);
      const rec = {
        tag: el.tagName.toLowerCase(),
        text,
        title: el.getAttribute("title") || undefined,
        aria: el.getAttribute("aria-label") || undefined,
        placeholder: el.getAttribute("placeholder") || undefined,
        cls: (el.getAttribute("class") || "").split(/\s+/).filter(Boolean).slice(0, 3).join(".") || undefined,
        data: Object.keys(el.dataset || {}).length ? { ...el.dataset } : undefined,
      };
      const key = JSON.stringify(rec);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(rec);
    }
  }
  return out;
}

const cfg = config();
const { browser, ctx } = await launch();
const page = await ctx.newPage();
const report = {};

try {
  await signIn(page, cfg, "superadmin");

  const screens = [
    ["home", "Home"],
    ["accounts", "Account"],
    ["contacts", "Contact"],
    ["task", "Task"],
    ["reports", "Reports"],
    ["dashboards", "Dashboards"],
    ["files", "Files"],
    ["profile", "Profile"],
    ["settings", "Settings"],
  ];

  for (const [name, key] of screens) {
    try {
      await gotoTab(page, cfg, key);
      report[name] = await page.evaluate(inventory);
      console.log(`${name.padEnd(12)} ${report[name].length} controls`);
    } catch (e) {
      report[name] = { error: String(e).split("\n")[0] };
      console.log(`${name.padEnd(12)} FAILED`);
    }
  }

  // A record page, reached from the first row of the Accounts list.
  try {
    await gotoTab(page, cfg, "Account");
    await page.locator("table a, td a").first().click();
    await settle(page, 3500);
    report["record"] = await page.evaluate(inventory);
    console.log(`${"record".padEnd(12)} ${report["record"].length} controls`);
  } catch {
    console.log("record       FAILED");
  }

  for (const [slug, , key] of ADMIN_TABS) {
    try {
      await gotoTab(page, cfg, "Admin");
      await page.locator(`[data-tab="${key}"]`).first().click();
      await settle(page, 2500);
      report[`admin/${slug}`] = await page.evaluate(inventory);
      console.log(`${("admin/" + slug).padEnd(28)} ${report[`admin/${slug}`].length} controls`);
    } catch {
      console.log(`admin/${slug} FAILED`);
    }
  }
} finally {
  await browser.close();
}

const out = path.join(HERE, "discovery.json");
fs.writeFileSync(out, JSON.stringify(report, null, 1));
console.log(`\nWrote ${path.relative(process.cwd(), out)}`);
