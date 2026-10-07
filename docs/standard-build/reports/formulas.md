---
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

```
IF(CONTAINS("'A':'B':'C'", CALLDISPOSITION), 1, 0)
```

`CONTAINS(text, compare_text)` is true when **compare_text appears inside text**. So the call
result is being looked for inside a colon-separated list of the results that should count.

It reads backwards, and it has two consequences worth knowing:

- **A misspelling in the list silently stops matching.** The call still happens; it just stops
  being counted.
- **A blank Call Result matches every list**, because an empty string is contained in anything.
  The reports are protected from this by their filters, which exclude blank results — but a
  formula copied into a report *without* that filter will count every blank call.

## The formulas

### Rep Attempts — *Rep Totals Dials*

```
IF(CONTAINS("'No Answer / Not Available':'Connect - Incomplete':'Meeting Scheduled':
'Activated Lead':'Not Now':'Not Me':'Referred':'Not Interested':'Nurture':'Not In Swimlane':
'No Longer With Company':'Left Voicemail':'Needs Attention':'Follow Up':'No Longer With Company':
'DNC':'Unscheduled Intro'", CALLDISPOSITION), 1, 0)
```

Every recognised result counts as an attempt. `No Longer With Company` appears twice, harmlessly.

**Total Dials** (summary): `RowCount`

### Connects Counter — *Connects*

```
IF(CONTAINS("'No Answer / Not Available':'Left Voicemail':'':'Needs Atttention':
'Call Failed': 'Callback - HangUp'", CALLDISPOSITION), 0, 1)
```

**Inverted** — it lists what is *not* a connect and returns 1 for everything else.

**D2C%** (summary): `CDF1:SUM/RowCount`

### Connect - Incomplete — *Connect Incomplete*

```
IF(CONTAINS("Connect - Incomplete", CALLDISPOSITION), 1, 0)
```

**Connect - Incomplete %** (summary): `CDF1:SUM/RowCount`

### Correct Completes — *Completions*

```
IF(CONTAINS("'Meeting Scheduled':'Activated Lead':'Not Now':'Not Me':'Referred':
'Not Interested':'Not In Swimlane':'Follow Up''", CALLDISPOSITION), 1, 0)
```

**Correct Complete %** (summary): `CDF1:SUM/RowCount`

### Activated Connects — *Activated*

```
IF(CONTAINS("'Meeting Scheduled':'Activated Lead':'Follow Up':'Unscheduled Intro'",
CALLDISPOSITION), 1, 0)
```

**Activated Connects %** (summary): `CDF1:SUM/RowCount`

### Meeting Scheduled Connects — *Meetings Scheduled*

```
IF(CONTAINS("'Meeting Scheduled':'Unscheduled Intro'", CALLDISPOSITION), 1, 0)
```

**Meeting Scheduled Connect %** (summary): `CDF1:SUM/RowCount`

### Bad Data — *Bad Data*

```
IF(CONTAINS("'Needs Attention': 'No Longer With Company'", CALLDISPOSITION), 1, 0)
```

**Bad Data %** (summary): `CDF1:SUM/RowCount`

### Days Since Follow Up Date — *Priority's - Days Since Follow Up Date*

A text formula that buckets a date into bands, used as a **grouping**:

```
IF(
  ISBLANK(Contact.Follow_Up_Date__c),
  "No Date Set",
  IF(
    Contact.Follow_Up_Date__c > TODAY(),
    "Future",
    IF( TODAY() - Contact.Follow_Up_Date__c <= 7,  "0–7 days",
    IF( TODAY() - Contact.Follow_Up_Date__c <= 14, "8–14 days",
    IF( TODAY() - Contact.Follow_Up_Date__c <= 21, "15–21 days",
    IF( TODAY() - Contact.Follow_Up_Date__c <= 28, "22–28 days",
        "29+ days" ))))))
```

Bucketing into bands is what lets it be grouped on — you cannot group a report by a raw date
difference.

### Days Since Follow-Up Date — *Priority's - Total Call Attempts*

A numeric version of the same idea, used as a **filter**:

```
TODAY() - (Contact.Follow_Up_Date__c)
```

Filtered to **greater or equal 0**, which means "due today or overdue".

## Known defects {#known-defects}

These are in the live formulas. They are reproduced above exactly as they are, so that the pages
match the org — but they are worth fixing.

| Formula | Problem | Effect |
|---|---|---|
| Connects Counter | `'Needs Atttention'` — three t's | Real **Needs Attention** calls are not in the exclusion list, so they count **as connects** |
| Connects Counter | `'Callback - HangUp'` | If the real value is `Callback - Hangup`, the casing still matches (CONTAINS is case-insensitive), but it is inconsistent with everything else |
| Connects Counter | a stray empty `''` entry | Harmless here, but it makes the list hard to read |
| Correct Completes | `'Follow Up''` — a doubled quote | The trailing quote is inside the string, so **Follow Up still matches**; it is untidy rather than broken |
| Rep Attempts | `'No Longer With Company'` listed twice | Harmless |

The first one is the one that changes a number. Everything else is cosmetic.

:::note
Fixing a formula changes every historical figure the tile has ever shown, because the dashboards
recalculate from the underlying activities each time. Decide whether you want the correction
before changing it.
:::

## Where this fits

The reports these live in are [the calculation reports](./calculation.md). What displays them is
[Dashboards](../dashboards/index.md).
