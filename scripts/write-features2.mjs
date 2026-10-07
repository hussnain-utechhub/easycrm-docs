/* The rest of the Features track. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

f["features/activities-and-files.md"] = `---
title: Activities and files
sidebar_position: 3
---

# Activities and files

Keeping the history of a customer with the customer.

## Activity tracking

**What it is.** Calls, tasks, meetings and emails recorded against the record they concern, in
one timeline.

**What you gain:** customer history that belongs to the company rather than to one person's
inbox.

## Four activity types

**What it is.** Log a Call for something that already happened, New Task for something still to
do, New Event for a meeting with a start and end, and Email for a message.

**What you gain:** the difference between a record of the past and a commitment for the future
is kept explicit, rather than everything being a "note".

## Timeline filters

**What it is.** Narrowing the timeline by date, by type, or by whether something is done.

**What you gain:** a record with three years of history is still readable.

## Expand all and full history

**What it is.** Opening every entry at once, or the whole history on its own page.

**What you gain:** reading a customer's story without clicking twenty times.

## Tasks on the home page

**What it is.** Open tasks appear under **My Tasks** for whoever they are assigned to, with
overdue ones flagged.

**What you gain:** commitments surface where people actually look, instead of being buried on
a record.

## Upcoming events

**What it is.** Future events appear on the home page of the people they concern.

**What you gain:** the day ahead is visible without opening a calendar.

## File upload and preview

**What it is.** Uploading documents, previewing them in the browser, downloading or deleting.

**What you gain:** paperwork lives with the data rather than in an inbox.

## Files attached to records

**What it is.** A file uploaded to a record stays with it, and inherits its access.

**What you gain:** anybody who can see the customer can see the contract — and anybody who
cannot, cannot. No separate decision to get wrong.

## Three file views

**What it is.** Recent, Owned by Me, and All Files.

**What you gain:** finding your own upload again without searching everything.
`;

f["features/reporting.md"] = `---
title: Reporting
sidebar_position: 4
---

# Reporting

A full report builder, not a list of canned reports.

## Build reports on screen

**What it is.** Choose what the report is about, pick columns, add filters, group and total —
with a preview updating as you work.

**What it does.** Undo and redo throughout; nothing saves until you say so.

**What you gain:** anybody who can use a spreadsheet can build a report. No request queue, no
developer.

## Reports across linked records

**What it is.** Report types covering one object or two linked ones.

**What it does.** Both forms are available: only records that **have** a match, or **every**
record whether or not it has one.

**What you gain:** you can report on what exists *and* on what is missing — accounts with no
contact, contacts with no activity.

## Three report shapes

**What it is.** Tabular, summary and matrix.

**What it does.** The shape follows from what you group: none, rows, or rows and columns.

**What you gain:** one tool covers listing, summarising and cross-tabulating.

## Multi-level grouping

**What it is.** Grouping by any field, several levels deep, down the side and across the top.

**What you gain:** an answer rather than a list.

## Totals

**What it is.** Sum, average, minimum and maximum on any number column.

**What it does.** Subtotals appear per group and a grand total at the bottom.

**What you gain:** the arithmetic is done before anybody reads it.

## Report filters and filter logic

**What it is.** Filters on any field, combined with AND, OR, NOT and brackets.

**What you gain:** the report answers the real question rather than an approximation of it.

## Relative date ranges

**What it is.** This month, last quarter, this year — rather than two typed dates.

**What you gain:** "last quarter" stays correct next month without anybody editing the report.

## Locked filters

**What it is.** Filters the author fixes so readers cannot change or remove them.

**What you gain:** a report scoped to one company stays scoped to it, however it is shared.

## Reader-side filtering

**What it is.** Changing filter values while reading a report, without altering what is saved.

**What you gain:** one report serves many people, each narrowing it to themselves.

## Bucket columns

**What it is.** A column you invent, sorting existing values into categories you name — ranges
for numbers, chosen values for text and picklists.

**What you gain:** report by your own categories without adding a field to the database or
waiting for a change request.

## Formula columns, at two levels

**What it is.** Row-level formulas calculate once per record. Summary formulas calculate once
per group from the totals, at whichever grouping level you choose.

**What you gain:** percentages, ratios, ages and rates computed inside the report, so the
report is the finished answer rather than a starting point.

## Charts

**What it is.** Bar, column, line, pie, donut and gauge, drawn from the report's groupings.

**What it does.** Where a report has several groupings, the chart can be re-sliced by any of
them.

**What you gain:** the same report answers more than one question, and trends become visible.

## Folders and favourites

**What it is.** Reports live in folders, and the folder decides who can see them. Starred
reports appear under Favorites.

**What you gain:** one library serving several companies, each seeing only its own.

## Clone and Save As

**What it is.** Taking a copy of any report under a new name.

**What you gain:** people improve existing reports without risking them.

## Export

**What it is.** Download as a formatted report, keeping groups and subtotals, or as plain
details for further work.

**What you gain:** numbers leave in whatever form the recipient needs.

## Sharing

**What it is.** Reports and folders shared with companies at read or edit level, or with chosen
individuals. Revocable.

**What you gain:** you build it once and decide separately who gets it.

## Importing existing Salesforce reports

**What it is.** Bringing a report that already exists in Salesforce into the portal rather than
rebuilding it.

**What you gain:** you start from the reports your company already trusts.

## Formula sync

**What it is.** Formula columns stay aligned between a portal report and its Salesforce
counterpart.

**What you gain:** the same calculation means the same thing wherever somebody reads it.
`;

f["features/dashboards.md"] = `---
title: Dashboards
sidebar_position: 5
---

# Dashboards

Several answers on one screen, built from your reports.

## Six kinds of tile

**What it is.** Metric, bar or column, line, pie or donut, gauge, and table.

**What you gain:** the morning questions answered at a glance instead of five reports opened one
at a time.

## Drag-and-drop layout

**What it is.** Moving and resizing tiles on a grid whose fineness you set.

**What you gain:** dashboards arranged without design help.

## Separate page and tile themes

**What it is.** Light or dark for the page, and separately for the tiles.

**What you gain:** dashboards that suit a desk or a wall screen.

## Filters across every tile

**What it is.** A filter bar that narrows the whole dashboard at once.

**What it does.** Because each tile reads a different report, you map the filter to the matching
field on each one — fields with the same name are matched automatically.

**What you gain:** one dashboard serves every team and every region, instead of a copy for each.

## Audience control

**What it is.** A dashboard either shows each person their own numbers, or shows everybody the
same company-wide totals.

**What you gain:** one dashboard can be a personal worklist for twenty people, or a shared
company view, from the same definition.

## Cached results with refresh

**What it is.** Dashboards reuse their last result to open quickly, with a refresh for the
latest numbers.

**What you gain:** a twenty-tile dashboard opens in a usable time, and anybody who needs the
very latest figure can ask for it.
`;

f["features/security.md"] = `---
title: Security
sidebar_position: 6
---

# Security

A complete access model, in two independent halves.

| Half | Decides | Set by |
|---|---|---|
| **Permissions** | What somebody may **do** | Per person, per object |
| **Sharing** | Which **records** they may do it to | Defaults, rules, hierarchy |

## Six permissions per object

**What it is.** Read, create, edit and delete, plus permission to change the page layout for
everybody, plus field-by-field control over which fields a person may edit.

**What you gain:** somebody can maintain two fields on a record without being able to touch the
rest.

## Profiles

**What it is.** A baseline of access for a kind of person.

**What you gain:** new joiners are set up correctly by assigning one thing.

## Permission sets

**What it is.** Extra access handed to particular people, on top of their profile.

**What it does.** A permission set only ever **adds**.

**What you gain:** exceptions handled without widening access for a whole group.

## Org-wide defaults

**What it is.** The starting access for each object — private, public read, or public read and
write.

**What you gain:** a floor you set deliberately, rather than one you inherit.

## Sharing rules

**What it is.** Standing rules that widen access beyond the default, targeting records by owner
or by field criteria, granting to a company, a role or a named group.

**What you gain:** a private-by-default portal where teams still see each other's work,
maintained by rules rather than record by record.

## Public groups

**What it is.** Named lists of people, which can contain roles and other groups.

**What you gain:** add somebody to one group and every relevant rule follows.

## Role hierarchy

**What it is.** A reporting tree where access flows upward.

**What you gain:** managers get visibility automatically as teams change, with no rule per
manager.

## Restriction rules

**What it is.** The one mechanism that **narrows** access — of the records somebody could
otherwise see, keep only those matching your criteria.

**What you gain:** contractors and partners given broad capability on a deliberately narrow
slice of data.

## Account scoping

**What it is.** Tying a portal user to an Account, so they see only that account's records —
with child records following through a parent field, and an optional user-match field tying
records directly to a person.

**What you gain:** the classic customer-portal arrangement. Every client signs in to the same
portal and sees only their own data, with no rule written per client.

## Manual record sharing

**What it is.** Sharing one individual record with a named person or group, at a chosen access
level, with the reason recorded.

**What you gain:** the one-off exception handled without a rule that would also catch a hundred
other records.

## Access diagnostics

**What it is.** Pick any record and see everybody who can access it, with the reason for each —
owner, default, a named sharing rule, or the hierarchy.

**What you gain:** access questions answered with evidence in seconds, and you know exactly
which setting to change.
`;

f["features/configuration.md"] = `---
title: Configuration and branding
sidebar_position: 7
---

# Configuration and branding

Everything shaped on screen, without code.

## Page layouts

**What it is.** Choosing which fields appear, grouping them into named sections, ordering them,
and choosing which related lists show underneath.

**What it does.** A separate, shorter field set is configured for the new-record window.

**What you gain:** record pages matched to how your company actually works — and a creation
form short enough that people use it.

## Tabs

**What it is.** Which tabs exist and in what order.

**What you gain:** people see a portal shaped for their job rather than a directory of
everything.

## Apps

**What it is.** Named groups of tabs, assignable per company.

**What you gain:** sales and support see different sets without either ignoring the other's.

## Custom buttons

**What it is.** Your own buttons on record pages, which can open a web address with the record
loaded, start a Salesforce flow, create a linked child record, or run a background action.

**What it does.** Developers can add bespoke screens through a documented extension point.

**What you gain:** your other systems are one click away, with the record already in context.

## Home page configuration

**What it is.** Which cards appear on everybody's home page, with an announcement you write, and
optionally a different home page per app.

**What you gain:** a landing screen that tells each person what needs attention today.

## Name, logo and theme

**What it is.** The portal's name, your logo, the browser tab icon, and colour presets or your
own colours.

**What you gain:** people see their own company's name, not a product they have never heard of.

## Navigation default

**What it is.** Top bar or side bar as the starting layout, overridable by each person.

**What you gain:** a sensible default without taking the choice away.

## The sign-in page designer

**What it is.** A block-based editor for the sign-in page — headings, text, logos, links,
separators and spacers, placed across the two halves of the screen, with alignment, width,
height and tone per block.

**What it does.** Preview on desktop and phone. Save drafts privately, publish when ready, and
restore an earlier version if a change was wrong. Switch back to the standard design at any time
without losing your custom one.

**What you gain:** the first screen customers see looks like your company, changed in minutes
without a developer.

## Protected credential fields

**What it is.** The username box, password box and sign-in button cannot be moved, hidden or
imitated by anything added in the designer.

**What you gain:** no design change — by anybody, deliberate or not — can turn the sign-in page
into something that collects credentials elsewhere.

## Automatic field setup

**What it is.** The portal works out which of its own fields are missing from which objects and
creates them.

**What you gain:** installation and upgrades do not become a list of fields to create correctly
by hand.

## Importing layouts from Salesforce

**What it is.** Page layouts already defined in Salesforce can be pulled in as a starting point.

**What you gain:** you begin from the arrangement your company already uses rather than a blank
page.
`;

f["features/data.md"] = `---
title: Data and integration
sidebar_position: 8
---

# Data and integration

Getting information in, and out to other systems.

## Spreadsheet import

**What it is.** Loading many records from a CSV file, matching columns to fields on screen.

**What it does.** A summary reports how many were created and lists anything that failed, with
the reason.

**What you gain:** onboarding a new client's data without a data-loading tool or a developer.

## Standing column mappings

**What it is.** For lists that arrive repeatedly from the same source, the column-to-field
matching saved once, per company.

**What you gain:** recurring imports stop being a manual matching exercise every time.

## A read-only API

**What it is.** Keys that let another system fetch your portal data. Each key is attached to a
person, scoped to chosen objects and fields, and can be filtered to a subset of records.

**What it does.** Secrets are shown once. Keys can be edited, regenerated or revoked.

**What you gain:** integrations without exposing your Salesforce org — and without any risk of
an integration changing or deleting data, because keys can only read.

## API usage analytics

**What it is.** Request volumes by period, company and user, with export.

**What you gain:** integrations you can supervise, and unused keys you can retire.

## API log retention

**What it is.** Request logs kept for a period and then tidied up automatically.

**What you gain:** usage history for as long as it is useful, without a log table that grows
for ever.

## Publishing reports back to Salesforce

**What it is.** Portal reports re-created as Salesforce reports on a schedule.

**What it does.** Off until deliberately enabled. If a published report is deleted, the schedule
pauses rather than silently re-creating it. A digest reports what published and what did not.

**What you gain:** portal users and Salesforce users looking at the same numbers, without
anybody maintaining the report twice.

## Activity emails

**What it is.** Emails composed against a record and sent from the portal, plain or formatted.

**What you gain:** correspondence recorded with the customer it concerns.
`;

f["features/operations.md"] = `---
title: Operations and scale
sidebar_position: 9
---

# Operations and scale

Running it, and running it at volume.

## Audit log

**What it is.** Sign-ins, failed sign-ins, password changes, administration changes and every
impersonation attempt — filterable and searchable.

**What it does.** It cannot be edited, deleted or disabled by anybody, including a Super Admin.

**What you gain:** evidence rather than recollection, and a straight answer to "who changed
this?".

## Installation health checks

**What it is.** A checklist confirming the portal's own access, field visibility, whether the
site is live, and whether email can be delivered.

**What you gain:** setup problems named instead of guessed at — especially after adding new
fields, which do not become visible automatically.

## Large lists

**What it is.** Lists of tens of thousands of records open and scroll smoothly, drawing only
what is on screen.

**What you gain:** the portal stays usable as your data grows.

## Exact counts

**What it is.** Totals are the true figure, not a capped approximation.

**What you gain:** nobody has to wonder whether a number is real.

## Wide reports

**What it is.** Matrix reports with many columns render without stalling the browser.

**What you gain:** cross-tabulations stay practical at real widths.

## Cache control

**What it is.** Report caching can be switched off, org-wide or per company.

**What you gain:** speed by default, and live figures where that matters more.

## Licence limits

**What it is.** Caps on how many companies, and how many administrators and standard users per
company, with per-company overrides.

**What it does.** Reaching a limit refuses **new** users with a message. Nobody already created
is affected.

**What you gain:** an installation that cannot quietly outgrow what was agreed.
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Wrote ${n} pages.`);
