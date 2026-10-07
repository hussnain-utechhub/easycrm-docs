/* A complete introduction, and the Features track. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

/* ==================================================================== intro */
f["index.md"] = `---
id: index
title: What EasyCRM is
slug: /
sidebar_position: 1
---

# What EasyCRM is

**EasyCRM is a customer portal that gives your whole company access to your Salesforce data —
without buying a Salesforce licence for every person.**

It is a website your team signs in to with a username and password. They see your accounts,
contacts, tasks, meetings, reports and files in one simple screen. It runs in an ordinary web
browser on a computer, tablet or phone. There is nothing to install.

## The problem it solves

Salesforce charges for every person who signs in.

In most companies only a handful of people genuinely work inside Salesforce all day. Everybody
else just needs to look something up, update a field, or read a report. Licensing that second
group at full price is expensive — and it hands them a large, complicated product when they
needed a small part of it.

EasyCRM gives those people the small part.

| | Without EasyCRM | With EasyCRM |
|---|---|---|
| Licences | One per person who needs to look | Only for people who work in Salesforce |
| What they see | The whole of Salesforce | The records and fields you choose |
| Training | A large product built for specialists | A screen most people learn in ten minutes |
| Reporting | Exports that go stale | Reports that read live data every time |

## Your data never leaves Salesforce

This is the part worth being clear about, because it is the first thing anybody technical asks.

EasyCRM **reads and writes your own Salesforce org directly**. There is no second database, no
nightly sync, and no copy of your records anywhere else.

Change something in EasyCRM and it changes in Salesforce. Change it in Salesforce and EasyCRM
shows it the moment somebody opens the page. It is the same data, not a mirror of it.

If you stop using EasyCRM, your records are already where they always were.

## Who uses it

Everybody who signs in has one of three roles, and the role decides what they can see and do.

| Role | Can | Typically |
|---|---|---|
| **Standard** | See and work on their own records, run reports shared with them, upload files | Most people |
| **Admin** | All of the above, plus manage the people at their own company | One or two per company |
| **Super Admin** | Everything, for every company | Whoever runs the portal |

## Built for more than one company

Every user belongs to a **company**, and almost every setting can be made company by company —
which apps they see, which report folders they reach, which administration tabs their own
admins get, even the branding.

One installation can serve many client companies, each seeing only its own world. That makes
it work for an agency or service provider as well as for a single business.

## What is in it

| Part | What it is for |
|---|---|
| **Records** | Accounts, contacts, tasks and events — the information itself |
| **Lists** | Many records at once, filtered, sorted and searched |
| **Reports** | Saved questions about your data, grouped and totalled |
| **Dashboards** | Several charts and numbers on one screen |
| **Files** | Documents, attached to records or standing alone |
| **Admin Console** | Eighteen areas controlling users, access, appearance and integrations |
| **API** | A read-only way for another system to fetch your data |

See [Features](./features/index.md) for the complete catalogue.

## How it is delivered

| Aspect | Detail |
|---|---|
| Form | A managed package installed into your Salesforce org |
| Where data lives | Your own Salesforce org |
| For end users | A web address, a username and a password |
| Devices | Any modern browser — desktop, tablet or phone |
| Address | The Salesforce-provided address, or your own domain |

## Where to start

**If you are going to use the portal** — [Using EasyCRM](./use/index.md). Start with
[Signing in](./use/start/sign-in.md), then [Getting around](./use/start/the-screen.md). About
five minutes, and it covers most of what you need.

**If you run the portal for your company** — [Administering EasyCRM](./admin/index.md).

**If you are deciding whether it fits** — [Features](./features/index.md), which lists
everything it does and what each capability gives you.

## Not sure which you are?

Open the portal and look at the row of tabs across the top. If there is an **Admin** tab, you
are an Admin or a Super Admin and both halves apply to you. If there is not, you want
**Using EasyCRM**.
`;

