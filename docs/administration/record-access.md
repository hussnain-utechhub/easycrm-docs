---
title: Checking who can see a record
sidebar_position: 12
---

# Checking who can see a record

**What it is.** A screen that answers "who can see this, and why".

**What it does.** You pick a record and it lists everybody with access, and the reason each
one has it.

**Why it helps.** When somebody says "I cannot see this" or "why can they see this?", this
turns a guess into an answer.

Click **Admin**, then **Sharing**, then **Record Access**.

![Record access](../img/shots/admin/sharing-record-access.png)

## Using it

1. **Find a record** by name, or **Browse by owner**.
2. Pick the record.
3. The list shows everybody with access and the **Reason** for it.

## The reasons you will see

| Reason | Means |
|---|---|
| **Owner** | They own the record. |
| **Org-Wide Default** | Everybody has it, from the [default](./sharing-defaults.md). |
| **Sharing Rule** | A [rule](./sharing-rules.md) grants it. |
| **Hierarchy** | They manage somebody who has it. |

## How to use it when something is wrong

If a person is missing from this list, the fix is a sharing rule or the hierarchy — not a
permission. If they are on the list but still cannot open the record, the problem is
[permissions](./permissions.md) instead.

That distinction is the whole reason this screen exists.
