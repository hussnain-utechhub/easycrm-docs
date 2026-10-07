---
title: Setup, or the portal
sidebar_position: 2
---

# Where report-to-list mappings live

## Two places, one switch

Report-to-list mappings can be stored in either of two places. **Only one is live at a time**, and
a single switch decides which.

| Source | Edited in | Who can edit |
|---|---|---|
| **Custom Metadata** | Salesforce Setup | A Salesforce administrator |
| **Custom Setting** | The EasyCRM portal's [List Mappings](../portal/list-mappings.md) tab | A portal Super Admin |

## The switch

**Setup** → **Custom Settings** → **FrontSpin Report List Control** → **Manage**

One tick box: **Use Custom Setting**.

| State | The live source is |
|---|---|
| Unticked (the default) | Custom Metadata, in Setup |
| Ticked | The Custom Setting, edited in the portal |

The switch **defaults to off and fails to off**, so its mere existence changes nothing until
somebody deliberately ticks it.

## Which to choose

| Choose Setup when | Choose the portal when |
|---|---|
| Mappings change rarely | Mappings change often |
| Only Salesforce admins should change them | Portal admins should manage their own |
| You want them deployed between orgs | You want changes to take effect without a deploy |

Custom Metadata travels with a deployment; a Custom Setting does not. That is the real trade-off:
repeatability versus immediacy.

## The trap

**Editing the source that is not switched on changes nothing, and gives no warning.**

If somebody adds a mapping in the portal while the switch is off, the portal shows it correctly,
the scheduled job never sees it, and nothing anywhere reports a problem.

So when a new mapping has no effect, check the switch **before** checking anything else.

## Only the source differs

Both sources are turned into the same shape before anything looks at them, so validation, error
messages and behaviour are identical either way. Nothing else about the sync changes.

## What goes wrong

| Symptom | Cause |
|---|---|
| A new mapping does nothing | It was added to the source that is not switched on. |
| Mappings vanished after switching | They are still there, in the other source. Switch back. |
| Setup and the portal disagree | Expected. They are two separate stores; only one is live. |

## Where this fits

The portal end is [List Mappings](../portal/list-mappings.md). What a mapping does is
[Report to List](./report-to-list.md).
