/*
 * The deep screens: the builders, the layout editor, sharing, and everything else that sits
 * behind a click or two rather than behind a #tab= route.
 *
 * The first manifest only covered what a tab URL could reach, which is why the report
 * builder, the dashboard builder and the page-layout editor were all missing. Control names
 * here were read off the running portal by shots/discover2.mjs.
 */
import { settle } from "./portal.mjs";
import {
  byName,
  openList,
  openRecord,
  openAdminTab,
  openReportBuilder,
  openDashboardBuilder,
  openLayoutEditor,
} from "./nav.mjs";

const shots = [];
const add = (s) => shots.push(s);

const REPORT = "Summary Activity Report";
const DASHBOARD = "Calling Dashboard Test";

/* ------------------------------------------------------------------ Wave F
 * The report builder.
 */

add({ id: "report-builder/overview", wave: "F", setup: openReportBuilder(REPORT) });
add({ id: "report-builder/overview-full", wave: "F", opts: { tall: true }, setup: openReportBuilder(REPORT) });

const BUILDER_CONTROLS = [
  ["column-actions", "Column actions"],
  ["chart-properties", "Chart properties"],
  ["save-options", "Save options"],
];
for (const [slug, control] of BUILDER_CONTROLS) {
  add({
    id: `report-builder/${slug}`,
    wave: "F",
    setup: async (page, h) => {
      await openReportBuilder(REPORT)(page, h);
      await byName(page, control).click();
      await settle(page, 2200);
    },
  });
}

/*
 * "Add column…" and "Add group…" are <input> elements with those PLACEHOLDERS, not buttons -
 * byName finds nothing. There are also two group adders, distinguished only by data-adder:
 * grow = group rows, gcol = group columns. They are different features, so they get a shot
 * each rather than one ambiguous "add a group".
 */
for (const [slug, sel] of [
  ["add-column", 'input[data-adder="col"]'],
  ["group-rows", 'input[data-adder="grow"]'],
  ["group-columns", 'input[data-adder="gcol"]'],
]) {
  add({
    id: `report-builder/${slug}`,
    wave: "F",
    setup: async (page, h) => {
      await openReportBuilder(REPORT)(page, h);
      await page.locator(sel).first().click();
      await settle(page, 2200);
    },
  });
}

add({
  id: "report-builder/filters",
  wave: "F",
  setup: async (page, h) => {
    await openReportBuilder(REPORT)(page, h);
    await page.locator('[data-tab="filters"]').first().click();
    await settle(page, 2200);
  },
});

add({
  id: "report-builder/outline",
  wave: "F",
  setup: async (page, h) => {
    await openReportBuilder(REPORT)(page, h);
    await page.locator('[data-tab="outline"]').first().click();
    await settle(page, 2200);
  },
});

/* Choosing a report type - the first thing a new report asks. */
add({
  id: "report-builder/new-report",
  wave: "F",
  setup: async (page, h) => {
    const { gotoTab } = await import("./portal.mjs");
    await gotoTab(page, h.cfg, "Reports");
    await byName(page, "New Report").click();
    await settle(page, 4500);
  },
});

add({
  id: "report-builder/report-types",
  wave: "F",
  setup: async (page, h) => {
    const { gotoTab } = await import("./portal.mjs");
    await gotoTab(page, h.cfg, "Reports");
    await byName(page, "New Report").click();
    await settle(page, 4500);
    const box = page.getByPlaceholder("Search Report Types...").first();
    if (await box.count()) {
      await box.click();
      await box.fill("Account");
      await settle(page, 2000);
    }
  },
});

add({
  id: "report-builder/change-report-type",
  wave: "F",
  setup: async (page, h) => {
    await openReportBuilder(REPORT)(page, h);
    const b = byName(page, "Change Report Type");
    if (await b.count()) {
      await b.click();
      await settle(page, 2500);
    }
  },
});

/* ------------------------------------------------------------------ Wave G
 * The dashboard builder.
 */

add({ id: "dashboard-builder/overview", wave: "G", setup: openDashboardBuilder(DASHBOARD) });
add({
  id: "dashboard-builder/overview-full",
  wave: "G",
  opts: { tall: true },
  setup: openDashboardBuilder(DASHBOARD),
});

