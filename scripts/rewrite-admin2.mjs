/*
 * Corrected rewrite of the remaining administration pages.
 *
 * Control names here come from shots/discovery.json - read off the running portal - not from
 * memory. Several earlier pages were wrong in ways a reader would hit immediately:
 *
 *   Permissions   is per USER, not per role, and the page is blank until one is chosen.
 *   Tabs and Home are dual list boxes with their own Save buttons, not rows of switches.
 *   Profiles      has a "New" button; Buttons has "New Button"; Apps has "New App".
 *   Branding      is five panels behind one "Save All Branding".
 */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

f["administration/permissions.md"] = `---
title: Permissions
sidebar_position: 4
---

# Permissions

**What it is.** What one person may **do** with each kind of record.

**What it does.** For every kind of record you allow read, create, edit and delete,
individually.

**Why it matters.** This is only half of access. [Sharing](./sharing.md) decides **which**
records somebody sees. Permissions decide what they may do to the ones they can see. Read
permission with no sharing shows an empty list.

## Opening it

**Where:** **Admin** → **Permissions** → **Select a user**

1. Click **Admin** in the top menu.
2. Click **Permissions** in the row of tabs.
3. The page shows a single box, **Portal user**, and nothing else.

![Permissions](../img/shots/admin/permissions.png)

**This is set one person at a time**, not per role. The page stays blank until you choose
somebody.

4. Click **Select a user** and choose a person.
5. The list of objects appears, with tick boxes for each.

![Permissions for a chosen user](../img/shots/admin/permissions-chosen.png)

## Setting them

1. Find the kind of record in the list.
2. Tick what that person should be allowed to do.

| Tick | Lets them |
|---|---|
| **Read** | See the records. |
| **Create** | Add new ones. |
| **Edit** | Change existing ones. |
| **Delete** | Remove them permanently. |

3. Click **Save Permissions** at the top right.

## Sensible starting points

| Kind of person | Usually needs |
|---|---|
| Somebody who looks things up | Read |
| Somebody doing the day job | Read, Create, Edit |
| A team lead | Read, Create, Edit, and sometimes Delete |

**Be careful with Delete.** It is permanent, and most people never need it. Leave it off
unless somebody has asked for it and can say why.

## If you are setting up several people the same way

Setting permissions one person at a time is slow. For a group who all need the same thing,
use a [profile](./profiles.md) for the baseline and a
[permission set](./permission-sets.md) for anything extra.

## When somebody still cannot see records

Permissions are only half. If the tick boxes look right and the list is still empty, the
problem is [sharing](./sharing.md). Use
[Checking who can see a record](./record-access.md) to find out which.
`;

f["administration/tabs.md"] = `---
title: Tabs
sidebar_position: 10
---

# Tabs

**What it is.** Which tabs appear across the top of the portal, and in what order.

**What it does.** You move objects between "available" and "shown", and arrange the shown ones.

**What it is not.** Hiding a tab hides the way in, not the data. Somebody can still reach those
records through search or a report. Use [Permissions](./permissions.md) and
[Sharing](./sharing.md) to control access.

## Opening it

**Where:** **Admin** → **Tabs**

1. Click **Admin** in the top menu.
2. Click **Tabs** in the row of tabs.

![Tabs](../img/shots/admin/tabs-full.png)

You see two lists side by side:

- **Available objects** on the left — things not currently shown as tabs.
- **Shown as tabs** on the right — the tabs people see, top to bottom matching left to right
  across the screen.

## Adding a tab

1. Click an object in the **Available objects** list on the left.
2. Click **Move selection to Shown as tabs**.
3. Click **Save Tabs**.

## Removing a tab

1. Click the tab in the **Shown as tabs** list on the right.
2. Click **Move selection to Available objects**.
3. Click **Save Tabs**.

Nothing is deleted. The records are still there, and anybody with permission can still reach
them by searching.

## Changing the order

1. Click a tab in the **Shown as tabs** list.
2. Click **Move selection up** or **Move selection down**.
3. Repeat until the order is right.
4. Click **Save Tabs**.

The order here is the order across the top of the screen, left to right. Put the ones people
use every day first.

## Nothing takes effect until you save

Click **Save Tabs**. People see the change the next time they load a page.

## Tabs and apps

If you use [apps](./apps.md), each app has its own set of tabs. This screen sets the overall
list; the app decides which of them that app shows.
`;

