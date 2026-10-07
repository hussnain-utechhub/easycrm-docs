/* FrontSpin tab, part 4: the portal, manual tools, troubleshooting and reference.
   Also corrects docs/admin/data/list-mappings.md, which described the tab as a CSV column
   mapper. It is the FrontSpin report-to-list mapper, as its own on-screen text says. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};
const cat = {
  "frontspin/portal": { label: "In the portal", position: 6, collapsed: true },
  "frontspin/manual": { label: "Doing it by hand", position: 7, collapsed: true },
  "frontspin/troubleshooting": { label: "Troubleshooting", position: 8, collapsed: true },
  "frontspin/reference": { label: "Reference", position: 9, collapsed: true },
};

/* ------------------------------------------------------------------- portal */
f["frontspin/portal/index.md"] = `---
title: Where FrontSpin appears
sidebar_position: 0
---

# FrontSpin in the portal

Most of the integration lives in Salesforce Setup. Three things are in the EasyCRM portal, where
a Super Admin can reach them without a Salesforce login.

| Place | For |
|---|---|
| [List Mappings](./list-mappings.md) | Pointing a report at a FrontSpin calling list |
| [Sync health](./sync-health.md) | Seeing whether the integration is keeping up |
| [A company's tenant](./company-tenant.md) | Recording which FrontSpin account a company uses |

## If FrontSpin is not installed

The portal is built to cope with its absence. Opening a FrontSpin page in an org without the
integration shows:

> FrontSpin is not set up in this org, so there is nothing to manage here. The list mapping tables
> need to be present before this tab can be used.

That is the expected message, not an error. Nothing is broken and nothing needs fixing — the
integration simply is not installed here. See
[the boundary](../index.md#an-important-boundary).

## Who can see these

Portal **Super Admins**. An ordinary Admin sees them only if a Super Admin has allowed those
console tabs for their company, the same as every other Admin Console tab.

## What the portal cannot do

Everything structural is in Salesforce Setup and stays there:

| Not in the portal |
|---|
| [Configuration rows](../setup/configuration.md) |
| [Field mappings](../setup/fields-going-out.md), in or out |
| [Webhooks](../setup/webhooks.md) |
| [Routing rules and the mode](../routing/index.md) |

That split is deliberate. The portal manages day-to-day work; the things that decide where
customer data goes need a Salesforce administrator.
`;

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
3. Choose a **Company**. Mappings belong to one, so nothing shows until you do.

![List Mappings](../../img/shots/admin/list-mappings.png)

Once chosen, the page names the tenant it is working with and lists that company's mappings.

![Mappings for a company](../../img/shots/admin/list-mappings-chosen.png)

The blue line confirms which tenant you are editing, and that FrontSpin's scheduled job will pick
up every active mapping on its next run — within the hour.

## Adding a mapping

1. Choose the company.
2. Click **New**.
3. Fill in:

