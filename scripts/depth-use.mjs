/* Depth pass: dashboards, activities, files and account. Completes the Using EasyCRM track. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

/* ------------------------------------------------------------- dashboards */
f["use/dashboards/index.md"] = `---
title: Dashboards
sidebar_position: 0
slug: /use/dashboards
---

# Dashboards

A dashboard is several answers on one screen. Each tile reads from a [report](../reports/index.md)
and draws its result as a number, a chart or a table.

**A dashboard never holds data of its own.** Every figure on it comes from a report. That one
fact explains most of what follows — including why a wrong number is almost never a dashboard
problem.

## What they are for

Dashboards answer the questions somebody asks *every* morning. If a question is asked once,
run a report. If it is asked daily by several people, it belongs on a dashboard.

| Page | Covers |
|---|---|
| [Viewing](./viewing.md) | Opening one, reading it, refreshing |
| [The builder](./builder.md) | Adding and arranging tiles |
| [Tiles](./tiles.md) | The six kinds and when to use each |
| [Filters](./filters.md) | Narrowing every tile at once |
| [Settings](./settings.md) | Grid, themes, and whose data it counts |

## The one setting that is worth understanding first

**View Dashboard As** decides whose records the dashboard counts — each viewer's own, or
everybody's. Getting it wrong produces numbers that look entirely plausible and are completely
wrong, with no error anywhere.

[Settings](./settings.md) covers it properly. If you build dashboards, read that page before
you share one.
`;

f["use/dashboards/tiles.md"] = `---
title: Tiles
sidebar_position: 3
---

# Tiles

## What a tile is

One chart, number or table, reading from one report.

Choosing the right kind is most of what makes a dashboard readable. The same report drawn as a
pie instead of a bar can go from obvious to useless.

## The six kinds

| Tile | Shows | Reach for it when | Avoid when |
|---|---|---|---|
| **Metric** | One large number | A single figure people watch daily | The number needs context to mean anything |
| **Bar** / **Column** | Groups side by side | Comparing groups | There is only one group |
| **Line** | A value over time | Showing a trend | The groups are not in time order |
| **Pie** / **Donut** | Parts of one whole | Three to six categories | More than about six slices |
| **Gauge** | Progress to a target | There is a real target | You have no target, only a number |
| **Table** | Rows from the report | People need the detail | It is longer than the tile |

## Choosing between bar and line

Both plot groups. The difference is whether the order means anything.

**Line** implies a sequence — it says "this followed that". Use it only when the groups are
genuinely ordered, which almost always means time.

**Bar** makes no such claim. Use it for owners, regions, stages, anything where the order is
arbitrary.

A line chart across sales reps implies a trend from Alice to Zoe that does not exist.

## Why a pie with twenty slices fails

A pie asks the reader to compare angles. People are poor at that beyond a handful of segments,
and the labels stop fitting. Past about six categories a bar chart is strictly easier to read.

If you have twenty categories and want a pie, the real answer is usually a
[bucket column](../reports/buckets.md) grouping them into five.

## Metric tiles need context

One big number is only useful if the reader knows whether it is good. "£412,000" means nothing
on its own.

Give it context by using a **gauge** against a target instead, or by placing it beside a
related metric so the comparison is on screen.

## Adding one

See [The dashboard builder](./builder.md). The short version: **+ Widget**, choose the report,
choose the kind, set the title, save.

## What goes wrong

| Symptom | Cause |
|---|---|
| The number is wrong | Open its **report**. The tile only draws what the report returns. |
| A chart is empty | The report has no grouping. Charts plot groups. |
| A table is cut off | The tile is too small, or the report returns too many rows. |
| The tile ignores a dashboard filter | It is unmapped. See [Filters](./filters.md). |

## Where this fits

A tile is a view of a [report](../reports/index.md). Change the report and every tile reading
from it changes — which is a feature when intended, and a surprise when not.
`;

