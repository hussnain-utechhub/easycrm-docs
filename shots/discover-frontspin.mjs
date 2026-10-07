/*
 * What is actually on the FrontSpin portal screens, in the sandbox that has FrontSpin installed.
 *
 *   PORTAL_URL=... SUPERADMIN_USER=... SUPERADMIN_PASS=... node shots/discover-frontspin.mjs
 *
 * The scratch org the main capture runs against has no FrontSpin, so those tabs there only ever
 * render "FrontSpin is not set up in this org". This dumps the real controls so the capture
 * script can select them by what they are rather than by what they are guessed to be.
 *
 * Read-only: it signs in, looks, and writes a JSON file locally. Nothing is saved in the org.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config, launch, signIn, gotoTab, settle } from "./portal.mjs";

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

/** Everything clickable or readable on screen, including inside shadow roots. */
async function describe(page) {
  return page.evaluate(() => {
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
    const out = { buttons: [], tabs: [], selects: [], inputs: [], headings: [], notices: [], tableHeads: [] };
    const push = (bucket, v) => {
      const k = bucket + "|" + v;
      if (v && !seen.has(k)) {
        seen.add(k);
        out[bucket].push(v);
      }
    };

    for (const root of roots) {
      for (const el of root.querySelectorAll("button, a[role=button]")) {
        const t = (el.innerText || el.textContent || "").trim().replace(/\s+/g, " ");
        if (t) push("buttons", t.slice(0, 60));
      }
      for (const el of root.querySelectorAll("[data-tab]")) {
        push("tabs", el.getAttribute("data-tab") + " :: " + (el.innerText || "").trim());
      }
      for (const el of root.querySelectorAll("select")) {
        const opts = [...el.options].slice(0, 12).map((o) => o.text.trim()).join(" / ");
        push("selects", `${el.className || "(select)"} -> ${opts}`);
      }
      for (const el of root.querySelectorAll("input, textarea")) {
        push("inputs", `${el.type || "text"} ph="${el.placeholder || ""}" cls="${el.className || ""}"`);
      }
      for (const el of root.querySelectorAll("h1,h2,h3,h4")) {
        const t = (el.innerText || "").trim().replace(/\s+/g, " ");
        if (t) push("headings", t.slice(0, 90));
      }
      for (const el of root.querySelectorAll(".slds-notify, [class*=notice], [class*=warn], [class*=info]")) {
        const t = (el.innerText || "").trim().replace(/\s+/g, " ");
        if (t && t.length < 220) push("notices", t);
      }
      for (const el of root.querySelectorAll("th")) {
        const t = (el.innerText || "").trim().replace(/\s+/g, " ");
        if (t) push("tableHeads", t.slice(0, 40));
      }
    }
    return out;
  });
}

const cfg = config();
const { browser, ctx } = await launch();
const page = await ctx.newPage();
const report = {};

try {
  await signIn(page, cfg, "superadmin");
  report.shellTabs = await page.evaluate(() =>
    [...document.querySelectorAll("nav a, .tabs a, .tab")].map((e) => e.textContent.trim()).filter(Boolean).slice(0, 40)
  );

  await gotoTab(page, cfg, "Admin");
  report.adminLanding = await describe(page);

  for (const key of ["listmappings", "apiusage", "companies"]) {
    try {
      await gotoTab(page, cfg, "Admin");
      await page.locator(`[data-tab="${key}"]`).first().click();
      await settle(page, 3000);
      report[key] = await describe(page);
      await page.screenshot({ path: path.join(HERE, "raw", `_discover-${key}.png`) });
    } catch (e) {
      report[key] = { error: String(e).slice(0, 300) };
    }
  }
} catch (e) {
  report.fatal = String(e).slice(0, 500);
  try {
    await page.screenshot({ path: path.join(HERE, "raw", "_discover-fatal.png") });
  } catch {}
} finally {
  fs.mkdirSync(path.join(HERE, "raw"), { recursive: true });
  fs.writeFileSync(path.join(HERE, "discovery-frontspin.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2).slice(0, 7000));
  await browser.close();
}
