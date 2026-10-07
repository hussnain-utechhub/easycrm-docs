/*
 * Align the API pages with the published source.
 *
 * content/index.md was fetched from UmerGhouri/easycrm-api-docs, which is public, so the landing
 * page is now the real source text rather than a reconstruction. Only two things are changed,
 * and both have to change for the page to work as a tab here rather than as its own site root:
 * the slug, and the link paths (that site is flat under /api-integration/, this one is flat
 * under /api/).
 *
 * The rest of the guide pages live in UmerGhouri/EasyCRM under docs/api-integration/, which is
 * private and returns 404 to this account, so those are still derived from the published export.
 * What is corrected here is the one convention the export destroyed everywhere: the source uses
 * HEADERLESS tables ("| | |"), and the exporter promoted each table's first data row to be its
 * header. Restoring that makes these pages render the way the original does.
 */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");

/* ---- the landing page, verbatim from content/index.md ---- */
fs.writeFileSync(
  path.join(DOCS, "api/index.md"),
  `---
title: EasyCRM API
slug: /api
sidebar_position: 0
---

# EasyCRM API

## What EasyCRM is

EasyCRM is a customer portal for Salesforce. People sign in to a branded site and work with
the records shared with them — accounts, contacts, activities, files, reports and dashboards —
without needing a Salesforce licence of their own.

What each person can see is decided by the portal's own permission model: object permissions,
field access, record sharing, and company scoping on top. Somebody sees what an administrator
has given them, and nothing else.

## What the API is for

The API lets another system read that same data directly, instead of a person opening the
portal and reading it off the screen. It is the right tool when you want to pull portal data
into a warehouse, a reporting tool, a spreadsheet on a schedule, or an application of your own.

Two things are worth knowing before you start:

- **It is read-only.** The API returns records. It cannot create, change or delete anything.
- **It sees exactly what its user sees.** A key belongs to one portal user and inherits their
  permissions, so it can never read data that person could not already open in the portal. An
  administrator narrows it further by choosing which objects and fields the key may return.

## What you need before you can call it

Three values, and all three come from **your administrator** — there is no self-service sign-up:

| | |
|---|---|
| **Client ID** | identifies the key |
| **Secret** | shown to your administrator once, when the key is created |
| **Endpoint URL** | the address you send requests to, which is specific to your portal |

If you have not been given all three, ask your administrator before going further. The
[Setting up a key](./admin-setup.md) page is written for them and lists exactly
what they need to do.

## Start here

- **[Using the API](./using-the-api.md)** — your first request, start to finish
- **[Filters and sorting](./filters-and-sorting.md)** — narrowing what comes back
- **[Paging](./paging.md)** — reading more than one page of results
- **[API reference](./reference/index.md)** — every parameter and response, with copyable samples

Administrators have two pages of their own: [Setting up a key](./admin-setup.md)
and the [API Usage tab](./api-usage-tab.md), which reports what each key has
been doing.
`,
  "utf8"
);

/*
 * Restore the headerless tables the export promoted a data row into.
 * Each entry: the file, and the header line that has to be replaced by an empty one.
 */
const HEADERLESS = [
  ["api/overview.md", "| Value | What it is |"],
  ["api/admin-setup.md", "| Value | What it is |"],
  ["api/using-the-api.md", "| Value | What it is |"],
  ["api/reference/index.md", "| Value | What it is |"],
];

let fixed = 0;
for (const [rel, headerLine] of HEADERLESS) {
  const p = path.join(DOCS, rel);
  let s = fs.readFileSync(p, "utf8");
  if (s.includes(headerLine)) {
    s = s.split(headerLine).join("| | |");
    fs.writeFileSync(p, s, "utf8");
    fixed++;
  }
}

console.log(`Landing page replaced with the published source. Headerless tables restored in ${fixed} files.`);
