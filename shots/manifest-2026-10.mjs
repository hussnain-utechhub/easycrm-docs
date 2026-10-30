/*
 * The October 2026 shot list: the screenshots the pages ask for with <!-- SHOT: ... --> and
 * <!-- SHOT-RETAKE: ... --> markers (docs-research/shots-wanted.tsv).
 *
 * Same entry shape as manifest.mjs - id (image path without .png), setup, opts - plus one
 * addition: `after`, which the runner calls once the picture is taken (and also when a setup
 * fails) to put back anything the setup staged. Every shot here only LOOKS: nothing is saved,
 * submitted, shared, synced, published or deleted. Where a screen needs a staged state - inline
 * edits, a ticked dashboard filter value, an open dialog - `after` cancels it.
 *
 * Two browser-only devices are used, and neither touches the org:
 *   - list filters on "All <object>" live in the browser's localStorage (portalList.js applyFilter
 *     writes them there for the All/Recent scopes, never to the server). The shots that need a
 *     filtered "All Accounts" list seed that key directly and remove it again in `after`.
 *     Lightning Web Security namespaces the key, hence the LSKey[EasyCRM] prefix.
 *   - the session-timer screens count down against the BROWSER clock, so page.clock moves time
 *     forward in the browser only.
 *
 *   node shots/capture-2026-10.mjs --only lists/
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gotoTab, settle } from "./portal.mjs";
import { byName, openList, openAdminTab } from "./nav.mjs";

const shots = [];
const add = (s) => shots.push(s);

/* ------------------------------------------------------------------ helpers */

const LS = (k) => `LSKey[EasyCRM]${k}`;

/** Filters for "All <object>", as the list itself stores them after Save in the Filters panel. */
async function seedListFilters(page, api, specs, logic = "AND") {
  await page.evaluate(
    ([k, v]) => localStorage.setItem(k, v),
    [LS(`mh_portal_filters::${api}`), JSON.stringify({ logic, specs })]
  );
}
async function clearListFilters(page, api) {
  await page.evaluate((k) => localStorage.removeItem(k), LS(`mh_portal_filters::${api}`)).catch(() => {});
}

/** "All <object>" with no browser-held filters, whatever an earlier run left behind. */
const cleanList = (api) => async (page, h) => {
  await clearListFilters(page, api);
  await openList(api)(page, h);
};

const ENTERPRISE = { field: "RecordTypeId", operator: "eq", value: "Enterprise" };

/** A row of the list body (0-based). */
const row = (page, i) => page.locator("tbody tr").nth(i);

/** Cancel whatever the list's inline editor staged. Reloading would drop it too; this is explicit. */
async function cancelListEdits(page) {
  await page.keyboard.press("Escape").catch(() => {});
  const c = page.locator("lightning-datatable").getByRole("button", { name: "Cancel", exact: true });
  if (await c.count()) await c.first().click({ timeout: 4000 }).catch(() => {});
  await settle(page, 600);
}

/**
 * Chromium does not paint native title="" tooltips in a headless capture. Where a page documents
 * one, it is drawn from the element's OWN title text, in the native tooltip's plain style, just
 * under the pointer - the text is read from the live DOM, never typed here.
 */
async function drawTitleTooltip(locator) {
  await locator.evaluate((el) => {
    const t = el.getAttribute("title");
    if (!t) return;
    const r = el.getBoundingClientRect();
    const tip = document.createElement("div");
    tip.textContent = t;
    tip.setAttribute("data-shot-tooltip", "1");
    Object.assign(tip.style, {
      position: "fixed", left: Math.max(8, r.left + r.width / 2 - 40) + "px", top: r.bottom + 16 + "px",
      zIndex: 99999, background: "#fff", color: "#222", border: "1px solid #767676",
      font: "12px 'Segoe UI', system-ui, sans-serif", padding: "3px 7px", whiteSpace: "nowrap",
      boxShadow: "1px 2px 3px rgba(0,0,0,.2)",
    });
    document.body.appendChild(tip);
    // keep it inside the window
    const tr = tip.getBoundingClientRect();
    if (tr.right > window.innerWidth - 8) tip.style.left = window.innerWidth - 8 - tr.width + "px";
  });
}

/**
 * Open a route the shell addresses by hash - a record (tab=Account&obj=Account&rec=<id>) or a
 * report/dashboard (tab=Reports&aid=<id>). Reloads, for the reason gotoTab gives.
 */
async function gotoHash(page, cfg, hash) {
  await page.goto(`${cfg.portal}#${hash}`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.reload({ waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.locator("button.userbtn").waitFor({ state: "visible", timeout: 90_000 });
  await settle(page, 2500);
}
const gotoRecord = (api, id) => (page, h) => gotoHash(page, h.cfg, `tab=${api}&obj=${api}&rec=${id}`);

/*
 * Records used below, found with read-only queries against the org:
 *   "Name 45" - a Nonprofit account with 7 contacts, overdue tasks, past tasks in three months
 *   and a September event. The org holds no activity dated in the current month (October 2026),
 *   so no timeline can show a "This Month" group.
 */
const NAME45 = "001HF00000OUd28YAD";

/** Scroll an element into the middle of the screen (the shell scrolls inside .content). */
async function center(locator) {
  await locator.evaluate((el) => {
    el.scrollIntoView({ block: "center" });
  });
  await unshift(locator.page());
  await locator.page().waitForTimeout(300);
}

/*
 * Scrolling a field into view (or focusing one) can also scroll the shell's own overflow:hidden
 * frame, which slides the whole top bar out of the picture. Only the shell's content area is
 * meant to scroll: put every overflow:hidden box back at the top.
 */
async function unshift(page) {
  await page.evaluate(() => {
    const roots = [document];
    const walk = (r) => {
      for (const el of r.querySelectorAll("*")) if (el.shadowRoot) { roots.push(el.shadowRoot); walk(el.shadowRoot); }
    };
    walk(document);
    for (const root of roots)
      for (const el of root.querySelectorAll("*"))
        if (el.scrollTop > 0 && getComputedStyle(el).overflowY === "hidden") el.scrollTop = 0;
    window.scrollTo(0, 0);
  });
}

/** The Contacts related list card on a record. */
const contactsCard = (page) =>
  page.locator("div.rec-card").filter({ has: page.locator("a.rec-rl-titlelink", { hasText: "Contacts" }) }).last();

/** Close any docked activity panel (Close discards what was typed). */
async function closePanels(page) {
  for (let i = 0; i < 4; i++) {
    const b = page.locator('button.act-pbtn[title="Close"]').filter({ visible: true });
    if (!(await b.count())) break;
    await b.first().click({ timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(400);
  }
}

/* ------------------------------------------------------------------ the shell */

add({
  id: "shell/tab-menu",
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Home");
    await page.locator('button.mh-tab-caret[data-key="Account"]').click();
    await settle(page, 1500);
    await page.mouse.move(700, 700); // the pointer off the nav row, so no tab shows a hover state
    await settle(page, 300);
  },
});

add({
  id: "shell/search",
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Home");
    const box = page.getByPlaceholder("Search...").first();
    await box.click();
    await box.fill("Test"); // matches an account, a contact, reports and dashboards in this org
    await settle(page, 3500);
  },
});

/* ------------------------------------------------------------------ lists */

add({ id: "lists/accounts", setup: cleanList("Account") });

add({
  id: "lists/choose-columns",
  setup: async (page, h) => {
    await cleanList("Account")(page, h);
    await byName(page, "Select Fields to Display").click();
    await settle(page, 2000);
  },
});

add({
  id: "lists/filters-panel",
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Home");
    await seedListFilters(page, "Account",
      [ENTERPRISE, { field: "Type", operator: "eq", value: "Customer - Direct" }], "1 AND 2");
    await openList("Account")(page, h);
    await page.getByRole("button", { name: "Filter", exact: true }).first().click();
    await settle(page, 1500);
  },
  after: async (page) => {
    const c = page.locator("button.plv-fbtn", { hasText: "Cancel" }).filter({ visible: true });
    if (await c.count()) await c.first().click({ timeout: 4000 }).catch(() => {});
    await clearListFilters(page, "Account");
  },
});

add({
  id: "lists/filter-field-search",
  setup: async (page, h) => {
    await cleanList("Account")(page, h);
    await page.getByRole("button", { name: "Filter", exact: true }).first().click();
    await settle(page, 1200);
    await page.getByText("Add Filter", { exact: true }).first().click();
    await settle(page, 1000);
    const box = page.getByPlaceholder("Search Fields...").first();
    await box.click();
    await box.fill("owner");
    await settle(page, 1200);
  },
  after: async (page) => {
    for (let i = 0; i < 2; i++) {
      const c = page.locator("button.plv-fbtn", { hasText: "Cancel" }).filter({ visible: true });
      if (await c.count()) await c.last().click({ timeout: 4000 }).catch(() => {});
      await settle(page, 400);
    }
  },
});

add({
  id: "lists/new-list-view",
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Home");
    await seedListFilters(page, "Account", [ENTERPRISE]);
    await openList("Account")(page, h);
    await page.locator("button.portal-viewsel").first().click();
    await settle(page, 1200);
    await page.getByText("New List View", { exact: true }).first().click();
    await settle(page, 1500);
    const name = page.getByLabel("List View Name").first();
    await name.fill("Enterprise accounts");
    await settle(page, 600);
  },
  after: async (page) => {
    const c = page.getByRole("button", { name: "Cancel", exact: true }).filter({ visible: true });
    if (await c.count()) await c.last().click({ timeout: 4000 }).catch(() => {});
    await clearListFilters(page, "Account");
  },
});

/* ------------------------------------------------------------------ list editing (staged, then cancelled) */

add({
  id: "records/list-edit-recordtype-locked",
  setup: async (page, h) => {
    await cleanList("Account")(page, h);
    const btn = page.getByRole("button", { name: "Edit List" }).first();
    await btn.hover({ force: true });
    await settle(page, 600);
    await drawTitleTooltip(btn);
  },
  after: async (page) => {
    await page.evaluate(() => document.querySelectorAll("[data-shot-tooltip]").forEach((e) => e.remove()));
  },
});

add({
  id: "records/list-edit-drafts",
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Home");
    await seedListFilters(page, "Account", [ENTERPRISE]);
    await openList("Account")(page, h);

    // Two text cells, then a picklist cell. Enter commits a cell to a DRAFT; nothing is sent.
    for (const [i, col, val] of [[2, "Billing City", "Austin"], [3, "Billing State/Province", "TX"]]) {
      await row(page, i).getByRole("button", { name: `Edit ${col}` }).click({ force: true });
      await settle(page, 700);
      await page.keyboard.press("Control+A");
      await page.keyboard.type(val);
      await page.keyboard.press("Enter");
      await settle(page, 700);
    }
    await row(page, 1).getByRole("button", { name: "Edit Type" }).click({ force: true });
    await settle(page, 900);
    // The cell editor floats outside the table's markup; it is the visible combobox showing the
    // row's current Type.
    await page.locator('button.slds-combobox__input[data-value="Customer - Direct"]').filter({ visible: true }).first().click();
    await settle(page, 700);
    await page.locator("[role=option]:visible").filter({ hasText: "Customer - Channel" }).first().click();
    await settle(page, 700);
    await page.locator("text=/items •/").first().click(); // close the editor; the draft stays yellow
    await settle(page, 900);
  },
  after: async (page) => {
    await cancelListEdits(page);
    await clearListFilters(page, "Account");
  },
});

