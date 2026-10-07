---
title: The calculation reports
sidebar_position: 2
---

# The calculation reports

Eleven reports in **Buckets Dashboard**, every one marked **DO NOT TOUCH**. They exist only to be
read by a dashboard tile.

## What they have in common

Nine of the eleven are **matrix** reports on **Activities with Contacts** with the same shape:

| | |
|---|---|
| **Rows** | FS Created By, then Call Result |
| **Columns** | Date, then Status |
| **Detail columns** | Subject, First Name, Last Name, and **one formula column** |
| **Standard filters** | All activities · Completed Activities · Tasks and Events |
| **Date** | Custom — set from the dashboard, not the report |

The formula column is the point. The record count is never what a tile shows; the **sum of a
1-or-0 formula** is. Every one is written out in [Formula columns](./formulas.md).

## Rep Totals Dials {#rep-totals-dials}

**Every call attempt.** The denominator for everything else.

| | |
|---|---|
| Formula column | **Rep Attempts** — 1 for any recognised call result |
| Summary formula | **Total Dials** = `RowCount` |

:::warning
In the org checked, this report also carries a filter **First Name equals Chris**. That is not in
the original build document and looks like a leftover from testing — it would reduce Total Dials
to calls made to contacts with that first name, and every percentage built on it with them.
**Check this filter before trusting the dial figures.**
:::

## Connects {#connects}

**Calls where a human was reached.**

| | |
|---|---|
| Filter | Subject **contains** Call |
| Columns grouping | Date, then **Bucket Status** (not Status — this one is different) |
| Formula column | **Connects Counter** — 0 for the non-connect results, 1 for everything else |
| Summary formula | **D2C%** = Connects ÷ rows |

Connects Counter is written **inverted** — it lists what is *not* a connect and returns 1 for
everything else. That makes it the only formula here that counts a call result nobody thought of
as a connect. See [the defects](./formulas.md#known-defects).

## Connect Incomplete {#connect-incomplete}

**Reached somebody, did not finish the conversation.**

| | |
|---|---|
| Formula column | **Connect - Incomplete** — 1 when the result is Connect - Incomplete |
| Summary formula | **Connect - Incomplete %** |

## Completions {#completions}

**Calls that reached a conclusion.**

| | |
|---|---|
| Formula column | **Correct Completes** |
| Summary formula | **Correct Complete %** |

Counted as a completion: Meeting Scheduled, Activated Lead, Not Now, Not Me, Referred,
Not Interested, Not In Swimlane, Follow Up.

## Completions Breakdown {#completions-breakdown}

The same population **split by Call Result**, with no formula column — the chart is a record
count sliced by result.

| | |
|---|---|
| Rows | Call Result |
| Filter | Call Result equals Meeting Scheduled, Activated Lead, Not Now, Not Me, Referred, Not In Swimlane, Follow Up, Not Interested |

Feeds the donut on [Calling Dashboard V2](../dashboards/calling-v2.md).

## Activated {#activated}

**Calls that moved somebody forward.**

| | |
|---|---|
| Formula column | **Activated Connects** — Meeting Scheduled, Activated Lead, Follow Up, Unscheduled Intro |
| Summary formula | **Activated Connects %** |

## Meetings Scheduled {#meetings-scheduled}

| | |
|---|---|
| Formula column | **Meeting Scheduled Connects** — Meeting Scheduled, Unscheduled Intro |
| Summary formula | **Meeting Scheduled Connect %** |

## Bad Data {#bad-data}

**Calls that found the record was wrong.**

| | |
|---|---|
| Rows | Call Result (no rep grouping) |
| Formula column | **Bad Data** — Needs Attention, No Longer With Company |
| Summary formula | **Bad Data %** |

The one report here that measures the *data* rather than the calling. A rising Bad Data % means
the lists are decaying faster than they are being fixed.

## Activated Lead Table {#activated-lead-table}

| | |
|---|---|
| Format | **Tabular** |
| Filter | Call Result **equals** Activated Lead |
| Columns | Account Name, Title, Follow Up Date |

Three columns, because it is displayed as a table tile — not a number.

## Meetings Scheduled Table {#meetings-scheduled-table}

The same, with **Call Result equals Meeting Scheduled**.

## Activity by List {#activity-by-list}

**Which calling lists are actually being worked.**

| | |
|---|---|
| Format | **Summary** |
| Rows | Date, then **Campaign // List Name** |
| Filter | Subject **starts with** Call |
| Columns | FS Last List Name · Subject · First Name · Last Name · Account Name · Call Result · Call Result AI |

The only calculation report grouped by list rather than by rep, and the one that answers "is this
list being called at all?".

## Why "DO NOT TOUCH"

Changing a grouping, a column or a formula here changes a dashboard number **silently**. There is
no error and nothing turns red — the tile simply starts meaning something else.

If you need a variation, **clone the report** and point a new tile at the clone.

## Where this fits

The formulas are in [Formula columns](./formulas.md). What reads these is
[Calling Dashboard](../dashboards/calling.md) and
[Calling Dashboard V2](../dashboards/calling-v2.md).
