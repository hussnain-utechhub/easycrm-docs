/* Standard Build, part 2a: how reports are built here, and the folders they live in. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};
const cat = { "standard-build/reports": { label: "Reports", position: 3, collapsed: true } };

f["standard-build/reports/index.md"] = `---
title: How the reports work
sidebar_position: 0
---

# Reports

Forty-four reports, in four groups. Knowing which group a report is in tells you whether you may
touch it.

| Group | How many | What they are for | Safe to edit |
|---|---|---|---|
| [Everyday](./everyday.md) | 6 | Lists people read each day | Yes |
| [Calculation](./calculation.md) | 11 | Feed the dashboards. All say **DO NOT TOUCH** | **No** |
| [Templates](./templates.md) | 6 | Copied to make FrontSpin calling lists | Copy, don't edit |
| [P1 Tracker](./p1-tracker.md) | 21 | Feed the P1 Tracker dashboard | Carefully |

## The naming convention

**A report whose name ends in DO NOT TOUCH or DON'T TOUCH is read by a dashboard tile.** Changing
its grouping, its columns or its formula columns changes the number on the dashboard — usually
without any error.

It is a convention, not a lock. Anyone with access can still edit one. Treat the suffix as a
label on a live wire.

**A report ending in (Template)** is meant to be **copied**, not run as-is. See
[Templates](./templates.md).

## The two report types

| Report type | Grain | Used for |
|---|---|---|
| **Activities with Contacts** | One row per activity–contact | Anything about calling |
| **Contacts & Accounts** | One row per contact | Anything about who people are |

This split is the single most useful thing to understand.

**A report about calls is built on Activities with Contacts.** It can group by Call Result, by
the rep who made the call, and by date, because those live on the activity.

**A report about people is built on Contacts & Accounts.** It can filter on Bucket Status and
Best Phone Status, because those live on the contact.

Asking an activity report "how many contacts are P1" counts *activities*, not people — that is
the mistake this split exists to prevent.

## Building one

**Where:** **Reports** → **New Report**

1. Click **Reports** in the top bar.
2. Click **New Report**.
3. Choose the **Report Type** — the two above cover nearly everything here. Choosing the type is
   the one decision that cannot be changed later.
4. Click **Start Report**.
5. In **Outline**, add **Groups** (what the rows and columns break down by) and **Columns**
   (the fields shown).
6. In **Filters**, set who and when.
7. Check the preview, then **Save & Run**.

:::note
The preview shows a limited number of records. A report that looks empty in the builder is often
fine when run — click **Run** before concluding anything.
:::

## Formula columns do the real work

Almost every number on the dashboards is a **formula column**, not a record count. There are two
kinds, and the difference matters:

| Kind | Works on | Example |
|---|---|---|
| **Row-level formula** | One row at a time | "Is this call a connect? 1 or 0" |
| **Summary formula** | A group total | "Connects ÷ total rows, as a percent" |

The pattern throughout this build is a row-level formula that returns **1 or 0**, summed by the
grouping, and a summary formula that turns that sum into a **percentage**.

Every one of them is written out in [Formula columns](./formulas.md).

## Standard filters on activity reports

Activity reports carry four filters that are easy to overlook, because Salesforce adds them
rather than you:

| Filter | Set to | Means |
|---|---|---|
| **Show Me** | All activities | Not just mine |
| **Date** | Varies by report | Which activities |
| **Show** | Completed Activities | Logged calls, not planned ones |
| **Show** | Tasks and Events | Both kinds |

**Completed Activities** is the one that catches people out. An open task is not a call that
happened, so it is excluded — which is right, and is why a report can look short.

## Where this fits

The folders these live in are [Folders](./folders.md). What reads them is
[Dashboards](../dashboards/index.md).
`;

f["standard-build/reports/folders.md"] = `---
title: Folders
sidebar_position: 5
---

# Report folders

Three folders, all under a parent called **Buckets**. Which folder a report is in says what it is
for and who should be changing it.

**Where:** **Reports** → **All Folders** → **Buckets**

## Buckets Reports

The everyday reports — the ones a person opens and reads.

| Report |
|---|
| [Today's Completions](./everyday.md#todays-completions) |
| [This Months Completions](./everyday.md#this-months-completions) |
| [All Meetings & Activated Leads](./everyday.md#all-meetings--activated-leads) |
| [Needs Attention Contacts](./everyday.md#needs-attention-contacts) |
| [This Months Meetings Scheduled](./everyday.md#this-months-meetings-scheduled) |
| [This Months Activated Leads](./everyday.md#this-months-activated-leads) |

Safe to edit, within reason. Nothing reads them automatically.

## Buckets Dashboard

The calculation reports behind the two calling dashboards. **Every one is marked DO NOT TOUCH.**

| Report |
|---|
| [Rep Totals Dials](./calculation.md#rep-totals-dials) |
| [Connects](./calculation.md#connects) |
| [Connect Incomplete](./calculation.md#connect-incomplete) |
| [Completions](./calculation.md#completions) |
| [Completions Breakdown](./calculation.md#completions-breakdown) |
| [Activated](./calculation.md#activated) |
| [Activated Lead Table](./calculation.md#activated-lead-table) |
| [Meetings Scheduled](./calculation.md#meetings-scheduled) |
| [Meetings Scheduled Table](./calculation.md#meetings-scheduled-table) |
| [Bad Data](./calculation.md#bad-data) |
| [Activity by List](./calculation.md#activity-by-list) |

**Keep this folder's access narrow.** A dashboard tile is only as stable as the report under it,
and these reports have no other purpose — nobody needs to open one to answer a question.

## List Templates for Frontspin Playbooks

Patterns for building a calling list, copied rather than run.

| Report |
|---|
| [P1 Contacts (Template)](./templates.md#p1-contacts) |
| [P2 Contacts (Template)](./templates.md#p2-contacts) |
| [P3 Contacts (Template)](./templates.md#p3-contacts) |
| [Priority Follow Ups (Template)](./templates.md#priority-follow-ups) |
| [Activated Follow Ups (Template)](./templates.md#activated-follow-ups) |
| [No Shows Follow Ups (Template)](./templates.md#no-shows-follow-ups) |

These are what a [FrontSpin report-to-list mapping](../../frontspin/lists/report-to-list.md)
points at — which is why the folder is named for playbooks.

## The P1 Tracker reports

The [P1 Tracker reports](./p1-tracker.md) sit in their own folder alongside the dashboard that
reads them.

## Folder access

**Where:** **Reports** → **All Folders** → the folder's row menu → **Share**

| Folder | Sensible access |
|---|---|
| Buckets Reports | Viewer for the calling team |
| Buckets Dashboard | Viewer for most; Editor for whoever maintains the dashboards |
| List Templates | Viewer for the calling team, Editor for whoever builds lists |

Giving everybody Editor on **Buckets Dashboard** is how a dashboard quietly starts reading
something different from what it used to.

## Where this fits

What the reports actually do starts at [How the reports work](./index.md).
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
for (const [rel, body] of Object.entries(cat)) {
  const dest = path.join(DOCS, rel, "_category_.json");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, JSON.stringify(body, null, 2) + "\n", "utf8");
}
console.log(`Wrote ${n} pages and ${Object.keys(cat).length} categories.`);
