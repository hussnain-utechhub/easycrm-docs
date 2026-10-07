---
title: What a list is
sidebar_position: 0
---

# Lists

## What a FrontSpin list is

A calling list: the set of people the dialler will work through. Lists are created and managed
**in FrontSpin**, not in Salesforce.

What Salesforce can do is **add people to one**, on a timetable, from a report.

## What Salesforce cannot do

This is the single most important thing on this page.

| Action | Possible |
|---|---|
| Add contacts to a list | Yes |
| Add leads to a list | Yes |
| See which lists exist | Yes |
| **Create** a list | No |
| **Rename** a list | No |
| **Delete** a list | No |
| **Remove** somebody from a list | No |
| **Ask who is on** a list | No |

FrontSpin's list interface is three endpoints — see the active lists, add contacts, add leads.
There is no removal endpoint of any kind, and no membership lookup. This is not a limitation of
the integration; it is the whole published surface.

**So taking somebody off a calling list is done by a person, in FrontSpin.** No change in
Salesforce achieves it.

## The list catalogue

So that Salesforce knows which lists exist, a job records them.

| | |
|---|---|
| **Job name** | FrontSpin List Catalog |
| **Runs** | Every hour, at half past |
| **Does** | Asks each tenant for its active lists and records them as **FrontSpin List** records |
| **Does not** | Touch memberships, run reports or add anybody to anything |

Each tenant is handled by its own job, so one tenant's failure never stops another's — and because
the list feed supports no paging or filtering, one tenant's response can be large. A live tenant
returned roughly 690 KB for 125 lists.

## Nothing is ever deleted

If a list disappears from FrontSpin, its record in Salesforce **stays**, and simply stops having
its "last synced" time refreshed.

That is deliberate: it makes "this list vanished from FrontSpin" visible, rather than the
catalogue quietly destroying a record it did not create. An old **Last Synced On** date is the
signal.

## Where lists appear

| Place | Shows |
|---|---|
| The **FrontSpin Lists** tab in Salesforce | Every list, with its tenant and last-synced time |
| [List Mappings](../portal/list-mappings.md) in the portal | Lists you can map a report to |

## What goes wrong

| Symptom | Cause |
|---|---|
| A new FrontSpin list does not appear | The catalogue job has not run yet. It runs hourly. |
| A list is in Salesforce but not FrontSpin | It was deleted there. The record is kept on purpose. |
| **Last Synced On** is days old | The job is failing, or has been unscheduled. |
| Somebody cannot be removed from a list | Correct. Do it in FrontSpin. |

## Where this fits

Filling a list from a Salesforce report is [Report to List](./report-to-list.md). Where those
mappings are configured is [Setup, or the portal](./where-mappings-live.md).
