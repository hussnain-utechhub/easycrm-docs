/*
 * The API documentation, as a tab on this site.
 *
 * The text is the existing API documentation, unchanged in substance. What is fixed here is
 * what the export mangled: hash-router links (#/admin-setup) become relative page links, the
 * definition tables that lost their header row get one back, run-together headings ("1Open the
 * tab", "x-easycrm-client-idrequired") are separated, call-out boxes become admonitions, and
 * code fences get a language so they highlight. The site's own Edit/Previous/Next furniture
 * replaces the exported copies of those.
 */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};
const cat = {
  "api": { label: "API", position: 3, collapsed: true },
  "api/reference": { label: "API Reference", position: 8, collapsed: true },
};

f["api/index.md"] = `---
title: EasyCRM API
sidebar_position: 0
slug: /api
---

# EasyCRM API

## What EasyCRM is

EasyCRM is a customer portal for Salesforce. People sign in to a branded site and work with the
records shared with them — accounts, contacts, activities, files, reports and dashboards —
without needing a Salesforce licence of their own.

What each person can see is decided by the portal's own permission model: object permissions,
field access, record sharing, and company scoping on top. Somebody sees what an administrator has
given them, and nothing else.

## What the API is for

The API lets another system read that same data directly, instead of a person opening the portal
and reading it off the screen. It is the right tool when you want to pull portal data into a
warehouse, a reporting tool, a spreadsheet on a schedule, or an application of your own.

Two things are worth knowing before you start:

- **It is read-only.** The API returns records. It cannot create, change or delete anything.
- **It sees exactly what its user sees.** A key belongs to one portal user and inherits their
  permissions, so it can never read data that person could not already open in the portal. An
  administrator narrows it further by choosing which objects and fields the key may return.

## What you need before you can call it

Three values, and all three come from **your administrator** — there is no self-service sign-up:

| Value | What it is |
|---|---|
| **Client ID** | identifies the key |
| **Secret** | shown to your administrator once, when the key is created |
| **Endpoint URL** | the address you send requests to, which is specific to your portal |

If you have not been given all three, ask your administrator before going further. The
[Setting up a key](./admin-setup.md) page is written for them and lists exactly what they need to
do.

## Start here

- [Calling the API](./using-the-api.md) — your first request, start to finish
- [Filters and sorting](./filters-and-sorting.md) — narrowing what comes back
- [Paging](./paging.md) — reading more than one page of results
- [API reference](./reference/index.md) — every parameter and response, with copyable samples

Administrators have two pages of their own: [Setting up a key](./admin-setup.md) and the
[API Usage tab](./api-usage-tab.md), which reports what each key has been doing.
`;

f["api/overview.md"] = `---
title: API Integration
sidebar_position: 1
---

# API Integration

The API lets another program read data out of the portal automatically, instead of a person
opening it and looking.

It is **read-only**. There is no create, update or delete, and no way to add one — the endpoint
only answers \`GET\`.

## How it stays safe

Every request is answered by the same code that builds the portal's own list views. So a key gets
exactly what its portal user would get by signing in: the same object permissions, the same field
access, the same record sharing.

That has a useful consequence. **You cannot grant more through the API than the person already
had.** If someone's portal access is reduced, their key quietly narrows with it.

On top of that, an administrator decides per key:

- which **objects** it may read
- which **fields** of each come back
- a **filter** limiting which rows it sees at all
- the **order** rows arrive in
- whether the caller may add their own filters or choose their own sort
- how many **calls per hour** it may make

Anything not granted does not exist as far as that key is concerned.

## The three things a caller needs

| Value | What it is |
|---|---|
| **Endpoint** | the web address to send requests to |
| **Client ID** | identifies the key — safe to share |
| **Secret** | like a password — shown once, keep it private |

All three come from an administrator. The endpoint in particular should be copied from the admin
screen rather than assembled by hand; there is a **Copy endpoint** button next to it.

## Where to go next

| Page | For |
|---|---|
| [Setting up a key](./admin-setup.md) | administrators issuing access |
| [Calling the API](./using-the-api.md) | whoever received the Client ID and Secret |
| [Filters and sorting](./filters-and-sorting.md) | narrowing results and choosing their order |
| [Paging](./paging.md) | getting more than one page of results |
| [API Usage tab](./api-usage-tab.md) | seeing what has actually been called |

Full parameter-by-parameter detail, with copy-paste code samples in several languages, is in the
[API Reference](./reference/index.md) section. Those pages are generated from the API's
specification, so they cannot drift from the real thing.
`;

