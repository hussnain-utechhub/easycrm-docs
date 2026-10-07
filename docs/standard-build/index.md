---
title: The standard build
sidebar_position: 0
slug: /standard-build
---

# The standard build

## What this is

The Salesforce build that sits underneath an outbound calling operation: the fields a caller
needs on a Contact, the page layouts that show them, the reports that measure the calling, the
dashboards that put those reports on one screen, and the automation that keeps the best phone
number up to date.

It is written down so the next person does not have to work it out again — and so that a second
org can be built the same way without guesswork.

## What it covers

| Part | What it is |
|---|---|
| [Fields](./fields/index.md) | The Contact fields the whole build depends on |
| [Page layouts](./layouts/index.md) | What a caller sees on a Contact and on a Task |
| [Reports](./reports/index.md) | 44 reports, from everyday lists to the calculation engine |
| [Dashboards](./dashboards/index.md) | Three dashboards built from those reports |
| [Automation](./automation/best-phone.md) | The flow that keeps **Best Phone** correct |
| [Reference](./reference/bucket-statuses.md) | Bucket statuses, call results and a rebuild checklist |

## The shape of it

Everything rests on two ideas.

**A contact has many phone numbers and one best one.** Up to seven numbers are held, each with
its own status. A flow works out which is the best and copies it, with its status, into
**Best Phone** and **Best Phone Status**. Every report that talks about reaching people reads
those two fields rather than guessing.

**A contact has a bucket status.** One picklist describes where the person has got to — P1, P2,
P3, Priority, Nurture, Activated Lead, Meeting Scheduled, DNC and the rest. Most reports are a
filter on that field.

Calls themselves are Salesforce **Activities** (Tasks and Events), carrying a **Call Result**.
The calculation reports turn call results into counted outcomes with formula columns, and the
dashboards read those.

## This is not part of EasyCRM

Like the [FrontSpin integration](../frontspin/index.md), this is a build inside one customer's
Salesforce org — fields, reports, dashboards and a flow — not a feature of the EasyCRM package.
Installing EasyCRM does not create any of it.

It is documented here because the portal reports on the same data, and because the
[FrontSpin lists](../frontspin/lists/report-to-list.md) are filled from these reports.

## Where to start

| If you want to | Read |
|---|---|
| Understand the data model | [Fields](./fields/index.md) |
| Build this in a new org | [The rebuild checklist](./reference/checklist.md) |
| Know what a report counts | [The calculation reports](./reports/calculation.md) |
| Change a dashboard | [Dashboards](./dashboards/index.md) |
| Know why Best Phone is what it is | [The Best Phone flow](./automation/best-phone.md) |

## A note on accuracy

The field API names, picklist values and report definitions on these pages were **read back from
a live org**, not copied from the original build document. Where the two disagree, the org wins
and the difference is called out — see
[the corrections](./fields/custom.md#where-the-original-document-is-wrong).