| Field | What to put |
|---|---|
| **Report** | The Salesforce report whose contacts should be added |
| **FrontSpin List** | The calling list they go into |
| **Member Type** | \`Contacts\` |
| **Active** | Tick it |

4. Click **Save**.

It takes effect on the job's next hourly run. There is nothing to restart.

## The company must have a tenant first

The page needs to know which FrontSpin account a company belongs to. If the company has no tenant
recorded, say so first — see [A company's tenant](./company-tenant.md).

## Refresh lists

The **FrontSpin List** picker can only offer lists Salesforce knows about. **Refresh lists** asks
FrontSpin for the current set.

**It can add lists that are new. It cannot update ones already recorded.**

The portal runs as the site's guest user, and a Guest User Licence forbids editing records — no
permission set can change that. So refreshing a list already in Salesforce fails with a duplicate
error on the list's key, which is expected rather than a fault.

Keeping existing entries current is the hourly
[List Catalog job](../lists/index.md)'s job. It runs as a real user and has no such limit.

In practice: use **Refresh lists** when a brand-new list has just been created in FrontSpin and
you do not want to wait an hour. For everything else, the hourly job handles it.

## What goes wrong

| Symptom | Cause |
|---|---|
| "FrontSpin is not set up in this org" | The integration is not installed. See [the boundary](../index.md#an-important-boundary). |
| A new mapping does nothing | The [switch](../lists/where-mappings-live.md) is off, so Setup is the live source. |
| A list is missing from the picker | The catalogue has not caught up. Click **Refresh lists**, or wait for the hourly job. |
| "duplicate value found" on refresh | The guest cannot update an existing list. Expected — see above. |
| Contacts are added but the list looks short | FrontSpin applies additions asynchronously. Give it a few minutes. |

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

![API Usage](../../img/shots/admin/api-usage.png)

## Two separate things on one tab

They share a page but have nothing to do with each other:

| View | Is about |
|---|---|
| **Portal API** | Other systems reading **your** portal through its API |
| **FrontSpin sync health** | **Your** org talking to FrontSpin |

A quiet Portal API says nothing about FrontSpin, and the reverse.

## What to look for

| Sign | Usually means |
|---|---|
| A steady trickle of activity | Normal |
| Nothing at all, on a working day | The sync has stopped. Check the scheduled jobs. |
| A sharp spike | A bulk load, or a mapping sending more than you expected |
| Failures climbing | Start at [sync errors](../troubleshooting/sync-errors.md) |

## Filters

The same controls as the Portal API view: a date range, and narrowing by company. Use the date
range to compare a bad day with a normal one — the shape of the difference usually names the
cause faster than any single number.

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

**Where:** **Admin** → **Companies** → the company → **FrontSpin Tenant**

1. Click **Admin** in the top menu.
2. Click **Companies**.
3. Open the company.
4. Put the tenant's name in **FrontSpin Tenant**.
5. Save.

![Companies](../../img/shots/admin/companies.png)

## What to put in it

The tenant's short name — the same value used as the **Instance Name** on
[the webhook configuration](../setup/webhooks.md), and matching the
[configuration row](../setup/configuration.md) for that customer.

Get it from whoever set the tenant up, or read it off the configuration row in Setup. Guessing
produces a value that looks right and matches nothing.

## One company, one tenant

The field holds a single tenant. A company working two FrontSpin accounts needs two portal
companies — which is usually the right model anyway, since their users, records and sharing are
almost always meant to be separate too.

## Leaving it blank

Blank is fine for any company that does not use FrontSpin. The only consequence is that
[List Mappings](./list-mappings.md) has nothing to work with for that company.

## What goes wrong

| Symptom | Cause |
|---|---|
| List Mappings will not let you add anything | The company has no tenant recorded. |
| Mappings appear under the wrong customer | The tenant name is wrong. Check it against the configuration row. |
| The field is not on the form | It is part of the FrontSpin integration. Not installed, not present. |

## Where this fits

Companies in general are covered in [Companies](../../admin/companies/index.md). What the tenant
value means is [Tenants and Record Types](../understand/tenants-and-record-types.md).
`;

