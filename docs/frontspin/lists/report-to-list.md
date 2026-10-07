---
title: Report to List
sidebar_position: 1
---

# Report to List

## What it does

Runs a Salesforce report on a timetable and adds everybody it returns to a FrontSpin calling list.

It is how a calling list stays current without anybody exporting a spreadsheet.

## How it runs

| | |
|---|---|
| **Job name** | FrontSpin Report to List |
| **Runs** | Every hour, on the hour |
| **Does** | For each active mapping: run the report, add its contacts to the list |

Each mapping gets its own job, so each has its own request budget and its own failure. A big
mapping cannot starve a small one, and one failing mapping does not stop the rest.

## What a mapping says

Three things, and only three:

| Setting | Means |
|---|---|
| **Report ID** | Which Salesforce report to run |
| **FrontSpin Config** | Which [configuration row](../setup/configuration.md) owns the tenant |
| **FrontSpin List ID** | Which numbered list to add to |

Plus **Member Type** (`Contacts`) and **Active**.

A mapping holds **no** tenant id, no credential and no API key — those come from the configuration
row it names. That is why the configuration row's **developer name** matters.

## The report must be tabular

**FrontSpin cannot read Summary or Matrix reports.** Only a tabular report can fill a list.

If the report you want is grouped, make a tabular copy of it for this purpose. The portal's
[New Mapping dialog](../portal/list-mappings.md#adding-a-mapping) will not offer a grouped report
at all, which is the clearest way to find out.

## A portal-only report works

The report does **not** have to be published to Salesforce. One that exists only in the portal
fills a FrontSpin list perfectly well.

That removes a step people often assume is required.

## FrontSpin List ID must be a number

It is FrontSpin's own numeric list identifier — not a list name, and not a Salesforce Id. Entering
either of those is rejected with **LIST_ID_NOT_NUMERIC**.

Find the number in the [list catalogue](./index.md), or ask whoever runs the FrontSpin account.
The portal shows it in brackets beside each list name.

## Only Contacts

**Member Type** supports `Contacts`. Leads are recognised but not implemented, and a mapping set
to anything else is rejected with **MEMBER_TYPE_UNSUPPORTED**.

## Why the report matters more than the mapping

The mapping is three fields. The **report** is where all the judgement is:

- Everybody the report returns is added to the list.
- Removing somebody from the report does **not** remove them from the list — nothing can.
- So a report that is too broad produces a list you cannot narrow again.

**Start narrow.** It is easy to add more people to a list next hour, and impossible to take them
off from Salesforce.

Build the report with [the report builder](../../use/reports/index.md) like any other, and check
what it returns before mapping it.

## Who the report can see

The job runs as whoever scheduled it, and respects sharing. A Contact that user cannot see cannot
be added.

This is reported as **CONTACTS_NOT_VISIBLE** rather than passing quietly, so a short list has a
visible cause. See [Permissions](../setup/permissions.md).

## Why a success is not proof

FrontSpin answers an add request with **202** — "accepted, I will do it shortly" — and schedules
the change asynchronously. So the job reporting success means the request was taken, not that the
list has changed yet.

Give it a few minutes before investigating a list that looks short.

## What goes wrong

| Message | Means |
|---|---|
| **NO_MAPPINGS** | No mappings exist at all |
| **NOT_FOUND** | The named mapping does not exist |
| **INACTIVE** | **Active** is unticked. Skipped on purpose. |
| **NO_REPORT** | **Report ID** is blank |
| **NO_LIST_ID** | **FrontSpin List ID** is blank |
| **LIST_ID_NOT_NUMERIC** | A name or a Salesforce Id was entered |
| **NO_CONFIG** | **FrontSpin Config** is blank |
| **CONFIG_UNRESOLVED** | The configuration it names is missing or incomplete |
| **MEMBER_TYPE_UNSUPPORTED** | Leads, or something unrecognised |
| **CONTACTS_NOT_VISIBLE** | The scheduling user cannot see some of the report's contacts |

## If there are more mappings than one run can dispatch

There is a cap on how many mappings one run can start. Anything beyond it is **not silently
dropped** — it is named in the API log so you can see exactly which mappings did not run.

## Where this fits

Mappings can live in two places — [Setup, or the portal](./where-mappings-live.md).
