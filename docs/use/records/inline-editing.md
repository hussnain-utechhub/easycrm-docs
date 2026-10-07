---
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
