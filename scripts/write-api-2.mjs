/* The API tab, part 2: filters and sorting, paging, the usage tab, and the API Reference. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

f["api/filters-and-sorting.md"] = `---
title: Filters and sorting
sidebar_position: 4
---

# Filters and sorting

Two things a caller can control — **if** the administrator allowed it. Both are off by default.

## The rule that governs both

> The administrator's settings always apply. A caller can only ever **narrow** the result, never
> widen it.

A caller's filter is combined with the administrator's, not swapped for it. A caller's sort
changes only the order rows arrive in, never which rows those are.

## Filters

Send a \`filters\` parameter holding a JSON array:

\`\`\`text
&filters=[{"field":"Type","operator":"eq","value":"Customer"}]
\`\`\`

More than one entry means all of them must match:

\`\`\`json
[
  { "field": "Type", "operator": "eq", "value": "Customer" },
  { "field": "Name", "operator": "contains", "value": "Acme" }
]
\`\`\`

### The operators

| Operator | Means |
|---|---|
| \`eq\` | equals |
| \`ne\` | not equal to |
| \`contains\` | contains |
| \`ncontains\` | does not contain |
| \`starts\` | starts with |
| \`lt\` | is before |
| \`le\` | is on or before |
| \`gt\` | is after |
| \`ge\` | is on or after |

### When it is not allowed

If the administrator did not tick **Allow the caller to add their own filters**, a \`filters\`
parameter is **ignored, not refused**. You get a normal \`200\` with the administrator's rows.

That is worth knowing, because it looks like your filter did nothing — which is exactly what
happened. Ask your administrator whether the box is ticked.

### A malformed filter is ignored too

If the JSON cannot be read, it is dropped and the administrator's filter still applies. It never
fails open: a broken caller filter cannot accidentally remove the filter protecting the data.

## Filter logic

This is the **administrator's** setting, not something a caller sends. In the admin screen, under
Filters, the **Filter logic** box takes an expression where the numbers are the filter rows in
order:

\`\`\`text
1 AND 2
1 OR 2
(1 OR 2) AND 3
\`\`\`

Blank means all filters must match.

A caller's filters are added after the administrator's and the logic is extended to include them,
so \`1 AND 2\` becomes \`(1 AND 2) AND 3\` once a caller adds one. Both still apply.

## Sorting

\`\`\`text
&sortField=Name&sortDir=desc
\`\`\`

\`sortDir\` is \`asc\` or \`desc\`. Anything else is refused with a \`400\`.

### Two limits worth knowing

**You can only sort by a field you were given.** Sorting by a field that is not in the key's
Selected list is refused:

\`\`\`json
{ "error": "You cannot sort by Industry - it is not one of the fields available to this key." }
\`\`\`

This is deliberate. Ordering by a field you cannot see would let you work out its values from the
sequence the records arrive in — a slower way of reading it, not a safer one.

**Address and long text fields cannot be sorted on at all.** Not by a caller, and not by an
administrator either — they are left out of the admin's Sort by picker for the same reason:

\`\`\`json
{ "error": "Records cannot be sorted by BillingAddress. Address and long text fields are not sortable - choose another field." }
\`\`\`

This is a Salesforce limitation rather than a portal one. Choose another field.

### When it is not allowed

Like filters, if **Allow the caller to choose their own sort** is not ticked, \`sortField\` and
\`sortDir\` are ignored and you get the administrator's saved order.

## Combining everything

Filters, sorting and paging all work together in one request:

\`\`\`text
?object=Account
&limit=25
&filters=[{"field":"Type","operator":"eq","value":"Customer"}]
&sortField=Name
&sortDir=desc
\`\`\`

And they are carried forward automatically as you page — see [Paging](./paging.md).
`;

f["api/paging.md"] = `---
title: Paging
sidebar_position: 5
---

# Paging

You do not get everything at once. The maximum is **200 records** per request, so anything larger
arrives a page at a time.

## Follow the links

Every response carries two complete addresses:

\`\`\`json
{
  "count": 200,
  "hasMore": true,
  "nextUrl": "https://.../api/v1/query?object=Account&limit=200&cursor=eyJ2...",
  "prevUrl": ""
}
\`\`\`

**Open \`nextUrl\` to go forward. Open \`prevUrl\` to go back.** That is the whole mechanism.

Both carry your original parameters — object, limit, filters, sort — already included, so you
never rebuild the request.

## How to actually do it

1. Find the \`nextUrl\` line in the response and copy the whole address between the quotation
   marks.
2. Paste it into the address bar, or into Postman's address box, replacing what is there.
3. Keep your two headers exactly as they are — they are still required.
4. Send.

Repeat until \`nextUrl\` comes back as an empty string. That means you have reached the end.

\`prevUrl\` works identically in the other direction. **On the first page it is always empty**,
which is how you know you are at the start.

## Do not build the cursor yourself

\`nextCursor\` and \`prevCursor\` are also returned, and you can pass either as a \`cursor\`
parameter. But they are deliberately opaque — an encoded marker whose contents are not part of the
contract and may change.

Following \`nextUrl\` and \`prevUrl\` is the supported way. Assembling the address by hand means
getting the encoding right yourself, and a damaged cursor quietly falls back to the first page, so
you would see the same records repeatedly with nothing explaining why.

## Why not just ask for everything?

Because a request has to finish inside Salesforce's limits, and because a page is a natural place
to stop if something goes wrong halfway through a large export.

If you are pulling a lot of data, take more pages. Asking for a larger page does not help:
anything above 200 is not honoured.

## A note on records changing mid-export

Paging walks the records in order from a fixed point, rather than counting "skip the first N".
That makes deep paging fast and consistent — but it also means a record created while you are
part-way through an export may or may not appear, depending on where it lands in the order.

For a nightly export that is normally fine. If it matters, filter on a date range that has already
closed.
`;

f["api/api-usage-tab.md"] = `---
title: API Usage tab
sidebar_position: 6
---

# API Usage tab

**Admin Console → API Usage.**

A separate screen from [setting up a key](./admin-setup.md). You do not need it to issue access —
it is where you look afterwards, to see whether a key is being used, how heavily, and whether
anything is being refused.

## Two halves

A switch at the top left changes the whole screen:

- **Portal API** — the API described in these pages
- **FrontSpin sync health** — the [FrontSpin integration](../frontspin/portal/sync-health.md), if
  the org has one

If FrontSpin is not installed the second half simply says so. Nothing is broken.

## Narrowing what you are looking at

Three controls across the top:

| Control | Options |
|---|---|
| **Period** | Last 24 hours / 7 days / 30 days / 90 days |
| **Company** | All companies, or one |
| **User** | All users, or one |

Plus **Refresh** and **Export**, which saves what you are currently looking at.

:::note Who sees what
A **Super Admin** sees every company. A **company Admin** sees only their own — the company filter
cannot be used to look at anyone else's traffic.
:::

## The six numbers

| Tile | Means |
|---|---|
| **Calls** | requests made in the period |
| **Successful** | how many worked |
| **Refused** | how many were turned away — bad credentials, an object not granted, or the rate limit |
| **Rows returned** | how much data actually went out |
| **Active keys** | keys switched on right now |
| **Busiest day** | the highest number of calls on any single day |

A healthy key looks like steady Calls with Refused at or near zero. A rising Refused count usually
means either a caller asking for something they were not granted, or one hitting the hourly limit.

## The rest of the screen

**Calls per day** is a simple bar chart of the period.

**By company** and **By user** show who is using it most.

**Every call** lists them individually — time, user, company, object, rows returned and the result
— with Previous and Next at the bottom.

## How far back it goes

**Successful calls are kept for 7 days. Refusals are kept for 12 months.**

Refusals are kept far longer on purpose: they are the rows worth having if somebody is guessing at
credentials, and they are a small fraction of the volume. Successes are the bulk and the rate
limit only ever looks back one hour, so a week is already generous.

So an empty "Last 90 days" view of successful calls is normal, not a fault.

:::warning The purge has to be switched on
The clean-up runs as a scheduled Apex job, \`PortalApiRetention\`, and **nothing schedules it
automatically**. Until an administrator schedules it from Setup, nothing is deleted and the audit
log grows without limit.

This matters more than it sounds: every API call writes one row, because the rate limit is counted
from those rows. A key working at the full 500 per hour produces roughly 12,000 rows a day.
:::

## Why every call is logged

There is no option to turn it off, and the admin screen shows that setting ticked and locked. The
rate limit is measured by counting the audit rows, so switching logging off would switch the rate
limit off with it.
`;

f["api/reference/index.md"] = `---
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
| Security scheme type | \`apiKey\` |
| Header parameter name | \`x-easycrm-client-id\` |

The Client ID your administrator gave you. Identifies the key.

| | |
|---|---|
| Security scheme type | \`apiKey\` |
| Header parameter name | \`x-easycrm-secret\` |

The Secret. Treat it like a password.

## Endpoints

| Method | Path | Does |
|---|---|---|
| \`GET\` | [\`/query\`](./read-records.md) | Returns a page of records for one object |
`;

f["api/reference/read-records.md"] = `---
title: Read records
sidebar_position: 1
---

# Read records

\`\`\`text
GET /query
\`\`\`

Returns a page of records for one object.

Only the fields the administrator selected for this key are returned, and only rows that pass both
their filter and the portal's own sharing rules.

### Reading the response

\`records\` holds the rows. Each row always carries \`Id\`, plus one key per selected field. A
**lookup** field arrives as three keys: the display value, the same name with \`_id\` for the
record it points at, and \`_obj\` for that record's object. So a selected \`RecordTypeId\` returns
\`RecordTypeId\`, \`RecordTypeId_id\` and \`RecordTypeId_obj\`.

### Moving between pages

You do not get everything at once. The response carries \`nextUrl\` and \`prevUrl\` — complete
addresses, with your own parameters already carried over. Open \`nextUrl\` to go forward and
\`prevUrl\` to go back; an empty value means there is nothing in that direction. On the first page
\`prevUrl\` is always empty.

Following those links is the intended way to page. Building the address yourself means handling
the cursor, which is deliberately opaque and may change form.

## Request

### Header parameters

| Name | | Description |
|---|---|---|
| \`x-easycrm-client-id\` | **required** | Your Client ID — identifies the key. |
| \`x-easycrm-secret\` | **required** | Your Secret — like a password, keep it private. |

### Query parameters

| Name | | Description |
|---|---|---|
| \`object\` | **required** | The object you want, for example \`Account\`. Your administrator decides which objects you may read. |
| \`limit\` | | How many records per page. The maximum is **200**. |
| \`filters\` | | A JSON array of \`field\`, \`operator\`, \`value\` entries. Applied on top of the administrator's filter, and ignored unless the administrator allowed it. See [Filters and sorting](../filters-and-sorting.md). |
| \`sortField\` | | A field to sort by. Must be one of the key's selected fields, and ignored unless the administrator allowed it. |
| \`sortDir\` | | \`asc\` or \`desc\`. Anything else is refused with a \`400\`. |
| \`cursor\` | | The \`nextCursor\` or \`prevCursor\` from a previous response. Following \`nextUrl\` and \`prevUrl\` is the supported way. See [Paging](../paging.md). |
| \`externalId\` | | A record's **Portal External Id**. Returns that one record instead of a page. |

### Samples

\`\`\`http
GET <the endpoint they sent you>?object=Account
x-easycrm-client-id: <your Client ID>
x-easycrm-secret: <your Secret>
Accept: application/json
\`\`\`

\`\`\`bash
http GET '<the endpoint they sent you>?object=Account' \\
  x-easycrm-client-id:'<your Client ID>' \\
  x-easycrm-secret:'<your Secret>'
\`\`\`

\`\`\`python
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
\`\`\`

\`\`\`javascript
const response = await fetch("<the endpoint they sent you>?object=Account", {
  method: "GET",
  headers: {
    "x-easycrm-client-id": "<your Client ID>",
    "x-easycrm-secret": "<your Secret>",
  },
});
const data = await response.json();
console.log(data);
\`\`\`

\`\`\`javascript title="Node"
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
\`\`\`

\`\`\`php
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
\`\`\`

## Responses

### 200 — a page of records

| Field | Type | Means |
|---|---|---|
| \`object\` | string | The object you asked for. |
| \`records\` | array | The rows. Each carries \`Id\`, plus one key per selected field. |
| \`count\` | integer | How many records are in **this page**, not how many exist in total. |
| \`hasMore\` | boolean | Whether there is another page after this one. |
| \`nextUrl\` | string | Open to go forward. Empty at the end. |
| \`prevUrl\` | string | Open to go back. Always empty on the first page. |
| \`nextCursor\` | string | Opaque marker for the next page. |
| \`prevCursor\` | string | Opaque marker for the previous page. |

\`\`\`json
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
\`\`\`

### 400 — something in the request is not right

The message says what.

\`\`\`json
{ "error": "You cannot sort by Industry - it is not one of the fields available to this key." }
\`\`\`

### 401 — not authorised

Your Client ID or Secret is wrong, or the key has been switched off.

### 403 — object not granted

You asked for an object your administrator did not give you.

### 429 — rate limited

Too many requests this hour. Wait, then continue.

| Response header | Means |
|---|---|
| \`Retry-After\` | Seconds to wait before trying again. |
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Wrote ${n} pages.`);
