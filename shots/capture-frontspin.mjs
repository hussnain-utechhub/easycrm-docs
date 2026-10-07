/*
 * The FrontSpin portal screens.
 *
 *   PORTAL_URL=... SUPERADMIN_USER=... SUPERADMIN_PASS=... node shots/capture-frontspin.mjs
 *
 * A SEPARATE runner from capture.mjs, deliberately. The main capture points at a scratch org
 * that has no FrontSpin installed, so its List Mappings tab can only ever render "FrontSpin is
 * not set up in this org". These shots have to come from the sandbox where the integration is
 * live, which is a different org, different credentials and different data.
 *
 * READ-ONLY. It signs in, opens screens, and opens the New-mapping dialog to photograph it -
 * then dismisses it. Nothing is ever saved, and no record in the org is created or changed.
 *
 * WHY THE TOKEN MAP BELOW IS NOT OPTIONAL
 * ---------------------------------------
 * The list picker on these screens enumerates the tenant's FrontSpin lists, and those are named
 * after the tenant's own clients - roughly fifty real companies, several with an individual's
 * first name in the title. Publishing these screens unaltered would publish that client roster.
 * Every token is replaced in the browser immediately before the shutter, exactly as rebrand.mjs
 * does for the tenant's branding. The org is never written to.
 *
 * Longest first: "Singing Carrots" must be replaced before "Carrots" would match, and
 * "Vibe.us" before "Vibe".
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config, launch, signIn, gotoTab, settle, shoot } from "./portal.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.join(HERE, "raw");

function loadEnv() {
  const f = path.join(HERE, ".env");
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnv();

/** Client identities visible in the FrontSpin list catalogue, longest token first. */
const FRONTSPIN_IDENTITIES = [
  ["Value Creation PE", "Capital Partners"],
  ["Singing Carrots", "Northwind Traders"],
  ["Kama Solutions", "Proseware"],
  ["Vilkas Cyber", "Olympia Cyber"],
  ["Tee Commerce", "Relecloud"],
  ["Stack Against", "VanArsdel"],
  ["Bridgepointe", "Lakeside"],
  ["YC Founders", "Accelerator Founders"],
  ["One Firefly", "Blue Yonder"],
  ["SURG Group", "Margies Travel"],
  ["Dynamic CX", "Litware"],
  ["OneVision", "Humongous"],
  ["Portstone", "Southridge"],
  ["bananaz.ai", "bluewave.io"],
  ["banaza.ai", "bluewave.io"],
  ["CallBlitz", "Contoso"],
  ["NavSense", "Trey Research"],
  ["ClearPath", "Clearway"],
  ["Landbase", "Northstar"],
  ["Precoro", "Wingtip"],
  ["OffDeal", "Alpine Ski"],
  ["marpipe", "Fourth Coffee"],
  ["Flarion", "Woodgrove"],
  ["WiseBee", "Bellows"],
  ["Zaro ai", "Zenith AI"],
  ["Clustr", "Tailspin"],
  ["Audacy", "Fabrikam"],
  ["Arbor", "Redmond"],
  ["Throxy", "Nod Publishers"],
  ["TitanX", "Lucerne"],
  ["Rooost", "Coho Vineyard"],
  ["GetRev", "GrowthCo"],
  ["Valar", "Consolidated Messenger"],
  ["Day10", "Adventure Works"],
  ["Vibe.us", "Wide World"],
  ["Ceros", "Harbor"],
  ["Vibe", "Wide World"],
  ["Vev", "Munsons"],
  ["Darry", "Sam"],
  ["Rama", "Jordan"],
  ["Cody", "Jordan"],
  ["Ryan", "Alex"],
  ["Tony", "Chris"],
  // Tenant ids, which identify the FrontSpin accounts themselves.
  ["20151", "100150"],
  ["20438", "100151"],
  // This sandbox's portal is named for the tenant, not the product.
  ["Client Portal", "EasyCRM"],
];

const cfg = config();
const { browser, ctx } = await launch();
const page = await ctx.newPage();
const done = [];
const failed = [];

const EXTRA = { rebrandExtra: FRONTSPIN_IDENTITIES };

async function shot(id, opts = {}) {
  try {
    await shoot(page, RAW, id, { ...EXTRA, ...opts });
    done.push(id);
    console.log("  ok   " + id);
  } catch (e) {
    failed.push([id, String(e).split("\n")[0].slice(0, 160)]);
    console.log("  FAIL " + id + "  " + String(e).split("\n")[0].slice(0, 160));
  }
}

/** Open an Admin Console tab by its data-tab key. */
async function adminTab(key) {
  await gotoTab(page, cfg, "Admin");
  await page.locator(`[data-tab="${key}"]`).first().click();
  await settle(page, 3000);
}