f["administration/home.md"] = `---
title: Home
sidebar_position: 12
---

# Home

**What it is.** What everybody sees on the portal's home page.

**What it does.** You choose which cards appear, and in what order.

**Why it helps.** Each card shows every person **their own** data, so one setting suits
everybody. You are choosing the layout, not the contents.

## Opening it

**Where:** **Admin** → **Home**

1. Click **Admin** in the top menu.
2. Click **Home** in the row of tabs.

![Home](../img/shots/admin/home-full.png)

Be careful not to confuse this with the **Home** tab in the main menu — that is the home page
itself. This one is inside the Admin Console.

## Choosing the cards

The screen has two lists:

- **Available** on the left — cards not currently shown.
- **Shown (in order)** on the right — the cards people see, top to bottom.

1. To add a card: click it on the left, then click **Move selection to Shown (in order)**.
2. To remove one: click it on the right, then click **Move selection to Available**.
3. To reorder: click a card on the right, then **Move selection up** or **Move selection
   down**.
4. Click **Save Home**.

## What each card shows

| Card | Shows |
|---|---|
| **Metric tiles** | Record counts in a strip across the top. |
| **Announcement** | A message you write, shown to everybody. |
| **My Tasks** | That person's open tasks. Overdue ones in red. |
| **Recent Records** | What that person opened recently. |
| **Upcoming Events** | Events on records that person works with. |
| **Quick links** | Shortcuts to each tab. |

## A different home page per app

At the top is a box reading **Default (all apps)**.

1. Leave it on **Default (all apps)** to set the home page everybody gets.
2. Or choose an app to give that app its own home page.

An app with no home page of its own uses the default, so you only set this where a team needs
something different.

## Writing an announcement

1. Make sure **Announcement** is in the **Shown** list.
2. Type your message in the box below.
3. Click **Save Home**.

Everybody sees it on their home page. Clear the text and save again to remove it.
`;

f["administration/companies.md"] = `---
title: Companies
sidebar_position: 3
---

# Companies

**What it is.** The companies whose people use the portal.

**What it does.** A company groups users together, and most access rules work company by
company.

**Why it matters.** An Admin manages only their own company's people, and report folders are
shared per company. Somebody with no company matches no company rule.

## Opening it

**Where:** **Admin** → **Companies**

1. Click **Admin** in the top menu.
2. Click **Companies** in the row of tabs.

![Companies](../img/shots/admin/companies-full.png)

Each company is listed with how many people belong to it.

## Adding a company

**Where:** **Admin** → **Companies** → **New Company**

1. Click **Admin**, then **Companies**.
2. Click **New Company**.
3. Type the company's name.

   ![Adding a company](../img/shots/admin/modal-new-company.png)

4. Click **Save**.

Create the company **before** you add its people, so you can set their company as you create
them.

## Seeing who belongs to a company

1. Find the company in the list.
2. Click **People** beside it.

You see everybody at that company, and can jump to any of them in
[Users](./users.md).

## Renaming or removing one

- **Edit** changes the name.
- **Delete** removes the company.

**Do not delete a company that still has people.** Their company becomes blank, and a blank
company matches no rule — which usually means they stop seeing records, or their Admin stops
being able to manage them. Move the people first.

## Why every user needs a company

It is the most common setup mistake, and it shows up in confusing ways:

- An Admin cannot see or manage somebody.
- Somebody cannot see a report folder shared with their company.
- An app assigned to a company does not appear for them.

All three are the same cause: a blank company field. Set it when you create the user.
`;

