/* One-off generator for the administration and account pages. Run once, then edit the .md. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const files = {};

files["your-account/_category_.json"] = JSON.stringify(
  { label: "Your account", position: 6, collapsed: false },
  null,
  2
);

files["your-account/profile.md"] = `---
title: Your profile
sidebar_position: 1
---

# Your profile

Click your name in the top right, then **Settings**.

![Your profile](../img/shots/profile/view.png)

You can see your name, username, email address and role.

Your **role** and your **company** are set by your administrator. You cannot change them here.
`;

files["your-account/password.md"] = `---
title: Changing your password
sidebar_position: 2
---

# Changing your password

1. Click your name in the top right.
2. Click **Settings**.
3. Click **Change Password**.
4. Type your current password.
5. Type your new password twice.
6. Click **Save**.

![Changing your password](../img/shots/settings/change-password.png)

You stay signed in. Use the new password next time.

## If you cannot remember the current one

Sign out and use **Forgot password?** on the sign-in page. See
[Signing in](../getting-started/sign-in.md).
`;

files["administration/_category_.json"] = JSON.stringify(
  { label: "Administration", position: 7, collapsed: true },
  null,
  2
);

files["administration/console.md"] = `---
title: The Admin Console
sidebar_position: 1
---

# The Admin Console

Click **Admin** in the top menu. This tab only appears if you are an Admin or a Super Admin.

![The Admin Console](../img/shots/admin/console.png)

Everything you manage lives behind one of these tabs.

| Tab | What you do there |
|---|---|
| [Companies](./companies.md) | Set up the companies that use the portal. |
| [Users](./users.md) | Add people and give them a role. |
| [Permissions](./permissions.md) | Decide what each role can do. |
| [Permission Sets](./permission-sets.md) | Bundle extra access and hand it out. |
| [Profiles](./profiles.md) | Set the starting access for a group of people. |
| [Sharing](./sharing.md) | Decide who can see whose records. |
| [Reports and Dashboards](./reports-dashboards.md) | Share report folders between companies. |
| [Buttons](./buttons.md) | Add buttons to record pages. |
| [Tabs](./tabs.md) | Choose which tabs appear, and in what order. |
| [Branding](./branding.md) | Set the portal name and logo. |
| [Home](./home.md) | Choose what everyone sees on the home page. |
| [Apps](./apps.md) | Group tabs into apps. |
| [Audit Log](./audit-log.md) | See who did what. |
| [CSV Import](./csv-import.md) | Load records from a spreadsheet. |
| [List Mappings](./list-mappings.md) | Connect incoming lists to your records. |
| [API Integration](./api-integration.md) | Let another system read your data. |
| [API Usage](./api-usage.md) | See how much the API is being used. |
| [Publish Schedule](./publish-schedule.md) | Send reports to Salesforce on a timetable. |

## Who sees which tabs

A **Super Admin** sees all of them. An **Admin** sees the ones a Super Admin has allowed for
their company. Set that under [Users](./users.md), with **Console Tabs**.
`;

files["administration/users.md"] = `---
title: Users
sidebar_position: 2
---

# Users

Click **Admin**, then **Users**.

![Users](../img/shots/admin/users.png)

Every person who can sign in is listed here.

## Adding someone

1. Click **+ New User**.
2. Type their username and email address.
3. Choose a role:
   - **Standard** sees their own records.
   - **Admin** manages the people at their company.
   - **Super Admin** manages everything.
4. Choose their company.
5. Click **Save**.

![Adding a user](../img/shots/admin/modal-new-user.png)

They get an email with their password.

## Turning someone off

Use the **Active** switch. They can no longer sign in, but their records stay exactly as they
are. This is what to use when somebody leaves.

## Setting a new password

Click the key beside their name, then **Save**. They get the new password by email.

## Logging in as someone

Click the person icon beside their name to see the portal exactly as they see it. Use this to
check a problem somebody has reported.

Every attempt is written to the [Audit Log](./audit-log.md), and so is anything you do while
you are in there. The person is not signed out and does not notice.

A Super Admin can do this for anyone. An Admin can do it for the Standard users they manage
and for other Admins at their own company, but never for a Super Admin.

This is switched off until a Super Admin turns it on.

## Assign Apps, Record Types and Console Tabs

The three buttons above the table set, for the whole company:

| Button | What it controls |
|---|---|
| **Assign Apps** | Which apps people can switch between. |
| **Assign Record Types** | Which kinds of record they can create. |
| **Console Tabs** | Which Admin Console tabs their Admins see. |

![Console tabs](../img/shots/admin/modal-console-tabs.png)
`;

files["administration/companies.md"] = `---
title: Companies
sidebar_position: 3
---

# Companies

Click **Admin**, then **Companies**.

![Companies](../img/shots/admin/companies.png)

A company groups people together. Everyone who signs in belongs to one.

## Adding a company

1. Click **New Company**.
2. Type a name.
3. Click **Save**.

![Adding a company](../img/shots/admin/modal-new-company.png)

## Why companies matter

- An **Admin** manages only the people at their own company.
- Report folders can be shared with one company and not another.
- Access to apps and tabs can be set per company.

Somebody with no company set is not treated as a match for any company rule. Always set one.
`;

files["administration/permissions.md"] = `---
title: Permissions
sidebar_position: 4
---

# Permissions

Click **Admin**, then **Permissions**.

![Permissions](../img/shots/admin/permissions.png)

This is where you say what each role can do with each kind of record.

For every kind of record you can allow:

| | |
|---|---|
| **Read** | See the records. |
| **Create** | Add new ones. |
| **Edit** | Change existing ones. |
| **Delete** | Remove them. |

Tick what the role should have, and click **Save**.

## One thing worth knowing

Permissions say what a role can do with the records it can see.
[Sharing](./sharing.md) says which records those are.

Somebody needs both. Read permission with no sharing shows an empty list.
`;

files["administration/permission-sets.md"] = `---
title: Permission Sets
sidebar_position: 5
---

# Permission Sets

Click **Admin**, then **Permission Sets**.

![Permission Sets](../img/shots/admin/permission-sets.png)

A permission set is a bundle of extra access you give to particular people, on top of what
their role already allows.

Use one when a few people need more than the rest of their role, and you do not want to change
the role for everybody.

## Making one

1. Click **New Permission Set**.
2. Give it a name.
3. Tick what it grants.
4. Click **Save**.

![Adding a permission set](../img/shots/admin/modal-new-permission-set.png)

## Giving it to somebody

Open [Users](./users.md) and add the set in the **Permission Sets** column.

A permission set only ever adds access. It can never take any away.
`;

files["administration/profiles.md"] = `---
title: Profiles
sidebar_position: 6
---

# Profiles

Click **Admin**, then **Profiles**.

![Profiles](../img/shots/admin/profiles.png)

A profile is the starting access for a group of people. Everyone on it gets the same baseline.

Use a profile for what a kind of person always needs. Use a
[permission set](./permission-sets.md) for the exceptions.

## Making one

1. Click **New Profile**.
2. Give it a name.
3. Set what it allows.
4. Click **Save**.

![Adding a profile](../img/shots/admin/modal-new-profile.png)

Assign it to somebody under [Users](./users.md).
`;

files["administration/sharing.md"] = `---
title: Sharing
sidebar_position: 7
---

# Sharing

Click **Admin**, then **Sharing**.

![Sharing](../img/shots/admin/sharing.png)

Sharing decides which records a person can see. [Permissions](./permissions.md) decide what
they can do with them.

## Start with the default

For each kind of record, choose what everybody gets to begin with:

| Setting | Meaning |
|---|---|
| **Private** | You see only your own records. |
| **Public Read Only** | Everybody can see them. Only the owner can change them. |
| **Public Read/Write** | Everybody can see and change them. |

Start with **Private** and open it up with rules. It is far easier than closing it down later.

## Then add rules

A rule opens up access beyond the default, for example letting a team see each other's
records.

Managers see what the people they manage can see. Set who manages whom under
[Users](./users.md).
`;

files["administration/reports-dashboards.md"] = `---
title: Reports and Dashboards
sidebar_position: 8
---

# Reports and Dashboards

Click **Admin**, then **Reports & Dashboards**.

![Reports and Dashboards](../img/shots/admin/reports-dashboards.png)

This is where you decide which companies can see which report folders.

1. Pick a folder.
2. Choose the companies that should see it.
3. Click **Save**.

People at those companies then find the folder under **Reports**.

A folder shared with nobody is visible only to Super Admins.
`;

files["administration/buttons.md"] = `---
title: Buttons
sidebar_position: 9
---

# Buttons

Click **Admin**, then **Buttons**.

![Buttons](../img/shots/admin/buttons.png)

You can add your own buttons to record pages, for example to open another system with the
record already loaded.

1. Click **New**.
2. Give the button a label.
3. Choose which kind of record it appears on.
4. Set what it does.
5. Click **Save**.

The button then appears on that kind of record for everybody who can see it.
`;

files["administration/tabs.md"] = `---
title: Tabs
sidebar_position: 10
---

# Tabs

Click **Admin**, then **Tabs**.

![Tabs](../img/shots/admin/tabs.png)

Choose which tabs appear across the top of the portal, and in what order.

- Turn a tab on or off with its switch.
- Drag a tab to move it.
- Change its label to whatever your company calls it.

Click **Save** when you are done.

Hiding a tab hides the way in. It does not remove anybody access to those records. Use
[Permissions](./permissions.md) and [Sharing](./sharing.md) for that.
`;

files["administration/branding.md"] = `---
title: Branding
sidebar_position: 11
---

# Branding

Click **Admin**, then **Branding**.

![Branding](../img/shots/admin/branding.png)

Set what the portal is called and what it looks like.

| Setting | What it changes |
|---|---|
| **Portal name** | The name in the top left and on the browser tab. |
| **Logo** | The picture beside the name. |
| **Theme** | The colours. |

Click **Save**. Everybody sees the change next time they load a page.

## The sign-in page

The sign-in page has its own design editor, so you can set its wording, colours and panels
without changing anything else.
`;

files["administration/home.md"] = `---
title: Home
sidebar_position: 12
---

# Home

Click **Admin**, then **Home**.

![Home](../img/shots/admin/home.png)

Choose which cards appear on everybody home page. Each card shows every person their own data.

| Card | Shows |
|---|---|
| **Metric tiles** | Record counts along the top. |
| **Announcement** | A message you write. |
| **My Tasks** | Open tasks on records they have worked with. |
| **Recent Records** | What they opened recently. |
| **Upcoming Events** | Events on their records. |
| **Quick links** | Shortcuts to each tab. |

Turn each one on or off, then click **Save**.

You can give an app its own home page using the **Home for** box at the top.
`;

files["administration/apps.md"] = `---
title: Apps
sidebar_position: 13
---

# Apps

Click **Admin**, then **Apps**.

![Apps](../img/shots/admin/apps.png)

An app is a named group of tabs. People switch between apps from the app launcher, so each
team sees only what it needs.

1. Click **New**.
2. Name the app.
3. Choose its tabs.
4. Click **Save**.

Decide who gets which app under [Users](./users.md), with **Assign Apps**.

Leave the list of companies blank and everybody sees the app.
`;

files["administration/audit-log.md"] = `---
title: Audit Log
sidebar_position: 14
---

# Audit Log

Click **Admin**, then **Audit Log**.

![Audit Log](../img/shots/admin/audit-log.png)

A record of what happened, newest first: who did it, what they did and when.

Sign-ins, failed sign-ins, password changes and administration changes are all recorded.

Logging in as another person is recorded too, whether it was allowed or refused. Anything done
during that session shows both names.

You cannot edit or delete entries. That is the point of it.
`;

files["administration/csv-import.md"] = `---
title: CSV Import
sidebar_position: 15
---

# CSV Import

Click **Admin**, then **CSV Import**.

![CSV Import](../img/shots/admin/csv-import.png)

Load a lot of records at once from a spreadsheet.

1. Save your spreadsheet as a CSV file.
2. Click **Choose file** and pick it.
3. Match each column to a field.
4. Click **Import**.

A summary tells you how many records were created and lists anything that failed.

## Before you import

- Put the field names in the first row.
- Check a few rows by hand first.
- Try ten rows before you try ten thousand.
`;

files["administration/list-mappings.md"] = `---
title: List Mappings
sidebar_position: 16
---

# List Mappings

Click **Admin**, then **List Mappings**.

![List Mappings](../img/shots/admin/list-mappings.png)

When another system sends you a list, a mapping says which of your fields each incoming column
belongs in.

1. Click **New**.
2. Name the mapping.
3. Match each incoming column to one of your fields.
4. Click **Save**.

Set it up once and every later list from that source lands in the right place.
`;

files["administration/api-integration.md"] = `---
title: API Integration
sidebar_position: 17
---

# API Integration

Click **Admin**, then **API Integration**.

![API Integration](../img/shots/admin/api-integration.png)

This lets another system read your portal data. The other system needs a key.

1. Choose the person the key belongs to.
2. Choose which records and fields it may read.
3. Add filters if it should see only some records.
4. Click **Save**.

The **Secret** is shown once, when it is created. Copy it then. If it is lost, create a new
key.

Keys can only read. Nothing can be changed or deleted through them.

Developer documentation lives on its own site, at
[docs.outboundoperators.com](https://docs.outboundoperators.com).
`;

files["administration/api-usage.md"] = `---
title: API Usage
sidebar_position: 18
---

# API Usage

Click **Admin**, then **API Usage**.

![API Usage](../img/shots/admin/api-usage.png)

Shows how much each key is being used, and what it asked for.

Use it to check a key is working, to see which system is busiest, and to spot a key being used
more than you expected.
`;

files["administration/publish-schedule.md"] = `---
title: Publish Schedule
sidebar_position: 19
---

# Publish Schedule

Click **Admin**, then **Publish Schedule**.

![Publish Schedule](../img/shots/admin/publish-schedule.png)

Portal reports can be copied into Salesforce on a timetable, so people who work in Salesforce
see the same numbers without anybody doing it by hand.

1. Pick a report.
2. Choose how often it should run.
3. Click **Save**.

This is switched off until a Super Admin turns it on.

If a report is deleted, its schedule pauses rather than making a new one.
`;

let n = 0;
for (const [rel, body] of Object.entries(files)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Wrote ${n} files.`);
