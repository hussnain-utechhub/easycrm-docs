---
title: The two systems
sidebar_position: 0
---

# The two systems

## What each one is for

| | Salesforce / EasyCRM | FrontSpin |
|---|---|---|
| Holds | The record of who a customer is | The work of calling them |
| Strong at | History, reporting, permissions | Dialling, call outcomes, lists |
| People use it for | Looking something up | Getting through a call list |

Neither replaces the other. The integration exists so that a fact entered in one appears in the
other without anybody copying it.

## The one idea everything rests on

**A FrontSpin tenant is a separate FrontSpin account.** One Salesforce org can talk to several of
them. Which tenant a record belongs to is decided by that record's **Record Type** — nothing
else.

Not the owner. Not who is logged in. Not the company field. The Record Type.

This is deliberate, and the code says so plainly: the running user is never consulted, so two
people editing the same record always reach the same FrontSpin. If routing depended on who was
editing, the same Contact could be sent to two different diallers depending on who touched it
last.

[Tenants and Record Types](./tenants-and-record-types.md) covers this properly. It is the single
most useful thing to understand before changing anything.

## What this section covers

| Page | Answers |
|---|---|
| [What moves, and which way](./what-syncs.md) | Which records sync, in which direction |
| [Tenants and Record Types](./tenants-and-record-types.md) | How a record finds its FrontSpin |
| [How records are matched](./matching.md) | How duplicates in FrontSpin are avoided |
| [The moving parts](./moving-parts.md) | Every piece, named, so error messages make sense |

## A caution worth reading first

The integration is built to **refuse rather than guess**. When configuration is missing,
contradictory, or points somewhere that is switched off, the record is not sent and the refusal
is written down.

That is the right behaviour — a guess would put a customer's data in a different customer's
dialler — but it means **a quiet integration is not necessarily a working one**. Checking
[sync errors](../troubleshooting/sync-errors.md) occasionally is part of running it.
