/* Remaining Admin Console tabs, with verified control names. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

f["administration/permission-sets.md"] = `---
title: Permission Sets
sidebar_position: 5.5
---

# Permission Sets

**What it is.** A named bundle of extra access that you hand to particular people.

**What it does.** It adds to whatever those people already have from their role and
[profile](./profiles.md).

**Why it helps.** When three people need more than everybody else doing their job, you give
those three a permission set instead of widening the access of the whole group.

## Opening it

**Where:** **Admin** → **Permission Sets**

1. Click **Admin** in the top menu.
2. Click **Permission Sets** in the row of tabs.

![Permission Sets](../img/shots/admin/permission-sets-full.png)

## Creating one

**Where:** **Admin** → **Permission Sets** → **New Permission Set**

1. Click **Admin**, then **Permission Sets**.
2. Click **New Permission Set**.
3. Name it after what it grants, such as "Can delete contacts".

   ![Adding a permission set](../img/shots/admin/modal-new-permission-set.png)

4. Tick what it allows.
5. Click **Save**.

## Giving it to somebody

**Where:** **Admin** → **Users** → the person's row → **Manage permission sets**

1. Click **Admin**, then **Users**.
2. Find the person in the list.
3. Click **Manage permission sets** in their row.
4. Tick the sets they should have.
5. Click **Save**.

One person can have several. They all add together.

## It can only ever add

A permission set never takes access away. If somebody already has something, no permission set
will remove it.

To take access away you either change their [profile](./profiles.md), change their
[permissions](./permissions.md) directly, or use a
[restriction rule](./restriction-rules.md) for which records they see.

## Taking one back

Open **Manage permission sets** for that person and untick it. They lose whatever only that
set was granting, and keep everything their profile gives them.

## Naming them

Name a permission set after **what it grants**, because that is what you are looking for when
assigning it. "Can delete contacts" is useful. "Extra access 2" is not.
`;

f["administration/audit-log.md"] = `---
title: Audit Log
sidebar_position: 14
---

# Audit Log

**What it is.** A record of who did what, and when.

**What it does.** It writes down sign-ins, failed sign-ins, password changes and
administration changes, newest first.

**Why it matters.** It cannot be edited or deleted by anybody, including a Super Admin. That
is the point of it: it is evidence, not a convenience.

## Opening it

**Where:** **Admin** → **Audit Log**

1. Click **Admin** in the top menu.
2. Click **Audit Log** in the row of tabs.

![Audit Log](../img/shots/admin/audit-log-full.png)

Each row shows who did it, what they did, and when.

## Narrowing it down

**Where:** **Admin** → **Audit Log** → **All actions** / **Search**

1. Click the **All actions** box to filter by the kind of action.

   ![Filtering the audit log](../img/shots/admin/audit-log-filter.png)

2. Or type into **Search** to find a person or a record.

Both work together, so you can look for one kind of action by one person.

## What gets recorded

| Action | Why it is kept |
|---|---|
| Sign-in | Who was in, and when. |
| **Failed** sign-in | Repeated failures on one account are worth noticing. |
| Password change or reset | Who changed whose. |
| Administration changes | Permissions, sharing, users. |
| Logging in as another person | Both names, every time. |

## Logging in as somebody else

This is recorded particularly carefully. Every attempt is written down, **allowed or refused**,
and anything done during that session records both names — the person acting and the person
whose account it was.

So the log always answers "who really did this?", not just "whose account was it?".

## What you cannot do

You cannot edit a row, delete a row, or turn the log off. If that were possible the log would
be worthless.

## When to look at it

- Somebody says they did not make a change.
- You want to know who last changed a setting.
- An account shows repeated failed sign-ins.
`;

f["administration/list-mappings.md"] = `---
title: List Mappings
sidebar_position: 16
---

# List Mappings

**What it is.** How an incoming spreadsheet's columns line up with your fields.

**What it does.** You say once that their "Company Name" is your "Account Name", and every
later list from that source lands correctly.

**Why it helps.** Without it, somebody re-matches the same columns by hand every time a list
arrives.

## Opening it

**Where:** **Admin** → **List Mappings** → **Choose a company**

1. Click **Admin** in the top menu.
2. Click **List Mappings** in the row of tabs.
3. The page asks you to **Choose a company** first — mappings belong to a company, because
   different sources send different formats.

![List Mappings](../img/shots/admin/list-mappings-full.png)

4. Choose the company.
5. Its mappings appear.

![Mappings for a company](../img/shots/admin/list-mappings-chosen.png)

## Creating a mapping

1. Choose the company.
2. Click **New**.
3. Name the mapping after where the list comes from.
4. For each incoming column, choose which of your fields it belongs in.
5. Leave anything you do not want unmapped.
6. Click **Save**.

## Getting the column names right

The incoming column names must match **exactly** — including capital letters and spaces. "Company
Name" and "company name" are not the same thing to the mapping.

The safest way is to copy the heading straight out of a real file from that source.

## Changing one

Open it, change the matching, and save. It applies to lists arriving from then on. Records
already loaded are not touched.

## How it relates to CSV Import

[CSV Import](./csv-import.md) is you loading a file by hand, matching columns as you go. A
list mapping is for lists that arrive repeatedly from the same place, so nobody has to match
them each time.

Same idea; one is a one-off, the other is standing.
`;

f["administration/api-integration.md"] = `---
title: API Integration
sidebar_position: 17
---

# API Integration

**What it is.** A way to let another system read your portal data automatically.

**What it does.** You create a key, choose exactly what it may read, and give it to whoever is
building the other system.

**Why it is safe.** Keys can only **read**. Nothing can be changed or deleted through them, so
the worst a leaked key can do is show somebody data — not alter it.

## Opening it

**Where:** **Admin** → **API Integration**

1. Click **Admin** in the top menu.
2. Click **API Integration** in the row of tabs.

![API Integration](../img/shots/admin/api-integration-full.png)

Everybody who currently holds a key is listed.

## Creating a key

**Where:** **Admin** → **API Integration** → **Set up API access**

1. Click **Admin**, then **API Integration**.
2. Click **Set up API access**.

   ![Setting up API access](../img/shots/admin/api-set-up-access.png)

3. Choose the person the key belongs to. The key sees what that person can see, so choose
   somebody whose access matches what the other system should get.
4. Choose which kinds of record it may read, and which fields.
5. Add filters if it should only see some records.
6. Click **Save**.

## Copy the secret now

When the key is created, the **Secret** is shown **once**.

Copy it immediately and give it to whoever needs it, through something secure. If it is lost,
you cannot look it up — you have to **Regenerate**, which produces a new secret and stops the
old one working.

## Giving a key less, not more

Two habits worth keeping:

- Attach the key to somebody with **only** the access the other system needs. A key on a Super
  Admin can read everything.
- Choose fields deliberately. If the other system needs names and emails, do not give it
  everything else as well.

## Managing an existing key

| Button | What it does |
|---|---|
| **Edit** | Change which records and fields the key may read. |
| **Regenerate** | Issue a new secret. The old one stops working at once. |
| **Revoke** | Switch the key off completely. |

**Regenerate** when a secret may have been seen by the wrong person. **Revoke** when the other
system is being retired.

Either one breaks the other system immediately, so tell whoever runs it first.

## Documentation for developers

The technical documentation — endpoints, paging, filters — is on its own site at
[docs.outboundoperators.com](https://docs.outboundoperators.com).

Send that link to whoever is building the integration. They do not need portal access to read
it.
`;

f["administration/api-usage.md"] = `---
title: API Usage
sidebar_position: 18
---

# API Usage

**What it is.** How much each API key is being used, and what it asked for.

**What it does.** It counts requests over a period, broken down by company and by user.

**Why it helps.** It answers three questions quickly: is the key working, which system is
busiest, and is anything being used far more than expected.

## Opening it

**Where:** **Admin** → **API Usage**

1. Click **Admin** in the top menu.
2. Click **API Usage** in the row of tabs.

![API Usage](../img/shots/admin/api-usage-full.png)

## Choosing what to look at

Across the top:

| Control | What it does |
|---|---|
| **Last 7 days** | The period. Change it to look further back. |
| **All companies** | Narrow to one company. |
| **All users** | Narrow to one person's key. |
| **Previous** / **Next** | Move through the periods. |
| **Refresh** | Fetch the latest figures. |

The two halves — **Portal API** and **FrontSpin sync health** — are separate: one is your own
API keys, the other is a specific integration's health.

## Taking the figures away

Click **Export** to download them as a spreadsheet, for a report or a conversation about
costs.

## Reading it

| What you see | What it usually means |
|---|---|
| Zero requests from a key you expect to be busy | The other system is not calling, or is failing before it reaches you. |
| A sudden rise | A change at the other end — often a loop. |
| Steady, predictable volume | Working normally. |

A key with no traffic at all for a long time is usually one nobody needs any more. Consider
revoking it under [API Integration](./api-integration.md).
`;

f["administration/publish-schedule.md"] = `---
title: Publish Schedule
sidebar_position: 19
---

# Publish Schedule

**What it is.** Copying portal reports into Salesforce automatically, on a timetable.

**What it does.** It re-creates a portal report as a Salesforce report, and keeps it updated.

**Why it helps.** People who work in Salesforce see the same numbers as people in the portal,
without anybody rebuilding the report twice or exporting it by hand.

## Opening it

**Where:** **Admin** → **Publish Schedule**

1. Click **Admin** in the top menu.
2. Click **Publish Schedule** in the row of tabs.

![Publish Schedule](../img/shots/admin/publish-schedule-full.png)

## It starts switched off

Automatic publishing is **off** until somebody turns it on. That is deliberate: it writes into
Salesforce on a timer, and that should be a decision rather than a default.

1. Click **Turn on** at the top.
2. Set the schedule for each report.

## Scheduling a report

1. Find the report in the list.
2. Choose how often it should publish.
3. Click **Save**.

**Apply to all** sets the same frequency for every report at once, which is quicker when you
want them all on the same rhythm.

## Choosing a frequency

Match it to how fast the data changes and who is waiting for it.

| Frequency | Suits |
|---|---|
| Hourly | Numbers people watch during the day. |
| Daily | Most reports. |
| Weekly | Summaries nobody reads more often than that. |

More often is not better. Each publish does real work, and a report nobody looks at before
Monday does not need rebuilding every hour.

## Checking it worked

Click **Refresh**. Each report shows when it last published and whether it succeeded.

## If a report is deleted

Its schedule **pauses**. It does not quietly create a new report in Salesforce to replace the
one somebody deleted.

That is on purpose: deleting a report is usually deliberate, and silently re-creating it would
undo the decision. Set up a new schedule if you want it back.

## Turning it off again

Click **Off** at the top. Schedules are kept but stop running, so you can turn it back on
without setting everything up again.
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Rewrote ${n} pages.`);
