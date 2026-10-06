/* Rewrite of the reports and dashboards pages in the house style. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

f["reports-and-dashboards/reports.md"] = `---
title: Finding a report
sidebar_position: 1
---

# Finding a report

**What a report is.** A saved question about your data.

**What it does.** It gathers the records matching your rules and shows them, grouped and
totalled however you chose.

**Why it helps.** You build it once. After that it is always current, because it reads the
live data every time somebody opens it. There is no such thing as an out-of-date report.

## Opening the reports area

**Where:** **Reports** in the top menu

1. Click **Reports** in the row of tabs across the top.
2. The reports area opens.

![The Reports list](../img/shots/analytics/reports-list.png)

## What you are looking at

The screen has two parts.

**On the left: folders.** Reports are kept in folders, and the folder decides who can see
them.

| Folder | Who sees what is in it |
|---|---|
| **Recent** | Not a real folder — just what you opened lately. |
| **Favorites** | Reports you have starred. |
| **Private Reports** | Only you. |
| Any other folder | Whoever that folder is shared with. |

**On the right: the reports** in whichever folder you have selected, with who made each one
and when.

## Opening a report

1. Click a folder on the left to see what is inside it.
2. Click the report's **name**.
3. It runs and shows you today's answer.

See [Running a report](./run-a-report.md).

## Starring a report you use often

1. Find the report in the list.
2. Click the **star** beside its name.
3. It now appears under **Favorites** on the left.

Click the star again to remove it.

## Making a folder

**Where:** **Reports** → **New Folder**

1. Click **Reports** in the top menu.
2. Click **New Folder** at the top.
3. Type a name.

   ![A new folder](../img/shots/analytics/new-folder.png)

4. Click **Save**.

A new folder starts out visible only to you. To let a company see it, a Super Admin shares it
under [Reports and Dashboards](../administration/reports-dashboards.md).

## If you cannot find a report somebody mentioned

It is in a folder you cannot see. Ask them which folder it is in, then ask your administrator
to share that folder with your company.
`;

f["reports-and-dashboards/run-a-report.md"] = `---
title: Running a report
sidebar_position: 2
---

# Running a report

**What it is.** Opening a saved report to see today's answer.

**Why it helps.** A report is never out of date. It reads the data at the moment you open it,
so there is no old copy to worry about.

## Running one

**Where:** **Reports** → a folder → the report's name

1. Click **Reports** in the top menu.
2. Click the folder the report is in, on the left.
3. Click the report's **name**.
4. It runs. Large reports take a few seconds.

![A report](../img/shots/analytics/report-viewer-full.png)

## What you are looking at

- **Total Records** at the top — how many rows the report found.
- The table itself. If the report is grouped, each group has a heading and a subtotal.
- A chart above the table, if the report has one.
- Blue text is clickable. Click a record's name to open it.

## Changing what it shows, just for now

**Where:** an open report → **Filters**

1. With the report open, click **Filters**.
2. The panel opens showing the report's filters.

   ![The filters panel](../img/shots/analytics/report-filters-panel.png)

3. Change a value.
4. The report re-runs with your change.

**This does not change the saved report.** It only changes what you are looking at, and only
until you leave the page. Everybody else still sees the report as it was saved.

Some filters are **locked** by whoever built the report, and you cannot change or remove
those. That is how a report meant for one company stays limited to it.

To change the report permanently, click **Edit** — see
[The report builder](./report-builder.md).

## Getting the very latest numbers

Click **Refresh**. Reports remember their last result briefly so they open quickly, so use
**Refresh** when something has just changed and you need to see it.

## Taking it away with you

Click **Export** to download it as a spreadsheet — see [Exporting a report](./export.md).
`;

f["reports-and-dashboards/new-report.md"] = `---
title: Starting a new report
sidebar_position: 3
---

# Starting a new report

**What it is.** The first question a new report asks: what is this report about?

**What it does.** The **report type** decides which records the report can include and which
fields you can use.

**Why it matters.** The report type is fixed once the report exists. Choosing the wrong one
means starting again, so it is worth a moment's thought.

## Starting one

**Where:** **Reports** → **New Report**

1. Click **Reports** in the top menu.
2. Click **New Report** at the top right.
3. The report type chooser opens.

   ![Choosing a report type](../img/shots/report-builder/new-report.png)

4. Type into **Search Report Types...** to narrow the list.

   ![Searching report types](../img/shots/report-builder/report-types.png)

5. Click the type you want.
6. The builder opens, empty and ready.

See [The report builder](./report-builder.md) for what to do next.

## Choosing the right type

The type is named after the records it covers.

| Type | Gives you |
|---|---|
| **Accounts** | Accounts, and account fields only. |
| **Contacts** | Contacts, and contact fields only. |
| **Accounts with Contacts** | Both, one row per contact. |

If you need fields from two kinds of record in the same report, you must pick a type that
pairs them. You cannot add the second one later.

## "with" versus "with or without"

Some types come in two versions, and the difference matters.

| Type | What it includes |
|---|---|
| **Accounts with Contacts** | Only accounts that have at least one contact. |
| **Accounts with or without Contacts** | Every account, whether or not it has contacts. |

Pick **with or without** when you want to find the gaps — accounts nobody has a contact for,
for example. Pick **with** when a record is only interesting if it has the other thing.

Choosing **with** by accident is the usual reason a report shows fewer records than expected.

## Changing the type afterwards

Open the report in the builder and look for **Change Report Type**.

![Changing the report type](../img/shots/report-builder/change-report-type.png)

Changing it can drop columns and filters that the new type does not have, so the builder warns
you first.
`;

f["reports-and-dashboards/report-builder.md"] = `---
title: The report builder
sidebar_position: 4
---

# The report builder

**What it is.** The screen where you decide what a report shows.

**What it does.** You choose which records to include, which columns to show, how to group
them and what to total. A preview updates as you go, so you see the answer before you save.

**Why it helps.** Nobody has to export to a spreadsheet and rebuild the same summary every
week.

## Opening the builder

There are two ways in.

**For a new report** — **Reports** → **New Report** → pick a type. See
[Starting a new report](./new-report.md).

**For an existing report** — **Reports** → a folder → the report's name → **Edit**.

1. Click **Reports** in the top menu.
2. Click the folder, then the report's **name**. It runs.
3. Click **Edit** at the top.

The builder opens.

![The report builder](../img/shots/report-builder/overview.png)

## What you are looking at

| Part | Where | What it is for |
|---|---|---|
| **Outline** | Tab, top left | Your columns and groups. This is where you shape the report. |
| **Filters** | Tab, top left | Which records are included. |
| The preview | The large area on the right | What the report will look like. |
| **Report name** | Top | What it will be called. |
| **Undo** / **Redo** | Top | Step back or forward. |
| **Run** | Top right | See the full result rather than a preview. |
| **Save** | Top right | Keep it. |
| **Close** | Top right | Leave. You are warned if you have unsaved changes. |

Nothing is saved until you click **Save**, so you can experiment freely.

## Adding a column

**Where:** the builder → **Outline** → **Add column…**

1. Click the **Outline** tab if you are not already on it.

   ![The outline](../img/shots/report-builder/outline.png)

2. Click the **Add column…** box.
3. A list of available fields appears. Type to narrow it.

   ![Adding a column](../img/shots/report-builder/add-column.png)

4. Click the field you want.

It appears in the preview straight away.

## Reordering and removing columns

- **To reorder:** drag a column in the Outline list into a new position.
- **To remove one:** click **Column actions** on its heading, then **Remove column**.

![Column actions](../img/shots/report-builder/column-actions.png)

**Column actions** is also where you total a column — see
[Grouping and totals](./group-and-summarise.md).

## Saving your work

| Button | What it does |
|---|---|
| **Save** | Keeps your changes to this report. |
| **Save & Run** | Saves, then shows the full result. |
| **Save options → Save As** | Makes a copy under a new name and leaves the original alone. |

![Save options](../img/shots/report-builder/save-options.png)

The first time you save, you are asked for a name and a folder.

**Save As** is the safe way to experiment with somebody else's report: take a copy, change the
copy, leave theirs alone.

## Leaving without saving

Click **Close**. If you have unsaved changes you are warned first, so you cannot lose work by
accident.
`;

f["reports-and-dashboards/group-and-summarise.md"] = `---
title: Grouping and totals
sidebar_position: 5
---

# Grouping and totals

**What grouping is.** Gathering rows that share a value, so they appear together under one
heading.

**What a total is.** Adding up a column, for each group and for the whole report.

**Why it helps.** This is the difference between a list and an answer. "How many per rep this
month" is a grouping, not a search.

## Grouping rows

**Where:** the builder → **Outline** → **Add group…** under **Group Rows**

1. Open the report in the builder — see [The report builder](./report-builder.md).
2. Click the **Outline** tab.
3. Find **Group Rows**, and click the **Add group…** box under it.
4. Pick the field to group by — Owner, for example.

   ![Grouping rows](../img/shots/report-builder/group-rows.png)

The preview changes. Instead of a flat list you now get one block per value, each with its own
subtotal, and a grand total at the bottom.

**To group further**, add a second group. Each block is then broken down again inside itself.

**To remove a group**, click the small cross beside it, or use **Remove all groups**.

## Grouping across the top as well

**Where:** the builder → **Outline** → **Add group…** under **Group Columns**

This turns the report into a grid — a **matrix**.

1. In the **Outline** tab, find **Group Columns**.
2. Click the **Add group…** box under it.
3. Pick a field.

   ![Grouping columns](../img/shots/report-builder/group-columns.png)

You now have groups down the left **and** across the top, with a figure in every cell. Owner
down the side and month across the top, for example.

Use a matrix when the question has two dimensions. Use a plain grouping when it has one.

## Totalling a column

**Where:** the builder → a column heading → **Column actions**

1. In the preview, find the number column you want to total.
2. Click **Column actions** on its heading.
3. Choose how to summarise it.

| Option | Gives you |
|---|---|
| **Sum** | Everything added together. |
| **Average** | The mean. |
| **Min** | The smallest value. |
| **Max** | The largest value. |

The total now appears on every group heading and at the bottom of the report.

You can pick more than one. Sum and Average together is common.

## The three shapes a report can have

| Shape | What it looks like | Use it when |
|---|---|---|
| **Tabular** | A plain list, no groups | You want the records themselves. |
| **Summary** | Grouped down the side, with subtotals | You want totals per group. |
| **Matrix** | A grid, grouped down **and** across | You are comparing two things at once. |

You do not choose the shape from a menu — it follows from what you group. No groups is
tabular, row groups is summary, row and column groups is matrix.

## A report must be grouped to have a chart

A chart draws groups. If **Chart properties** does nothing, add a row group first. See
[Charts on a report](./charts.md).
`;

f["reports-and-dashboards/report-filters.md"] = `---
title: Report filters
sidebar_position: 6
---

# Report filters

**What they are.** The rules that decide which records a report includes.

**What they do.** A filter keeps the rows you want and drops the rest, before any grouping or
totalling happens.

**Why it helps.** A report with no filters answers "everything". Most useful questions are
narrower: this quarter, this owner, this status.

## Adding a filter

**Where:** the builder → **Filters** → **Add Filter**

1. Open the report in the builder — see [The report builder](./report-builder.md).
2. Click the **Filters** tab at the top left.

   ![Report filters](../img/shots/report-builder/filters.png)

3. Click **Add Filter**.
4. Choose three things:
   - **Field** — what to look at.
   - **Operator** — how to compare it: equals, contains, greater than, and so on.
   - **Value** — what to compare it to.
5. Click **Apply**.

The preview re-runs with fewer records.

By default a record must match **every** filter you add.

## Filter logic

Each filter has a number — 1, 2, 3 — in the order you added them.

1. In the **Filters** tab, click **Filter Logic**.
2. Type a rule using those numbers.

| Rule | Means |
|---|---|
| 1 AND 2 | Both must be true. This is the default. |
| 1 OR 2 | Either will do. |
| 1 AND (2 OR 3) | Filter 1, plus either 2 or 3. |
| 1 AND NOT 2 | Filter 1, but not filter 2. |

3. Click **Apply**.

Use **OR** when you want several alternatives — three different statuses, say. Use brackets
exactly as you would in arithmetic.

## Date filters

Most reports take a date range from a drop-down rather than two typed dates: this month, last
quarter, this year. Those move with time, so "last quarter" stays correct next month without
anybody editing the report.

Choose **Custom** when you need exact dates that should not move.

## Filtering a report while you read it

You do not have to open the builder to narrow a report you are looking at.

1. Open the report.
2. Click **Filters**.
3. Change a value.

![The filters panel](../img/shots/analytics/report-filters-panel.png)

This changes only your view, and only until you leave the page. The saved report is untouched.

## Locked filters

Some filters are set by whoever built the report and cannot be changed or removed by anybody
reading it. They are how a report meant for one company stays limited to that company.

If a filter will not change, it is locked. Ask whoever owns the report.
`;

f["reports-and-dashboards/dashboards.md"] = `---
title: Dashboards
sidebar_position: 11
---

# Dashboards

**What a dashboard is.** One screen holding several charts and numbers.

**What it does.** Each tile reads from a report and draws its result.

**Why it helps.** The questions people ask every morning get answered at a glance, instead of
five reports opened one after another.

## Opening a dashboard

**Where:** **Dashboards** in the top menu → a folder → the dashboard's name

1. Click **Dashboards** in the row of tabs across the top.
2. The list opens, laid out the same way as Reports — folders on the left, dashboards on the
   right.

   ![The Dashboards list](../img/shots/analytics/dashboards-list.png)

3. Click a folder, then the dashboard's **name**.
4. It opens and the tiles load.

![A dashboard](../img/shots/analytics/dashboard-viewer-full.png)

## What you are looking at

Each tile is one chart or number, and each reads from one report.

If a figure looks wrong, open the report behind the tile — that is where the number comes
from, and the dashboard is only drawing it.

## Narrowing the whole dashboard at once

If the dashboard has filters, they sit in a bar across the top.

1. Choose a value from a filter.
2. **Every tile** updates together.
3. Click **Clear all** to go back to the full picture.

See [Dashboard filters](./dashboard-filters.md).

## Getting the latest numbers

Click **Refresh** at the top.

Dashboards remember their last result so they open quickly, which matters when a dashboard has
twenty tiles. **Refresh** forces every tile to fetch fresh data.

## Changing a dashboard

Click **Edit** at the top to open the builder — see
[The dashboard builder](./dashboard-builder.md).

If **Edit** is missing, you have read-only access. Use **Save As** in the builder, or ask the
owner.
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Rewrote ${n} pages.`);
