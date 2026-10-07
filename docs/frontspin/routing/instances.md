---
title: Instances and routing rules
sidebar_position: 1
---

# Instances and routing rules

## Two things, not one

| Thing | Says |
|---|---|
| **An instance** | How to reach one FrontSpin tenant |
| **A routing rule** | Which Record Type goes to which instance |

You need one instance per FrontSpin account, and one routing rule per Record Type you want routed.

## Instances

**Setup** → **Custom Metadata Types** → **FrontSpin Instance** → **Manage Records**

| Field | What to put |
|---|---|
| **Label** | The tenant's name |
| **Active** | Tick it. Untick to take the tenant out of service without deleting anything. |
| **Named Credential** | The credential holding this tenant's API key |
| **Base URL** | Only if there is no Named Credential |
| **Base Path** | The path part of the address |
| **Tenant Id** | The tenant's number |

**Prefer the Named Credential.** When one is set, the address is built through it and the API key
is attached by the platform — it never appears in code and never reaches a log. Base URL is the
fallback for cases where that is not possible.

## Routing rules

**Setup** → **Custom Metadata Types** → **FrontSpin Routing** → **Manage Records**

| Field | What to put |
|---|---|
| **Label** | Something readable, e.g. "Northwind Contacts" |
| **Active** | Tick it |
| **Object Api Name** | `Contact`, `Account` or `Lead` |
| **Record Type Developer Name** | The developer name from [step 1](../setup/record-types.md) |
| **FrontSpin Instance** | Which instance this Record Type goes to |

One rule per object per Record Type. A customer syncing all three objects needs three rules.

## The rule that must never be broken

**Two active rules must never send the same Record Type to different instances.**

If they do, routing reports **AMBIGUOUS_MAPPING** and refuses — which is the right answer. It
cannot pick one, and picking wrongly would put one customer's contact in another customer's
dialler.

Fix it by deactivating the rule that should not be there, not by deleting records.

## Deactivating, not deleting

Every one of these has an **Active** tick box, and unticking is almost always better than
deleting:

- Unticking an **instance** takes a tenant out of service; records routed to it are refused with a
  clear reason rather than sent somewhere wrong.
- Unticking a **rule** removes one Record Type from routing.
- Both are instantly reversible, and the history of what existed is kept.

## What goes wrong

| Symptom | Cause |
|---|---|
| "no mapping exists for Record Type" | No rule covers it. Add one. |
| "the mapping is inactive" | The rule exists but **Active** is unticked. |
| "the instance is switched off" | The rule is fine; its instance is inactive. |
| "two or more active mappings" | Two rules disagree. Deactivate one. |

Each of these is one of [the eight outcomes](./outcomes.md), which explains them in full.

## Where this fits

Rules are only **enforced** in STRICT mode — see [the three modes](./index.md).
