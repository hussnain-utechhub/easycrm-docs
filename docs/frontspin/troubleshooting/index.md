---
title: Where to look
sidebar_position: 0
---

# Troubleshooting

## The two places evidence lives

| Place | Answers | Look here when |
|---|---|---|
| **FrontSpin Sync Errors** | "What went wrong with **this** record?" | Almost always start here |
| **API Logs** | "What exactly was sent and received?" | The sync error is not enough |

Sync errors are per record, with proper links to the Account or Contact, so a failure is visible
from the record page. API logs hold the full request-and-response narrative but cannot be filtered
usefully — their detail fields are long text, which Salesforce refuses to filter on.

So: **sync errors first, API logs only when you need the wire detail.**

## A quick diagnostic order

1. **Is anything syncing at all?** Check [sync health](../portal/sync-health.md). If everything
   stopped at once, suspect the scheduled jobs or an expired credential — not configuration.
2. **Is this one record failing?** Open
   [its sync errors](./sync-errors.md) and read the failure class.
3. **Is it a whole customer?** Check their
   [configuration row](../setup/configuration.md) — most often a Record Type developer name that
   no longer matches.
4. **Did it ever work?** If it never has, it is configuration. If it stopped, something changed —
   a credential, a Record Type name, a deactivated user.

## The questions that come up most

| Question | Answer |
|---|---|
| Why did this contact not sync? | [Sync errors](./sync-errors.md) |
| Will it try again by itself? | [Retries](./retries.md) — most transient failures do |
| It says it worked, but nothing arrived | [Silent failures](./silent-failures.md) |
| Why is a list short? | [Silent failures](./silent-failures.md) |
| Why can I not remove somebody from a list? | You cannot. [Lists](../lists/index.md) |

## Three things that look broken and are not

- **"FrontSpin is not set up in this org"** in the portal — the integration is not installed here.
- **NOT_CONFIGURED** in a routing message — multi-instance routing is off, which is the normal
  state for a single-tenant org.
- **"summary/transcript not ready yet"** — FrontSpin had not finished processing. It resolves on
  retry. A few a day is normal.

## Before you change anything

Run the [health check](../setup/checking-it.md). It reads the whole configuration, makes no calls
and changes nothing, and it will often name the problem in one line.
