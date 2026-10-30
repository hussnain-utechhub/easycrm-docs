---
title: Tabs
sidebar_position: 10
---

# Tabs

**What it is.** Which tabs appear across the top of the portal, and in what order.

**What it does.** You move objects between "available" and "shown", and arrange the shown ones.

**What it is not.** Hiding a tab hides the way in, not the data. Somebody can still reach those
records through search or a report. Use [Permissions](../access/permissions.md) and
[Sharing](../sharing/index.md) to control access.

## Opening it

**Where:** In the portal → **Admin** → **Tabs**

1. Click **Admin** in the top menu.
2. Click **Tabs** in the row of tabs.

![Tabs](../../img/shots/admin/tabs.png)

At the top is the **Show the Home tab** switch. Below it, under **Portal Objects**, are two lists
side by side:

- **Available objects** on the left — things not currently shown as tabs.
- **Shown as tabs** on the right — the tabs people see, top to bottom matching left to right
  across the screen.

The list is the same for the whole portal — every company sees the same set of object tabs.
Icons are assigned for you.

## Show the Home tab

**Show the Home tab** (**Shown** / **Hidden**) decides whether the built-in Home tab appears at
all. Turn it off to remove Home from the portal navigation entirely — for everyone, in the default
tab bar and in every app. People then land on their first available tab.

1. Click the switch so it reads **Hidden** (or **Shown** to bring Home back).
2. Click **Save Tabs**. The switch is saved with the tab list.

A company Admin given the **Tabs** tab can use it too, and it affects every company. The same
switch is on the [Apps](./apps.md) screen for a Super Admin. Each change is written to the
[Audit Log](../operations/audit-log.md) — `Home tab hidden in the portal navigation` or
`Home tab shown in the portal navigation`.

## Adding a tab

1. Click an object in the **Available objects** list on the left.
2. Click **Move selection to Shown as tabs**.
3. Click **Save Tabs**.

## Removing a tab

1. Click the tab in the **Shown as tabs** list on the right.
2. Click **Move selection to Available objects**.
3. Click **Save Tabs**.

Nothing is deleted. The records are still there, and anybody with permission can still reach
them by searching.

## Changing the order

1. Click a tab in the **Shown as tabs** list.
2. Click **Move selection up** or **Move selection down**.
3. Repeat until the order is right.
4. Click **Save Tabs**.

The order here is the order across the top of the screen, left to right. Put the ones people
use every day first.

## Nothing takes effect until you save

Click **Save Tabs**. The message **Tabs saved. Refresh the portal to see the navigation update.**
confirms it. People see the change the next time they load a page.

## Tabs and apps

If you use [apps](./apps.md), each app has its own set of tabs. This screen sets the overall
list; the app decides which of them that app shows.