/* ================================================================= features */
f["features/index.md"] = `---
title: Features
sidebar_position: 0
slug: /features
---

# Features

The complete catalogue of what EasyCRM does, grouped by area. Each feature says what it is,
what it does, and what it gives you.

If you want the short version, the [feature checklist](./checklist.md) lists everything on one
page.

## The six things it changes

Before the detail, the argument. These are the reasons companies adopt it.

### 1 · Cost

People who only read, or only update a few fields, use EasyCRM instead of a Salesforce seat.

**What you gain:** the number of full Salesforce licences you buy is driven by who really works
in Salesforce, not by who needs to see the data.

### 2 · Simplicity

A short list of tabs, the fields you choose, and nothing else. No Salesforce vocabulary on
screen.

**What you gain:** training measured in minutes, and fewer mistakes from people navigating a
product built for specialists.

### 3 · Live data

Every list, report and dashboard reads the real data at the moment it is opened.

**What you gain:** no exported spreadsheets going stale, and no arguments about whose copy is
right.

### 4 · Control

A full access model — per-person permissions, record sharing, a management hierarchy, and rules
that narrow access where needed.

**What you gain:** you can open data to more people and still be specific about who sees what.

### 5 · It looks like your company

Your name, logo, colours and a sign-in page you design yourself.

**What you gain:** something you can put in front of customers and partners, not an obviously
third-party tool.

### 6 · No code to change it

Fields, layouts, tabs, apps, buttons, reports, dashboards and the sign-in page are all
configured on screen.

**What you gain:** an administrator makes changes the same afternoon, without a developer or a
release.

## The catalogue

| Area | Covers |
|---|---|
| [Access and users](./access-and-users.md) | Sign-in, roles, multi-company, delegated administration |
| [Records](./records.md) | Lists, views, filters, record pages, editing, ownership |
| [Activities and files](./activities-and-files.md) | Calls, tasks, events, timelines, documents |
| [Reporting](./reporting.md) | The report builder in full |
| [Dashboards](./dashboards.md) | Tiles, filters, audience control |
| [Security](./security.md) | Permissions, sharing, scoping, diagnostics |
| [Configuration and branding](./configuration.md) | Layouts, tabs, apps, buttons, white-labelling |
| [Data and integration](./data.md) | Import, mappings, the API, publishing back |
| [Operations and scale](./operations.md) | Audit, health checks, performance, licensing |
| [Checklist](./checklist.md) | Everything, on one page |
`;

f["features/access-and-users.md"] = `---
title: Access and users
sidebar_position: 1
---

# Access and users

How people get in, what kind of user they are, and how one installation serves many companies.

## Username and password sign-in

**What it is.** Portal users sign in with their own credentials, created in EasyCRM.

**What it does.** No Salesforce login is involved. The person never sees Salesforce and does
not need an account there.

**What you gain:** the whole licence argument. This single capability is why the product exists.

## Self-service password reset

**What it is.** A **Forgot password?** link on the sign-in page.

**What it does.** The person enters their username or email and a new password is emailed.

**What you gain:** password resets stop being an administrator's job.

## Three roles

**What it is.** Standard, Admin and Super Admin.

**What it does.** The role decides the scope of what somebody can manage — their own records,
their company's people, or everything.

**What you gain:** you can hand day-to-day user management to each company without giving
anybody keys to the whole portal.

## Multi-company

**What it is.** Every user belongs to a company, and most settings apply per company.

**What it does.** Apps, tabs, report folders, admin tabs and branding can all differ by company.

**What you gain:** one installation serves many client companies, each seeing only its own —
the difference between a product and a deployment per customer.

## Delegated administration

**What it is.** Admins manage only their own company's people.

**What it does.** A Super Admin also decides which Admin Console tabs each company's admins can
see at all.

**What you gain:** client companies run their own users without reaching anything else.

## Deactivation that preserves history

**What it is.** An **Active** switch rather than a delete.

**What it does.** The person cannot sign in. Their records keep them as owner and their audit
history stays intact.

**What you gain:** leavers handled in one click with nothing orphaned and nothing erased.

## Administrator password resets

**What it is.** A key icon beside each user.

**What it does.** Generates a new password and emails it to the person. The administrator never
sees it.

**What you gain:** an administrator can unblock somebody without ever knowing their password.

## Support impersonation

**What it is.** Viewing the portal exactly as another person sees it, without their password.

**What it does.** Every attempt is logged whether allowed or refused, actions record both names,
and the user is not interrupted. It is off until deliberately switched on.

**What you gain:** "it looks different on my screen" is solved in a minute, with a complete
record of who did it.

## Account lockout

**What it is.** Repeated failed sign-ins lock an account for a period.

**What it does.** The person is emailed that it happened.

**What you gain:** brute-force attempts stop automatically, and the account's owner finds out.

## Session expiry

**What it is.** Sessions end on their own after a period.

**What you gain:** an abandoned browser on a shared machine does not stay signed in.

## Sign-in hours and IP ranges

**What it is.** Per-profile limits on **when** and **from where** people may sign in.

**What you gain:** access confined to working hours and to your offices or VPN, without
touching anybody's permissions.

## Landing page per profile

**What it is.** Each profile can start its people on a particular tab.

**What you gain:** people arrive where their work is instead of navigating there every morning.

## Linking to a Salesforce user

**What it is.** A portal user can be linked to a Salesforce user, and users have their own
manager relationship.

**What you gain:** actions stay attributable across both systems.

## In-portal notifications

**What it is.** A bell with an unread count.

**What you gain:** people notice what needs them without anybody sending a chasing email.

## Automatic emails

**What it is.** The portal emails people on its own: credentials when an account is created, a
new password when one is reset, a warning when an account locks, and a notice when one is
closed.

**What you gain:** accounts are handed over and recovered without an administrator relaying
passwords by hand.
`;

