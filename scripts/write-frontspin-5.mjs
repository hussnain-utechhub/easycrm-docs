/*
 * Rewrite the three portal pages against real screenshots of an org that HAS FrontSpin.
 *
 * The first draft described these screens from the source code and from captures of a scratch
 * org where the integration is absent, so every one of them rendered "FrontSpin is not set up in
 * this org". Photographing the live sandbox corrected several things the code did not make
 * obvious, the important one being what a BLANK FrontSpin tenant does - it falls back to the
 * company name with spaces replaced by underscores, rather than leaving the company unusable.
 */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

f["frontspin/portal/list-mappings.md"] = `---
title: List Mappings
sidebar_position: 1
---

# List Mappings

## What it is

The portal end of [Report to List](../lists/report-to-list.md): which Salesforce report fills
which FrontSpin calling list, for a given company.

## Before it does anything

**It only drives the sync when the switch is set to the Custom Setting.** With the switch off —
which is the default — this tab edits a store the scheduled job does not read.

Check [Setup, or the portal](../lists/where-mappings-live.md) before using it. A mapping added
here while the switch is off looks perfectly correct and does nothing.

## Opening it

**Where:** **Admin** → **List Mappings** → choose a company

1. Click **Admin** in the top menu.
2. Click **List Mappings** in the row of tabs.
3. Nothing is shown yet — mappings belong to a company, so one has to be chosen first.

![List Mappings before a company is chosen](../../img/shots/frontspin/list-mappings-choose.png)

4. Click **Choose a company** and pick one.

![Choosing a company](../../img/shots/frontspin/list-mappings-company-picker.png)

## What you get

![Mappings for a company](../../img/shots/frontspin/list-mappings-chosen.png)

The blue line names the **tenant** you are editing and confirms that FrontSpin's scheduled job
picks up every active mapping on its next run — within the hour.

| Column | Shows |
|---|---|
| **Name** | What the mapping is called |
| **Report** | The Salesforce report that fills the list |
| **FrontSpin List** | The list, with its FrontSpin number in brackets |
| **Tenant** | Which FrontSpin account |
| **Active** | An **On** / **Off** switch |

The count sits under the table.

### "not in the portal's report list"

A row can show a raw report id with **not in the portal's report list** under it.

That means the mapping points at a report the portal cannot see — usually one that lives only in
Salesforce. The mapping still runs; the portal just cannot show you its name. It is a note, not an
error.

## Adding a mapping

1. Choose the company.
2. Click **+ New Mapping**.

![The New Mapping dialog](../../img/shots/frontspin/list-mappings-new.png)

3. Fill it in:

| Field | Notes |
|---|---|
| **Report** | **Tabular reports only.** See below. |
| **FrontSpin List** | Only lists belonging to this company's tenant are offered |
| **Name** | Leave blank and one is generated. Up to 38 characters. |
| **Tenant** | Not editable — set by the company you are working in |
| **Members** | Contacts. Not editable. |
| **Active** | Include this mapping in the next scheduled run |

4. Click **Save Mapping**.

### Tabular reports only

**FrontSpin cannot read Summary or Matrix reports.** Only a tabular report can fill a list, so a
grouped report will not be offered.

If the report you want is grouped, make a tabular copy of it for this purpose.

### A portal-only report works

The report does **not** have to be published to Salesforce. A report that exists only in the
portal can fill a FrontSpin list perfectly well.

That is worth knowing because it removes a step people often assume is required.

### Contacts only

**Members** is fixed at Contacts, because FrontSpin refuses Leads. There is nothing to choose.

## The list picker

![Choosing a FrontSpin list](../../img/shots/frontspin/list-mappings-list-picker.png)

Each entry shows the list name and its FrontSpin number. **Only this company's tenant's lists are
offered**, so you cannot accidentally point one customer's report at another customer's calling
list.

## Refresh lists

The picker can only offer lists Salesforce already knows about. **Refresh lists** asks FrontSpin
for the current set.

**It can add lists that are new. It cannot update ones already recorded.**

The portal runs as the site's guest user, and a Guest User Licence forbids editing records — no
permission set can change that. So refreshing a list already in Salesforce fails with a duplicate
error on the list's key, which is expected rather than a fault.

Keeping existing entries current is the hourly
[List Catalog job](../lists/index.md)'s work. It runs as a real user and has no such limit.

In practice: use **Refresh lists** when a brand-new list has just been created in FrontSpin and
you do not want to wait an hour. For everything else, the hourly job handles it.

## Turning one off

Use the **Active** switch on the row. Off means the scheduled job skips it; the mapping is kept.

Prefer this to deleting. Nothing can remove people a mapping has already added to a list, so
switching it off is the only way to stop it growing.

## What goes wrong

| Symptom | Cause |
|---|---|
| "FrontSpin is not set up in this org" | The integration is not installed. See [the boundary](../index.md#an-important-boundary). |
| A new mapping does nothing | The [switch](../lists/where-mappings-live.md) is off, so Setup is the live source. |
| Your report is not in the picker | It is a Summary or Matrix report. Only tabular reports can be used. |
| A list is missing from the picker | The catalogue has not caught up. Click **Refresh lists**, or wait for the hourly job. |
| "duplicate value found" on refresh | The guest cannot update an existing list. Expected — see above. |
| A row shows a raw id | The report lives outside the portal. Harmless. |
| Contacts added but the list looks short | FrontSpin applies additions asynchronously. Give it a few minutes. |

## Where this fits

What a mapping actually does is [Report to List](../lists/report-to-list.md). Where mappings are
stored is [Setup, or the portal](../lists/where-mappings-live.md).
`;

