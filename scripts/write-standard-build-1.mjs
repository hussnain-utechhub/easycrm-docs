/* Standard Build, part 1: the tab, the overview, the fields and the page layouts. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};
const cat = {
  "standard-build": { label: "Standard Build", position: 5, collapsed: true },
  "standard-build/fields": { label: "Fields", position: 1, collapsed: true },
  "standard-build/layouts": { label: "Page layouts", position: 2, collapsed: true },
};

f["standard-build/index.md"] = `---
title: The standard build
sidebar_position: 0
slug: /standard-build
---

# The standard build

## What this is

The Salesforce build that sits underneath an outbound calling operation: the fields a caller
needs on a Contact, the page layouts that show them, the reports that measure the calling, the
dashboards that put those reports on one screen, and the automation that keeps the best phone
number up to date.

It is written down so the next person does not have to work it out again — and so that a second
org can be built the same way without guesswork.

## What it covers

| Part | What it is |
|---|---|
| [Fields](./fields/index.md) | The Contact fields the whole build depends on |
| [Page layouts](./layouts/index.md) | What a caller sees on a Contact and on a Task |
| [Reports](./reports/index.md) | 44 reports, from everyday lists to the calculation engine |
| [Dashboards](./dashboards/index.md) | Three dashboards built from those reports |
| [Automation](./automation/best-phone.md) | The flow that keeps **Best Phone** correct |
| [Reference](./reference/bucket-statuses.md) | Bucket statuses, call results and a rebuild checklist |

## The shape of it

Everything rests on two ideas.

**A contact has many phone numbers and one best one.** Up to seven numbers are held, each with
its own status. A flow works out which is the best and copies it, with its status, into
**Best Phone** and **Best Phone Status**. Every report that talks about reaching people reads
those two fields rather than guessing.

**A contact has a bucket status.** One picklist describes where the person has got to — P1, P2,
P3, Priority, Nurture, Activated Lead, Meeting Scheduled, DNC and the rest. Most reports are a
filter on that field.

Calls themselves are Salesforce **Activities** (Tasks and Events), carrying a **Call Result**.
The calculation reports turn call results into counted outcomes with formula columns, and the
dashboards read those.

## This is not part of EasyCRM

Like the [FrontSpin integration](../frontspin/index.md), this is a build inside one customer's
Salesforce org — fields, reports, dashboards and a flow — not a feature of the EasyCRM package.
Installing EasyCRM does not create any of it.

It is documented here because the portal reports on the same data, and because the
[FrontSpin lists](../frontspin/lists/report-to-list.md) are filled from these reports.

## Where to start

| If you want to | Read |
|---|---|
| Understand the data model | [Fields](./fields/index.md) |
| Build this in a new org | [The rebuild checklist](./reference/checklist.md) |
| Know what a report counts | [The calculation reports](./reports/calculation.md) |
| Change a dashboard | [Dashboards](./dashboards/index.md) |
| Know why Best Phone is what it is | [The Best Phone flow](./automation/best-phone.md) |

## A note on accuracy

The field API names, picklist values and report definitions on these pages were **read back from
a live org**, not copied from the original build document. Where the two disagree, the org wins
and the difference is called out — see
[the corrections](./fields/custom.md#where-the-original-document-is-wrong).
`;

/* ------------------------------------------------------------------- fields */
f["standard-build/fields/index.md"] = `---
title: About the fields
sidebar_position: 0
---

# Fields on Contact

## What they are for

Every custom field in this build exists to serve a **report** or the
[Best Phone flow](../automation/best-phone.md). There are no decorative fields: if something is
here, something downstream reads it.

| Group | Fields | Used by |
|---|---|---|
| **Phone numbers** | Phone, Mobile, Phone 2–5, Best Phone | The dialler, and every "can we reach them" report |
| **Phone statuses** | A status beside each number, plus Best Phone Status | Scoring which number is worth calling |
| **Where they have got to** | Bucket Status, Follow Up Date | Almost every report |
| **Who owns the work** | BDR, Contact Owner (Rep) | Grouping by rep |
| **Where they came from** | Campaign // List Name | Grouping by list |
| **Research** | Website, LinkedIn URL, Company LinkedIn URL, Validator Notes, Custom 1–6 | Context for the caller |
| **Evidence** | Call Recording | Checking a call |

## The two pages

| Page | Covers |
|---|---|
| [Standard fields](./standard.md) | The Salesforce fields the build uses as they come |
| [Custom fields](./custom.md) | The fields created for this build |

## How a field gets added

**Where:** **Setup** → **Object Manager** → **Contact** → **Fields & Relationships** → **New**

1. Click the gear, top right, then **Setup**.
2. Click **Object Manager** in the top bar.
3. Click **Contact**.
4. Click **Fields & Relationships** in the left menu.
5. Click **New**, top right.
6. Choose the data type, click **Next**.
7. Give it a **Field Label**; the **Field Name** fills itself in and becomes the API name.
8. Set field-level security, choose the layouts it should appear on, and **Save**.

:::note
The original build document gives these steps as **Settings → Properties → Create Property**.
That is HubSpot's wording, not Salesforce's, and it does not match any screen in this org. The
steps above are the Salesforce ones.
:::

## Two rules worth keeping

**The API name is the contract.** Reports, the flow and the FrontSpin field mappings all refer
to a field by its API name. Renaming a field's *label* is free; changing its **Field Name** is
not, and breaks everything pointing at it.

**A status always sits beside its number.** Phone 2 has Phone 2 Status, Mobile has Mobile
Status. The flow depends on that pairing — see
[the Best Phone flow](../automation/best-phone.md).
`;