/* ------------------------------------------------------------------- manual */
f["frontspin/manual/index.md"] = `---
title: Sending records by hand
sidebar_position: 0
---

# Doing it by hand

Most syncing happens by itself. Two tools send records on demand — after an outage, after fixing
a configuration, or when loading a customer for the first time.

| Tool | Sends | Reached from |
|---|---|---|
| **Resync to FrontSpin** | The records you select | A list view in Salesforce |
| **Record Type Sync** | Everything of one Record Type | A Salesforce page |

Both take the **same path** a normal save does. Neither is a special back door, and neither can
produce a result an automatic sync would not.

## Resync to FrontSpin

**Where:** any Account or Contact list view in Salesforce

1. Open a list view.
2. Tick the records you want.
3. Choose **Resync to FrontSpin** from the actions.

## Record Type Sync

**Where:** the FrontSpin Record Type Sync page in Salesforce

1. Choose the object — **Account** or **Contact**.
2. Choose the Record Type.
3. Start it.

It works through up to **2,000 records per request**. That is a page size, not a ceiling: the
rest is not lost, and the next run resumes exactly where the last stopped.

The limit is there because every record costs a FrontSpin request against a daily allowance that
can be as low as 500. An unbounded button could spend a large part of a day's allowance in one
click.

## What a resync actually does, per record

It is decided per record, not per request:

| The record has | The resync does |
|---|---|
| A stored FrontSpin id | An **update** of that FrontSpin record |
| No stored id | A **create** |

So **a record already in FrontSpin cannot be duplicated by resyncing it**. That is worth knowing,
because the natural fear about a manual resync is exactly that.

## Why it works when nothing has changed

A normal save only sends a record when a mapped field actually changed. A resync deliberately
bypasses that check — you are asking for a retry of a record nothing has changed on, which is the
whole point.

What it does **not** bypass is routing or ownership. A record that cannot be routed is still
refused, for the same reason and with the same message.

## When to use which

| Situation | Use |
|---|---|
| One record that failed | **Resync**, from the list view |
| A handful after fixing a field mapping | **Resync** |
| A whole customer, first time | **Record Type Sync** |
| Everything after a long outage | **Record Type Sync**, one Record Type at a time |

## Mind the daily allowance

A FrontSpin tenant's daily request allowance can be as low as 500. Syncing a Record Type with
5,000 contacts will exhaust it.

That is not a disaster — records stopped by a quota are **preserved and re-driven automatically**
after the allowance resets. See [Retries](../troubleshooting/retries.md). But it means everything
else for that tenant waits behind them, so a large first load is best done when nothing urgent
depends on the same tenant.

## Who can use them

Both respect sharing: you can only sync records you can see. Somebody with narrow access syncs
only their own records, without being told the others existed.

## What goes wrong

| Symptom | Cause |
|---|---|
| The action is not in the list view | The integration is not installed, or the action is not on that list view. |
| It reports success, nothing arrives | Check [sync errors](../troubleshooting/sync-errors.md) — refusals are recorded, not thrown. |
| Only some records went | Sharing, or a quota stop. Both are recorded. |
| It stops at 2,000 | Expected. Run it again; it resumes after the last one. |
`;

/* ---------------------------------------------------------- troubleshooting */
f["frontspin/troubleshooting/index.md"] = `---
title: Where to look
sidebar_position: 0
---

# Troubleshooting

## The two places evidence lives

| Place | Answers | Look here when |
|---|---|---|
| **FrontSpin Sync Errors** | "What went wrong with **this** record?" | Almost always start here |
| **API Logs** | "What exactly was sent and received?" | The sync error is not enough |

Sync errors are per record, with proper links to the Account or Contact, so a failure is visible
from the record page. API logs hold the full request-and-response narrative but cannot be filtered
usefully — their detail fields are long text, which Salesforce refuses to filter on.

So: **sync errors first, API logs only when you need the wire detail.**

## A quick diagnostic order

1. **Is anything syncing at all?** Check [sync health](../portal/sync-health.md). If everything
   stopped at once, suspect the scheduled jobs or an expired credential — not configuration.
2. **Is this one record failing?** Open
   [its sync errors](./sync-errors.md) and read the failure class.
3. **Is it a whole customer?** Check their
   [configuration row](../setup/configuration.md) — most often a Record Type developer name that
   no longer matches.
4. **Did it ever work?** If it never has, it is configuration. If it stopped, something changed —
   a credential, a Record Type name, a deactivated user.

## The questions that come up most

| Question | Answer |
|---|---|
| Why did this contact not sync? | [Sync errors](./sync-errors.md) |
| Will it try again by itself? | [Retries](./retries.md) — most transient failures do |
| It says it worked, but nothing arrived | [Silent failures](./silent-failures.md) |
| Why is a list short? | [Silent failures](./silent-failures.md) |
| Why can I not remove somebody from a list? | You cannot. [Lists](../lists/index.md) |

## Three things that look broken and are not

- **"FrontSpin is not set up in this org"** in the portal — the integration is not installed here.
- **NOT_CONFIGURED** in a routing message — multi-instance routing is off, which is the normal
  state for a single-tenant org.
- **"summary/transcript not ready yet"** — FrontSpin had not finished processing. It resolves on
  retry. A few a day is normal.

## Before you change anything

Run the [health check](../setup/checking-it.md). It reads the whole configuration, makes no calls
and changes nothing, and it will often name the problem in one line.
`;

