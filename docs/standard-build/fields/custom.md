---
title: Custom fields
sidebar_position: 2
---

# Custom fields

Created for this build, on **Contact**. Every one is read by a report, by the
[Best Phone flow](../automation/best-phone.md), or by both.

## The phone set

Seven numbers, each with a status, plus the chosen best one.

| Field | Type | API name |
|---|---|---|
| Phone 2 | Phone | `Phone_2__c` |
| Phone 3 | Phone | `Phone_3__c` |
| Phone 4 | Phone | `Phone_4__c` |
| Phone 5 | Phone | `Phone_5__c` |
| Phone Status | Text (255) | `Phone_Status__c` |
| Phone 2 Status | Text (255) | `Phone_2_Status__c` |
| Phone 3 Status | Text (255) | `Phone_3_Status__c` |
| Phone 4 Status | Text (255) | `Phone_4_Status__c` |
| Phone 5 Status | Text (255) | `Phone_5_Status__c` |
| Mobile Status | Text (255) | `Mobile_Status__c` |
| **Best Phone** | Phone | `Best_Phone__c` |
| **Best Phone Status** | Text (255) | `Best_Phone_Status__c` |

**Phone** and **Mobile** themselves are [standard fields](./standard.md); only their statuses are
custom. That is why the list above has five statuses but only four numbered phones.

A status holds a score such as `p1`, `p2` or `p3`. Reports filter on
**Best Phone Status contains P1** to mean "we have a good number for this person".

## Where they are in the process

| Field | Type | API name |
|---|---|---|
| Bucket Status | Picklist | `Bucket_Status__c` |
| Follow Up Date | Date | `Follow_Up_Date__c` |

Bucket Status is the spine of the build. Its nineteen values are listed in
[Bucket statuses](../reference/bucket-statuses.md).

## Who owns the work

| Field | Type | API name |
|---|---|---|
| BDR | Text (255) | `BDR__c` |
| Contact Owner (Rep) | Picklist | `Contact_Owner_Rep__c` |

**BDR** is used as a filter rather than a grouping — several templates filter on
`BDR equals ""` to mean "not yet claimed by anybody".

## Where the contact came from

| Field | Type | API name |
|---|---|---|
| Campaign // List Name | Text (255) | `Campaign_List_Name__c` |

The grouping behind "by campaign" and "by list" on every dashboard. The double slash in the
label is part of the name.

## Research and context

| Field | Type | API name |
|---|---|---|
| Website | URL | `Website__c` |
| LinkedIn URL | URL | `LinkedIn_URL__c` |
| Company LinkedIn URL | URL | `Company_LinkedIn_URL__c` |
| Validator Notes | Long Text Area (131,072) | `Validator_Notes__c` |
| Custom 1 | Long Text Area (131,072) | `Custom_1__c` |
| Custom 2 | Long Text Area (131,072) | `Custom_2__c` |
| Custom 3 | Long Text Area (131,072) | `Custom_3__c` |
| Custom 4 | Long Text Area (131,072) | `Custom_4__c` |
| Custom 5 | Long Text Area (131,072) | `Custom_5__c` |
| Custom 6 | Long Text Area (131,072) | `Custom_6__c` |

**Custom 1–6** are deliberately unnamed. They carry whatever a particular list needs, so a new
campaign does not require a new field each time. The cost is that nobody can tell what is in one
without asking — so write it down in Validator Notes, or name the field properly if it becomes
permanent.

## Evidence

| Field | Type | API name |
|---|---|---|
| Call Recording | URL | `Call_Recording__c` |

## Where the original document is wrong {#where-the-original-document-is-wrong}

Every API name above was read back from a live org. Five entries in the original build document
do not match what is actually there, and all five would break a report or a formula if copied
out of it:

| Field | The document says | Actually |
|---|---|---|
| Best Phone Status | `Best_Phone__c` | `Best_Phone_Status__c` |
| LinkedIn URL | `LinedIn_URL__c` | `LinkedIn_URL__c` |
| Follow Up Date | `Follow_Up_Date` | `Follow_Up_Date__c` |
| Campaign // List Name | `Campaign_List_Name_c` | `Campaign_List_Name__c` |
| Mobile / Created By | Data type and API name columns swapped | See [Standard fields](./standard.md) |

The first is the dangerous one: the document gives **Best Phone** and **Best Phone Status** the
same API name, so anyone building from it would wire the status to the number.

:::note
**Custom 6** appears on the page layout in the original document, but only `Custom_1__c` to
`Custom_5__c` were present in the org checked. Confirm which you have before relying on it.
:::

## There are far more fields than these

The org carries well over a hundred custom fields on Contact — enrichment-vendor numbers,
FrontSpin sync fields, recruiting fields and more. The list above is the subset **this build**
uses, which is what the original document set out to record.
