---
title: Overview
sidebar_position: 0
---

# API Integration

The API lets another program read data out of the portal automatically, instead of a person
opening it and looking.

It is **read-only**. There is no create, update or delete, and no way to add one — the
endpoint only answers `GET`.

## How it stays safe

Every request is answered by the same code that builds the portal's own list views. So a
key gets exactly what its portal user would get by signing in: the same object permissions,
the same field access, the same record sharing.

That has a useful consequence. **You cannot grant more through the API than the person
already had.** If someone's portal access is reduced, their key quietly narrows with it.

On top of that, an administrator decides per key:

- which **objects** it may read
- which **fields** of each come back
- a **filter** limiting which rows it sees at all
- the **order** rows arrive in
- whether the caller may add their own filters or choose their own sort
- how many **calls per hour** it may make

Anything not granted does not exist as far as that key is concerned.

## The three things a caller needs

| | |
|---|---|
| **Endpoint** | the web address to send requests to |
| **Client ID** | identifies the key — safe to share |
| **Secret** | like a password — shown once, keep it private |

All three come from an administrator. The endpoint in particular should be copied from the
admin screen rather than assembled by hand; there is a **Copy endpoint** button next to it.

## Where to go next

| Page | For |
|---|---|
| [Setting up a key](./admin-setup.md) | administrators issuing access |
| [Calling the API](./using-the-api.md) | whoever received the Client ID and Secret |
| [Filters and sorting](./filters-and-sorting.md) | narrowing results and choosing their order |
| [Paging](./paging.md) | getting more than one page of results |
| [API Usage tab](./api-usage-tab.md) | seeing what has actually been called |

Full parameter-by-parameter detail, with copy-paste code samples in several languages,
is in the **API Reference** section of the sidebar. Those pages are generated from the
API's specification, so they cannot drift from the real thing.
