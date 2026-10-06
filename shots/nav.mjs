/*
 * Shared navigation helpers.
 *
 * Every one of these encodes something that cost a capture run to learn. They live here so
 * both manifests use the same logic and nobody re-derives it.
 */
import { gotoTab, settle } from "./portal.mjs";

/** Click a control by the name it shows on screen. */
export const byName = (page, name) =>
  page.getByRole("button", { name, exact: false }).or(page.getByTitle(name)).first();

/*
 * Open a list on its "All ..." view.
 *
 * A tab opens on "Recently Viewed", which on a cold session is EMPTY - the portal has no
 * history yet. Capturing that gives an empty table, and any shot that then clicks a row has
 * nothing to click. It only appears to work when an earlier shot happened to visit records
 * first, which makes the whole run order-dependent.
 */
export const openList = (api) => async (page, h) => {
  await gotoTab(page, h.cfg, api);

  // Addressed by class, not by the name it shows: that name is whichever view is selected,
  // which differs per object.
  await page.locator("button.portal-viewsel").first().click();
  await settle(page, 1200);

  // li.pvm-item is a real option. li.pvm-SEP is a heading - and it reads "All Other Lists",
  // so a plain /^All / text match picks the separator, which does nothing when clicked.
  const all = page.locator("li.pvm-item").filter({ hasText: /^All / }).first();
  if (await all.count()) await all.click();
  else await page.keyboard.press("Escape");

  /*
   * "tbody a", not "td a" and not "tr a". Measured on a loaded Accounts list:
   * td a = 0, th a = 207, tr a = 207, tbody a = 200.
   *
   * td a is 0 because the name column is a <th scope="row">. tr a also matches the seven
   * header sort links, and the first of THOSE is what .first() returns - clicking it
   * re-sorts the list instead of opening a record, so the shot captures the list and
   * reports success. ":visible" guards against off-screen rows that are skipped for layout.
   */
  await page.locator("tbody a:visible").first().waitFor({ state: "visible", timeout: 60_000 });
  await settle(page, 1800);
};

/** Open a list, then its first record. Row hrefs are javascript:void(0) - it must be clicked. */
export const openRecord = (api) => async (page, h) => {
  await openList(api)(page, h);
  await page.locator("tbody a:visible").first().click();
  await settle(page, 4000);
};

/** Open one Admin Console tab. data-tab, because "Home" and "List Mappings" also name main tabs. */
export const openAdminTab = (key) => async (page, h) => {
  await gotoTab(page, h.cfg, "Admin");
  await page.locator(`[data-tab="${key}"]`).first().click();
  await settle(page, 2500);
};

/** Open a saved report, then its builder. */
export const openReportBuilder = (reportName) => async (page, h) => {
  await gotoTab(page, h.cfg, "Reports");
  await page.getByText(reportName, { exact: false }).first().click();
  await settle(page, 7000);
  await byName(page, "Edit").click();
  await settle(page, 7000);
};

/** Open a saved dashboard, then its builder. */
export const openDashboardBuilder = (name) => async (page, h) => {
  await gotoTab(page, h.cfg, "Dashboards");
  await page.getByText(name, { exact: false }).first().click();
  await settle(page, 8000);
  await byName(page, "Edit").click();
  await settle(page, 7000);
};

/** The layout editor, reached from a record. */
export const openLayoutEditor = (api) => async (page, h) => {
  await openRecord(api)(page, h);
  await byName(page, "Edit Page Layout").click();
  await settle(page, 3500);
};
