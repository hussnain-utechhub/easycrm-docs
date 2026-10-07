---
title: Standard fields
sidebar_position: 1
---

# Standard fields

These come with Salesforce. The build uses them as they are — nothing here was created.

| Field | Data type | API name |
|---|---|---|
| Name | Name | `Name` |
| Reports To | Lookup (Contact) | `ReportsToId` |
| Account Name | Lookup (Account) | `AccountId` |
| Title | Text (128) | `Title` |
| Lead Source | Picklist | `LeadSource` |
| Email | Email | `Email` |
| Phone | Phone | `Phone` |
| Mobile | Phone | `MobilePhone` |
| Mailing Address | Address | `MailingAddress` |
| Created By | Lookup (User) | `CreatedById` |

## Why these in particular

| Field | Why the build needs it |
|---|---|
| **Account Name** | Every contact report groups or reports by account |
| **Title** | Drives the role tiering a caller works from |
| **Phone** and **Mobile** | Two of the seven numbers the [Best Phone flow](../automation/best-phone.md) chooses between |
| **Email** | Carried into FrontSpin, which requires one |
| **Created By** | Used to tell imported contacts apart from ones created in the org |

## On the calling side

Calls are Salesforce **Activities** — Tasks and Events. Reports about calling are built on the
**Activities with Contacts** report type and read:

| Field | Holds |
|---|---|
| **Call Result** | The outcome the caller chose. Every calculation formula reads this. |
| **Subject** | What the activity was |
| **Date** | When |
| **Full Comments** | The caller's notes |

**Call Result is the single most important field in the whole build.** Every counted number on
every dashboard is a formula over it. Its values are listed in
[Call results](../reference/bucket-statuses.md#call-results).

## A caution about renaming

These are standard fields, so their API names cannot change — which is exactly why reports built
on them are safe. The custom fields are where a rename can quietly break things; see
[Custom fields](./custom.md).