add({
  id: "records/list-edit-mass",
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Home");
    await seedListFilters(page, "Account", [ENTERPRISE]);
    await openList("Account")(page, h);
    for (const i of [1, 2, 3]) {
      await row(page, i).locator("label.slds-checkbox__label").first().click();
      await settle(page, 300);
    }
    await row(page, 2).getByRole("button", { name: "Edit Type" }).click({ force: true });
    await settle(page, 1200);
  },
  after: async (page) => {
    await cancelListEdits(page);
    await clearListFilters(page, "Account");
  },
});

/* ------------------------------------------------------------------ records */

add({
  id: "records/accounts-detail",
  // The same account as the first capture: the first row of All Accounts, sorted by name.
  setup: async (page, h) => {
    await cleanList("Account")(page, h);
    await page.locator("tbody a:visible").first().click();
    await settle(page, 4000);
  },
});

add({
  id: "records/inline-edit-mode",
  setup: async (page, h) => {
    await gotoRecord("Account", NAME45)(page, h);
    // One field pencil opens every editable field at once.
    await page.locator("button.slds-button_icon-small[title='Edit']").first().click();
    await settle(page, 2000);
    // Scroll to where editable fields meet the read-only ones (padlocks), above the docked bar.
    await center(page.getByText("Portal External ID", { exact: false }).first());
  },
  after: async (page) => {
    const c = page.getByRole("button", { name: "Cancel", exact: true }).filter({ visible: true });
    if (await c.count()) await c.last().click({ timeout: 4000 }).catch(() => {});
  },
});

add({
  id: "records/record-type-picker",
  setup: async (page, h) => {
    await cleanList("Account")(page, h);
    await page.getByRole("button", { name: "New", exact: true }).first().click();
    await settle(page, 2500);
  },
  after: async (page) => {
    const c = page.getByRole("button", { name: "Cancel", exact: true }).filter({ visible: true });
    if (await c.count()) await c.last().click({ timeout: 4000 }).catch(() => {});
  },
});

add({
  id: "records/related-list-card",
  setup: async (page, h) => {
    await gotoRecord("Account", NAME45)(page, h);
    const card = contactsCard(page);
    await center(card);
    for (const i of [0, 1]) {
      await card.locator("tbody tr").nth(i).locator("label.slds-checkbox__label").first().click();
      await page.waitForTimeout(300);
    }
    await card.locator("tbody tr").nth(3).getByRole("button", { name: "Show actions" }).click();
    await settle(page, 1000);
  },
});

add({
  id: "records/change-owner-several",
  setup: async (page, h) => {
    await gotoRecord("Account", NAME45)(page, h);
    const card = contactsCard(page);
    await center(card);
    for (const i of [0, 1]) {
      await card.locator("tbody tr").nth(i).locator("label.slds-checkbox__label").first().click();
      await page.waitForTimeout(300);
    }
    await card.getByRole("button", { name: "Change Owner" }).click();
    await settle(page, 1800);
    const box = page.getByPlaceholder("Search Users...").first();
    await box.click();
    await box.fill("acme");
    await settle(page, 1800);
    // Pick a portal user; Submit is never pressed.
    await page.locator(".slds-modal [role=option], .slds-modal li").filter({ hasText: /^\s*acmeuser\s*$/ }).first().click();
    await settle(page, 800);
  },
  after: async (page) => {
    const c = page.locator(".slds-modal").getByRole("button", { name: "Cancel", exact: true });
    if (await c.count()) await c.first().click({ timeout: 4000 }).catch(() => {});
  },
});

add({
  id: "records/activity-docked-panels",
  setup: async (page, h) => {
    await gotoRecord("Account", NAME45)(page, h);
    await page.getByRole("button", { name: "Log a Call", exact: true }).first().click();
    await settle(page, 1500);
    await page.getByRole("button", { name: "New Task", exact: true }).first().click();
    await settle(page, 2000);
    // p0 is the first panel opened (Log a Call): fold it down to its title bar.
    await page.locator('button.act-pbtn[data-key="p0"][title="Minimize"]').click();
    await page.waitForTimeout(600);
    await page.locator('input.cmp-in[data-f="subject"][placeholder="Subject"]').filter({ visible: true }).first()
      .fill("Send the renewal quote");
    const due = page.getByLabel("Due Date").filter({ visible: true }).first();
    await due.click();
    await due.fill("Nov 6, 2026");
    await page.keyboard.press("Tab");
    await page.waitForTimeout(400);
    for (const [from, to] of [["Not Started", "In Progress"], ["Normal", "High"]]) {
      await page.locator(`button.slds-combobox__input[data-value="${from}"]`).filter({ visible: true }).first().click();
      await page.waitForTimeout(500);
      await page.locator("[role=option]:visible").filter({ hasText: to }).first().click();
      await page.waitForTimeout(400);
    }
  },
  after: closePanels,
});

add({
  id: "records/activity-filters",
  setup: async (page, h) => {
    await gotoRecord("Account", NAME45)(page, h);
    // A pick re-renders the timeline and can fold the panel; reopen it before each pick and at the end.
    const open = async () => {
      if (!(await page.locator("button.act-fopt").filter({ visible: true }).count())) {
        await page.locator("button.act-filtersum").first().click();
        await page.waitForTimeout(700);
      }
    };
    for (const v of ["30", "Call"]) {
      await open();
      await page.locator(`button.act-fopt[data-v="${v}"]`).click();
      await settle(page, 900);
    }
    await open();
    await settle(page, 600);
  },
});

add({
  id: "records/activity-timeline",
  setup: async (page, h) => {
    await gotoRecord("Account", NAME45)(page, h);
    // Expand the third entry (an overdue task), then open the menu on the fourth - its menu drops
    // into the gap above the next group, where nothing shows through it.
    await page.locator("div.act-ghead").first().evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.locator("lightning-icon.act-rowcaret").nth(2).click({ force: true });
    await settle(page, 1000);
    await page.locator("button.act-rowmenu-btn").nth(3).click({ force: true });
    await settle(page, 800);
  },
});

