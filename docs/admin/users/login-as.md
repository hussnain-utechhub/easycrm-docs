---
title: Seeing the portal as somebody else
sidebar_position: 4
---

# Seeing the portal as somebody else

## What it is

An administrator viewing the portal exactly as another person sees it, without their password.

## When to use it

When somebody reports a problem you cannot reproduce. "The tab isn't there", "my list is
empty", "I can't edit this" — all three are answered in seconds by looking at their screen
rather than reasoning about their permissions.

**When not to:** to do somebody's work for them. Everything you do is recorded against both
names, and it muddies who actually did what.

## Using it

**Where:** **Admin** → **Users** → the person's row → the person icon

1. Click **Admin**, then **Users**.
2. Find the person in the list.
3. Click the **person icon** in the **Actions** column.

You are now seeing their portal. A banner shows whose account you are in. Leave it to return
to your own.

## What is recorded

This is deliberately the most heavily logged thing in the product.

| Recorded | Always |
|---|---|
| Every attempt | Whether allowed **or refused** |
| Anything you do during the session | Against **both** names |

So the [Audit Log](../operations/audit-log.md) always answers "who really did this?", not just
"whose account was it?".

The person is **not** signed out and does not notice.

## Who may do it

| Role | Can view as |
|---|---|
| **Super Admin** | Anyone |
| **Admin** | Standard users they manage, and other Admins at their own company |
| **Admin** | **Never** a Super Admin |

It is switched **off** until a Super Admin turns it on, and that is the right default — it is a
powerful capability and should be a decision rather than something that was always there.

## Using it well

**Reproduce, do not fix.** Look, confirm what they are seeing, then come back to your own
account and change the setting. Fixing from inside their session makes the audit trail harder
to read.

**Check both halves.** If their list is empty, you now know whether it is
[permissions](../access/permissions.md) or [sharing](../sharing/index.md) — which is the
question you could not answer from your own screen.

## What goes wrong

| Symptom | Cause |
|---|---|
| The icon is missing | The feature is off, or that person is above you. |
| You see your own data | You left the session. Check the banner. |
| The problem does not reproduce | It may be browser-side — ask them to reload, or compare [view settings](../../use/start/the-screen.md). |
