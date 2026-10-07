---
title: About the dashboards
sidebar_position: 0
---

# Dashboards

Three, each answering a different question.

| Dashboard | Answers |
|---|---|
| [Calling Dashboard](./calling.md) | How is the calling going? |
| [Calling Dashboard V2](./calling-v2.md) | The same, plus data quality and which lists are being worked |
| [P1 Tracker](./p1-tracker.md) | Where has our best-quality population got to? |

## The pattern every tile follows

Almost every number is a **metric tile reading a formula column**, not a record count:

| Tile shows | Is |
|---|---|
| A whole number | **Sum of** a row-level formula — see [Formula columns](../reports/formulas.md) |
| A percentage | A **summary formula**, usually that sum divided by the row count |
| A trend | The same sum, as a line over Date |

So "Connects" and "Dial to Connect %" come from **one** report — the same column, read two ways.

## Ranges, and what they mean

Every metric tile has two range breakpoints that colour the number red, amber or green. They are
**targets, not data** — somebody chose them, and they are the only thing on these dashboards that
encodes an opinion about what good looks like.

If a tile is permanently red or permanently green, the ranges are probably wrong rather than the
calling.

## Filters come from different objects

Each dashboard filter maps to a field on a specific object, and getting that wrong is the most
common way to build a dashboard that filters nothing:

| Filter | Lives on |
|---|---|
| Date | **Activity** |
| FS Created By | **Activity** |
| FS Last List Name | **Activity** |
| Campaign // List Name | **Contact** |

A filter on an Activity field cannot narrow a report built on Contacts & Accounts, and vice
versa. That is why the two calling dashboards have different filter sets.

## Before you share one

**View Dashboard As** decides whose records the figures count. Set it deliberately — a dashboard
running as one person shows that person's visibility to everybody who opens it.

## Where this fits

The reports behind them are [the calculation reports](../reports/calculation.md) and
[the P1 Tracker reports](../reports/p1-tracker.md).
