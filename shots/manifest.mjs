/*
 * The shot list.
 *
 * One entry per screenshot. `setup` leaves the page on the screen to be captured; the runner
 * handles signing in, neutralising branding and taking the picture.
 *
 * Shots are grouped into waves so a wave can be captured and reviewed before the next is
 * attempted. A wrong assumption costs a handful of shots, not the whole set.
 *
 *   id      file name, and how a page refers to the image
 *   wave    A-E
 *   setup   async (page, h) => {}
 *   opts    { tall } to grow the viewport first, { selector } to capture one element
 *
 * Control names below were read off the running portal by shots/discover.mjs, not guessed.
 */
import { gotoTab, settle, openLogin } from "./portal.mjs";

/*
 * Admin Console tabs, in the order the console itself lists them.
 *
 *   [ file slug, visible label, data-tab key ]
 *
 * The third column is why this is a table and not a list of labels. Clicking by visible text
 * picks the wrong element for "Home" and "List Mappings", which also name tabs in the main
 * navigation - the click lands on the portal page and the shot silently captures the wrong
 * screen. data-tab survives LWC's compilation (unlike id) and is unique.
 */
export const ADMIN_TABS = [
  ["companies", "Companies", "companies"],
  ["users", "Users", "users"],
  ["permissions", "Permissions", "perms"],
  ["permission-sets", "Permission Sets", "permsets"],
  ["profiles", "Profiles", "profiles"],
  ["sharing", "Sharing", "sharing"],
  ["reports-dashboards", "Reports & Dashboards", "reports"],
  ["buttons", "Buttons", "buttons"],
  ["tabs", "Tabs", "navtabs"],
  ["branding", "Branding", "branding"],
  ["home", "Home", "homeadmin"],
  ["apps", "Apps", "apps"],
  ["audit-log", "Audit Log", "audit"],
  ["csv-import", "CSV Import", "csvimport"],
  ["list-mappings", "List Mappings", "listmappings"],
  ["api-integration", "API Integration", "apiint"],
  ["api-usage", "API Usage", "apiusage"],
  ["publish-schedule", "Publish Schedule", "pubsched"],
];

/*
 * Object tabs present in the shell.
 *
 *   [ file slug, visible label, API name ]
 *
 * #tab= takes the API NAME, not the label. "Accounts" renders "Unknown object: Accounts" and
 * an empty list, which reads as a data problem rather than a routing one. Task and Event only
 * appear to work because their label and API name are identical.
 */
export const OBJECT_TABS = [
  ["accounts", "Accounts", "Account"],
  ["contacts", "Contacts", "Contact"],
  ["task", "Task", "Task"],
  ["event", "Event", "Event"],
];

const shots = [];
const add = (s) => shots.push(s);

/** Click a control by the name it shows on screen. */
const byName = (page, name) =>
  page.getByRole("button", { name, exact: false }).or(page.getByTitle(name)).first();

/* ------------------------------------------------------------------ Wave A
 * Signing in, the shell, and home.
 */

add({ id: "login/sign-in", wave: "A", anonymous: true, setup: (p, h) => openLogin(p, h.cfg) });

add({
  id: "login/forgot-password",
  wave: "A",
  anonymous: true,
  setup: async (page, h) => {
    await openLogin(page, h.cfg);
    await page.getByText("Forgot password?", { exact: false }).first().click();
    await settle(page, 1200);
  },
});

add({
  id: "login/wrong-password",
  wave: "A",
  anonymous: true,
  setup: async (page, h) => {
    await openLogin(page, h.cfg);
    await page.getByPlaceholder("Enter your username").fill("admin");
    await page.getByPlaceholder("Enter your password").fill("not-the-password");
    await page.getByRole("button", { name: "Log In" }).click();
    await settle(page, 3000);
  },
});

add({ id: "home/overview", wave: "A", setup: (p, h) => gotoTab(p, h.cfg, "Home") });
add({ id: "home/full", wave: "A", opts: { tall: true }, setup: (p, h) => gotoTab(p, h.cfg, "Home") });

add({
  id: "shell/user-menu",
  wave: "A",
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Home");
    await page.locator("button.userbtn").first().click();
    await settle(page, 1200);
  },
});

add({
  id: "shell/view-settings",
  wave: "A",
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Home");
    await page.locator("button[title='View settings']").first().click();
    await settle(page, 1200);
  },
});

add({
  id: "shell/notifications",
  wave: "A",
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Home");
    await page.locator("button[title*='otification' i]").first().click();
    await settle(page, 1500);
  },
});

add({
  id: "shell/search",
  wave: "A",
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Home");
    const box = page.getByPlaceholder("Search...").first();
    await box.click();
    await box.fill("DDT Account 100");
    await settle(page, 3000);
  },
});

