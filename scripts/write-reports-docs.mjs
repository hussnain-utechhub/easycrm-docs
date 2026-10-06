/* Generator for the reports and dashboards pages. Run once, then edit the .md. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

f["reports-and-dashboards/_category_.json"] = JSON.stringify(
  { label: "Reports and dashboards", position: 4, collapsed: false },
  null,
  2
);

f["reports-and-dashboards/report-builder.md"] = `---
title: The report builder
sidebar_position: 3
---

# The report builder

**What it is.** The screen where you decide what a report shows.

**What it does.** You choose which records to include, which columns to show, how to group
them and what to total. The preview on the right updates as you go, so you see the answer
before you save.

**Why it helps.** Nobody has to export to a spreadsheet and rebuild the same summary every
week. You build it once, save it, and anyone you share it with gets the current numbers.

![The report builder](../img/shots/report-builder/overview.png)

## The parts of the screen

| Part | What it is for |
|---|---|
| **Outline** | Your columns and groups. This is where you shape the report. |
| **Filters** | Which records are included. |
| The preview | What the report will look like. |
| **Run** | See the full result. |
| **Save** | Keep it. **Save options** also offers Save As. |
| **Undo** / **Redo** | Step back or forward. Nothing is saved until you click Save. |

## Adding a column

1. Click **Add column…**
2. Pick a field.

![Adding a column](../img/shots/report-builder/add-column.png)

Drag columns to reorder them.

## Changing or removing a column

Click **Column actions** on the column heading.

![Column actions](../img/shots/report-builder/column-actions.png)

From here you can summarise the column, change how it shows, or remove it.

## Saving

| Button | What it does |
|---|---|
| **Save** | Keeps your changes to this report. |
| **Save & Run** | Saves, then shows the full result. |
| **Save options → Save As** | Makes a copy under a new name, leaving the original alone. |

![Save options](../img/shots/report-builder/save-options.png)

**Save As** is the safe way to experiment with somebody else's report.
`;

f["reports-and-dashboards/new-report.md"] = `---
title: Starting a new report
sidebar_position: 2
---

# Starting a new report

**What it is.** The first question a new report asks: what is this report about?

**What it does.** The report type decides which records you can include and which fields you
can use. "Accounts" gives you accounts and their fields. "Accounts with Contacts" gives you
both, one row per contact.

**Why it matters.** The report type is fixed once the report is created. Choosing the wrong
one means starting again, so it is worth a moment.

1. Click **Reports**.
2. Click **New Report**.

![Choosing a report type](../img/shots/report-builder/new-report.png)

3. Search for the type you want.

![Searching report types](../img/shots/report-builder/report-types.png)

4. Pick it, and the builder opens.

## With or without

Some types pair two kinds of record. The wording tells you what happens to records that have
no match:

- **Accounts with Contacts** — only accounts that have at least one contact.
- **Accounts with or without Contacts** — every account, whether or not it has contacts.

Pick "with or without" when you want to find the gaps, such as accounts nobody has a contact
for.
`;

f["reports-and-dashboards/group-and-summarise.md"] = `---
title: Grouping and totals
sidebar_position: 4
---

# Grouping and totals

**What it is.** Grouping gathers rows that share a value. A total adds up a column.

**What it does.** Instead of three thousand rows, you get one row per owner, per month or per
status, with a subtotal on each and a grand total at the bottom.

**Why it helps.** This is the difference between a list and an answer. "How many per rep this
month" is a grouping, not a search.

## Grouping rows

1. In the builder, click **Add group…**
2. Pick the field to group by.

![Adding a group](../img/shots/report-builder/add-group.png)

The report now shows one block per value, with a subtotal on each.

Add a second group to break each block down further.

## Totalling a column

1. Click **Column actions** on a number column.
2. Choose how to summarise it.

| Option | Gives you |
|---|---|
| **Sum** | Everything added together. |
| **Average** | The mean. |
| **Min** | The smallest value. |
| **Max** | The largest. |

The total appears on every group and at the bottom of the report.

## The three shapes

| Shape | What it looks like | Use it when |
|---|---|---|
| **Tabular** | A plain list | You want the records themselves. |
| **Summary** | Rows grouped, with subtotals | You want totals per group. |
| **Matrix** | A grid, grouped down **and** across | You are comparing two things at once. |

A matrix is the one to reach for when the question has two dimensions — owner by month, say,
or status by region.
`;

f["reports-and-dashboards/report-filters.md"] = `---
title: Report filters
sidebar_position: 5
---

# Report filters

**What it is.** The rules that decide which records a report includes.

**What it does.** A filter keeps the rows you want and drops the rest, before any grouping or
totalling happens.

**Why it helps.** A report without filters answers "everything". Most useful questions are
narrower than that: this quarter, this owner, this status.

## Adding one

1. In the builder, click **Filters**.
2. Click **Add Filter**.
3. Choose a field, choose how to compare it, type a value.

![Report filters](../img/shots/report-builder/filters.png)

By default a record must match **every** filter.

## Filter logic

To change that, use **Filter Logic**. Each filter has a number, and you write a rule with
them:

    1 AND (2 OR 3)

That means filter 1 must match, and either 2 or 3.

Use **NOT** to exclude, like this: 1 AND NOT 2.

## Date filters

Most reports take a date range from a drop-down — this month, last quarter, and so on —
rather than two typed dates. Choose **Custom** when you need exact dates.

## Filters when you run a report

A saved report can be filtered while you look at it, without changing what is saved.

![The filters panel](../img/shots/analytics/report-filters-panel.png)

Those changes last only as long as you are on the page.

Some filters are **locked** by whoever built the report. You cannot change or remove those,
which is how a report meant for one company stays limited to it.
`;

f["reports-and-dashboards/bucket-columns.md"] = `---
title: Bucket columns
sidebar_position: 6
---

# Bucket columns

**What it is.** A column you invent, which sorts values into groups you name.

**What it does.** You take an existing field and say "these values are Small, these are
Medium, these are Large". The report then has a column holding those names.

**Why it helps.** You can group and total by categories that matter to your business without
anybody adding a field to the database. No developer, no deployment.

## Making one

1. In the builder, click **Add column…**
2. Choose **Add Bucket Column**.
3. Pick the field to sort into buckets.
4. Name each bucket and say which values belong in it.
5. Click **Apply**.

Anything you do not place lands in **Unbucketed Values**, which you can rename.

## What you can bucket

| Field type | How it groups |
|---|---|
| **Picklist** | You drag values into named buckets. |
| **Number** | You set ranges, such as 0–99, 100–999. |
| **Text** | You list the values that belong in each bucket. |

## Using it

A bucket column behaves like any other column. You can group rows by it, group columns by it
in a matrix, and filter on it.
`;

f["reports-and-dashboards/formulas.md"] = `---
title: Formula columns
sidebar_position: 7
---

# Formula columns

**What it is.** A column that calculates its own value instead of reading a field.

**What it does.** You write a small expression and the report works out the answer for every
row, or for every group.

**Why it helps.** Percentages, differences and ratios stop being something you do afterwards
in a spreadsheet. The report is the finished answer.

There are two kinds, and the difference matters.

## Row-level formula

Calculates once **per record**.

1. Click **Add column…**
2. Choose **Add Row-Level Formula**.
3. Write the expression.
4. Click **Apply**.

Use it for things that are true of a single record — days between two dates, a value times a
rate.

## Summary formula

Calculates once **per group**, using the totals.

1. Click **Add column…**
2. Choose **Add Summary Formula**.
3. Write the expression.
4. Choose where it applies: at every grouping level, or only at the grand total.

Use it for things that only make sense across several records — a percentage of a total, a
conversion rate.

## Which one do I want?

Ask whether the answer makes sense for one record on its own.

- "How many days old is this?" — one record. **Row-level**.
- "What percentage of this month's total is this rep?" — needs the group. **Summary**.

Percentages are shown as percentages, so a formula returning 0.25 displays as 25%.
`;

f["reports-and-dashboards/charts.md"] = `---
title: Charts on a report
sidebar_position: 8
---

# Charts on a report

**What it is.** A picture of the report, above the table.

**What it does.** It draws whatever the report has grouped, using whatever the report totals.

**Why it helps.** A trend or an outlier is obvious in a chart and invisible in four hundred
rows.

A report must have at least one **group** before it can have a chart. The chart plots groups,
so without one there is nothing to draw.

## Adding one

1. In the builder, click **Chart properties**.
2. Choose the chart type.
3. Choose what it measures.

![Chart properties](../img/shots/report-builder/chart-properties.png)

4. Click **Apply**.

## Choosing a type

| Type | Best for |
|---|---|
| **Bar** / **Column** | Comparing groups against each other. |
| **Line** | A value changing over time. |
| **Pie** / **Donut** | Parts of a whole, when there are only a few. |

A pie with twenty slices tells nobody anything. Use a bar chart instead.

## Sliced by

If a report has more than one grouping, you can choose which one the chart uses. The same
report then answers two questions without being rebuilt.
`;

f["reports-and-dashboards/export.md"] = `---
title: Exporting a report
sidebar_position: 9
---

# Exporting a report

**What it is.** Downloading a report as a spreadsheet file.

**What it does.** Writes the report to a file you can open in Excel or Google Sheets.

**Why it helps.** For sending to somebody without a portal login, or for working on the
numbers somewhere else.

1. Open the report.
2. Click **Export**.
3. Choose the kind of export.
4. Click **Export**.

![Exporting](../img/shots/analytics/export.png)

## The two kinds

| Kind | What you get |
|---|---|
| **Formatted Report** | What you see — groups, subtotals and headings kept. |
| **Details Only** | Just the rows and columns, no grouping. Better for working on the data. |

Choose **Details Only** when the spreadsheet is a starting point. Choose **Formatted Report**
when it is the finished thing.
`;

f["reports-and-dashboards/folders.md"] = `---
title: Folders and sharing
sidebar_position: 10
---

# Folders and sharing

**What it is.** Folders hold reports and dashboards, and decide who can see them.

**What it does.** A report lives in exactly one folder. Who can open the folder decides who
can open the report.

**Why it helps.** It is how one company's reports stay out of another company's sight, without
anybody setting permissions report by report.

## The folders you always have

| Folder | Who sees it |
|---|---|
| **Private Reports** | Only you. |
| **Recent** | Not a real folder — just what you opened lately. |
| **Favorites** | Reports you starred. |

## Making a folder

1. Click **New Folder**.
2. Type a name.
3. Click **Save**.

![A new folder](../img/shots/analytics/new-folder.png)

## Who can see it

A Super Admin decides which companies a folder is shared with, under
[Reports and Dashboards](../administration/reports-dashboards.md) in the Admin Console.

A folder shared with nobody is visible only to Super Admins.

## Renaming a report, or moving it

Open the report and click **Edit Properties**.

![Report properties](../img/shots/analytics/edit-properties.png)

From here you change its name, its description and the folder it lives in.
`;

f["reports-and-dashboards/dashboard-builder.md"] = `---
title: The dashboard builder
sidebar_position: 12
---

# The dashboard builder

**What it is.** The screen where you arrange a dashboard.

**What it does.** You add tiles, point each at a report, and lay them out on a grid.

**Why it helps.** One screen answers the questions people ask every morning, instead of five
reports opened one at a time.

![The dashboard builder](../img/shots/dashboard-builder/overview.png)

## Adding a tile

1. Click **+ Widget**.
2. Choose the report it reads from.
3. Choose how it should look.
4. Click **Save**.

![Adding a widget](../img/shots/dashboard-builder/add-widget.png)

Every tile reads from a report. If the number on a tile looks wrong, open its report — that is
where the answer comes from.

## The kinds of tile

| Tile | Shows | Good for |
|---|---|---|
| **Metric** | One big number | A single figure people watch. |
| **Bar** / **Column** | Groups side by side | Comparing. |
| **Line** | A value over time | Trends. |
| **Pie** / **Donut** | Parts of a whole | A handful of categories. |
| **Gauge** | Progress to a target | Targets. |
| **Table** | Rows from the report | Detail. |

## Moving and resizing

Drag a tile to move it. Drag its corner to resize it. The grid snaps.

## Saving

**Save** keeps your changes. **Save As** makes a copy under a new name — the safe way to
change somebody else's dashboard.

![Save As](../img/shots/dashboard-builder/save-as.png)
`;

f["reports-and-dashboards/dashboard-filters.md"] = `---
title: Dashboard filters
sidebar_position: 13
---

# Dashboard filters

**What it is.** A control at the top of a dashboard that changes every tile at once.

**What it does.** You pick one value — an owner, a region, a month — and all the tiles narrow
to it together.

**Why it helps.** One dashboard serves everybody. Without filters you would need a copy per
team.

## Adding one

1. In the dashboard builder, click **+ Filter**.
2. Choose the field to filter by.
3. Add the values people can choose from.

![Adding a filter](../img/shots/dashboard-builder/add-filter.png)

4. Click **Save**.

## Apply to Each Component

Each tile reads from a different report, and those reports do not always name the same thing
the same way. One might call it **Owner**, another **Assigned To**.

**Apply to Each Component** is where you say which field on each report the filter matches.

Fields with the same name are matched for you. You only have to set the ones that differ.

A tile you leave unmapped ignores the filter and keeps showing everything — which looks like a
bug to whoever is reading the dashboard, so it is worth checking.

## Using one

Choose a value at the top of the dashboard. Click **Clear all** to go back to the full picture.
`;

f["reports-and-dashboards/dashboard-properties.md"] = `---
title: Dashboard settings
sidebar_position: 14
---

# Dashboard settings

**What it is.** The settings that apply to a whole dashboard rather than one tile.

**What it does.** Name, layout, colours, and whose data the dashboard shows.

**Why it helps.** The last of those is the one that matters most, and the one people miss.

In the dashboard builder, click **Properties**.

![Dashboard properties](../img/shots/dashboard-builder/properties.png)

## View Dashboard As

This decides **whose records** the dashboard counts.

| Setting | What people see |
|---|---|
| **The logged-in user** | Each person sees their own numbers. |
| **All data** | Everybody sees the same totals, across all records. |

Use **the logged-in user** for a dashboard each person uses for their own work. Use **all
data** for a company-wide view.

Getting this wrong is how a rep ends up looking at the whole company's figures, or a manager
at only their own.

## Grid size

How many columns the dashboard is divided into. More columns means finer control over tile
sizes.

## Themes

**Dashboard Theme** sets the page — **Light** or **Dark**. **Widget Theme** sets the tiles.
They are separate so tiles can stay light on a dark page.
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Wrote ${n} files.`);
