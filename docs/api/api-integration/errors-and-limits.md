---
title: Errors and limits
sidebar_position: 8
---

# Errors and limits

Every refusal the API can give, what each one means, and the hourly ceilings.

A refusal is always JSON with a single `error` field, in plain words:

```json
{ "error": "No such record." }
```

Never a stack trace, never a database message, never anything that reveals how the portal is
put together.

## The status codes

| Code | When |
|---|---|
| `200` | a successful read, update or delete |
| `201` | a successful **create** — the only verb that does not answer `200` |
| `400` | something in the request is wrong; the message says what |
| `401` | missing, unknown, wrong or revoked credentials, or the portal user is inactive |
| `403` | the object, or the operation, is not available to this key |
| `404` | no such record — or one you are not allowed to see |
| `429` | the hourly ceiling was reached |

## What a 400 actually means

It is the broadest one, so the message matters more than the code:

| Message | Fix |
|---|---|
| `No object requested.` | name the object, in the path or as `?object=` |
| `No object named in the address.` | a write with no object in the path — `POST /query/Contact`, not `POST /query` |
| `The request body could not be read as JSON.` | the body is empty or malformed; check `content-type: application/json` |
| `No fields to create.` / `No fields to update.` | the body is an empty object; send at least one field |
| `These fields are not writable by this key: X` | the administrator did not grant **write** on that field |
| `These fields are not editable by this user: X` | the key's portal user has no edit access to that field |
| `You can't create a record with that record type.` | the `RecordTypeId` you sent is not one the key's portal user may create |
| `You cannot sort by X - it is not one of the fields available to this key.` | sort by a field the key grants |
| `Records cannot be sorted by X. Address and long text fields are not sortable - choose another field.` | pick a sortable field |
| `sortDir must be asc or desc.` | one of those two words |
| a **field scope** refusal — see [Field Scoped objects](#field-scoped-objects) | the record must keep one of the user's own values in the scope field |
| `The request could not be completed.` | something unexpected; the reason is in the audit log, where your administrator can read it |
| anything else | your org's own validation rule, passed through word for word |

:::note Two different field refusals
They look similar and mean different things. **"not writable by this key"** is the key's own
writable-fields list, set by your administrator. **"not editable by this user"** is the
portal user's field-level access in Salesforce. The first is fixed on the API Integration
tab; the second is fixed in the user's portal permissions.
:::

## Field Scoped objects

An administrator can make an object **Field Scoped**: each portal user sees only the records
whose chosen field — the **scope field** — holds one of their own values. A key inherits its
user's scope, on every call:

- **Reads** return only records inside the scope. A user with no values on that object gets no
  records at all — `count: 0`, not an error. Asking for a record outside the scope by its Id or
  External Id also gives `count: 0`.
- A `PATCH` or `DELETE` naming a record **outside** the scope answers `404`, exactly like a
  record that does not exist.
- **Writes** must leave the record inside the scope. A write that would not is refused with a
  `400`, naming the scope field by its label:

| Message | What it means |
|---|---|
| `You have no <Field> values assigned, so you can't save records here.` | the key's user has no values on this object; an administrator has to give them some |
| `Choose a <Field>: you can only create records with one of your values.` | a create left the scope field blank, and the user has more than one value to choose from |
| `<Field> must be one of your values: a, b.` | the value sent is not one of the user's; the message lists the ones allowed |
| `This object is restricted by a field scope that is not set up correctly.` | the scope itself is misconfigured; tell your administrator |

On a **create**, a blank scope field is filled in for you when the user has exactly one value.
An **update** that does not send the scope field keeps the value already stored.

A key whose portal user is a Super Admin is never narrowed by a field scope. See
[Field Scoped sharing](../../admin/sharing/field-scoped.md) for how an administrator sets one up.

## Why some refusals are deliberately vague

**`401` never says which part was wrong.** An unknown Client ID, a wrong Secret and a revoked
key all give the same `Not authorised.` — otherwise the endpoint could be used to work out
which Client IDs exist. The real reason is written to the audit log instead, where your
administrator can see it.

**`403` is the same** whether the object was never granted or the portal user's permission to
it was removed afterwards. So a caller cannot map out what an administrator configured by
reading refusals.

**`404` is the same** for a record that never existed and one that exists but is not visible
to this key's user. Otherwise the API would confirm the existence of records the caller is
not allowed to know about.

:::tip That makes them harder to debug on purpose
If a `403` surprises you, check two things in order: that the object **and the operation**
are ticked on the key, then that the portal user still has that permission in the portal.
:::

## The hourly ceilings

Reads and writes are counted **separately**, per portal user, over a rolling hour:

| | Default | Counts |
|---|---|---|
| **Reads per hour** | 500 | every `GET` |
| **Writes per hour** | 100 | every `POST`, `PATCH` and `DELETE` |

Your administrator can raise or lower either.

:::note Why writes get a smaller ceiling
A runaway read loop is slow. A runaway write loop is damage. Capping writes lower means a
mistake can affect 100 records in an hour rather than 500.
:::

Going over returns:

```json
{ "error": "Too many requests. The limit is 100 writes per hour." }
```

with status `429` and a `Retry-After: 3600` header. Wait the hour out — the count is rolling,
so it frees up gradually rather than all at once.

## Every call is logged

Successful or refused, every request writes a row to the portal's audit log. That is not
optional, and it is what feeds the [API Usage tab](./api-usage-tab.md) — which is also how
your administrator can tell you *why* a `401` or `403` happened, since the response
deliberately will not.

## Permissions can change under you

The key's configuration is not a licence. Object permission, field access and record sharing
are re-checked on **every** call, so a field that stops being readable stops being returned
the moment that access is withdrawn — no change to the key is needed.
