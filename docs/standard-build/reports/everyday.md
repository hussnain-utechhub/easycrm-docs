---
title: The everyday reports
sidebar_position: 1
---

# The everyday reports

Six reports in the **Buckets Reports** folder. These are the ones a person opens and reads, and
they are safe to change.

## Today's Completions {#todays-completions}

**Did we complete anything today, and with whom?**

| | |
|---|---|
| Report type | Activities with Contacts |
| Format | Tabular |
| Date | **Today** |
| Filter | Call Result **contains** Meeting Scheduled, Activated Lead, Not Now, Not Me, Referred, Not Interested, Not In Swimlane |

Plus the standard activity filters: all activities, **completed** only, tasks and events.

**Columns:** FS Created By · FS Last Call Date/Time · Account Name · Website · First Name ·
Last Name · Title · Bucket Status · Call Result · Follow Up Date · Full Comments ·
FS Call Recording · Call Duration (minutes) · BDR · Best Phone · Best Phone Status ·
LinkedIn URL · Email · Campaign // List Name · Contact ID

The org also carries **Mismatch**, **Bucket Status AI**, **Call Result AI**,
**Follow Up Date AI** and **BDR AI** on this report. Those came after the original build document
was written and are not described in it.

## This Months Completions {#this-months-completions}

The same report over a wider window.

| | |
|---|---|
| Report type | Activities with Contacts |
| Format | Tabular |
| Date | **This Month** |
| Filter | Identical to Today's Completions |

**Columns** are the same, minus the AI columns and Call Duration, and it uses the Contact's
**Call Recording** rather than the activity's FS Call Recording.

## This Months Meetings Scheduled {#this-months-meetings-scheduled}

| | |
|---|---|
| Report type | Activities with Contacts |
| Format | **Summary**, grouped by **FS Created By** |
| Date | This Month |
| Filter | Call Result **contains** Meeting Scheduled |

Grouping by FS Created By turns it into "meetings booked per rep this month", which is what makes
it a summary rather than a list.

## This Months Activated Leads {#this-months-activated-leads}

Identical in shape to the above, with **Call Result contains Activated Lead**.

## All Meetings & Activated Leads {#all-meetings--activated-leads}

**Everyone currently at or past a meeting**, regardless of when the call happened.

| | |
|---|---|
| Report type | **Contacts & Accounts** |
| Format | Tabular |
| Date | Created Date — all time |
| Filter | Bucket Status **equals** Activated Lead, Meeting Scheduled, No Show / Rescheduling, Meeting Held, Unscheduled Intro Complete |

This is a **people** report, not a calling report — which is why it is built on Contacts &
Accounts and filters on Bucket Status rather than Call Result. One row per person, not per call.

**Columns:** Bucket Status · Call Recording · BDR · Account Name · Website (account) ·
Company LinkedIn URL (account) · First Name · Last Name · Title · Email · LinkedIn URL ·
Company LinkedIn URL · Website · **Best Phone** · **Best Phone Status** · Mobile · Mobile Status ·
Phone · Phone Status · Phone 2–5 and their statuses · Campaign // List Name · Contact ID · plus Follow Up Date.

All seven phone numbers and statuses are included deliberately: this list gets worked by hand,
and the caller wants every number.

## Needs Attention Contacts {#needs-attention-contacts}

| | |
|---|---|
| Report type | Contacts & Accounts |
| Format | Tabular |
| Date | Created Date — all time |
| Filter | Bucket Status **equals** Needs Attention |

The data-quality queue: contacts somebody flagged as wrong, unreachable or undecidable.

**Columns:** the same contact set as above, without Follow Up Date.

**Somebody should own this report.** Needs Attention is where records go to be fixed, and
nothing fixes them automatically.

## Reading these reports

| Watch for | Because |
|---|---|
| A completions report that looks short | **Completed Activities** is a standard filter. An open task is not a completed call. |
| Numbers that disagree with a dashboard | The dashboards read the [calculation reports](./calculation.md), not these. |
| A blank Call Result | It is free text. See [Call results](../reference/bucket-statuses.md#call-results). |

## Where this fits

The folder is [Buckets Reports](./folders.md#buckets-reports). The reports that feed the
dashboards are [the calculation reports](./calculation.md).
