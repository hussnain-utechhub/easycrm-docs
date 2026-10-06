/*
 * Give every existing page an opening that says what the feature IS and why it matters,
 * before the click-by-click steps. Also fixes sidebar order and removes the two pages
 * superseded by the deeper builder pages.
 */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");

/* The two original builder pages are replaced by report-builder.md / dashboard-builder.md
   and their companions, which cover the same ground properly. */
for (const gone of [
  "reports-and-dashboards/build-a-report.md",
  "reports-and-dashboards/build-a-dashboard.md",
]) {
  const p = path.join(DOCS, gone);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log("removed", gone);
  }
}

/* sidebar_position fixes so the section reads in a sensible order. */
const POSITIONS = {
  "reports-and-dashboards/reports.md": 1,
  "reports-and-dashboards/run-a-report.md": 11,
  "reports-and-dashboards/dashboards.md": 11.5,
};

/* page -> the intro that goes straight after the H1. */
const INTROS = {
  "getting-started/sign-in.md":
    "**What it is.** How you get into the portal.\n\n" +
    "**What you need.** A username and a password, which your administrator emails you. " +
    "Nothing to install — it runs in your web browser.",

  "getting-started/the-screen.md":
    "**What it is.** The bar across the top, which is the same on every page.\n\n" +
    "**Why it matters.** Once you know these few controls you can reach anything in the " +
    "portal, so this is the one page worth reading properly.",

  "getting-started/roles.md":
    "**What it is.** Your role, which decides what you can see and do.\n\n" +
    "**Why it matters.** Two people can open the same portal and see different tabs. That is " +
    "not a fault — it is the role doing its job.",

  "your-records/lists.md":
    "**What it is.** A table of records of one kind, such as all your accounts.\n\n" +
    "**What it does.** It shows many records at once, and lets you narrow, sort and search " +
    "them.\n\n" +
    "**Why it helps.** It is the fastest way to find a record, and the starting point for " +
    "most work in the portal.",

  "your-records/filters.md":
    "**What it is.** Rules that hide the records you are not interested in.\n\n" +
    "**What it does.** Only records matching every filter stay on screen.\n\n" +
    "**Why it helps.** A list of fifty thousand records answers nothing. A filtered list of " +
    "twelve answers a question.",

  "your-records/columns.md":
    "**What it is.** Control over which fields the list shows, and in what order.\n\n" +
    "**What it does.** You move fields in and out of the table and arrange them.\n\n" +
    "**Why it helps.** Each person can see the fields that matter to their job without " +
    "scrolling sideways past twenty they do not use. Your choice is remembered.",

  "your-records/open-a-record.md":
    "**What it is.** The page for a single record, with everything known about it.\n\n" +
    "**What it does.** It shows the fields, plus the calls, tasks, files and linked records " +
    "that belong to it.\n\n" +
    "**Why it helps.** Everything about one customer is in one place, so you are not piecing " +
    "it together from email and memory.",

  "your-records/edit-a-record.md":
    "**What it is.** Changing the information on a record.\n\n" +
    "**What it does.** Your change is saved immediately and everybody who can see the record " +
    "sees the new value.\n\n" +
    "**Why it matters.** There is no draft. When you click Save, it is live.",

  "your-records/create-a-record.md":
    "**What it is.** Adding a record that did not exist before.\n\n" +
    "**When to use it.** For one or two records. To add many at once, use a spreadsheet " +
    "instead — see [CSV Import](../administration/csv-import.md).",

  "your-records/tasks-and-events.md":
    "**What they are.** A **task** is something to do. An **event** is something in the " +
    "diary.\n\n" +
    "**Why they help.** They keep the follow-up attached to the customer it concerns, so the " +
    "next person to open the record knows where things stand.",

  "reports-and-dashboards/reports.md":
    "**What a report is.** A saved question about your data.\n\n" +
    "**What it does.** It gathers the records matching your rules and shows them, grouped and " +
    "totalled however you chose.\n\n" +
    "**Why it helps.** You build it once. After that it is always current, because it reads " +
    "the live data every time somebody opens it.",

  "reports-and-dashboards/run-a-report.md":
    "**What it is.** Opening a saved report to see today's answer.\n\n" +
    "**Why it helps.** A report is never out of date. It reads the data at the moment you " +
    "open it, so there is no such thing as an old copy.",

  "reports-and-dashboards/dashboards.md":
    "**What a dashboard is.** One screen holding several charts and numbers.\n\n" +
    "**What it does.** Each tile reads from a report and draws its result.\n\n" +
    "**Why it helps.** The questions people ask every morning get answered in one glance, " +
    "instead of five reports opened one after another.",

  "files/files.md":
    "**What it is.** Documents stored in the portal.\n\n" +
    "**What it does.** You upload a file once and anybody allowed to see it can open it.\n\n" +
    "**Why it helps.** Contracts and signed paperwork sit with the customer they belong to, " +
    "instead of in somebody's inbox.",

  "your-account/profile.md":
    "**What it is.** Your own details, and the settings that affect only you.\n\n" +
    "**Why it matters.** Changing things here never affects anybody else.",

  "your-account/password.md":
    "**What it is.** Setting a new password for yourself.\n\n" +
    "**Why it matters.** The password your administrator sent you arrived by email. Changing " +
    "it to something only you know is worth doing on your first day.",

  "administration/console.md":
    "**What it is.** The one place everything about running the portal is managed.\n\n" +
    "**Who sees it.** Only Admins and Super Admins. The tab does not appear for anybody else.",

  "administration/users.md":
    "**What it is.** Everybody who can sign in.\n\n" +
    "**What you do here.** Add people, set what kind of user they are, reset passwords, and " +
    "switch off anybody who has left.\n\n" +
    "**Why it matters.** This is the front door. Somebody switched off here cannot get in at " +
    "all, whatever other permissions say.",

  "administration/companies.md":
    "**What it is.** The companies whose people use the portal.\n\n" +
    "**What it does.** It groups users, and most access rules work company by company.\n\n" +
    "**Why it matters.** An Admin manages only their own company's people, and report folders " +
    "are shared per company. Somebody with no company set matches no company rule.",

  "administration/permissions.md":
    "**What it is.** What each role may DO with records.\n\n" +
    "**What it does.** For each kind of record you allow read, create, edit and delete.\n\n" +
    "**Why it matters.** This is only half of access. [Sharing](./sharing.md) decides WHICH " +
    "records. Somebody needs both, and read permission with no sharing shows an empty list.",

  "administration/permission-sets.md":
    "**What it is.** A bundle of extra access you hand to particular people.\n\n" +
    "**Why it helps.** When three people need more than the rest of their role, you give them " +
    "a permission set rather than widening the role for everybody.",

  "administration/profiles.md":
    "**What it is.** The baseline access for a kind of person.\n\n" +
    "**How it differs from a permission set.** A profile is what that kind of person always " +
    "needs. A permission set is the exception on top.",

  "administration/sharing.md":
    "**What it is.** Which records each person can see.\n\n" +
    "**How it differs from permissions.** [Permissions](./permissions.md) say what somebody " +
    "may do. Sharing says which records they may do it to.\n\n" +
    "**Why it matters most.** Get this wrong and either nobody can work, or everybody sees " +
    "everybody else's customers.",

  "administration/reports-dashboards.md":
    "**What it is.** Which companies can see which report folders.\n\n" +
    "**Why it helps.** It is how one company's reports stay out of another's sight, set once " +
    "per folder rather than report by report.",

  "administration/buttons.md":
    "**What it is.** Your own buttons on record pages.\n\n" +
    "**Why it helps.** If your team opens another system for every customer, a button can " +
    "take them straight there with the record already loaded.",

  "administration/tabs.md":
    "**What it is.** Which tabs appear across the top, and in what order.\n\n" +
    "**What it is not.** Hiding a tab hides the way in, not the data. Use " +
    "[Permissions](./permissions.md) and [Sharing](./sharing.md) to control access.",

  "administration/branding.md":
    "**What it is.** The portal's name, logo and colours.\n\n" +
    "**Why it helps.** People see their own company's name, not a product they have never " +
    "heard of.",

  "administration/home.md":
    "**What it is.** What everybody sees on the home page.\n\n" +
    "**What it does.** You turn cards on and off. Each card shows every person their own " +
    "data, so one setting suits everybody.",

  "administration/apps.md":
    "**What it is.** A named group of tabs people can switch between.\n\n" +
    "**Why it helps.** Sales and support see different sets of tabs without either having to " +
    "ignore the other's.",

  "administration/audit-log.md":
    "**What it is.** A record of who did what, and when.\n\n" +
    "**Why it matters.** It cannot be edited or deleted. That is the point: it is evidence, " +
    "not a convenience.",

  "administration/csv-import.md":
    "**What it is.** Loading many records at once from a spreadsheet.\n\n" +
    "**When to use it.** Moving in from another system, or adding a bought list. For one or " +
    "two records, just use **New** on the list.",

  "administration/list-mappings.md":
    "**What it is.** How an incoming spreadsheet's columns line up with your fields.\n\n" +
    "**Why it helps.** Set it up once and every later list from the same source lands in the " +
    "right place without anybody re-matching columns.",

  "administration/api-integration.md":
    "**What it is.** A way to let another system read your portal data automatically.\n\n" +
    "**What it does.** You create a key, choose exactly what it may read, and give it to the " +
    "other system.\n\n" +
    "**Why it is safe.** Keys can only read. Nothing can be changed or deleted through them.",

  "administration/api-usage.md":
    "**What it is.** How much each API key is being used.\n\n" +
    "**Why it helps.** It shows whether a key is working, which system is busiest, and " +
    "whether anything is being used more than you expected.",

  "administration/publish-schedule.md":
    "**What it is.** Copying portal reports into Salesforce on a timetable.\n\n" +
    "**Why it helps.** People who work in Salesforce see the same numbers as people in the " +
    "portal, without anybody rebuilding the report twice.",
};

