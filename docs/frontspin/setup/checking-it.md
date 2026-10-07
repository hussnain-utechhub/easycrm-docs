---
title: 7. Checking it
sidebar_position: 7
---

# Step 7 — Checking it

## The built-in health check

There is a configuration checker that reads everything you have just set up and reports what is
wrong with it. It makes **no** calls to FrontSpin, writes nothing, and never prints a secret.

**Where:** Salesforce **Setup** → **Developer Console** → **Debug** → **Open Execute Anonymous
Window**

Run:

```java
System.debug(FrontSpinConfigCheck.report());
```

Tick **Open Log**, click **Execute**, and read the result.

## What it tells you

Findings come at three levels:

| Level | Means |
|---|---|
| **ERROR** | Something is genuinely wrong and must be fixed |
| **WARNING** | Incomplete, or would be refused once routing is enforced |
| **INFO** | Normal state, or something you should know |

A Record Type with no mapping yet is reported as a **warning or information**, never an error —
because during a rollout that is simply work not done yet, not a mistake.

## Run it before switching anything on

The check exists so that the state of the configuration is obvious **before** anyone enforces
strict routing. If you are planning to move off the default mode, run this first and clear every
error. See [moving off LEGACY](../routing/index.md#moving-off-legacy).

## A first real test

Once the check is clean:

1. Open a Contact with the new Record Type.
2. Change something small — a job title.
3. Save.
4. Wait a minute.
5. Look at the contact in FrontSpin.

If it arrived, the outbound path works end to end.

Then make a change **in FrontSpin** to a mapped field and watch it appear in Salesforce. That
proves the webhook.

## If the test fails

Check in this order — it is roughly cheapest-first:

1. **[Sync errors](../troubleshooting/sync-errors.md)** — did the record fail, and why?
2. **The configuration row** — does the Record Type developer name match exactly?
3. **[Permissions](./permissions.md)** — can the running user write what it needs to?
4. **The health check** again — it may have been clean before your last edit.

## What to hand over

When the tenant is live, whoever runs it day to day needs:

- Where [sync errors](../troubleshooting/sync-errors.md) are, and what to do about them
- That [lists are add-only](../understand/what-syncs.md#why-add-only-matters-more-than-it-sounds)
- The [checklist](../reference/checklist.md)

## Where this fits

The tenant is live. If this is the **only** FrontSpin account, you are done. If there are
others, read [Routing](../routing/index.md) next.