f["frontspin/portal/sync-health.md"] = `---
title: Sync health
sidebar_position: 2
---

# Sync health

## What it is

A view inside the portal's **API Usage** tab showing how the FrontSpin integration is faring —
without needing a Salesforce login.

## Opening it

**Where:** **Admin** → **API Usage** → **FrontSpin sync health**

1. Click **Admin** in the top menu.
2. Click **API Usage**.
3. The page opens on **Portal API**. Click **FrontSpin sync health** beside it.

![FrontSpin sync health](../../img/shots/frontspin/sync-health.png)

## Read the banner first

> FrontSpin records **failures and outcomes**, never successful calls — the portal does not make
> these calls, FrontSpin's own job does. So this is sync health, not a call count.

That single sentence prevents the most common misreading of this screen. **A low number here is
good.** It is not a measure of how much work the integration did; it is a measure of how much of
it went wrong.

## The six figures

| Tile | Means |
|---|---|
| **Failures** | How many syncs failed in the period |
| **Still open** | Of those, how many are unresolved |
| **Resolved** | How many later succeeded |
| **Reached FrontSpin** | Failures that genuinely became an HTTP request |
| **Synced OK** | Records that went through |
| **Last sync** | When the integration last did anything |

### Reached FrontSpin is the useful one

It splits failures into two very different kinds:

- **Reached FrontSpin** — the request left your org and FrontSpin answered badly. The problem is
  at their end, or in what was sent.
- **The rest** — the request never left the org at all. That is configuration, routing or
  permissions, and it is yours to fix.

Checking that split first tells you which half of the system to look at, and saves most of the
time people spend guessing.

### "Last sync: Never"

Exactly what it sounds like. If the integration is meant to be live, this is the first thing to
act on — check the scheduled jobs exist and their owner is still active.

## The breakdowns

| Section | Answers |
|---|---|
| **Why it failed** | Which [failure classes](../troubleshooting/retries.md) came up |
| **Which operation** | Create, update, resync or inbound |
| **Failures by tenant** | Whether it is one customer or all of them |
| **Synced OK by tenant** | Which tenants are working |
| **What FrontSpin actually said** | The real responses, newest first |

**Failures by tenant** is the fastest triage on the page. One tenant failing is a configuration or
credential problem for that customer. Every tenant failing at once is something shared — a
scheduled job, or the integration as a whole.

**What FrontSpin actually said** is worth reading rather than skimming. It is their words, not a
summary, and it often names the problem outright.

## The Lists table

Underneath is every FrontSpin list the catalogue knows about:

| Column | Shows |
|---|---|
| **List** | The catalogue record |
| **Name** | The list's name in FrontSpin |
| **Company** | The portal company, where one matches |
| **Tenant** | Which FrontSpin account |
| **State** | Active or Inactive in FrontSpin |
| **Last synced** | When the catalogue last saw it |

**Last synced** is the one to watch. A list whose date has stopped moving while others update has
disappeared from FrontSpin — the catalogue
[never deletes](../lists/index.md#nothing-is-ever-deleted), so a stale date is the only signal.

## Narrowing it

The same controls as the Portal API view: a date range, a company and a user. **Refresh** fetches
the latest figures and **Export** downloads them.

Use the date range to compare a bad day with a normal one — the shape of the difference usually
names the cause faster than any single number.

## Two separate things on one tab

| View | Is about |
|---|---|
| **Portal API** | Other systems reading **your** portal through its API |
| **FrontSpin sync health** | **Your** org talking to FrontSpin |

A quiet Portal API says nothing about FrontSpin, and the reverse.

## What it does not show

It is a summary, not a record-by-record account. For "why did **this** contact not sync?" you
need [sync errors](../troubleshooting/sync-errors.md), which are per record and in Salesforce.

## Where this fits

The portal's own API is covered in [API Usage](../../admin/data/api-usage.md). The detail behind
these figures is in [Troubleshooting](../troubleshooting/index.md).
`;

