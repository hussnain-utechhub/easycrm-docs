---
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
