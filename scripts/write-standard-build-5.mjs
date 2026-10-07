/* Standard Build, part 5: the twenty-one P1 Tracker reports. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

f["standard-build/reports/p1-tracker.md"] = `---
title: The P1 Tracker reports
sidebar_position: 6
---

# The P1 Tracker reports

Twenty-one reports in the **P1 Tracker Dashboard** folder, all built on **Contacts & Accounts**.
There is not a Call Result among them — these count *people*, not calls.

## "P1" means two different things {#what-p1-means}

This is the thing to understand before reading any of them.

| "P1" in | Means |
|---|---|
| **Best Phone Status** | We have a **good phone number** for this person |
| **Bucket Status** | This person is a **top-priority target** |

Nineteen of the twenty-one reports filter on **Best Phone Status contains P1** — so the
dashboard's population is *contacts we can reach*, which is then broken down by where they have
got to.

So "P1's with Nurture Bucket Status" means **a contact with a good number whose status is
Nurture** — not a contradiction.

## The population reports

Six tabular reports, each feeding a table tile grouped by Campaign // List Name.

### All Contacts

| Filter |
|---|
| *(none)* |

Everything, as a baseline to read the others against.

### All P1's

| Filter | |
|---|---|
| Best Phone Status | **contains** P1 |
| Bucket Status | **not equal to** Needs Attention |

Contacts with a good number that are not flagged as broken.

### All P2's

| Filter | |
|---|---|
| Best Phone Status | contains P2 |
| Bucket Status | not equal to Needs Attention |

### All P3's

| Filter | |
|---|---|
| Best Phone Status | contains P3 |
| Bucket Status | not equal to Needs Attention |

### All Needs Attention

Filter logic **1 OR 2 OR 3** — any one of these is enough:

| # | Filter |
|---|---|
| 1 | Best Phone Status **contains** \`na\` |
| 2 | TitanX Intent **equals** Bad Data, Rejected |
| 3 | Bucket Status **equals** Needs Attention |

The only report here using **OR** logic. It gathers three unrelated kinds of broken — no usable
number, rejected by enrichment, or flagged by a human — into one queue.

### All Scorable

Filter logic **1 AND 2 AND 3 AND 4**:

| # | Filter | Means |
|---|---|---|
| 1 | Best Phone Status **equals** *(blank)* | No number scored yet |
| 2 | Campaign // List Name **does not contain** \`batch\` | Exclude bulk-loaded lists |
| 3 | Number of Submissions **not equal to** *(blank)* | Has been submitted for enrichment |
| 4 | TitanX Intent **not equal to** Bad Data, Rejected | Not already rejected |

**The enrichment backlog**: contacts that could get a usable number but have not yet. If this is
large, the pipeline is stalled upstream of the calling.

## The callable-volume reports

### Total P1's in a P1 List

| | |
|---|---|
| Format | Summary |
| Rows | Campaign // List Name, then Bucket Status |
| Filters | Best Phone Status **contains** P1 · Bucket Status **equals** P1 |

Good number **and** top priority — the genuinely callable population.

### Total P1's in a Callable List

The same, with **Bucket Status equals P1, Priority** — so it also counts people already being
worked. Feeds the stacked bar, stacked by Bucket Status.

### Total P1's in a P1 List by Call Attempts

| | |
|---|---|
| Rows | **FS Total Calls**, then Campaign // List Name |
| Filters | Best Phone Status contains P1 · Bucket Status equals P1 |

Grouping by **FS Total Calls** is what produces the "how many have had 0 calls, 1 call, 2
calls…" distribution. The most diagnostic report of the twenty-one.

### All P1's by Submission Pass

| | |
|---|---|
| Format | **Matrix** |
| Rows | Campaign // List Name |
| Columns | **Number of Submissions** |
| Filters | Best Phone Status **equals P1** · Bucket Status not equal to Needs Attention |

How many enrichment passes it took to get a usable number, by list.

:::note
This is the **only** report using Best Phone Status **equals** P1 rather than **contains** P1.
If the field ever holds anything beyond the bare score, this report will quietly count fewer
people than its siblings. See [the inconsistencies](#inconsistencies).
:::

## The six bucket tiles

All identical in shape — Summary, grouped by Bucket Status, filtered to **Best Phone Status
contains P1** plus one bucket value:

| Report | Bucket Status equals |
|---|---|
| P1's with Priority Bucket Status | Priority |
| P1's with Activated Bucket Status | Activated Lead, Meeting Scheduled, Unscheduled Intro Complete |
| P1's with Nurture Bucket Status | Nurture |
| P1's with Needs Attention Bucket Status | Needs Attention |
| P1's with DNC Bucket Status | DNC |
| P1's with Not in Swimlane Bucket Status | Not In Swimlane |

Together they account for where the reachable population has ended up.

## The by-campaign reports

All Summary, grouped by **Campaign // List Name**, filtered to Best Phone Status contains P1.

### Activated Leads by Contact Campaign

| Bucket Status equals |
|---|
| Activated Lead, Meeting Scheduled, Unscheduled Intro Complete, **Not In Swimlane** |

### Priority Follow Ups by Contact Campaign

| Bucket Status equals |
|---|
| Priority |

### Nurture, DNC, Not in Swim by Contact Cam

| Bucket Status equals |
|---|
| Nurture, Not In Swimlane, DNC |

Which lists are going nowhere — the counterpart to the activations report.

## The follow-up backlog reports

### Priority's - Days Since Follow Up Date

| | |
|---|---|
| Rows | **a row-level text formula**, not a field |
| Filters | Best Phone Status contains P1 · Bucket Status equals Priority |

The formula turns the follow-up date into a band — No Date Set, Future, 0–7, 8–14, 15–21, 22–28,
29+ days — so the report can group on it. A report cannot group on a raw date difference, which
is the whole reason the formula exists. It is written out in
[Formula columns](./formulas.md#days-since-follow-up-date--prioritys---days-since-follow-up-date).

### Priority's - Total Call Attempts

| | |
|---|---|
| Rows | **FS Total Calls** |
| Filters | Best Phone Status contains P1 · Bucket Status equals Priority · **the formula ≥ 0** |

Here the same date-difference formula is numeric and used as a **filter** rather than a grouping:
\`TODAY() - Contact.Follow_Up_Date__c >= 0\` means *due today or overdue*.

So the report reads: of the priority contacts whose follow-up is due, how many calls has each
already had?

## Inconsistencies worth knowing {#inconsistencies}

These are in the live reports. None is obviously wrong, but each makes two tiles that look
comparable not quite comparable.

| Where | What |
|---|---|
| **All P1's by Submission Pass** | Uses Best Phone Status **equals** P1; every other report uses **contains** |
| **Activated Leads by Contact Campaign** | Counts **Not In Swimlane** as activated; **P1's with Activated Bucket Status** does not |
| **All Needs Attention** vs **P1's with Needs Attention** | The first casts a much wider net — three OR'd conditions, and no Best Phone Status filter |

The second is the one to watch: the two "activated" tiles on the same dashboard are counting
different things.

## Where this fits

The dashboard reading these is [P1 Tracker](../dashboards/p1-tracker.md). What Bucket Status
values mean is [Statuses and call results](../reference/bucket-statuses.md).
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}

/* The org's band labels use en dashes; match them exactly. */
const fp = path.join(DOCS, "standard-build/reports/formulas.md");
let s = fs.readFileSync(fp, "utf8");
s = s.replace(/"0-7 days"/, '"0–7 days"')
     .replace(/"8-14 days"/, '"8–14 days"')
     .replace(/"15-21 days"/, '"15–21 days"')
     .replace(/"22-28 days"/, '"22–28 days"');
fs.writeFileSync(fp, s, "utf8");

console.log(`Wrote ${n} page, and corrected the band labels in formulas.md.`);