f["api/admin-setup.md"] = `---
title: Setting up a key
sidebar_position: 2
---

# Setting up a key

For administrators. This is how somebody gets API access, and how you control what they can reach
with it.

## Before you start

The **API Integration** tab lives in the Admin Console.

A **Super Admin** always sees it. A **company Admin** sees it only once a Super Admin has switched
it on for their company:

> Admin → **Companies** → open the company → **Admin Tabs** → tick
> **Allow company admins to manage API access**

Until that is ticked, a company Admin opening the tab is told that API access is not delegated to
their company. That switch is Super Admin only — an Admin cannot grant it to themselves.

Once delegated, an Admin may issue keys to **their own company's Standard users only** — never to
another Admin, never to another company, never to a Super Admin.

## The five steps

### 1. Open the tab

**Admin Console → API Integration.** The list shows everyone who already has a key, with their
company, the objects they may read, whether the key is active, and when it was last used.

Press **Set up API access** to add one, or **Edit** on a row to change an existing one.

### 2. Choose the user and the rate limit

Pick the person the key belongs to — you can search by name or company. The key acts as that
user, which is what keeps it inside their existing permissions.

**Calls per hour** caps how many requests the key may make in any hour. 500 is the normal
setting. It exists to protect the portal: the API shares the site's request budget with it, so one
runaway export could otherwise slow the portal down for everyone.

### 3. Add the objects

Press **Add object** and choose one, for example \`Account\`. Repeat for each.

An object you do not add here does not exist as far as this key is concerned — a request for it is
refused.

### 4. Choose the fields

For each object you get two lists side by side. Move what you want from **Available** across to
**Selected — returned by the API**. There is a search box above each list.

Only Selected fields are ever returned. This is also the list that limits what the caller may sort
by.

### 5. Save

The **Credentials** section appears, with three values:

| Value | What it is |
|---|---|
| **Client ID** | safe to share, identifies the key |
| **Secret** | **shown once** — copy it now |
| **Endpoint the user calls** | with a **Copy endpoint** button |

Send the person **all three**. Without the endpoint they have nowhere to send a request.

:::warning The Secret is shown once
It is stored hashed, so it genuinely cannot be looked up later. If it is lost, press
**Regenerate** — the old Secret stops working immediately and a new one is shown.
:::

## Limiting which rows come back

Under **Filters — which rows come back**, press **+ Add filter**. Each filter is three boxes:
**Field**, **Operator**, **Value**.

These always apply. A caller can never see a row your filter excluded.

The **Filter logic** box is optional. Leave it blank to require all filters, or write
\`1 AND 2\`, \`1 OR 2\`, \`(1 OR 2) AND 3\` — the numbers are the filter rows in order.

See [Filters and sorting](./filters-and-sorting.md) for the operators and how a caller's own
filters combine with yours.

## Choosing the order

**Sort by** is two drop-downs just under the filters: the field on the left, the direction on the
right. There are no labels on screen, so it is left then right. Leave the field as \`(none)\` for
the default order.

Only fields the platform can actually order by are offered — Address and long text fields are left
out because they cannot be sorted on at all.

## Caller permissions

Two tick boxes, both off by default:

**Allow the caller to add their own filters.** Off, they always get exactly your filter. On, they
may narrow it further — never widen it, because your filter is always applied on top.

**Allow the caller to choose their own sort.** Off, they always get your order. On, they may send
their own field and direction. This changes only the order, never which rows come back, and they
may only sort by a field you selected.

Below those is **Write every call to the audit log**, shown ticked and locked. It is not a choice:
the rate limit is counted from those rows, so switching them off would switch the rate limit off
with them.

## Afterwards

Each row in the list has three actions:

| Action | What it does |
|---|---|
| **Edit** | change objects, fields, filters, sort or calls per hour at any time |
| **Regenerate** | issue a new Secret — the old one stops working straight away |
| **Revoke** | switch the key off until you switch it back on |

To see whether a key is actually being used, and what it has been doing, use the
[API Usage tab](./api-usage-tab.md).
`;

f["api/using-the-api.md"] = `---
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

\`\`\`text
<the endpoint they sent you>?object=Account
\`\`\`

Your administrator decides which objects you may read. Ask them if you are not sure — a request
for one you were not given comes back refused.

## 2. The two headers

Every request carries both:

\`\`\`text
x-easycrm-client-id: <your Client ID>
x-easycrm-secret:    <your Secret>
\`\`\`

Header names are matched ignoring case, so \`X-EasyCRM-Client-Id\` works just as well. The same is
true of the query parameters: \`sortfield\` and \`sortField\` are both understood.

## 3. What comes back

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

\`count\` is how many records are in **this page**, not how many exist in total.

### Reading a record

Every record carries \`Id\`, plus one key for each field your administrator selected.

A **lookup** field arrives as three keys — the display value, the record it points at, and that
record's object:

\`\`\`json
{
  "RecordTypeId": "Enterprise",
  "RecordTypeId_id": "012Bi0000016H8rIAE",
  "RecordTypeId_obj": "RecordType"
}
\`\`\`

## Asking for fewer records

\`\`\`text
&limit=25
\`\`\`

The maximum is **200**. If you need more data, take more pages rather than asking for a bigger one
— see [Paging](./paging.md).

## Fetching one specific record

\`\`\`text
&externalId=EXT-000001
\`\`\`

Every record has its own **Portal External Id**, shown on the record in the portal. This returns
that one record instead of a page.

## If something goes wrong

The reply always contains an \`error\` field explaining what to change.

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
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
for (const [rel, body] of Object.entries(cat)) {
  const dest = path.join(DOCS, rel, "_category_.json");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, JSON.stringify(body, null, 2) + "\n", "utf8");
}
console.log(`Wrote ${n} pages and ${Object.keys(cat).length} categories.`);
