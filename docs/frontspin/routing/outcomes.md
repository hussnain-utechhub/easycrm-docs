---
title: The eight outcomes
sidebar_position: 2
---

# The eight outcomes

Every attempt to work out where a record should go ends in exactly one of eight results. They
appear in [sync errors](../troubleshooting/sync-errors.md) and in the
[health check](../setup/checking-it.md), so it is worth being able to read them.

## The one good one

| Outcome | Means | Do |
|---|---|---|
| **RESOLVED** | The record was matched to an active instance | Nothing |

## The seven others

| Outcome | Means | Do |
|---|---|---|
| **NOT_CONFIGURED** | No routing rules exist at all | Nothing — the org is still on a single tenant. Normal. |
| **NO_RECORD_TYPE** | The record has no Record Type | Set one on the record |
| **NO_MAPPING** | Rules exist, but none covers this Record Type | [Add a rule](./instances.md) |
| **MAPPING_INACTIVE** | A rule exists for it, but is switched off | Tick **Active**, if it should be on |
| **INSTANCE_INACTIVE** | The rule is fine; its instance is switched off | Tick **Active** on the instance |
| **INSTANCE_MISSING** | The rule points at no instance | Set **FrontSpin Instance** on the rule |
| **AMBIGUOUS_MAPPING** | Two active rules disagree about this Record Type | Deactivate one |

## Reading them

Three of these are **not** faults in the ordinary sense:

- **NOT_CONFIGURED** is what a healthy single-tenant org reports all day. It means "multi-instance
  routing is not switched on", which is true and fine.
- **NO_MAPPING** during a rollout means work not done yet, not a mistake. The health check grades
  it as a warning for that reason.
- **MAPPING_INACTIVE** is often somebody deliberately pausing a customer.

The four that always want attention are **NO_RECORD_TYPE**, **INSTANCE_MISSING**,
**INSTANCE_INACTIVE** and **AMBIGUOUS_MAPPING**.

## Why refusing beats guessing

Six of the seven describe a configuration that does not say clearly where a record should go. The
integration refuses them all.

The alternative — sending to the most likely tenant — would mean a customer's contact details
turning up in a different customer's dialler, with nothing in either system saying it happened.
A refusal is visible, reversible and fixable. A wrong delivery is none of those.

## Where this fits

Outcomes are produced by [the routing rules](./instances.md) and only **enforced** in STRICT
mode — see [the three modes](./index.md).
