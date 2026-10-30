---
title: What a report sync brings across
sidebar_position: 4
---

# What a report sync brings across

**What it is.** What happens to a Salesforce report when you bring it into the portal — with
**Sync to Site**, through the **Sync & Share Folders** wizard, or with **Refresh** on the
**Already shared** list. All three use the same sync.

**Why it matters.** A synced report is a translation, not a copy. Almost everything comes across;
what does not is named in the message the sync shows you. Reading that message is how you know
whether the portal's numbers will match Salesforce's.

**Where:** In Salesforce → **App Launcher** → **EasyCRM** → **Portal Users** → **Portal Reports**.
See [Portal Users and Portal Reports](./portal-users.md) for the buttons themselves.

## Live, or a snapshot

The sync first tries to bring the report's **definition** across, so the portal runs it live
against current data. If the report uses something the portal cannot run, it stores a
**snapshot** of the report's results instead.

| You get | The toast says | What the portal holds |
|---|---|---|
| Live | **Synced live** (or **Refreshed**) | The report itself — columns, groupings, filters — run fresh by the portal |
| Snapshot | **Snapshot synced** (or **Refreshed as snapshot**) | A stored copy of the results, shown under **Synced from Salesforce** |

## What comes across on a live sync

| In the Salesforce report | In the portal copy |
|---|---|
| Name and folder | The same name, filed under the same folder name. |
| Columns | The same columns, headed with the **Salesforce report's own column labels** — "Phone", not the field's "Business Phone". |
| Groupings, down and across | The same row and column groupings. |
| **Sum**, **Average** and **Max** on the report's main object | The same summaries. (Min, Median and unique counts do not come across correctly — see below.) |
| Filters | The same filters and operators — including **does not contain**, and **includes** / **excludes** on multi-select picklists. |
| Filter logic, such as `1 AND (2 OR 3)` | Kept — but only when **every** filter came across, because a missing filter would shift the numbering. |
| Relative dates, such as **THIS MONTH** or **LAST 7 DAYS** | Translated into the portal's own relative dates, so they keep filtering. |
| The standard date filter, and an activity report's open / completed and tasks / events settings | Carried as the report's standard filters. |
| The sort | The first sort column and its direction. |
| Record type columns and filters | Shown and filtered by the record type's **name**. On activity reports, **Account Record Type** and **Contact Record Type** are each read from the right object. |
| A second object, as in **Contacts & Accounts** or **Activities with Contacts** | The same combination. Whether records with no related record are included is measured against the Salesforce report, not guessed from the report type's name. |
| Summary formulas | Every one the portal can calculate exactly. |
| Row-level formulas, and the chart | Read from Salesforce's reporting API. See [When formulas and the chart cannot be read](#when-formulas-and-the-chart-cannot-be-read). |

### Activity report columns

Four activity columns have names that match no field, so the sync translates them by hand:

| Salesforce column | In the portal |
|---|---|
| **Call Duration (minutes)** | A text column showing minutes and seconds — a 125-second call shows **2:05**. Blank on events, as in Salesforce. |
| **Full Comments** | The activity's full **Comments** text. |
| **Call Duration (seconds)** | The call's length in seconds. |
| **Assigned** | The name of the person the activity is assigned to. |

The **Call Duration (minutes)** column is held in the portal as a row-level formula the sync
adds itself. That is why it counts as one on the
[Sync Report Formulas](./sync-formulas.md) tab, and why publishing the report back writes it to
Salesforce as the original column rather than as a new formula.

## What does not come across

| What | What happens instead |
|---|---|
| The report's **Show Me** scope (*My records*, *My team's records* …) | The portal applies its own sharing to every report, so the scope is dropped. The message says so, because a narrower scope means the portal copy can show **more** rows. |
| A column the portal has no equivalent for | Left out, and **named** in the message. |
| A filter on such a column | Left out, and **counted** in the message. The portal copy can then show **more** rows. Any filter logic is dropped with it, so the remaining filters are all ANDed. |
| A summary on a field of the second object | Left out. |
| A **Min**, **Median** or unique-count summary | It arrives as a **Sum** of the same field. Change it back in the portal's report builder after syncing. |
| A bucket column, or a grouping by one | Left out — and, unlike other columns, **not** named in the message. Rebuild the bucket in the portal if you need it. |
| A summary or row-level formula the portal cannot calculate exactly | Left out rather than calculated wrongly. A row-level formula that is left out is named among the columns that could not come across. |
| A relative date the portal has no equivalent for, such as **7 DAYS AGO** | Kept exactly as Salesforce wrote it. Check that filter after syncing. |

## The messages

A live sync always starts with:

*Synced live from "…" (…). It runs on the site and always shows current data.* — with the
report's name in the quotes and its object in the brackets.

Anything that did not come across exactly is added as one more sentence after it. Each is
written in the direction that matters — whether the portal copy can show more rows, or fewer.

