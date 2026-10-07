/* Enterprise-depth rewrite of the Records section, with the long pages split. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

f["use/records/index.md"] = `---
title: Records
sidebar_position: 0
slug: /use/records
---

# Records

A **record** is one thing: a company, a person, a task, a meeting. Records are the information
itself — everything else in the portal is a way of finding, reading, changing or counting them.

## The four kinds you will see

| Kind | Is | Usually called |
|---|---|---|
| **Account** | A company or organisation | Accounts |
| **Contact** | A person, usually at an account | Contacts |
| **Task** | Something to do | Task |
| **Event** | Something in the diary | Event |

Your portal may show different tabs. An administrator chooses which appear, so your list is
whatever your company needs.

## How you move through them

Almost everything follows the same path:

**A tab** → **a list** → **one record** → **the thing you came to do**.

| Step | Page |
|---|---|
| Open a list of records | [Looking at a list](./lists.md) |
| Switch which set you are looking at | [List views](./list-views.md) |
| Narrow it down | [Filtering](./filtering.md) |
| Change what the table shows | [Columns](./columns.md) · [Sorting](./sorting.md) |
| Open one record | [Opening a record](./opening-a-record.md) |
| Change it | [Editing](./editing.md) |
| Add a new one | [Creating](./creating.md) |
| Move it to somebody else | [Changing the owner](./changing-owner.md) |
| See what is linked to it | [Related records](./related-records.md) |

## Two things worth knowing before you start

**There is no draft.** When you save a change it is live for everybody who can see the record.
No approval step, no undo.

**Blue text does something.** A record name opens that record, an email address starts an
email, a phone number starts a call. If it is blue, it is a link.
`;

f["use/records/list-views.md"] = `---
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
`;

f["use/records/searching.md"] = `---
title: Searching
sidebar_position: 3
---

# Searching

## Two different searches

The portal has two, and reaching for the wrong one wastes time.

| | Where | Searches |
|---|---|---|
| **Global search** | The box at the very top of the screen | Every kind of record you can see |
| **Search this list** | Above a list, on the right | Only the list you are on |

## Global search — when you do not know where it lives

**Where:** the **Search...** box at the top of any page

1. Click **Search...** in the middle of the top bar.
2. Start typing. A few letters is enough — you do not need the whole name.
3. Results appear underneath as you type, grouped by kind of record.

   ![Searching](../../img/shots/shell/search.png)

4. Click a result to open it.

Use this when you know the name but not which tab it is under — or when you are not sure
whether "Acme" is an account or a contact.

## Search this list — when you are already there

**Where:** a tab → **Search this list...**

1. Open a tab and its list.
2. Click **Search this list...** above the table on the right.
3. Type part of a name. The table narrows as you type.

   ![Searching a list](../../img/shots/lists/search-in-list.png)

This only looks at the records in the current view. If you search "Acme" in a view filtered to
one region, you will not find Acme in another region — the view excluded it before the search
ran.

## Which to use

| You want | Use |
|---|---|
| One record, name known | Global search |
| Not sure which tab it is on | Global search |
| To narrow a list you are working through | Search this list |
| Everything matching a condition, not a name | Not search — use a [filter](./filtering.md) |

That last row matters. Search finds by **name**. "Every account in London" is not a search, it
is a filter.

## What goes wrong

| Symptom | Cause |
|---|---|
| No results for something you know exists | Searching a list that excludes it. Try global search. |
| Nothing found at all | Sharing — you may not have access to that record. |
| Too many results | Add more of the name, or filter the list instead. |
| A record you expected is missing | Search covers what you are allowed to see, nothing more. |

## Where this fits

Search finds one record. [Filtering](./filtering.md) finds a *set*. [Reports](../reports/index.md)
answer questions about a set. Those three cover almost everything people try to use search for.
`;

f["use/records/sorting.md"] = `---
title: Sorting
sidebar_position: 5
---

# Sorting

## What it does

Puts the rows of a list in order by one column. It changes nothing about the records — only
the order you see them in.

## Sorting a list

**Where:** a tab → click a column heading

1. Open a tab and its list.
2. Click a **column heading** — **Account Name**, for example.
3. The list sorts by that column. A small arrow shows the direction.
4. Click the same heading again to reverse it.

Each heading also carries a small arrow on its right which opens a menu with the same options.

![A column menu](../../img/shots/lists/column-actions.png)

## How different fields sort

| Field type | Order |
|---|---|
| Text | A to Z, then reversed |
| Number | Smallest to largest |
| Date | Oldest to newest |
| Picklist | The order the options were defined in — **not** alphabetical |

That last one surprises people. A Stage picklist sorts Prospect, Qualified, Closed because
that is the order it was built in, which is usually more useful than alphabetical.

## Empty values

Records with nothing in the sorted column group together at one end. If a sort looks like it
has "lost" records, scroll to the other end of the list — they are usually sitting in a block
of blanks.

## Sorting is per view

Your sort is remembered with the [list view](./list-views.md) you are on. Switch view and you
get that view's sort instead.

It is also yours alone. Sorting a shared view does not re-sort it for anybody else.

## When sorting is not the right tool

Sorting puts the interesting rows at the top. It does not remove the rest.

| You want | Use |
|---|---|
| The ten biggest at the top | Sorting |
| **Only** records over a threshold | [Filtering](./filtering.md) |
| A count or total per group | A [report](../reports/index.md) |

Scrolling a sorted list of forty thousand records to find a subset is a filter waiting to be
written.

## What goes wrong

| Symptom | Cause |
|---|---|
| Numbers sort as 1, 10, 2 | The field is text, not a number. Ask your administrator. |
| A picklist is not alphabetical | Correct — it sorts in defined order. |
| The sort resets | You switched view, or reloaded a view with a saved sort. |
| Clicking the heading does nothing | Some columns cannot be sorted; long text is the usual case. |

## Where this fits

Sorting, [columns](./columns.md) and [filtering](./filtering.md) are the three things you
change about a list, and all three are saved with the [view](./list-views.md).
`;

f["use/records/inline-editing.md"] = `---
title: Editing one field
sidebar_position: 9
---

# Editing one field

## What it is

Changing a single field without opening the whole record for editing. A pencil appears beside
the field; you click it, change the value, and save.

## When to use it

Fixing one thing. A phone number, a status, a date. It is two clicks instead of four and it
leaves the rest of the record untouched.

**When not to:** when you are changing several fields at once. Use
[full edit](./editing.md) — one save instead of five, and the record is only in flux once.

## Changing a field

**Where:** **Accounts** → the record's name → hover the field → the pencil

1. Click the tab, then the record's **name** to open it.
2. Move your pointer over the field you want to change.
3. A small **pencil** appears on its right. Click it.
4. The field becomes editable. Change the value.
5. Click **Save**.

The record updates immediately.

## When no pencil appears

That is the portal telling you something, and there are three different messages:

| Reason | How to tell |
|---|---|
| The system calculates the field | It has a value but never a pencil, for anybody |
| You have no permission to edit it | Colleagues see a pencil and you do not |
| Nobody may edit it from the portal | No pencil for anybody, including admins |

The second is the common one, and it is set per person — see
[Permissions](../../admin/access/permissions.md) and, specifically, **Editable Fields**, which
controls field-by-field access.

## It is live immediately

There is no draft. Saving a single field is as permanent as saving the whole record, and
everybody who can see the record sees the new value at once.

## What goes wrong

| Symptom | Cause |
|---|---|
| Save is refused with a message | The value is the wrong format, or a required field elsewhere is empty. |
| The field snaps back to its old value | The save failed. Look for the message rather than retyping. |
| Your change disappeared later | Somebody else edited the same record. Last save wins. |
| The pencil appears but the field is grey | You can see it but not change it. |

## Where this fits

Inline editing is the quick path; [full edit](./editing.md) is the one for several fields.
Which fields appear at all is set by an administrator in
[Page layouts](../../admin/layouts/index.md).
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Wrote ${n} record pages at depth.`);
