/* Depth pass: layouts, sharing, data and operations. Completes the admin track. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

/* ---------------------------------------------------------------- layouts */
f["admin/layouts/fields.md"] = `---
title: Choosing fields
sidebar_position: 2
---

# Choosing fields

## What you are deciding

Which fields appear on a record page, in what order — **for everybody** who sees that kind of
record, not just you.

## Opening the editor

**Where:** **Accounts** → any record's name → **Edit Page Layout**

It is reached from a record, not the Admin Console. Any record of that kind will do — the
layout applies to all of them.

![The layout editor](../../img/shots/layout/editor.png)

## Moving fields

Two lists sit side by side:

- **Available** — fields not on the page
- **Shown (in order)** — the fields on the page, top to bottom

| To | Do |
|---|---|
| Add a field | Click it on the left, then **Move selection to Shown (in order)** |
| Remove one | Click it on the right, then **Move selection to Available** |
| Reorder | Click it on the right, then **Move selection up** / **down** |

## Finding a field among hundreds

Click **Search fields…** and type part of the name.

![Searching for a field](../../img/shots/layout/search-fields.png)

Fields you have already chosen stay on the right while you search, so searching can never lose
your work.

## How many fields to show

Fewer than you think. A layout is a reading surface, and every field you add makes the ones
that matter harder to find.

| Guide | Why |
|---|---|
| Lead with identity | Name, owner, status — what tells you which record this is |
| Then what people act on | The handful that change regularly |
| Then everything else, in a section | Collapsed, available, out of the way |
| Leave off what nobody reads | It is still on the record; it is just not displayed |

## Removing a field never deletes data

The value stays on the record and remains available to [reports](../../use/reports/index.md)
and the [API](../data/api-integration.md). It is only hidden from this page.

That makes removing fields low-risk and reversible — the opposite of deleting one.

## What goes wrong

| Symptom | Cause |
|---|---|
| A field is missing from **Available** | It does not exist on that object, or you lack permission for it. |
| Your change did not appear | **Save Layout** was not clicked, or people need to reload. |
| Somebody still cannot edit a field | Layout shows a field; **Editable Fields** permission decides if they may change it. |

That last row is the common confusion: putting a field on a layout does **not** grant edit
access. See [Permissions](../access/permissions.md).

## Where this fits

Fields are one of four things a layout controls, alongside
[sections](./sections.md), [related lists](./related-lists.md) and the
[new-record window](./new-record-window.md).
`;

f["admin/layouts/sections.md"] = `---
title: Sections
sidebar_position: 3
---

# Sections

## What a section is

A heading with fields grouped under it. Readers can fold a section away, so sections are how a
long record page stays readable.

## When to add one

When a layout passes about a dozen fields. Below that, grouping adds ceremony without helping;
above it, an ungrouped wall of fields is genuinely hard to read.

## Adding one

**Where:** the layout editor → **Add Section**

1. Open the layout editor from any record.
2. Click **Add Section**.

   ![Adding a section](../../img/shots/layout/add-section.png)

3. Give it a name.
4. Move fields into it.

Use **Move section up** / **down** to reorder, and **Remove section** to delete one.

**Removing a section does not delete its fields or any data.**

## Naming sections

Name them for what the reader is looking for, not for where the data came from.

| Good | Poor |
|---|---|
| Billing | Address Information 2 |
| Contract | Custom Fields |
| System information | Misc |

## A section order that works

1. **Information** — identity and the fields people act on
2. **Billing / Contract / whatever your business needs**
3. **System information** — created, modified, ids. Last, and usually collapsed

Putting system fields first is the most common layout mistake. Nobody opens a customer record
to find out when it was created.

## What goes wrong

| Symptom | Cause |
|---|---|
| A section is empty on some records | Its fields are empty for those records. |
| Sections are not in the order you set | **Save Layout** was not clicked. |
| A section cannot be removed | Some built-in sections are fixed. |

## Where this fits

Sections organise the [fields](./fields.md) you chose. [Related lists](./related-lists.md) sit
below them.
`;

f["admin/layouts/related-lists.md"] = `---
title: Related lists
sidebar_position: 4
---

# Related lists

## What they are

The tables at the bottom of a record showing other records linked to it — the contacts at an
account, the tasks on a contact.

## Why they matter

They are how somebody moves between connected records without searching. An account page with
no contacts list forces every user to go to Contacts and filter, every time.

## Adding one

**Where:** the layout editor → **Related Lists** → **Add related list…**

1. Open the layout editor from any record.
2. Scroll to the **Related Lists** area.
3. Click the **Add related list…** box.

   ![Adding a related list](../../img/shots/layout/add-related-list.png)

4. Choose which records it should show.
5. Click **Save Layout**.

## Where the activity panel sits

**Above related lists** controls whether the calls-and-tasks panel appears before or after
them.

Above is usually right: activity is what most people came for, and related records are
reference.

## Which lists to include

| Include | Because |
|---|---|
| The obvious children | Contacts on an account, tasks on a contact |
| Anything people currently search for | That search is a missing related list |

| Leave off | Because |
|---|---|
| Lists that are always empty | They teach people to ignore the area |
| Everything available | The page becomes a directory |

## Permission still applies

A related list only shows records the reader is allowed to see. Two people on the same record
can legitimately see different numbers of related records — see
[Sharing](../sharing/index.md).

If somebody reports an empty related list, check their access before changing the layout.

## What goes wrong

| Symptom | Cause |
|---|---|
| The list is missing for some users | They lack permission for that object. |
| It is empty | Nothing is linked yet — not a fault. |
| It shows the wrong columns | Columns are set per related list in the editor. |

## Where this fits

Related lists sit below [sections](./sections.md) on the same layout. What a *new* record asks
for is separate — see [The new-record window](./new-record-window.md).
`;

