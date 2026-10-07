/* FrontSpin tab, part 3: routing across several tenants, lists, and the call pipeline. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};
const cat = {
  "frontspin/routing": { label: "Running several tenants", position: 3, collapsed: true },
  "frontspin/lists": { label: "Lists", position: 4, collapsed: true },
  "frontspin/calls": { label: "Calls and activity", position: 5, collapsed: true },
};

/* ------------------------------------------------------------------ routing */
f["frontspin/routing/index.md"] = `---
title: The three modes
sidebar_position: 0
---

# Running several tenants

## What this section is for

One Salesforce org can talk to several FrontSpin accounts. This section is about doing that
safely — and in particular about **not** switching on enforcement until the configuration is
ready for it.

If you have one FrontSpin account, you can skip the whole section. The default mode is exactly
right for you.

## The three modes

The org runs in one of three modes. The mode decides how strictly per-Record-Type routing is
applied.

| Mode | Routing rules are | Traffic uses | Unmapped records are |
|---|---|---|---|
| **LEGACY** | Ignored for traffic | The original single tenant | Sent as before |
| **CONFIGURATION** | Loaded and checked | The original single tenant | Sent as before |
| **STRICT** | Enforced | The tenant the rule names | **Refused**, not guessed |

**LEGACY is the default**, and it is the fail-safe. The org only reaches STRICT by somebody
deliberately setting it.

## Why CONFIGURATION exists

It is the rehearsal. In CONFIGURATION mode you can load every routing rule, run the
[health check](../setup/checking-it.md), and see exactly what STRICT **would** do — while traffic
carries on going where it always went and nothing is refused.

Going straight from LEGACY to STRICT without that rehearsal is how an org discovers at nine on a
Monday that fourteen Record Types have no rule.

## How the mode is set

**Setup** → **Custom Metadata Types** → **FrontSpin Setting** → **Manage Records**

There should be exactly **one active row**, with **Routing Mode** set to \`LEGACY\`,
\`CONFIGURATION\` or \`STRICT\`.

## Everything ambiguous means LEGACY

This is worth knowing in full, because it means a configuration mistake can never accidentally
switch enforcement on:

| Situation | Resulting mode |
|---|---|
| No setting row at all | LEGACY |
| The row is inactive | LEGACY |
| **Two or more** active rows | LEGACY |
| Routing Mode is blank | LEGACY |
| Routing Mode is a word nobody recognises | LEGACY |

So if you set STRICT and nothing changes, the first thing to check is whether a **second** active
row exists. Two active rows is not an error — it is silently LEGACY.

## Moving off LEGACY {#moving-off-legacy}

1. Create the [instances and routing rules](./instances.md) you need.
2. Set the mode to **CONFIGURATION**.
3. Run the [health check](../setup/checking-it.md). Fix every **ERROR**.
4. Work through the **WARNING** lines. Each one is a Record Type that STRICT would refuse.
5. When the check is clean, set the mode to **STRICT**.
6. Watch [sync errors](../troubleshooting/sync-errors.md) closely for a day.

**You can go back.** Setting the mode to LEGACY restores the previous behaviour immediately, with
no deploy. If STRICT causes trouble you cannot diagnose quickly, switch back and investigate
calmly.

## What goes wrong

| Symptom | Cause |
|---|---|
| STRICT was set, nothing changed | Two active setting rows, or a typo in the mode. |
| Records suddenly refused after a change | STRICT is on and a Record Type has no rule. |
| The health check is clean but traffic still goes to one tenant | Mode is CONFIGURATION, not STRICT. That is CONFIGURATION working correctly. |

## Where this fits

[Instances and routing rules](./instances.md) are what STRICT enforces.
[The eight outcomes](./outcomes.md) are what it reports.
`;

