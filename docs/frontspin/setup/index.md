---
title: Before you start
sidebar_position: 0
---

# Setting up a FrontSpin tenant

This section takes one customer from nothing to syncing. Follow it in order — each step depends
on the one before.

## Where the work happens

Almost all of it is in **Salesforce Setup**, not in the EasyCRM portal. You need an administrator
login to Salesforce itself.

## What you need from FrontSpin first

Ask whoever runs the FrontSpin account for these. Nothing below works without them.

| You need | Looks like | Used for |
|---|---|---|
| **Tenant ID** | `100142` | Identifying the FrontSpin account |
| **API key** | a long secret string | Authenticating every request |
| **Webhook secret** | another secret string | Proving an incoming webhook is genuine |

Both secrets go into Salesforce **once** and are never typed again. The API key is held in a
Named Credential, so it is injected by the platform and never appears in Apex or in a log.

## The order of work

| Step | Page | Roughly |
|---|---|---|
| 1 | [The Record Type](./record-types.md) | 5 min |
| 2 | [The configuration row](./configuration.md) | 5 min |
| 3 | [Permissions](./permissions.md) | 10 min |
| 4 | [Fields going out](./fields-going-out.md) | 15 min |
| 5 | [Fields coming back](./fields-coming-back.md) | 10 min |
| 6 | [Webhooks](./webhooks.md) | 20 min |
| 7 | [Checking it](./checking-it.md) | 5 min |

Steps 4 and 5 are optional at first. A tenant with no field mappings still syncs the standard
fields; mappings add your own.

## A note on the screenshots

The screens below are real, with customer names, tenant ids and the org address replaced by
example values. Field names, layout and everything you click are untouched.

## One thing to decide before step 2

**Are you setting up the only FrontSpin account, or an additional one?**

- **The only one** — follow this section and ignore [Routing](../routing/index.md) entirely. The
  org stays in its default mode and everything works.
- **An additional one** — do this section first anyway, then read
  [Routing](../routing/index.md), which is about running several tenants at once safely.
