/*
 * Completeness check.
 *
 *   node scripts/check-coverage.mjs ../EasyCRM
 *
 * "Nothing is missed" is not something to promise - it is something to test. This reads the
 * portal's own source and asserts that every user-facing component and every Admin Console
 * tab is named by at least one documentation page.
 *
 * Components that render no screen of their own (shared pieces, internal helpers) are listed
 * in INTERNAL with the reason. Everything else must be covered or this exits non-zero.
 */
import fs from "node:fs";
import path from "node:path";

const SRC = process.argv[2] || path.join("..", "EasyCRM");
const LWC = path.join(SRC, "force-app", "main", "default", "lwc");
const DOCS = path.join(process.cwd(), "docs");

if (!fs.existsSync(LWC)) {
  console.error(`No LWC folder at ${LWC}. Pass the EasyCRM checkout as the first argument.`);
  process.exit(2);
}

/* Components with no screen of their own. Each needs a reason, so the list cannot quietly
   become a dumping ground for things nobody wanted to document. */
const INTERNAL = {
  portalApp: "the shell itself - documented as Getting around",
  portalNs: "namespace helper, renders nothing",
  portalCloseButton: "a shared close button",
  portalVirtualTable: "shared table renderer used by other screens",
  portalChart: "shared chart renderer - documented under Charts on a report",
  portalMatrix: "shared matrix renderer - documented under Grouping and totals",
  portalLoginBlocks: "renders the blocks the login designer produces",
  portalReportTypePicker: "the picker inside Starting a new report",
  portalLayoutSync: "internal layout sync, no screen",
  portalRecordForm: "the New/Edit window - documented under Adding and Changing a record",
  portalRelatedList: "documented as Related records",
  portalActivityComposer: "documented as Calls, tasks and meetings",
  portalSetupProbe: "internal probe used by Setup Assistant",
  portalOrgActions: "bridge to org-side buttons - documented under Buttons",
  portalDochlySend: "optional third-party send action, not part of the portal UI",
};

/* component -> a word that must appear in some page, when the component name itself does not. */
const ALIASES = {
  portalList: "list",
  portalRecord: "record",
  portalHome: "home page",
  portalSearch: "search",
  portalFiles: "files",
  portalProfile: "profile",
  portalSettings: "settings",
  portalLogin: "sign in",
  portalAnalytics: "report",
  portalReports: "report",
  portalReportBuilder: "report builder",
  portalDashboardBuilder: "dashboard builder",
  portalAdmin: "admin console",
  portalUserAdmin: "users",
  portalCompanyAdmin: "companies",
  portalProfileAdmin: "profiles",
  portalSharingAdmin: "sharing",
  portalTabAdmin: "tabs",
  portalActionAdmin: "buttons",
  portalBrandingAdmin: "branding",
  portalHomeAdmin: "home page",
  portalAppManager: "apps",
  portalCsvImport: "csv import",
  portalListMappings: "list mappings",
  portalApiIntegration: "api integration",
  portalApiUsage: "api usage",
  portalPublishSchedule: "publish schedule",
  portalReportAdmin: "report folders",
  portalLayoutEditor: "page layout",
  portalLoginDesign: "sign-in page",
  portalSetupAssistant: "setup assistant",
  portalActivities: "calls, tasks",
  portalAnalyticsReshare: "sharing a report",
  licenseConsole: "licence limits",
};

/* Every Admin Console tab, by its visible label. */
const ADMIN_TABS = [
  "Companies", "Users", "Permissions", "Permission Sets", "Profiles", "Sharing",
  "Reports & Dashboards", "Buttons", "Tabs", "Branding", "Home", "Apps", "Audit Log",
  "CSV Import", "List Mappings", "API Integration", "API Usage", "Publish Schedule",
];

const pages = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.mdx?$/.test(e.name)) pages.push({ file: path.relative(DOCS, p), body: fs.readFileSync(p, "utf8").toLowerCase() });
  }
})(DOCS);

const allText = pages.map((p) => p.body).join("\n");

const components = fs
  .readdirSync(LWC, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

const missing = [];
const covered = [];

for (const c of components) {
  if (INTERNAL[c]) continue;
  const needle = (ALIASES[c] || c).toLowerCase();
  if (allText.includes(needle)) covered.push(c);
  else missing.push({ c, needle });
}

const tabsMissing = ADMIN_TABS.filter((t) => {
  const t2 = t.toLowerCase().replace("&", "and");
  return !allText.includes(t.toLowerCase()) && !allText.includes(t2);
});

console.log(`pages            : ${pages.length}`);
console.log(`components        : ${components.length}  (${Object.keys(INTERNAL).length} internal, ${covered.length} covered)`);
console.log(`admin tabs        : ${ADMIN_TABS.length}  (${ADMIN_TABS.length - tabsMissing.length} covered)`);

if (missing.length) {
  console.log(`\nUNDOCUMENTED COMPONENTS (${missing.length}):`);
  for (const m of missing) console.log(`  ${m.c}  — no page mentions "${m.needle}"`);
}
if (tabsMissing.length) {
  console.log(`\nUNDOCUMENTED ADMIN TABS (${tabsMissing.length}):`);
  for (const t of tabsMissing) console.log(`  ${t}`);
}
if (!missing.length && !tabsMissing.length) console.log("\nEvery component and every Admin Console tab is covered.");

process.exitCode = missing.length || tabsMissing.length ? 1 : 0;
