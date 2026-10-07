/*
 * Enterprise-depth rewrite of the Reports section.
 *
 * Page shape, applied to every page:
 *   1. What it is, and why it exists
 *   2. When to use it — and when not to
 *   3. Step by step, naming every screen
 *   4. What each option means and how to choose
 *   5. What goes wrong, and how to tell
 *   6. Where it sits in the rest of the portal
 */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

const B = "**Where:** **Reports** → a folder → the report's name → **Edit**";

/* ------------------------------------------------------------------ landing */
f["use/reports/index.md"] = `---
title: Reports
sidebar_position: 0
slug: /use/reports
---

# Reports

A report is a saved question about your data. It gathers the records matching your rules and
shows them grouped and totalled however you chose.

The important part: **a report stores the question, not the answer.** It re-reads your live
data every time somebody opens it, so there is no such thing as an out-of-date report and no
copy to get stale.

## The two things you will do

**Run one somebody else built.** Most people only ever do this. Start at
[Finding a report](./finding.md), then [Running a report](./running.md).

**Build your own.** Choose what the report is about, pick columns, group, total, filter and
save. Start at [Report types](./report-types.md) — that choice is the one you cannot easily
undo.

## The whole section, in order

| Page | Covers |
|---|---|
| [Finding a report](./finding.md) | Folders, favourites, who can see what |
| [Running a report](./running.md) | Opening one, reading it, refreshing |
| [Report types](./report-types.md) | What a report is about. Fixed at creation |
| [The builder](./builder-tour.md) | Every control on the screen |
| [Columns](./columns.md) | Adding, ordering, removing |
| [Grouping](./grouping.md) | Rows, columns, and the three report shapes |
| [Totals](./totals.md) | Sum, average, minimum, maximum |
| [Filters](./filters.md) | Which records are included |
| [Filter logic](./filter-logic.md) | AND, OR, NOT and brackets |
| [Bucket columns](./buckets.md) | Categories you invent |
| [Formula columns](./formulas.md) | Row-level and summary calculations |
| [Charts](./charts.md) | Turning a grouping into a picture |
| [Saving](./saving.md) | Save, Save As, and working on somebody else's report |
| [Exporting](./exporting.md) | Spreadsheet downloads |
| [Folders](./folders.md) | Where reports live and who sees them |
| [Sharing](./sharing.md) | Giving another company access |

## The order that works

If you are building your first report, do it in this order. Each step depends on the one
before it.

1. **Report type** — what the report is about.
2. **Filters** — which records are in it.
3. **Columns** — which fields you can see.
4. **Grouping** — how rows gather together.
5. **Totals** — what gets added up.
6. **Chart** — optional, and only possible once you have a grouping.
7. **Save** — into a folder, with a name somebody else will understand.

Building out of order mostly works, but grouping before filtering means you are reading
totals of records you are about to remove.
`;

/* ------------------------------------------------------------------ columns */
f["use/reports/columns.md"] = `---
title: Columns
sidebar_position: 5
---

# Columns

## What a column is

One field, shown for every record the report includes. Columns are what the report *shows*;
[filters](./filters.md) decide what it *includes*.

## When you change them

Whenever the report is not answering the question. A report with the wrong columns is usually
not a broken report — it is one nobody has finished.

**When not to:** if you are about to add fifteen columns, you probably want
[grouping and totals](./grouping.md) instead. A wide report people scroll sideways through is
harder to read than a short grouped one.

## Adding a column

${B} → **Outline** → **Add column…**

1. Click **Reports** in the top menu.
2. Click the folder, then the report's **name**. It runs.
3. Click **Edit** at the top. The builder opens.
4. Click the **Outline** tab at the top left if you are not already on it.

   ![The outline](../../img/shots/report-builder/outline.png)

5. Click the **Add column…** box.
6. A list of available fields appears. Type to narrow it.

   ![Adding a column](../../img/shots/report-builder/add-column.png)

7. Click the field you want.

It appears in the preview immediately. Nothing is saved until you click **Save**.

## Which fields are offered

Only fields from the report's [type](./report-types.md). An Accounts report offers account
fields; an Accounts with Contacts report offers both.

If a field you expect is missing, the usual reasons are:

| Reason | What to do |
|---|---|
| Wrong report type | The type is fixed. See [Report types](./report-types.md). |
| You have no permission for that field | Ask your administrator. |
| It is on a related record the type does not reach | A different type may pair them. |

## Reordering

Drag a column in the **Outline** list. The order top-to-bottom there is the order
left-to-right in the report.

Put the record's name first. A report whose first column is a date is hard to scan, because
there is nothing to anchor each row to.

## Removing

1. In the preview, find the column heading.
2. Click **Column actions** on it.

   ![Column actions](../../img/shots/report-builder/column-actions.png)

3. Click **Remove column**.

**Remove all columns** clears them in one go. Useful when you have inherited a report and want
to start the layout again without losing the filters.

Removing a column never deletes data. It changes what this one report displays, nothing else.

## What goes wrong

| Symptom | Cause |
|---|---|
| The column shows but is always empty | The field is genuinely empty on those records. |
| Numbers will not total | It is a text field that looks numeric. Totals need a number field. |
| The report is very wide | Too many columns. Group instead — see [Grouping](./grouping.md). |

## Where this fits

Columns are one of four things the **Outline** tab holds: columns, row groups, column groups,
and the formula and bucket columns you invent. [The builder](./builder-tour.md) covers the
screen as a whole.
`;

