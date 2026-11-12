---
title: Dashboards
sidebar_position: 0
slug: /use/dashboards
---

# Dashboards

A dashboard is several answers on one screen. Each tile reads from a [report](../reports/index.md)
and draws its result as a number, a chart or a table.

**A dashboard never holds data of its own.** Every figure on it comes from a report. That one
fact explains most of what follows — including why a wrong number is almost never a dashboard
problem. Every chart, number and table tile links to the report behind it. That report opens
narrowed by the dashboard's filters, so you see the records behind the number.

## What they are for

Dashboards answer the questions somebody asks *every* morning. If a question is asked once,
run a report. If it is asked daily by several people, it belongs on a dashboard.

| Page | Covers |
|---|---|
| [Viewing](./viewing.md) | Opening one, how old its numbers are, refreshing, opening the report behind a tile |
| [The builder](./builder.md) | Adding and arranging tiles, saving, cloning |
| [Tiles](./tiles.md) | The eleven ways to draw a tile and when to use each |
| [Filters](./filters.md) | Narrowing every tile at once, and the selection the portal remembers for you |
| [Settings](./settings.md) | Grid, themes, and whose data it counts |

Finding, starring, filing and sharing dashboards works exactly as it does for reports. See
[Finding a report](../reports/finding.md), [Folders](../reports/folders.md) and
[Sharing a report](../reports/sharing.md).

## The one setting that is worth understanding first

Every dashboard counts, for each viewer, only the records that viewer may see — so two people can
open the same dashboard and get different numbers, with no error anywhere. **View Dashboard As**
can scope every tile to the viewer further still (**The logged-in user**), but no setting shows
somebody records their own sharing hides.

Admins and Super Admins are never narrowed by **The logged-in user**. So you cannot check what a
Standard user sees by looking at the dashboard as an admin.

[Settings](./settings.md) covers it properly. If you build dashboards, read that page before
you share one.