const stripLead = (s) => s.replace(/^\s+/, "");

let changed = 0;
for (const [rel, intro] of Object.entries(INTROS)) {
  const p = path.join(DOCS, rel);
  if (!fs.existsSync(p)) {
    console.log("MISSING page:", rel);
    continue;
  }
  let s = fs.readFileSync(p, "utf8");

  if (s.includes("**What it is.**") || s.includes("**What a report is.**") || s.includes("**What they are.**") || s.includes("**What a dashboard is.**")) {
    continue; // already has one
  }

  // Insert straight after the first H1.
  const m = s.match(/^(#\s+.+?\n)/m);
  if (!m) {
    console.log("no H1 in", rel);
    continue;
  }
  const idx = s.indexOf(m[1]) + m[1].length;
  s = s.slice(0, idx) + "\n" + intro + "\n\n" + stripLead(s.slice(idx));
  fs.writeFileSync(p, s, "utf8");
  changed++;
}

// sidebar order
for (const [rel, pos] of Object.entries(POSITIONS)) {
  const p = path.join(DOCS, rel);
  if (!fs.existsSync(p)) continue;
  let s = fs.readFileSync(p, "utf8");
  s = s.replace(/^sidebar_position:\s*[\d.]+$/m, `sidebar_position: ${pos}`);
  fs.writeFileSync(p, s, "utf8");
}

console.log(`Added intros to ${changed} pages.`);
