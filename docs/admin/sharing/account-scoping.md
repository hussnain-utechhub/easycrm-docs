---
title: Account scoping
sidebar_position: 7
---

# Account scoping

## What it is

An older way of tying a portal user to an **Account**, so that records belonging to that account
are opened up to them — the portal's version of a Salesforce Sharing Set.

## There is no screen for it in the portal any more

The portal no longer has any control for account scoping. The **New User** dialog has no Account
field, and the org-wide default dialog no longer shows the match fields.

**To limit people to their own accounts from inside the portal, use
[Field Scoped sharing](./field-scoped.md).** For example: set Contact to **Field Scoped** on
**Account ID**, and give each company its account Ids as values. Its people then see only the
contacts under their own accounts.

## How the two differ

| | Account scoping | Field Scoped |
|---|---|---|
| Set up | In Salesforce, on records with no portal screen | In the portal, by a Super Admin |
| What it does | **Adds** access: matching records are opened up, on top of whatever else the person can see | **Narrows** access: only records carrying the person's values, and nothing else |
| A person's own records outside the match | Still visible | Hidden |
| Per company | No — set per user | Yes — per company, or per person |
| Shown in Record Access as | **Field match: *field* matches this user** | **In your field scope (*field*)** |

The key difference: account scoping never hides anything. Under a **Public** default it changes
nothing at all; under **Private** it adds the matching records to what the person already sees.

## If your portal already uses it

Existing configuration keeps working. The sharing engine still honours an account match set up in
Salesforce, on two records:

| Where in Salesforce | Field | Holds |
|---|---|---|
| The person's **Portal User** record | **Account** | The account they belong to. |
| The object's **Portal Sharing Setting** record | **Match Field (Record)** | The field on the object that points at the account, for example `AccountId`. |
| The same record | **Match Field (Portal User)** | The field on the Portal User it is compared with, normally `Account__c`. |
| The same record | **Match Access** | **Read/Write** or **Read Only** — what a match grants. |

**Both match fields must be filled** for the match to work. When a record's field holds the same
value as the person's, they get the **Match Access** level.

Changing any of it means editing those records in Salesforce. There is nothing to change in the
portal.

## What goes wrong

| Symptom | Cause |
|---|---|
| A client still sees other clients' records | Account scoping only adds access. If the default is **Public**, or a rule grants more, nothing is hidden. Use [Field Scoped](./field-scoped.md) to narrow. |
| A client cannot see their account's records on one object | One of the two match fields is blank on that object's Portal Sharing Setting, or the person has no **Account**. |
| Account matching started working after somebody saved an org-wide default | Saving an object's default in the portal fills **Match Field (Portal User)** with `Account__c` when it was blank. If **Match Field (Record)** is already set for that object, matching then applies. |
| You cannot find where to set a user's account | There is no portal screen for it. It is the **Account** field on the Portal User record in Salesforce. |

## Testing it

1. Open [Record access](./record-access.md) on a record belonging to one account.
2. Find a user tied to that account. The reason should read **Field match: *field* matches this
   user**.
3. Find a user tied to a *different* account and confirm they do not have that reason.

Step 3 is the one people skip, and it is the one that catches a wrong match field.

## Where this fits

Account scoping is one of the grants listed in [Sharing](./index.md): it raises access, like a
sharing rule. [Restriction rules](./restriction-rules.md) and [Field Scoped](./field-scoped.md) are
the two things that narrow it. When they disagree, [Record access](./record-access.md) tells you
which one is deciding.