f["administration/profiles.md"] = `---
title: Profiles
sidebar_position: 5
---

# Profiles

**What it is.** The starting access for a kind of person.

**What it does.** Everybody on the same profile gets the same baseline.

**How it differs from a permission set.** A profile is what that kind of person **always**
needs. A [permission set](./permission-sets.md) is the exception you add on top for a few
people.

## Opening it

**Where:** **Admin** → **Profiles**

1. Click **Admin** in the top menu.
2. Click **Profiles** in the row of tabs.

![Profiles](../img/shots/admin/profiles-full.png)

## Creating one

**Where:** **Admin** → **Profiles** → **New**

1. Click **Admin**, then **Profiles**.
2. Click **New**.
3. Give it a name describing the kind of person, such as "Sales rep".

   ![Adding a profile](../img/shots/admin/modal-new-profile.png)

4. Set what it allows.
5. Click **Save**.

## Giving it to somebody

**Where:** **Admin** → **Users** → the person's row → **Set profile**

1. Click **Admin**, then **Users**.
2. Find the person.
3. Click **Set profile** in their row, and choose the profile.

## Naming profiles

Name a profile after the **job**, not the access. "Sales rep" still makes sense in a year.
"Can edit accounts" stops making sense the first time you change what it grants.

## Profile, permission set, or neither?

| Situation | Use |
|---|---|
| Everybody doing this job needs it | A **profile**. |
| A few people need extra | A [permission set](./permission-sets.md). |
| One person, one object, one time | [Permissions](./permissions.md) directly. |

Reach for a profile first. Setting permissions person by person works, but it does not scale
and nobody can tell later why somebody has what they have.
`;

f["administration/buttons.md"] = `---
title: Buttons
sidebar_position: 9
---

# Buttons

**What it is.** Your own buttons, added to record pages.

**What it does.** A button can open another system, with the record already loaded.

**Why it helps.** If your team opens the same other system for every customer, this removes
the copying and pasting.

## Opening it

**Where:** **Admin** → **Buttons**

1. Click **Admin** in the top menu.
2. Click **Buttons** in the row of tabs.

![Buttons](../img/shots/admin/buttons-full.png)

## Adding one

**Where:** **Admin** → **Buttons** → **New Button**

1. Click **Admin**, then **Buttons**.
2. Click **New Button**.
3. Fill in:
   - **Label** — what it says on the button. Keep it short; it sits in a row with others.
   - **Object** — which kind of record it appears on.
   - What it does — usually a web address to open.
4. Click **Save**.

The button appears on that kind of record for everybody who can see it.

## Putting the record's details into a link

A button is most useful when it carries something from the record — the account's name, say,
or its id — into the other system. The editor shows which values you can insert.

## Checking it works

1. Open any record of that kind.
2. Find your button in the row at the top right.
3. Click it.

If nothing happens, the address is wrong. Edit the button and try again.

## Removing one

Find it in the list and delete it. Nothing on any record changes — the button simply stops
appearing.
`;

f["administration/apps.md"] = `---
title: Apps
sidebar_position: 13
---

# Apps

**What it is.** A named group of tabs.

**What it does.** People switch between apps, and each app shows its own set of tabs.

**Why it helps.** Sales and support see different tabs without either having to ignore the
other's.

## Opening it

**Where:** **Admin** → **Apps**

1. Click **Admin** in the top menu.
2. Click **Apps** in the row of tabs.

![Apps](../img/shots/admin/apps-full.png)

## Creating one

**Where:** **Admin** → **Apps** → **New App**

1. Click **Admin**, then **Apps**.
2. Click **New App**.
3. Give it a name people will recognise, such as "Sales".
4. Choose which tabs it shows.
5. Click **Save**.

The tabs available here are the ones turned on under [Tabs](./tabs.md). Turn a tab on there
first if it is missing.

## Deciding who gets which app

**Where:** **Admin** → **Users** → **Assign Apps**

1. Click **Admin**, then **Users**.
2. Click **Assign Apps** above the table.
3. Tick the apps that company may use.

![Assign apps](../img/shots/admin/modal-assign-apps.png)

4. Click **Save**.

**Leaving the list blank means everybody sees every app**, not nobody. That catches people
out.

## Switching app

People switch using the grid symbol beside the logo, top left. If somebody has only one app,
there is nothing to switch to and the control does not appear.

## Giving an app its own home page

See [Home](./home.md). Choose the app in the **Default (all apps)** box and set its cards
separately.
`;

