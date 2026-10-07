---
title: How calls come back
sidebar_position: 0
---

# Calls and activity

## What comes back

When your team makes calls in FrontSpin, those calls become activity in Salesforce — so the
customer record shows what happened without anybody writing it up twice.

| Arrives | Carries |
|---|---|
| **A call** | Who, when, the outcome |
| **An AI summary** | A short account of the conversation |
| **A transcript** | What was said, by whom |
| **A contact change** | Fields edited in FrontSpin |

## The four messages FrontSpin sends

| Message | Sent when |
|---|---|
| `call.create` | A call starts being recorded |
| `call.update` | Its details change |
| `call.ai.update` | A summary or transcript is ready |
| `contact.update` | A contact is edited in FrontSpin |

## Why summaries arrive late

A summary and a transcript are produced **after** the call ends, by FrontSpin's own processing.
They arrive as a separate message, usually minutes later.

So a call appearing without a summary is normal, briefly. If the integration asks for one too
early, FrontSpin answers plainly — "summary/transcript not ready yet for Call ID … Please wait a
moment and try again" — and that is recorded as a
[sync error](../troubleshooting/sync-errors.md) that resolves itself on the retry.

**A handful of "not ready yet" errors on a busy day is normal.** Hundreds are not.

## Transcripts are read, never written

There is no transcript endpoint in FrontSpin and no transcript to address. Summaries and
transcripts exist only as **fields on the call record**, read back through the calls endpoint.

So nothing in Salesforce can create, change or delete a transcript. The integration refuses those
operations before making any request at all.

## One subtlety worth knowing

On a `call.ai.update` message the object id is the **transcript's** id, not the call's. The call
id is carried separately inside the message.

That matters if you are ever reading raw log entries and trying to match a summary to a call — the
most obvious-looking id is the wrong one.

## Tasks

Calls also drive Salesforce **Tasks** through a separate pipeline, which routes on the Record Type
of the Contact the Task points at — the same rule the rest of the integration uses, applied to
`Task.WhoId`.

Like the main path, Tasks are grouped by tenant and sent in chunks rather than one at a time, so a
large load does not exhaust the request budget.

## What goes wrong

| Symptom | Cause |
|---|---|
| Calls do not arrive at all | The [webhook](../setup/webhooks.md) is not configured, or the signature does not match. |
| Calls arrive, summaries never do | Summaries are produced later. Check for repeated "not ready yet" errors. |
| A call arrives against no record | The contact does not exist in Salesforce yet. See the correlation retry settings in [Webhooks](../setup/webhooks.md). |
| Everything stopped at once | Check whether the receiving site is still active. |

## Where this fits

Getting messages to arrive at all is [Webhooks](../setup/webhooks.md). Which fields they write is
[fields coming back](../setup/fields-coming-back.md).
