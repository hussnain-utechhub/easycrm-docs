---
title: Calling the API
sidebar_position: 2
---

# Calling the API

For whoever received a Client ID and a Secret.

## What you need

Three things, all from your administrator:

| | |
|---|---|
| **Endpoint** | the address you send requests to |
| **Client ID** | identifies you — safe to share |
| **Secret** | like a password — keep it private |

:::tip Ask for the endpoint, do not guess it
The address depends on how your portal's site was set up. Your administrator has a
**Copy endpoint** button next to your key that gives you the exact one.
:::

## 1. The address

Take the endpoint you were sent and add the object you want:

```
<the endpoint they sent you>?object=Account
```

Your administrator decides which objects you may reach. Ask them if you are not sure — a
request for one you were not given comes back refused.

### Two ways to write the address

Both work on every verb, so use whichever suits your tool:

| Style | Example |
|---|---|
| **Query parameter** | `<endpoint>?object=Account` |
| **Path** | `<endpoint>/Account/001Bi00000UMyF1IAL` |

The path form is read first and the parameter form is the fallback. A path segment that is
not a Salesforce Id is treated as the portal **External Id**, so `<endpoint>/Account/EXT-000001`
addresses a record too.

## 2. The two headers

Every request carries both:

```
x-easycrm-client-id: <your Client ID>
x-easycrm-secret:    <your Secret>
```

Header names are matched ignoring case, so `X-EasyCRM-Client-Id` works just as well. The
same is true of the query parameters: `sortfield` and `sortField` are both understood.

## 3. What comes back

```json
{
  "object": "Account",
  "records": [
    { "Id": "001Bi00000UMyF1IAL", "Name": "Acme Corporation", "Type": "Customer" }
  ],
  "count": 1,
  "hasMore": true,
  "nextCursor": "eyJ2IjoiQWNtZSIsImlkIjoiMDAxQmkuLi4ifQ",
  "nextUrl": "https://.../api/v1/query?object=Account&cursor=eyJ2...",
  "prevCursor": "",
  "prevUrl": ""
}
```

`count` is how many records are in **this page**, not how many exist in total.

### Reading a record

Every record carries `Id`, plus one key for each field your administrator selected.

A **lookup** field arrives as three keys — the display value, the record it points at, and
that record's object:

```json
{
  "RecordTypeId": "Enterprise",
  "RecordTypeId_id": "012Bi0000016H8rIAE",
  "RecordTypeId_obj": "RecordType"
}
```

## Asking for fewer records

```
&limit=25
```

| | |
|---|---|
| **Default** | 200 records per page |
| **Maximum** | 2000 |

Ask for more than 2000 and you get 2000 — the request is not refused. Ask for less than 1
and you get the default. For large exports, take more pages rather than one huge one; see
[Paging](./paging.md).

## Fetching one specific record

```
&externalId=EXT-000001
```

Every record has its own **Portal External Id**, shown on the record in the portal. This
returns that one record instead of a page.

You can also address it by its Salesforce Id in the path:

```
<endpoint>/Account/001Bi00000UMyF1IAL
```

Either way the answer keeps the same shape — a `records` array with one row in it, and
`count: 1`. The envelope never changes, so code that reads a page reads a single record too.

## Changing records

This page covers reading. The same endpoint and the same two headers also create, update
and delete, when the administrator has granted those operations:

| | |
|---|---|
| [Creating records](./creating-records.md) | `POST` a new record |
| [Updating records](./updating-records.md) | `PATCH` the fields you want changed |
| [Deleting records](./deleting-records.md) | `DELETE` a record |

## If something goes wrong

The reply always contains an `error` field explaining what to change.

| Code | What it means |
|---|---|
| **400** | Something in the request is not right — the message says what. |
| **401** | Your Client ID or Secret is wrong, or the key has been switched off. |
| **403** | You asked for an object, or an operation, your administrator did not give you. |
| **404** | No such record — or one you are not allowed to see. |
| **429** | Too many requests this hour. Wait, then continue. |

Every code, every message and both hourly ceilings are listed in
[Errors and limits](./errors-and-limits.md).

:::note Why 401 is vague
"Not authorised" is returned whether the Client ID is unknown, the Secret is wrong, or the
key was revoked. That is deliberate — otherwise the endpoint could be used to work out
which Client IDs exist.
:::

## Lost the Secret?

It cannot be looked up — it is stored hashed. Ask your administrator to press
**Regenerate**, which gives you a new one. The old Secret stops working the moment they do.

## Full reference

Every parameter, every response field and copy-paste code samples in HTTP, Httpie, Python,
JavaScript, Node and PHP are in the **API Reference** section of the sidebar. Those pages
are generated from the API's own specification, so they always match the live behaviour.