f["frontspin/routing/instances.md"] = `---
title: Instances and routing rules
sidebar_position: 1
---

# Instances and routing rules

## Two things, not one

| Thing | Says |
|---|---|
| **An instance** | How to reach one FrontSpin tenant |
| **A routing rule** | Which Record Type goes to which instance |

You need one instance per FrontSpin account, and one routing rule per Record Type you want routed.

## Instances

**Setup** → **Custom Metadata Types** → **FrontSpin Instance** → **Manage Records**

| Field | What to put |
|---|---|
| **Label** | The tenant's name |
| **Active** | Tick it. Untick to take the tenant out of service without deleting anything. |
| **Named Credential** | The credential holding this tenant's API key |
| **Base URL** | Only if there is no Named Credential |
| **Base Path** | The path part of the address |
| **Tenant Id** | The tenant's number |

**Prefer the Named Credential.** When one is set, the address is built through it and the API key
is attached by the platform — it never appears in code and never reaches a log. Base URL is the
fallback for cases where that is not possible.

## Routing rules

**Setup** → **Custom Metadata Types** → **FrontSpin Routing** → **Manage Records**

| Field | What to put |
|---|---|
| **Label** | Something readable, e.g. "Northwind Contacts" |
| **Active** | Tick it |
| **Object Api Name** | \`Contact\`, \`Account\` or \`Lead\` |
| **Record Type Developer Name** | The developer name from [step 1](../setup/record-types.md) |
| **FrontSpin Instance** | Which instance this Record Type goes to |

One rule per object per Record Type. A customer syncing all three objects needs three rules.

## The rule that must never be broken

**Two active rules must never send the same Record Type to different instances.**

If they do, routing reports **AMBIGUOUS_MAPPING** and refuses — which is the right answer. It
cannot pick one, and picking wrongly would put one customer's contact in another customer's
dialler.

Fix it by deactivating the rule that should not be there, not by deleting records.

## Deactivating, not deleting

Every one of these has an **Active** tick box, and unticking is almost always better than
deleting:

- Unticking an **instance** takes a tenant out of service; records routed to it are refused with a
  clear reason rather than sent somewhere wrong.
- Unticking a **rule** removes one Record Type from routing.
- Both are instantly reversible, and the history of what existed is kept.

## What goes wrong

| Symptom | Cause |
|---|---|
| "no mapping exists for Record Type" | No rule covers it. Add one. |
| "the mapping is inactive" | The rule exists but **Active** is unticked. |
| "the instance is switched off" | The rule is fine; its instance is inactive. |
| "two or more active mappings" | Two rules disagree. Deactivate one. |

Each of these is one of [the eight outcomes](./outcomes.md), which explains them in full.

## Where this fits

Rules are only **enforced** in STRICT mode — see [the three modes](./index.md).
`;

f["frontspin/routing/outcomes.md"] = `---
title: The eight outcomes
sidebar_position: 2
---

# The eight outcomes

Every attempt to work out where a record should go ends in exactly one of eight results. They
appear in [sync errors](../troubleshooting/sync-errors.md) and in the
[health check](../setup/checking-it.md), so it is worth being able to read them.

## The one good one

| Outcome | Means | Do |
|---|---|---|
| **RESOLVED** | The record was matched to an active instance | Nothing |

## The seven others

| Outcome | Means | Do |
|---|---|---|
| **NOT_CONFIGURED** | No routing rules exist at all | Nothing — the org is still on a single tenant. Normal. |
| **NO_RECORD_TYPE** | The record has no Record Type | Set one on the record |
| **NO_MAPPING** | Rules exist, but none covers this Record Type | [Add a rule](./instances.md) |
| **MAPPING_INACTIVE** | A rule exists for it, but is switched off | Tick **Active**, if it should be on |
| **INSTANCE_INACTIVE** | The rule is fine; its instance is switched off | Tick **Active** on the instance |
| **INSTANCE_MISSING** | The rule points at no instance | Set **FrontSpin Instance** on the rule |
| **AMBIGUOUS_MAPPING** | Two active rules disagree about this Record Type | Deactivate one |

## Reading them

Three of these are **not** faults in the ordinary sense:

- **NOT_CONFIGURED** is what a healthy single-tenant org reports all day. It means "multi-instance
  routing is not switched on", which is true and fine.
- **NO_MAPPING** during a rollout means work not done yet, not a mistake. The health check grades
  it as a warning for that reason.
- **MAPPING_INACTIVE** is often somebody deliberately pausing a customer.

The four that always want attention are **NO_RECORD_TYPE**, **INSTANCE_MISSING**,
**INSTANCE_INACTIVE** and **AMBIGUOUS_MAPPING**.

## Why refusing beats guessing

Six of the seven describe a configuration that does not say clearly where a record should go. The
integration refuses them all.

The alternative — sending to the most likely tenant — would mean a customer's contact details
turning up in a different customer's dialler, with nothing in either system saying it happened.
A refusal is visible, reversible and fixable. A wrong delivery is none of those.

## Where this fits

Outcomes are produced by [the routing rules](./instances.md) and only **enforced** in STRICT
mode — see [the three modes](./index.md).
`;