/* ------------------------------------------------------------------ Wave B
 * Lists and records.
 */

/*
 * Open a list on its "All ..." view.
 *
 * A tab opens on "Recently Viewed", which on a cold session is EMPTY - the portal has no
 * history to show yet. Capturing that gives an empty table and, worse, any shot that then
 * clicks a row has nothing to click and fails with a selector timeout that looks like a bad
 * selector. It only appears to work when an earlier shot happened to visit some records
 * first, which makes the whole run order-dependent.
 *
 * Switching to the All view fixes both, and a full list is what the documentation should be
 * showing anyway.
 */
const openList = (api) => async (page, h) => {
  await gotoTab(page, h.cfg, api);

  // The picker is addressed by its class, not by the name it currently shows: that name is
  // whichever view is selected, which is not the same on every object.
  await page.locator("button.portal-viewsel").first().click();
  await settle(page, 1200);

  /*
   * li.pvm-item is a real option. li.pvm-SEP is a heading - and the heading reads
   * "All Other Lists", so a plain text match on /^All / picks the separator, which sits
   * above the options in the DOM and does nothing when clicked. The list then never fills
   * and the failure surfaces much later, as a timeout waiting for a row.
   */
  const all = page.locator("li.pvm-item").filter({ hasText: /^All / }).first();

  if (await all.count()) {
    await all.click();
  } else {
    // No "All ..." view on this object: keep whatever view is selected.
    await page.keyboard.press("Escape");
  }

  /*
   * "tbody a", not "td a" and not "tr a".
   *
   * Measured on a loaded Accounts list: td a = 0, th a = 207, tr a = 207, tbody a = 200.
   *
   * td a is 0 because the name column is a <th scope="row"> - the SLDS convention for a
   * table's primary column. tr a is 207 because it also picks up the seven sort links in the
   * header row, and the FIRST of those is what .first() returns: clicking it re-sorts the
   * list instead of opening a record, so the shot captures the list and reports success.
   * tbody a is the 200 record links and nothing else.
   *
   * ":visible" guards the other half: off-screen rows are skipped for layout, so the first
   * match in DOM order is not necessarily one that has been painted.
   */
  await page.locator("tbody a:visible").first().waitFor({ state: "visible", timeout: 60_000 });
  await settle(page, 1800);
};

for (const [slug, , api] of OBJECT_TABS) {
  add({ id: `lists/${slug}`, wave: "B", setup: openList(api) });
  add({ id: `lists/${slug}-full`, wave: "B", opts: { tall: true }, setup: openList(api) });
}

/* Controls on a list, one shot each. All names came from the discovery pass. */
const LIST_CONTROLS = [
  ["new-record", "New"],
  ["choose-columns", "Select Fields to Display"],
  ["filters-panel", "Filter"],
  ["row-actions", "Show actions"],
  ["column-actions", "Show Account Name column actions"],
];

for (const [slug, control] of LIST_CONTROLS) {
  add({
    id: `lists/${slug}`,
    wave: "B",
    setup: async (page, h) => {
      await openList("Account")(page, h);
      await byName(page, control).click();
      await settle(page, 2000);
    },
  });
}

add({
  id: "lists/view-picker",
  wave: "B",
  setup: async (page, h) => {
    await openList("Account")(page, h);
    await page.locator("button.portal-viewsel").first().click();
    await settle(page, 1500);
  },
});

add({
  id: "lists/search-in-list",
  wave: "B",
  setup: async (page, h) => {
    await openList("Account")(page, h);
    const box = page.getByPlaceholder("Search this list...").first();
    await box.click();
    await box.fill("DDT Account 10");
    await settle(page, 2500);
  },
});

/** Open a list, then its first record. */
const openFirstRecord = (api) => async (page, h) => {
  await openList(api)(page, h);
  await page.locator("tbody a:visible").first().click();
  await settle(page, 4000);
};

for (const [slug, , api] of OBJECT_TABS) {
  add({ id: `records/${slug}-detail`, wave: "B", setup: openFirstRecord(api) });
  add({
    id: `records/${slug}-detail-full`,
    wave: "B",
    opts: { tall: true },
    setup: openFirstRecord(api),
  });
}

add({
  id: "records/edit",
  wave: "B",
  setup: async (page, h) => {
    await openFirstRecord("Account")(page, h);
    await byName(page, "Edit").click();
    await settle(page, 2000);
  },
});

/*
 * There is no generic "actions" control on a record. What a record offers is the activity
 * composer - Email, New Event, Log a Call, New Task - so that is what gets documented.
 */
add({
  id: "records/log-a-call",
  wave: "B",
  setup: async (page, h) => {
    await openFirstRecord("Account")(page, h);
    await page.getByRole("button", { name: "Log a Call", exact: false }).first().click();
    await settle(page, 2000);
  },
});

