---
title: Setup Assistant
sidebar_position: 22
---

# Setup Assistant

**What it is.** A checklist that tells you whether the portal is correctly set up.

**What it does.** It checks the things the portal needs on the Salesforce side and reports
each one as done or needing attention.

**Why it helps.** When something does not work **at all** — nobody can sign in, no records
appear anywhere — this says which step was missed instead of leaving you to guess.

## Where it lives

The Setup Assistant is on the **Salesforce** side, not in the portal. Whoever installed the
package opens it there.

Most portal administrators never need it. It matters at installation, and when something
stops working in a way that affects everybody at once.

## What it checks

| Check | Why it matters |
|---|---|
| Permissions on the portal's own user | Without them the portal cannot read anything, for anybody. |
| Field access | New fields are invisible to the portal until access is granted. |
| The site is active | An inactive site serves nothing at all. |
| Email deliverability | Welcome and password-reset emails are dropped silently without it. |

## Reading it

**Completed** means that step is done.

**Needs attention** means it is not, and the item says what to do about it.

## When to run it

- Straight after installing, before adding any users.
- **After adding new fields** — field access is not granted automatically, and this is the
  single most common cause of "the field is there in Salesforce but not in the portal".
- When something stops working for everybody at once, to rule setup out before looking
  anywhere else.

## The difference between this and permissions

[Permissions](./permissions.md) control what one **person** may do.

The Setup Assistant checks what the **portal itself** is allowed to do. If the portal's own
access is wrong, nobody's permissions matter — the portal cannot read the data to show them.

That is why it is worth checking first when the problem affects everybody.
