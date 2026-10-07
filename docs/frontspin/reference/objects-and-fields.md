---
title: What is stored where
sidebar_position: 1
---

# What is stored where

A map of everything the integration creates, for when an error names something unfamiliar.

## Records it creates

| Object | Holds | One per |
|---|---|---|
| **FrontSpin List** | The catalogue of lists in each tenant | List |
| **FrontSpin List Membership** | Who was added to which list, and when | Addition |
| **FrontSpin Sync Error** | A failed sync, with its reason | Failure |

### FrontSpin List

| Field | Holds |
|---|---|
| FrontSpin List ID | FrontSpin's numeric id for the list |
| FrontSpin List Name | Its name there |
| FrontSpin Config | Which configuration row owns it |
| Tenant ID | Which tenant |
| Company | The company name, where it could be matched |
| List Key | The unique key stopping duplicates |
| Last Synced On | When the catalogue last saw it. **An old date means it has gone from FrontSpin.** |
| Active | Whether it is active there |

### FrontSpin List Membership

| Field | Holds |
|---|---|
| Contact | The Salesforce Contact |
| FrontSpin Contact ID | Its FrontSpin counterpart |
| FrontSpin List ID | Which list |
| FrontSpin Config | Which configuration row |
| Membership Key | The unique key stopping duplicates |
| Status | How it went |
| Synced On | When |

### FrontSpin Sync Error

Covered field by field in [Sync errors](../troubleshooting/sync-errors.md).

## Configuration it reads

All in **Setup** → **Custom Metadata Types**.

| Type | Says | Covered in |
|---|---|---|
| **FrontSpin Configuration Settings** | Record Types → tenant | [Step 2](../setup/configuration.md) |
| **FrontSpin Field Mapping** | Fields going out | [Step 4](../setup/fields-going-out.md) |
| **FrontSpin Inbound Field Mapping** | Fields coming back | [Step 5](../setup/fields-coming-back.md) |
| **FrontSpin Webhook Config** | How to verify incoming messages | [Step 6](../setup/webhooks.md) |
| **FrontSpin Instance** | How to reach one tenant | [Instances](../routing/instances.md) |
| **FrontSpin Routing** | Record Type → instance | [Instances](../routing/instances.md) |
| **FrontSpin Setting** | The routing mode | [The three modes](../routing/index.md) |
| **FrontSpin User** | FrontSpin users ↔ Salesforce users | — |
| **FrontSpin Report List Mapping** | Report → list | [Report to List](../lists/report-to-list.md) |

Plus two **Custom Settings**:

| Setting | Says |
|---|---|
| **FrontSpin Report List Control** | Which mapping source is live |
| **FrontSpin Report List Mapping CS** | The portal-edited mappings |

See [Setup, or the portal](../lists/where-mappings-live.md) for how those two work together.

## Fields it adds to your records

| Field | On | Holds |
|---|---|---|
| FrontSpin id | Account, Contact, Lead | The record's id in FrontSpin |
| FrontSpin Tenant ID | Account, Contact, Lead | Which tenant issued that id |

The second exists to stop an id minted in one tenant being sent to another, where it would land
on a real but unrelated record. See
[Tenants and Record Types](../understand/tenants-and-record-types.md).

## Scheduled jobs

| Name | Runs |
|---|---|
| **FrontSpin List Catalog** | Hourly, at half past |
| **FrontSpin Report to List** | Hourly, on the hour |
| Quota retry | After the daily allowance resets |

The two hourly jobs are offset so they never start in the same minute, and neither can
accidentally cancel the other — their names deliberately share no prefix.
