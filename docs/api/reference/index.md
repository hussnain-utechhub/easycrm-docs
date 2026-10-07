---
title: Introduction
sidebar_position: 0
---

# EasyCRM Portal API

**Version 1.0**

A read-only REST API over the data a portal user can already see.

The API answers every request through the same code that renders the portal's own list views, so
object permissions, field-level access and record sharing are applied by the portal's rules rather
than a second copy of them. It follows that **the API can never return anything the key's portal
user could not open by logging in**, and that it can only ever read: there is no create, update or
delete.

## What you need

Three things, all from a portal administrator:

| Value | What it is |
|---|---|
| **Endpoint** | the address, specific to your org. The admin has a *Copy endpoint* button next to the key. |
| **Client ID** | identifies the key. Safe to share. |
| **Secret** | shown once, when the key is created. Treat it like a password. |

If the Secret is lost it cannot be looked up. An administrator presses *Regenerate*, which issues
a new one and immediately stops the old one working.

## What a key can reach

An administrator decides, per key:

- which **objects** it may read
- which **fields** of each come back
- a **filter** limiting which rows it sees at all
- the **order** rows arrive in
- whether the caller may add filters or choose their own sort

Anything not granted simply does not exist as far as the key is concerned, and a caller cannot
widen the grant: a filter they send is applied *on top of* the administrator's.

## Authentication

Two API-key headers, both required on every request.

| | |
|---|---|
| Security scheme type | `apiKey` |
| Header parameter name | `x-easycrm-client-id` |

The Client ID your administrator gave you. Identifies the key.

| | |
|---|---|
| Security scheme type | `apiKey` |
| Header parameter name | `x-easycrm-secret` |

The Secret. Treat it like a password.

## Endpoints

| Method | Path | Does |
|---|---|---|
| `GET` | [`/query`](./read-records.md) | Returns a page of records for one object |
