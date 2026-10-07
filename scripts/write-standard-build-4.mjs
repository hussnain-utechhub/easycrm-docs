/* Standard Build, part 4: the three dashboards. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};
const cat = { "standard-build/dashboards": { label: "Dashboards", position: 4, collapsed: true } };

f["standard-build/dashboards/index.md"] = `---
title: About the dashboards
sidebar_position: 0
---

# Dashboards

Three, each answering a different question.

| Dashboard | Answers |
|---|---|
| [Calling Dashboard](./calling.md) | How is the calling going? |
| [Calling Dashboard V2](./calling-v2.md) | The same, plus data quality and which lists are being worked |
| [P1 Tracker](./p1-tracker.md) | Where has our best-quality population got to? |

## The pattern every tile follows

Almost every number is a **metric tile reading a formula column**, not a record count:

| Tile shows | Is |
|---|---|
| A whole number | **Sum of** a row-level formula — see [Formula columns](../reports/formulas.md) |
| A percentage | A **summary formula**, usually that sum divided by the row count |
| A trend | The same sum, as a line over Date |

So "Connects" and "Dial to Connect %" come from **one** report — the same column, read two ways.

## Ranges, and what they mean

Every metric tile has two range breakpoints that colour the number red, amber or green. They are
**targets, not data** — somebody chose them, and they are the only thing on these dashboards that
encodes an opinion about what good looks like.

If a tile is permanently red or permanently green, the ranges are probably wrong rather than the
calling.

## Filters come from different objects

Each dashboard filter maps to a field on a specific object, and getting that wrong is the most
common way to build a dashboard that filters nothing:

| Filter | Lives on |
|---|---|
| Date | **Activity** |
| FS Created By | **Activity** |
| FS Last List Name | **Activity** |
| Campaign // List Name | **Contact** |

A filter on an Activity field cannot narrow a report built on Contacts & Accounts, and vice
versa. That is why the two calling dashboards have different filter sets.

## Before you share one

**View Dashboard As** decides whose records the figures count. Set it deliberately — a dashboard
running as one person shows that person's visibility to everybody who opens it.

## Where this fits

The reports behind them are [the calculation reports](../reports/calculation.md) and
[the P1 Tracker reports](../reports/p1-tracker.md).
`;

f["standard-build/dashboards/calling.md"] = `---
title: Calling Dashboard
sidebar_position: 1
---

# Calling Dashboard

**The funnel, rep by rep.** Five stages, each shown three ways: a count, a conversion percentage,
and a trend.

![Calling Dashboard](../../img/shots/standard-build/calling-dashboard.png)

## Filters

| Filter | From |
|---|---|
| **Date** | Activity |
| **Campaign // List Name** | Contact |
| **FS Created By** | Activity |

## The grid

Five rows, three columns. Reading across a row gives you the stage; reading down the first column
gives you the funnel.

| Stage | Count | Conversion | Trend |
|---|---|---|---|
| Dials | Totals Dials | Dials by Rep *(table)* | Dial Trend |
| Connects | Connects | Dial To Connect % | Connects Trend |
| Completions | Completions | Connect to Completion % (C2C) | Completions Trend |
| Activated | Activated | Completion to Activation % | Activated Trend |
| Meetings | Meetings Scheduled | Meeting Scheduled % | Meetings Scheduled Trend |

## Tile by tile

| Tile | Report | Shown as | Measure | Ranges |
|---|---|---|---|---|
| Totals Dials | Rep Totals Dials | Metric | Sum of Rep Attempts | 33 / 67 |
| Dials by Rep | Rep Totals Dials | Table, grouped by FS Created By | Record Count | — |
| Dial Trend | Rep Totals Dials | Line — Date × Sum of Rep Attempts | | — |
| Connects | Connects | Metric | Sum of Connects Counter | 10 / 40 |
| Dial To Connect % | Connects | Metric | D2C% | 15 / 20 |
| Connects Trend | Connects | Line — Date × Sum of Connects Counter | | — |
| Completions | Completions | Metric | Sum of Correct Completes | 10 / 35 |
| Connect to Completion % (C2C) | Completions | Metric | Correct Complete % | 50 / 60 |
| Completions Trend | Completions | Line — Date × Sum of Correct Completes | | — |
| Activated | Activated | Metric | Sum of Activated Connects | 5 / 18 |
| Completion to Activation % | Activated | Metric | Activated Connects % | 15 / 20 |
| Activated Trend | Activated | Line — Date × Sum of Activated Connects | | — |
| Meetings Scheduled | Meetings Scheduled | Metric | Sum of Meeting Scheduled Connects | 2 / 4 |
| Meeting Scheduled % | Meetings Scheduled | Metric | Meeting Scheduled Connect % | 5 / 10 |
| Meetings Scheduled Trend | Meetings Scheduled | Line — Date × Sum of Meeting Scheduled Connects | | — |

Every report above is in [the calculation reports](../reports/calculation.md); every measure is
in [Formula columns](../reports/formulas.md).

## Reading it

**Read down the first column, not across.** Dials → Connects → Completions → Activated →
Meetings is a funnel, and the interesting number is wherever it narrows most sharply.

**Each percentage is a conversion between two adjacent stages**, not a share of the total. Dial
to Connect % is connects ÷ dials; Connect to Completion % is completions ÷ connects.

**The trends share the same Date grouping**, so the five line charts can be compared directly.

## Four settings worth knowing

| Setting | Value | Why |
|---|---|---|
| Display Units | Full Number on metrics, Shortened Number on trends | A trend axis does not need every digit |
| Decimal Places | Automatic | |
| Max Groups Displayed | 100 | A trend or table silently stops at this many groups |
| Widget Theme | Light | |

## What goes wrong

| Symptom | Cause |
|---|---|
| Every tile reads zero | The date filter. These reports have no date of their own — the dashboard supplies it. |
| Dials far lower than expected | Check **Rep Totals Dials** for a stray filter — see [the warning](../reports/calculation.md#rep-totals-dials). |
| A percentage above 100% | The numerator and denominator are from different populations. Check the report's filter. |
| A tile stopped matching its report | Somebody edited a **DO NOT TOUCH** report. |

## Where this fits

The richer version is [Calling Dashboard V2](./calling-v2.md).
`;

f["standard-build/dashboards/calling-v2.md"] = `---
title: Calling Dashboard V2
sidebar_position: 2
---

# Calling Dashboard V2

The same funnel, with three things the first one does not have: **data quality**, **which lists
are being worked**, and **a stage between connect and completion**.

![Calling Dashboard V2](../../img/shots/standard-build/calling-dashboard-v2.png)

## What changed from V1

| Added | Why |
|---|---|
| **Activity by List** | Which calling lists are actually getting called |
| **Bad Data** — three tiles | How much of the list is wrong |
| **Connect Incomplete** — three tiles | Reached somebody but did not finish: a stage V1 hid |
| **Completions Breakdown** | *Why* calls completed, not just how many |
| **Activated Lead Table** and **Meetings Scheduled Table** | The actual people, not just a count |

| Removed | Why |
|---|---|
| Dials by Rep | The filter does the same job |
| The Activated and Meetings trends | Crowded out |

## Filters

| Filter | From |
|---|---|
| **Date** | Activity |
| **FS Created By** | Activity |
| **FS Last List Name** | Activity |

**Campaign // List Name is gone**, replaced by **FS Last List Name**. The first is a Contact
field, the second is an Activity field — so V2 filters by *the list the call was made from*
rather than *the list the contact belongs to*.

That is a meaningful difference. A contact can sit on one list and be called from another; V2
tells you about the calling, V1 about the people.

## Tile by tile

| Tile | Report | Shown as | Measure | Ranges |
|---|---|---|---|---|
| Totals Dials | Rep Totals Dials | Metric | Sum of Rep Attempts | 33 / 67 |
| Activity by List | Activity by List | Horizontal bar — Campaign // List Name × Record Count | | — |
| Bad Data | Bad Data | Metric | Sum of Bad Data | 1 / 4 |
| Bad Data | Bad Data | Metric | Bad Data % | 5 / 10 |
| Bad Data | Bad Data | **Donut** — sliced by Call Result | Sum of Bad Data | — |
| Connects | Connects | Metric | Sum of Connects Counter | 10 / 40 |
| Dial To Connect % | Connects | Metric | D2C% | 15 / 20 |
| Connects Trend | Connects | Line — Date × Sum of Connects Counter | | — |
| Connect Incomplete | Connect Incomplete | Metric | Sum of Connect - Incomplete | 4 / 10 |
| Connect Incomplete % | Connect Incomplete | Metric | Connect - Incomplete % | 5 / 25 |
| Connect Incomplete Trend | Connect Incomplete | Line — Date × Sum of Connect - Incomplete | | — |
| Completions | Completions | Metric | Sum of Correct Completes | 10 / 35 |
| Connect to Completion % (C2C) | Completions | Metric | Correct Complete % | 50 / 60 |
| Completions Breakdown | Completions Breakdown | **Donut** — sliced by Call Result | Record Count | — |
| Activated | Activated | Metric | Sum of Activated Connects | 5 / 18 |
| Completion to Activation % | Activated | Metric | Activated Connects % | 15 / 20 |
| Activated Lead Table | Activated Lead Table | **Table** — Account Name, Title, Follow Up Date | | — |
| Meetings Scheduled | Meetings Scheduled | Metric | Sum of Meeting Scheduled Connects | 2 / 4 |
| Meeting Scheduled % | Meetings Scheduled | Metric | Meeting Scheduled Connect % | 5 / 10 |
| Meetings Scheduled Table | Meetings Scheduled | **Table** — Account Name, Title, Follow Up Date | | — |

:::note
The **Meetings Scheduled Table** tile reads the **Meetings Scheduled** report displayed as a
table — not the separate
[Meetings Scheduled Table report](../reports/calculation.md#meetings-scheduled-table), which
exists but is not what this tile points at. Worth knowing before you edit either.
:::

## The three Bad Data tiles

They are the same report three ways, and they answer three different questions:

| Tile | Answers |
|---|---|
| **Count** | How many bad records did we find? |
| **Percent** | How bad is the list? |
| **Donut** | What kind of bad — wrong person, or gone? |

The donut is set to **combine small groups into "Others"**, show a total, sort the legend, and
display at most **six** values. Past six, everything else collapses into one slice — so a long
tail of distinct problems reads as a single blob.

## Connect Incomplete is the useful addition

V1 goes straight from Connects to Completions, so a call where somebody answered but the
conversation did not finish just looks like a missing completion.

V2 counts them. A rising **Connect Incomplete %** against a steady connect rate means calls are
being reached and lost — which is a coaching problem, not a list problem.

## What goes wrong

| Symptom | Cause |
|---|---|
| Activity by List is empty | Its filter is **Subject starts with Call**. Activities logged with another subject do not appear. |
| The Bad Data donut shows one slice | Six-value cap. Raise **Max Values Displayed**. |
| A table tile is cut off | Table tiles do not scroll far. Open the report. |
| Filtering by list changes nothing | **FS Last List Name** is an Activity field. A tile on a Contact report will not respond. |

## Where this fits

The simpler version is [Calling Dashboard](./calling.md). The people-oriented one is
[P1 Tracker](./p1-tracker.md).
`;

f["standard-build/dashboards/p1-tracker.md"] = `---
title: P1 Tracker
sidebar_position: 3
---

# P1 Tracker

The other two dashboards are about **calls**. This one is about **people** — where the
best-quality population has got to, and how much of it is still workable.

Every tile reads a Contacts & Accounts report, so there is not a Call Result anywhere on it.

## Filters

| Filter | From |
|---|---|
| **Campaign // List Name** | Contact |
| **Number of Submissions** | Contact |
| **Created Date** | Contact |

## The four bands

### 1. How big is each population?

Six table tiles, each grouped by **Campaign // List Name** with a record count and a total:

| Tile | Report |
|---|---|
| All Contacts | All Contacts |
| All P1's | All P1's |
| All P2's | All P2's |
| All P3's | All P3's |
| All Needs Attention | All Needs Attention |
| Scorable | All Scorable |

Grouping all six the same way is deliberate: the tiles line up, so you can read one list across
six tables.

**Scorable** is the one that is not a priority band — it is contacts that could be enriched but
have not been. See [the P1 Tracker reports](../reports/p1-tracker.md).

### 2. How many P1s can we actually call?

| Tile | Shown as |
|---|---|
| Total P1's in a P1 List | **Metric** — record count |
| Total P1's in a Callable List | **Stacked horizontal bar** — list × count, stacked by Bucket Status, with a reference line |
| Total P1's in a P1 List by Call Attempts | **Horizontal bar** — FS Total Calls × count |

The third is the most useful tile on the dashboard: it shows how many P1s have had **0 calls, 1
call, 2 calls** and so on. A large bar at zero means the list is not being worked; a long tail
means people are being called repeatedly without resolution.

The stacked bar carries a **reference line** — the target number of callable P1s per list.

### 3. Where have the P1s got to?

Six metric tiles, all record counts, all ranges 33 / 67:

| Tile | Bucket Status |
|---|---|
| P1's with Priority Bucket Status | Priority |
| P1's with Activated Bucket Status | Activated Lead, Meeting Scheduled, Unscheduled Intro Complete |
| P1's with Nurture Bucket Status | Nurture |
| P1's with Needs Attention Bucket Status | Needs Attention |
| P1's with DNC Bucket Status | DNC |
| P1's with Not in Swimlane Bucket Status | Not In Swimlane |

Read as a group, these say how the P1 population has **resolved**: how much is live work
(Priority, Activated), how much is parked (Nurture, Not In Swimlane, DNC) and how much is broken
(Needs Attention).

### 4. Which campaigns are producing?

Three horizontal bars, all grouped by **Campaign // List Name**:

| Tile | Shows |
|---|---|
| Activated Leads by Campaign // List Name | Which lists produced activations — sorted by **count** |
| Priority Follow Ups by Campaign // List Name | Where the outstanding work is — sorted by **list name** |
| Nurture, DNC, Not in Swim by Campaign // List Name | Where lists are dying — sorted by **count** |

Plus two about the follow-up backlog:

| Tile | Shows |
|---|---|
| Priority's Follow Up's - Days Since Follow Up Date | The backlog by age band — 0–7, 8–14, 15–21, 22–28, 29+, Future, No Date Set |
| Priority Follow Up's - Total Call Attempts | The backlog by how many times each has been called |

The age bands come from a [text formula](../reports/formulas.md#days-since-follow-up-date--prioritys---days-since-follow-up-date),
because a report cannot group on a raw date difference.

## How to read it in one minute

1. **All P1's** — how much good material is there?
2. **Total P1's in a P1 List by Call Attempts** — is it being called?
3. **The six bucket tiles** — what happened to the ones that were?
4. **Days Since Follow Up Date** — is the follow-up backlog ageing?

A large 29+ bar with a small Priority count means commitments are being made and not kept.

## What goes wrong

| Symptom | Cause |
|---|---|
| A tile counts far more than expected | These are **contact** reports. A contact appears once however many times they were called. |
| Filtering by list changes nothing on some tiles | Campaign // List Name is a Contact field; it only narrows Contact reports. |
| A bar chart is truncated | **Max Groups Displayed** is 100. |
| Scorable is near zero | Either everything is enriched, or **Best Phone Status** is not being written — check [the flow](../automation/best-phone.md). |

## Where this fits

The twenty-one reports behind it are [the P1 Tracker reports](../reports/p1-tracker.md).
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
