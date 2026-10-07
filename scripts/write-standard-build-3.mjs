/* Standard Build, part 3: the Best Phone flow and the reference pages. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};
const cat = {
  "standard-build/automation": { label: "Automation", position: 5, collapsed: true },
  "standard-build/reference": { label: "Reference", position: 6, collapsed: true },
};

f["standard-build/automation/best-phone.md"] = `---
title: The Best Phone flow
sidebar_position: 0
---

# Best Phone Best Status Update

## The problem it solves

A contact can hold seven phone numbers — Phone, Mobile and Phone 2 through 5 — each with its own
status scoring how good it is. A caller should not have to compare seven statuses before
dialling, and a report cannot filter on "whichever of these seven is best".

So one number is chosen and copied into **Best Phone**, with its status copied into
**Best Phone Status**. Everything downstream reads those two fields and nothing else.

## What it is

| | |
|---|---|
| **Flow label** | Best Phone Best Status Update |
| **API name** | \`Best_Phone_Best_Status_Update\` |
| **Type** | Record-Triggered Flow, **run before save** |
| **Object** | Contact |
| **Trigger** | A record is created **or** updated |
| **Optimised for** | Fast Field Updates |
| **Status** | Active |

**Where:** **Setup** → search **Flows** → **Best Phone Best Status Update**

![The flow, and its trigger configuration](../../img/shots/standard-build/flow-trigger.png)

## Why "before save" matters

A before-save flow changes the record **on its way into the database**, in the same transaction
that saved it. There is no second update, so:

- the field is correct the instant the record is saved, not a moment later
- it costs a fraction of what an after-save flow costs
- it cannot trigger itself, because no second save happens

The trade-off is that a before-save flow may only update **the record that triggered it**. That
is all this flow needs.

## The entry condition

**Condition Requirements:** Formula Evaluates to True

\`\`\`
OR(
  ISBLANK({!$Record__Prior.Id}),
  …
)
\`\`\`

\`$Record__Prior.Id\` is blank only on a **create**, so the first branch means "always run for a
new contact". The remaining branches cover the phone and status fields, so an update only
re-runs the flow when one of them actually changed.

**When to Run the Flow for Updated Records** is set to *Every time a record is updated and meets
the condition requirements*.

:::note
The original build document shows this formula truncated in a screenshot, so only the first
branch is legible there. Read the live flow before changing it.
:::

## What it does, in order

### 1. Assigning Status Values To Variables

An Assignment that copies the six statuses into variables:

| Variable | Set to |
|---|---|
| \`Phone1_Status_Var\` | Triggering Contact → Phone Status |
| \`Phone2_Status_Var\` | Triggering Contact → Phone 2 Status |
| \`Phone3_Status_Var\` | Triggering Contact → Phone 3 Status |
| \`Phone4_Status_Var\` | Triggering Contact → Phone 4 Status |
| \`Phone5_Status_Var\` | Triggering Contact → Phone 5 Status |
| \`Mobile_Status_Var\` | Triggering Contact → Mobile Status |

### 2. Assigning Best Status Value To Var

| Variable | Set to |
|---|---|
| \`Best_Status_Var\` | \`Getting_Best_Status\` |

\`Getting_Best_Status\` is a formula resource that works out which of the six statuses is the
best one. **Its definition is not in the original build document** — open the flow to read it.
It is the only piece of judgement in the whole flow; everything after it is mechanical.

### 3. Comparing Values For Best Phone

A Decision with seven outcomes, evaluated **in this order**:

| Order | Outcome | Condition |
|---|---|---|
| 1 | Is Phone_1 has Best Status | \`Phone1_Status_Var\` equals \`Best_Status_Var\` |
| 2 | Is Phone_2 has Best Status | \`Phone2_Status_Var\` equals \`Best_Status_Var\` |
| 3 | Is Phone_3 has Best Status | \`Phone3_Status_Var\` equals \`Best_Status_Var\` |
| 4 | Is Phone_4 has Best Status | \`Phone4_Status_Var\` equals \`Best_Status_Var\` |
| 5 | Is Phone_5 has Best Status | \`Phone5_Status_Var\` equals \`Best_Status_Var\` |
| 6 | Is Mobile has Best Status | \`Mobile_Status_Var\` equals \`Best_Status_Var\` |
| 7 | **Default Outcome** | No conditions |

**Order is the tie-break.** When two numbers share the best status, the first matching outcome
wins — so Phone beats Phone 2, which beats Mobile. If you want a different preference, reorder
the outcomes; there is nothing else deciding it.

### 4. One Update Records element per outcome

Each is an Update Records on **the contact record that triggered the flow**, with Condition
Requirements set to **None — Always Update Record**:

| Element | Best Phone Status | Best Phone |
|---|---|---|
| Update Lead Record For Phone_1_c | \`Best_Status_Var\` | Triggering Contact → Business Phone |
| Update Lead Record For Phone_2_c | \`Best_Status_Var\` | Triggering Contact → Phone 2 |
| Update Lead Record For Phone_3_c | \`Best_Status_Var\` | Triggering Contact → Phone 3 |
| Update Lead Record For Phone_4_c | \`Best_Status_Var\` | Triggering Contact → Phone 4 |
| Update Lead Record For Phone_5_c | \`Best_Status_Var\` | Triggering Contact → Phone 5 |
| Update Lead Record For Mobile | \`Best_Status_Var\` | Triggering Contact → Mobile Phone |
| **Default Update** | \`Best_Status_Var\` | **Blank Value (empty string)** |

Each path then ends.

## The default path is doing real work

When no status matches the best one, **Best Phone is cleared** — set to an empty string — while
Best Phone Status is still written.

That is deliberate, and it is what keeps the reports honest: a contact with no usable number
reports as having no best phone, rather than keeping a stale number from a previous run.

## Two naming quirks

**"Update Lead Record For …"** — these elements act on **Contact**, not Lead. The names are a
leftover. Do not read them as evidence that Leads are involved.

**"Phone_1_c"** — there is no \`Phone_1__c\` field. Outcome 1 is about the standard **Phone**
field, which the update element calls *Business Phone*. The numbering in the flow runs 1–5 while
the fields run Phone, Phone 2, Phone 3, Phone 4, Phone 5.

## What depends on this

| Depends on it | How |
|---|---|
| The Contact layout | Shows Best Phone and Best Phone Status at the top |
| Most P1 Tracker reports | Filter on **Best Phone Status contains P1** |
| The dialler | Calls the best number |

If Best Phone looks wrong across many contacts at once, check the flow is still **Active** before
looking anywhere else.

## What goes wrong

| Symptom | Cause |
|---|---|
| Best Phone empty on everybody | The flow is deactivated, or \`Getting_Best_Status\` returns nothing. |
| Best Phone stale after a number changed | The entry condition did not match. Check it covers that field. |
| The wrong number is chosen between two equals | Outcome order. Reorder the Decision. |
| Reports count fewer P1s than expected | Best Phone Status is the filter; check it is being written. |

## Where this fits

The fields are in [Custom fields](../fields/custom.md). The reports that read Best Phone Status
are in [the P1 Tracker reports](../reports/p1-tracker.md).
`;

f["standard-build/reference/bucket-statuses.md"] = `---
title: Statuses and call results
sidebar_position: 0
---

# Statuses and call results

The two vocabularies the whole build is written in. Almost every report is a filter on one of
them.

## Bucket Status {#bucket-status}

\`Bucket_Status__c\` on Contact — where a person has got to. Nineteen values, read back from the
org:

| Value | Roughly means |
|---|---|
| **P1** | Top priority to call |
| **P2** | Second priority |
| **P3** | Third priority |
| **Priority** | Being actively worked |
| **Needs Attention** | Something is wrong — bad data, or a decision needed |
| **Nurture** | Keep warm, not now |
| **Activated Lead** | Has engaged |
| **Meeting Scheduled** | A meeting is booked |
| **No Show / Rescheduling** | Booked, did not attend |
| **Unscheduled Intro Complete** | An intro happened without a booked meeting |
| **Meeting Held** | The meeting happened |
| **Meeting Held - Not Qualified** | Happened, not a fit |
| **Opportunity** | Progressed to an opportunity |
| **Stalled / Lost** | Went nowhere |
| **Not In Swimlane** | Out of scope for this campaign |
| **DNC** | Do not call |
| **On Hold** | Paused |
| **Bad Title** | Wrong kind of person |
| **ReActivate** | Worth picking up again |

### The groupings that matter

Several reports treat these values as sets rather than individually:

| Set | Values | Used by |
|---|---|---|
| **Priority-ish** | Priority | [Priority templates and tiles](../reports/p1-tracker.md) |
| **Activated** | Activated Lead, Meeting Scheduled, Unscheduled Intro Complete | "P1's with Activated Bucket Status" |
| **Parked** | Nurture, Not In Swimlane, DNC | "Nurture, DNC, Not in Swim by Contact Campaign" |
| **Problem** | Needs Attention | "All Needs Attention", "Needs Attention Contacts" |

## Call results {#call-results}

The standard activity field **Call Result** (\`CallDisposition\`), set by the caller. Every
counted figure on every dashboard is a formula over this field — see
[the formula columns](../reports/formulas.md).

The values the formulas test for:

| Value | Counted as |
|---|---|
| No Answer / Not Available | A dial, not a connect |
| Left Voicemail | A connect attempt |
| Call Failed | A connect attempt |
| Callback - Hangup | A connect attempt |
| Needs Attention | A connect, and bad data |
| Connect - Incomplete | A connect that did not complete |
| Meeting Scheduled | A completion, and an activation |
| Activated Lead | A completion, and an activation |
| Unscheduled Intro | A completion, and an activation |
| Follow Up | A completion |
| Not Now | A completion |
| Not Me | A completion |
| Referred | A completion |
| Not Interested | A completion |
| Nurture | A completion |
| Not In Swimlane | A completion |
| No Longer With Company | Bad data |
| DNC | A completion |

:::note
Call Result is a **text** field, not a picklist, so these values are a convention rather than
something Salesforce enforces. A typo produces a call that no formula counts — which is exactly
why the **Bad Data** report exists. See [Bad Data](../reports/calculation.md#bad-data).
:::

## Phone statuses

\`Best_Phone_Status__c\` and the per-number statuses hold a score, typically \`p1\`, \`p2\` or
\`p3\`. Reports filter with **contains**, not equals — \`Best Phone Status contains P1\` — because
the field can hold more than the bare score.

**Best Phone Status equals ""** means no usable number at all, and is how
[All Scorable](../reports/p1-tracker.md) finds contacts that still need enriching.

## Other picklists

| Field | Values |
|---|---|
| \`Contact_Owner_Rep__c\` | Ryan, Ronen |
| \`Role__c\` | Executive Leadership, Sales Leadership, Sales Development Leadership, Marketing Leadership, Sales Enablement Leader, Rep, Other, Not In Swimlane |
| \`Role_Tier__c\` | Tier 1, Tier 2, Tier 3 |

## Where this fits

The fields themselves are in [Custom fields](../fields/custom.md). What the reports do with them
is [Reports](../reports/index.md).
`;

f["standard-build/reference/checklist.md"] = `---
title: Rebuild checklist
sidebar_position: 1
---

# Rebuild checklist

Building this in a fresh org, in an order where nothing depends on something that does not exist
yet.

## 1. Fields

- [ ] Create the four extra phone fields — \`Phone_2__c\` … \`Phone_5__c\`
- [ ] Create the six status fields — \`Phone_Status__c\`, \`Phone_2_Status__c\` … \`Phone_5_Status__c\`, \`Mobile_Status__c\`
- [ ] Create \`Best_Phone__c\` (Phone) and \`Best_Phone_Status__c\` (Text 255)
- [ ] Check those two have **different** API names — the original document gives them the same one
- [ ] Create \`Bucket_Status__c\` with [its nineteen values](./bucket-statuses.md#bucket-status)
- [ ] Create \`Follow_Up_Date__c\`, \`BDR__c\`, \`Contact_Owner_Rep__c\`
- [ ] Create \`Campaign_List_Name__c\`
- [ ] Create \`Website__c\`, \`LinkedIn_URL__c\`, \`Company_LinkedIn_URL__c\`, \`Call_Recording__c\`
- [ ] Create \`Validator_Notes__c\` and \`Custom_1__c\` … \`Custom_6__c\`
- [ ] Set field-level security so callers can read and edit them

## 2. Activity fields

- [ ] Add \`Source_Phone__c\` and \`Target_Phone__c\` to Task
- [ ] Add the call-recording field to Task
- [ ] Confirm **Call Result** is populated by whatever logs the calls

## 3. Layouts

- [ ] Put Best Phone and Best Phone Status directly under Title on Contact
- [ ] Add a **Buckets** section holding the statuses, the other numbers and Custom 1–6
- [ ] Add Source Phone, Target Phone and the recording to the Task layout
- [ ] Leave the enrichment-vendor fields off both

## 4. The flow

- [ ] Build \`Getting_Best_Status\` first — nothing else works without it
- [ ] Create the flow as **record-triggered, before save**, on Contact, created **or** updated
- [ ] Optimise for **Fast Field Updates**
- [ ] Add the two Assignments, then the Decision with its **seven outcomes in order**
- [ ] Add the seven Update Records elements, including the **Default** that blanks Best Phone
- [ ] Activate it, then save a contact and confirm Best Phone fills in
- [ ] Full detail: [The Best Phone flow](../automation/best-phone.md)

## 5. Folders

- [ ] Create **Buckets Reports**, **Buckets Dashboard** and **List Templates for Frontspin Playbooks**
- [ ] Decide who can see each — [Folders](../reports/folders.md)

## 6. Reports

- [ ] Build the [calculation reports](../reports/calculation.md) first; the dashboards need them
- [ ] Add each report's [formula columns](../reports/formulas.md) — a tile is a formula, not a count
- [ ] Build the [everyday reports](../reports/everyday.md)
- [ ] Build the [templates](../reports/templates.md)
- [ ] Build the [P1 Tracker reports](../reports/p1-tracker.md)
- [ ] Keep the **DO NOT TOUCH** suffix on anything a dashboard reads

## 7. Dashboards

- [ ] [Calling Dashboard](../dashboards/calling.md)
- [ ] [Calling Dashboard V2](../dashboards/calling-v2.md)
- [ ] [P1 Tracker](../dashboards/p1-tracker.md)
- [ ] Set each dashboard's filters, and check which object each filter comes from
- [ ] Set **View Dashboard As** deliberately

## 8. Check it

- [ ] Save a contact with several numbers; the right one lands in Best Phone
- [ ] Log a call with each Call Result; it lands in the right calculation report
- [ ] A dashboard tile moves when the underlying report does
- [ ] A template report returns the people you expect before anyone maps it to a FrontSpin list

## Before you let anyone use it

- [ ] Everyone knows **DO NOT TOUCH** means the dashboards break if you edit it
- [ ] Everyone knows [Call Result is free text](./bucket-statuses.md#call-results), so spelling matters
- [ ] Somebody owns the **Bad Data** report and actually reads it
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