/* -------------------------------------------------------------------- lists */
f["frontspin/lists/index.md"] = `---
title: What a list is
sidebar_position: 0
---

# Lists

## What a FrontSpin list is

A calling list: the set of people the dialler will work through. Lists are created and managed
**in FrontSpin**, not in Salesforce.

What Salesforce can do is **add people to one**, on a timetable, from a report.

## What Salesforce cannot do

This is the single most important thing on this page.

| Action | Possible |
|---|---|
| Add contacts to a list | Yes |
| Add leads to a list | Yes |
| See which lists exist | Yes |
| **Create** a list | No |
| **Rename** a list | No |
| **Delete** a list | No |
| **Remove** somebody from a list | No |
| **Ask who is on** a list | No |

FrontSpin's list interface is three endpoints — see the active lists, add contacts, add leads.
There is no removal endpoint of any kind, and no membership lookup. This is not a limitation of
the integration; it is the whole published surface.

**So taking somebody off a calling list is done by a person, in FrontSpin.** No change in
Salesforce achieves it.

## The list catalogue

So that Salesforce knows which lists exist, a job records them.

| | |
|---|---|
| **Job name** | FrontSpin List Catalog |
| **Runs** | Every hour, at half past |
| **Does** | Asks each tenant for its active lists and records them as **FrontSpin List** records |
| **Does not** | Touch memberships, run reports or add anybody to anything |

Each tenant is handled by its own job, so one tenant's failure never stops another's — and because
the list feed supports no paging or filtering, one tenant's response can be large. A live tenant
returned roughly 690 KB for 125 lists.

## Nothing is ever deleted

If a list disappears from FrontSpin, its record in Salesforce **stays**, and simply stops having
its "last synced" time refreshed.

That is deliberate: it makes "this list vanished from FrontSpin" visible, rather than the
catalogue quietly destroying a record it did not create. An old **Last Synced On** date is the
signal.

## Where lists appear

| Place | Shows |
|---|---|
| The **FrontSpin Lists** tab in Salesforce | Every list, with its tenant and last-synced time |
| [List Mappings](../portal/list-mappings.md) in the portal | Lists you can map a report to |

## What goes wrong

| Symptom | Cause |
|---|---|
| A new FrontSpin list does not appear | The catalogue job has not run yet. It runs hourly. |
| A list is in Salesforce but not FrontSpin | It was deleted there. The record is kept on purpose. |
| **Last Synced On** is days old | The job is failing, or has been unscheduled. |
| Somebody cannot be removed from a list | Correct. Do it in FrontSpin. |

## Where this fits

Filling a list from a Salesforce report is [Report to List](./report-to-list.md). Where those
mappings are configured is [Setup, or the portal](./where-mappings-live.md).
`;