f["admin/layouts/new-record-window.md"] = `---
title: The new-record window
sidebar_position: 5
---

# The new-record window

## What it is

The form somebody fills in when they click **New**. It is configured **separately** from the
record page, and that separation is deliberate.

## Why it is separate

A record page is for reading — it can afford fifty fields. A creation form is for getting a
record into the system quickly, and every extra field is friction at the exact moment somebody
is trying to capture something.

A form with forty fields produces records with thirty-five blanks and users who avoid creating
records at all.

## Setting it

**Where:** the layout editor → **New Record Window Fields**

1. Open the layout editor from any record.
2. Find the **New Record Window Fields** area.
3. Move fields in and out, exactly as for the [record page](./fields.md).
4. Click **Save Layout**.

## What belongs on it

| Include | Why |
|---|---|
| Required fields | It cannot be saved without them |
| Identity | Name, and whose it is |
| Anything genuinely only known at creation | The source of a lead, say |

| Leave off | Why |
|---|---|
| Anything filled in later | It can be added on the record |
| Anything usually unknown at creation | A blank field invites a guess |
| System fields | They fill themselves in |

**Aim for five to eight fields.** If it does not fit on one screen without scrolling, it is
too long.

## A warning about required fields

A required field that is not on this form makes creation **impossible** — the save is refused
for a field nobody can see.

If people report they cannot create records and the error names a field, this is where to look.

## What goes wrong

| Symptom | Cause |
|---|---|
| Save refused for an invisible field | A required field missing from this form. |
| Records are created mostly empty | The form asks for too much; people skip. |
| **New** does not appear | Create permission, not layout. See [Permissions](../access/permissions.md). |

## Where this fits

The last of the four things a layout controls, with [fields](./fields.md),
[sections](./sections.md) and [related lists](./related-lists.md).
`;

/* ---------------------------------------------------------------- operations */
f["admin/operations/audit-log.md"] = `---
title: Audit Log
sidebar_position: 1
---

# Audit Log

## What it is

A record of who did what, and when. It cannot be edited, deleted or switched off by anybody,
including a Super Admin.

That immutability is the whole point. A log an administrator can alter is not evidence.

## When you will use it

| Situation | What the log answers |
|---|---|
| "I didn't change that" | Who did, and when |
| A setting changed and nobody knows why | Which admin, which day |
| Repeated failed sign-ins | Whether somebody is being targeted |
| Reviewing support access | Who viewed the portal as somebody else |

## Opening it

**Where:** **Admin** → **Audit Log**

1. Click **Admin** in the top menu.
2. Click **Audit Log** in the row of tabs.

![Audit Log](../../img/shots/admin/audit-log-full.png)

Newest first. Each row shows who, what and when.

## Narrowing it

1. Click **All actions** to filter by the kind of action.

   ![Filtering the audit log](../../img/shots/admin/audit-log-filter.png)

2. Or type into **Search** to find a person or record.

Both work together, so you can ask for one kind of action by one person.

## What is recorded

| Action | Kept |
|---|---|
| Sign-in | Who and when |
| **Failed** sign-in | Repeated failures on one account are worth noticing |
| Password change or reset | Who changed whose |
| Administration changes | Permissions, sharing, users |
| Viewing the portal as somebody else | **Both** names, allowed or refused |

## That last row, in detail

Support impersonation is logged more carefully than anything else:

- Every **attempt** is recorded, including refused ones.
- Anything done during the session records **both** names — the administrator and the account.

So the log always answers "who really did this?", not just "whose account was it?". See
[Seeing the portal as somebody else](../users/login-as.md).

## How to use it when something looks wrong

1. Filter by the **kind** of action first — it cuts the volume fastest.
2. Then narrow to the person or the day.
3. Read the surrounding rows, not just the one you were looking for. Changes come in clusters,
   and the row before often explains the row you found.

## What it does not tell you

It records **administrative** actions and access, not every field change on every record. If
you need to know who changed one field on one account, that is record history in Salesforce,
not this.

## What goes wrong

| Symptom | Cause |
|---|---|
| An action you expected is missing | Not every action is audited — record edits are not. |
| Too many rows | Filter by action kind before searching. |
| You cannot delete an entry | Correct, and deliberate. |

## Where this fits

The audit log is the record of what the rest of the Admin Console did. It is the first place to
look when a setting changed and nobody owns up.
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Wrote ${n} pages.`);
