---
title: About the fields
sidebar_position: 0
---

# Fields on Contact

## What they are for

Every custom field in this build exists to serve a **report** or the
[Best Phone flow](../automation/best-phone.md). There are no decorative fields: if something is
here, something downstream reads it.

| Group | Fields | Used by |
|---|---|---|
| **Phone numbers** | Phone, Mobile, Phone 2–5, Best Phone | The dialler, and every "can we reach them" report |
| **Phone statuses** | A status beside each number, plus Best Phone Status | Scoring which number is worth calling |
| **Where they have got to** | Bucket Status, Follow Up Date | Almost every report |
| **Who owns the work** | BDR, Contact Owner (Rep) | Grouping by rep |
| **Where they came from** | Campaign // List Name | Grouping by list |
| **Research** | Website, LinkedIn URL, Company LinkedIn URL, Validator Notes, Custom 1–6 | Context for the caller |
| **Evidence** | Call Recording | Checking a call |

## The two pages

| Page | Covers |
|---|---|
| [Standard fields](./standard.md) | The Salesforce fields the build uses as they come |
| [Custom fields](./custom.md) | The fields created for this build |

## How a field gets added

**Where:** **Setup** → **Object Manager** → **Contact** → **Fields & Relationships** → **New**

1. Click the gear, top right, then **Setup**.
2. Click **Object Manager** in the top bar.
3. Click **Contact**.
4. Click **Fields & Relationships** in the left menu.
5. Click **New**, top right.
6. Choose the data type, click **Next**.
7. Give it a **Field Label**; the **Field Name** fills itself in and becomes the API name.
8. Set field-level security, choose the layouts it should appear on, and **Save**.

:::note
The original build document gives these steps as **Settings → Properties → Create Property**.
That is HubSpot's wording, not Salesforce's, and it does not match any screen in this org. The
steps above are the Salesforce ones.
:::

## Two rules worth keeping

**The API name is the contract.** Reports, the flow and the FrontSpin field mappings all refer
to a field by its API name. Renaming a field's *label* is free; changing its **Field Name** is
not, and breaks everything pointing at it.

**A status always sits beside its number.** Phone 2 has Phone 2 Status, Mobile has Mobile
Status. The flow depends on that pairing — see
[the Best Phone flow](../automation/best-phone.md).
