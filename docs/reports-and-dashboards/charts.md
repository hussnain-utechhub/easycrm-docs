---
title: Charts on a report
sidebar_position: 8
---

# Charts on a report

**What it is.** A picture of the report, above the table.

**What it does.** It draws whatever the report has grouped, using whatever the report totals.

**Why it helps.** A trend or an outlier is obvious in a chart and invisible in four hundred
rows.

A report must have at least one **group** before it can have a chart. The chart plots groups,
so without one there is nothing to draw.

## Adding one

1. In the builder, click **Chart properties**.
2. Choose the chart type.
3. Choose what it measures.

![Chart properties](../img/shots/report-builder/chart-properties.png)

4. Click **Apply**.

## Choosing a type

| Type | Best for |
|---|---|
| **Bar** / **Column** | Comparing groups against each other. |
| **Line** | A value changing over time. |
| **Pie** / **Donut** | Parts of a whole, when there are only a few. |

A pie with twenty slices tells nobody anything. Use a bar chart instead.

## Sliced by

If a report has more than one grouping, you can choose which one the chart uses. The same
report then answers two questions without being rebuilt.
