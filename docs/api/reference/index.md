---
title: EasyCRM Portal API
sidebar_position: 0
---

# EasyCRM Portal API

**Version 1.0**

A read-only REST API over the data a portal user can already see.

The API answers every request through the same code that renders the portal's own list
views, so object permissions, field-level access and record sharing are applied by the
portal's rules rather than a second copy of them. It follows that **the API can never
return anything the key's portal user could not open by logging in**, and that it can
only ever read: there is no create, update or delete.

## What you need

Three things, all from a portal administrator:

| | |
|---|---|
| **Endpoint** | the address below, specific to your org. The admin has a *Copy endpoint* button next to the key. |
| **Client ID** | identifies the key. Safe to share. |
| **Secret** | shown once, when the key is created. Treat it like a password. |

If the Secret is lost it cannot be looked up. An administrator presses *Regenerate*,
which issues a new one and immediately stops the old one working.

## What a key can reach

An administrator decides, per key:

- which **objects** it may read
- which **fields** of each come back
- a **filter** limiting which rows it sees at all
- the **order** rows arrive in
- whether the caller may add filters or choose their own sort

Anything not granted simply does not exist as far as the key is concerned, and a caller
cannot widen the grant: a filter they send is applied *on top of* the administrator's.

## Server

```
https://{host}/{sitePath}/services/apexrest/EasyCRM/api/v1
```

Your portal's Site. Use the endpoint your administrator sent you rather than assembling
this by hand.

| Variable | Default | What it is |
|---|---|---|
| `host` | `your-portal.my.salesforce-sites.com` | The Salesforce Site domain for your org. |
| `sitePath` | `portalcrm` | The Site's path prefix, set when the portal was created. |

## Authentication

Both headers are required on every request.

| Header | What it is |
|---|---|
| `x-easycrm-client-id` | The Client ID your administrator gave you. Identifies the key. |
| `x-easycrm-secret` | The Secret your administrator gave you. Treat it like a password. |

## Operations

| | |
|---|---|
| [**Read records**](./read-records.md) | `GET /query` — returns a page of records for one object. |

## The specification

The OpenAPI 3.0 description this reference is written from is available as
[`openapi.yaml`](pathname:///api/openapi.yaml), if you would rather generate a client
from it than read the pages.
