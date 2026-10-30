---
title: Editing values in a report
sidebar_position: 2.5
---

# Editing values in a report

**What it is.** Changing field values straight from a report's rows, without opening each
record.

**What it does.** You switch field editing on, change as many cells as you need, and save them
together. Each change is written to the record that cell belongs to.

**Why it helps.** Tidying up a list — a status on forty contacts, the missing phone numbers on
an account list — becomes one screen instead of forty record pages.

**When not to:** when you are changing most of the fields on one record. Open the record and
use its own edit form — see [Editing a record](../records/editing.md).

## Which reports you can edit

| Report | Where you can edit |
|---|---|
| **Tabular** | Every row. |
| **Summary** | The detail rows. Group headings, subtotals and totals never are. |
| **Matrix** | Only the **Details** pane below the grid, so **Detail Rows** must be on. The figures in the grid are totals and cannot be edited. |

The **Enable Field Editing** button appears only when the report is showing rows that can be
edited.

<!-- SHOT: report-viewer/edit-matrix-details.png | A matrix report with Detail Rows on and the Details pane docked below the grid, Field Editing Enabled, pencils showing in the Details rows -->

## Turning editing on

**Where:** In the portal → **Reports** → the report → **Enable Field Editing**

1. Open the report.
2. Click **Enable Field Editing** at the top, beside **Filters**.
3. The button turns blue and reads **Field Editing Enabled**, with a tick.
4. Every cell you may edit now shows a small **pencil**. A cell you may not edit shows a
   **padlock** — point at it to see why.

<!-- SHOT: report-viewer/edit-enabled.png | Contacts & Accounts tabular report with Field Editing Enabled: pencils on most cells, padlocks on a few, the dark padlock tooltip "Inline editing isn't supported for this cell." showing -->

Editing belongs to the report you are reading. Opening another report starts with it off.

## Changing a value

1. Click the **pencil** in the cell.
2. A small editor opens under the cell, labelled with the column's name. It says
   **Loading...** while it reads the value stored on the record, and **Apply** stays grey until
   that value arrives.
3. Change the value.
4. Click **Apply**.

<!-- SHOT: report-viewer/edit-date.png | Same Contacts & Accounts report, the date editor open under a Birthdate cell with the stored date in the picker -->

Nothing is written yet. The cell shows its new value, highlighted, and a bar at the bottom of
the screen counts what you have changed: **1 value edited**, **3 values edited**.

Carry on with as many cells as you need.

## Saving your changes

1. In the bar at the bottom, click **Save**.
2. Every change is written. Several changes to the same record go in one save.
3. A message confirms it: **1 record saved.** or, say, **4 records saved.** It counts records,
   not values.
4. The report runs again from your live data, so you see the values exactly as they were
   stored.

To throw away everything you have not saved, click **Cancel** in the bar.

<!-- SHOT: report-viewer/edit-bar.png | Three highlighted cells with staged values and the bottom bar reading "3 values edited" with Cancel and Save -->

### Apply and Save are different

