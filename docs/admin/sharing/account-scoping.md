---
title: Account scoping
sidebar_position: 7
---

# Account scoping

## What it is

Tying a portal user to an **Account**, so they see only the records belonging to that account.

This is the arrangement most customer portals need: every client signs in to the same portal
and sees only their own data, without you writing a sharing rule per client.

## When to use it

**Use it when** your portal users are customers, partners or franchisees — people who belong
to one account and must never see another's records.

**Do not use it when** your portal users are your own staff. Staff usually need to see many
accounts, and scoping them to one is exactly wrong. Use
[sharing rules](./rules.md) and the [role hierarchy](./roles.md) instead.

## How it works

Three settings do the work, and they build on each other.

| Setting | Does |
|---|---|
| The user's **Account** | Ties that person to one account |
| **Account scope field** | Names the field on each object that points back to an account |
| **Parent field** | Lets child records inherit the scope from their parent |

Once set, every list, report and dashboard that person opens is filtered to their account
automatically. There is nothing for them to switch on and nothing they can switch off.

## Setting it up

### 1 · Tie the user to an account

**Where:** **Admin** → **Users** → the person → **Account**

Set the account they belong to. A user with no account is not scoped at all — they fall back
to ordinary [sharing](./index.md).

### 2 · Name the scope field per object

For each object, say which field points at the account.

| Object | Typical scope field |
|---|---|
| Account | The record itself |
| Contact | The account it belongs to |
| Task, Event | The related account |

If an object has no sensible field pointing at an account, it cannot be scoped this way — use
a [sharing rule](./rules.md) with criteria instead.

### 3 · Follow the chain for child records

The **parent field** lets a record inherit scope from its parent. A task attached to a contact
has no account of its own, but the contact does — so the task follows the contact, which
follows the account.

Without this, child records fall outside the scope and the user cannot see the tasks on their
own contacts, which looks like a bug and is a configuration gap.

### 4 · Matching records to a person, not an account

A **user match field** ties records directly to the individual rather than their account. Use
it where a person should see only their own items within an account their colleagues also use.

## Choosing the access level

Scoping says *which* records. It does not say what the person may do with them — that is still
[Permissions](../access/permissions.md). A scoped user with no edit permission can see their
account's records and change nothing.

## What goes wrong

| Symptom | Cause |
|---|---|
| A user sees everything, not just their account | No account set on the user, or no scope field on that object. |
| They see their account but none of its contacts | Contact has no scope field, or needs the parent chain. |
| They see accounts but no tasks | Tasks need the parent field to follow the contact or account. |
| A client briefly saw another client's record | The object was not scoped. Check every object on a tab, not just the main one. |
| Reports show more than lists do | Older configurations set scope per tab rather than per object. Set it on the object. |

That fourth row is the one to take seriously. **Scoping is per object** — adding a tab without
setting its scope field exposes that object to everybody.

## Testing it before you trust it

Do not assume. For each new client:

1. Create a test user on that account.
2. Use **Log in as user** from [Users](../users/index.md).
3. Open every tab and check the counts.
4. Open [Record access](./record-access.md) on a record belonging to a *different* account and
   confirm that user is not listed.

Step 4 is the one people skip, and it is the one that catches a missing scope field.

## Where this fits

Account scoping narrows what somebody sees before any other rule applies.
[Sharing rules](./rules.md) can still widen access, and
[restriction rules](./restriction-rules.md) can narrow it further. When they disagree,
[Record access](./record-access.md) tells you which one is deciding.