/* ------------------------------------------------------------------ grouping */
f["use/reports/grouping.md"] = `---
title: Grouping
sidebar_position: 6
---

# Grouping

## What grouping is

Gathering rows that share a value, so they appear together under one heading with their own
subtotal.

It is the single step that turns a list into an answer. "Show me the accounts" is a list.
"How many accounts per owner" is a grouping.

## When to use it

When the question contains the words *per*, *by*, or *each*. Per rep. By month. Each region.

**When not to:** when somebody needs the records themselves — to work through them, or to
export and manipulate. Grouping gets in the way of both. Leave it ungrouped and let them
[export details only](./exporting.md).

## Grouping rows

${B} → **Outline** → **Add group…** under **Group Rows**

1. Open the report in the builder.
2. Click the **Outline** tab.
3. Find the **Group Rows** area and click the **Add group…** box under it.
4. Pick the field to group by.

   ![Grouping rows](../../img/shots/report-builder/group-rows.png)

The preview changes shape. Instead of a flat list you get one block per value, each with a
subtotal, and a grand total at the bottom.

### Grouping further

Add a second group and each block is broken down inside itself — owner, then within each
owner, by stage. Three levels is usually the practical limit before it stops being readable.

### Removing a group

Click the small cross beside it, or **Remove all groups** to clear them at once.

## Grouping across the top as well

${B} → **Outline** → **Add group…** under **Group Columns**

This makes the report a **matrix**: groups down the side *and* across the top, with a figure
in every cell.

1. In the **Outline** tab, find **Group Columns**.
2. Click the **Add group…** box under it.
3. Pick a field.

   ![Grouping columns](../../img/shots/report-builder/group-columns.png)

Owner down the side and month across the top gives you "how much did each rep do each month"
in one screen.

## Choosing what to group by

| Good grouping fields | Why |
|---|---|
| Owner, team, region | Few values, each meaningful |
| Stage, status, type | Naturally categorical |
| Month, quarter | Time, in sensible buckets |

| Poor grouping fields | Why |
|---|---|
| Anything unique, like a record name | One group per record — worse than no grouping |
| A free-text field | "London", "london" and "London " become three groups |
| An exact date | 365 groups a year. Group by month instead |

If the field you want to group by has too many values, invent your own categories with a
[bucket column](./buckets.md).

## The three shapes

You never pick the shape from a menu. It follows from what you group.

| Groups | Shape | Looks like |
|---|---|---|
| None | **Tabular** | A plain list |
| Rows only | **Summary** | Blocks with subtotals |
| Rows and columns | **Matrix** | A grid |

## What goes wrong

| Symptom | Cause |
|---|---|
| Hundreds of groups with one row each | Grouped by something nearly unique. |
| Values that should be one group are several | Free text with inconsistent spelling or spacing. |
| Subtotals are blank | Nothing is being totalled yet. See [Totals](./totals.md). |
| The chart option does nothing | A chart needs a grouping. Add one first. |

## Where this fits

Grouping produces the subtotals that [Totals](./totals.md) fill in, and the groups that
[Charts](./charts.md) plot. A [summary formula](./formulas.md) also needs a grouping to
calculate against.
`;

