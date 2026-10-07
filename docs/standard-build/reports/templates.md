---
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