| Added sentence | What it means |
|---|---|
| *The "…" scope on the Salesforce report was not carried across - the portal applies its own sharing rules instead, so this copy can show more rows.* | The **Show Me** scope was narrower than all records. The portal shows whatever the person's sharing allows. |
| *2 columns could not be brought across and are not shown: "…", "…".* | The named columns are missing from the portal copy. Rows and counts are unaffected. (*1 column … is not shown* for one.) |
| *1 filter could not be translated and was not applied, so this copy may show more rows than the report in Salesforce.* | A filter is missing. Expect a **higher** count in the portal. (*filters … were* for several.) |
| *The report type name reads as though it includes records with no related record, but the Salesforce report was measured and does not - so this copy excludes them too, rather than showing rows the Salesforce report never had.* | A report type such as **Contacts & Accounts** sounds as if it includes contacts without an account, and does not. The portal copy matches Salesforce. |
| *This report shows no columns from the related object, but its Salesforce report type still only counts records that have one - measured - so this copy now matches it instead of counting the records without.* | Same idea: the report type quietly limits the rows, and the portal copy now does too. |
| *Row-level formulas and the chart setting could not be read (…), so a formula column may be missing from this copy. Use the "Sync Report Formulas" tab to bring the row-level formulas across.* | See below. |

<!-- SHOT: sf/sync-toast-unmapped-columns.png | Portal Reports card right after Sync to Site, the green "Synced live" toast showing the base sentence followed by "1 column could not be brought across and is not shown: …" -->

### When formulas and the chart cannot be read

Row-level formulas and the chart are not in the part of Salesforce's reporting API that Apex can
read, so the sync fetches them separately. When that fetch fails, the report still syncs, but:

- a row-level formula column may be missing — bring it across with
  [Sync Report Formulas](./sync-formulas.md);
- the chart is chosen from the report's shape instead: a horizontal bar chart for a matrix, a
  vertical bar chart for a summary, none for a tabular report.

The reason in brackets is either **no Salesforce API session** or **the Salesforce reporting API
did not answer**.

### Snapshot messages

| Message | What it means |
|---|---|
| *This report uses features the portal can't run live, so it was synced as a snapshot that refreshes on a schedule.* | A genuine limitation of the report. Despite the wording, nothing refreshes the snapshot for you — use **Refresh** on the Portal Reports card. |
| *The portal could not read this report's definition, so it was synced as a snapshot instead. This is a fault, not a limitation of the report - please report it:* (error) | Something went wrong reading the report. Report it with the error text. |

## What a re-sync does

Syncing a report that is already in the portal — from **Find a report**, or with **Refresh** on
the **Already shared** list — is a full sync again:

- **It overwrites the portal copy.** Changes made to that report in the portal are replaced by
  the Salesforce version.
- **It keeps the same portal report**, so company grants, re-shares and dashboard tiles that
  point at it keep working — as long as it comes back live.
- **It makes the report readable by every Admin of every company**, and by every user with no
  company, even if you had limited it to particular companies. See
  [Who can see a synced report](./portal-users.md#who-can-see-a-synced-report).
- **If it now comes back as a snapshot**, the live portal copy is deleted, and every grant and
  re-share on it with it.
- **A live result replaces any older snapshot** of the same report.
- The report's **Last Modified By** shows the Salesforce user who ran the sync.

Every sync is recorded in the portal's [Audit Log](../operations/audit-log.md) under
**Report: Import from Salesforce**, with your Salesforce username.

## What goes wrong

| Symptom | Cause |
|---|---|
| The portal shows more rows than Salesforce | A filter or the **Show Me** scope did not come across. The sync message says which. |
| A column you expected is missing | It is named in the sync message as one that could not be brought across — or it was a bucket column, which is left out without a mention. |
| A total reads as a sum where Salesforce shows a minimum, median or unique count | Those summaries arrive as a Sum. Change it in the portal's report builder. |
| A formula column is missing | The formulas could not be read during the sync, or the formula uses something the portal cannot calculate. Try [Sync Report Formulas](./sync-formulas.md). |
| A relative date filter does not narrow the report as it does in Salesforce | Salesforce used a form the portal has no equivalent for. Change the filter in Salesforce to a form such as **LAST 7 DAYS**, and sync again. |
| Your edits to a synced report disappeared | Somebody re-synced or refreshed it, which replaces the portal copy. |
| The chart differs from Salesforce's | The chart could not be read, so one was chosen from the report's shape. |
| A report that used to be live is now a snapshot | A re-sync could not run it live. The live copy — and its sharing — is gone. |

## Where this fits

- [Portal Users and Portal Reports](./portal-users.md) — the buttons that start a sync.
- [Syncing row-level formulas](./sync-formulas.md) — when the formulas did not come across.
- [Publishing a portal report to Salesforce](./publish-reports.md) — the opposite direction.
