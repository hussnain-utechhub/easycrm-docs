/* Rewrite of the administration pages in the house style, with navigation paths. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

f["administration/console.md"] = `---
title: The Admin Console
sidebar_position: 1
---

# The Admin Console

**What it is.** The single place everything about running the portal is managed.

**Who sees it.** Only Admins and Super Admins. For everybody else the **Admin** tab does not
appear at all.

## Opening it

**Where:** **Admin** in the top menu

1. Click **Admin** in the row of tabs across the top of the screen.
2. The console opens.

![The Admin Console](../img/shots/admin/console.png)

Under the heading is a row of tabs — eighteen of them, wrapping onto a second line. Each one
is a separate area. Click a tab to open it.

## What each tab is for

| Tab | What you do there |
|---|---|
| [Companies](./companies.md) | Set up the companies whose people use the portal. |
| [Users](./users.md) | Add people, set their role, reset passwords. |
| [Permissions](./permissions.md) | Decide what each role may do with records. |
| [Permission Sets](./permission-sets.md) | Bundle extra access and hand it to individuals. |
| [Profiles](./profiles.md) | Set the starting access for a kind of person. |
| [Sharing](./sharing.md) | Decide who can see whose records. |
| [Reports and Dashboards](./reports-dashboards.md) | Share report folders between companies. |
| [Buttons](./buttons.md) | Add your own buttons to record pages. |
| [Tabs](./tabs.md) | Choose which tabs appear, and in what order. |
| [Branding](./branding.md) | Set the portal name, logo and colours. |
| [Home](./home.md) | Choose what everybody sees on the home page. |
| [Apps](./apps.md) | Group tabs into apps. |
| [Audit Log](./audit-log.md) | See who did what. |
| [CSV Import](./csv-import.md) | Load records from a spreadsheet. |
| [List Mappings](./list-mappings.md) | Line up incoming columns with your fields. |
| [API Integration](./api-integration.md) | Let another system read your data. |
| [API Usage](./api-usage.md) | See how much the API is being used. |
| [Publish Schedule](./publish-schedule.md) | Send reports to Salesforce on a timetable. |

## Two more areas that are not tabs here

- [Page layouts](./page-layouts.md) — reached from a record, not from this console.
- [The sign-in page](./login-design.md) — reached from **Branding**.

## Who sees which tabs

A **Super Admin** sees all eighteen.

An **Admin** sees only the ones a Super Admin has allowed for their company. That is set under
[Users](./users.md), with the **Console Tabs** button.

## Where to start on a new portal

1. [Companies](./companies.md) — create the company first; users belong to one.
2. [Users](./users.md) — add people.
3. [Permissions](./permissions.md) — decide what each role may do.
4. [Sharing](./sharing.md) — decide which records they may do it to.
5. [Tabs](./tabs.md) and [Branding](./branding.md) — make it look right.

Steps 3 and 4 are the pair people most often get half-right. Both are needed.
`;

f["administration/users.md"] = `---
title: Users
sidebar_position: 2
---

# Users

**What it is.** Everybody who can sign in to the portal.

**What you do here.** Add people, set what kind of user they are, reset passwords, and switch
off anybody who has left.

**Why it matters.** This is the front door. Somebody switched off here cannot get in at all,
whatever any other setting says.

## Opening it

**Where:** **Admin** → **Users**

1. Click **Admin** in the top menu.
2. Click **Users** in the row of tabs under the heading.

![Users](../img/shots/admin/users-full.png)

Every person who can sign in is listed, with their username, email, role, whether they are
active, and when they last signed in.

## Adding somebody

**Where:** **Admin** → **Users** → **+ New User**

1. Click **Admin**, then **Users**.
2. Click the blue **+ New User** button on the right.
3. A window opens.

   ![Adding a user](../img/shots/admin/modal-new-user.png)

4. Fill in:
   - **Username** — what they type to sign in. It must be unique.
   - **Email** — where their password is sent. It must be real.
   - **Role** — see the table below.
   - **Company** — which company they belong to. Always set this.
5. Click **Save**.

They are emailed a password automatically.

### Which role to choose

| Role | Can do |
|---|---|
| **Standard** | See and work on their own records. Most people. |
| **Admin** | The above, plus manage people at their own company. |
| **Super Admin** | Everything, for every company. Keep this to a few people. |

### Always set a company

Somebody with no company is not treated as a match for any company rule. They may end up
seeing nothing, or being invisible to their own Admin. It is the single most common setup
mistake.

## When somebody leaves

**Do not delete them.** Switch them off instead.

1. Find them in the list.
2. Click the **Active** switch so it turns grey.

They can no longer sign in. Their records, and the history of what they did, stay exactly as
they are. Deleting would break both.

## Resetting a password

1. Find the person in the list.
2. Click the **key** symbol in the **Actions** column.
3. Click **Save**.

A new password is emailed to them. You never see it, and neither does anybody else.

## Seeing the portal as somebody else

Useful when a colleague reports a problem you cannot reproduce.

1. Find the person in the list.
2. Click the **person** symbol in the **Actions** column.

You now see the portal exactly as they see it. A banner shows whose account you are in.

**What you should know:**

- Every attempt is written to the [Audit Log](./audit-log.md), allowed or refused.
- Anything you do while in there records both names.
- The person is not signed out and does not notice.

**Who may do it:** a Super Admin for anyone. An Admin for the Standard users they manage and
for other Admins at their own company — never for a Super Admin.

This is switched off until a Super Admin turns it on.

## The three buttons above the table

These set things for the **whole company**, not one person.

![Console tabs](../img/shots/admin/modal-console-tabs.png)

| Button | What it controls |
|---|---|
| **Assign Apps** | Which apps the company's people can switch between. |
| **Assign Record Types** | Which kinds of record they may create. |
| **Console Tabs** | Which Admin Console tabs their Admins can see. |

**Assign Apps** decides what appears in the app launcher.

![Assign apps](../img/shots/admin/modal-assign-apps.png)

**Assign Record Types** decides what the **New** button offers.

![Assign record types](../img/shots/admin/modal-assign-record-types.png)

Leaving a list blank usually means "all of them", not "none".
`;

f["administration/sharing.md"] = `---
title: Sharing
sidebar_position: 6
---

# Sharing

**What it is.** Which records each person can see.

**How it differs from permissions.** [Permissions](./permissions.md) say what somebody may
**do** — read, create, edit, delete. Sharing says which **records** they may do it to.

**Why it matters most.** Get this wrong and either nobody can do their job, or everybody sees
everybody else's customers.

## Opening it

**Where:** **Admin** → **Sharing**

1. Click **Admin** in the top menu.
2. Click **Sharing** in the row of tabs.

![Sharing](../img/shots/admin/sharing-full.png)

Inside Sharing there are several areas, each with its own page here:

| Area | What it is for |
|---|---|
| [Org-Wide Defaults](./sharing-defaults.md) | The starting rule for each kind of record. |
| [Sharing Rules](./sharing-rules.md) | Standing rules that open access up. |
| [Public Groups](./public-groups.md) | Named lists of people, used by rules. |
| [Roles](./roles.md) | Who reports to whom. |
| [Restriction Rules](./restriction-rules.md) | The only thing that takes access away. |
| [Record Access](./record-access.md) | Check who can see one record, and why. |

## How the pieces fit together

Think of it as a floor, then things that raise it.

1. **The default** sets the floor for everybody.
2. **Sharing rules**, **groups** and the **role hierarchy** raise it for particular people.
3. **Restriction rules** are the only thing that lowers it again.

Everything except restriction rules can only ever **add** access. Nothing you do in a sharing
rule will hide a record somebody can already see.

## The order to set it up

1. Start with [Org-Wide Defaults](./sharing-defaults.md) set to **Private**.
2. Turn on **Grant via Hierarchy** so managers see their team's records.
3. Add [sharing rules](./sharing-rules.md) for teams that need each other's records.
4. Only then consider [restriction rules](./restriction-rules.md).

Starting Private and opening up is far easier than starting open and working out later who
should never have seen what.

## When somebody says they cannot see a record

Use [Record Access](./record-access.md). It lists everybody who can see a given record and
why, which turns a guess into an answer in about ten seconds.
`;

f["administration/page-layouts.md"] = `---
title: Page layouts
sidebar_position: 20
---

# Page layouts

**What it is.** The editor that decides what a record page looks like for everybody.

**What it does.** You choose which fields appear, in what order, grouped into sections, and
which related lists show underneath.

**Why it helps.** Most records have far more fields than anybody needs. A layout shows the ten
that matter and hides the rest, so the page is readable.

## Opening the editor

It is **not** in the Admin Console. You reach it from a record.

**Where:** **Accounts** → any record's name → **Edit Page Layout**

1. Click **Accounts** (or whichever tab) in the top menu.
2. Click any record's **name** to open it. It does not matter which — the layout applies to
   all of them.
3. Click the small button at the far right of the record's button row, next to **Change
   Owner**. Its tooltip reads **Edit Page Layout**.
4. The editor opens.

![The layout editor](../img/shots/layout/editor.png)

**What you change here applies to everybody** who sees that kind of record, not just you.

## Choosing which fields appear

The editor shows two lists side by side.

- **Available** on the left — fields not currently on the page.
- **Shown (in order)** on the right — the fields on the page, top to bottom.

1. To add a field: click it on the left, then click **Move selection to Shown (in order)**.
2. To remove one: click it on the right, then click **Move selection to Available**.
3. To reorder: click a field on the right, then **Move selection up** or **Move selection
   down**.

Removing a field from a layout **never deletes data**. The value stays on the record; it is
just not displayed.

## Finding a field quickly

There can be hundreds of fields.

1. Click the **Search fields…** box above the list.
2. Type part of the field name.

![Searching for a field](../img/shots/layout/search-fields.png)

The list narrows as you type. Fields you have already chosen stay on the right — searching
can never lose your work.

## Sections

A section is a heading with fields grouped under it, such as "Billing" or "System
Information".

**Where:** the layout editor → **Add Section**

1. Click **Add Section**.
2. Type a name for it.

   ![Adding a section](../img/shots/layout/add-section.png)

3. Move fields into it.

Use **Move section up** and **Move section down** to reorder sections, and **Remove section**
to delete one. Removing a section does not delete its fields or any data.

## Related lists

These are the tables at the bottom of a record — the contacts at this account, for example.

**Where:** the layout editor → **Related Lists** → **Add related list…**

1. Scroll to the **Related Lists** part of the editor.
2. Click the **Add related list…** box.
3. Choose which records it should show.

![Adding a related list](../img/shots/layout/add-related-list.png)

**Above related lists** controls where the activity panel sits relative to them.

## The New Record window

The record page and the **New** window can show different fields.

Set the New window separately, under **New Record Window Fields**. Keep it short — usually
just what is required — so creating a record is quick.

## Saving, and starting again

| Button | What it does |
|---|---|
| **Save Layout** | Keeps your changes, for everybody. |
| **Cancel** | Leaves without changing anything. |
| **Reset to Default** | Puts the layout back to how it started. |

**Reset to Default** loses your field arrangement but touches no record data.
`;

f["administration/csv-import.md"] = `---
title: CSV Import
sidebar_position: 15
---

# CSV Import

**What it is.** Loading many records at once from a spreadsheet.

**When to use it.** Moving in from another system, or adding a bought list. For one or two
records, just use **New** on the list instead.

**Why it helps.** Hundreds of records in one go, instead of one form at a time.

## Opening it

**Where:** **Admin** → **CSV Import**

1. Click **Admin** in the top menu.
2. Click **CSV Import** in the row of tabs.

![CSV Import](../img/shots/admin/csv-import-full.png)

## Preparing your spreadsheet

Before you start:

1. Put the **field names in the first row**. One row per record after that.
2. Remove blank rows and any summary rows at the bottom.
3. Save it as **CSV** — in Excel, **File → Save As → CSV (Comma delimited)**.

Dates should be in a consistent format throughout. Mixed formats are the most common cause of
a failed import.

## Importing

**Where:** **Admin** → **CSV Import** → choose a file → match columns → **Import**

1. Click **Admin**, then **CSV Import**.
2. Click **Choose file** and pick your CSV.
3. The screen shows your columns alongside the portal's fields.
4. For each column, choose which field it belongs in. Columns whose names match are matched
   for you.
5. Leave anything you do not want to import unmatched.
6. Click **Import**.

A summary tells you how many records were created, and lists anything that failed with the
reason.

## Try ten before you try ten thousand

Copy your spreadsheet, delete all but ten rows, and import that first.

If the ten land correctly, import the rest. If something is wrong, you have ten records to
tidy up instead of ten thousand.

## If rows fail

The summary names the row and the reason. The usual causes:

| Reason | Fix |
|---|---|
| A required field is empty | Fill it in the spreadsheet. |
| A date is not a valid date | Use one consistent format. |
| A value is not an allowed option | Match it to one of the options exactly. |

Fix those rows in a fresh CSV and import just those.

## Records already in the portal

Import **adds** records. It does not look for matches and update them. Importing the same file
twice gives you two copies of everything.
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Rewrote ${n} pages.`);
