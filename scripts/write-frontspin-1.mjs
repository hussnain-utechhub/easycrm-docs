/* FrontSpin tab, part 1: the tab itself, the overview, and the "Understanding it" section. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};
const cat = {};

cat["frontspin"] = { label: "FrontSpin", position: 4, collapsed: true };
cat["frontspin/understand"] = { label: "Understanding it", position: 1, collapsed: true };

/* ------------------------------------------------------------------ the tab */
f["frontspin/index.md"] = `---
title: FrontSpin
sidebar_position: 0
slug: /frontspin
---

# FrontSpin

**What it is.** FrontSpin is a sales dialler. Your team works a calling list in FrontSpin;
your customer records live in Salesforce and EasyCRM. The integration keeps the two in step so
nobody retypes anything.

**What it does.** Contacts, Accounts and Leads created or changed in Salesforce are pushed into
FrontSpin. Calls, call outcomes and contact changes made in FrontSpin come back into Salesforce.
Salesforce reports can fill a FrontSpin calling list on a timetable.

**Why it matters.** Without it, a dialler and a CRM drift apart within days — someone is called
twice, a number corrected in one system stays wrong in the other, and a calling list is only ever
as fresh as the last manual export.

## An important boundary

The FrontSpin integration is **not part of the EasyCRM package**. It is Apex, custom objects and
configuration that live in your own Salesforce org, built for one customer and installed
alongside EasyCRM.

That means three things:

- Installing EasyCRM does **not** give you FrontSpin sync.
- Upgrading EasyCRM does not change it, and does not break it.
- The portal pages that mention FrontSpin ([List Mappings](./portal/list-mappings.md) and the
  [sync-health view](./portal/sync-health.md)) show a polite "FrontSpin is not set up in this org"
  message when the integration is absent. That message is normal, not a fault.

## Where to start

| If you are | Read |
|---|---|
| New to all of this | [The two systems](./understand/index.md) |
| Setting up a new tenant | [Setting it up](./setup/index.md) |
| Adding a second FrontSpin account | [Routing](./routing/index.md) |
| Filling a calling list from a report | [Lists](./lists/index.md) |
| Using the portal, not Setup | [FrontSpin in the portal](./portal/index.md) |
| Chasing something that did not sync | [Troubleshooting](./troubleshooting/index.md) |

## The shortest possible summary

1. Every customer of yours gets a **Record Type** in Salesforce.
2. Each Record Type is pointed at a **FrontSpin tenant** by a configuration row.
3. Saving a Contact, Account or Lead sends it to that tenant.
4. FrontSpin calls a **webhook** back when something happens at its end.
5. Anything that fails is written down, and most failures retry themselves.

Everything else in this section is detail on those five steps.
`;

/* ------------------------------------------------------------- understanding */
f["frontspin/understand/index.md"] = `---
title: The two systems
sidebar_position: 0
---

# The two systems

## What each one is for

| | Salesforce / EasyCRM | FrontSpin |
|---|---|---|
| Holds | The record of who a customer is | The work of calling them |
| Strong at | History, reporting, permissions | Dialling, call outcomes, lists |
| People use it for | Looking something up | Getting through a call list |

Neither replaces the other. The integration exists so that a fact entered in one appears in the
other without anybody copying it.

## The one idea everything rests on

**A FrontSpin tenant is a separate FrontSpin account.** One Salesforce org can talk to several of
them. Which tenant a record belongs to is decided by that record's **Record Type** — nothing
else.

Not the owner. Not who is logged in. Not the company field. The Record Type.

This is deliberate, and the code says so plainly: the running user is never consulted, so two
people editing the same record always reach the same FrontSpin. If routing depended on who was
editing, the same Contact could be sent to two different diallers depending on who touched it
last.

[Tenants and Record Types](./tenants-and-record-types.md) covers this properly. It is the single
most useful thing to understand before changing anything.

## What this section covers

| Page | Answers |
|---|---|
| [What moves, and which way](./what-syncs.md) | Which records sync, in which direction |
| [Tenants and Record Types](./tenants-and-record-types.md) | How a record finds its FrontSpin |
| [The moving parts](./moving-parts.md) | Every piece, named, so error messages make sense |

## A caution worth reading first

The integration is built to **refuse rather than guess**. When configuration is missing,
contradictory, or points somewhere that is switched off, the record is not sent and the refusal
is written down.

That is the right behaviour — a guess would put a customer's data in a different customer's
dialler — but it means **a quiet integration is not necessarily a working one**. Checking
[sync errors](../troubleshooting/sync-errors.md) occasionally is part of running it.
`;

