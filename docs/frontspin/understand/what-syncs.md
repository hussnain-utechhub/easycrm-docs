---
title: What moves, and which way
sidebar_position: 1
---

# What moves, and which way

## Out of Salesforce, into FrontSpin

| What | When | Notes |
|---|---|---|
| **Contact** | Created or changed | The main one. Carries the phone numbers the dialler uses. |
| **Account** | Created or changed | Matched to a FrontSpin account, or created there. |
| **Lead** | Created or changed | Same path as Contact, different object. |
| **List membership** | On a timetable | From a Salesforce report. See [Report to List](../lists/report-to-list.md). |

Sending happens **after the save**, not during it. Saving a record never waits for FrontSpin and
never fails because FrontSpin is slow or down. The work is queued and runs just behind you.

## Into Salesforce, out of FrontSpin

| What | When | Notes |
|---|---|---|
| **Calls** | As they happen | Arrive as a webhook, become Salesforce activity. |
| **Call outcomes and AI summaries** | Shortly after a call | Summaries and transcripts arrive later than the call itself. |
| **Contact changes** | When edited in FrontSpin | Only the fields you have mapped. |

## What does not sync

Being clear about this saves a lot of searching:

- **Nothing is deleted.** FrontSpin's list API has no delete and no remove-from-list endpoint, so
  the integration has no way to take somebody off a list. Lists are add-only.
- **Opportunities, Cases and custom objects** do not sync. Only Contact, Account and Lead.
- **A record with no Record Type** cannot be routed, so it is not sent at all.
- **Attachments and files** do not move in either direction.

## Why "add-only" matters more than it sounds

FrontSpin's documented list interface is three endpoints: see the active lists, add contacts, add
leads. There is no create, update, delete or removal of any kind, and no way to ask who is
already on a list.

So if somebody must come **off** a calling list, that is done in FrontSpin by a person. No change
in Salesforce can achieve it, and none ever will while the API stays as it is.

## One response that does not mean what it looks like

When the integration adds somebody to a list, FrontSpin answers **202**, not 200. That means
"accepted, I will do it shortly" — it is not a promise that the membership exists yet.

So a successful add is not proof of membership. If a list looks short right after a sync, give it
a few minutes before treating it as a fault.

## Where this fits

The mechanics of the outbound path are in [The moving parts](./moving-parts.md). What decides
*which* FrontSpin a record goes to is in
[Tenants and Record Types](./tenants-and-record-types.md).