f["frontspin/lists/report-to-list.md"] = `---
title: Report to List
sidebar_position: 1
---

# Report to List

## What it does

Runs a Salesforce report on a timetable and adds everybody it returns to a FrontSpin calling list.

It is how a calling list stays current without anybody exporting a spreadsheet.

## How it runs

| | |
|---|---|
| **Job name** | FrontSpin Report to List |
| **Runs** | Every hour, on the hour |
| **Does** | For each active mapping: run the report, add its contacts to the list |

Each mapping gets its own job, so each has its own request budget and its own failure. A big
mapping cannot starve a small one, and one failing mapping does not stop the rest.

## What a mapping says

Three things, and only three:

| Setting | Means |
|---|---|
| **Report ID** | Which Salesforce report to run |
| **FrontSpin Config** | Which [configuration row](../setup/configuration.md) owns the tenant |
| **FrontSpin List ID** | Which numbered list to add to |

Plus **Member Type** (\`Contacts\`) and **Active**.

A mapping holds **no** tenant id, no credential and no API key — those come from the configuration
row it names. That is why the configuration row's **developer name** matters.

## FrontSpin List ID must be a number

It is FrontSpin's own numeric list identifier — not a list name, and not a Salesforce Id. Entering
either of those is rejected with **LIST_ID_NOT_NUMERIC**.

Find the number in the [list catalogue](./index.md), or ask whoever runs the FrontSpin account.

## Only Contacts

**Member Type** supports \`Contacts\`. Leads are recognised but not implemented, and a mapping set
to anything else is rejected with **MEMBER_TYPE_UNSUPPORTED**.

## Why the report matters more than the mapping

The mapping is three fields. The **report** is where all the judgement is:

- Everybody the report returns is added to the list.
- Removing somebody from the report does **not** remove them from the list — nothing can.
- So a report that is too broad produces a list you cannot narrow again.

**Start narrow.** It is easy to add more people to a list next hour, and impossible to take them
off from Salesforce.

Build the report with [the report builder](../../use/reports/index.md) like any other, and check
what it returns before mapping it.

## Who the report can see

The job runs as whoever scheduled it, and respects sharing. A Contact that user cannot see cannot
be added.

This is reported as **CONTACTS_NOT_VISIBLE** rather than passing quietly, so a short list has a
visible cause. See [Permissions](../setup/permissions.md).

## Why a success is not proof

FrontSpin answers an add request with **202** — "accepted, I will do it shortly" — and schedules
the change asynchronously. So the job reporting success means the request was taken, not that the
list has changed yet.

Give it a few minutes before investigating a list that looks short.

## What goes wrong

| Message | Means |
|---|---|
| **NO_MAPPINGS** | No mappings exist at all |
| **NOT_FOUND** | The named mapping does not exist |
| **INACTIVE** | **Active** is unticked. Skipped on purpose. |
| **NO_REPORT** | **Report ID** is blank |
| **NO_LIST_ID** | **FrontSpin List ID** is blank |
| **LIST_ID_NOT_NUMERIC** | A name or a Salesforce Id was entered |
| **NO_CONFIG** | **FrontSpin Config** is blank |
| **CONFIG_UNRESOLVED** | The configuration it names is missing or incomplete |
| **MEMBER_TYPE_UNSUPPORTED** | Leads, or something unrecognised |
| **CONTACTS_NOT_VISIBLE** | The scheduling user cannot see some of the report's contacts |

## If there are more mappings than one run can dispatch

There is a cap on how many mappings one run can start. Anything beyond it is **not silently
dropped** — it is named in the API log so you can see exactly which mappings did not run.

## Where this fits

Mappings can live in two places — [Setup, or the portal](./where-mappings-live.md).
`;

