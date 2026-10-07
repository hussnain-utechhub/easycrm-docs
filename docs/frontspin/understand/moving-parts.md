---
title: The moving parts
sidebar_position: 4
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

A load of 500 records fires the trigger three times — 200, then 200, then 100. Each firing has to
produce work of its own, or the records in the later ones go nowhere.

The integration queues one chain **per group per trigger firing**, so all three firings produce
work and nothing is dropped. The Task pipeline works the same way, for the same reason.

This is worth knowing because the failure it prevents is invisible: records dropped that way
produce no error and no log row, so the only symptom is a count that does not add up. If you ever
see that after a large import, check [sync errors](../troubleshooting/sync-errors.md) first — a
refusal *is* recorded, and is far the more likely explanation.

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