f["frontspin/troubleshooting/sync-errors.md"] = `---
title: Sync errors
sidebar_position: 1
---

# Sync errors

## What they are

One record per failed synchronisation, carrying what failed, why, and whether another attempt is
worth making.

They exist alongside the API logs rather than replacing them, because an API log cannot answer
"what went wrong with **this** Account" — its record references are plain text, so a failure
cannot appear on the record page, and its detail fields cannot be filtered in a query.

## Opening one

**Where:** the **FrontSpin Sync Errors** tab in Salesforce

![A sync error](../../img/shots/frontspin/sync-error.png)

## Reading one

| Field | Tells you |
|---|---|
| **Status** | Where it is in the retry lifecycle |
| **Failure Class** | What kind of failure — see [Retries](./retries.md) |
| **Retryable** | Whether another automatic attempt will be made |
| **Retry Count** | How many have been made |
| **Next Retry** | When the next one is due |
| **Direction** | Outbound (to FrontSpin) or Inbound (from it) |
| **Operation** | CREATE, UPDATE, RESYNC or INBOUND_UPDATE |
| **Salesforce Record Id** | The record that failed |
| **FrontSpin Record ID** | Its FrontSpin counterpart, if it has one |
| **Account** / **Contact** | Proper links, so the error shows on the record |
| **Tenant ID** | Which FrontSpin account |
| **Record Type Developer Name** | What it routed on |
| **Resolved** / **Resolved On** | Whether a later attempt succeeded |

## The Debug section

| Field | Holds |
|---|---|
| **Endpoint** | The address called |
| **Request Payload** | What was sent |
| **Response Body** | What came back |
| **HTTP Status** | The response code |
| **Apex Debug Details** | The exception, if the call never completed |

In the example above, Apex Debug Details carries the whole story: FrontSpin was asked for a call
summary before it had finished producing one, and said so.

## The six statuses

| Status | Means |
|---|---|
| **New** | Just recorded |
| **Retry_Scheduled** | Will be tried again at **Next Retry** |
| **Retrying** | Being tried now |
| **Resolved** | A later attempt succeeded |
| **Failed_Permanent** | Automatic attempts are exhausted |
| **Manual_Required** | A person must decide something |

## History is never deleted

A successful retry does **not** remove the earlier error. It marks the outstanding rows
**Resolved**, with a timestamp.

So a record with resolved errors on it is a record that failed and then recovered — which is
useful, not alarming. The evidence that the first attempt failed survives on purpose.

## What to do with each kind

| Failure Class | Do |
|---|---|
| **RATE_LIMITED** | Nothing. It retries after the allowance resets. |
| **TIMEOUT** | Nothing. It retries within the hour. |
| **FRONTSPIN_SERVER_ERROR** | Nothing, at first. Raise it with FrontSpin if it persists. |
| **BAD_REQUEST** | Look at the payload. Usually a field mapping. |
| **AUTHENTICATION_FAILED** | The API key. Check the Named Credential. |
| **FORBIDDEN** | The key is valid but lacks permission. Ask FrontSpin. |
| **NOT_FOUND** | On an update, the FrontSpin record is gone. A person must decide. |
| **NOT_SENT** | Refused before any call — configuration, routing or ownership. |

[Retries](./retries.md) explains which of these retry themselves and why.

## NOT_SENT is the one to read carefully

It means the integration refused to send the record at all. That is not a FrontSpin problem — it
is this org declining to act on configuration it cannot trust.

The reason is in the error message, and is usually one of
[the eight routing outcomes](../routing/outcomes.md) or a tenant-ownership refusal.

## What goes wrong

| Symptom | Cause |
|---|---|
| The tab is not there | The integration is not installed. |
| You cannot see errors | Read access on the object. See [Permissions](../setup/permissions.md). |
| Hundreds appeared at once | A credential expired, a Record Type was renamed, or a quota ran out. |
| An error with no record link | The failure happened before a record could be identified. |
`;

