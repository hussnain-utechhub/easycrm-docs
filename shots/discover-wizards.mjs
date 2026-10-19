/*
 * What is actually clickable on the screens whose sub-states are not yet captured.
 *
 * Written before the capture script rather than after, because guessing selectors is how the
 * last harness ended up with shots that passed while showing the wrong screen. This prints the
 * real controls so the capture can name them exactly.
 *
 *   node shots/discover-wizards.mjs
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

const TARGETS = [
  ["csvimport", "CSV Import"],
  ["branding", "Branding (holds Login design)"],
  ["apiint", "API Integration"],
  ["reports", "Reports & Dashboards"],
];

const cfg = config();
const { browser, ctx } = await launch();
const page = await ctx.newPage();
await signIn(page, cfg);

for (const [key, label] of TARGETS) {
  console.log(`\n=== ${label}  (tab=${key}) ===`);
  try {
    await gotoTab(page, cfg, "Admin");
    await page.locator(`[data-tab="${key}"]`).first().click({ timeout: 15_000 });
    await settle(page, 2500);
  } catch (e) {
    console.log(`  could not open: ${e.message.slice(0, 70)}`);
    continue;
  }

  const found = await page.evaluate(() => {
    const out = { buttons: [], tabs: [], inputs: [], headings: [] };
    const txt = (e) => (e.innerText || e.textContent || e.value || "").trim().replace(/\s+/g, " ").slice(0, 44);
    const seen = new Set();
    const push = (arr, v) => { if (v && v.length > 1 && !seen.has(arr === out.buttons ? v : arr + v)) { seen.add(arr === out.buttons ? v : arr + v); arr.push(v); } };

    // walk open shadow roots too - the portal is built from Lightning components
    const all = [];
    const walk = (root) => {
      all.push(...root.querySelectorAll("*"));
      for (const el of root.querySelectorAll("*")) if (el.shadowRoot) walk(el.shadowRoot);
    };
    walk(document);

    for (const el of all) {
      const tag = el.tagName.toLowerCase();
      if (tag === "button" || el.getAttribute?.("role") === "button") push(out.buttons, txt(el));
      else if (el.dataset?.tab) push(out.tabs, el.dataset.tab + " = " + txt(el));
      else if (tag === "input" || tag === "select" || tag === "textarea")
        push(out.inputs, (el.placeholder || el.name || el.type || tag) + (el.type === "file" ? "  [FILE]" : ""));
      else if (/^h[1-3]$/.test(tag)) push(out.headings, txt(el));
    }
    return out;
  });

  for (const [k, v] of Object.entries(found)) {
    if (!v.length) continue;
    console.log(`  ${k} (${v.length}):`);
    console.log("     " + v.slice(0, 26).join(" | "));
  }
}

await browser.close();
