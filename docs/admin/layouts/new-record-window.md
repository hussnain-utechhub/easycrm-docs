---
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

**Where:** In the portal → the layout editor → **New Record Window Fields**

1. Open the layout editor from any record.
2. Find the **New Record Window Fields** area.
3. Move fields in and out, exactly as for the [record page](./fields.md).
4. Click **Save Layout**.

**One set, for everybody.** The New window's fields are the same for everyone, whether the layout
was saved for you or for all users, and only Admins and Super Admins can set them. Anybody else
can move fields in the box, but the change is not kept. With no fields chosen, the window asks
for the page layout's fields.

### In the layout builder

**Where:** In the builder → nothing selected → **New record window** → **Choose fields**

1. With nothing selected on the page, find **New record window** in the page settings. It says
   how many fields are chosen, or **Not set - the window shows the layout**.
2. Click **Choose fields**. A window titled **New record window fields** opens.
3. Drag fields from **Available fields** into **In the window**. That side is drawn in the New
   window's own two columns — left to right, then the next row — so a field lands exactly where
   it will appear. Drag one back, or click its cross, to remove it.
4. Click **Done**, then **Save** in the builder's toolbar.

System fields — created and modified dates, owner, record type and the like — are not offered.

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
| Your choice of fields was not kept | Only Admins and Super Admins can set them. |

## Where this fits

The last of the four things a layout controls, with [fields](./fields.md),
[sections](./sections.md) and [related lists](./related-lists.md).