f["standard-build/fields/standard.md"] = `---
title: Standard fields
sidebar_position: 1
---

# Standard fields

These come with Salesforce. The build uses them as they are — nothing here was created.

| Field | Data type | API name |
|---|---|---|
| Name | Name | \`Name\` |
| Reports To | Lookup (Contact) | \`ReportsToId\` |
| Account Name | Lookup (Account) | \`AccountId\` |
| Title | Text (128) | \`Title\` |
| Lead Source | Picklist | \`LeadSource\` |
| Email | Email | \`Email\` |
| Phone | Phone | \`Phone\` |
| Mobile | Phone | \`MobilePhone\` |
| Mailing Address | Address | \`MailingAddress\` |
| Created By | Lookup (User) | \`CreatedById\` |

## Why these in particular

| Field | Why the build needs it |
|---|---|
| **Account Name** | Every contact report groups or reports by account |
| **Title** | Drives the role tiering a caller works from |
| **Phone** and **Mobile** | Two of the seven numbers the [Best Phone flow](../automation/best-phone.md) chooses between |
| **Email** | Carried into FrontSpin, which requires one |
| **Created By** | Used to tell imported contacts apart from ones created in the org |

## On the calling side

Calls are Salesforce **Activities** — Tasks and Events. Reports about calling are built on the
**Activities with Contacts** report type and read:

| Field | Holds |
|---|---|
| **Call Result** | The outcome the caller chose. Every calculation formula reads this. |
| **Subject** | What the activity was |
| **Date** | When |
| **Full Comments** | The caller's notes |

**Call Result is the single most important field in the whole build.** Every counted number on
every dashboard is a formula over it. Its values are listed in
[Call results](../reference/bucket-statuses.md#call-results).

## A caution about renaming

These are standard fields, so their API names cannot change — which is exactly why reports built
on them are safe. The custom fields are where a rename can quietly break things; see
[Custom fields](./custom.md).
`;