add({
  id: "records/activity-account-rollup",
  // Just the timeline card: every entry's line names the contact it was with, as a link.
  opts: { selector: "c-portal-activities" },
  setup: async (page, h) => {
    await gotoRecord("Account", NAME45)(page, h);
    await page.locator(".act-sumwho").first().hover();
    await settle(page, 600);
  },
});

/* ------------------------------------------------------------------ the Reports / Dashboards lists */

/** Reports or Dashboards tab, on its "All ..." view. */
const analyticsAll = (tab) => async (page, h) => {
  await gotoTab(page, h.cfg, tab);
  await page.getByText(tab === "Reports" ? "All Reports" : "All Dashboards", { exact: true }).first().click();
  await settle(page, 2500);
};

// No report or dashboard is starred in this org, and a star is a saved change, so the lists are
// captured without one.
add({ id: "analytics/reports-list", setup: analyticsAll("Reports") });
add({ id: "analytics/dashboards-list", setup: analyticsAll("Dashboards") });

add({
  id: "analytics/list-columns-popover",
  setup: async (page, h) => {
    await analyticsAll("Reports")(page, h);
    await page.getByRole("button", { name: "Select Fields to Display" }).first().click();
    await settle(page, 1200);
    // Move two fields across - staged in the box only; Apply is never pressed.
    for (const v of ["owner", "visibility"]) {
      await page.locator(`.slds-listbox__option[data-value="${v}"]`).first().click();
      await page.getByRole("button", { name: "Move selection to Selected" }).first().click();
      await page.waitForTimeout(400);
    }
    // The two land at the bottom of Selected: scroll that list down so they show.
    await page.locator('.slds-listbox__option[data-value="visibility"]').first()
      .evaluate((el) => el.scrollIntoView({ block: "nearest" }));
    await page.mouse.move(600, 700);
    await settle(page, 500);
  },
  after: async (page) => { await page.keyboard.press("Escape").catch(() => {}); },
});

/** The row menu (the arrow at the end of a row) of a report in All Reports. */
async function openReportRowMenu(page, name) {
  const row = page.locator("tbody tr").filter({ has: page.locator("a.an-row-link", { hasText: name }) }).first();
  await row.getByRole("button", { name: "Show actions" }).click();
  await settle(page, 900);
}

add({
  id: "analytics/list-row-menu",
  setup: async (page, h) => {
    await analyticsAll("Reports")(page, h);
    await openReportRowMenu(page, "Person Test Report");
  },
});

add({
  id: "analytics/edit-properties",
  setup: async (page, h) => {
    await analyticsAll("Reports")(page, h);
    await openReportRowMenu(page, "Person Test Report");
    await page.locator("[role=menuitem]").filter({ hasText: "Edit Properties" }).first().click();
    await settle(page, 1500);
  },
  after: async (page) => {
    const c = page.getByRole("button", { name: "Cancel", exact: true }).filter({ visible: true });
    if (await c.count()) await c.last().click({ timeout: 4000 }).catch(() => {});
  },
});

/* ------------------------------------------------------------------ the report viewer
 *
 * Field editing here is STAGED only: Apply stages a value in the browser, nothing is written until
 * Save in the bottom bar, which is never pressed. `after` clicks the bar's Cancel.
 */

const R = {
  SUMMARY_ACTIVITY: "a0MHF000000iUqP2AU",
  MATRIX_CONNECTS: "a0MHF000000iUqR2AU", // Test Connects - matrix, 1,360 rows (Detail Rows allowed) // Summary Activity Report - summary, Activities with Contact
  MATRIX_DIALS: "a0MHF000000iUqQ2AU", // Test Reps total dials - matrix, Detail Rows on
  CONTACTS_COPY: "a0MHF000000iUqc2AE", // Copy of Test Contacts & Accounts Report - tabular, 8 columns
  PERSON: "a0MHF000000iUqf2AE", // Person Test Report - tabular Contacts & Accounts, 116,686 rows
  KEYSORT_CLIENT: "a0MHF000000ivaT2AQ", // KeySort Client Shape - activities with contact fields (Birthdate)
  KEYSORT_SAVED_SORT: "a0MHF000000ivll2AA", // KeySort Prod Shape (saved sort) - sorted by a contact column
};

/** Open a saved report in the viewer and wait for it to run. */
const openReport = (id, wait = 8000) => async (page, h) => {
  await gotoHash(page, h.cfg, `tab=Reports&aid=${id}`);
  await page.locator(".pc-scroll, .mx-wrap, .an-empty, .slds-illustration").first().waitFor({ state: "visible", timeout: 120_000 }).catch(() => {});
  await settle(page, wait);
};

async function enableFieldEditing(page) {
  await page.getByRole("button", { name: "Enable Field Editing" }).click();
  await settle(page, 2500);
}

/** A cell of the viewer's table; its pencil shows on hover. */
const cellAt = (page, rowIdx, colIdx) => page.locator(".pc-scroll tbody tr").nth(rowIdx).locator("td").nth(colIdx);

async function openCellEditor(page, rowIdx, colIdx) {
  const cell = cellAt(page, rowIdx, colIdx);
  await cell.hover();
  await page.waitForTimeout(300);
  await cell.locator(".pc-td-pencil").click();
  await settle(page, 2000); // "Loading..." while it reads the stored value
}

async function columnIndex(page, label) {
  const heads = (await page.locator(".pc-scroll th").allInnerTexts()).map((x) => x.trim());
  const i = heads.findIndex((x) => x === label || x.startsWith(label));
  if (i < 0) throw new Error(`no column "${label}" in ${heads.join(", ")}`);
  return i;
}

const applyVisible = (page) =>
  page.getByRole("button", { name: "Apply", exact: true }).filter({ visible: true }).first().click();

