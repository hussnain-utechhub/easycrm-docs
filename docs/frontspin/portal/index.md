---
title: Where FrontSpin appears
sidebar_position: 0
---

# FrontSpin in the portal

Most of the integration lives in Salesforce Setup. Three things are in the EasyCRM portal, where
a Super Admin can reach them without a Salesforce login.

| Place | For |
|---|---|
| [List Mappings](./list-mappings.md) | Pointing a report at a FrontSpin calling list |
| [Sync health](./sync-health.md) | Seeing whether the integration is keeping up |
| [A company's tenant](./company-tenant.md) | Recording which FrontSpin account a company uses |

## If FrontSpin is not installed

The portal is built to cope with its absence. Opening a FrontSpin page in an org without the
integration shows:

> FrontSpin is not set up in this org, so there is nothing to manage here. The list mapping tables
> need to be present before this tab can be used.

That is the expected message, not an error. Nothing is broken and nothing needs fixing — the
integration simply is not installed here. See
[the boundary](../index.md#an-important-boundary).

## Who can see these

Portal **Super Admins**. An ordinary Admin sees them only if a Super Admin has allowed those
console tabs for their company, the same as every other Admin Console tab.

## What the portal cannot do

Everything structural is in Salesforce Setup and stays there:

| Not in the portal |
|---|
| [Configuration rows](../setup/configuration.md) |
| [Field mappings](../setup/fields-going-out.md), in or out |
| [Webhooks](../setup/webhooks.md) |
| [Routing rules and the mode](../routing/index.md) |

That split is deliberate. The portal manages day-to-day work; the things that decide where
customer data goes need a Salesforce administrator.