/* ------------------------------------------------------------------ Wave C
 * Reports and dashboards.
 */

add({ id: "analytics/reports-list", wave: "C", setup: (p, h) => gotoTab(p, h.cfg, "Reports") });
add({
  id: "analytics/reports-list-full",
  wave: "C",
  opts: { tall: true },
  setup: (p, h) => gotoTab(p, h.cfg, "Reports"),
});
add({ id: "analytics/dashboards-list", wave: "C", setup: (p, h) => gotoTab(p, h.cfg, "Dashboards") });

add({
  id: "analytics/new-report",
  wave: "C",
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Reports");
    await byName(page, "New Report").click();
    await settle(page, 3500);
  },
});

add({
  id: "analytics/new-folder",
  wave: "C",
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Reports");
    await byName(page, "New Folder").click();
    await settle(page, 1800);
  },
});

add({
  id: "analytics/report-viewer",
  wave: "C",
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Reports");
    await page.getByText("Summary Activity Report", { exact: false }).first().click();
    await settle(page, 6000);
  },
});

add({
  id: "analytics/report-viewer-full",
  wave: "C",
  opts: { tall: true },
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Reports");
    await page.getByText("Summary Activity Report", { exact: false }).first().click();
    await settle(page, 6000);
  },
});

add({
  id: "analytics/new-dashboard",
  wave: "C",
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Dashboards");
    await byName(page, "New Dashboard").click();
    await settle(page, 3500);
  },
});

add({
  id: "analytics/dashboard-viewer",
  wave: "C",
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Dashboards");
    await page.getByText("Calling Dashboard Test", { exact: false }).first().click();
    await settle(page, 8000);
  },
});

add({
  id: "analytics/dashboard-viewer-full",
  wave: "C",
  opts: { tall: true },
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Dashboards");
    await page.getByText("Calling Dashboard Test", { exact: false }).first().click();
    await settle(page, 8000);
  },
});

/* ------------------------------------------------------------------ Wave D
 * The Admin Console.
 */

add({ id: "admin/console", wave: "D", setup: (p, h) => gotoTab(p, h.cfg, "Admin") });

const openAdminTab = (key) => async (page, h) => {
  await gotoTab(page, h.cfg, "Admin");
  await page.locator(`[data-tab="${key}"]`).first().click();
  await settle(page, 2500);
};

for (const [slug, , key] of ADMIN_TABS) {
  add({ id: `admin/${slug}`, wave: "D", setup: openAdminTab(key) });
  add({ id: `admin/${slug}-full`, wave: "D", opts: { tall: true }, setup: openAdminTab(key) });
}

/* The modals an administrator actually works in. */
const ADMIN_MODALS = [
  ["new-user", "users", "New User"],
  ["assign-apps", "users", "Assign Apps"],
  ["assign-record-types", "users", "Assign Record Types"],
  ["console-tabs", "users", "Console Tabs"],
  ["new-company", "companies", "New Company"],
  ["new-permission-set", "permsets", "New Permission Set"],
  ["new-profile", "profiles", "New"],
];

for (const [slug, tab, control] of ADMIN_MODALS) {
  add({
    id: `admin/modal-${slug}`,
    wave: "D",
    setup: async (page, h) => {
      await openAdminTab(tab)(page, h);
      await byName(page, control).click();
      await settle(page, 2000);
    },
  });
}

/* ------------------------------------------------------------------ Wave E
 * Files, profile and settings.
 */

add({ id: "files/list", wave: "E", setup: (p, h) => gotoTab(p, h.cfg, "Files") });

for (const [slug, control] of [
  ["upload", "Upload Files"],
  ["all-files", "All Files"],
  ["owned-by-me", "Owned by Me"],
]) {
  add({
    id: `files/${slug}`,
    wave: "E",
    setup: async (page, h) => {
      await gotoTab(page, h.cfg, "Files");
      await byName(page, control).click();
      await settle(page, 2000);
    },
  });
}

add({ id: "profile/view", wave: "E", setup: (p, h) => gotoTab(p, h.cfg, "Profile") });
add({
  id: "profile/view-full",
  wave: "E",
  opts: { tall: true },
  setup: (p, h) => gotoTab(p, h.cfg, "Profile"),
});
add({ id: "settings/overview", wave: "E", setup: (p, h) => gotoTab(p, h.cfg, "Settings") });

add({
  id: "settings/change-password",
  wave: "E",
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Settings");
    await page.getByText("Change Password", { exact: false }).first().click();
    await settle(page, 1800);
  },
});

/*
 * The deep screens - builders, layout editor, sharing panels - live in their own file.
 * They are reached by clicking into a screen rather than by a #tab= route, which is exactly
 * why the first pass of this manifest missed them entirely.
 */
import deepShots from "./manifest-deep.mjs";

export default [...shots, ...deepShots];