f["frontspin/troubleshooting/retries.md"] = `---
title: Retries
sidebar_position: 2
---

# Retries

## The short version

Transient failures retry themselves. Failures that would fail identically do not.

That is the whole rule. Everything below is the detail.

## What retries, and what does not

| Failure Class | Retries | Because |
|---|---|---|
| **RATE_LIMITED** | Yes | The allowance resets |
| **FRONTSPIN_SERVER_ERROR** | Yes | A 500 is usually temporary |
| **TIMEOUT** | Yes | The call never completed; the next may |
| **BAD_REQUEST** | No | A malformed message stays malformed |
| **AUTHENTICATION_FAILED** | No | A rejected key stays rejected |
| **FORBIDDEN** | No | Permission will not appear by itself |
| **NOT_FOUND** | No | See below |
| **NOT_SENT** | No | Nothing was sent; fix the configuration |

Retrying the lower five would spend requests out of a limited daily allowance to learn nothing,
and starve the records behind them.

## Why NOT_FOUND is excluded deliberately

On an update, NOT_FOUND means the FrontSpin record is **gone**. Retrying cannot bring it back.

What should happen next is a judgement: clear the stored id so the record is created afresh, or
investigate why it was deleted. That is a decision for a person, not something to attempt
repeatedly.

## The schedule

Up to **four** automatic attempts, spaced:

| Attempt | After |
|---|---|
| 1st retry | 15 minutes |
| 2nd | 1 hour |
| 3rd | 4 hours |
| 4th | 24 hours |

Then the row becomes **Failed_Permanent** and waits for a person.

## Why the last step is 24 hours

Because a rate limit is a **daily** allowance. Any shorter wait is guaranteed to hit the same
limit again and waste an attempt.

The earlier, shorter steps are sized for the other two retryable kinds — a transient server error
and a timeout — which usually clear within minutes.

## Why there is a limit at all

An endlessly retried record would spend a daily allowance as low as 500 on a call that cannot
succeed, and every other record for that tenant would wait behind it.

Four attempts over roughly thirty hours covers every transient failure worth covering.

## The quota stop

Rate limiting is handled with more care than the others, because it affects every record behind
the one that hit it.

When FrontSpin reports the daily allowance exhausted, the integration **stops calling that tenant
immediately** rather than working through the rest and collecting hundreds of identical failures.
Every still-pending record is written down.

A scheduled job then re-drives them **after** the allowance resets. It does not ask FrontSpin
whether the allowance is back — that question would itself cost a request out of the very
allowance being conserved. The schedule is the control instead. If it turns out to still be
exhausted, the first call fails and the whole protection engages again: one wasted request, not
hundreds.

Records are marked once re-driven, so successive runs never send one twice.

## If you cannot wait

[Resync by hand](../manual/index.md). It takes the same path and can be run at any time.

For a record stopped by a quota, waiting is usually better — the automatic re-drive will handle
it, and a manual resync spends the same constrained allowance.

## What goes wrong

| Symptom | Cause |
|---|---|
| An error is not retrying | Its failure class is not retryable. The three that retry are listed above. |
| Retries stopped at four | Expected. It is now **Failed_Permanent**. |
| Everything retried at once a day later | A quota stop, re-driven after the reset. Normal. |
| A record retried and still shows an error | The old error stays, marked **Resolved**. History is kept on purpose. |
`;