f["administration/branding.md"] = `---
title: Branding
sidebar_position: 11
---

# Branding

**What it is.** The portal's name, logo, colours and sign-in page.

**What it does.** It makes the portal look like your company instead of a product nobody has
heard of.

**Why it helps.** People trust something that looks like it belongs to their own company,
especially on the sign-in page, which is the first thing they ever see.

## Opening it

**Where:** **Admin** → **Branding**

1. Click **Admin** in the top menu.
2. Click **Branding** in the row of tabs.

![Branding](../img/shots/admin/branding-full.png)

The screen is in five panels. Everything is saved together with **Save All Branding** at the
bottom.

## Name and logo

**Where:** **Admin** → **Branding** → **Name & Logo**

![Name and logo](../img/shots/admin/branding-name-logo.png)

1. Type your company's name in the name box. This appears beside the logo and on the browser
   tab.
2. Upload a logo. A wide image with a transparent background works best, because it sits on a
   coloured bar.
3. **Remove logo** takes it away again and falls back to the name on its own.
4. Set the **Portal URL** if the box is empty — it is the address people use.

## Colours

**Where:** **Admin** → **Branding** → **Color Theme**

![Colour theme](../img/shots/admin/branding-colour-theme.png)

Pick a preset, or set your own colours. The preview updates as you choose.

Check the result with real text in front of you: a dark bar with dark text is unreadable, and
the preview is where to notice that.

## Navigation

**Where:** **Admin** → **Branding** → **Navigation**

![Navigation](../img/shots/admin/branding-navigation.png)

Sets whether people get the menu **across the top** or **down the left** by default.

It is only a default. Anybody can change it for themselves with the gear in the top bar.

## The sign-in page

**Where:** **Admin** → **Branding** → **Login Page**

![Login page](../img/shots/admin/branding-login-page.png)

The simple settings: heading, tagline, the bullet points, and the footer line.

## The sign-in designer

**Where:** **Admin** → **Branding** → **Login Design**

![Login design](../img/shots/admin/branding-login-design.png)

For full control over the sign-in page, including building it out of blocks. See
[The sign-in page](./login-design.md).

## Saving

Click **Save All Branding** at the bottom. One button saves every panel.

People see the change the next time they load a page. They do not need to sign out.
`;

f["administration/reports-dashboards.md"] = `---
title: Reports and Dashboards
sidebar_position: 8
---

# Reports and Dashboards

**What it is.** Who can see which reports and dashboards.

**What it does.** You share a report, a dashboard or a whole folder with a company, or with
chosen people inside it.

**Why it helps.** One company's reports stay out of another's sight, and you set it once
rather than report by report.

## Opening it

**Where:** **Admin** → **Reports & Dashboards**

1. Click **Admin** in the top menu.
2. Click **Reports & Dashboards** in the row of tabs.

![Reports and Dashboards](../img/shots/admin/reports-dashboards-full.png)

## Sharing something

**Where:** **Admin** → **Reports & Dashboards** → **Share**

1. Find the report, dashboard or folder in the list.
2. Click **Share**.
3. Choose the company.
4. Choose the access:

| Access | Lets them |
|---|---|
| **Read** | Open it and run it. |
| **Edit** | Open it and change it. |

5. Click **Save**.

Give **Read** unless somebody has asked to change the report. **Edit** means they can change
it for everybody it is shared with.

## Sharing with particular people

Sometimes a whole company is too broad.

1. Click **Share** on the item.
2. Choose the people instead of the company.
3. Click **Share with selected users**.

## Seeing who has access now

Each item shows **Current access** with a count. Click it to see exactly which companies and
people, and what level each has.

## Taking access away

1. Open **Current access** for the item.
2. Remove the company or person.

They lose it immediately. Anything they built on top of it stays theirs.

## Folders versus single reports

Sharing a **folder** shares everything in it, including anything added later. Sharing a single
**report** shares only that one.

Use folders for a set that belongs together — it is less work and less likely to be forgotten
when somebody adds the next report.
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Rewrote ${n} pages.`);
