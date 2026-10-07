---
title: Sending records by hand
sidebar_position: 0
---

# Doing it by hand

Most syncing happens by itself. Two tools send records on demand — after an outage, after fixing
a configuration, or when loading a customer for the first time.

| Tool | Sends | Reached from |
|---|---|---|
| **Resync to FrontSpin** | The records you select | A list view in Salesforce |
| **Record Type Sync** | Everything of one Record Type | A Salesforce page |

Both take the **same path** a normal save does. Neither is a special back door, and neither can
produce a result an automatic sync would not.

## Resync to FrontSpin

**Where:** any Account or Contact list view in Salesforce

1. Open a list view.
2. Tick the records you want.
3. Choose **Resync to FrontSpin** from the actions.

## Record Type Sync

**Where:** the FrontSpin Record Type Sync page in Salesforce

1. Choose the object — **Account** or **Contact**.
2. Choose the Record Type.
3. Start it.

It works through up to **2,000 records per request**. That is a page size, not a ceiling: the
rest is not lost, and the next run resumes exactly where the last stopped.

The limit is there because every record costs a FrontSpin request against a daily allowance that
can be as low as 500. An unbounded button could spend a large part of a day's allowance in one
click.

## What a resync actually does, per record

It is decided per record, not per request:

| The record has | The resync does |
|---|---|
| A stored FrontSpin id | An **update** of that FrontSpin record |
| No stored id | A **create** |

So **a record already in FrontSpin cannot be duplicated by resyncing it**. That is worth knowing,
because the natural fear about a manual resync is exactly that.

## Why it works when nothing has changed

A normal save only sends a record when a mapped field actually changed. A resync deliberately
bypasses that check — you are asking for a retry of a record nothing has changed on, which is the
whole point.

What it does **not** bypass is routing or ownership. A record that cannot be routed is still
refused, for the same reason and with the same message.

## When to use which

| Situation | Use |
|---|---|
| One record that failed | **Resync**, from the list view |
| A handful after fixing a field mapping | **Resync** |
| A whole customer, first time | **Record Type Sync** |
| Everything after a long outage | **Record Type Sync**, one Record Type at a time |

## Mind the daily allowance

A FrontSpin tenant's daily request allowance can be as low as 500. Syncing a Record Type with
5,000 contacts will exhaust it.

That is not a disaster — records stopped by a quota are **preserved and re-driven automatically**
after the allowance resets. See [Retries](../troubleshooting/retries.md). But it means everything
else for that tenant waits behind them, so a large first load is best done when nothing urgent
depends on the same tenant.

## Who can use them

Both respect sharing: you can only sync records you can see. Somebody with narrow access syncs
only their own records, without being told the others existed.

## What goes wrong

| Symptom | Cause |
|---|---|
| The action is not in the list view | The integration is not installed, or the action is not on that list view. |
| It reports success, nothing arrives | Check [sync errors](../troubleshooting/sync-errors.md) — refusals are recorded, not thrown. |
| Only some records went | Sharing, or a quota stop. Both are recorded. |
| It stops at 2,000 | Expected. Run it again; it resumes after the last one. |