f["frontspin/troubleshooting/silent-failures.md"] = `---
title: When nothing is reported
sidebar_position: 3
---

# When nothing is reported

The hardest problems are the ones with no error. Here is every case where the integration can do
less than you expect without raising a failure, and how to recognise each.

## 1. No configuration rows exist

**Looks like:** nothing syncs, no errors anywhere.

With **zero** [configuration rows](../setup/configuration.md), the integration treats itself as
not switched on and stays quiet. Logging one failure per record would put hundreds of rows in the
log for a single bulk load and tell you nothing you did not know.

Once at least one row exists, unroutable records **are** logged.

**Check:** does *any* configuration row exist?

## 2. The mapping switch is the wrong way round

**Looks like:** a report-to-list mapping is saved correctly and never runs.

Mappings live in [Setup or the portal](../lists/where-mappings-live.md), and only one source is
live. Editing the other one changes nothing and warns nobody.

**Check:** **Use Custom Setting** on the FrontSpin Report List Control custom setting.

## 3. Two active setting rows

**Looks like:** the routing mode is set to STRICT and behaves like LEGACY.

Two active rows resolve to LEGACY, as does a blank or unrecognised mode. This is the fail-safe
working — but it is silent.

**Check:** exactly one active row in [FrontSpin Setting](../routing/index.md).

## 4. The scheduling user cannot see the contacts

**Looks like:** a list is consistently shorter than the report.

Scheduled jobs run as whoever created the schedule, and respect sharing. A Contact that user
cannot see cannot be added.

This one **is** reported, as **CONTACTS_NOT_VISIBLE** — but in the job's log rather than as a sync
error on a record, so it is easy to miss.

**Check:** the scheduling user's access to the Contacts the report returns.

## 5. The person who scheduled the jobs has left

**Looks like:** everything stopped on a particular day.

Scheduled Apex runs as its creator, forever. Deactivate that user and the jobs stop.

**Check:** the scheduled jobs exist, and their owner is active.

## 6. Additions are accepted but not yet applied

**Looks like:** a list is short immediately after a sync.

FrontSpin answers an add with **202** — accepted, not done — and applies it asynchronously.

**Check:** wait a few minutes before investigating.

## 7. The guest cannot refresh an existing list

**Looks like:** **Refresh lists** in the portal does nothing for lists already recorded.

A Guest User Licence forbids editing, so the portal can add new lists but never update existing
ones. See [List Mappings](../portal/list-mappings.md).

**Check:** nothing. This is a platform limit. The hourly job keeps existing entries current.

## 8. Change detection skipped the save

**Looks like:** you saved a record and nothing was sent.

A record is only sent when a **mapped** field changed. Editing a field nobody mapped is correctly
a no-op.

**Check:** is the field you changed in the [outbound mappings](../setup/fields-going-out.md)? To
send anyway, [resync by hand](../manual/index.md).

## 9. A list is full of people who should not be on it

**Looks like:** the report was narrowed, the list did not shrink.

Nothing can remove somebody from a FrontSpin list. Narrowing the report stops **adding** them; it
does not take them off.

**Check:** remove them in FrontSpin. See [Lists](../lists/index.md).

## The general rule

When something did not happen and nothing was reported, the cause is almost always a **switch**,
a **missing row**, or a **visibility limit** — not a failure. The
[health check](../setup/checking-it.md) finds the first two in one line.
`;

/* ---------------------------------------------------------------- reference */
f["frontspin/reference/glossary.md"] = `---
title: Glossary
sidebar_position: 0
---

# Glossary

| Term | Means |
|---|---|
| **Tenant** | One FrontSpin account. A Salesforce org can talk to several. |
| **Tenant ID** | The number identifying a tenant, e.g. \`100142\`. |
| **Instance** | The Salesforce configuration describing how to reach one tenant. |
| **Record Type** | The Salesforce label that decides which tenant a record belongs to. |
| **Developer name** | A Record Type's unchanging internal name. Configuration refers to this, not the label. |
| **Configuration row** | The record joining Record Types to a tenant. |
| **Routing rule** | In multi-tenant orgs, the record saying which Record Type goes to which instance. |
| **Routing mode** | LEGACY, CONFIGURATION or STRICT. How strictly routing is applied. |
| **Named Credential** | Where Salesforce keeps the API key, so code never sees it. |
| **Webhook** | A message FrontSpin sends your org when something happens. |
| **URL token** | The secret ending of the webhook address, identifying the tenant. |
| **Webhook secret** | The key used to prove a webhook is genuine. |
| **List** | A FrontSpin calling list. Created and managed in FrontSpin. |
| **List catalogue** | Salesforce's hourly record of which lists exist. |
| **Report to List** | Running a Salesforce report and adding its contacts to a list. |
| **Membership** | A record that somebody was added to a list. |
| **Sync error** | One failed synchronisation, with its reason. |
| **Failure class** | What kind of failure, and whether retrying helps. |
| **Quota** | A tenant's daily request allowance. Can be as low as 500. |
| **Resync** | Sending records to FrontSpin on demand. |
| **Site Guest User** | The identity the portal runs as. Cannot edit or delete records. |
| **202** | FrontSpin's "accepted, will do shortly". Not proof of completion. |
`;

