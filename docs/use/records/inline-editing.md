---
title: Editing one field
sidebar_position: 9
---

# Editing one field

## What it is

Changing fields right where they are on the record page, without opening the edit window. You
click the pencil beside a field, change it, and save.

As in Salesforce, one pencil opens **every** field you may change at once. Change one, or
several, and save them together.

## When to use it

Fixing one thing. A phone number, a status, a date. It is two clicks instead of four and the
rest of the record stays in view.

It works equally well for a handful of fields, because they are all open at once. For a long
form you want to work through top to bottom, the [edit window](./editing.md) may be easier.

## Changing a field

**Where:** In the portal → **Accounts** → the record's name → the pencil beside a field

1. Click the tab, then the record's **name** to open it.
2. Move your pointer over the field you want to change.
3. A small **pencil** appears on its right. Click it.
4. Every field you may change becomes editable. Fields you may not change show a small
   padlock, labelled **Read only**.
5. A bar docks at the bottom of the screen with **Cancel** and **Save**, and
   **\* = Required Information** on its right.

   <!-- SHOT: records/inline-edit-mode.png | An Account record after clicking one pencil: every editable field open as an input, padlocks on read-only fields, the docked Cancel / Save bar with "* = Required Information" -->

6. Change the value — or several values.
7. Click **Save** in the bar.

The portal says **Record updated.** and the page shows the new values. **Cancel** closes every
field and throws the changes away. If you click **Save** without changing anything, it simply
closes the fields.

## How each kind of field is edited

| Field | How you change it |
|---|---|
| Text, email, phone, web address | Type in a box. |
| Long text | Type in a larger box. |
| Number, currency, percent | Type a number. |
| Date | Pick from a calendar. |
| Date and time | Pick a date and a time. |
| Checkbox | Tick or untick. |
| Picklist | Choose from a drop-down. There is no empty choice, so a picklist cannot be cleared here. In a list it can — choose **--None--** there; see [Editing in a list](./list-editing.md). |
| A lookup to another record | The current value shows as a small label with a cross. Click the cross, type in **Search...**, and pick the record you want. |
| An address | Separate boxes for **Street**, **City**, **State/Province**, **Zip/Postal Code** and **Country**. |
| Multi-select picklist | Typed as text, with the values separated by semicolons — `Red;Green`. |
| Time of day | Typed as text — `2:30 PM`, or `14:30`. |

Outside edit mode, dates and times read the way people write them — **9/21/2026, 8:55 AM**,
**9:30 AM** — with no stray "00:00:00". Every editor starts from the value stored on the
record — a date opens on its date, a date and time on its date **and** time — and only the
fields you actually changed are saved.

## When no pencil appears

That is the portal telling you something, and there are three different reasons:

| Reason | How to tell |
|---|---|
| The system calculates the field | It has a value but never a pencil, for anybody |
| You have no permission to edit it | Colleagues see a pencil and you do not |
| Nobody may edit it from the portal | No pencil for anybody, including admins — system fields such as **Created By**, for example |

If no field has a pencil, you may not edit this kind of record at all.

The second is the common one, and it is set per person — see
[Permissions](../../admin/access/permissions.md) and, specifically,
[Editable Fields](../../admin/access/permissions.md#editable-fields), which controls
field-by-field access.

The owner is changed with its own button rather than a pencil — see
[Changing who owns a record](./changing-owner.md).

## It is live immediately

There is no draft. Saving is as permanent as saving in the edit window, and everybody who can
see the record sees the new values at once.

## What goes wrong

| Symptom | Cause |
|---|---|
| **Could not save changes.**, or another red message | The save was refused. Validation rules set up in Salesforce show their own message; a wrong format shows **Invalid value for** and the field. The fields stay open with your changes, so fix and save again. |
| **Region must be one of your values: …** | Your access is limited to certain values of one field. See [Changing a record](./editing.md). |
| You cannot empty a picklist | There is no empty choice on the record page or in the edit window. Clear it from a list instead, with **--None--** — unless the field is required. |
| Your change disappeared later | Somebody else edited the same record. Last save wins. |
| A padlock beside a field | You can see it but not change it. |

## Where this fits

Editing on the page is the quick path; the [edit window](./editing.md) shows the whole form;
[editing in a list](./list-editing.md) changes many records at once. Which fields appear at
all is set by an administrator in [Page layouts](../../admin/layouts/index.md).
