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

**Where:** In the portal → **Admin** → **Users** → the person's row → **Log in as this user**

1. Click **Admin**, then **Users**.
2. Find the person in the list.
3. Click **Log in as this user** in the **Actions** column — the first button on the row.
4. The **Log in as *username*** window explains what follows: anything you create or change is
   recorded as them, the audit log also records that it was you, they stay signed in, and
   **Return to my account** brings you back.
5. Click **Log in as user**.

<!-- SHOT: admin/login-as-confirm.png | Super Admin with Log in as switched on; Users → "Log in as this user" on a Standard user's row; the "Log in as acmeuser" window with its four points and the Log in as user button -->

You are now seeing their portal. A banner across the top reads **You are logged in as *username*.
Everything you do is recorded as them.** Click **Return to my account** in it to come back to your
own.

<!-- SHOT: admin/login-as-banner.png | The portal while logged in as acmeuser: the banner "You are logged in as acmeuser. Everything you do is recorded as them." with the Return to my account button -->

If the attempt is refused, the reason shows inside the window and is written to the audit log.

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

A Super Admin decides who may use it at all, under **Admin** → **Users** → **Log in as user** →
**Who may log in as portal users**:

| Option | Who may start a session |
|---|---|
| **Off - nobody may log in as another user** | Nobody, whatever their role. The default. |
| **Super Admins only** | Super Admins. Company Admins may not. |
| **Super Admins and company Admins** | Both, within the limits in the table above. |

It is **off** until a Super Admin turns it on, and that is the right default — it is a powerful
capability and should be a decision rather than something that was always there. Changing it does
not end a session already running; it decides who may start a new one.

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
| **Log in as this user** is missing | **Who may log in as portal users** is **Off**, or limited to Super Admins, or that person is outside what you may log in as. |
| You see your own data | You left the session. Check the banner. |
| The problem does not reproduce | It may be browser-side — ask them to reload, or compare [view settings](../../use/start/the-screen.md). |
