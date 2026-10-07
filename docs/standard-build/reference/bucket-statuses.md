---
title: Statuses and call results
sidebar_position: 0
---

# Statuses and call results

The two vocabularies the whole build is written in. Almost every report is a filter on one of
them.

## Bucket Status {#bucket-status}

`Bucket_Status__c` on Contact — where a person has got to. Nineteen values, read back from the
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

The standard activity field **Call Result** (`CallDisposition`), set by the caller. Every
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

`Best_Phone_Status__c` and the per-number statuses hold a score, typically `p1`, `p2` or
`p3`. Reports filter with **contains**, not equals — `Best Phone Status contains P1` — because
the field can hold more than the bare score.

**Best Phone Status equals ""** means no usable number at all, and is how
[All Scorable](../reports/p1-tracker.md) finds contacts that still need enriching.

## Other picklists

| Field | Values |
|---|---|
| `Contact_Owner_Rep__c` | Ryan, Ronen |
| `Role__c` | Executive Leadership, Sales Leadership, Sales Development Leadership, Marketing Leadership, Sales Enablement Leader, Rep, Other, Not In Swimlane |
| `Role_Tier__c` | Tier 1, Tier 2, Tier 3 |

## Where this fits

The fields themselves are in [Custom fields](../fields/custom.md). What the reports do with them
is [Reports](../reports/index.md).
