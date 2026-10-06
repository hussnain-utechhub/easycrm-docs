---
title: Formula columns
sidebar_position: 8
---

# Formula columns

**What it is.** A column that calculates its own value instead of reading a field.

**What it does.** You write a short expression and the report works out the answer — for every
row, or for every group.

**Why it helps.** Percentages, differences and ratios stop being something you do afterwards
in a spreadsheet. The report is the finished answer.

There are two kinds, and the difference matters more than anything else on this page.

## Row-level formula — calculates per record

**Where:** **Reports** → a folder → the report's name → **Edit** → **Outline** → **Add column…** → **Add Row-Level Formula**

1. Open the report in the builder.
2. In the **Outline** tab, click **Add column…**
3. Choose **Add Row-Level Formula**.
4. Name the column.
5. Write the expression, using the fields and functions offered.
6. Click **Apply**.

Use it for things that are true of a single record: days between two dates, a value times a
rate, two fields added together.

## Summary formula — calculates per group

**Where:** **Reports** → a folder → the report's name → **Edit** → **Outline** → **Add column…** → **Add Summary Formula**

1. Open the report in the builder.
2. Click **Add column…**
3. Choose **Add Summary Formula**.
4. Name it and write the expression, using the report's totals.
5. Choose **How to apply this formula**:
   - at every grouping level, or
   - only at the grand total.
6. Click **Apply**.

Use it for things that only make sense across several records: a percentage of a total, a
conversion rate, an average of averages.

A summary formula needs the report to be **grouped**. With no groups there is nothing to
summarise.

## Which one do I want?

Ask whether the answer makes sense for one record on its own.

| Question | Makes sense for one record? | Use |
|---|---|---|
| How many days old is this? | Yes | **Row-level** |
| Value times commission rate | Yes | **Row-level** |
| What share of the month's total is this rep? | No | **Summary** |
| Win rate | No | **Summary** |

Choosing the wrong one is the usual reason a formula shows a plausible but wrong number.

## Percentages

A formula returning 0.25 is shown as 25%. Set the column's format to percent and let the
report do the conversion — do not multiply by 100 yourself as well, or you will get 2500%.

## Editing or removing one

Click **Column actions** on the formula column, then edit or remove it. Nothing outside this
report is affected.
