---
title: Retries
sidebar_position: 2
---

# Retries

## The short version

Transient failures retry themselves. Failures that would fail identically do not.

That is the whole rule. Everything below is the detail.

## What retries, and what does not

| Failure Class | Retries | Because |
|---|---|---|
| **RATE_LIMITED** | Yes | The allowance resets |
| **FRONTSPIN_SERVER_ERROR** | Yes | A 500 is usually temporary |
| **TIMEOUT** | Yes | The call never completed; the next may |
| **BAD_REQUEST** | No | A malformed message stays malformed |
| **AUTHENTICATION_FAILED** | No | A rejected key stays rejected |
| **FORBIDDEN** | No | Permission will not appear by itself |
| **NOT_FOUND** | No | See below |
| **NOT_SENT** | No | Nothing was sent; fix the configuration |

Retrying the lower five would spend requests out of a limited daily allowance to learn nothing,
and starve the records behind them.

## Why NOT_FOUND is excluded deliberately

On an update, NOT_FOUND means the FrontSpin record is **gone**. Retrying cannot bring it back.

What should happen next is a judgement: clear the stored id so the record is created afresh, or
investigate why it was deleted. That is a decision for a person, not something to attempt
repeatedly.

## The schedule

Up to **four** automatic attempts, spaced:

| Attempt | After |
|---|---|
| 1st retry | 15 minutes |
| 2nd | 1 hour |
| 3rd | 4 hours |
| 4th | 24 hours |

Then the row becomes **Failed_Permanent** and waits for a person.

## Why the last step is 24 hours

Because a rate limit is a **daily** allowance. Any shorter wait is guaranteed to hit the same
limit again and waste an attempt.

The earlier, shorter steps are sized for the other two retryable kinds — a transient server error
and a timeout — which usually clear within minutes.

## Why there is a limit at all

An endlessly retried record would spend a daily allowance as low as 500 on a call that cannot
succeed, and every other record for that tenant would wait behind it.

Four attempts over roughly thirty hours covers every transient failure worth covering.

## The quota stop

Rate limiting is handled with more care than the others, because it affects every record behind
the one that hit it.

When FrontSpin reports the daily allowance exhausted, the integration **stops calling that tenant
immediately** rather than working through the rest and collecting hundreds of identical failures.
Every still-pending record is written down.

A scheduled job then re-drives them **after** the allowance resets. It does not ask FrontSpin
whether the allowance is back — that question would itself cost a request out of the very
allowance being conserved. The schedule is the control instead. If it turns out to still be
exhausted, the first call fails and the whole protection engages again: one wasted request, not
hundreds.

Records are marked once re-driven, so successive runs never send one twice.

## If you cannot wait

[Resync by hand](../manual/index.md). It takes the same path and can be run at any time.

For a record stopped by a quota, waiting is usually better — the automatic re-drive will handle
it, and a manual resync spends the same constrained allowance.

## What goes wrong

| Symptom | Cause |
|---|---|
| An error is not retrying | Its failure class is not retryable. The three that retry are listed above. |
| Retries stopped at four | Expected. It is now **Failed_Permanent**. |
| Everything retried at once a day later | A quota stop, re-driven after the reset. Normal. |
| A record retried and still shows an error | The old error stays, marked **Resolved**. History is kept on purpose. |
