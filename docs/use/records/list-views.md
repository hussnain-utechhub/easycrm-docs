---
title: List views
sidebar_position: 2
---

# List views

## What a list view is

A saved set of records with its own columns, filters and sorting. One tab holds several, and
you switch between them.

"All Accounts" and "Recently Viewed" are both list views of the same tab. They differ only in
which records they contain.

## Why Recently Viewed is often empty

A tab opens on **Recently Viewed**, which is exactly what it says — records *you* have opened
recently. On a new account, or after a long gap, there is nothing to show.

**This is the single most common "the portal is broken" report, and it is not a fault.** The
records are there; this particular view has no history to list yet.

## Switching view

**Where:** a tab → the list name at the top → choose

1. Click the tab — **Accounts**, for example.
2. Click the **list name** in large text at the top (it will say "Recently Viewed" or similar).
3. A menu opens showing every view you can use.

   ![Choosing a list](../../img/shots/lists/view-picker.png)

4. Click the one you want.

**All Accounts** shows every record you are allowed to see. That is the view to reach for when
Recently Viewed is empty or you are looking for something specific.

## Making one open by default

Click the **pin** symbol next to the view name. Next time you open this tab, it starts there.

Pin the view you use every morning. It removes two clicks from every single visit.

## What the header tells you

| What you see | Means |
|---|---|
| The kind of record, in small grey text | Which tab you are on |
| The view name, large | Which *set* you are looking at |
| "N items" | How many records are in this view |
| "Updated just now" | When the data was last fetched |

If the count looks wrong, check the view name before anything else. People usually assume they
are on "All" when they are on something narrower.

## Views are not permissions

A view decides what is *displayed*. [Sharing](../../admin/sharing/index.md) decides what you
are *allowed* to see.

**All Accounts** does not mean every account in the company — it means every account **you**
can see. Two people opening the same view can legitimately see different numbers.

## What goes wrong

| Symptom | Cause |
|---|---|
| The list is empty | Recently Viewed with no history, or a filtered view with no matches. |
| "All" shows fewer records than a colleague sees | Sharing, not the view. |
| A view you used has gone | Views can be private to their creator, or removed. |
| Your columns changed | Each view has its own columns. You switched view. |

## Where this fits

A view carries your [column](./columns.md), [filter](./filtering.md) and
[sorting](./sorting.md) choices together. Changing any of them changes that view, for you.