for (const [slug, control] of [
  ["add-widget", "+ Widget"],
  ["add-filter", "+ Filter"],
  ["properties", "Properties"],
  ["save-as", "Save As"],
]) {
  add({
    id: `dashboard-builder/${slug}`,
    wave: "G",
    setup: async (page, h) => {
      await openDashboardBuilder(DASHBOARD)(page, h);
      await byName(page, control).click();
      await settle(page, 2500);
    },
  });
}

add({
  id: "dashboard-builder/edit-filter",
  wave: "G",
  setup: async (page, h) => {
    await openDashboardBuilder(DASHBOARD)(page, h);
    const b = byName(page, "Edit filter");
    if (await b.count()) {
      await b.click();
      await settle(page, 2500);
    }
  },
});

/* ------------------------------------------------------------------ Wave H
 * Page layouts, records, sharing, and the admin screens that were only skimmed.
 */

add({ id: "layout/editor", wave: "H", setup: openLayoutEditor("Account") });
add({ id: "layout/editor-full", wave: "H", opts: { tall: true }, setup: openLayoutEditor("Account") });

add({
  id: "layout/add-section",
  wave: "H",
  setup: async (page, h) => {
    await openLayoutEditor("Account")(page, h);
    await byName(page, "Add Section").click();
    await settle(page, 2000);
  },
});

/*
 * "Add related list…" is a COMBOBOX button - its visible text is the placeholder value, not
 * an accessible name, so getByRole("button", { name }) never matches it. Filter the combobox
 * buttons by their text instead; there are two on this screen and only one is this.
 */
add({
  id: "layout/add-related-list",
  wave: "H",
  setup: async (page, h) => {
    await openLayoutEditor("Account")(page, h);
    await page.locator("button.slds-combobox__input", { hasText: "Add related list" }).first().click();
    await settle(page, 2200);
  },
});

add({
  id: "layout/search-fields",
  wave: "H",
  setup: async (page, h) => {
    await openLayoutEditor("Account")(page, h);
    const box = page.getByPlaceholder("Search fields…").first();
    await box.click();
    await box.fill("Billing");
    await settle(page, 1500);
  },
});

add({
  id: "records/change-owner",
  wave: "H",
  setup: async (page, h) => {
    await openRecord("Account")(page, h);
    await byName(page, "Change Owner").click();
    await settle(page, 2500);
  },
});

add({
  id: "records/activities-view-all",
  wave: "H",
  setup: async (page, h) => {
    await openRecord("Account")(page, h);
    await page.getByText("View All", { exact: false }).first().click();
    await settle(page, 2500);
  },
});

add({
  id: "records/new-event",
  wave: "H",
  setup: async (page, h) => {
    await openRecord("Account")(page, h);
    await byName(page, "New Event").click();
    await settle(page, 2000);
  },
});

add({
  id: "records/new-task",
  wave: "H",
  setup: async (page, h) => {
    await openRecord("Account")(page, h);
    await byName(page, "New Task").click();
    await settle(page, 2000);
  },
});

add({
  id: "records/email",
  wave: "H",
  setup: async (page, h) => {
    await openRecord("Account")(page, h);
    await byName(page, "Email").click();
    await settle(page, 2000);
  },
});

/* Sharing has several panels behind one tab. */
for (const [slug, label] of [
  ["org-wide-defaults", "Org-Wide Defaults"],
  ["sharing-rules", "Sharing Rules"],
  ["public-groups", "Public Groups"],
  ["roles", "Roles"],
  ["restriction-rules", "Restriction Rules"],
  ["record-access", "Record Access"],
]) {
  add({
    id: `admin/sharing-${slug}`,
    wave: "H",
    setup: async (page, h) => {
      await openAdminTab("sharing")(page, h);
      await page.getByText(label, { exact: false }).first().click();
      await settle(page, 2500);
    },
  });
}

/* Analytics: folders, properties and export. */
add({
  id: "analytics/export",
  wave: "H",
  setup: async (page, h) => {
    const { gotoTab } = await import("./portal.mjs");
    await gotoTab(page, h.cfg, "Reports");
    await page.getByText(REPORT, { exact: false }).first().click();
    await settle(page, 7000);
    await byName(page, "Export").click();
    await settle(page, 2200);
  },
});

add({
  id: "analytics/report-filters-panel",
  wave: "H",
  setup: async (page, h) => {
    const { gotoTab } = await import("./portal.mjs");
    await gotoTab(page, h.cfg, "Reports");
    await page.getByText(REPORT, { exact: false }).first().click();
    await settle(page, 7000);
    await byName(page, "Filters").click();
    await settle(page, 2200);
  },
});

