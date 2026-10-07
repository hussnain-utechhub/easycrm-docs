---
title: FrontSpin
sidebar_position: 0
slug: /frontspin
---

# FrontSpin

**What it is.** FrontSpin is a sales dialler. Your team works a calling list in FrontSpin;
your customer records live in Salesforce and EasyCRM. The integration keeps the two in step so
nobody retypes anything.

**What it does.** Contacts, Accounts and Leads created or changed in Salesforce are pushed into
FrontSpin. Calls, call outcomes and contact changes made in FrontSpin come back into Salesforce.
Salesforce reports can fill a FrontSpin calling list on a timetable.

**Why it matters.** Without it, a dialler and a CRM drift apart within days — someone is called
twice, a number corrected in one system stays wrong in the other, and a calling list is only ever
as fresh as the last manual export.

## An important boundary

The FrontSpin integration is **not part of the EasyCRM package**. It is Apex, custom objects and
configuration that live in your own Salesforce org, built for one customer and installed
alongside EasyCRM.

That means three things:

- Installing EasyCRM does **not** give you FrontSpin sync.
- Upgrading EasyCRM does not change it, and does not break it.
- The portal pages that mention FrontSpin ([List Mappings](./portal/list-mappings.md) and the
  [sync-health view](./portal/sync-health.md)) show a polite "FrontSpin is not set up in this org"
  message when the integration is absent. That message is normal, not a fault.

## Where to start

| If you are | Read |
|---|---|
| New to all of this | [The two systems](./understand/index.md) |
| Setting up a new tenant | [Setting it up](./setup/index.md) |
| Adding a second FrontSpin account | [Routing](./routing/index.md) |
| Filling a calling list from a report | [Lists](./lists/index.md) |
| Using the portal, not Setup | [FrontSpin in the portal](./portal/index.md) |
| Chasing something that did not sync | [Troubleshooting](./troubleshooting/index.md) |

## The shortest possible summary

1. Every customer of yours gets a **Record Type** in Salesforce.
2. Each Record Type is pointed at a **FrontSpin tenant** by a configuration row.
3. Saving a Contact, Account or Lead sends it to that tenant.
4. FrontSpin calls a **webhook** back when something happens at its end.
5. Anything that fails is written down, and most failures retry themselves.

Everything else in this section is detail on those five steps.