/* ------------------------------------------------------------- activities */
f["use/activities/logging-a-call.md"] = `---
title: Logging a call
sidebar_position: 2
---

# Logging a call

## What it is

A record of a conversation that has **already happened**, stored against the account or contact
it concerned.

## When to use it

Straight after the call, while you still remember it. The value of a logged call is almost
entirely in the detail, and detail decays within the hour.

**When not to:** for something still to do. That is a [task](./tasks.md). The difference is
tense — a call is past, a task is future.

## Logging one

**Where:** **Accounts** → the record's name → **Log a Call**

1. Click the tab and open the record.
2. In the panel on the right, click **Log a Call**.
3. A short form opens.

   ![Logging a call](../../img/shots/records/log-a-call.png)

4. Type a **Subject** — what the call was about.
5. Add detail in the comments box.
6. Click **Save**.

It appears in the timeline below, dated today.

## Writing a subject somebody else can use

The subject is what appears in the timeline. It is read by people scanning months of history,
so it should survive being read alone.

| Good | Poor |
|---|---|
| Agreed renewal terms, sending quote Friday | Call |
| Not ready — revisit after their Q3 | Spoke to them |
| Complained about response times | Follow up |

The test: if you read only the subject in six months, would you know what happened?

## Where to log it

Against the **most specific** record that applies.

| Call about | Log it on |
|---|---|
| One person's situation | Their contact record |
| The company's contract | The account |
| A specific task | The task |

Logging against the account when you spoke to one of five contacts loses who you spoke to.

## What goes wrong

| Symptom | Cause |
|---|---|
| The call is not in the timeline | Timeline filters may exclude it. Check the Filters line. |
| It is on the wrong record | Open it, and change the related record. |
| You cannot edit it later | You may only change your own entries, depending on permissions. |

## Where this fits

Calls, [tasks](./tasks.md), [events](./events.md) and emails share one
[timeline](./index.md) on every record.
`;

f["use/activities/tasks.md"] = `---
title: Tasks
sidebar_position: 3
---

# Tasks

## What a task is

Something still to do, with a due date and somebody responsible.

## When to use it

Any commitment that would otherwise live only in your memory or your inbox. A task on the
record is visible to whoever picks the account up next; a note to yourself is not.

**When not to:** for something that already happened — that is
[logging a call](./logging-a-call.md). And not for a meeting with a start and end time, which
is an [event](./events.md).

## Creating one

**Where:** **Accounts** → the record's name → **New Task**

1. Open the record.
2. Click **New Task** in the panel on the right.

   ![A new task](../../img/shots/records/new-task.png)

3. Fill in:

| Field | Notes |
|---|---|
| **Subject** | What needs doing. Specific enough to act on. |
| **Due Date** | When. Tasks without one never surface as overdue. |
| **Assigned To** | Who. Defaults to you. |
| **Comments** | Anything the person needs to know. |

4. Click **Save**.

The task now appears under **My Tasks** on that person's home page.

## Always set a due date

A task with no due date cannot be overdue, so it never appears in the one place people
actually look. It exists, and it is invisible.

If you genuinely do not know when, pick a date to review it rather than leaving it blank.

## Assigning to somebody else

Change **Assigned To**. It moves to their **My Tasks** immediately.

They are not notified by the portal, so tell them. A task appearing silently in somebody's list
is not a handover.

## Completing one

1. Open the task — from **My Tasks**, the **Task** tab, or the record's timeline.
2. Click **Edit**.
3. Set the status to **Completed**.
4. Click **Save**.

It leaves **My Tasks** and stays in the record's history, which is the point: the record keeps
the fact that it was done.

## Finding yours

| Where | Shows |
|---|---|
| **My Tasks** on the home page | Your open tasks, overdue flagged in red |
| The **Task** tab | Every task you can see — see [Lists](../records/lists.md) |
| A record's timeline | Tasks on that record only |

## What goes wrong

| Symptom | Cause |
|---|---|
| Not in My Tasks | Assigned to somebody else, already completed, or no due date. |
| Overdue but not red | Red marks past the due date. Check the date is set. |
| Cannot change the assignee | Permissions. Ask your administrator. |

## Where this fits

Tasks and [events](./events.md) both appear on the home page — tasks under **My Tasks**, events
under **Upcoming Events**.
`;