f["frontspin/portal/company-tenant.md"] = `---
title: A company's tenant
sidebar_position: 3
---

# A company's tenant

## What it is

A field on a portal company recording **which FrontSpin account that company uses**.

## Why it is needed

The portal groups people and records by company. FrontSpin groups them by tenant. This field joins
the two, so [List Mappings](./list-mappings.md) knows which tenant it is editing when you pick a
company.

## Setting it

**Where:** **Admin** → **Companies** → the pencil on a company → **Branding**

1. Click **Admin** in the top menu.
2. Click **Companies**.
3. Click the **pencil** on the company's row.
4. On the **Branding** tab, fill in **FrontSpin tenant**.
5. Click **Save**.

![The FrontSpin tenant field](../../img/shots/frontspin/company-tenant.png)

## Leaving it blank does not switch it off

This is the part worth reading twice.

**Blank does not mean "no tenant".** It means the **company name** is used instead, with spaces
turned into underscores. A company called \`Acme Sales\` already matches a configuration called
\`Acme_Sales\` without anybody filling anything in.

So a blank field is a working default, not a gap — as long as the two names line up.

## When you must fill it in

| Situation | Why |
|---|---|
| The names differ | The fallback matches on the company name, and it will not find the configuration |
| The company name has punctuation | The fallback only handles letters, numbers and spaces |

**And it is worth setting even when the fallback works**, for one reason: renaming the company
would otherwise silently change which tenant it points at. An explicit value survives a rename;
the fallback does not.

That is a quiet failure — somebody tidies up a company name, and a customer's mappings stop
resolving with nothing to show why.

## What to put in it

The configuration's name — the same value as the **FrontSpin Configuration Setting Name** on
[the configuration row](../setup/configuration.md), and the **Instance Name** on
[the webhook configuration](../setup/webhooks.md).

Get it from whoever set the tenant up, or read it off the configuration row in Setup. Guessing
produces a value that looks right and matches nothing.

## One company, one tenant

The field holds a single tenant. A company working two FrontSpin accounts needs two portal
companies — which is usually the right model anyway, since their users, records and sharing are
almost always meant to be separate too.

## What goes wrong

| Symptom | Cause |
|---|---|
| List Mappings shows no mappings | The resolved tenant does not match any configuration. Check spelling. |
| Mappings disappeared after a rename | The field was blank, so the company name was the tenant. Set it explicitly. |
| Mappings appear under the wrong customer | The tenant value names another customer's configuration. |
| The field is not on the form | It is part of the FrontSpin integration. Not installed, not present. |

## Where this fits

Companies in general are covered in [Companies](../../admin/companies/index.md). What the tenant
value means is [Tenants and Record Types](../understand/tenants-and-record-types.md).
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Rewrote ${n} pages.`);
