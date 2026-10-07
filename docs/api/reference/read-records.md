---
title: Read records
sidebar_position: 1
---

# Read records

```text
GET /query
```

Returns a page of records for one object.

Only the fields the administrator selected for this key are returned, and only rows that pass both
their filter and the portal's own sharing rules.

### Reading the response

`records` holds the rows. Each row always carries `Id`, plus one key per selected field. A
**lookup** field arrives as three keys: the display value, the same name with `_id` for the
record it points at, and `_obj` for that record's object. So a selected `RecordTypeId` returns
`RecordTypeId`, `RecordTypeId_id` and `RecordTypeId_obj`.

### Moving between pages

You do not get everything at once. The response carries `nextUrl` and `prevUrl` — complete
addresses, with your own parameters already carried over. Open `nextUrl` to go forward and
`prevUrl` to go back; an empty value means there is nothing in that direction. On the first page
`prevUrl` is always empty.

Following those links is the intended way to page. Building the address yourself means handling
the cursor, which is deliberately opaque and may change form.

## Request

### Header parameters

| Name | | Description |
|---|---|---|
| `x-easycrm-client-id` | **required** | Your Client ID — identifies the key. |
| `x-easycrm-secret` | **required** | Your Secret — like a password, keep it private. |

### Query parameters

| Name | | Description |
|---|---|---|
| `object` | **required** | The object you want, for example `Account`. Your administrator decides which objects you may read. |
| `limit` | | How many records per page. The maximum is **200**. |
| `filters` | | A JSON array of `field`, `operator`, `value` entries. Applied on top of the administrator's filter, and ignored unless the administrator allowed it. See [Filters and sorting](../filters-and-sorting.md). |
| `sortField` | | A field to sort by. Must be one of the key's selected fields, and ignored unless the administrator allowed it. |
| `sortDir` | | `asc` or `desc`. Anything else is refused with a `400`. |
| `cursor` | | The `nextCursor` or `prevCursor` from a previous response. Following `nextUrl` and `prevUrl` is the supported way. See [Paging](../paging.md). |
| `externalId` | | A record's **Portal External Id**. Returns that one record instead of a page. |

### Samples

```http
GET <the endpoint they sent you>?object=Account
x-easycrm-client-id: <your Client ID>
x-easycrm-secret: <your Secret>
Accept: application/json
```

```bash
http GET '<the endpoint they sent you>?object=Account' \
  x-easycrm-client-id:'<your Client ID>' \
  x-easycrm-secret:'<your Secret>'
```

```python
import requests

response = requests.get(
    "<the endpoint they sent you>",
    params={"object": "Account"},
    headers={
        "x-easycrm-client-id": "<your Client ID>",
        "x-easycrm-secret": "<your Secret>",
    },
)
print(response.json())
```

```javascript
const response = await fetch("<the endpoint they sent you>?object=Account", {
  method: "GET",
  headers: {
    "x-easycrm-client-id": "<your Client ID>",
    "x-easycrm-secret": "<your Secret>",
  },
});
const data = await response.json();
console.log(data);
```

```javascript title="Node"
const https = require("https");

const url = new URL("<the endpoint they sent you>");
url.searchParams.set("object", "Account");

https.get(url, {
  headers: {
    "x-easycrm-client-id": "<your Client ID>",
    "x-easycrm-secret": "<your Secret>",
  },
}, (res) => {
  let body = "";
  res.on("data", (chunk) => (body += chunk));
  res.on("end", () => console.log(JSON.parse(body)));
});
```

```php
<?php
$ch = curl_init("<the endpoint they sent you>?object=Account");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "x-easycrm-client-id: <your Client ID>",
    "x-easycrm-secret: <your Secret>",
]);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
```

## Responses

### 200 — a page of records

| Field | Type | Means |
|---|---|---|
| `object` | string | The object you asked for. |
| `records` | array | The rows. Each carries `Id`, plus one key per selected field. |
| `count` | integer | How many records are in **this page**, not how many exist in total. |
| `hasMore` | boolean | Whether there is another page after this one. |
| `nextUrl` | string | Open to go forward. Empty at the end. |
| `prevUrl` | string | Open to go back. Always empty on the first page. |
| `nextCursor` | string | Opaque marker for the next page. |
| `prevCursor` | string | Opaque marker for the previous page. |

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

### 400 — something in the request is not right

The message says what.

```json
{ "error": "You cannot sort by Industry - it is not one of the fields available to this key." }
```

### 401 — not authorised

Your Client ID or Secret is wrong, or the key has been switched off.

### 403 — object not granted

You asked for an object your administrator did not give you.

### 429 — rate limited

Too many requests this hour. Wait, then continue.

| Response header | Means |
|---|---|
| `Retry-After` | Seconds to wait before trying again. |
