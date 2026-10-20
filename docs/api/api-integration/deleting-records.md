---
title: Deleting records
sidebar_position: 5
---

# Deleting records

Removing a record with `DELETE`.

:::caution Delete cannot be undone
This is the only operation with no way back. Administrators turn it on separately from
create and update, and it is off by default — see [Setting up a key](./admin-setup.md).
:::

## The request

```
DELETE <endpoint>/Contact/003Bi00000Qr0uRIAR
```

```
x-easycrm-client-id: <your Client ID>
x-easycrm-secret:    <your Secret>
```

**No body**, and no `content-type` header — there is nothing to send beyond the address.

## What comes back

```json
{
  "object": "Contact",
  "id": "003Bi00000Qr0uRIAR",
  "deleted": true
}
```

`200 OK`. There is no `externalId` here: the record is gone, so there is nothing left to
address.

## Addressing the record

As with update, either key works:

| By | Request |
|---|---|
| **Salesforce Id** | `DELETE <endpoint>/Contact/003Bi00000Qr0uRIAR` |
| **Portal External Id** | `DELETE <endpoint>/Contact?externalId=EXT-000096` |

## Deleting it twice

The second call returns `404`:

```json
{ "error": "No such record." }
```

That is also what you get for a record that never existed, and for one that exists but this
key's user is not allowed to see. All three answer the same way on purpose — otherwise the
API would confirm the existence of records the caller is not permitted to know about.

:::note A 404 on delete is usually good news
If you are retrying after a timeout, a `404` most often means the first attempt succeeded.
:::

## One record per call

There are no arrays, which means **a bulk delete cannot be expressed through this API at
all**. That is the point: the operation with no undo is also the one that cannot be
accidentally pointed at a whole table.

## What else is removed

Deleting through the API removes the same things as deleting in the portal — the record, and
the portal's own ownership and sharing rows for it. Nothing is left behind pointing at a
record that no longer exists.

Your org's own rules still apply. A delete blocked by a trigger, or by a child record that
restricts deletion, comes back as a `400` carrying that reason.

## Next

| | |
|---|---|
| [Errors and limits](./errors-and-limits.md) | every refusal, and the write ceiling |
| [API Usage tab](./api-usage-tab.md) | confirming what was actually called |