f["frontspin/reference/objects-and-fields.md"] = `---
title: What is stored where
sidebar_position: 1
---

# What is stored where

A map of everything the integration creates, for when an error names something unfamiliar.

## Records it creates

| Object | Holds | One per |
|---|---|---|
| **FrontSpin List** | The catalogue of lists in each tenant | List |
| **FrontSpin List Membership** | Who was added to which list, and when | Addition |
| **FrontSpin Sync Error** | A failed sync, with its reason | Failure |

### FrontSpin List

| Field | Holds |
|---|---|
| FrontSpin List ID | FrontSpin's numeric id for the list |
| FrontSpin List Name | Its name there |
| FrontSpin Config | Which configuration row owns it |
| Tenant ID | Which tenant |
| Company | The company name, where it could be matched |
| List Key | The unique key stopping duplicates |
| Last Synced On | When the catalogue last saw it. **An old date means it has gone from FrontSpin.** |
| Active | Whether it is active there |

### FrontSpin List Membership

| Field | Holds |
|---|---|
| Contact | The Salesforce Contact |
| FrontSpin Contact ID | Its FrontSpin counterpart |
| FrontSpin List ID | Which list |
| FrontSpin Config | Which configuration row |
| Membership Key | The unique key stopping duplicates |
| Status | How it went |
| Synced On | When |

### FrontSpin Sync Error

Covered field by field in [Sync errors](../troubleshooting/sync-errors.md).

## Configuration it reads

All in **Setup** → **Custom Metadata Types**.

| Type | Says | Covered in |
|---|---|---|
| **FrontSpin Configuration Settings** | Record Types → tenant | [Step 2](../setup/configuration.md) |
| **FrontSpin Field Mapping** | Fields going out | [Step 4](../setup/fields-going-out.md) |
| **FrontSpin Inbound Field Mapping** | Fields coming back | [Step 5](../setup/fields-coming-back.md) |
| **FrontSpin Webhook Config** | How to verify incoming messages | [Step 6](../setup/webhooks.md) |
| **FrontSpin Instance** | How to reach one tenant | [Instances](../routing/instances.md) |
| **FrontSpin Routing** | Record Type → instance | [Instances](../routing/instances.md) |
| **FrontSpin Setting** | The routing mode | [The three modes](../routing/index.md) |
| **FrontSpin User** | FrontSpin users ↔ Salesforce users | — |
| **FrontSpin Report List Mapping** | Report → list | [Report to List](../lists/report-to-list.md) |

Plus two **Custom Settings**:

| Setting | Says |
|---|---|
| **FrontSpin Report List Control** | Which mapping source is live |
| **FrontSpin Report List Mapping CS** | The portal-edited mappings |

See [Setup, or the portal](../lists/where-mappings-live.md) for how those two work together.

## Fields it adds to your records

| Field | On | Holds |
|---|---|---|
| FrontSpin id | Account, Contact, Lead | The record's id in FrontSpin |
| FrontSpin Tenant ID | Account, Contact, Lead | Which tenant issued that id |

The second exists to stop an id minted in one tenant being sent to another, where it would land
on a real but unrelated record. See
[Tenants and Record Types](../understand/tenants-and-record-types.md).

## Scheduled jobs

| Name | Runs |
|---|---|
| **FrontSpin List Catalog** | Hourly, at half past |
| **FrontSpin Report to List** | Hourly, on the hour |
| Quota retry | After the daily allowance resets |

The two hourly jobs are offset so they never start in the same minute, and neither can
accidentally cancel the other — their names deliberately share no prefix.
`;

