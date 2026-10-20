---
title: Create, update and delete
sidebar_position: 2
---

# Create, update and delete

`POST`, `PATCH` and `DELETE` on the same resource the read uses. **One record per call** — there
are no arrays and no bulk operations.

Every object starts read-only. An administrator grants each operation separately, per object, so a
key can read `Account` and still write `Contact`.

## Addressing a record

Two forms, both accepted on every verb:

| Form | Example |
|---|---|
| Path | `POST /query/Contact`, `PATCH /query/Contact/003Bi00000Qr0uRIAR` |
| Query parameter | `PATCH /query/Contact?externalId=EXT-000096` |

A path segment that is not a Salesforce Id is read as the portal **External Id**, so
`/query/Contact/EXT-000096` works too.

## `POST /query/{object}` — create

Body is a flat JSON object of field API names and values.

```json
{ "FirstName": "Postman", "LastName": "WalkthroughTest", "Email": "pm@example.com" }
```

### `201` — Created

| Field | Type | What it is |
|---|---|---|
| `object` | string | The object the record belongs to. |
| `id` | string | The Salesforce Id of the new record. |
| `created` | boolean | Always `true`. A failure is an error status, never `false`. |
| `externalId` | string | The record's portal External Id, re-read after the insert so you can address it straight away. |

```json
{ "object": "Contact", "id": "003Bi00000Qr0uRIAR", "created": true, "externalId": "EXT-000096" }
```

:::note `201`, not `200`
Create is the only operation that does not answer `200`. Code that checks for an exact status
needs to allow `201`, or every successful create looks like a failure.
:::

## `PATCH /query/{object}/{recordId}` — update

Changes **only the fields in the body**. Everything you leave out is untouched.

```json
{ "Title": "QA Lead", "Phone": "5551234567" }
```

### `200` — Updated

Same shape as a create, with `updated` in place of `created`.

```json
{ "object": "Contact", "id": "003Bi00000Qr0uRIAR", "updated": true, "externalId": "EXT-000096" }
```

:::note There is no `PUT`, and no upsert
`PUT` would mean "replace the whole record", so anything not sent would be wiped. And an upsert is
impossible here: the External Id is a Salesforce AutoNumber that no caller can supply, so the match
half would fail every time and quietly create a duplicate on each retry.
:::

## `DELETE /query/{object}/{recordId}` — delete

No body, and no `content-type` header.

### `200` — Deleted

| Field | Type | What it is |
|---|---|---|
| `object` | string | The object the record belonged to. |
| `id` | string | The Salesforce Id of the record removed. |
| `deleted` | boolean | Always `true`. |

```json
{ "object": "Contact", "id": "003Bi00000Qr0uRIAR", "deleted": true }
```

There is no `externalId` — the record is gone, so there is nothing left to address. Deleting the
same record twice returns `404`, which after a timeout and a retry usually means the first attempt
succeeded.

## Which fields a write may set

Two separate gates, and **both refuse by naming the fields** rather than ignoring them:

| Gate | Set by | Message |
|---|---|---|
| Writable fields | the administrator, per key | `These fields are not writable by this key: <names>` |
| Field access | the portal user's own permissions | `These fields are not editable by this user: <names>` |

Both are a `400`, and the request does not partly succeed. A silently dropped field is how an
integration appears to work for a month while never setting the value somebody was watching.

Lookup fields take the related record's **Id**, not its name.

## Errors

| Code | When |
|---|---|
| `400` | unreadable JSON, no object named, a field the key may not write, a field this user may not edit, or a validation rule in your org refusing the save — its own message is passed through |
| `401` | missing, unknown, wrong or revoked credentials, or an inactive portal user |
| `403` | the object, or the operation on it, is not available to this key |
| `404` | no such record — or one this key's user may not see |
| `429` | the hourly write ceiling was reached; `Retry-After: 3600` |

Writes have their **own hourly ceiling**, counted separately from reads — 100 writes an hour by
default, against 500 reads.

Validation rules, required fields, duplicate rules and triggers all run exactly as they do when
somebody uses the portal screen, because the same code saves the record.

## See also

| | |
|---|---|
| [Creating records](../api-integration/creating-records.md) | the same ground, written as a walkthrough |
| [Updating records](../api-integration/updating-records.md) | including why there is no upsert |
| [Deleting records](../api-integration/deleting-records.md) | |
| [Errors and limits](../api-integration/errors-and-limits.md) | every refusal, and both ceilings |