f["features/records.md"] = `---
title: Records
sidebar_position: 2
---

# Records

The part of the portal people spend their day in.

## List views

**What it is.** Saved sets of records with their own columns, filters and sorting.

**What it does.** People switch between views and pin one as their default.

**What you gain:** each person reaches the records they care about in one click instead of
searching every time.

## Filtering, with real logic

**What it is.** Filters on any field, with operators such as equals, contains and greater than.

**What it does.** Several filters combine with **AND**, **OR**, **NOT** and brackets.

**What you gain:** genuinely specific questions — "this region, this status, but not these two
owners" — without exporting anything.

## Per-person columns

**What it is.** Each person chooses which fields appear as columns, and in what order.

**What it does.** The choice is remembered and affects nobody else.

**What you gain:** no arguments about one shared layout, and no scrolling past twenty
irrelevant columns.

## Sorting

**What it is.** Click a column heading to order by it.

**What it does.** Text, numbers and dates sort naturally; picklists sort in their defined
order rather than alphabetically.

**What you gain:** the interesting rows come to the top without building a report.

## Search

**What it is.** Two searches — one across every kind of record, one within the current list.

**What you gain:** people find things without knowing which tab they live under.

## Row actions

**What it is.** A menu at the end of each row.

**What you gain:** acting on one record without opening it.

## Configurable record pages

**What it is.** An administrator chooses which fields appear, grouped into sections, and which
related records show underneath.

**What you gain:** a readable page showing the ten fields that matter instead of the hundred
that exist.

## Full and single-field editing

**What it is.** An **Edit** button for the whole record, and a pencil beside any single field.

**What you gain:** quick corrections without opening a whole form, and one save when changing
several things.

## Field-level edit control

**What it is.** Permission to edit specific fields rather than the whole record.

**What you gain:** somebody can maintain two fields without being able to touch the rest.

## Record types

**What it is.** One object in several kinds, each with its own fields and options.

**What it does.** Which kinds a company may use is set per company.

**What you gain:** a customer and a supplier can both be accounts without sharing one cluttered
form.

## Ownership and transfer

**What it is.** Every record has an owner, and ownership can be moved.

**What it does.** Ownership usually drives who can see the record.

**What you gain:** a clean handover when somebody leaves or an account changes hands.

## Related records

**What it is.** Linked records shown on the page — the contacts at an account, the tasks on a
contact.

**What you gain:** the whole picture of a customer on one screen.

## Clickable values

**What it is.** Emails, phone numbers, addresses and linked records are all actionable.

**What you gain:** fewer copy-and-paste steps in every single interaction.

## A configurable home page

**What it is.** Record-count tiles, an announcement you write, each person's own open tasks,
their recent records, upcoming events and quick links.

**What it does.** Cards can be turned on or off, and each app can have its own home page.

**What you gain:** a landing screen that tells each person what needs their attention today.

## Personal display settings

**What it is.** Top menu or side menu, a colour theme, and comfortable or compact rows.

**What you gain:** people work how they prefer without anybody changing a shared setting.
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Wrote ${n} pages.`);