add({
  id: "analytics/edit-properties",
  wave: "H",
  setup: async (page, h) => {
    const { gotoTab } = await import("./portal.mjs");
    await gotoTab(page, h.cfg, "Reports");
    await page.getByText(REPORT, { exact: false }).first().click();
    await settle(page, 7000);
    const b = byName(page, "Edit Properties");
    if (await b.count()) {
      await b.click();
      await settle(page, 2200);
    }
  },
});

/* The list's New-record window, which is also what a record type picker appears in. */
add({
  id: "records/new-window",
  wave: "H",
  setup: async (page, h) => {
    await openList("Account")(page, h);
    await byName(page, "New").click();
    await settle(page, 2500);
  },
});

export default shots;

/* ------------------------------------------------------------------ Wave I
 * Admin screens that are EMPTY until you choose something, plus the panels inside
 * Branding. Capturing them in their resting state documents a blank page.
 */

add({
  id: "admin/permissions-chosen",
  wave: "I",
  opts: { tall: true },
  setup: async (page, h) => {
    await openAdminTab("perms")(page, h);
    /*
     * Permissions is per USER, not per role, and the page is blank until one is chosen.
     * The picker is a Lightning combobox - a button plus a listbox - not a native <select>,
     * so selectOption() silently does nothing and the shot captures the empty page.
     */
    await page.getByText("Select a user", { exact: false }).first().click();
    await settle(page, 1200);
    await page
      .locator('[role="option"], lightning-base-combobox-item, li[data-value]')
      .first()
      .click();
    await settle(page, 3500);
  },
});

add({
  id: "admin/list-mappings-chosen",
  wave: "I",
  opts: { tall: true },
  setup: async (page, h) => {
    await openAdminTab("listmappings")(page, h);
    // Also a Lightning combobox - see the note on admin/permissions-chosen.
    await page.getByText("Choose a company", { exact: false }).first().click();
    await settle(page, 1200);
    await page
      .locator('[role="option"], lightning-base-combobox-item, li[data-value]')
      .first()
      .click();
    await settle(page, 3500);
  },
});

for (const [slug, label] of [
  ["name-logo", "Name & Logo"],
  ["colour-theme", "Color Theme"],
  ["navigation", "Navigation"],
  ["login-page", "Login Page"],
  ["login-design", "Login Design"],
]) {
  add({
    id: `admin/branding-${slug}`,
    wave: "I",
    opts: { tall: true },
    setup: async (page, h) => {
      await openAdminTab("branding")(page, h);
      await page.getByText(label, { exact: false }).first().click();
      await settle(page, 2800);
    },
  });
}

add({
  id: "admin/api-set-up-access",
  wave: "I",
  setup: async (page, h) => {
    await openAdminTab("apiint")(page, h);
    await byName(page, "Set up API access").click();
    await settle(page, 2500);
  },
});

add({
  id: "admin/audit-log-filter",
  wave: "I",
  setup: async (page, h) => {
    await openAdminTab("audit")(page, h);
    const sel = page.locator("select").first();
    if (await sel.count()) await sel.click();
    await settle(page, 1800);
  },
});

/* ------------------------------------------------------------------ Wave J
 * Admin record scope - three modes deciding what every Admin can see. The control sits
 * well down the Users tab, inside "Who manages whom", which is why it was never captured.
 */

add({
  id: "admin/users-hierarchy",
  wave: "J",
  opts: { tall: true },
  setup: async (page, h) => {
    await openAdminTab("users")(page, h);
    await page.getByText("Who manages whom", { exact: false }).first().scrollIntoViewIfNeeded();
    await settle(page, 2000);
  },
});

add({
  id: "admin/admin-scope-mode",
  wave: "J",
  setup: async (page, h) => {
    await openAdminTab("users")(page, h);
    const box = page.locator(".pa-hier-scope").first();
    await box.scrollIntoViewIfNeeded();
    await settle(page, 1200);
    // Lightning combobox: click it open so all three options are visible.
    await box.click();
    await settle(page, 1500);
  },
});

add({
  id: "admin/login-as-scope",
  wave: "J",
  setup: async (page, h) => {
    await openAdminTab("users")(page, h);
    await page.getByText("Who may log in as portal users", { exact: false }).first().scrollIntoViewIfNeeded();
    await settle(page, 1800);
  },
});
