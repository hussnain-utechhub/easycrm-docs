---
title: What a report sync brings across
sidebar_position: 4
---

# What a report sync brings across

**What it is.** What happens to a Salesforce report when you bring it into the portal — with
**Sync to Site**, through the **Sync & Share Folders** wizard, with **Refresh** on the
**Already shared** list, or by [auto-sync](../data/report-auto-sync.md). All of them use the same
translation.

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
| Snapshot | **Snapshot synced** (or **Refreshed as snapshot**) | A stored copy of the results — which the portal no longer lists, so nobody can open it there |

When the portal copy differs from the Salesforce report in any way, the toast is a warning that
stays on screen until you close it, so the whole message can be read.

Auto-sync never makes a snapshot: a new report it cannot run live is listed as **Cannot run
live** instead.

## What comes across on a live sync

| In the Salesforce report | In the portal copy |
|---|---|
| Name and folder | The same name, filed under the same folder name. (One exception — see [What a re-sync does](#what-a-re-sync-does).) |
| Columns | The same columns, headed with the **Salesforce report's own column labels** — "Phone", not the field's "Business Phone". |
| Groupings, down and across | The same row and column groupings. A grouping Salesforce sorts in descending order is shown in descending order too. |
| **Sum**, **Average**, **Max**, **Min** and **Median** on the report's main object | The same summaries. |
| **Unique** counts on the report's main object | The same, on up to three fields. Not on activity reports. |
| Bucket columns, on a field of the report's main object | Rebuilt as the portal's own buckets on the same field, with the same buckets — and so are a grouping, a filter or a sort on one. Not on activity reports. |
| Filters | The same filters and operators — including **does not contain**, and **includes** / **excludes** on multi-select picklists. A filter Salesforce locks stays locked. |
| Filter logic, such as `1 AND (2 OR 3)` | Kept. If a filter could not come across, the rest of the logic is kept, renumbered, and the message says what it became. |
| Relative dates, such as **THIS MONTH** or **LAST 7 DAYS** | Translated into the portal's own relative dates, so they keep filtering. |
| The standard date filter, and an activity report's open / completed and tasks / events settings | Carried as the report's standard filters — on Close Date, a custom date field or a related record's date as well as the usual ones. |
| The sort | The first sort column and its direction. |
| Detail rows, subtotals, grand total and record count shown or hidden; a matrix's stacked summaries | The same. |
| Record type columns and filters | Shown and filtered by the record type's **name**. On activity reports, **Account Record Type** and **Contact Record Type** are each read from the right object. |
| A second object, as in **Contacts & Accounts** or **Activities with Contacts** | The same combination. Whether records with no related record are included is measured against the Salesforce report, not guessed from the report type's name; **Contacts & Accounts** always counts only contacts that have an account, as Salesforce does. |
| Summary formulas | Every one the portal can calculate exactly — and where Salesforce shows it: at every level, on one grouping only, or on the grand total only. |
| Row-level formulas, and the chart | Read from Salesforce's reporting API. The chart keeps its kind and how it is drawn — title, values, percentages, total, legend, small groups combined, a cumulative line, and the grouping and summary it charts. See [When formulas and the chart cannot be read](#when-formulas-and-the-chart-cannot-be-read). |

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

Nothing is dropped silently. Whatever the portal cannot reproduce exactly is **named** in the
sync message, together with which way it moves the count.

| What | What happens instead |
|---|---|
| The report's **Show Me** scope (*My records*, *My team's records* …) | The portal applies its own sharing to every report, so the scope is dropped. The message says so, because a narrower scope means the portal copy can show **more** rows. |
| A column the portal has no equivalent for — including a bucket it could not rebuild | Left out, and **named** among the columns that could not be brought across. |
| A filter on such a column, a filter whose operator the portal does not have (such as **within**), a filter comparing two columns, or a value the portal cannot read | Left out, **counted** among the filters not applied, and named. Removing a filter from an AND shows **more** rows; from an OR, **fewer** — the message says which. |
| A cross filter, such as *Accounts with Contacts* | Left out and named. The copy shows more rows. |
| A row limit (Salesforce's top *N* rows) | Left out and named. The copy shows all rows. |
| An activity report type that keeps only activities with a related record, such as **Activities with Accounts** | Named. The copy shows every activity, so more rows. |
| A grouping the portal cannot make | Left out and named. A matrix whose column groupings all fall arrives as a summary report. |
| A date grouped by week, month, quarter or year | Named. The copy groups by each day — and a date/time field by each date and time. |
| Groups sorted by a total, or more than one grouping in descending order | Named. The copy sorts groups by their names, or in ascending order. |
| A date range the portal has no equivalent for, or a date filter on a field it cannot find | Named. The copy shows all dates, so more rows. |
| A summary on a field of the second object, a unique count past the third, or a summary of a kind the portal does not know | Left out and named. |
| A summary formula the portal cannot calculate exactly | Left out rather than calculated wrongly, and named with the reason — for example *it uses another summary formula*. |
| Which lookup the report uses to reach the second object, when there is more than one | Named, with the one the copy uses. |
| Currency conversion, in an org with several currencies | Named. Salesforce converts totals; the copy adds amounts as stored. |
| A chart that charts something other than a summary that came across, a bar-and-line chart, stacking to 100%, or a kind the portal does not draw | Named, with what the copy draws instead. |

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
| *1 filter could not be translated and was not applied, so this copy may show more rows than the report in Salesforce.* | A filter is missing. With filter logic the sentence also says what the logic became — *…and the filter logic "1 AND (2 OR 3)" became "1 AND 2", so this copy may show more rows…* — and the direction can be **fewer** or **more or fewer**. |
| *The report type name reads as though it includes records with no related record, but the Salesforce report was measured and does not - so this copy excludes them too, rather than showing rows the Salesforce report never had.* | A report type such as **Contacts & Accounts** sounds as if it includes contacts without an account, and does not. The portal copy matches Salesforce. |
| *This report shows no columns from the related object, but its Salesforce report type still only counts records that have one - measured - so this copy now matches it instead of counting the records without.* | Same idea: the report type quietly limits the rows, and the portal copy now does too. |
| *Row-level formulas and the chart settings could not be read (…), so a formula column may be missing from this copy and its chart is a guess from the report's shape. Use the "Sync Report Formulas" tab to bring the row-level formulas across.* | See below. |
| *Kept from the portal copy: …* | A re-sync kept these from the portal copy, because Salesforce cannot hold them. See [What a re-sync does](#what-a-re-sync-does). |
| *3 settings could not be brought across, so this copy differs from the report in Salesforce: …; …; ….* | Everything in the table above, each named with the way it changes the copy — for example *the cross filter "Accounts with Contacts" (this copy shows more rows)*. (*1 setting* for one.) |

Two messages replace the opening sentence on a re-sync:

| Message | What it means |
|---|---|
| *Already up to date: the Salesforce report has not been changed since the portal published it, so the portal copy was kept exactly as it is.* | Nothing to bring across. The portal copy is untouched. |
| *This report now uses features the portal can't run live, so it was not synced: the portal copy was kept exactly as it was. To replace it with a snapshot, remove the portal copy and sync the report again.* | The live copy stays, with its sharing. (When the definition could not be read at all it begins *The portal could not read this report's definition (…)*.) |

<!-- SHOT: sf/sync-toast-unmapped-columns.png | Portal Reports card right after Sync to Site, the "Synced live" warning toast (it stays until closed) showing the base sentence followed by "1 column could not be brought across and is not shown: …" -->

### When formulas and the chart cannot be read

Row-level formulas and the chart are not in the part of Salesforce's reporting API that Apex can
read, so the sync fetches them separately. When that fetch fails, the report still syncs, but:

- a row-level formula column may be missing — bring it across with
  [Sync Report Formulas](./sync-formulas.md);
- the chart is chosen from the report's shape instead: a horizontal bar chart for a matrix, a
  vertical bar chart for a summary, none for a tabular report.

The reason in brackets is either **no Salesforce API session** or **the Salesforce reporting API
did not answer**. On a re-sync, the portal copy's own row formulas and chart are kept instead of
guessed.

### Snapshot messages

| Message | What it means |
|---|---|
| *This report uses features the portal can't run live, so it was synced as a snapshot that refreshes on a schedule.* | A genuine limitation of the report. Despite the wording, nothing refreshes the snapshot for you — use **Refresh** on the Portal Reports card. |
| *The portal could not read this report's definition, so it was synced as a snapshot instead. This is a fault, not a limitation of the report - please report it:* (error) | Something went wrong reading the report. Report it with the error text. |

Either is followed by what the snapshot keeps:

| Report format | Added sentence |
|---|---|
| Tabular | *The snapshot keeps the report's first 200 rows.* |
| Summary | *The snapshot keeps the first grouping level and its totals; detail rows are not kept.* |
| Matrix | *The snapshot keeps the first row grouping level with each row's total; the column groupings are not kept.* |
| Anything else | *This kind of report (…) cannot be shown on the portal; the snapshot is empty.* |

## What a re-sync does

Syncing a report that is already in the portal — from **Find a report**, or with **Refresh** on
the **Already shared** list — is a full sync again, with these rules:

- **A report nobody has changed in Salesforce since the portal published it is left alone.** The
  portal copy is the newer version, so it is kept exactly as it is: *Already up to date: …*.
- **Otherwise Salesforce's version replaces the portal copy** — its columns, groupings, filters
  and the rest. Changes made to those in the portal are replaced.
- **What Salesforce cannot hold is kept**, and listed after *Kept from the portal copy:* —
  "ends with" filters (Salesforce has none, so publishing sent them as "contains"); a report or
  bucket name longer than Salesforce's 40 characters; a **Metric**, **Gauge**, **Scatter** or
  **Funnel** chart and the portal's own chart settings; row and summary formulas made in the
  portal, with their totals; a "with or without" join chosen in the portal; and formula
  descriptions.
- **It keeps the same portal report**, so company grants, re-shares and dashboard tiles that
  point at it keep working.
- **Who can see it does not change.** A report narrowed to particular companies stays narrowed.
- **If it can no longer run live, the live copy is kept** exactly as it was, and the message
  says so. It never turns into a snapshot by itself.
- **A live result replaces any older snapshot** of the same report.
- **The folder follows Salesforce** — with one exception. A report published from a portal folder
  that Salesforce has no folder for went to the publishing user's private folder, the
  **EasyCRM Portal Reports** folder or the folder chosen on the
  [Publish Schedule](../data/publish-schedule.md#new-salesforce-reports-go-to) tab. Such a report
  keeps its portal folder rather than moving there. Opening the **Sync & Share Folders** wizard
  applies the same rule to every synced report.
- The report's **Last Modified By** shows the Salesforce user who ran the sync.

Every sync is recorded in the portal's [Audit Log](../operations/audit-log.md) under
**Report: Import from Salesforce**, with your Salesforce username.

## What goes wrong

| Symptom | Cause |
|---|---|
| The portal shows more rows than Salesforce | A filter, the **Show Me** scope, a cross filter, a row limit or a date range did not come across. The sync message says which. |
| The portal shows fewer rows than Salesforce | A filter in an OR did not come across. The sync message says the logic it became. |
| A column you expected is missing | It is named in the sync message as one that could not be brought across. |
| A formula column is missing | The formulas could not be read during the sync, or the formula uses something the portal cannot calculate — the message names it. Try [Sync Report Formulas](./sync-formulas.md). |
| A date filter is named among the settings that could not come across | Salesforce used a value or range the portal cannot read. Change the filter in Salesforce to a form such as **LAST 7 DAYS**, and sync again. |
| Your edits to a synced report disappeared | Somebody changed the report in Salesforce and then re-synced or refreshed it, which brings Salesforce's version across. |
| Your edits survived a re-sync that you expected to replace them | Nobody had changed the report in Salesforce since the portal published it: *Already up to date*. |
| The chart differs from Salesforce's | The chart could not be read, so one was chosen from the report's shape — or the message names what the portal draws differently. |
| A re-sync says the portal copy was kept exactly as it was | The report can no longer run live. Remove the portal copy and sync again if you want a snapshot. |
| A warning toast stays on screen after a sync | The copy differs from Salesforce. Read it, then close it. |

## Where this fits

- [Portal Users and Portal Reports](./portal-users.md) — the buttons that start a sync.
- [Auto-sync of new Salesforce reports](../data/report-auto-sync.md) — the same sync, started by
  itself for new reports.
- [Syncing row-level formulas](./sync-formulas.md) — when the formulas did not come across.
- [Publishing a portal report to Salesforce](./publish-reports.md) — the opposite direction.