f["frontspin/reference/checklist.md"] = `---
title: Checklist
sidebar_position: 2
---

# Checklist

## Setting up a new tenant

- [ ] Tenant ID, API key and webhook secret obtained from FrontSpin
- [ ] Named Credential created, holding the API key
- [ ] [Record Type](../setup/record-types.md) created on Contact
- [ ] Same Record Type created on Account and Lead, if those sync
- [ ] Record Type developer name written down
- [ ] Profiles given access to the Record Type
- [ ] [Configuration row](../setup/configuration.md) created
- [ ] Record Type developer names entered, comma-separated, spelled exactly
- [ ] Tenant ID and Named Credential filled in
- [ ] [Permissions](../setup/permissions.md) granted to the scheduling user
- [ ] Jobs scheduled as a **permanent** user
- [ ] [Outbound field mappings](../setup/fields-going-out.md) added, if needed
- [ ] [Inbound field mappings](../setup/fields-coming-back.md) added, if needed
- [ ] Receiving site active
- [ ] [Webhook configuration](../setup/webhooks.md) created, with URL token and secret
- [ ] FrontSpin told the webhook address
- [ ] [Health check](../setup/checking-it.md) run and clean
- [ ] A test record synced out
- [ ] A test change synced back

## Adding a second tenant

- [ ] Everything above, for the new tenant
- [ ] [Instance](../routing/instances.md) created
- [ ] Routing rules created, one per object per Record Type
- [ ] No two active rules send one Record Type to different instances
- [ ] Mode set to **CONFIGURATION**
- [ ] Health check clean — no errors, warnings understood
- [ ] Mode set to **STRICT**
- [ ] [Sync errors](../troubleshooting/sync-errors.md) watched for a day

## Setting up Report to List

- [ ] The report exists and returns the right people
- [ ] The report has been checked — **people cannot be removed from a list afterwards**
- [ ] The FrontSpin list exists, and its **number** is known
- [ ] [Which source is live](../lists/where-mappings-live.md) confirmed
- [ ] Mapping created in that source
- [ ] Member Type is \`Contacts\`
- [ ] Active ticked
- [ ] The scheduling user can see every Contact the report returns
- [ ] First run confirmed within the hour

## Monthly health check

- [ ] [Sync health](../portal/sync-health.md) looks normal
- [ ] No growing pile of **Failed_Permanent** [sync errors](../troubleshooting/sync-errors.md)
- [ ] Scheduled jobs still exist, and their owner is still active
- [ ] No list with a stale **Last Synced On**
- [ ] [Health check](../setup/checking-it.md) still clean

## Before blaming FrontSpin

- [ ] [Health check](../setup/checking-it.md) run
- [ ] [Sync errors](../troubleshooting/sync-errors.md) read for the record in question
- [ ] [The nine silent cases](../troubleshooting/silent-failures.md) ruled out
- [ ] The failure class is one that points outward — 5xx, or a quota
`;

/* ------------------------------- correct the existing List Mappings page ---- */
f["admin/data/list-mappings.md"] = `---
title: List Mappings
sidebar_position: 16
---

# List Mappings

**What it is.** Which Salesforce report fills which FrontSpin calling list, for a company.

**What it does.** You say once that a report belongs to a calling list, and from then on everybody
that report returns is added to that list, hourly, without anybody exporting a spreadsheet.

**Why it helps.** Otherwise a calling list is only ever as fresh as the last manual export.

## This tab belongs to the FrontSpin integration

FrontSpin is a sales dialler. The integration between it and your org is **not part of EasyCRM** —
it is installed separately, for customers who use FrontSpin.

**In an org without it, this tab says so** and does nothing else:

> FrontSpin is not set up in this org, so there is nothing to manage here.

That message is expected, not a fault.

## Opening it

**Where:** **Admin** → **List Mappings** → **Choose a company**

1. Click **Admin** in the top menu.
2. Click **List Mappings** in the row of tabs.
3. Choose a **company** first — mappings belong to one.

![List Mappings](../../img/shots/admin/list-mappings.png)

4. Its mappings appear, under a line naming the FrontSpin tenant you are editing.

![Mappings for a company](../../img/shots/admin/list-mappings-chosen.png)

## Before you add anything

Mappings can be stored in Salesforce Setup **or** here, and only one of those is live at a time.
Adding one to the wrong side looks completely correct and has no effect.

The full detail, and the switch that decides, is in the FrontSpin section:
[Setup, or the portal](../../frontspin/lists/where-mappings-live.md).

## The full documentation

This tab is covered properly in the FrontSpin section:

| Page | Covers |
|---|---|
| [List Mappings](../../frontspin/portal/list-mappings.md) | This tab, in detail |
| [Report to List](../../frontspin/lists/report-to-list.md) | What a mapping actually does |
| [Lists](../../frontspin/lists/index.md) | Why somebody cannot be removed from a list |
| [Setup, or the portal](../../frontspin/lists/where-mappings-live.md) | Which source is live |

## The one thing to know before using it

**Nothing can remove somebody from a FrontSpin calling list.** FrontSpin's interface has no
removal of any kind, so narrowing the report stops *adding* people but never takes anybody off.

Check what a report returns before you map it.

## Where this fits

Not to be confused with [CSV Import](./csv-import.md), which is loading a spreadsheet by hand.
They are unrelated — one is a file you upload, this is a standing link to a dialler.
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
