/*
 * Move the flat site into two audience tracks, and split the sections that were too long.
 *
 *   node scripts/restructure.mjs
 *
 * Why two tracks: admins and end users were reading past each other's material. An end user
 * scrolling the sidebar hit "Restriction rules" and "Publish Schedule"; an admin looking for
 * sharing had to scroll past "Tasks and events". Neither audience got a sidebar that was
 * about them.
 *
 * Image paths are rewritten as files move, because the depth changes: a page at
 * docs/your-records/x.md reaches images with ../img, and the same page at docs/use/records/x.md
 * needs ../../img. Getting this wrong fails the build rather than silently 404ing, which is
 * the behaviour we want - relative image paths are resolved by webpack.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const DOCS = path.join(process.cwd(), "docs");

/* old path -> new path. Everything not listed stays where it is. */
const MOVES = {
  // ---------------- Using EasyCRM ----------------
  "getting-started/sign-in.md": "use/start/sign-in.md",
  "getting-started/the-screen.md": "use/start/the-screen.md",
  "getting-started/roles.md": "use/start/what-you-can-see.md",

  "your-records/lists.md": "use/records/lists.md",
  "your-records/filters.md": "use/records/filtering.md",
  "your-records/columns.md": "use/records/columns.md",
  "your-records/open-a-record.md": "use/records/opening-a-record.md",
  "your-records/edit-a-record.md": "use/records/editing.md",
  "your-records/create-a-record.md": "use/records/creating.md",
  "your-records/record-types.md": "use/records/record-types.md",
  "your-records/change-owner.md": "use/records/changing-owner.md",
  "your-records/related-lists.md": "use/records/related-records.md",
  "your-records/tasks-and-events.md": "use/activities/tasks-and-events.md",
  "your-records/activities.md": "use/activities/index.md",

  "reports-and-dashboards/reports.md": "use/reports/finding.md",
  "reports-and-dashboards/run-a-report.md": "use/reports/running.md",
  "reports-and-dashboards/new-report.md": "use/reports/report-types.md",
  "reports-and-dashboards/report-builder.md": "use/reports/builder-tour.md",
  "reports-and-dashboards/group-and-summarise.md": "use/reports/grouping.md",
  "reports-and-dashboards/report-filters.md": "use/reports/filters.md",
  "reports-and-dashboards/bucket-columns.md": "use/reports/buckets.md",
  "reports-and-dashboards/formulas.md": "use/reports/formulas.md",
  "reports-and-dashboards/charts.md": "use/reports/charts.md",
  "reports-and-dashboards/export.md": "use/reports/exporting.md",
  "reports-and-dashboards/folders.md": "use/reports/folders.md",
  "reports-and-dashboards/share-a-report.md": "use/reports/sharing.md",

  "reports-and-dashboards/dashboards.md": "use/dashboards/viewing.md",
  "reports-and-dashboards/dashboard-builder.md": "use/dashboards/builder.md",
  "reports-and-dashboards/dashboard-filters.md": "use/dashboards/filters.md",
  "reports-and-dashboards/dashboard-properties.md": "use/dashboards/settings.md",

  "files/files.md": "use/files/index.md",
  "your-account/profile.md": "use/account/profile.md",
  "your-account/password.md": "use/account/password.md",

  // ---------------- Administering EasyCRM ----------------
  "administration/console.md": "admin/index.md",
  "administration/users.md": "admin/users/index.md",
  "administration/companies.md": "admin/companies/index.md",

  "administration/permissions.md": "admin/access/permissions.md",
  "administration/profiles.md": "admin/access/profiles.md",
  "administration/permission-sets.md": "admin/access/permission-sets.md",

  "administration/sharing.md": "admin/sharing/index.md",
  "administration/sharing-defaults.md": "admin/sharing/defaults.md",
  "administration/sharing-rules.md": "admin/sharing/rules.md",
  "administration/public-groups.md": "admin/sharing/public-groups.md",
  "administration/roles.md": "admin/sharing/roles.md",
  "administration/restriction-rules.md": "admin/sharing/restriction-rules.md",
  "administration/record-access.md": "admin/sharing/record-access.md",

  "administration/page-layouts.md": "admin/layouts/index.md",

  "administration/branding.md": "admin/appearance/branding.md",
  "administration/login-design.md": "admin/appearance/login-design.md",
  "administration/tabs.md": "admin/appearance/tabs.md",
  "administration/apps.md": "admin/appearance/apps.md",
  "administration/home.md": "admin/appearance/home.md",
  "administration/buttons.md": "admin/appearance/buttons.md",

  "administration/csv-import.md": "admin/data/csv-import.md",
  "administration/list-mappings.md": "admin/data/list-mappings.md",
  "administration/api-integration.md": "admin/data/api-integration.md",
  "administration/api-usage.md": "admin/data/api-usage.md",
  "administration/publish-schedule.md": "admin/data/publish-schedule.md",
  "administration/reports-dashboards.md": "admin/data/report-folders.md",

  "administration/audit-log.md": "admin/operations/audit-log.md",
  "administration/setup-assistant.md": "admin/operations/setup-assistant.md",
  "administration/licence.md": "admin/operations/licence.md",
};