/** Throw away staged values (the bar's Cancel) and close any open cell editor. */
async function cancelReportEdits(page) {
  for (let i = 0; i < 2; i++) {
    const c = page.getByRole("button", { name: "Cancel", exact: true }).filter({ visible: true });
    if (!(await c.count())) break;
    await c.last().click({ timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(500);
  }
}

add({
  id: "report-viewer/edit-enabled",
  setup: async (page, h) => {
    await openReport(R.CONTACTS_COPY)(page, h);
    await enableFieldEditing(page);
    // Created Date cannot be edited: point at its padlock so its own dark tooltip shows.
    const lock = cellAt(page, 1, await columnIndex(page, "Created Date")).locator(".pc-td-lock");
    await lock.hover();
    await page.waitForTimeout(700);
  },
});

add({
  id: "report-viewer/edit-bar",
  setup: async (page, h) => {
    await openReport(R.CONTACTS_COPY)(page, h);
    await enableFieldEditing(page);
    const custom = await columnIndex(page, "Custom 1");
    const bucket = await columnIndex(page, "Bucket Status");

    await openCellEditor(page, 0, custom);
    await page.locator("textarea.slds-textarea").filter({ visible: true }).first().fill("Prefers email");
    await applyVisible(page);
    await settle(page, 700);

    await openCellEditor(page, 1, bucket);
    await page.locator("button.slds-combobox__input").filter({ visible: true }).last().click();
    await page.waitForTimeout(600);
    await page.locator("[role=option]:visible").filter({ hasText: /^Meeting Scheduled$/ }).first().click();
    await page.waitForTimeout(400);
    await applyVisible(page);
    await settle(page, 700);

    await openCellEditor(page, 3, custom);
    await page.locator("textarea.slds-textarea").filter({ visible: true }).first().fill("Call back in Q1");
    await applyVisible(page);
    await settle(page, 700);
    await page.mouse.move(700, 1000);
  },
  after: cancelReportEdits,
});

add({
  id: "report-viewer/edit-lookup",
  setup: async (page, h) => {
    await openReport(R.PERSON)(page, h);
    await enableFieldEditing(page);
    await openCellEditor(page, 0, await columnIndex(page, "Account Name"));
    const box = page.getByPlaceholder("Search...").filter({ visible: true }).last();
    await box.click();
    await box.pressSequentially("Ame", { delay: 120 });
    await settle(page, 2500);
  },
  after: cancelReportEdits,
});

// No Contacts & Accounts report in this org has a Birthdate column; KeySort Client Shape (an
// activities report with the contact's fields) has "Contact: Birthdate", so the date editor is
// shown there.
add({
  id: "report-viewer/edit-date",
  setup: async (page, h) => {
    await openReport(R.KEYSORT_CLIENT)(page, h);
    await enableFieldEditing(page);
    await openCellEditor(page, 1, await columnIndex(page, "Contact: Birthdate"));
    await page.locator('button[title^="Select a date for"]').filter({ visible: true }).first().click({ force: true });
    await settle(page, 1000);
  },
  after: async (page) => {
    await page.keyboard.press("Escape").catch(() => {});
    await cancelReportEdits(page);
  },
});

/*
 * Matrix with its Details pane. "Test Reps total dials" has more rows than the Details can hold
 * (the toggle is greyed), so "Test Connects" is used. The viewer's Detail Rows switch is local to
 * the screen (vToggleDetail), never saved; turning it off and on again makes the pane load.
 */
async function matrixWithDetails(page, h) {
  await openReport(R.MATRIX_CONNECTS, 9000)(page, h);
  if (!(await page.locator(".an-details-dock").count())) {
    const sw = page.locator("label.an-ftog", { hasText: "Detail Rows" });
    if (await sw.locator("input").isChecked()) { await sw.click(); await settle(page, 1500); }
    await sw.click();
    await settle(page, 6000);
  }
  await page.locator(".an-details-dock").waitFor({ state: "visible", timeout: 60_000 });
}

/** The grid's own scroller: back to the left edge, with `rowKey`'s group near the top. */
async function scrollMatrixTo(page, rowKey) {
  await page.evaluate((rk) => {
    const roots = [document];
    const walk = (r) => { for (const el of r.querySelectorAll("*")) if (el.shadowRoot) { roots.push(el.shadowRoot); walk(el.shadowRoot); } };
    walk(document);
    for (const root of roots) {
      const w = root.querySelector(".mx-wrap");
      if (!w) continue;
      w.scrollLeft = 0;
      if (rk) {
        const td = [...root.querySelectorAll("td[data-rowkey]")].find((t) => t.dataset.rowkey === rk);
        if (td) w.scrollTop += td.getBoundingClientRect().top - w.getBoundingClientRect().top - 130;
      }
    }
  }, rowKey);
  await page.waitForTimeout(1200);
}

add({
  id: "report-viewer/edit-matrix-details",
  setup: async (page, h) => {
    await matrixWithDetails(page, h);
    await enableFieldEditing(page);
    // A pencil shows on the cell under the pointer.
    await page.locator(".an-mdtd_edit").first().waitFor({ state: "visible", timeout: 30_000 });
    await page.locator(".an-mdtd_edit").filter({ has: page.locator("a", { hasText: /^Contact \d+$/ }) }).nth(1).hover();
    await page.waitForTimeout(600);
  },
});

add({
  id: "report-viewer/report-matrix-details-pane",
  setup: async (page, h) => {
    await matrixWithDetails(page, h);
    // Click the row total of one group: the pane narrows and its heading names the group.
    const key = "Billy John\u0001Call Failed\u0001"; // row keys join the group values with U+0001
    const tds = page.locator("td[data-rowkey]");
    const i = await tds.evaluateAll((l, k) => l.findIndex((td) => td.dataset.rowkey === k && td.dataset.colkey === ""
      && /^[1-9]\d*$/.test(td.innerText.trim())), key);
    await tds.nth(i).click();
    await settle(page, 4000);
    await scrollMatrixTo(page, key);
    await page.mouse.move(700, 1100);
  },
});

/** Click a heading's name to sort by it (only what is on screen changes; nothing is saved). */
async function sortByHeading(page, label) {
  await page.locator(".pc-th-label_sortable", { hasText: label }).first().click();
  await page.locator(".pc-th-label_sorted").first().waitFor({ timeout: 120_000 }).catch(() => {});
  await settle(page, 5000);
}

// The same summary report as before, now with Enable Field Editing in the header, sorted by Subject.
add({
  id: "analytics/report-viewer",
  setup: async (page, h) => {
    await openReport(R.SUMMARY_ACTIVITY)(page, h);
    await sortByHeading(page, "Subject");
    await page.mouse.move(700, 1100);
  },
});

add({
  id: "report-viewer/report-column-options",
  setup: async (page, h) => {
    await openReport(R.PERSON)(page, h);
    await sortByHeading(page, "Last Name");
    await page.locator(".pc-scroll th").filter({ hasText: "Last Name" }).first().locator(".pc-th-caret").click();
    await settle(page, 1000);
  },
});

/*
 * No saved Activities report here passes 45,000 rows: the biggest, KeySort Prod Shape (saved
 * sort) - sorted by Contact: Bucket Status - has 19,562 because of its "Status equals In Progress,
 * Completed" filter. The viewer's Filters panel changes a filter for this screen only ("Changes
 * here are temporary - they are not saved to the report"), so the filter is widened there to
 * "not equal to Deferred" (58,735 rows) and the notice appears.
 */
add({
  id: "report-viewer/report-sort-notice",
  setup: async (page, h) => {
    await openReport(R.KEYSORT_SAVED_SORT)(page, h);
    await page.getByRole("button", { name: /^Filters/ }).first().click();
    await settle(page, 1500);
    await page.getByText("equals In Progress, Completed").first().click();
    await settle(page, 1200);
    await page.locator("button.slds-combobox__input").filter({ hasText: "equals" }).filter({ visible: true }).first().click();
    await page.waitForTimeout(500);
    await page.locator("[role=option]:visible").filter({ hasText: /^not equal to$/ }).first().click();
    await page.waitForTimeout(500);
    await page.locator("button.slds-combobox__input").filter({ hasText: "Select an Option" }).filter({ visible: true }).first().click();
    await page.waitForTimeout(500);
    await page.locator("[role=option]:visible").filter({ hasText: /^Deferred$/ }).first().click();
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "Apply", exact: true }).filter({ visible: true }).first().click();
    await page.locator(".an-viewer-notice").first().waitFor({ state: "visible", timeout: 240_000 });
    await settle(page, 4000);
    // Close the panel so the notice and the table have the width.
    await page.getByRole("button", { name: "Close" }).filter({ visible: true }).first().click().catch(() => {});
    await settle(page, 1500);
  },
});

/* ------------------------------------------------------------------ the session timer
 *
 * The countdown runs against the BROWSER clock (portalSessionTimer: remaining = exp - (Date.now()
 * + offset)), so these move only the browser's clock forward; the session on the server is not
 * touched and nothing is extended. Each runs in its own context ("fresh"), so the faked clock
 * never leaks into another shot.
 */

/* (session-timer helpers continue below the dashboard shots) */

/* ------------------------------------------------------------------ dashboards
 *
 * "Calling Dashboard Test": a Record Type filter and six tiles (two Donuts, two Lines, two
 * Metrics). The capture user already has a remembered selection on it - Enterprise, Nonprofit,
 * Partner ("3 selected") - so these shots use it as it is and tick nothing: the remembered
 * selection is left exactly as found. A click into a chart opens the report narrowed for that
 * visit only (it rides in the URL), nothing is saved.
 */
const DASH_CALLING = "a07HF00000S0sDpYAJ";

async function openDashboard(page, h, id = DASH_CALLING) {
  await gotoHash(page, h.cfg, `tab=Dashboards&aid=${id}`);
  await page.locator("li.pc-hit, g.pc-hit").first().waitFor({ state: "visible", timeout: 150_000 });
  await settle(page, 4000);
}

/** The tiles in grid order: 0-2 read Test Reps total dials, 3-5 Test Connects. */
const tile = (page, i) => page.locator(".an-dash-tile, [class*=dash-tile]").nth(i);

/** After a chart click: wait for the narrowed report to land in the viewer. */
async function waitForDrilledReport(page) {
  await page.getByRole("button", { name: /^Back to / }).waitFor({ state: "visible", timeout: 120_000 });
  await page.locator(".pc-scroll, .mx-wrap").first().waitFor({ state: "visible", timeout: 200_000 }).catch(() => {});
  await settle(page, 6000);
}

add({
  id: "analytics/chart-hover-box",
  setup: async (page, h) => {
    await openDashboard(page, h);
    // A slice of the Record Count donut (second tile), the pointer resting on it.
    const g = page.locator('g.pc-hit[data-gi="3"]').first();
    const b = await g.boundingBox();
    await page.mouse.move(b.x + b.width * 0.5, b.y + b.height * 0.25, { steps: 5 });
    await page.waitForTimeout(900);
  },
});

add({
  id: "analytics/dashboard-filters-selected",
  setup: async (page, h) => {
    await openDashboard(page, h);
    await page.mouse.move(1000, 1150);
    await page.locator("button.an-filter-pill").first().click(); // opening the list ticks nothing
    await settle(page, 1000);
  },
  after: async (page) => {
    await page.mouse.click(1500, 1150).catch(() => {});
  },
});