/* ------------------------------------------------------------------ totals */
f["use/reports/totals.md"] = `---
title: Totals
sidebar_position: 7
---

# Totals

## What a total is

A number column added up — once for each group, and once for the whole report.

[Grouping](./grouping.md) decides how rows gather. Totals decide what gets calculated for each
gathering.

## When to use it

Any time the answer is a quantity rather than a list. Totals are what make a grouped report
worth reading — without them you have headings over rows, and the reader does the arithmetic.

**When not to:** on an identifier that happens to be numeric. The sum of your account numbers
means nothing, and printing it invites somebody to believe it does.

## Adding a total

${B} → the column heading → **Column actions**

1. Open the report in the builder.
2. In the preview, find the number column you want.
3. Click **Column actions** on its heading.

   ![Column actions](../../img/shots/report-builder/column-actions.png)

4. Choose how to summarise it.

The total now appears on every group heading and at the bottom of the report.

## The four options

| Option | Gives you | Reach for it when |
|---|---|---|
| **Sum** | Everything added together | The quantity accumulates — value, hours, count |
| **Average** | The mean | You are comparing groups of different sizes |
| **Min** | The smallest value | Finding the earliest, cheapest or worst |
| **Max** | The largest value | Finding the latest, biggest or best |

You can pick more than one. Sum and Average together is common: the total tells you volume,
the average tells you whether one large record is carrying it.

## Choosing between Sum and Average

This is the choice people get wrong, and it changes the conclusion.

**Sum** answers "how much altogether". It rewards groups that are simply bigger.

**Average** answers "how much typically". It lets a small team look as good as a large one.

If you are comparing people or regions of different sizes, a Sum ranking mostly measures
headcount. Show both and the picture is honest.

## Totals and record counts

Every grouped report shows a **record count** per group whether or not you total anything. If
the question is "how many", you do not need a total at all — the count is already there.

## What goes wrong

| Symptom | Cause |
|---|---|
| The option is not offered | It is not a number field. Text that looks numeric cannot be totalled. |
| The total is far too large | A matrix counts each record once per cell it belongs to. Check the grouping. |
| Average looks wrong | It averages the records, not the subtotals. An average of averages is not the same number. |
| The grand total is not the sum of groups | Some records fall outside every group, or a filter changed after the groups were set. |

## Where this fits

A total is the input a [chart](./charts.md) plots, and the figure a
[summary formula](./formulas.md) calculates from. A dashboard **Metric** tile is usually a
report with one total on it — see [Dashboard tiles](../dashboards/builder.md).
`;

