---
title: Bucket columns
sidebar_position: 10
---

# Bucket columns

**What it is.** A column you invent, which sorts existing values into groups you name
yourself.

**What it does.** You take a field and say "these values are Small, these are Medium, these
are Large". The report then has a column holding those names.

**Why it helps.** You can group and total by categories that matter to your business without
anybody adding a field to the database. No developer, no waiting.

## Creating one

**Where:** **Reports** → a folder → the report's name → **Edit** → **Outline** → **Add column…** → **Add Bucket Column**

1. Click **Reports** in the top menu.
2. Click the folder, then the report's **name**, then **Edit**.
3. In the **Outline** tab, click the **Add column…** box.
4. Choose **Add Bucket Column**.
5. Pick the field whose values you want to sort.
6. Name each bucket, and put values into it.
7. Click **Apply**.

The new column appears in the preview straight away.

## How values are sorted depends on the field

| Field type | How you define the buckets |
|---|---|
| **Picklist** | Drag the available values into named buckets. |
| **Number** | Set ranges, such as 0–99, 100–999, 1000 and above. |
| **Text** | List which exact values belong in each bucket. |

## Anything left over

Values you do not place land in **Unbucketed Values**. You can rename that to something
clearer, such as "Other" or "Not set".

Always check what has fallen in there. A large Unbucketed group usually means values you did
not expect — which is itself worth knowing.

## Using the column

A bucket column behaves like any other column. You can:

- Group rows by it, to get a subtotal per bucket.
- Group columns by it in a matrix.
- Filter on it.
- Sort by it.

## Changing one

Click **Column actions** on the bucket column, then edit it. The report updates immediately;
no data is changed, because a bucket exists only inside this report.

## It lives in one report

A bucket column belongs to the report you made it in. To use the same grouping elsewhere,
either copy the report with **Save As**, or ask an administrator for a real field if you need
it everywhere.