add({
  id: "report-viewer/opened-from-dashboard",
  setup: async (page, h) => {
    await openDashboard(page, h);
    // A slice of the "Test Connects" donut (fourth tile): Billy John.
    const g = page.locator('g.pc-hit[data-gi="1"]').nth(1);
    const b = await g.boundingBox();
    await page.mouse.click(b.x + b.width * 0.5, b.y + b.height * 0.3);
    await waitForDrilledReport(page);
    await page.getByRole("button", { name: /^Filters/ }).first().click();
    await settle(page, 1500);
  },
});

add({
  id: "report-viewer/drill-refused-note",
  setup: async (page, h) => {
    await openDashboard(page, h);
    // "(blank)" holds 0 on the donut, so its slice has no area: its legend entry is the same target.
    await page.locator("li.pc-hit").filter({ hasText: /^\(blank\)/ }).first().click();
    await page.locator(".pc-scroll, .mx-wrap").first().waitFor({ state: "visible", timeout: 200_000 }).catch(() => {});
    await settle(page, 6000);
  },
});

add({
  id: "report-viewer/report-from-dashboard-filters",
  setup: async (page, h) => {
    await openDashboard(page, h);
    // A point on the "Test Reps total dials" line (third tile): that report has a filter of its
    // own, so the panel shows the chart card, the dashboard card and the report's own filter.
    const lbl = page.locator("span.pc-line-lbl.pc-hit").filter({ hasText: /^Connor Johnston$/ }).first();
    await lbl.click();
    await waitForDrilledReport(page);
    await page.getByRole("button", { name: /^Filters/ }).first().click();
    await settle(page, 1500);
  },
});

/* ------------------------------------------------------------------ the dashboard builder
 *
 * Opened with Edit and always left with Close -> Leave & Discard. Nothing is saved: the widget
 * and filter dialogs are cancelled, and the moved tile is discarded.
 */

/** The builder on "Calling Dashboard Test", every tile drawn (editing waits until then). */
async function openBuilder(page, h) {
  await openDashboard(page, h);
  await page.getByRole("button", { name: "Edit", exact: true }).first().click();
  await page.locator("div.db-tile-head").first().waitFor({ state: "visible", timeout: 120_000 });
  await page.getByRole("button", { name: "Undo" }).waitFor({ timeout: 60_000 });
  await settle(page, 5000);
}

