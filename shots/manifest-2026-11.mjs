/*
 * The November 2026 shot list: the SHOT / SHOT-RETAKE markers added when the pages were brought up
 * to code b65e2bb (layout builder, report auto-sync, publish schedule settings, date ranges,
 * Regenerate keys, matrix headers, dashboard filter "None").
 *
 * Same entry shape as manifest-2026-10.mjs - id, setup, opts, after, sf. Every shot here only
 * LOOKS: nothing is saved, submitted, synced, published, regenerated or deleted, and no switch is
 * changed. The org already had what these screens need (layout builder on, auto-sync on, two
 * layouts arranged in the builder, an API key, reports added by auto-sync), checked read-only
 * before the run. Where a shot opens a builder or a dialog, `after` cancels it.
 *
 * Markers left open on purpose (each needs a change to the org, or data it does not have):
 * api-regenerate-keys (would replace the org's only API secret), junction-related-list (no
 * junction object), list-button-flow-page (no List page flow button), sync-formulas-activity-row
 * and sync-toast-unmapped-columns (would run a sync), saved-by-someone-else (needs two saves),
 * tile-cannot-display (needs a saved filter setting), report-matrix-details-pane (no matrix in the
 * org is under the 2,000 rows Detail Rows allows any more, so no Details pane can be opened), and
 * publish-schedule-not-installed (its banner shows only while the automatic check is stopped; the
 * entry below fails rather than capture the tab without it).
 *
 *   node shots/capture-2026-11.mjs --only layout-builder/
 */
import { gotoTab, settle } from "./portal.mjs";
import { byName, openList, openRecord, openAdminTab, openLayoutEditor } from "./nav.mjs";
import october from "./manifest-2026-10.mjs";

const shots = [];
const add = (s) => shots.push(s);
const NS = "EasyCRM__";

/** Re-use an October shot as it is (same screen, same set-up; only the UI on it changed). */
const reuse = (id) => {
  const s = october.find((x) => x.id === id);
  if (!s) throw new Error(`October manifest has no ${id}`);
  add(s);
};

/** Scroll the admin page so `text` sits at the top, under the fixed shell. */
async function scrollToText(page, text) {
  await page.getByText(text, { exact: true }).first().evaluate((el) => el.scrollIntoView({ block: "start" }));
  await page.evaluate(() => { const c = document.querySelector(".content"); if (c) c.scrollTop = Math.max(0, c.scrollTop - 70); }).catch(() => {});
  await page.waitForTimeout(800);
}