f["standard-build/fields/custom.md"] = `---
title: Custom fields
sidebar_position: 2
---

# Custom fields

Created for this build, on **Contact**. Every one is read by a report, by the
[Best Phone flow](../automation/best-phone.md), or by both.

## The phone set

Seven numbers, each with a status, plus the chosen best one.

| Field | Type | API name |
|---|---|---|
| Phone 2 | Phone | \`Phone_2__c\` |
| Phone 3 | Phone | \`Phone_3__c\` |
| Phone 4 | Phone | \`Phone_4__c\` |
| Phone 5 | Phone | \`Phone_5__c\` |
| Phone Status | Text (255) | \`Phone_Status__c\` |
| Phone 2 Status | Text (255) | \`Phone_2_Status__c\` |
| Phone 3 Status | Text (255) | \`Phone_3_Status__c\` |
| Phone 4 Status | Text (255) | \`Phone_4_Status__c\` |
| Phone 5 Status | Text (255) | \`Phone_5_Status__c\` |
| Mobile Status | Text (255) | \`Mobile_Status__c\` |
| **Best Phone** | Phone | \`Best_Phone__c\` |
| **Best Phone Status** | Text (255) | \`Best_Phone_Status__c\` |

**Phone** and **Mobile** themselves are [standard fields](./standard.md); only their statuses are
custom. That is why the list above has five statuses but only four numbered phones.

A status holds a score such as \`p1\`, \`p2\` or \`p3\`. Reports filter on
**Best Phone Status contains P1** to mean "we have a good number for this person".

## Where they are in the process

| Field | Type | API name |
|---|---|---|
| Bucket Status | Picklist | \`Bucket_Status__c\` |
| Follow Up Date | Date | \`Follow_Up_Date__c\` |

Bucket Status is the spine of the build. Its nineteen values are listed in
[Bucket statuses](../reference/bucket-statuses.md).

## Who owns the work

| Field | Type | API name |
|---|---|---|
| BDR | Text (255) | \`BDR__c\` |
| Contact Owner (Rep) | Picklist | \`Contact_Owner_Rep__c\` |

**BDR** is used as a filter rather than a grouping — several templates filter on
\`BDR equals ""\` to mean "not yet claimed by anybody".

## Where the contact came from

| Field | Type | API name |
|---|---|---|
| Campaign // List Name | Text (255) | \`Campaign_List_Name__c\` |

The grouping behind "by campaign" and "by list" on every dashboard. The double slash in the
label is part of the name.

## Research and context

| Field | Type | API name |
|---|---|---|
| Website | URL | \`Website__c\` |
| LinkedIn URL | URL | \`LinkedIn_URL__c\` |
| Company LinkedIn URL | URL | \`Company_LinkedIn_URL__c\` |
| Validator Notes | Long Text Area (131,072) | \`Validator_Notes__c\` |
| Custom 1 | Long Text Area (131,072) | \`Custom_1__c\` |
| Custom 2 | Long Text Area (131,072) | \`Custom_2__c\` |
| Custom 3 | Long Text Area (131,072) | \`Custom_3__c\` |
| Custom 4 | Long Text Area (131,072) | \`Custom_4__c\` |
| Custom 5 | Long Text Area (131,072) | \`Custom_5__c\` |
| Custom 6 | Long Text Area (131,072) | \`Custom_6__c\` |

**Custom 1–6** are deliberately unnamed. They carry whatever a particular list needs, so a new
campaign does not require a new field each time. The cost is that nobody can tell what is in one
without asking — so write it down in Validator Notes, or name the field properly if it becomes
permanent.

## Evidence

| Field | Type | API name |
|---|---|---|
| Call Recording | URL | \`Call_Recording__c\` |

## Where the original document is wrong {#where-the-original-document-is-wrong}

Every API name above was read back from a live org. Five entries in the original build document
do not match what is actually there, and all five would break a report or a formula if copied
out of it:

| Field | The document says | Actually |
|---|---|---|
| Best Phone Status | \`Best_Phone__c\` | \`Best_Phone_Status__c\` |
| LinkedIn URL | \`LinedIn_URL__c\` | \`LinkedIn_URL__c\` |
| Follow Up Date | \`Follow_Up_Date\` | \`Follow_Up_Date__c\` |
| Campaign // List Name | \`Campaign_List_Name_c\` | \`Campaign_List_Name__c\` |
| Mobile / Created By | Data type and API name columns swapped | See [Standard fields](./standard.md) |

The first is the dangerous one: the document gives **Best Phone** and **Best Phone Status** the
same API name, so anyone building from it would wire the status to the number.

:::note
**Custom 6** appears on the page layout in the original document, but only \`Custom_1__c\` to
\`Custom_5__c\` were present in the org checked. Confirm which you have before relying on it.
:::

## There are far more fields than these

The org carries well over a hundred custom fields on Contact — enrichment-vendor numbers,
FrontSpin sync fields, recruiting fields and more. The list above is the subset **this build**
uses, which is what the original document set out to record.
`;

