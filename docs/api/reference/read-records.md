---
title: Read records
sidebar_position: 1
---

# Read records

```
GET /query
```

Returns a page of records for one object.

Only the fields the administrator selected for this key are returned, and only rows
that pass both their filter and the portal's own sharing rules.

### Reading the response

`records` holds the rows. Each row always carries `Id`, plus one key per selected
field. A **lookup** field arrives as three keys: the display value, the same name
with `_id` for the record it points at, and `_obj` for that record's object. So a
selected `RecordTypeId` returns `RecordTypeId`, `RecordTypeId_id` and
`RecordTypeId_obj`.

### Moving between pages

You do not get everything at once. The response carries `nextUrl` and `prevUrl` —
complete addresses, with your own parameters already carried over. Open `nextUrl`
to go forward and `prevUrl` to go back; an empty value means there is nothing in
that direction. On the first page `prevUrl` is always empty.

Following those links is the intended way to page. Building the address yourself
means handling the cursor, which is deliberately opaque and may change form.

## Parameters

### `object` — **required**, string

API name of the object to read, for example `Account` or `Contact`. Must be one
the administrator granted to this key, otherwise the request is refused.

### `limit` — integer, default `200`

How many records to return. Maximum **200**. If you need more data, follow
`nextUrl` for further pages rather than asking for a larger one.

### `cursor` — string

Marks the place to continue from. Opaque — send back exactly what you were
given and do not try to read or construct one. You will normally never set this
by hand, because `nextUrl` and `prevUrl` already contain it.

### `externalId` — string

Fetch the single record whose **Portal External Id** matches this value, instead
of a page of records. Every record carries its own, shown on the record in the
portal.

Refused with `400` on an object where the field has not been set up.

### `filters` — string

Extra filters, as a JSON array. **Only honoured when the administrator ticked
"Allow the caller to add their own filters"** — otherwise it is ignored, not
refused.

These narrow the result. They are combined with the administrator's own filter,
which always applies, so this can never return rows they excluded.

Each entry is `{"field": ..., "operator": ..., "value": ...}`. Operators:
`eq`, `ne`, `contains`, `ncontains`, `starts`, `lt`, `le`, `gt`, `ge` —
meaning equals, not equal to, contains, does not contain, starts with,
is before, is on or before, is after, is on or after.

```json
[{"field":"Type","operator":"eq","value":"Customer"}]
```

### `sortField` — string

Field to order by. **Only honoured when the administrator ticked "Allow the
caller to choose their own sort"** — otherwise the saved order is used.

Must be one of the fields granted to this key. Address and long text fields
cannot be sorted on at all and are refused with `400`.

### `sortDir` — string, default `asc`

Direction for `sortField`. One of `asc` or `desc`.

## Responses

### `200` — A page of records

| Field | Type | What it is |
|---|---|---|
| `object` | string | The object these records came from. |
| `records` | array | The rows. Each always carries `Id`, plus one key per field the administrator selected. A lookup field also returns `<field>_id` and `<field>_obj`. |
| `count` | integer | How many records are in **this page**. Not the total available. |
| `hasMore` | boolean | Whether a further page exists after this one. |
| `nextCursor` | string | Opaque marker for the next page. Empty on the last page. Prefer `nextUrl`. |
| `nextUrl` | string | The complete address of the next page, with your own parameters carried over. Empty when there are no more pages. |
| `prevCursor` | string | Opaque marker for the previous page. Empty on the first page. Prefer `prevUrl`. |
| `prevUrl` | string | The complete address of the previous page. Empty on the first page, which is how you know you have reached the start. |

```json
{
  "object": "Account",
  "records": [
    {
      "Id": "001Bi00000UMyF1IAL",
      "Name": "Acme Corporation",
      "Type": "Customer",
      "RecordTypeId": "Enterprise",
      "RecordTypeId_id": "012Bi0000016H8rIAE",
      "RecordTypeId_obj": "RecordType"
    },
    {
      "Id": "001Bi00000UN3jLIAT",
      "Name": "Globex",
      "Type": "Prospect",
      "RecordTypeId": "Small Business",
      "RecordTypeId_id": "012Bi0000016H8sIAE",
      "RecordTypeId_obj": "RecordType"
    }
  ],
  "count": 2,
  "hasMore": true,
  "nextCursor": "eyJ2IjoiR2xvYmV4IiwiaWQiOiIwMDFCaTAwMDAwVU4zakxJQVQifQ",
  "nextUrl": "https://your-portal.my.salesforce-sites.com/portalcrm/services/apexrest/EasyCRM/api/v1/query?object=Account&limit=2&cursor=eyJ2IjoiR2xvYmV4IiwiaWQiOiIwMDFCaTAwMDAwVU4zakxJQVQifQ",
  "prevCursor": "",
  "prevUrl": ""
}
```

### `400` — The request could not be completed

The `error` field says what to change — for example an object that was not named, an
External Id field that is not set up on that object, or a sort field that is not granted
or cannot be sorted on.

```json
{
  "error": "Records cannot be sorted by BillingAddress. Address and long text fields are not sortable - choose another field."
}
```

```json
{
  "error": "You cannot sort by Industry - it is not one of the fields available to this key."
}
```

```json
{
  "error": "sortDir must be asc or desc."
}
```

```json
{
  "error": "No object requested."
}
```

### `401` — Not authorised

The Client ID is unknown, the Secret does not match, or the key has been revoked — the
response is deliberately the same for all three, so the endpoint cannot be used to work
out which.

```json
{
  "error": "Not authorised."
}
```

### `403` — The object is not available to this key

Either the administrator never granted it, or the key's portal user has since lost
permission to read it. Both give the same answer on purpose.

```json
{
  "error": "That object is not available to this key."
}
```

### `429` — Too many requests this hour

The ceiling is set per key and defaults to 500. Wait, then continue — a `Retry-After`
header is returned alongside, giving the seconds to wait before trying again.

```json
{
  "error": "Too many requests. The limit is 500 per hour."
}
```
