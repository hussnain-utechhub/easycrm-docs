---
title: Tiles
sidebar_position: 3
---

# Tiles

## What a tile is

One chart, number or table, reading from one report. A dashboard can also hold text tiles and
picture tiles, which read nothing.

Choosing the right kind is most of what makes a dashboard readable. The same report drawn as a
donut instead of a bar can go from obvious to useless.

## The eleven kinds

**Display As** in the tile's dialog offers these:

| Tile | Shows | Reach for it when | Avoid when |
|---|---|---|---|
| **Horizontal Bar** | Groups as bars across (the default) | Comparing groups, especially with long names | There is only one group |
| **Vertical Bar** | Groups as columns | Comparing a handful of groups | There are dozens of groups |
| **Stacked Horizontal Bar** / **Stacked Vertical Bar** | Each bar split into coloured parts, one per series | Showing how each total is made up | The report has no series — see below |
| **Line** | A value across ordered groups | Showing a trend | The groups are not in time order |
| **Donut** | Parts of one whole, total in the middle | Three to six categories | More than about six slices |
| **Funnel** | Groups as bands stacked top to bottom, each as wide as its value | A pipeline people move down, stage by stage | The groups are not stages in an order |
| **Metric** | One large number | A single figure people watch daily | The number needs context to mean anything |
| **Gauge** | One number on a dial | A single figure, glanced at | You want progress towards a target — see below |
| **Scatter** | One point per group, placed by two measures | Asking whether two figures move together | You have one measure |
| **Table** | Rows from the report | People need the detail | It is longer than the tile |

A **Pie** is not in the list. A tile draws one only when it takes the report's own pie chart,
with **Use chart settings from report**.

**Series** are what stacked bars split into: the column groups of a matrix report, or the measures
when the report's chart has more than one. A report with neither has nothing to stack, and its
stacked bars come out empty. Use **Horizontal Bar** or **Vertical Bar** for it instead.

## What a click does

On a dashboard, most tiles lead to the report behind them:

| Tile | Clicking it |
|---|---|
| Any bar, **Line**, **Donut**, **Funnel**, or a pie from the report | Opens the report narrowed to the group you clicked, plus the dashboard's filters |
| **Metric**, **Gauge** | Opens the report, narrowed by the dashboard's filters |
| **Table**, **Scatter** | Nothing. Use **View Report (…)** under the tile. Table rows already link to their records. |
| Text, image | Nothing |

A chart with no grouping, or one grouped by a bucket column, cannot be clicked into either. Every
report tile also has **View Report (…)** underneath for those. See
[Opening the report behind a tile](./viewing.md#opening-the-report-behind-a-tile).

## Choosing between bar and line

Both plot groups. The difference is whether the order means anything.

**Line** implies a sequence — it says "this followed that". Use it only when the groups are
genuinely ordered, which almost always means time.

**Bar** makes no such claim. Use it for owners, regions, stages, anything where the order is
arbitrary.

A line chart across sales reps implies a trend from Alice to Zoe that does not exist.

## Why a donut with twenty slices fails

A donut asks the reader to compare angles. People are poor at that beyond a handful of segments,
and the labels stop fitting. Past about six categories a bar chart is strictly easier to read.

If you have twenty categories and want a donut, the real answer is usually a
[bucket column](../reports/buckets.md) grouping them into five, or **Max Groups Displayed** with
**Sort By** set to **Value — high to low**, to keep the largest.

## A gauge is not a target

A **Gauge** has no target setting. Its dial runs from zero to the next round power of ten above
the value: 4,327 sits on a dial to 10,000, and 412,000 on a dial to 1,000,000. So the needle shows
roughly how many digits the number has, not how close it is to a goal. Rest the pointer on it and
the hover box gives the exact value and its share of the dial.

Use a gauge for a number you want to look at a glance. Do not use it to show progress towards a
target. For that, put the target in the tile's **Subtitle**, or place a second tile beside it.

## Metric tiles need context

One big number is only useful if the reader knows whether it is good. "£412,000" means nothing
on its own.

Give it context in the **Subtitle** (*"Target £400,000"*), or by placing it beside a related
metric so the comparison is on screen. A metric shows the report's grand total of the measure you
picked, whatever the report is grouped by.

## Tables

A **Table** tile drawn from a summary or matrix report shows one row per group, a column per
measure (and per column group, with a **Total** column for a matrix), and a **Total** row at the
bottom. Drawn from a report with no grouping, it shows the report's own rows.

The **Total** row of a one-measure table adds up every group the tile reads (up to 1,000), not
only the rows **Max Groups Displayed** leaves on show. A **Donut** works the same way: the total
in its middle, and each slice's percentage, count every group, so trimming the slices does not
shrink the whole. A group of records with nothing in the grouped field is shown as **-**.

## Adding one

See [The dashboard builder](./builder.md). The short version: **+ Widget** → **Chart or Table**,
choose the report, choose how to display it, set the title, click **Add Widget**, then **Save**.

## What goes wrong

| Symptom | Cause |
|---|---|
| The number is wrong | Open its **report**. The tile only draws what the report returns. |
| A chart is empty | The report has no grouping. Charts plot groups. |
| A stacked bar chart is empty | The report has no series to stack. Use a plain bar, or base it on a matrix report. |
| The gauge looks almost empty, or almost full | The dial runs to the next power of ten, not to a target. |
| A table is cut off | The tile is too small, or the report returns too many rows. |
| The tile says **The component can't be displayed because the field(s) you chose for the filter are unavailable.** | A ticked dashboard filter cannot be applied to its report. See [Filters](./filters.md#apply-to-each-component). |
| The tile says **This component can't be displayed right now: its source report could not run. Refresh it to try again.** | Its report failed to run. Refresh the tile; see [When a tile cannot show its numbers](./viewing.md#when-a-tile-cannot-show-its-numbers). |
| A **Metric** differs from the groups added up | It shows the report's grand total of the measure, as Salesforce does. For an Average, that is the report's overall average. |
| Clicking the tile does nothing | **Table** and **Scatter** tiles cannot be clicked into. Use **View Report (…)**. |

## Where this fits

A tile is a view of a [report](../reports/index.md). Change the report and every tile reading
from it changes — which is a feature when intended, and a surprise when not.