/* _category_.json for every folder, with the order the sidebar should use. */
const CATEGORIES = {
  use: { label: "Using EasyCRM", position: 1, collapsed: false },
  "use/start": { label: "Getting started", position: 1, collapsed: false },
  "use/records": { label: "Records", position: 2, collapsed: false },
  "use/activities": { label: "Calls, tasks and meetings", position: 3, collapsed: true },
  "use/reports": { label: "Reports", position: 4, collapsed: true },
  "use/dashboards": { label: "Dashboards", position: 5, collapsed: true },
  "use/files": { label: "Files", position: 6, collapsed: true },
  "use/account": { label: "Your account", position: 7, collapsed: true },

  admin: { label: "Administering EasyCRM", position: 2, collapsed: true },
  "admin/users": { label: "Users", position: 1, collapsed: true },
  "admin/companies": { label: "Companies", position: 2, collapsed: true },
  "admin/access": { label: "Permissions", position: 3, collapsed: true },
  "admin/sharing": { label: "Sharing", position: 4, collapsed: true },
  "admin/layouts": { label: "Page layouts", position: 5, collapsed: true },
  "admin/appearance": { label: "Appearance", position: 6, collapsed: true },
  "admin/data": { label: "Data in and out", position: 7, collapsed: true },
  "admin/operations": { label: "Operations", position: 8, collapsed: true },
};

const depthOf = (rel) => rel.split("/").length - 1;

/** Rewrite ../img and ../../img style links for the file's new depth. */
function fixPaths(body, oldRel, newRel) {
  const oldUp = "../".repeat(depthOf(oldRel));
  const newUp = "../".repeat(depthOf(newRel));
  if (oldUp === newUp) return body;

  // Images and links that climb to docs/ root: normalise to the new depth.
  return body.replace(/\]\((\.\.\/)+/g, (m) => {
    const climbed = (m.match(/\.\.\//g) || []).length;
    // A link that climbed all the way to docs root keeps doing so from the new depth.
    const extra = depthOf(newRel) - depthOf(oldRel);
    const now = Math.max(1, climbed + extra);
    return "](" + "../".repeat(now);
  });
}

let moved = 0;
const redirects = [];

for (const [from, to] of Object.entries(MOVES)) {
  const src = path.join(DOCS, from);
  const dst = path.join(DOCS, to);
  if (!fs.existsSync(src)) {
    console.log("MISSING:", from);
    continue;
  }
  fs.mkdirSync(path.dirname(dst), { recursive: true });

  let body = fs.readFileSync(src, "utf8");
  body = fixPaths(body, from, to);
  fs.writeFileSync(dst, body, "utf8");
  fs.unlinkSync(src);
  moved++;

  const url = (p) => "/" + p.replace(/\.md$/, "").replace(/\/index$/, "");
  redirects.push({ from: url(from), to: url(to) });
}

/* categories */
for (const [dir, cfg] of Object.entries(CATEGORIES)) {
  const d = path.join(DOCS, dir);
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, "_category_.json"), JSON.stringify(cfg, null, 2), "utf8");
}

/* drop the now-empty old folders and their category files */
for (const old of ["getting-started", "your-records", "reports-and-dashboards", "files", "your-account", "administration"]) {
  const d = path.join(DOCS, old);
  if (!fs.existsSync(d)) continue;
  const left = fs.readdirSync(d).filter((f) => f !== "_category_.json");
  if (left.length === 0) fs.rmSync(d, { recursive: true, force: true });
  else console.log(`KEPT ${old} - still has:`, left.join(", "));
}

fs.writeFileSync(
  path.join(process.cwd(), "scripts", "redirects.json"),
  JSON.stringify(redirects, null, 2),
  "utf8"
);

console.log(`Moved ${moved} pages into two tracks.`);
console.log(`Wrote ${redirects.length} redirects to scripts/redirects.json`);
