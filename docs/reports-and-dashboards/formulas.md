---
title: Formula columns
sidebar_position: 7
---

# Formula columns

**What it is.** A column that calculates its own value instead of reading a field.

**What it does.** You write a small expression and the report works out the answer for every
row, or for every group.

**Why it helps.** Percentages, differences and ratios stop being something you do afterwards
in a spreadsheet. The report is the finished answer.

There are two kinds, and the difference matters.

## Row-level formula

Calculates once **per record**.

1. Click **Add column…**
2. Choose **Add Row-Level Formula**.
3. Write the expression.
4. Click **Apply**.

Use it for things that are true of a single record — days between two dates, a value times a
rate.

## Summary formula

Calculates once **per group**, using the totals.

1. Click **Add column…**
2. Choose **Add Summary Formula**.
3. Write the expression.
4. Choose where it applies: at every grouping level, or only at the grand total.

Use it for things that only make sense across several records — a percentage of a total, a
conversion rate.

## Which one do I want?

Ask whether the answer makes sense for one record on its own.

- "How many days old is this?" — one record. **Row-level**.
- "What percentage of this month's total is this rep?" — needs the group. **Summary**.

Percentages are shown as percentages, so a formula returning 0.25 displays as 25%.