f["frontspin/understand/what-syncs.md"] = `---
title: What moves, and which way
sidebar_position: 1
---

# What moves, and which way

## Out of Salesforce, into FrontSpin

| What | When | Notes |
|---|---|---|
| **Contact** | Created or changed | The main one. Carries the phone numbers the dialler uses. |
| **Account** | Created or changed | Matched to a FrontSpin account, or created there. |
| **Lead** | Created or changed | Same path as Contact, different object. |
| **List membership** | On a timetable | From a Salesforce report. See [Report to List](../lists/report-to-list.md). |

Sending happens **after the save**, not during it. Saving a record never waits for FrontSpin and
never fails because FrontSpin is slow or down. The work is queued and runs just behind you.

## Into Salesforce, out of FrontSpin

| What | When | Notes |
|---|---|---|
| **Calls** | As they happen | Arrive as a webhook, become Salesforce activity. |
| **Call outcomes and AI summaries** | Shortly after a call | Summaries and transcripts arrive later than the call itself. |
| **Contact changes** | When edited in FrontSpin | Only the fields you have mapped. |

## What does not sync

Being clear about this saves a lot of searching:

- **Nothing is deleted.** FrontSpin's list API has no delete and no remove-from-list endpoint, so
  the integration has no way to take somebody off a list. Lists are add-only.
- **Opportunities, Cases and custom objects** do not sync. Only Contact, Account and Lead.
- **A record with no Record Type** cannot be routed, so it is not sent at all.
- **Attachments and files** do not move in either direction.

## Why "add-only" matters more than it sounds

FrontSpin's documented list interface is three endpoints: see the active lists, add contacts, add
leads. There is no create, update, delete or removal of any kind, and no way to ask who is
already on a list.

So if somebody must come **off** a calling list, that is done in FrontSpin by a person. No change
in Salesforce can achieve it, and none ever will while the API stays as it is.

## One response that does not mean what it looks like

When the integration adds somebody to a list, FrontSpin answers **202**, not 200. That means
"accepted, I will do it shortly" — it is not a promise that the membership exists yet.

So a successful add is not proof of membership. If a list looks short right after a sync, give it
a few minutes before treating it as a fault.

## Where this fits

The mechanics of the outbound path are in [The moving parts](./moving-parts.md). What decides
*which* FrontSpin a record goes to is in
[Tenants and Record Types](./tenants-and-record-types.md).
`;

f["frontspin/understand/tenants-and-record-types.md"] = `---
title: Tenants and Record Types
sidebar_position: 2
---

# Tenants and Record Types

## The chain, in one line

**Record → its Record Type → a configuration row → a FrontSpin tenant.**

Every outbound sync walks that chain. If any link is missing, the record is not sent and the
reason is written down.

## Why the Record Type

A Record Type is a Salesforce label on a record saying what kind of thing it is. This integration
borrows it to mean **which of your customers this record belongs to**, and therefore which
FrontSpin account it should reach.

It was chosen over the alternatives for good reasons:

| Alternative | Why not |
|---|---|
| The running user | Two people editing one record would send it to two different diallers |
| The record owner | Ownership changes for reasons that have nothing to do with which dialler |
| A company field | A text field can be typed wrong, and one company can own several FrontSpin accounts |
| The record's Id | Not portable between sandbox and production |

Record Types are looked up by **developer name**, not by their 18-character Id, so the same
configuration works in a sandbox and in production without editing.

## What a tenant is

A tenant is one FrontSpin account, identified by a **Tenant ID** — a short number like
\`100142\`. Each tenant has its own calling lists, its own users and its own daily request
allowance.

One Salesforce org commonly talks to several. A configuration row names the tenant and the
credential used to reach it.

## Why getting this wrong is serious

FrontSpin decides which tenant you are talking to from the **API key**, not from anything in the
request. So an id created in tenant A, sent using tenant B's key, does not bounce — it lands on a
real but **completely unrelated** record in tenant B, and overwrites it.

The integration guards against this by recording which tenant issued each stored id and refusing
to send it anywhere else. That guard is why a record can report a refusal rather than silently
updating a stranger's data.

## What a configuration row holds

One row per customer, in Setup. It names:

- the **Record Types** it covers (one row can cover several)
- the **Tenant ID**
- the **Named Credential** that carries the API key
- the company name used in FrontSpin

Creating one is [Step 2 of setting up](../setup/configuration.md).

## What goes wrong

| Symptom | Cause |
|---|---|
| Nothing syncs for one customer | No configuration row names their Record Type. |
| Nothing syncs for anybody | No configuration rows exist at all — the integration is not switched on. |
| A record is refused with "no Record Type" | The record genuinely has none. Set one. |
| Two tenants claim one Record Type | Two active rows disagree. See [the eight outcomes](../routing/outcomes.md). |

## Where this fits

Creating the Record Type is [Step 1](../setup/record-types.md). Pointing it at a tenant is
[Step 2](../setup/configuration.md). Running more than one FrontSpin account at once is
[Routing](../routing/index.md).
`;