f["frontspin/lists/where-mappings-live.md"] = `---
title: Setup, or the portal
sidebar_position: 2
---

# Where report-to-list mappings live

## Two places, one switch

Report-to-list mappings can be stored in either of two places. **Only one is live at a time**, and
a single switch decides which.

| Source | Edited in | Who can edit |
|---|---|---|
| **Custom Metadata** | Salesforce Setup | A Salesforce administrator |
| **Custom Setting** | The EasyCRM portal's [List Mappings](../portal/list-mappings.md) tab | A portal Super Admin |

## The switch

**Setup** → **Custom Settings** → **FrontSpin Report List Control** → **Manage**

One tick box: **Use Custom Setting**.

| State | The live source is |
|---|---|
| Unticked (the default) | Custom Metadata, in Setup |
| Ticked | The Custom Setting, edited in the portal |

The switch **defaults to off and fails to off**, so its mere existence changes nothing until
somebody deliberately ticks it.

## Which to choose

| Choose Setup when | Choose the portal when |
|---|---|
| Mappings change rarely | Mappings change often |
| Only Salesforce admins should change them | Portal admins should manage their own |
| You want them deployed between orgs | You want changes to take effect without a deploy |

Custom Metadata travels with a deployment; a Custom Setting does not. That is the real trade-off:
repeatability versus immediacy.

## The trap

**Editing the source that is not switched on changes nothing, and gives no warning.**

If somebody adds a mapping in the portal while the switch is off, the portal shows it correctly,
the scheduled job never sees it, and nothing anywhere reports a problem.

So when a new mapping has no effect, check the switch **before** checking anything else.

## Only the source differs

Both sources are turned into the same shape before anything looks at them, so validation, error
messages and behaviour are identical either way. Nothing else about the sync changes.

## What goes wrong

| Symptom | Cause |
|---|---|
| A new mapping does nothing | It was added to the source that is not switched on. |
| Mappings vanished after switching | They are still there, in the other source. Switch back. |
| Setup and the portal disagree | Expected. They are two separate stores; only one is live. |

## Where this fits

The portal end is [List Mappings](../portal/list-mappings.md). What a mapping does is
[Report to List](./report-to-list.md).
`;

/* -------------------------------------------------------------------- calls */
f["frontspin/calls/index.md"] = `---
title: How calls come back
sidebar_position: 0
---

# Calls and activity

## What comes back

When your team makes calls in FrontSpin, those calls become activity in Salesforce — so the
customer record shows what happened without anybody writing it up twice.

| Arrives | Carries |
|---|---|
| **A call** | Who, when, the outcome |
| **An AI summary** | A short account of the conversation |
| **A transcript** | What was said, by whom |
| **A contact change** | Fields edited in FrontSpin |

## The four messages FrontSpin sends

| Message | Sent when |
|---|---|
| \`call.create\` | A call starts being recorded |
| \`call.update\` | Its details change |
| \`call.ai.update\` | A summary or transcript is ready |
| \`contact.update\` | A contact is edited in FrontSpin |

## Why summaries arrive late

A summary and a transcript are produced **after** the call ends, by FrontSpin's own processing.
They arrive as a separate message, usually minutes later.

So a call appearing without a summary is normal, briefly. If the integration asks for one too
early, FrontSpin answers plainly — "summary/transcript not ready yet for Call ID … Please wait a
moment and try again" — and that is recorded as a
[sync error](../troubleshooting/sync-errors.md) that resolves itself on the retry.

**A handful of "not ready yet" errors on a busy day is normal.** Hundreds are not.

## Transcripts are read, never written

There is no transcript endpoint in FrontSpin and no transcript to address. Summaries and
transcripts exist only as **fields on the call record**, read back through the calls endpoint.

So nothing in Salesforce can create, change or delete a transcript. The integration refuses those
operations before making any request at all.

## One subtlety worth knowing

On a \`call.ai.update\` message the object id is the **transcript's** id, not the call's. The call
id is carried separately inside the message.

That matters if you are ever reading raw log entries and trying to match a summary to a call — the
most obvious-looking id is the wrong one.

## Tasks

Calls also drive Salesforce **Tasks** through a separate pipeline, which routes on the Record Type
of the Contact the Task points at — the same rule the rest of the integration uses, applied to
\`Task.WhoId\`.

Like the main path, Tasks are grouped by tenant and sent in chunks rather than one at a time, so a
large load does not exhaust the request budget.

## What goes wrong

| Symptom | Cause |
|---|---|
| Calls do not arrive at all | The [webhook](../setup/webhooks.md) is not configured, or the signature does not match. |
| Calls arrive, summaries never do | Summaries are produced later. Check for repeated "not ready yet" errors. |
| A call arrives against no record | The contact does not exist in Salesforce yet. See the correlation retry settings in [Webhooks](../setup/webhooks.md). |
| Everything stopped at once | Check whether the receiving site is still active. |

## Where this fits

Getting messages to arrive at all is [Webhooks](../setup/webhooks.md). Which fields they write is
[fields coming back](../setup/fields-coming-back.md).
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
