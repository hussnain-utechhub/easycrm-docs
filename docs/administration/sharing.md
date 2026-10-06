---
title: Sharing
sidebar_position: 6
---

# Sharing

**What it is.** Which records each person can see.

**How it differs from permissions.** [Permissions](./permissions.md) say what somebody may
**do** — read, create, edit, delete. Sharing says which **records** they may do it to.

**Why it matters most.** Get this wrong and either nobody can do their job, or everybody sees
everybody else's customers.

## Opening it

**Where:** **Admin** → **Sharing**

1. Click **Admin** in the top menu.
2. Click **Sharing** in the row of tabs.

![Sharing](../img/shots/admin/sharing-full.png)

Inside Sharing there are several areas, each with its own page here:

| Area | What it is for |
|---|---|
| [Org-Wide Defaults](./sharing-defaults.md) | The starting rule for each kind of record. |
| [Sharing Rules](./sharing-rules.md) | Standing rules that open access up. |
| [Public Groups](./public-groups.md) | Named lists of people, used by rules. |
| [Roles](./roles.md) | Who reports to whom. |
| [Restriction Rules](./restriction-rules.md) | The only thing that takes access away. |
| [Record Access](./record-access.md) | Check who can see one record, and why. |

## How the pieces fit together

Think of it as a floor, then things that raise it.

1. **The default** sets the floor for everybody.
2. **Sharing rules**, **groups** and the **role hierarchy** raise it for particular people.
3. **Restriction rules** are the only thing that lowers it again.

Everything except restriction rules can only ever **add** access. Nothing you do in a sharing
rule will hide a record somebody can already see.

## The order to set it up

1. Start with [Org-Wide Defaults](./sharing-defaults.md) set to **Private**.
2. Turn on **Grant via Hierarchy** so managers see their team's records.
3. Add [sharing rules](./sharing-rules.md) for teams that need each other's records.
4. Only then consider [restriction rules](./restriction-rules.md).

Starting Private and opening up is far easier than starting open and working out later who
should never have seen what.

## When somebody says they cannot see a record

Use [Record Access](./record-access.md). It lists everybody who can see a given record and
why, which turns a guess into an answer in about ten seconds.
