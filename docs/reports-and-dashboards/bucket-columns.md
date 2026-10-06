---
title: Bucket columns
sidebar_position: 6
---

# Bucket columns

**What it is.** A column you invent, which sorts values into groups you name.

**What it does.** You take an existing field and say "these values are Small, these are
Medium, these are Large". The report then has a column holding those names.

**Why it helps.** You can group and total by categories that matter to your business without
anybody adding a field to the database. No developer, no deployment.

## Making one

1. In the builder, click **Add column…**
2. Choose **Add Bucket Column**.
3. Pick the field to sort into buckets.
4. Name each bucket and say which values belong in it.
5. Click **Apply**.

Anything you do not place lands in **Unbucketed Values**, which you can rename.

## What you can bucket

| Field type | How it groups |
|---|---|
| **Picklist** | You drag values into named buckets. |
| **Number** | You set ranges, such as 0–99, 100–999. |
| **Text** | You list the values that belong in each bucket. |

## Using it

A bucket column behaves like any other column. You can group rows by it, group columns by it
in a matrix, and filter on it.
