---
title: When nothing is reported
sidebar_position: 3
---

# When nothing is reported

The hardest problems are the ones with no error. Here is every case where the integration can do
less than you expect without raising a failure, and how to recognise each.

## 1. No configuration rows exist

**Looks like:** nothing syncs, no errors anywhere.

With **zero** [configuration rows](../setup/configuration.md), the integration treats itself as
not switched on and stays quiet. Logging one failure per record would put hundreds of rows in the
log for a single bulk load and tell you nothing you did not know.

Once at least one row exists, unroutable records **are** logged.

**Check:** does *any* configuration row exist?

## 2. The mapping switch is the wrong way round

**Looks like:** a report-to-list mapping is saved correctly and never runs.

Mappings live in [Setup or the portal](../lists/where-mappings-live.md), and only one source is
live. Editing the other one changes nothing and warns nobody.

**Check:** **Use Custom Setting** on the FrontSpin Report List Control custom setting.

## 3. Two active setting rows

**Looks like:** the routing mode is set to STRICT and behaves like LEGACY.

Two active rows resolve to LEGACY, as does a blank or unrecognised mode. This is the fail-safe
working — but it is silent.

**Check:** exactly one active row in [FrontSpin Setting](../routing/index.md).

## 4. The scheduling user cannot see the contacts

**Looks like:** a list is consistently shorter than the report.

Scheduled jobs run as whoever created the schedule, and respect sharing. A Contact that user
cannot see cannot be added.

This one **is** reported, as **CONTACTS_NOT_VISIBLE** — but in the job's log rather than as a sync
error on a record, so it is easy to miss.

**Check:** the scheduling user's access to the Contacts the report returns.

## 5. The person who scheduled the jobs has left

**Looks like:** everything stopped on a particular day.

Scheduled Apex runs as its creator, forever. Deactivate that user and the jobs stop.

**Check:** the scheduled jobs exist, and their owner is active.

## 6. Additions are accepted but not yet applied

**Looks like:** a list is short immediately after a sync.

FrontSpin answers an add with **202** — accepted, not done — and applies it asynchronously.

**Check:** wait a few minutes before investigating.

## 7. The guest cannot refresh an existing list

**Looks like:** **Refresh lists** in the portal does nothing for lists already recorded.

A Guest User Licence forbids editing, so the portal can add new lists but never update existing
ones. See [List Mappings](../portal/list-mappings.md).

**Check:** nothing. This is a platform limit. The hourly job keeps existing entries current.

## 8. Change detection skipped the save

**Looks like:** you saved a record and nothing was sent.

A record is only sent when a **mapped** field changed. Editing a field nobody mapped is correctly
a no-op.

**Check:** is the field you changed in the [outbound mappings](../setup/fields-going-out.md)? To
send anyway, [resync by hand](../manual/index.md).

## 9. A list is full of people who should not be on it

**Looks like:** the report was narrowed, the list did not shrink.

Nothing can remove somebody from a FrontSpin list. Narrowing the report stops **adding** them; it
does not take them off.

**Check:** remove them in FrontSpin. See [Lists](../lists/index.md).

## The general rule

When something did not happen and nothing was reported, the cause is almost always a **switch**,
a **missing row**, or a **visibility limit** — not a failure. The
[health check](../setup/checking-it.md) finds the first two in one line.