/** Cancel whatever dialog is open. */
async function cancelDialog(page) {
  for (let i = 0; i < 2; i++) {
    const c = page.getByRole("button", { name: /^(Cancel|Close)$/ }).filter({ visible: true });
    if (!(await c.count())) break;
    await c.last().click({ timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(500);
  }
}

/* ------------------------------------------------------------------ admin console */

// The API key list: the row action now reads "Regenerate keys".
add({
  id: "admin/api-integration",
  setup: async (page, h) => {
    await openAdminTab("apiint")(page, h);
    await page.getByRole("button", { name: "Regenerate keys" }).first().waitFor({ timeout: 60_000 });
    await settle(page, 1200);
  },
});

// The whole Publish Schedule tab: auto-sync card, the settings block, then the report table.
// The tab as it opens, in the normal window. The whole tab runs to ~60 scheduled reports, far too
// tall to read under the site's 560 px image cap; the settings block and the auto-sync card have
// their own close-ups below.
add({
  id: "admin/publish-schedule",
  setup: async (page, h) => {
    await openAdminTab("pubsched")(page, h);
    await page.getByText("Auto-sync new Salesforce reports", { exact: true }).first().waitFor({ timeout: 60_000 });
    await settle(page, 2500);
  },
});

// The warning banner shows only while the automatic check is stopped. If it is not showing, the
// shot fails rather than capturing a page without it.
add({
  id: "admin/publish-schedule-not-installed",
  setup: async (page, h) => {
    await openAdminTab("pubsched")(page, h);
    const banner = page.getByText(/Automatic publishing is not checking right now/).first();
    await banner.waitFor({ state: "visible", timeout: 20_000 });
    await settle(page, 1500);
  },
});

add({
  id: "admin/publish-schedule-settings",
  opts: { selector: '.cfg:has-text("Check for due reports")' },
  setup: async (page, h) => {
    await openAdminTab("pubsched")(page, h);
    await page.locator('.cfg:has-text("Check for due reports")').first().waitFor({ state: "visible", timeout: 60_000 });
    await settle(page, 2000);
  },
});

add({
  id: "admin/auto-sync-panel",
  opts: { selector: ".as-wrap" },
  setup: async (page, h) => {
    await page.setViewportSize({ width: 1440, height: 2600 });
    await openAdminTab("pubsched")(page, h);
    await page.locator(".as-wrap").first().waitFor({ state: "visible", timeout: 60_000 });
    await settle(page, 2500);
  },
  after: async (page) => { await page.setViewportSize({ width: 1440, height: 900 }); },
});

// The Super Admin panels below the user list, now five of them (a taller window).
add({
  id: "admin/users-super-admin-panels",
  setup: async (page, h) => {
    await openAdminTab("users")(page, h);
    await page.setViewportSize({ width: 1440, height: 1310 }); // ends under "Page layout editor", above the user tree
    await settle(page, 800);
    await scrollToText(page, "Log in as user");
  },
  after: async (page) => { await page.setViewportSize({ width: 1440, height: 900 }); },
});

/* ------------------------------------------------------------------ layout builder */

add({
  id: "layout-builder/switch",
  opts: { selector: '.pa-hier:has-text("Page layout editor")' },
  setup: async (page, h) => {
    await openAdminTab("users")(page, h);
    await scrollToText(page, "Page layout editor");
  },
});

const builderOpen = (api) => async (page, h) => {
  await openLayoutEditor(api)(page, h);
  await page.locator(".pb-root").first().waitFor({ state: "visible", timeout: 60_000 });
  await settle(page, 3000);
};
/** Leave the builder without saving (nothing here changes it; Cancel asks only when it would). */
async function leaveLayoutBuilder(page) {
  await cancelDialog(page);
  const c = page.locator(".pb-head").getByRole("button", { name: "Cancel", exact: true }).filter({ visible: true });
  if (await c.count()) await c.first().click({ timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(800);
  const discard = page.getByRole("button", { name: /Discard|Leave/ }).filter({ visible: true });
  if (await discard.count()) await discard.first().click({ timeout: 4000 }).catch(() => {});
  await settle(page, 1500);
}

/** The builder from one record (Edit Page Layout opens the builder while the switch is on). */
const builderOnRecord = (api, id) => async (page, h) => {
  await gotoHash(page, h.cfg, `tab=${api}&obj=${api}&rec=${id}`);
  await settle(page, 2500);
  await byName(page, "Edit Page Layout").click();
  await page.locator(".pb-root").first().waitFor({ state: "visible", timeout: 60_000 });
  await settle(page, 3000);
};

add({
  id: "layout-builder/overview",
  setup: (page, h) => builderOnRecord("Account", NAME45)(page, h),
  after: leaveLayoutBuilder,
});

// Fields tab opened into Account Name, and an account field already on the page selected.
add({
  id: "layout-builder/lookup-fields",
  setup: async (page, h) => {
    await builderOpen("Contact")(page, h);
    await page.locator('[data-kind="field"][data-name="AccountId"] .pb-pal-drill').first().click();
    await page.locator(".pb-crumbs").first().waitFor({ state: "visible", timeout: 30_000 });
    await settle(page, 1500);
    // data-item is the section's id, not the field: pick the account field by the value it shows
    // (the account's record type, "Partner", placed in the first section).
    const placed = page.locator("[data-cell]").filter({ hasText: "Partner" }).first();
    await placed.scrollIntoViewIfNeeded();
    await placed.click();
    await settle(page, 1200);
    await page.mouse.move(700, 880);
  },
  after: leaveLayoutBuilder,
});

// The header (Highlights Panel) selected: its fields and buttons in the properties.
add({
  id: "layout-builder/highlights-panel",
  setup: async (page, h) => {
    await builderOpen("Contact")(page, h);
    await page.locator(".pb-rec-name").first().click();
    await page.getByText("Highlights Panel", { exact: true }).first().waitFor({ timeout: 15_000 });
    await settle(page, 1200);
    await page.mouse.move(700, 880);
  },
  after: leaveLayoutBuilder,
});

// Change template, step one, with a template picked (not applied: the dialog is cancelled).
add({
  id: "layout-builder/templates",
  setup: async (page, h) => {
    await builderOnRecord("Account", NAME45)(page, h);
    await page.locator(".pb-props").getByRole("button", { name: "Change", exact: true }).first().click();
    await page.getByText("Select a new template", { exact: true }).first().waitFor({ timeout: 15_000 });
    await page.locator(".pb-tpl-list button").filter({ hasText: "Header and Right Sidebar" }).first().click();
    await settle(page, 1000);
  },
  after: leaveLayoutBuilder,
});

/* ------------------------------------------------------------------ record pages */

// A Contact page as the builder arranged it (fields under the name, fields from the account).
add({
  id: "records/arranged-page",
  setup: async (page, h) => {
    await openRecord("Contact")(page, h);
    await settle(page, 2500);
  },
});

/** A hash route, with a real reload (changing only the hash does not reload the app). */
async function gotoHash(page, cfg, hash) {
  await page.goto(`${cfg.portal}#${hash}`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.reload({ waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.locator("button.userbtn").waitFor({ state: "visible", timeout: 90_000 });
  await settle(page, 2500);
}
const NAME45 = "001HF00000OUd28YAD"; // the "Name 45" account the October shots use

// Clone from the record's header: the window opens filled from the record; it is then cancelled.
add({
  id: "records/clone-window",
  setup: async (page, h) => {
    await gotoHash(page, h.cfg, `tab=Account&obj=Account&rec=${NAME45}`);
    await settle(page, 3000);
    await page.getByRole("button", { name: "Clone", exact: true }).first().click();
    await page.getByText(/^Clone /).first().waitFor({ timeout: 30_000 });
    await settle(page, 2500);
  },
  after: cancelDialog,
});

/* ------------------------------------------------------------------ reports and dashboards */

// A new (never saved) Contacts report, Filters tab: Created Date, Current FY, the list open.
add({
  id: "report-builder/date-range-picker",
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Reports");
    await page.getByRole("button", { name: "New Report" }).click();
    await settle(page, 3000);
    await page.getByPlaceholder("Search Report Types...").first().fill("Contacts");
    await settle(page, 1200);
    await page.locator(".rtp-rows > div").filter({ has: page.locator(".rtp-row-name", { hasText: /^Contacts$/ }) }).first().click();
    await page.getByRole("button", { name: "Start Report" }).click();
    await page.locator('[data-tab="filters"]').waitFor({ timeout: 60_000 });
    await settle(page, 3000);
    await page.locator('[data-tab="filters"]').click();
    await settle(page, 1200);
    const rows = page.locator(".rb-stdf-row");
    await rows.filter({ hasText: "Date Field" }).locator("button.slds-combobox__input").first().click();
    await page.locator("[role=option]:visible").filter({ hasText: /^Created Date$/ }).first().click();
    await settle(page, 1200);
    const range = rows.filter({ hasText: "Range" }).locator("button.slds-combobox__input").first();
    await range.click();
    await page.locator("[role=option]:visible").filter({ hasText: /^Current FY/ }).first().click();
    await settle(page, 1200);
    await range.click(); // open again: the list, with Current FY chosen and its days beside it
    await page.waitForTimeout(900);
  },
  after: async (page) => {
    await page.keyboard.press("Escape").catch(() => {});
    const close = page.getByRole("button", { name: "Close", exact: true }).filter({ visible: true });
    if (await close.count()) await close.first().click({ timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(1000);
    const discard = page.getByRole("button", { name: "Leave & Discard" });
    if (await discard.count()) await discard.first().click({ timeout: 4000 }).catch(() => {});
    await settle(page, 1500);
  },
});

reuse("dashboard-builder/add-filter-relative-date");

// The same Add Filter dialog, one report's Apply to Each Component set to None and the help text
// under the list in view. Cancelled with the builder, as the October shot is.
{
  const base = october.find((x) => x.id === "dashboard-builder/add-filter-relative-date");
  add({
    id: "dashboard-builder/filter-none-help",
    setup: async (page, h) => {
      await base.setup(page, h);
      await page.keyboard.press("Escape").catch(() => {}); // close the range list, keep the dialog
      await page.waitForTimeout(600);
      // Add the value (inside the dialog only - nothing is saved; the dialog is cancelled after).
      await page.getByRole("button", { name: "Apply", exact: true }).filter({ visible: true }).first().click();
      await settle(page, 1000);
      const selects = page.locator("select:visible").filter({ has: page.locator("option[value='']") });
      const n = await selects.count();
      if (n < 2) throw new Error(`Apply to Each Component lists ${n} report(s); the shot needs two`);
      // The first report gets a field; the second stays on "None".
      const first = await selects.first().evaluate((el) => ([...el.options].find((o) => o.value && /^Date$/.test(o.text.trim()))
        || [...el.options].find((o) => o.value && /Date/.test(o.text)))?.value || "");
      if (!first) throw new Error("the first report offers no field to map");
      await selects.first().selectOption(first);
      await selects.nth(n - 1).selectOption("");
      await settle(page, 1000);
      await page.getByText(/^As in Salesforce, a dashboard filter applies to every widget/).first()
        .evaluate((el) => el.scrollIntoView({ block: "end" }));
      await page.waitForTimeout(800);
    },
    after: base.after,
  });
}

/* ------------------------------------------------------------------ Salesforce side */

async function sfOpen(page, h, tab, marker) {
  await page.goto(`${h.sf.url}/lightning/n/${NS}${tab}`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    for (const f of page.frames()) {
      const t = await f.locator("body").innerText({ timeout: 3000 }).catch(() => "");
      if (t.includes(marker)) { await page.waitForTimeout(2500); return f; }
    }
    await page.waitForTimeout(1000);
  }
  throw new Error(`"${marker}" never appeared on ${tab}`);
}

// Portal Users -> Portal Reports: live reports, one carrying the "Added automatically" badge.
add({
  id: "sf/portal-reports-added-automatically",
  sf: true,
  setup: async (page, h) => {
    const f = await sfOpen(page, h, "Portal_Users", "Added automatically");
    await f.getByText("Portal Reports", { exact: true }).first().evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.mouse.move(800, 950);
    await page.waitForTimeout(1500);
  },
});

export default shots;
