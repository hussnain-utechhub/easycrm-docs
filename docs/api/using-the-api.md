---
title: Calling the API
sidebar_position: 3
---

# Calling the API

For whoever received a Client ID and a Secret.

## What you need

Three things, all from your administrator:

| Value | What it is |
|---|---|
| **Endpoint** | the address you send requests to |
| **Client ID** | identifies you — safe to share |
| **Secret** | like a password — keep it private |

:::note Ask for the endpoint, do not guess it
The address depends on how your portal's site was set up. Your administrator has a
**Copy endpoint** button next to your key that gives you the exact one.
:::

## 1. The address

Take the endpoint you were sent and add the object you want:

```text
<the endpoint they sent you>?object=Account
```

Your administrator decides which objects you may read. Ask them if you are not sure — a request
for one you were not given comes back refused.

## 2. The two headers

Every request carries both:

```text
x-easycrm-client-id: <your Client ID>
x-easycrm-secret:    <your Secret>
```

Header names are matched ignoring case, so `X-EasyCRM-Client-Id` works just as well. The same is
true of the query parameters: `sortfield` and `sortField` are both understood.

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

A **lookup** field arrives as three keys — the display value, the record it points at, and that
record's object:

```json
{
  "RecordTypeId": "Enterprise",
  "RecordTypeId_id": "012Bi0000016H8rIAE",
  "RecordTypeId_obj": "RecordType"
}
```

## Asking for fewer records

```text
&limit=25
```

The maximum is **200**. If you need more data, take more pages rather than asking for a bigger one
— see [Paging](./paging.md).

## Fetching one specific record

```text
&externalId=EXT-000001
```

Every record has its own **Portal External Id**, shown on the record in the portal. This returns
that one record instead of a page.

## If something goes wrong

The reply always contains an `error` field explaining what to change.

| Code | What it means |
|---|---|
| 400 | Something in the request is not right — the message says what. |
| 401 | Your Client ID or Secret is wrong, or the key has been switched off. |
| 403 | You asked for an object your administrator did not give you. |
| 429 | Too many requests this hour. Wait, then continue. |

:::note Why 401 is vague
"Not authorised" is returned whether the Client ID is unknown, the Secret is wrong, or the key was
revoked. That is deliberate — otherwise the endpoint could be used to work out which Client IDs
exist.
:::

## Lost the Secret?

It cannot be looked up — it is stored hashed. Ask your administrator to press **Regenerate**,
which gives you a new one. The old Secret stops working the moment they do.

## Full reference

Every parameter, every response field and copy-paste code samples in HTTP, Httpie, Python,
JavaScript, Node and PHP are in the [API Reference](./reference/read-records.md). Those pages are
generated from the API's own specification, so they always match the live behaviour.
