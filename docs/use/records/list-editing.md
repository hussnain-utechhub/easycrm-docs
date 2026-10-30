---
title: Editing in a list
sidebar_position: 9.5
---

# Editing in a list

**What it is.** Changing values straight in the rows of a list, without opening each record —
one cell at a time, or the same value into many rows at once.

**When to use it.** Tidying up: setting the same **Type** on twenty accounts, correcting a run of
phone numbers, filling in a field that was left blank. It works the way Salesforce's own list
views do.

**When not to:** for one record with several changes, open the record instead — see
[Editing one field](./inline-editing.md). It shows every field, not just the list's columns.

## Changing a value

**Where:** In the portal → a tab → the list → the pencil in a cell, or the **Edit List** button

1. Open the tab and the list you want — **Accounts**, for example.
2. Point at a cell you want to change. A small pencil appears in it. Click the pencil.

   Or click the **Edit List** button — the pencil among the small buttons above the table,
   between the gear and the funnel. It opens the first cell you can edit.

3. Change the value, then press Enter or click outside the cell.
4. The cell turns yellow. That is a draft: nothing is saved yet.
5. Change as many cells as you like, in any rows. Each one turns yellow.
6. Click **Save** in the bar at the bottom of the list.

<!-- SHOT: records/list-edit-drafts.png | Accounts list filtered to one record type, three cells edited and yellow (e.g. Type, Phone, Rating), the Cancel / Save bar at the bottom of the table -->

The rows that saved show their new values and lose the yellow. To throw all the drafts away
instead, click **Cancel**.

## Changing many rows at once

**Where:** In the portal → a tab → the list → tick rows → edit a cell in one of them

1. Tick the box at the start of each row you want to change — up to 200 rows.
2. In one of the ticked rows, click the pencil in the column you want to change.
3. Enter the new value.
4. Tick **Update 3 selected items** (the number is however many rows you ticked), and confirm the
   value.
5. Every ticked row now has that value as a yellow draft.
6. Click **Save**.

<!-- SHOT: records/list-edit-mass.png | Accounts list, three rows ticked, the Type editor open in one of them with "Update 3 selected items" visible -->

After a save the ticks are cleared.

## Your drafts until you save

Drafts stay through sorting, searching the list and **Refresh**.

**They are lost, without any warning, if you leave the list** — by opening a record, clicking
another tab, or using the App Launcher. Save first.

## Who can edit what

You can edit in a list only what you could change on the record page:

- You need permission to edit that kind of record. Without it there is no **Edit List** button.
- You need edit access to each field. Columns you may not change show a small padlock while
  the list is being edited. Your administrator sets this under
  [Editable Fields](../../admin/access/permissions.md#editable-fields).
- You need access to each record. That is checked when you save, record by record — a record you
  may not edit is refused with **You don't have permission to edit this record.**, and the others
  still save.

If none of the list's columns is one you may edit, the **Edit List** button does not appear at
all.

## Fields that are never editable in a list

Whatever your permissions, these columns stay locked:

- fields the system works out: formulas, roll-up summaries and auto-numbers;
- the record's ID, **Created By**, **Created Date**, **Last Modified By**, **Last Modified Date**,
  **Last Activity Date** and similar system dates;
- the owner, the record type and the master record;
- whole names and whole addresses that are built from parts — a contact's full name, a billing
  address. Their parts, such as **First Name** or **Billing City**, can be edited when they are
  columns;
- fields Salesforce itself never lets anybody change;
- lookups that can point at more than one kind of record — a task's **Name** and **Related To**;
- picklists that depend on another picklist, and the picklists that control them;
- rich text, and location fields.

To change one of these, open the record — see [Changing a record](./editing.md).

## Lists of a kind of record with several record types

If a kind of record has two or more record types, every column is locked and the **Edit List**
button is greyed out. Hover over it and it says:

> Inline Edit is disabled. To edit, filter by one record type.

<!-- SHOT: records/list-edit-recordtype-locked.png | All Accounts on an org with several active Account record types: the greyed Edit List button with its tooltip "Inline Edit is disabled. To edit, filter by one record type." -->

To unlock it, filter the list to exactly one record type:

1. Open the filters panel and click **Add Filter** — see [Filtering a list](./filtering.md).
2. Choose the record type field (for example **Account Record Type**), the operator **equals**,
   and one record type.
3. Click **Save** in the filter, then **Save** at the top of the panel.

The list can then be edited. A filter like that on its own counts, and so does one combined
with others by **AND**. These do **not** unlock it:

- the record type filter combined by **OR**;
- **not equal to**, or **equals** with nothing chosen;
- a list that just happens to show rows of one record type, without the filter.

## The editor for each kind of field

| Field | How you change it |
|---|---|
| Name, text, phone, email, web address | Type in a box. |
| Number, currency, percent | Type a number. |
| Date | Pick from a calendar. |
| Date and time | Pick a date and a time. |
| Checkbox | Tick or untick. |
| Long text | Type in a larger box. |
| Picklist | Choose from a drop-down. **--None--** clears it — unless the field is required. |
| Multi-select picklist | Tick any of the listed values. |
| Time | Pick a time. It shows the way Salesforce shows one, like **8:05 AM**. |
| Lookup to another record | Type in the **Search...** box and pick from the matches. Enter picks the first one. |

A required field cannot be emptied: it says **Complete this field.**

## How a save works

Each record is saved on its own. If one is refused, the others still save:

- Rows that saved show their new values where they are. The list is **not** re-filtered or
  re-sorted, so a row that no longer matches the filter stays on screen until you click
  **Refresh**.
- A row that was refused keeps its yellow drafts and is marked **We hit a snag.** with the
  reason.
- At the bottom the table says **Your attention, please**, and a red notice repeats it — for
  example **Item 3 has errors in these fields: Phone.** The item number is the row number.

<!-- SHOT: records/list-edit-error.png | After saving two drafts where one row breaks a validation rule: the refused row marked "We hit a snag." and the red notice "Item 2 has errors in these fields: ..." -->

Fix the value and click **Save** again. Only the rows still yellow are sent.

Every saved record is recorded in the audit log under your name, the same as an edit on the
record page.

## What goes wrong

| Message or symptom | What it means |
|---|---|
| Your drafts disappeared | You left the list before saving. Drafts are not kept, and there is no warning. |
| The **Edit List** button is greyed out | The list is empty, a save is running, or the kind of record has several record types — see above. |
| There is no **Edit List** button | You may not edit this kind of record, or none of the columns is one you may change. |
| A column shows a padlock | You may not edit that field, or nobody can edit it from a list. |
| **Complete this field.** | A required field was left empty. |
| **You don't have access to edit "X".** (X is the field's name) | You have no edit access to that field. |
| **"X" can't be edited from a list.** | That field can only be changed on the record. |
| **Invalid value for Annual Revenue: abc** | The value is not right for the field — letters in a number, for example. |
| **You don't have permission to edit this record.** | You can see the record but not change it. |
| **This record wasn't saved. Try saving again.** | The portal ran out of time for that save. Click **Save** again; it sends only what is left. |
| **You can edit up to 200 records at a time.** | Save in smaller batches. |
| Your company's own message | A validation rule set up in Salesforce refused the value. The message is the rule's own. |
| **Region must be one of your values: …** | Your access is limited to certain values of one field (here, Region). Keep one of your own values. See [Field Scoped sharing](../../admin/sharing/field-scoped.md). |
| A saved row is still there although it no longer matches the filter | The list is not re-filtered after a save. Click **Refresh**. |

## Where this fits

Editing in a list changes the same fields, under the same rules, as
[editing on the record page](./inline-editing.md). Which columns the list shows is
[your choice](./columns.md).