/* ------------------------------------------------------------------ filter logic */
f["use/reports/filter-logic.md"] = `---
title: Filter logic
sidebar_position: 9
---

# Filter logic

## What it is

A rule that says how your filters combine. By default every filter must match. Filter logic
lets you say "either of these" or "this but not that".

## When you need it

The moment a question contains **or**, or **except**.

"Open opportunities in the North **or** the West." "Every account **except** the ones we
already contacted." Neither is expressible with filters alone, because filters are joined with
*and*.

**When not to:** if all your conditions must be true, leave it alone. Writing
\`1 AND 2 AND 3\` is exactly what happens without it, and a rule you did not need is a rule
somebody has to understand later.

## Writing a rule

${B} → **Filters** → **Filter Logic**

1. Open the report in the builder.
2. Click the **Filters** tab.
3. Add the filters you need first. Each one takes a number in the order you add it.
4. Click **Filter Logic**.
5. Type a rule using those numbers.
6. Click **Apply**.

## The operators

| Operator | Means | Example |
|---|---|---|
| **AND** | Both must be true | \`1 AND 2\` |
| **OR** | Either will do | \`1 OR 2\` |
| **NOT** | Must not be true | \`1 AND NOT 2\` |
| **( )** | Do this part first | \`1 AND (2 OR 3)\` |

Brackets work exactly as they do in arithmetic, and they matter just as much:

| Rule | Means |
|---|---|
| \`1 AND 2 OR 3\` | Ambiguous. Avoid writing this. |
| \`(1 AND 2) OR 3\` | Both 1 and 2 — or else 3 on its own. |
| \`1 AND (2 OR 3)\` | 1 always, plus either 2 or 3. |

**Bracket anything with an OR in it.** It costs nothing and removes the ambiguity.

## A worked example

You want open opportunities, in the North or the West, that are not already marked lost.

| # | Filter |
|---|---|
| 1 | Stage equals Open |
| 2 | Region equals North |
| 3 | Region equals West |
| 4 | Status equals Lost |

Rule: \`1 AND (2 OR 3) AND NOT 4\`

## A shortcut worth knowing

For several values of the **same field**, you usually do not need logic at all. One filter
with multiple values — Region equals North, West — behaves as an OR between them.

Reach for filter logic when the OR spans **different fields**.

## What goes wrong

| Symptom | Cause |
|---|---|
| "Filter logic is invalid" | A number with no matching filter, usually after deleting one. Renumber the rule. |
| Far more records than expected | An unbracketed OR. \`1 AND 2 OR 3\` often means "or everything in 3". |
| Far fewer than expected | ANDs that cannot all be true at once — Region equals North AND Region equals West. |
| The rule stops working | A filter was removed and the numbers shifted. Logic does not renumber itself. |

**Delete a filter, re-read the rule.** That is the single most common way a working report
quietly starts returning the wrong set.

## Where this fits

Filter logic refines what [Filters](./filters.md) include. The same AND/OR/NOT grammar is used
when [filtering a list](../records/filtering.md), so learning it once covers both.
`;

/* ------------------------------------------------------------------ saving */
f["use/reports/saving.md"] = `---
title: Saving a report
sidebar_position: 14
---

# Saving a report

## What saving does

Stores the *question* — the type, columns, groups, totals, filters and chart. Not the answer.
Anyone opening it later re-runs it against live data.

## Nothing is saved until you say so

The builder changes nothing while you work. The preview updates, **Undo** and **Redo** step
through your changes, and none of it reaches anybody else until you click **Save**.

That makes the builder safe to explore in. It also means closing the tab loses everything.

## The three ways to save

${B} → **Save**, **Save & Run**, or **Save options**

![Save options](../../img/shots/report-builder/save-options.png)

| Button | What it does | Use it when |
|---|---|---|
| **Save** | Keeps your changes to this report | You own it and the change is wanted |
| **Save & Run** | Saves, then shows the full result | You want to check it against real volume |
| **Save options → Save As** | A copy under a new name | The report is somebody else's, or you are experimenting |

The first time you save, you are asked for a **name** and a **folder**.

## Save As is the one to reach for

If the report is not yours, **Save As** is almost always correct. It takes a copy, leaves the
original alone, and nobody else's dashboard changes under them.

Remember that a **Save** on a shared report changes it for everybody it is shared with — and
for every dashboard tile reading from it. There is no "just for me".

## Naming so somebody else can find it

The name is what people see in a folder of thirty. Say what it answers.

| Good | Poor |
|---|---|
| Open opportunities by owner — this quarter | Report 4 |
| Accounts with no activity in 60 days | Test copy |
| Monthly task completion by team | Sarah's report (final) v2 |

## Closing without saving

Click **Close**. If you have unsaved changes you are warned first, so you cannot lose work by
clicking the wrong thing.

## What goes wrong

| Symptom | Cause |
|---|---|
| "A report with that name already exists" | Names are unique within a folder. Rename, or pick another folder. |
| Save is refused | You have read-only access. Use **Save As**. |
| Your changes vanished | The tab was closed, or **Close** was taken past the warning. |
| Somebody else's dashboard changed | You used **Save** on a shared report. Use **Save As** next time. |

## Where this fits

A saved report lands in a [folder](./folders.md), and the folder decides who can see it. Once
saved it can be [shared with another company](./sharing.md), [exported](./exporting.md), or
used as the source for a [dashboard tile](../dashboards/builder.md).
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Wrote ${n} report pages at depth.`);
