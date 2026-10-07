---
title: Tenants and Record Types
sidebar_position: 2
---

# Tenants and Record Types

## The chain, in one line

**Record → its Record Type → a configuration row → a FrontSpin tenant.**

Every outbound sync walks that chain. If any link is missing, the record is not sent and the
reason is written down.

## Why the Record Type

A Record Type is a Salesforce label on a record saying what kind of thing it is. This integration
borrows it to mean **which of your customers this record belongs to**, and therefore which
FrontSpin account it should reach.

It was chosen over the alternatives for good reasons:

| Alternative | Why not |
|---|---|
| The running user | Two people editing one record would send it to two different diallers |
| The record owner | Ownership changes for reasons that have nothing to do with which dialler |
| A company field | A text field can be typed wrong, and one company can own several FrontSpin accounts |
| The record's Id | Not portable between sandbox and production |

Record Types are looked up by **developer name**, not by their 18-character Id, so the same
configuration works in a sandbox and in production without editing.

## What a tenant is

A tenant is one FrontSpin account, identified by a **Tenant ID** — a short number like
`100142`. Each tenant has its own calling lists, its own users and its own daily request
allowance.

One Salesforce org commonly talks to several. A configuration row names the tenant and the
credential used to reach it.

## Why getting this wrong is serious

FrontSpin decides which tenant you are talking to from the **API key**, not from anything in the
request. So an id created in tenant A, sent using tenant B's key, does not bounce — it lands on a
real but **completely unrelated** record in tenant B, and overwrites it.

The integration guards against this by recording which tenant issued each stored id and refusing
to send it anywhere else. That guard is why a record can report a refusal rather than silently
updating a stranger's data.

## What a configuration row holds

One row per customer, in Setup. It names:

- the **Record Types** it covers (one row can cover several)
- the **Tenant ID**
- the **Named Credential** that carries the API key
- the company name used in FrontSpin

Creating one is [Step 2 of setting up](../setup/configuration.md).

## What goes wrong

| Symptom | Cause |
|---|---|
| Nothing syncs for one customer | No configuration row names their Record Type. |
| Nothing syncs for anybody | No configuration rows exist at all — the integration is not switched on. |
| A record is refused with "no Record Type" | The record genuinely has none. Set one. |
| Two tenants claim one Record Type | Two active rows disagree. See [the eight outcomes](../routing/outcomes.md). |

## Where this fits

Creating the Record Type is [Step 1](../setup/record-types.md). Pointing it at a tenant is
[Step 2](../setup/configuration.md). Running more than one FrontSpin account at once is
[Routing](../routing/index.md).
