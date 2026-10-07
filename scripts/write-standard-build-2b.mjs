/* Standard Build, part 2b: the everyday reports, the calculation reports, the formula columns
   and the list templates. Definitions read back from the org, not transcribed from screenshots. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

const CONTACT_COLS = `Bucket Status · Call Recording · BDR · Account Name · Website (account) ·
Company LinkedIn URL (account) · First Name · Last Name · Title · Email · LinkedIn URL ·
Company LinkedIn URL · Website · **Best Phone** · **Best Phone Status** · Mobile · Mobile Status ·
Phone · Phone Status · Phone 2–5 and their statuses · Campaign // List Name · Contact ID`;

f["standard-build/reports/everyday.md"] = `---
title: The everyday reports
sidebar_position: 1
---

# The everyday reports

Six reports in the **Buckets Reports** folder. These are the ones a person opens and reads, and
they are safe to change.

## Today's Completions {#todays-completions}

**Did we complete anything today, and with whom?**

| | |
|---|---|
| Report type | Activities with Contacts |
| Format | Tabular |
| Date | **Today** |
| Filter | Call Result **contains** Meeting Scheduled, Activated Lead, Not Now, Not Me, Referred, Not Interested, Not In Swimlane |

Plus the standard activity filters: all activities, **completed** only, tasks and events.

**Columns:** FS Created By · FS Last Call Date/Time · Account Name · Website · First Name ·
Last Name · Title · Bucket Status · Call Result · Follow Up Date · Full Comments ·
FS Call Recording · Call Duration (minutes) · BDR · Best Phone · Best Phone Status ·
LinkedIn URL · Email · Campaign // List Name · Contact ID

The org also carries **Mismatch**, **Bucket Status AI**, **Call Result AI**,
**Follow Up Date AI** and **BDR AI** on this report. Those came after the original build document
was written and are not described in it.

## This Months Completions {#this-months-completions}

The same report over a wider window.

| | |
|---|---|
| Report type | Activities with Contacts |
| Format | Tabular |
| Date | **This Month** |
| Filter | Identical to Today's Completions |

**Columns** are the same, minus the AI columns and Call Duration, and it uses the Contact's
**Call Recording** rather than the activity's FS Call Recording.

## This Months Meetings Scheduled {#this-months-meetings-scheduled}

| | |
|---|---|
| Report type | Activities with Contacts |
| Format | **Summary**, grouped by **FS Created By** |
| Date | This Month |
| Filter | Call Result **contains** Meeting Scheduled |

Grouping by FS Created By turns it into "meetings booked per rep this month", which is what makes
it a summary rather than a list.

## This Months Activated Leads {#this-months-activated-leads}

Identical in shape to the above, with **Call Result contains Activated Lead**.

## All Meetings & Activated Leads {#all-meetings--activated-leads}

**Everyone currently at or past a meeting**, regardless of when the call happened.

| | |
|---|---|
| Report type | **Contacts & Accounts** |
| Format | Tabular |
| Date | Created Date — all time |
| Filter | Bucket Status **equals** Activated Lead, Meeting Scheduled, No Show / Rescheduling, Meeting Held, Unscheduled Intro Complete |

This is a **people** report, not a calling report — which is why it is built on Contacts &
Accounts and filters on Bucket Status rather than Call Result. One row per person, not per call.

**Columns:** ${CONTACT_COLS} · plus Follow Up Date.

All seven phone numbers and statuses are included deliberately: this list gets worked by hand,
and the caller wants every number.

## Needs Attention Contacts {#needs-attention-contacts}

| | |
|---|---|
| Report type | Contacts & Accounts |
| Format | Tabular |
| Date | Created Date — all time |
| Filter | Bucket Status **equals** Needs Attention |

The data-quality queue: contacts somebody flagged as wrong, unreachable or undecidable.

**Columns:** the same contact set as above, without Follow Up Date.

**Somebody should own this report.** Needs Attention is where records go to be fixed, and
nothing fixes them automatically.

## Reading these reports

| Watch for | Because |
|---|---|
| A completions report that looks short | **Completed Activities** is a standard filter. An open task is not a completed call. |
| Numbers that disagree with a dashboard | The dashboards read the [calculation reports](./calculation.md), not these. |
| A blank Call Result | It is free text. See [Call results](../reference/bucket-statuses.md#call-results). |

## Where this fits

The folder is [Buckets Reports](./folders.md#buckets-reports). The reports that feed the
dashboards are [the calculation reports](./calculation.md).
`;

f["standard-build/reports/calculation.md"] = `---
title: The calculation reports
sidebar_position: 2
---

# The calculation reports

Eleven reports in **Buckets Dashboard**, every one marked **DO NOT TOUCH**. They exist only to be
read by a dashboard tile.

## What they have in common

Nine of the eleven are **matrix** reports on **Activities with Contacts** with the same shape:

| | |
|---|---|
| **Rows** | FS Created By, then Call Result |
| **Columns** | Date, then Status |
| **Detail columns** | Subject, First Name, Last Name, and **one formula column** |
| **Standard filters** | All activities · Completed Activities · Tasks and Events |
| **Date** | Custom — set from the dashboard, not the report |

The formula column is the point. The record count is never what a tile shows; the **sum of a
1-or-0 formula** is. Every one is written out in [Formula columns](./formulas.md).

## Rep Totals Dials {#rep-totals-dials}

**Every call attempt.** The denominator for everything else.

| | |
|---|---|
| Formula column | **Rep Attempts** — 1 for any recognised call result |
| Summary formula | **Total Dials** = \`RowCount\` |

:::warning
In the org checked, this report also carries a filter **First Name equals Chris**. That is not in
the original build document and looks like a leftover from testing — it would reduce Total Dials
to calls made to contacts with that first name, and every percentage built on it with them.
**Check this filter before trusting the dial figures.**
:::

## Connects {#connects}

**Calls where a human was reached.**

| | |
|---|---|
| Filter | Subject **contains** Call |
| Columns grouping | Date, then **Bucket Status** (not Status — this one is different) |
| Formula column | **Connects Counter** — 0 for the non-connect results, 1 for everything else |
| Summary formula | **D2C%** = Connects ÷ rows |

Connects Counter is written **inverted** — it lists what is *not* a connect and returns 1 for
everything else. That makes it the only formula here that counts a call result nobody thought of
as a connect. See [the defects](./formulas.md#known-defects).

## Connect Incomplete {#connect-incomplete}

**Reached somebody, did not finish the conversation.**

| | |
|---|---|
| Formula column | **Connect - Incomplete** — 1 when the result is Connect - Incomplete |
| Summary formula | **Connect - Incomplete %** |

## Completions {#completions}

**Calls that reached a conclusion.**

| | |
|---|---|
| Formula column | **Correct Completes** |
| Summary formula | **Correct Complete %** |

Counted as a completion: Meeting Scheduled, Activated Lead, Not Now, Not Me, Referred,
Not Interested, Not In Swimlane, Follow Up.

## Completions Breakdown {#completions-breakdown}

The same population **split by Call Result**, with no formula column — the chart is a record
count sliced by result.

| | |
|---|---|
| Rows | Call Result |
| Filter | Call Result equals Meeting Scheduled, Activated Lead, Not Now, Not Me, Referred, Not In Swimlane, Follow Up, Not Interested |

Feeds the donut on [Calling Dashboard V2](../dashboards/calling-v2.md).

## Activated {#activated}

**Calls that moved somebody forward.**

| | |
|---|---|
| Formula column | **Activated Connects** — Meeting Scheduled, Activated Lead, Follow Up, Unscheduled Intro |
| Summary formula | **Activated Connects %** |

## Meetings Scheduled {#meetings-scheduled}

| | |
|---|---|
| Formula column | **Meeting Scheduled Connects** — Meeting Scheduled, Unscheduled Intro |
| Summary formula | **Meeting Scheduled Connect %** |

## Bad Data {#bad-data}

**Calls that found the record was wrong.**

| | |
|---|---|
| Rows | Call Result (no rep grouping) |
| Formula column | **Bad Data** — Needs Attention, No Longer With Company |
| Summary formula | **Bad Data %** |

The one report here that measures the *data* rather than the calling. A rising Bad Data % means
the lists are decaying faster than they are being fixed.

## Activated Lead Table {#activated-lead-table}

| | |
|---|---|
| Format | **Tabular** |
| Filter | Call Result **equals** Activated Lead |
| Columns | Account Name, Title, Follow Up Date |

Three columns, because it is displayed as a table tile — not a number.

## Meetings Scheduled Table {#meetings-scheduled-table}

The same, with **Call Result equals Meeting Scheduled**.

## Activity by List {#activity-by-list}

**Which calling lists are actually being worked.**

| | |
|---|---|
| Format | **Summary** |
| Rows | Date, then **Campaign // List Name** |
| Filter | Subject **starts with** Call |
| Columns | FS Last List Name · Subject · First Name · Last Name · Account Name · Call Result · Call Result AI |

The only calculation report grouped by list rather than by rep, and the one that answers "is this
list being called at all?".

## Why "DO NOT TOUCH"

Changing a grouping, a column or a formula here changes a dashboard number **silently**. There is
no error and nothing turns red — the tile simply starts meaning something else.

If you need a variation, **clone the report** and point a new tile at the clone.

## Where this fits

The formulas are in [Formula columns](./formulas.md). What reads these is
[Calling Dashboard](../dashboards/calling.md) and
[Calling Dashboard V2](../dashboards/calling-v2.md).
`;

f["standard-build/reports/formulas.md"] = `---
title: Formula columns
sidebar_position: 3
---

# Formula columns

Every counted number on the calling dashboards is one of these. They are reproduced exactly as
they are in the org.

## The pattern

Two formulas per report:

1. A **row-level formula** that looks at one call's **Call Result** and returns **1 or 0**.
2. A **summary formula** that divides the sum of those 1s by the row count, giving a **percent**.

So a tile showing "Connects" is the *sum* of a row-level formula, and "Dial to Connect %" is the
summary formula over the same column.

## The CONTAINS idiom

Every row-level formula is written like this:

\`\`\`
IF(CONTAINS("'A':'B':'C'", CALLDISPOSITION), 1, 0)
\`\`\`

\`CONTAINS(text, compare_text)\` is true when **compare_text appears inside text**. So the call
result is being looked for inside a colon-separated list of the results that should count.

It reads backwards, and it has two consequences worth knowing:

- **A misspelling in the list silently stops matching.** The call still happens; it just stops
  being counted.
- **A blank Call Result matches every list**, because an empty string is contained in anything.
  The reports are protected from this by their filters, which exclude blank results — but a
  formula copied into a report *without* that filter will count every blank call.

## The formulas

### Rep Attempts — *Rep Totals Dials*

\`\`\`
IF(CONTAINS("'No Answer / Not Available':'Connect - Incomplete':'Meeting Scheduled':
'Activated Lead':'Not Now':'Not Me':'Referred':'Not Interested':'Nurture':'Not In Swimlane':
'No Longer With Company':'Left Voicemail':'Needs Attention':'Follow Up':'No Longer With Company':
'DNC':'Unscheduled Intro'", CALLDISPOSITION), 1, 0)
\`\`\`

Every recognised result counts as an attempt. \`No Longer With Company\` appears twice, harmlessly.

**Total Dials** (summary): \`RowCount\`

### Connects Counter — *Connects*

\`\`\`
IF(CONTAINS("'No Answer / Not Available':'Left Voicemail':'':'Needs Atttention':
'Call Failed': 'Callback - HangUp'", CALLDISPOSITION), 0, 1)
\`\`\`

**Inverted** — it lists what is *not* a connect and returns 1 for everything else.

**D2C%** (summary): \`CDF1:SUM/RowCount\`

### Connect - Incomplete — *Connect Incomplete*

\`\`\`
IF(CONTAINS("Connect - Incomplete", CALLDISPOSITION), 1, 0)
\`\`\`

**Connect - Incomplete %** (summary): \`CDF1:SUM/RowCount\`

### Correct Completes — *Completions*

\`\`\`
IF(CONTAINS("'Meeting Scheduled':'Activated Lead':'Not Now':'Not Me':'Referred':
'Not Interested':'Not In Swimlane':'Follow Up''", CALLDISPOSITION), 1, 0)
\`\`\`

**Correct Complete %** (summary): \`CDF1:SUM/RowCount\`

### Activated Connects — *Activated*

\`\`\`
IF(CONTAINS("'Meeting Scheduled':'Activated Lead':'Follow Up':'Unscheduled Intro'",
CALLDISPOSITION), 1, 0)
\`\`\`

**Activated Connects %** (summary): \`CDF1:SUM/RowCount\`

### Meeting Scheduled Connects — *Meetings Scheduled*

\`\`\`
IF(CONTAINS("'Meeting Scheduled':'Unscheduled Intro'", CALLDISPOSITION), 1, 0)
\`\`\`

**Meeting Scheduled Connect %** (summary): \`CDF1:SUM/RowCount\`

### Bad Data — *Bad Data*

\`\`\`
IF(CONTAINS("'Needs Attention': 'No Longer With Company'", CALLDISPOSITION), 1, 0)
\`\`\`

**Bad Data %** (summary): \`CDF1:SUM/RowCount\`

### Days Since Follow Up Date — *Priority's - Days Since Follow Up Date*

A text formula that buckets a date into bands, used as a **grouping**:

\`\`\`
IF(
  ISBLANK(Contact.Follow_Up_Date__c),
  "No Date Set",
  IF(
    Contact.Follow_Up_Date__c > TODAY(),
    "Future",
    IF( TODAY() - Contact.Follow_Up_Date__c <= 7,  "0-7 days",
    IF( TODAY() - Contact.Follow_Up_Date__c <= 14, "8-14 days",
    IF( TODAY() - Contact.Follow_Up_Date__c <= 21, "15-21 days",
    IF( TODAY() - Contact.Follow_Up_Date__c <= 28, "22-28 days",
        "29+ days" ))))))
\`\`\`

Bucketing into bands is what lets it be grouped on — you cannot group a report by a raw date
difference.

### Days Since Follow-Up Date — *Priority's - Total Call Attempts*

A numeric version of the same idea, used as a **filter**:

\`\`\`
TODAY() - (Contact.Follow_Up_Date__c)
\`\`\`

Filtered to **greater or equal 0**, which means "due today or overdue".

## Known defects {#known-defects}

These are in the live formulas. They are reproduced above exactly as they are, so that the pages
match the org — but they are worth fixing.

| Formula | Problem | Effect |
|---|---|---|
| Connects Counter | \`'Needs Atttention'\` — three t's | Real **Needs Attention** calls are not in the exclusion list, so they count **as connects** |
| Connects Counter | \`'Callback - HangUp'\` | If the real value is \`Callback - Hangup\`, the casing still matches (CONTAINS is case-insensitive), but it is inconsistent with everything else |
| Connects Counter | a stray empty \`''\` entry | Harmless here, but it makes the list hard to read |
| Correct Completes | \`'Follow Up''\` — a doubled quote | The trailing quote is inside the string, so **Follow Up still matches**; it is untidy rather than broken |
| Rep Attempts | \`'No Longer With Company'\` listed twice | Harmless |

The first one is the one that changes a number. Everything else is cosmetic.

:::note
Fixing a formula changes every historical figure the tile has ever shown, because the dashboards
recalculate from the underlying activities each time. Decide whether you want the correction
before changing it.
:::

## Where this fits

The reports these live in are [the calculation reports](./calculation.md). What displays them is
[Dashboards](../dashboards/index.md).
`;

f["standard-build/reports/templates.md"] = `---
title: The list templates
sidebar_position: 4
---

# The list templates

Six reports in **List Templates for Frontspin Playbooks**. Each is a pattern for a calling list.

## How they are meant to be used

**Clone one, narrow it, map the clone.** They are not run as they stand — a template returns
every P1 in the org, which is not a calling list.

1. Open the template.
2. **Save As** with a name describing the campaign.
3. Add whatever narrows it — a campaign, an account list, a region.
4. Map the clone to a FrontSpin list in
   [List Mappings](../../frontspin/portal/list-mappings.md).

:::warning
Check what the clone returns **before** mapping it. Nothing can take somebody off a FrontSpin
calling list once they have been added — see [Lists](../../frontspin/lists/index.md).
:::

## What they share

| | |
|---|---|
| Report type | Contacts & Accounts |
| Format | **Tabular** — which is what FrontSpin requires |
| Date | Created Date, all time |
| Columns | 27: the full contact set, including all seven numbers and their statuses |

**Tabular is not optional.** FrontSpin cannot read a Summary or Matrix report, so a template that
gets grouped stops being usable as a list source.

## The priority templates

### P1 Contacts (Template) {#p1-contacts}

| Filter | |
|---|---|
| Bucket Status | equals **P1** |
| Account → Outbound Suppression | equals **False** |

The only template with a **suppression** check. It excludes accounts marked as not to be
contacted — which is the kind of thing that should be on all of them and is on this one.

### P2 Contacts (Template) {#p2-contacts}

| Filter | |
|---|---|
| Bucket Status | equals **P2** |

### P3 Contacts (Template) {#p3-contacts}

| Filter | |
|---|---|
| Bucket Status | equals **P3** |

## The follow-up templates

All three share the same three-filter shape: a bucket status, a due follow-up, and **no BDR yet**.

### Priority Follow Ups (Template) {#priority-follow-ups}

| Filter | |
|---|---|
| Bucket Status | equals **Priority** |
| Follow Up Date | **less or equal TODAY** |
| BDR | equals *(blank)* |

### Activated Follow Ups (Template) {#activated-follow-ups}

| Filter | |
|---|---|
| Bucket Status | equals **Activated Lead** |
| Follow Up Date | less or equal TODAY |
| BDR | equals *(blank)* |

### No Shows Follow Ups (Template) {#no-shows-follow-ups}

| Filter | |
|---|---|
| Bucket Status | equals **No Show / Rescheduling** |
| Follow Up Date | less or equal TODAY |
| BDR | equals *(blank)* |

## The two filters that do the work

**Follow Up Date less or equal TODAY** means *due or overdue*. Something with a future date is
deliberately not in the list yet.

**BDR equals blank** means *nobody has claimed this*. It is what stops two reps calling the same
person: once a BDR is stamped on the contact, it drops out of every follow-up template.

That makes **BDR a claim, not a label**. Clearing it puts somebody back in the queue; filling it
takes them out.

## Where this fits

The folder is [List Templates](./folders.md#list-templates-for-frontspin-playbooks). What
consumes them is [Report to List](../../frontspin/lists/report-to-list.md).
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Wrote ${n} pages.`);
