---
title: Dashboard filters
sidebar_position: 13
---

# Dashboard filters

**What it is.** A control at the top of a dashboard that changes every tile at once.

**What it does.** You pick one value — an owner, a region, a month — and all the tiles narrow
to it together.

**Why it helps.** One dashboard serves everybody. Without filters you would need a copy per
team.

## Adding one

1. In the dashboard builder, click **+ Filter**.
2. Choose the field to filter by.
3. Add the values people can choose from.

![Adding a filter](../img/shots/dashboard-builder/add-filter.png)

4. Click **Save**.

## Apply to Each Component

Each tile reads from a different report, and those reports do not always name the same thing
the same way. One might call it **Owner**, another **Assigned To**.

**Apply to Each Component** is where you say which field on each report the filter matches.

Fields with the same name are matched for you. You only have to set the ones that differ.

A tile you leave unmapped ignores the filter and keeps showing everything — which looks like a
bug to whoever is reading the dashboard, so it is worth checking.

## Using one

Choose a value at the top of the dashboard. Click **Clear all** to go back to the full picture.