f["frontspin/understand/moving-parts.md"] = `---
title: The moving parts
sidebar_position: 3
---

# The moving parts

You do not need to know any of this to use the integration. It is here so that when an error
message names something, you know what it is talking about.

## The outbound path, in order

1. Somebody saves a **Contact, Account or Lead**.
2. A trigger hands the record to the **dispatcher**, which works out which tenant it belongs to
   and groups records by tenant.
3. The dispatcher queues the work. **No call to FrontSpin happens during the save** — Salesforce
   forbids it inside a trigger, and doing it per record would collapse under a bulk load.
4. The queued job sends records to FrontSpin in chunks of 50, chaining a follow-up job for the
   remainder.
5. Successes stamp the FrontSpin id onto the Salesforce record. Failures are written to
   [sync errors](../troubleshooting/sync-errors.md).

## Why a bulk load does not lose records

This is worth knowing because it was once a real bug with a real cost.

A load of 500 records fires the trigger three times (200, 200, 100). An earlier version allowed
only one queued job per transaction, so the second and third firings returned early and their
records were **discarded with no log row at all** — a live import of 227 Accounts and 304 Contacts
lost 27 and 104 of them.

It now queues one chain **per group per trigger firing**, so all three firings produce work and
nothing is dropped. The same defect was fixed separately in the Task pipeline.

If you ever see a bulk load where the numbers do not add up, this is the shape of problem to
suspect — but the fix is in place, so check [sync errors](../troubleshooting/sync-errors.md)
first.

## The portal's special case

The EasyCRM portal runs as the **Site Guest User**. A background job queued by a guest cannot read
the records it was given — it sees zero rows.

So when a portal save needs to sync, the work is published as an internal message instead, and a
separate handler picks it up running as **Automated Process**, which can read the records. Every
decision was already made in the original transaction; the handler only carries it out.

You will not see this, but it explains why portal saves and internal saves take slightly different
routes to the same place.

## The inbound path

1. FrontSpin sends a **webhook** to a public URL in your org.
2. The receiver checks the signature, answers quickly, and queues the real work.
3. The queued job finds the matching Salesforce record and applies the change.

FrontSpin retries a failed delivery up to four times at random one-to-five-minute intervals, so a
brief outage does not lose events.

## The scheduled jobs

| Job | Runs | Does |
|---|---|---|
| **FrontSpin List Catalog** | Hourly, at half past | Records which lists exist in each tenant |
| **FrontSpin Report to List** | Hourly, on the hour | Runs each mapped report and adds its contacts to a list |
| Quota retry | After the daily allowance resets | Re-sends records a quota limit stopped |

The two hourly jobs are deliberately offset so they never start in the same minute, and they are
deliberately separate — neither can abort the other.

## Where the evidence lives

| Place | Holds |
|---|---|
| **FrontSpin Sync Errors** | One row per record that failed, with the reason |
| **API Logs** | The full request-and-response narrative |
| **FrontSpin Lists** | The catalogue of lists in each tenant |
| **FrontSpin List Memberships** | Who was added to which list, and when |

[Troubleshooting](../troubleshooting/index.md) says which to look at first.
`;

/* ----------------------------------------------------------------- write out */
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
