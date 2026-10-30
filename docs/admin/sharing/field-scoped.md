---
title: Field Scoped sharing
sidebar_position: 7.5
---

# Field Scoped sharing

**What it is.** An org-wide default that shows each person only the records whose chosen field
holds one of *their* values.

**What it does.** You pick one field on an object — a region, a territory code, the account a
contact belongs to — and give each company, or each person, the values they may see. Every other
record of that object is hidden from them.

**Why it matters.** It is the one org-wide default that **takes access away**. Every other setting
under [Sharing](./index.md) adds access; this one narrows it, strictly, even for records somebody
owns.

**Who can use it.** Only a **Super Admin** can set an object to Field Scoped, choose its field, or
give anybody values. Super Admins themselves are never restricted by it.

## When to use it

Use it when the rule really is "you see the records with your value in this field":

- a franchisee who sees only their own territory;
- a distributor who sees only their own region;
- a client company that sees only the contacts under its own accounts (scope Contact on
  **Account ID**, with each company's account Ids as its values).

**Do not use it** when access should follow who owns a record or who manages whom. That is
[Private](./defaults.md) plus [sharing rules](./rules.md) and the [role hierarchy](./roles.md).

## The rules

| Rule | What it means |
|---|---|
| **Company values, or personal values** | A company's values apply to all its users. A person's own values **replace** their company's — they are not added to them. |
| **No values, no records** | A person with no values of their own, whose company has none either, sees **no** records of that object. |
| **Strict** | A record outside their values is hidden even if they own it, it was shared with them, a sharing rule covers it, or they have **View All** or **Modify All** on the object. |
| **Super Admins see everything** | They are never restricted, so they are not even listed under **Values**. |
| **Company Admins are restricted** | An Admin is treated like everybody else: they see only their own values' records. |
| **Restriction rules still apply** | A [restriction rule](./restriction-rules.md) can narrow the in-scope records further. It can never add records outside the scope. |
| **Controlled by Parent follows** | An object set to [Controlled by Parent](./defaults.md#controlled-by-parent) with this object as a parent shows only the children of in-scope records. |

It applies everywhere the portal reads that object: lists, record pages, related lists, search,
lookups, activities, the home page counts, reports and dashboards, and the API. A report's saved
copy is kept separately for each set of values, so nobody is ever shown a copy worked out for
somebody whose values are wider.

## Before you start

**Have the values ready.** The moment you save an object as Field Scoped, everybody except Super
Admins sees **none** of its records, because nobody has values yet. Choose a quiet moment, and give
values straight after saving.

## Setting it up

### 1 · Choose the field

**Where:** In the portal → **Admin** → **Sharing** → **Org-Wide Defaults** → the object's **Edit** (pencil) button

1. Click **Admin** in the top menu, then **Sharing**. **Org-Wide Defaults** opens first.
2. Click the pencil (**Edit**) on the object's row. The **Org-Wide Default — *object*** dialog
   opens.
3. In **Default Access**, choose **Field Scoped**. It is offered only to a Super Admin.

   A note appears: *Each user sees only the records whose chosen field holds one of their values,
   set per company (for all its users) or per user (replacing the company's). Their own records
   outside those values are hidden too, and a user with no values sees none. SuperAdmins always see
   everything.*

4. In **Scope field**, choose the field. Fields are listed as label and API name, for example
   **Account ID (AccountId)**.
5. In **Access to records in scope**, choose **Read/Write** (the default) or **Read Only** — see
   [below](#read-only-or-readwrite).
6. Click **Save**. The message **Field Scoped saved. Give companies and users their values with
   Values.** confirms it.

<!-- SHOT: admin/sharing-owd-dialog-field-scoped.png | Super Admin; Sharing → Org-Wide Defaults → pencil on Contacts; dialog "Org-Wide Default — Contacts" with Default Access = Field Scoped, the explanatory note visible, Scope field = Account ID (AccountId), Access to records in scope = Read/Write -->

The object's row now reads **Field Scoped**, with a line under it naming the field and the access —
for example **on AccountId · Read/Write** — and a **Values** button beside the pencil.

<!-- SHOT: admin/sharing-owd-field-scoped.png | Super Admin; Sharing → Org-Wide Defaults list with the Contacts row showing "Field Scoped", the line "on AccountId · Read/Write" under it, and the Values button beside the pencil -->

**Which fields can be chosen.** Text, email, phone, URL, picklist, number, currency, percent,
checkbox, date, and lookup fields — one exact value per record. Not offered: long text and text
area fields, multi-select picklists, date/time fields, formula fields, encrypted fields, and the
record's own Id, **Owner**, **Record Type**, **Created By**, **Last Modified By** and **Master
Record** fields.

### 2 · Give companies and people their values

**Where:** In the portal → **Admin** → **Sharing** → **Org-Wide Defaults** → **Values** on the object's row

1. Click **Values**. The **Field Scope — *object* (*field*)** dialog opens, with every company
   under **Companies** and every user except Super Admins under **Users**.
2. To find one, type in **Search companies and users**. It matches a name, a company, or a value
   already entered.
3. In the box beside the company or person, type the values, **one per line**.
4. Click **Save** on that row. **Each row saves on its own** — nothing else in the dialog is
   saved. The message **Field scope saved for *name*.** confirms it.
5. Click **Close** when you are done.

<!-- SHOT: admin/sharing-field-scope-values.png | Super Admin; Values on the Field Scoped Contacts row; dialog "Field Scope — Contacts (Account ID)" with one company holding two account Ids, and three users showing "Uses these values", "Uses the company values" and "No values: sees no records" under their names -->

Under each person's name is their company — **No company** if they have none — and which values
apply to them:

| Shown | Means |
|---|---|
| **Uses these values** | They have their own values, which replace their company's. |
| **Uses the company values** | Their box is empty, so their company's values apply. |
| **No values: sees no records** | Neither they nor their company has values. They see nothing of this object. |

That line follows what is in the boxes on screen, saved or not. Save every row you changed.

**To put somebody back on the company's values,** empty their box and click **Save** on their
row. Emptying a company's box and saving removes the company's values.

### What to type

| Field type | Type | Notes |
|---|---|---|
| Text, email, phone, URL | `North` | Matched regardless of capitals. Up to 255 characters per value. |
| Picklist | The value as it is stored | Its API name, which can differ from the label people see. |
| Number, currency, percent | `12` or `2.5` | Digits only — no currency sign, % sign or thousands separator. |
| Checkbox | `true` or `false` | |
| Date | `2026-10-30` | Year, month, day. |
| Lookup | The record's Id | 15 or 18 characters — for **Account ID**, the account's Id. |

Values are trimmed, and a value repeated (ignoring capitals) is kept once. A company or person can
hold up to **500** values per object.

## Read Only or Read/Write

**Access to records in scope** decides what the scope itself grants.

| Setting | In-scope records |
|---|---|
| **Read/Write** | Everybody can see and edit them. |
| **Read Only** | Everybody can see them. They can still edit the in-scope records they **own**, and the role hierarchy, sharing rules and manual shares can still raise access to edit — but only on in-scope records. |

Either way, editing also needs **Edit** on the object in [Permissions](../access/permissions.md).

## What people see

- **Lists, reports, dashboards and search** contain only in-scope records, and the counts match.
- **A record outside their values**, opened from a link, shows **Record not found.** — the same as
  a record that does not exist, so its existence is not given away.
- **A new record** with the scope field left blank is filled in for them when they have exactly one
  value.
- **An edit that does not touch the scope field** saves normally.

Saving a record — on the record form, in a list, in a report, or through the API — is refused if it
would leave the record outside the person's own values:

| Message | What it means |
|---|---|
| ***Field* must be one of your values: *a, b*.** | The scope field holds a value that is not one of theirs. The message lists theirs. |
| **You have no *Field* values assigned, so you can't save records here.** | They have no values at all for this object. |
| **Choose a *Field*: you can only create records with one of your values.** | A new record with the scope field blank, and they have more than one value to choose from. |
| **This object is restricted by a field scope that is not set up correctly.** | The scope field has been deleted or can no longer be filtered. A Super Admin must choose a field again. |

## Checking who sees a record

[Record Access](./record-access.md) lists every active user and why they can or cannot reach a
record. For a Field Scoped object it shows two reasons of its own:

- **Outside your field scope** — **No Access**, whatever else would have granted it.
- **In your field scope (*field*)** — access granted by the scope, for example **In your field scope
  (AccountId)**.

## What company Admins see

An Admin can open **Sharing**, but cannot change a Field Scoped object:

- **Field Scoped** is not offered in **Default Access**.
- A Field Scoped row has no **Values** button.
- Opening its **Edit** dialog shows **Only a SuperAdmin can change a Field Scoped object.**
- Saving it anyway is refused with **Only a SuperAdmin can change the sharing of a Field Scoped
  object.** (another default chosen) or **Only a SuperAdmin can manage field scoping.** (left on
  Field Scoped).

## How it is audited

Every change is written to the [Audit Log](../operations/audit-log.md) as **Change Permission**:

| Details | Written when |
|---|---|
| `OWD Contact = Field Scoped on AccountId (Edit)` | An object is set to Field Scoped, or its field or access changes. **(Read)** means Read Only, **(Edit)** Read/Write. |
| `Field scope Contact for company Acme` | A company's values are saved. |
| `Field scope Contact for user jo@acme.com` | A person's values are saved. |

The rows record **whose** values changed, not what the values were.

## Changing or switching it off

- **A different field:** open **Edit** again and choose another **Scope field**. Everybody's values
  are kept and are now matched against the new field — review them under **Values**, because a value
  that is not valid for the new field matches nothing.
- **Off:** open **Edit**, choose another **Default Access** and click **Save**. The values are kept,
  and apply again if the object is set back to Field Scoped.

Both take effect immediately. Check with [Record Access](./record-access.md) afterwards.

## What goes wrong

| Symptom | Cause |
|---|---|
| Nobody but Super Admins sees any records | Nobody has values yet. Give companies their values under **Values**. |
| One person sees nothing | No values of their own and none on their company. **Values** shows **No values: sees no records**. |
| Somebody sees fewer records than the rest of their company | They have their own values, which replace the company's. |
| An owner cannot see their own record | Strict by design: ownership does not reach outside the scope. |
| A sharing rule or manual share has no effect | The record is outside the person's values. Nothing reaches outside the scope. |
| **Record not found.** on a record that exists | It is outside that person's values. |
| **"*x*" is not a valid *Field*.** | The value cannot exist in that field — see [What to type](#what-to-type). |
| **Up to 500 values can be set.** | More than 500 values in one box. |
| **Choose the field this object is scoped on.** | **Save** was clicked with no **Scope field**. |
| **Choose a field this object can be scoped on.** | The field chosen cannot be used — see which fields can be chosen, above. |
| A field is missing from **Scope field** | It is a type that cannot be used: long text, multi-select, date/time, formula, encrypted, or a system field. |
| A change to **Grant access using hierarchies** did not stick | A Field Scoped save stores only the field and the access. The hierarchy box is saved only with the other defaults. |
| Records imported by an Admin disappear from that Admin's view | [CSV Import](../data/csv-import.md) does not check field scope: rows are saved with whatever the file holds in the scope field. Records outside the Admin's values are then hidden from them. |
| The note on the Org-Wide Defaults tab says every other layer only grants more access | It does not apply to a Field Scoped object, which narrows access. |

## Where this fits

Field Scoped is one choice of [org-wide default](./defaults.md). It replaces the grants listed in
[Sharing](./index.md) for that object: inside the scope they still apply, outside it nothing does.
[Restriction rules](./restriction-rules.md) narrow it further, and
[Record Access](./record-access.md) shows which one is deciding.
