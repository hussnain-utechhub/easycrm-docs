---
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
