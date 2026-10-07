---
title: Tiles
sidebar_position: 3
---

# Tiles

## What a tile is

One chart, number or table, reading from one report.

Choosing the right kind is most of what makes a dashboard readable. The same report drawn as a
pie instead of a bar can go from obvious to useless.

## The six kinds

| Tile | Shows | Reach for it when | Avoid when |
|---|---|---|---|
| **Metric** | One large number | A single figure people watch daily | The number needs context to mean anything |
| **Bar** / **Column** | Groups side by side | Comparing groups | There is only one group |
| **Line** | A value over time | Showing a trend | The groups are not in time order |
| **Pie** / **Donut** | Parts of one whole | Three to six categories | More than about six slices |
| **Gauge** | Progress to a target | There is a real target | You have no target, only a number |
| **Table** | Rows from the report | People need the detail | It is longer than the tile |

## Choosing between bar and line

Both plot groups. The difference is whether the order means anything.

**Line** implies a sequence — it says "this followed that". Use it only when the groups are
genuinely ordered, which almost always means time.

**Bar** makes no such claim. Use it for owners, regions, stages, anything where the order is
arbitrary.

A line chart across sales reps implies a trend from Alice to Zoe that does not exist.

## Why a pie with twenty slices fails

A pie asks the reader to compare angles. People are poor at that beyond a handful of segments,
and the labels stop fitting. Past about six categories a bar chart is strictly easier to read.

If you have twenty categories and want a pie, the real answer is usually a
[bucket column](../reports/buckets.md) grouping them into five.

## Metric tiles need context

One big number is only useful if the reader knows whether it is good. "£412,000" means nothing
on its own.

Give it context by using a **gauge** against a target instead, or by placing it beside a
related metric so the comparison is on screen.

## Adding one

See [The dashboard builder](./builder.md). The short version: **+ Widget**, choose the report,
choose the kind, set the title, save.

## What goes wrong

| Symptom | Cause |
|---|---|
| The number is wrong | Open its **report**. The tile only draws what the report returns. |
| A chart is empty | The report has no grouping. Charts plot groups. |
| A table is cut off | The tile is too small, or the report returns too many rows. |
| The tile ignores a dashboard filter | It is unmapped. See [Filters](./filters.md). |

## Where this fits

A tile is a view of a [report](../reports/index.md). Change the report and every tile reading
from it changes — which is a feature when intended, and a surprise when not.
