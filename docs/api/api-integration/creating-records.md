---
title: Creating records
sidebar_position: 3
---

# Creating records

Adding a new record with `POST`.

:::tip Create has to be granted first
Every object starts read-only. Your administrator ticks **Create** for that object before
this works — see [Setting up a key](./admin-setup.md). Until then you get a `403`.
:::

## The request

```
POST <endpoint>/Contact
```

Three headers, and a JSON body:

```
x-easycrm-client-id: <your Client ID>
x-easycrm-secret:    <your Secret>
content-type:        application/json
```

```json
{
  "FirstName": "Postman",
  "LastName": "WalkthroughTest",
  "Email": "pm@example.com",
  "Title": "QA"
}
```

The object goes in the path. `POST <endpoint>?object=Contact` works too — the two styles
are interchangeable, as described in [Calling the API](./using-the-api.md).

## What comes back

```json
{
  "object": "Contact",
  "id": "003Bi00000Qr0uRIAR",
  "created": true,
  "externalId": "EXT-000096"
}
```

| | |
|---|---|
| **Status** | `201 Created` |
| `id` | the Salesforce Id of the new record |
| `externalId` | its **Portal External Id**, read back after the save |
| `created` | always `true` — a failure is an error status, never `false` |

:::note 201, not 200
Create is the only verb that does not answer `200`. If you are checking for an exact status
code, allow `201` here or every successful create looks like a failure.
:::

The `externalId` is handed back because Salesforce assigns it **during** the insert — it is
not on the record you sent. Without it you would have to go and look the record up before
you could address it by the key this API offers for addressing.

## Which fields you may set

Two separate permissions decide this, and they refuse differently.

| What | Set by | Refusal |
|---|---|---|
| **Writable fields** | your administrator, per key | `These fields are not writable by this key: <names>` |
| **Field access** | the portal user's own permissions | `These fields are not editable by this user: <names>` |

Both are a `400`, and both **name the fields**.

:::caution Nothing is silently dropped
A field you are not allowed to set does not get quietly ignored — the whole request is
refused and the field is named. That is deliberate: a silently dropped field is how an
integration appears to work for a month while never setting the value somebody was watching.
:::

Send a field that does not exist on the object and you get a `400` too.

## One record per call

There are no arrays. `POST` takes one record and answers for that one record.

That is a deliberate limit, not an oversight: it means "if row 3 of 50 fails, do we keep the
other 49?" never has to be answered, and your integration never has to handle a half-applied
batch.

## Validation rules still apply

The record is saved by the same code as the portal's own New Record screen, so your
org's required fields, validation rules, duplicate rules and triggers all run exactly as they
do for a person. When one refuses, you get a `400` carrying **its own message**:

```json
{ "error": "Phone number must be 10 digits." }
```

That is the customer's own wording, passed straight through, because it is the part that
says what to change.

## Where the new record lands

It is owned by the portal user the key belongs to, and it is visible to that user straight
away — so you can read it back through the API immediately.

## Next

| | |
|---|---|
| [Updating records](./updating-records.md) | changing it afterwards |
| [Deleting records](./deleting-records.md) | removing it |
| [Errors and limits](./errors-and-limits.md) | every refusal, and the write ceiling |