/* ------------------------------------------------------------- files */
f["use/files/uploading.md"] = `---
title: Uploading a file
sidebar_position: 2
---

# Uploading a file

## Two places a file can go

This is the decision that matters, and it is made at upload time.

| Upload from | The file is | Who sees it |
|---|---|---|
| The **Files** tab | Standalone | Governed by its own sharing |
| A **record** | Attached to that record | Anybody who can see the record |

**Attaching to a record is usually right.** The contract sits with the customer it belongs to,
and access follows the record automatically — no separate decision to get wrong.

## Uploading to a record

**Where:** **Accounts** → the record's name → the **Files** section

1. Open the record.
2. Scroll to the **Files** section.
3. Upload there.

Anybody who can see the record can now see the file. Anybody who cannot, cannot.

## Uploading to the Files tab

**Where:** **Files** → **Upload Files**

1. Click **Files** in the top menu.
2. Click **Upload Files**.
3. Choose a file from your computer.

   ![Uploading](../../img/shots/files/upload.png)

4. Wait for it to finish. Large files take a moment.

Use this for things that do not belong to one record — a price list, a template, a policy.

## Naming files

The file name is all anybody has to go on in a list of hundreds.

| Good | Poor |
|---|---|
| Acme — signed MSA — 2026-03.pdf | scan001.pdf |
| Price list v4 (2026).xlsx | final final.xlsx |

Put the date in the name if the file will have successors. "Latest" stops being true.

## What goes wrong

| Symptom | Cause |
|---|---|
| Upload fails | File too large, or a blocked type. |
| A colleague cannot open it | Standalone file, or they cannot see the record it is on. |
| Two versions exist | Uploading again adds a file; it does not replace one. |
| The file is on the wrong record | Delete and re-upload in the right place. |

## Where this fits

Files attached to a record appear in the record's **Files** section — see
[Opening a record](../records/opening-a-record.md). Which sections appear is set by an
administrator in [Page layouts](../../admin/layouts/index.md).
`;

/* ------------------------------------------------------------- account */
f["use/account/display.md"] = `---
title: How the portal looks
sidebar_position: 3
---

# How the portal looks

## What you can change

Three things, all of which affect **only you**:

| Setting | Options | Where |
|---|---|---|
| Menu position | Top bar or left sidebar | The gear, top right |
| Colour theme | Several presets | The gear, top right |
| Row spacing | Comfy or Compact | Your name, top right |

Nobody else is affected and no data changes.

## Changing the menu and theme

**Where:** the gear (top right)

1. Click the **gear** symbol in the top right of any page.

   ![View settings](../../img/shots/shell/view-settings.png)

2. Under **Navigation**, choose:
   - **Top bar** — tabs across the top. More width for tables.
   - **Left sidebar** — tabs down the left. Easier when there are many tabs.
3. Under **Theme**, click a colour.
4. Click **Save**.

## Changing row spacing

**Where:** your name (top right)

1. Click your **name** in the top right.
2. Choose **Comfy** or **Compact**.

**Compact** fits noticeably more rows on screen. If you work through long lists, it is worth
the smaller text.

## Which to choose

| Situation | Suggestion |
|---|---|
| Wide tables, few tabs | Top bar |
| Many tabs | Left sidebar |
| Long lists, big screen | Compact |
| Occasional use | Comfy |

## Your administrator sets the default

The starting layout and theme come from [Branding](../../admin/appearance/branding.md). What
you choose here overrides it for you — and your choice sticks until you change it.

## What goes wrong

| Symptom | Cause |
|---|---|
| The setting reverted | It did not save. Reopen and click **Save**. |
| A colleague's portal looks different | They chose different settings, or a different app. |
| The theme looks wrong | Your administrator changed the branding theme. |
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Wrote ${n} pages.`);