| Button | What it does |
|---|---|
| **Apply** (in the cell's editor) | Stages that one value. Nothing is written. |
| **Cancel** (in the cell's editor) | Closes the editor. Whatever was staged for that cell stays as it was. |
| **Save** (in the bar) | Writes every staged value to its record. |
| **Cancel** (in the bar) | Throws every staged value away. |

Applying the value that is already stored stages nothing. Changing a cell back to its stored
value takes its staged change away again.

A saved value is a real change, exactly as if you had edited the record itself. Everybody who
can see that record sees the new value at once.

## Limits

| Limit | Message |
|---|---|
| **12** values in one row before saving | **You can edit up to 12 fields in one row before saving.** |
| **100** values in the whole report before saving | **You can edit up to 100 values before saving.** |

Save what you have, then carry on.

## The editor each field gets

The editor always starts from the value **stored on the record**, not from the text in the cell.
That is why a date opens in a date picker even though the report prints it as text, and why a
picklist shows its real value even where the report prints a label.

| Field type | Editor |
|---|---|
| Picklist | A drop-down. **--None--** is offered unless the field is required. A value the record holds that is no longer active still appears, so it is never replaced unless you choose to. |
| Dependent picklist | Only the values the controlling field allows — counting a controlling value you have staged but not yet saved. If it allows none: **No values are available for the current value of the field that controls this one.** |
| Multi-select picklist | A list of tick boxes. Saved in the picklist's own order; the cell shows the values separated by ";". |
| Checkbox | A tick box. |
| Number, currency, percent | A number box. |
| Date | A date picker. |
| Date/time | A date and time picker. |
| Time | A time picker. The cell shows times like "9:30 AM". |
| Text, phone, email, URL | A text box, with an **X** (**Clear**) that empties it. |
| Long text | A box several lines tall. |
| Rich text | A formatting editor. The report itself shows only the text. |
| Lookup | **Current:** and the record it points to, then a **Search...** box. Type, pause, and click a record in the list. The **X** (**Clear the lookup**) empties it. If you pick nothing, nothing changes. |

<!-- SHOT: report-viewer/edit-lookup.png | Contacts & Accounts report, the Account Name cell's editor open: "Current:" with the account name, a few letters typed in Search..., the matching accounts listed below -->

## Which record a cell changes

| Column | What Save changes |
|---|---|
| A field of the row's own record — Phone on a contacts report | That row's record. |
| A field of a parent record — the account's Phone on a contacts report | The **parent** record, the account. After Save, every row showing that account shows the new value. |
| The parent's name — Account Name on a contacts report | **Which** account the contact belongs to. The pencil opens a lookup: pick a different account. It never renames the account. |
| Account Name on an Activities report | The activity's **Related To**, set to the account you pick. |
| A contact column on an **Activities with Contact** report | That contact. |
| A field only tasks have, on an Activities report | Task rows only. Event rows show a padlock. |

On a row with no parent record — a contact with no account — the parent's columns show a
padlock. The **Account Name** column still has a pencil there: use it to give the contact an
account.

Unlike Salesforce, the report does not need a Name or ID column for editing to work, and task
and event fields, long text fields and Opportunity Amount can be edited.

## What the padlocks mean

| Message | Meaning |
|---|---|
| **Inline editing isn't supported for this cell.** | Nobody can edit this cell from a report: formulas, roll-up summaries, auto-numbers, the record ID, the created and last-modified fields, the owner, the record type, a name or address made of parts (a contact's full Name, a Billing Address), an activity's **Name** and **Related To** (they can point at several kinds of record), bucket and row-level formula columns, fields Salesforce never lets anyone change (such as Is Email Bounced and Photo URL) — or a row that has no record for that column. |
| **You don't have permission to edit this field.** | You may not edit this kind of record, or this particular field. An administrator sets this per person — see [Permissions](../../admin/access/permissions.md). |

The grouping columns on a summary's detail rows show neither: their cells are empty, because the
value sits on the group heading.

A pencil means the field can be edited. Whether this particular record can be is checked when
you save — see the first row below.

## What goes wrong

| Symptom | Cause |
|---|---|
| **2 of 3 records saved.** followed by a reason | Some records saved and at least one was refused — a validation rule, a required field, or a record you have no access to. The reason shown is the first refusal. What saved stays saved; the report re-runs, so a refused cell shows its stored value again. |
| **This value could not be loaded for editing.** — sometimes followed by **You don't have access to this record.** or **That record no longer exists.** | The editor could not read the stored value, so it closed rather than guess at it. |
| **You can edit up to 12 fields in one row before saving.** | You have staged 12 values on that row. Save, then carry on. |
| **You can edit up to 100 values before saving.** | You have staged 100 values. Save, then carry on. |
| Your staged values vanished | You clicked **Field Editing Enabled** while values were staged. That throws them away at once, **without asking** — editing stays on, and a second click turns it off. Leaving the report (**Back**, another tab, another report) also throws them away without a warning. |
| A highlighted new value is on a different row after a sort | Staged values stay pinned to their position on screen, not to the record. Sorting, changing a filter, or regrouping or removing a column before you save can put the highlight on another row — and editing that cell then stages the value against the wrong record. **Save or Cancel before you re-sort or re-filter.** |
| No **Enable Field Editing** button | The report shows no editable rows — for example a matrix with **Detail Rows** switched off. |
| Every cell has a padlock | None of the report's columns can be edited, or you have no edit access to these records or fields. Point at a padlock: the message says which. |

## Where this fits

Field editing happens on the [report you are running](./running.md); none of it changes the
report itself. On a record page the same pencil edits [one field](../records/inline-editing.md),
and a list view has its own [list editing](../records/list-editing.md). Which fields each person
may change is set in [Permissions](../../admin/access/permissions.md).