/** Cancel whatever dialog is open, then Close the builder, discarding if it asks. */
async function leaveBuilder(page) {
  for (let i = 0; i < 2; i++) {
    const c = page.locator(".slds-modal").getByRole("button", { name: "Cancel", exact: true }).filter({ visible: true });
    if (!(await c.count())) break;
    await c.last().click({ timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(500);
  }
  const close = page.getByRole("button", { name: "Close", exact: true }).filter({ visible: true });
  if (await close.count()) await close.first().click({ timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(1000);
  const discard = page.getByRole("button", { name: "Leave & Discard" });
  if (await discard.count()) await discard.first().click({ timeout: 4000 }).catch(() => {});
  await settle(page, 1500);
}

/*
 * "Loading dashboard…" lasts a moment. The builder's server calls are held back in the BROWSER
 * for a few seconds (page.route - nothing reaches or changes the org) so the shutter is not a race.
 * `noSettle`: the runner must not wait for the spinner to go, which is the point of the picture.
 */
const holdAura = (url) => /\/aura/.test(url.toString());
add({
  id: "dashboard-builder/dashboard-loading",
  noSettle: true,
  setup: async (page, h) => {
    await openDashboard(page, h);
    await page.route(holdAura, async (route) => {
      await new Promise((r) => setTimeout(r, 7000));
      await route.continue().catch(() => {});
    });
    await page.getByRole("button", { name: "Edit", exact: true }).first().click();
    await page.getByText("Loading dashboard…").waitFor({ state: "visible", timeout: 30_000 });
    await page.waitForTimeout(600);
  },
  after: async (page) => {
    await page.unroute(holdAura).catch(() => {});
    await page.getByRole("button", { name: "Undo" }).waitFor({ timeout: 90_000 }).catch(() => {});
    await settle(page, 2000);
    await leaveBuilder(page);
  },
});

add({
  id: "dashboard-builder/widget-dialog-display-as",
  setup: async (page, h) => {
    await openBuilder(page, h);
    await page.getByRole("button", { name: "+ Widget" }).click();
    await settle(page, 800);
    await page.getByText("Chart or Table", { exact: true }).first().click();
    await settle(page, 1500);
    await page.locator(".db-reppick button.slds-combobox__input").first().click();
    await page.waitForTimeout(800);
    await page.locator("[role=option]:visible").filter({ hasText: /^Summary Activity Report$/ }).first().click();
    await settle(page, 4000);
    await page.locator('.db-dasgrid button[title="Donut"]').click();
    await settle(page, 2500);
    await page.locator("button.slds-combobox__input").filter({ hasText: "(Report default chart)" }).filter({ visible: true }).first().click();
    await page.waitForTimeout(700);
    await page.locator("[role=option]:visible").filter({ hasText: /^Activity: Status$/ }).first().click();
    // the preview re-reads the report for the new slicing
    await page.locator("li.pc-hit").filter({ hasText: /^Completed/ }).first().waitFor({ timeout: 60_000 });
    await settle(page, 2000);
    await page.mouse.move(1000, 1240);
  },
  after: leaveBuilder,
});

add({
  id: "dashboard-builder/add-filter-relative-date",
  setup: async (page, h) => {
    await openBuilder(page, h);
    await page.getByRole("button", { name: "+ Filter" }).click();
    await settle(page, 2500);
    const box = page.getByPlaceholder("Search fields…").first();
    await box.click();
    await box.fill("date");
    await settle(page, 1200);
    await page.locator('button.db-fieldopt[data-api="ActivityDate"]').click();
    await settle(page, 2000);
    await page.getByRole("button", { name: "Add Filter Value" }).click();
    await settle(page, 1000);
    await page.locator("label.db-check", { hasText: "Relative date" }).locator("input").check({ force: true });
    await settle(page, 800);
    await page.locator("button.slds-combobox__input").filter({ hasText: "Select a range…" }).filter({ visible: true }).first().click();
    await page.waitForTimeout(700);
    await page.locator("[role=option]:visible").filter({ hasText: /^Last 30 Days$/ }).first().click();
    await settle(page, 1000);
  },
  after: leaveBuilder,
});

add({
  id: "dashboard-builder/dashboard-unsaved-changes",
  setup: async (page, h) => {
    await openBuilder(page, h);
    const heads = page.locator("div.db-tile-head");
    await heads.nth(0).dragTo(heads.nth(1)); // move a tile: unsaved work
    await settle(page, 2000);
    await page.getByRole("button", { name: "Close", exact: true }).first().click();
    await page.getByRole("button", { name: "Leave & Discard" }).waitFor({ timeout: 20_000 });
    await settle(page, 800);
  },
  after: leaveBuilder,
});

/* ------------------------------------------------------------------ the report builder
 *
 * Every builder shot is left with Close -> Leave & Discard: nothing is saved. Where a new report
 * is needed (no Opportunities report type exists in this org, and no saved Accounts report), it is
 * a NEW, never-saved report built in the builder and then discarded. "Update Preview
 * Automatically" is a switch local to the builder (not a saved preference).
 */

/** Close the report builder, discarding. */
async function leaveReportBuilder(page) {
  await page.keyboard.press("Escape").catch(() => {});
  for (let i = 0; i < 2; i++) {
    const c = page.locator(".slds-modal").getByRole("button", { name: "Cancel", exact: true }).filter({ visible: true });
    if (!(await c.count())) break;
    await c.last().click({ timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(500);
  }
  const close = page.getByRole("button", { name: "Close", exact: true }).filter({ visible: true });
  if (await close.count()) await close.first().click({ timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(1000);
  const discard = page.getByRole("button", { name: "Leave & Discard" });
  if (await discard.count()) await discard.first().click({ timeout: 4000 }).catch(() => {});
  await settle(page, 1500);
}

/** Reports -> New Report -> a report type -> Start Report, with the preview following edits. */
async function newReport(page, h, typeLabel) {
  await gotoTab(page, h.cfg, "Reports");
  await page.getByRole("button", { name: "New Report" }).click();
  await settle(page, 3000);
  const box = page.getByPlaceholder("Search Report Types...").first();
  await box.fill(typeLabel);
  await settle(page, 1200);
  await page.locator(".rtp-rows > div").filter({ has: page.locator(".rtp-row-name", { hasText: new RegExp(`^${typeLabel}$`) }) }).first().click();
  await page.getByRole("button", { name: "Start Report" }).click();
  await page.locator('input[data-adder="col"]').waitFor({ timeout: 60_000 });
  await settle(page, 3000);
  await page.locator("label.rb-auto input").check({ force: true });
}

/** Pick a field into an Outline zone: col (columns), grow (group rows), gcol (group columns). */
async function addToZone(page, zone, query, api) {
  await page.mouse.click(280, 1100); // blur the adders, so focusing one opens its list again
  await page.waitForTimeout(400);
  const inp = page.locator(`input[data-adder="${zone}"]`);
  await inp.click();
  await inp.fill(query);
  await page.waitForTimeout(1200);
  await page.locator(`li.rb-adder-item[data-zone="${zone}"][data-api="${api}"]`).first().dispatchEvent("mousedown");
  await page.waitForTimeout(2500);
}

/** Filters tab -> Add filter... -> a field; the New Filter box opens. */
async function addBuilderFilter(page, query, api) {
  await page.locator('[data-tab="filters"]').click();
  await settle(page, 1200);
  const inp = page.getByPlaceholder("Add filter...").first();
  await inp.click();
  await inp.fill(query);
  await page.waitForTimeout(1200);
  await page.locator(`button.rb-ffield-opt[data-api="${api}"]`).first().click();
  await settle(page, 1500);
}

/** An unsaved Accounts summary: grouped by Account Type, three columns, revenue > 0, Sum on revenue. */
async function accountsSummary(page, h) {
  await newReport(page, h, "Accounts");
  await addToZone(page, "col", "Account Name", "Name");
  await addToZone(page, "col", "Annual", "AnnualRevenue");
  await addToZone(page, "col", "Employees", "NumberOfEmployees");
  await addToZone(page, "grow", "Type", "Type");
  // only the accounts that have a revenue, so the column has figures to total
  await addBuilderFilter(page, "Annual", "AnnualRevenue");
  await page.locator('button.slds-combobox__input[data-value="equals"]').filter({ visible: true }).first().click();
  await page.waitForTimeout(600);
  await page.locator("[role=option]:visible").filter({ hasText: /^greater than$/ }).first().click();
  await page.waitForTimeout(400);
  await page.locator("label.rb-fedit-lbl", { hasText: "Value" }).locator("xpath=following::input[1]").fill("0");
  await page.getByRole("button", { name: "Apply", exact: true }).filter({ visible: true }).first().click();
  await settle(page, 6000);
  await page.locator('[data-tab="outline"]').click();
  await settle(page, 1000);
}

const columnMenu = async (page, heading) => {
  await page.locator("th").filter({ hasText: heading }).first().locator("button").first().click();
  await settle(page, 1000);
};
const menuItem = (page, label) =>
  page.locator("[class*=menu] li:visible, [role=menuitem]:visible").filter({ hasText: new RegExp(`^${label}$`) }).first();

add({
  id: "report-builder/change-report-type",
  setup: async (page, h) => {
    await accountsSummary(page, h);
    await page.mouse.move(1000, 1150);
  },
  after: leaveReportBuilder,
});

add({
  id: "report-builder/column-options-totals",
  setup: async (page, h) => {
    await accountsSummary(page, h);
    await columnMenu(page, "Annual Revenue");
    await menuItem(page, "Sum").click(); // a tick on Sum - staged in the builder only
    await settle(page, 5000);
    await columnMenu(page, "Annual Revenue");
  },
  after: leaveReportBuilder,
});

add({
  id: "report-builder/long-text-operators",
  setup: async (page, h) => {
    await accountsSummary(page, h);
    await addBuilderFilter(page, "Descr", "Description");
    await page.locator('button.slds-combobox__input[data-value="equals"]').filter({ visible: true }).first().click();
    await page.waitForTimeout(800);
  },
  after: leaveReportBuilder,
});

add({
  id: "report-builder/bucket-picklist",
  setup: async (page, h) => {
    await newReport(page, h, "Contacts");
    await addToZone(page, "col", "First", "FirstName");
    await addToZone(page, "col", "Last Name", "LastName");
    await addToZone(page, "col", "Lead Source", "LeadSource");
    await settle(page, 4000);
    await columnMenu(page, "Lead Source");
    await menuItem(page, "Bucket This Column").click();
    await settle(page, 2500);
    await page.locator("input.rb-bkt-nameinput").fill("Lead Source Group");
    // Two buckets. (Names avoid the tenant words the capture rebrands, e.g. "Outbound".)
    for (const [i, name] of [[0, "Inbound"], [1, "Purchased"]]) {
      await page.getByRole("button", { name: "Add Bucket" }).click();
      await page.waitForTimeout(800);
      await page.locator("input.rb-bkt-rename").nth(0).fill(name);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(500);
    }
    await page.getByText("All Values (5)").first().click();
    await page.waitForTimeout(800);
    for (const v of ["Web", "Phone Inquiry", "Partner Referral"]) {
      await page.locator(`input[data-v="${v}"]`).check({ force: true });
      await page.waitForTimeout(250);
    }
    await page.getByRole("button", { name: "Move To" }).click();
    await page.waitForTimeout(900);
  },
  after: leaveReportBuilder,
});

/** "Copy of Copy of Person Test Report": three custom filters, no filter logic typed. */
const R3F = "a0MHF000000iUqj2AE";
async function builderOnFilters(page, h, id) {
  await openReport(id)(page, h);
  await page.getByRole("button", { name: "Edit", exact: true }).first().click();
  await page.locator('[data-tab="filters"]').waitFor({ timeout: 90_000 });
  await settle(page, 6000);
  await page.locator('[data-tab="filters"]').click();
  await settle(page, 1500);
}
const logicBox = (page) => page.locator("label.rb-sub-label", { hasText: "Filter Logic" }).locator("xpath=following::input[1]");

add({
  id: "report-builder/filters",
  setup: async (page, h) => {
    await builderOnFilters(page, h, R3F);
    await page.mouse.move(1000, 1150);
  },
  after: leaveReportBuilder,
});

/*
 * The page suggests "1 AND (2 OR 4": with three filters the box reports the missing filter first
 * ("Filter 4 doesn't exist (you have 3).") - so "1 AND (2 OR 3" is typed to show the bracket error.
 */
add({
  id: "report-builder/filter-logic-error",
  setup: async (page, h) => {
    await builderOnFilters(page, h, R3F);
    await logicBox(page).click();
    await page.keyboard.press("Control+A");
    await page.keyboard.type("1 AND (2 OR 3", { delay: 40 });
    await page.waitForTimeout(1200);
  },
  after: leaveReportBuilder,
});

/*
 * No saved report here has a Pie chart, so the Pie is set in the builder's Chart Properties on the
 * Summary Activity Report and shown in the preview (the builder is then left with Leave & Discard).
 * The preview slices by the first grouping, Date.
 */
add({
  id: "report-viewer/report-chart-hover",
  setup: async (page, h) => {
    await openReport(R.SUMMARY_ACTIVITY)(page, h);
    await page.getByRole("button", { name: "Edit", exact: true }).first().click();
    await page.locator('[data-tab="filters"]').waitFor({ timeout: 90_000 });
    await settle(page, 6000);
    await page.getByRole("button", { name: "Chart properties" }).click();
    await settle(page, 1500);
    await page.locator('button.fx-ct[data-type="Pie"]').click();
    await settle(page, 1500);
    await page.locator("button[title='Close'], button[aria-label='Close']").filter({ visible: true }).first().click().catch(() => {});
    await page.waitForTimeout(800);
    await page.getByText("Refresh", { exact: true }).filter({ visible: true }).first().click(); // re-run the preview
    await page.locator("g.pc-hit").first().waitFor({ timeout: 60_000 });
    await settle(page, 4000);
    const g = page.locator('g.pc-hit[data-gi="7"]').first();
    const b = await g.boundingBox();
    await page.mouse.move(b.x + b.width * 0.7, b.y + b.height * 0.25, { steps: 6 });
    await page.waitForTimeout(900);
  },
  after: leaveReportBuilder,
});

/* The builder a moment after Edit on a large report: server calls held back in the browser. */
add({
  id: "report-builder/report-save-disabled-loading",
  noSettle: true,
  setup: async (page, h) => {
    await openReport(R.PERSON)(page, h);
    await page.route(holdAura, async (route) => {
      await new Promise((r) => setTimeout(r, 7000));
      await route.continue().catch(() => {});
    });
    await page.getByRole("button", { name: "Edit", exact: true }).first().click();
    await page.getByRole("button", { name: "Save & Run" }).waitFor({ state: "visible", timeout: 30_000 });
    await page.waitForTimeout(1200);
  },
  after: async (page) => {
    await page.unroute(holdAura).catch(() => {});
    await page.getByRole("button", { name: "Save & Run" }).isEnabled().catch(() => {});
    await settle(page, 6000);
    await leaveReportBuilder(page);
  },
});

/* ------------------------------------------------------------------ the Admin Console
 *
 * Dialogs here are opened and then cancelled; boxes ticked inside a dialog are never saved.
 */

/** Cancel the dialog that is open, whichever it is. */
async function cancelDialog(page) {
  for (let i = 0; i < 2; i++) {
    const c = page.getByRole("button", { name: /^(Cancel|Close)$/ }).filter({ visible: true });
    if (!(await c.count())) break;
    await c.last().click({ timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(500);
  }
}

/** Scroll the admin page so `text` sits at the top, under the fixed shell. */
async function scrollToText(page, text) {
  await page.getByText(text, { exact: true }).first().evaluate((el) => el.scrollIntoView({ block: "start" }));
  await unshift(page);
  await page.waitForTimeout(600);
}

/** Audit Log: choose an Action, fill the two "contains" boxes, Search. */
async function auditSearch(page, h, { action, user, record } = {}) {
  await openAdminTab("audit")(page, h);
  if (action) {
    await page.locator('button.slds-combobox__input[data-value="All actions"]').click();
    await page.waitForTimeout(700);
    await page.locator("[role=option]:visible").filter({ hasText: new RegExp(`^${action}$`) }).first().click();
    await page.waitForTimeout(400);
  }
  if (user) await page.locator("label", { hasText: "User contains" }).locator("xpath=following::input[1]").fill(user);
  if (record) await page.locator("label", { hasText: "Record contains" }).locator("xpath=following::input[1]").fill(record);
  await page.getByRole("button", { name: "Search" }).click();
  await settle(page, 3500);
}

// A mix of Login As, Login, Logout, Report Run, a Denied Report Edit, Edit and API rows.
add({ id: "admin/audit-log", setup: (page, h) => auditSearch(page, h, { user: "acmeadmin" }) });

add({
  id: "admin/audit-log-filter",
  setup: async (page, h) => {
    await openAdminTab("audit")(page, h);
    await page.locator('button.slds-combobox__input[data-value="All actions"]').click();
    await page.waitForTimeout(800);
    // Scroll the LIST (not the page) so the report options and the start of the dashboard ones show.
    await page.locator("[role=option]:visible").filter({ hasText: /^Report: Folder$/ }).first().evaluate((el) => {
      let box = el.parentElement;
      while (box && box.scrollHeight <= box.clientHeight + 2) box = box.parentElement;
      if (box) box.scrollTop = el.offsetTop - 4;
    });
    await page.waitForTimeout(500);
  },
  after: async (page) => { await page.keyboard.press("Escape").catch(() => {}); },
});

/*
 * Report actions on "Copy of Test Contacts & Accounts Report": Report Edit with its change lines,
 * Report Publish (Failed), Report Favorite, and the Denied Report Edit further down. The window is
 * made just tall enough to reach the Denied row (the org's Report Export rows are on a different
 * report, much further down, so they are not in this picture).
 */
add({
  id: "admin/audit-log-reports",
  setup: async (page, h) => {
    await auditSearch(page, h, { action: "Reports — every action", record: "Copy of Test Contacts & Accounts" });
    const bottom = await page.locator("tbody tr").filter({ hasText: "Denied" }).first()
      .evaluate((tr) => Math.round(tr.getBoundingClientRect().bottom));
    await page.setViewportSize({ width: 1440, height: Math.min(Math.max(bottom + 40, 900), 2600) });
    await settle(page, 1200);
  },
  after: async (page) => { await page.setViewportSize({ width: 1440, height: 900 }); },
});

add({
  id: "admin/audit-log-sf-import",
  setup: (page, h) => auditSearch(page, h, { action: "Report: Import from Salesforce" }),
});

add({
  id: "admin/companies-edit-branding",
  setup: async (page, h) => {
    await openAdminTab("companies")(page, h);
    await page.locator("tbody tr").filter({ hasText: "Acme Corp" }).first().getByRole("button", { name: "Edit" }).click();
    await settle(page, 2000);
  },
  after: cancelDialog,
});

add({
  id: "admin/modal-console-tabs-user",
  setup: async (page, h) => {
    await openAdminTab("users")(page, h);
    await page.getByRole("button", { name: "Console Tabs" }).first().click();
    await settle(page, 1500);
    const sel = page.locator("select").filter({ visible: true }).first();
    await sel.selectOption({ label: "acmeadmin" });
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "Next" }).click();
    await settle(page, 2000);
    // a few ticked - inside the dialog only, which is then cancelled
    for (const t of ["Users", "Reports & Dashboards", "Audit Log"]) {
      await page.locator("label").filter({ hasText: new RegExp(`^\\s*${t.replace("&", "\\&")}\\s*$`) }).filter({ visible: true }).first().click();
      await page.waitForTimeout(250);
    }
    await page.mouse.move(1000, 1200);
  },
  after: cancelDialog,
});

add({
  id: "admin/long-text-filters",
  setup: async (page, h) => {
    await openAdminTab("users")(page, h);
    await scrollToText(page, "Long text filters on large reports");
  },
});

// The Super Admin settings below the user list, from the top: Log in as user, Report speed, Long
// text filters, FrontSpin sync buttons (a taller window, so the panels show one above the other).
add({
  id: "admin/users-super-admin-panels",
  setup: async (page, h) => {
    await openAdminTab("users")(page, h);
    await page.setViewportSize({ width: 1440, height: 1500 });
    await settle(page, 800);
    await scrollToText(page, "Log in as user");
  },
  after: async (page) => { await page.setViewportSize({ width: 1440, height: 900 }); },
});

add({
  id: "frontspin/list-mappings-sync-switch",
  setup: async (page, h) => {
    await openAdminTab("users")(page, h);
    await scrollToText(page, "FrontSpin sync buttons");
  },
});

add({
  id: "admin/reports-dashboards",
  opts: { tall: true },
  setup: openAdminTab("reports"),
});

add({
  id: "admin/reports-dashboards-current-access",
  opts: { tall: true },
  setup: async (page, h) => {
    await openAdminTab("reports")(page, h);
    await page.locator('button.ar-segbtn[data-view="access"]').click();
    await settle(page, 2000);
  },
});

/** Sharing -> Org-Wide Defaults -> the pencil on one object's row. */
const owdDialog = (label) => async (page, h) => {
  await openAdminTab("sharing")(page, h);
  await page.locator("tr").filter({ hasText: new RegExp(`^\\s*${label}`) }).first().getByRole("button", { name: "Edit" }).click();
  await settle(page, 1500);
};
add({ id: "admin/sharing-owd-dialog-field-scoped", setup: owdDialog("Contacts"), after: cancelDialog });
add({ id: "admin/sharing-owd-controlled-by-parent", setup: owdDialog("Task"), after: cancelDialog });

// The whole table: every report is Hourly here except one Off row (Field Type Lab); changing a
// row's schedule is a saved change, so no Daily or Weekly rows are set up for the picture.
add({ id: "admin/publish-schedule", opts: { tall: true }, setup: openAdminTab("pubsched") });
add({ id: "admin/publish-schedule-not-installed", setup: openAdminTab("pubsched") });

/*
 * Field Scoped sharing, as this org already has it: Contacts scoped on Email, Read/Write, with one
 * user value (acmeadmin2 -> user45.contact@example.com). Read-only: the Values window is opened and
 * closed without typing; Record Access only looks a record up and explains who reaches it.
 */
add({ id: "admin/sharing-owd-field-scoped", setup: openAdminTab("sharing") });

add({
  id: "admin/sharing-field-scope-values",
  setup: async (page, h) => {
    await openAdminTab("sharing")(page, h);
    await page.locator("tr").filter({ hasText: /^\s*Contacts/ }).first().getByRole("button", { name: "Values" }).click();
    await page.getByText(/Field Scope —/).first().waitFor({ timeout: 30_000 });
    await settle(page, 2000);
  },
  after: cancelDialog,
});

add({
  id: "admin/sharing-record-access-field-scope",
  setup: async (page, h) => {
    await openAdminTab("sharing")(page, h);
    await page.locator('button[data-tab="record"]').click();
    await settle(page, 1500);
    await page.locator("lightning-combobox.sh-recobj").first().locator("button").click();
    await page.waitForTimeout(700);
    await page.locator("[role=option]:visible").filter({ hasText: /^Contacts$/ }).first().click();
    await page.waitForTimeout(600);
    await page.getByPlaceholder("Type a name — or paste a record Id").fill("LastName 45"); // its Email is the scoped value
    await page.locator("tr.sh-resrow").first().waitFor({ timeout: 30_000 });
    await settle(page, 1500); // let the search finish; clicking the first answer too soon explains a stale pick
    await page.locator("tr.sh-resrow").first().click();
    await page.getByText("In your field scope", { exact: false }).first().waitFor({ timeout: 60_000 });
    await settle(page, 1500);
    await scrollToText(page, "Who has access — and why");
  },
});

add({
  id: "admin/publish-schedule-status-dialog",
  setup: async (page, h) => {
    await openAdminTab("pubsched")(page, h);
    await page.locator("span", { hasText: /^Warning$/ }).first().click(); // read-only detail
    await settle(page, 800);
  },
  after: cancelDialog,
});

/** CSV Import -> Submit a new list, a local file picked (read in the browser; nothing is sent). */
add({
  id: "admin/csv-import-new-list",
  opts: { tall: true },
  setup: async (page, h) => {
    await openAdminTab("csvimport")(page, h);
    await page.getByRole("button", { name: "Submit a new list" }).first().click();
    await settle(page, 2500);
    const here = path.dirname(fileURLToPath(import.meta.url));
    await page.locator('input[type="file"]').first().setInputFiles(path.join(here, "fixtures", "sample-list.csv"));
    await settle(page, 1500);
  },
});

// The org's only imports finished without failures, so the panel shows no failure reason, no
// "Repeats in the file" tile and no "Fix the rows that failed" button.
add({
  id: "admin/csv-import-my-lists-results",
  setup: async (page, h) => {
    await openAdminTab("csvimport")(page, h);
    await page.locator("button.linkish", { hasText: "Results" }).first().click(); // expands in place
    await settle(page, 1500);
    await center(page.getByText("Salesforce upload", { exact: true }).first());
  },
});

/* ------------------------------------------------------------------ profile, export */

// Only the Super Admin can sign in to this capture, so the role line reads "SuperAdmin User".
add({ id: "profile/view", setup: (page, h) => gotoTab(page, h.cfg, "Settings") });

/*
 * Export on the 116,686-row Person Test Report: Details Only, CSV, then Export. The rows are read
 * in the browser page by page (a download, nothing written to the org beyond the audit row every
 * export leaves); the picture is taken while "Fetching rows..." counts.
 */
add({
  id: "analytics/export-csv-progress",
  noSettle: true,
  setup: async (page, h) => {
    await openReport(R.PERSON)(page, h);
    await page.getByRole("button", { name: "Export", exact: true }).first().click();
    await settle(page, 1500);
    await page.locator('button.an-exp-card[data-view="details"]').click();
    await page.waitForTimeout(600);
    await page.locator('button.slds-combobox__input[data-value="Excel Format .xlsx"]').click();
    await page.waitForTimeout(600);
    await page.locator("[role=option]:visible").filter({ hasText: /^Comma Delimited \.csv$/ }).first().click();
    await page.waitForTimeout(800);
    const dlg = page.locator(".slds-modal, [role=dialog]").filter({ visible: true }).first();
    await dlg.getByRole("button", { name: "Export", exact: true }).click();
    await page.getByText(/Fetching rows\.\.\. [1-9][\d,]* of/).first().waitFor({ timeout: 60_000 });
    await page.waitForTimeout(300);
  },
  after: async (page) => {
    // let the export finish (it downloads into the capture browser), so the next shot starts clean
    await page.getByText(/Fetching rows/).first().waitFor({ state: "detached", timeout: 180_000 }).catch(() => {});
    await settle(page, 1000);
  },
});

/* ------------------------------------------------------------------ Salesforce side (sf: true)
 *
 * Signed in by frontdoor (see capture-2026-10.mjs). Dialogs are opened and cancelled; the typed
 * password is never submitted.
 */
const NS = "EasyCRM__";

/** A Lightning tab of the EasyCRM app, waited on until `marker` text is painted (in any frame). */
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

const sfCancel = async (page) => {
  await page.keyboard.press("Escape").catch(() => {});
  const c = page.getByRole("button", { name: "Cancel", exact: true }).filter({ visible: true });
  if (await c.count()) await c.last().click({ timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(600);
};

const sfRowMenu = async (page, email) => {
  await page.locator("tr").filter({ hasText: email }).first().getByRole("button", { name: /Show actions/ }).click();
  await page.waitForTimeout(1200);
};

// Nobody is locked out in this org, so the menu has no Unlock item.
add({
  id: "sf/portal-users-row-menu",
  sf: true,
  setup: async (page, h) => {
    await sfOpen(page, h, "Portal_Users", "acmeuser@example.com");
    await sfRowMenu(page, "acmeuser@example.com");
  },
  after: async (page) => { await page.keyboard.press("Escape").catch(() => {}); },
});

add({
  id: "sf/portal-users-new-user",
  sf: true,
  setup: async (page, h) => {
    await sfOpen(page, h, "Portal_Users", "acmeuser@example.com");
    await page.getByRole("button", { name: "New User" }).click();
    await page.getByRole("combobox", { name: "Manager" }).waitFor({ timeout: 30_000 }); // Role starts on Standard
    await page.waitForTimeout(800);
    await page.getByRole("combobox", { name: "Manager" }).click();
    await page.waitForTimeout(1200);
  },
  after: sfCancel,
});

add({
  id: "sf/portal-users-reset-password",
  sf: true,
  setup: async (page, h) => {
    await sfOpen(page, h, "Portal_Users", "acmeuser@example.com");
    await sfRowMenu(page, "acmeuser@example.com");
    await page.locator("[role=menuitem]:visible").filter({ hasText: /^Reset Password$/ }).first().click();
    await page.waitForTimeout(2000);
    await page.locator("section[role=dialog], .slds-modal").filter({ visible: true }).first().locator("input").first()
      .fill("Spring-Example-2026"); // shown in clear text; never submitted
    await page.waitForTimeout(600);
  },
  after: sfCancel,
});

// The Snapshots table sits below some 25 synced reports, out of this picture (and it is empty here).
add({
  id: "sf/portal-reports-search",
  sf: true,
  setup: async (page, h) => {
    await sfOpen(page, h, "Portal_Users", "Find a report");
    const box = page.getByPlaceholder("Search report name...").first();
    await box.click();
    await box.fill("Account");
    await page.getByRole("button", { name: "Sync to Site" }).first().waitFor({ timeout: 30_000 });
    await page.getByText("Portal Reports", { exact: true }).first().evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.mouse.move(800, 950);
    await page.waitForTimeout(1200);
  },
});

add({
  id: "sf/app-publish-reports",
  sf: true,
  setup: (page, h) => sfOpen(page, h, "Publish_Portal_Reports", "Not published"),
});

/** Move the browser clock to `leftMs` before the end of this session, as the timer counts it. */
async function leaveOnClock(page, leftMs) {
  const v = await page.evaluate((k) => JSON.parse(localStorage.getItem(k) || "null"), LS("mh_portal_exp"));
  if (!v || !Number.isFinite(Number(v.exp))) throw new Error("no session expiry in the browser");
  // Land 31 s short of the target, then let 31 s of browser time run: the timer checks the clock
  // every 30 s while far from the end, so one check falls inside that window.
  await page.clock.setSystemTime(Number(v.exp) - Number(v.off || 0) - leftMs - 31_000);
  await page.clock.runFor(31_000);
  await page.waitForTimeout(1500);
}

const installClock = async (page) => {
  await page.clock.install({ time: Date.now() });
};

add({
  id: "session/countdown-chip",
  fresh: true,
  beforeSignIn: installClock,
  setup: async (page, h) => {
    await gotoTab(page, h.cfg, "Home");
    await leaveOnClock(page, 3 * 60_000 - 500);
    // The warning opens at five minutes; close it (x) so the chip in the top bar is the subject.
    const x = page.locator("button.pst-x").filter({ visible: true });
    if (await x.count()) await x.first().click();
    await page.mouse.move(700, 600);
    await page.waitForTimeout(800);
  },
});

add({
  id: "session/expiry-warning",
  fresh: true,
  beforeSignIn: installClock,
  setup: async (page, h) => {
    await gotoRecord("Account", NAME45)(page, h);
    await leaveOnClock(page, 4 * 60_000 + 30_000);
  },
});

/*
 * session/sign-in-again: the delivered image is a real expiry - the capture session reached its
 * two hours while Name 45 was in inline edit with Billing City changed (not saved). This entry
 * reproduces the same screen with the browser clock instead of a two-hour wait.
 */
add({
  id: "session/sign-in-again",
  fresh: true,
  beforeSignIn: installClock,
  setup: async (page, h) => {
    await gotoRecord("Account", NAME45)(page, h);
    await page.locator("button.slds-button_icon-small[title='Edit']").first().click();
    await settle(page, 1500);
    await page.locator("input:visible").nth(4).fill("Honolulu"); // Billing City - staged only
    await leaveOnClock(page, -2000);
    await page.waitForTimeout(1500);
  },
});

export default shots;