try {
  await signIn(page, cfg, "superadmin");

  /* ---------------------------------------------------------- List Mappings */
  await adminTab("listmappings");
  await shot("frontspin/list-mappings-choose");

  /*
   * The company control is an SLDS FAUX combobox: a <button> carrying role="combobox", with a
   * sibling .slds-listbox that is empty until it is opened. getByRole("button") therefore never
   * matches it - the role is combobox, not button - which is why this is selected by class.
   */
  const COMBO = "button.slds-combobox__input";
  /*
   * Options are <lightning-base-combobox-item role="option">, and their LABEL lives inside the
   * item's OWN shadow root - the element's innerHTML is empty. allTextContents() therefore
   * returns a list of empty strings, so options are chosen by INDEX and the resulting label is
   * read back off the combobox button afterwards.
   */
  const OPTION = "[role=option]";

  const openCombo = async () => {
    await page.locator(COMBO).first().click();
    await settle(page, 1200);
  };

  await openCombo();
  await shot("frontspin/list-mappings-company-picker");

  // Choose the company that actually has mappings; the others render an empty state.
  const count = await page.locator(OPTION).count();
  console.log("  companies offered: " + count);

  let chosen = null;
  for (let i = 0; i < count; i++) {
    if (!(await page.locator(OPTION).count())) await openCombo();
    await page.locator(OPTION).nth(i).click();
    await settle(page, 4500);
    chosen = (await page.locator(COMBO).first().innerText()).trim();
    const empty = await page.getByText(/No mappings yet|Choose a company above/i).count();
    console.log(`  "${chosen}" -> ${empty ? "empty" : "has mappings"}`);
    if (!empty) break;
  }
  await shot("frontspin/list-mappings-chosen", { tall: true });

  // What this screen offers once a company is resolved - logged so a missing shot below is
  // obviously a missing control rather than a missing selector.
  console.log(
    "  controls: " +
      JSON.stringify(
        (await page.locator("button:visible").allTextContents())
          .map((t) => t.trim())
          .filter((t) => t && t.length < 30)
      )
  );

  // The New-mapping dialog, photographed and then dismissed. NEVER saved.
  try {
    // The button reads "+ New Mapping", so an anchored /^New/ never matches it.
    await page.locator("button:visible").filter({ hasText: /New Mapping/i }).first().click();
    await settle(page, 2500);
    await shot("frontspin/list-mappings-new");

    // The FrontSpin list picker inside the dialog - this is the control the catalogue feeds.
    try {
      const combos = page.locator(`${COMBO}:visible`);
      const n = await combos.count();
      if (n > 1) {
        await combos.nth(n - 1).click();
        await settle(page, 1500);
        await shot("frontspin/list-mappings-list-picker");
        await page.keyboard.press("Escape");
        await settle(page, 600);
      }
    } catch {
      /* the list picker may be a plain input on this build */
    }

    for (const label of [/^Cancel$/i, /^Close$/i]) {
      const b = page.locator("button:visible").filter({ hasText: label }).first();
      if (await b.count()) {
        await b.click();
        break;
      }
    }
    await page.keyboard.press("Escape");
    await settle(page, 1200);
  } catch (e) {
    console.log("  (no New dialog: " + String(e).split("\n")[0].slice(0, 90) + ")");
  }

  // "Refresh lists" asks FrontSpin for the current catalogue. Photographed, not clicked - it
  // writes FrontSpin_List__c rows, and this capture stays read-only.
  try {
    const r = page.locator("button:visible").filter({ hasText: /Refresh lists/i }).first();
    if (await r.count()) {
      await r.scrollIntoViewIfNeeded();
      await shot("frontspin/list-mappings-refresh");
    }
  } catch {
    /* no refresh control on this build */
  }

  /* ------------------------------------------------------ FrontSpin health */
  await adminTab("apiusage");
  try {
    await page.getByRole("button", { name: /FrontSpin sync health/i }).first().click();
    await settle(page, 3500);
  } catch {
    /* toggle absent - the shot below will show why */
  }
  await shot("frontspin/sync-health");

  /* ------------------------------------------------------- Company tenant */
  await adminTab("companies");
  await shot("frontspin/companies");
  try {
    await page.getByRole("button", { name: /^Edit$/i }).first().click();
    await settle(page, 2500);
    await shot("frontspin/company-tenant");
    for (const label of [/Cancel/i, /Close/i]) {
      const b = page.getByRole("button", { name: label }).first();
      if (await b.count()) {
        await b.click();
        break;
      }
    }
    await page.keyboard.press("Escape");
  } catch {
    /* no editable company */
  }
} catch (e) {
  console.error("FATAL: " + e);
  try {
    await page.screenshot({ path: path.join(RAW, "_frontspin-fatal.png") });
  } catch {}
} finally {
  await browser.close();
  console.log(`\n${done.length} captured, ${failed.length} failed`);
  for (const [id, why] of failed) console.log(`  ${id}: ${why}`);
}