/* ------------------------------------------------------------------ layouts */
f["standard-build/layouts/index.md"] = `---
title: Page layouts
sidebar_position: 0
---

# Page layouts

Two layouts matter: what a caller sees on a **Contact**, and what they see on a **Task**.

## The Contact layout

**Where:** **Setup** → **Object Manager** → **Contact** → **Page Layouts**

It is arranged so the things a caller needs mid-call are at the top and the research sits below.

### About

![The Contact layout, About section](../../img/shots/standard-build/contact-layout-about.png)

| Field | Why it is this high |
|---|---|
| Name, Account Name, Title | Who am I speaking to, and where |
| Reports To | Who they answer to |
| **Best Phone** / **Best Phone Status** | The number to try, and how good it is |
| Lead Source, Contact Owner (Rep) | Where they came from, whose they are |
| Website, Email, LinkedIn URL, Company LinkedIn URL | Opening the research in one click |

**Best Phone and Best Phone Status sit directly under Title**, before anything else. That is the
whole point of the [flow](../automation/best-phone.md) — the caller should not have to compare
seven numbers.

### Additional Fields, and the Buckets section

![The Contact layout, Buckets section](../../img/shots/standard-build/contact-layout-buckets.png)

Collapsed by default, holding everything that is not needed at the moment of dialling:

| Section | Holds |
|---|---|
| **Buckets** | Bucket Status, Follow Up Date, BDR, Validator Notes |
| | Mobile and Mobile Status |
| | Phone and Phone Status, Phone 2–5 and their statuses |
| | Call Recording, Campaign // List Name |
| | Custom 1–6 |
| **Get in Touch** | Mailing Address, with a map |
| **History** | Created By, FS Last Modified By |

All seven numbers and their statuses live here, not on the main panel, because the caller is
meant to read **Best Phone** instead.

### The left and right columns

| Column | Holds |
|---|---|
| Left | The activity timeline — every call, email, task and event, newest first |
| Right | Opportunities, Cases and Files |

The timeline on the left is what makes the record readable: it is the record of what has already
been tried.

## The Task layout

**Where:** **Setup** → **Object Manager** → **Task** → **Page Layouts**

![The Task layout](../../img/shots/standard-build/task-layout.png)

| Section | Fields |
|---|---|
| **Task Information** | Subject, Assigned To, Name, Task Subtype, Due Date, Related To |
| | **FS Call Recording**, **Source Phone**, **Target Phone**, Comments |
| **Additional Information** | Priority, Status |
| **Other Information** | Reminder Set, Create Recurring Series of Tasks |
| **System Information** | Created By, Last Modified By |

**Source Phone** and **Target Phone** are the custom part: they record which number was dialled
*from* and *to*. Without them a call is just an activity; with them you can tell which of the
seven numbers actually worked.

**FS Call Recording** links to the recording in FrontSpin.

## What is deliberately not on these layouts

The enrichment-vendor fields — the various supplier phone numbers and their statuses — are not
shown. They feed the Best Phone calculation and are not something a caller should read directly.

## Where this fits

The fields themselves are in [Custom fields](../fields/custom.md). What fills **Best Phone** is
[the flow](../automation/best-phone.md).
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
