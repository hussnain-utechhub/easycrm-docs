/*
 * Rewrite of "Getting started" and "Your records" in the fuller house style:
 *
 *   - every task opens with a "Where:" path using arrows, so you always know how you got there
 *   - every step starts from the top menu, not from "you are already on a list"
 *   - what you see on screen is described, not assumed
 */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

f["getting-started/sign-in.md"] = `---
title: Signing in
sidebar_position: 1
---

# Signing in

**What it is.** How you get into the portal.

**What you need.** A username and a password. Your administrator sends these to you by email
when your account is created.

**What you do not need.** Anything installed. The portal runs in your normal web browser —
Chrome, Edge, Firefox or Safari — on a computer, tablet or phone.

## Signing in for the first time

**Where:** the web address your administrator sent you

1. Open your web browser.
2. Type in the web address your administrator gave you, and press Enter.
3. The sign-in page opens. It has two halves: your company's picture on the left, and the
   sign-in box on the right.

   ![The sign-in page](../img/shots/login/sign-in.png)

4. Click the **Username** box and type your username.

   Your username is usually short, like \`jsmith\`. It is **not** your email address, unless
   your administrator set it up that way.

5. Click the **Password** box and type your password.

   The password is hidden as you type. Click the small eye symbol at the right of the box if
   you want to check what you have typed.

6. Click the black **Log In** button.

You are now on the home page.

## If your password does not work

A message appears in red above the boxes.

![A rejected sign-in](../img/shots/login/wrong-password.png)

Nearly always it is one of these:

- A typing mistake. Click the eye symbol and check the password.
- **Caps Lock** is on. Passwords care about capital letters.
- An extra space at the start or end, from copying and pasting.

Try again carefully. If it still fails, use **Forgot password?** below.

## If you forget your password

**Where:** sign-in page → **Forgot password?**

1. On the sign-in page, click **Forgot password?** under the password box.
2. The page changes to ask for your username or email address.

   ![Forgot password](../img/shots/login/forgot-password.png)

3. Type your username, or the email address your account uses.
4. Click **Send reset email**.
5. Check your email. A new password arrives within a few minutes.
6. Go back to the sign-in page and sign in with the new password.

Then change it to something you will remember — see
[Changing your password](../your-account/password.md).

**If no email arrives**, check your spam folder first. If it is not there, your administrator
can set a new password for you directly.

## Signing out

**Where:** your name (top right) → **Log Out**

1. Click your name in the top right corner of the screen.
2. Click **Log Out**.

Always sign out on a shared or public computer.
`;

f["getting-started/the-screen.md"] = `---
title: Getting around
sidebar_position: 2
---

# Getting around

**What it is.** The bar across the top of the screen, which is the same on every page.

**Why it matters.** Once you know these few controls you can reach anything in the portal.
This is the one page worth reading properly before anything else.

![The home page](../img/shots/home/overview.png)

## The two rows at the top

The very top row, from left to right:

| What you see | Where it is | What it does |
|---|---|---|
| Your company's logo | Far left | Takes you back to the home page. |
| **Search...** | Middle | Finds any record by name. |
| A gear symbol | Right | Changes how the portal looks **to you**. |
| A bell | Right | Your notifications. A red number means unread ones. |
| Your name | Far right | Settings, and **Log Out**. |

The second row is your **tabs**. These are the main sections — **Home**, then one tab per kind
of record (**Accounts**, **Contacts**, **Task**, **Event**), then **Reports**, **Dashboards**,
and **Admin** if you are an administrator.

The tab you are on is underlined in blue.

**Your tabs may not match this picture.** Your administrator chooses which tabs your company
sees, and your role affects it too. See [What you can see](./roles.md).

## The home page

The home page has four parts.

**The number tiles** across the top show how many records of each kind you can see. Click one
to open that list.

**My Tasks** lists tasks that are yours and not yet done. Anything past its due date is marked
**Overdue** in red.

**Recent Records** lists what you opened lately, newest first. This is usually the fastest way
back to something you were working on five minutes ago.

**Quick links** are shortcuts to each tab, the same as the tabs above.

Here is the whole page:

![The whole home page](../img/shots/home/full.png)

## Searching for anything

**Where:** **Search...** at the top → type → click a result

1. Click the **Search...** box in the middle of the top bar.
2. Start typing a name. You do not need the whole thing — a few letters is enough.
3. Results appear underneath as you type, grouped by kind of record.

   ![Searching](../img/shots/shell/search.png)

4. Click a result to open it.

Search looks across every kind of record you are allowed to see, so it is the quickest way to
find something when you are not sure which tab it lives under.

## Your notifications

**Where:** the bell (top right)

1. Click the bell in the top right.
2. The list opens, newest first.

   ![Notifications](../img/shots/shell/notifications.png)

3. Click one to open what it refers to.

The red number on the bell is how many you have not read.

## Changing how the portal looks

**Where:** the gear (top right)

1. Click the gear symbol in the top right.
2. The panel opens.

   ![View settings](../img/shots/shell/view-settings.png)

3. Under **Navigation**, choose where the menu sits:
   - **Top bar** — tabs across the top, as in these pictures.
   - **Left sidebar** — tabs down the left side.
4. Under **Theme**, click a colour.
5. Click **Save**.

**This changes only what you see.** Nobody else is affected, and no data changes.

## Your account menu

**Where:** your name (top right)

1. Click your name in the top right.

   ![The account menu](../img/shots/shell/user-menu.png)

2. From here you can reach:

| Item | What it does |
|---|---|
| **Settings** | Your profile and your password. |
| **Log Out** | Signs you out. |
| **Comfy** / **Compact** | How much space rows take up. **Compact** fits more on screen. |
`;

f["your-records/lists.md"] = `---
title: Looking at a list
sidebar_position: 1
---

# Looking at a list

**What it is.** A table showing many records of one kind — all your accounts, for example.

**What it does.** It shows them in rows, and lets you narrow, sort and search them.

**Why it helps.** It is the fastest way to find a record, and the starting point for most work
in the portal.

## Opening a list

**Where:** the tab for the records you want — for example **Accounts**

1. Look at the row of tabs across the top of the screen.
2. Click the tab for the kind of record you want: **Accounts**, **Contacts**, **Task** or
   **Event**.
3. The list opens.

![The Accounts list](../img/shots/lists/accounts.png)

## What you are looking at

Reading the screen from the top:

- The **kind of record** in small grey text, for example "Accounts".
- The **name of the list** in large text, for example "All Accounts". This is which *set* of
  records you are looking at — see below.
- **How many records** are in it, and when it was last updated.
- **New** on the right, to add a record.
- **Search this list...**, and three small buttons for refresh, columns and filters.
- The table itself. The first column is the record's name, in blue. Blue means clickable.

## Switching to a different list

A tab can hold several lists. **Recently Viewed** is only what you opened lately, so on a new
account it is often empty — that is normal, not a fault.

**Where:** a tab → the list name at the top → choose a list

1. Click the list name at the top (for example **Recently Viewed**).
2. A menu opens showing every list you can use.

   ![Choosing a list](../img/shots/lists/view-picker.png)

3. Click the one you want. **All Accounts** shows every account you are allowed to see.

To make a list open by default, click the **pin** symbol next to its name. Next time you open
this tab, it starts there.

## Searching inside a list

**Where:** a tab → **Search this list...**

1. Click the **Search this list...** box above the table on the right.
2. Type part of a name.
3. The table narrows as you type.

![Searching a list](../img/shots/lists/search-in-list.png)

This searches **only the list you are on**. To search everything, use **Search...** in the top
bar instead.

## Sorting

1. Click a column heading — for example **Account Name**.
2. The list sorts by that column. A small arrow appears showing the direction.
3. Click the same heading again to reverse it.

Each column heading also has a small arrow on its right, which opens a menu with the same
sorting options.

![A column menu](../img/shots/lists/column-actions.png)

## Doing something to one row

**Where:** a tab → the arrow at the end of a row

1. Find the row you want.
2. Click the small arrow at the far right of that row.
3. A short menu opens with the things you can do to just that record.

![Row actions](../img/shots/lists/row-actions.png)

## Opening a record from the list

Click the record's **name** — the blue text in the first column. See
[Opening a record](./open-a-record.md).
`;

f["your-records/open-a-record.md"] = `---
title: Opening a record
sidebar_position: 4
---

# Opening a record

**What it is.** The page for one single record, with everything known about it.

**What it does.** It shows the record's fields, plus the calls, tasks, files and linked
records that belong to it.

**Why it helps.** Everything about one customer sits in one place, so you are not piecing it
together from email and memory.

## Getting to a record

**Where:** **Accounts** (or any tab) → click the record's **name**

1. Click the tab for the kind of record you want — **Accounts**, for example.
2. The list opens. If it is empty, switch to the **All ...** list — see
   [Looking at a list](./lists.md).
3. Find the record you want. Use **Search this list...** if there are many.
4. Click the record's **name** in the first column. It is blue, which means it is a link.

The record opens.

![A record](../img/shots/records/accounts-detail.png)

**A faster way:** if you know the name, type it into **Search...** in the top bar and click the
result. That skips the list entirely.

## What you are looking at

Across the top of the record:

| What you see | What it does |
|---|---|
| The kind of record, and its name | Tells you where you are. |
| **Back to list** | Returns to the list you came from. |
| **Edit** | Lets you change the fields — see [Changing a record](./edit-a-record.md). |
| **Change Owner** | Moves the record to somebody else. |

Below that the page is in two halves.

**On the left: Information.** All the fields on this record, in sections. Each section has a
small arrow by its heading — click it to fold the section away.

**On the right: the activity panel.** Calls, tasks, meetings and emails attached to this
record. See [Calls, tasks and meetings](./activities.md).

**At the bottom: related records.** Other records linked to this one — the contacts at this
account, for example. See [Related records](./related-lists.md).

## Blue text is clickable

Anywhere on the record, blue text does something:

| Blue text | What clicking it does |
|---|---|
| Another record's name | Opens that record. |
| An email address | Starts an email to it. |
| A phone number | Starts a call, on a device that can make them. |
| A web address | Opens it in a new tab. |

## Going back

Click **Back to list** at the top right, or your browser's back button. Both work.

## Scrolling through everything

A record can be long. Here is a whole one:

![A record in full](../img/shots/records/accounts-detail-full.png)

If a field you expect is missing, it is either empty, or your administrator has left it off
this layout. See [Page layouts](../administration/page-layouts.md).
`;

f["your-records/edit-a-record.md"] = `---
title: Changing a record
sidebar_position: 5
---

# Changing a record

**What it is.** Changing the information stored on a record.

**What it does.** Your change is saved straight away, and everybody who can see the record
sees the new value.

**Why it matters.** There is no draft and no approval step. When you click **Save**, it is
live for everybody.

## Changing a record

**Where:** **Accounts** → the record's name → **Edit**

1. Click the tab for the kind of record — **Accounts**, for example.
2. Click the record's **name** to open it.
3. Click the blue **Edit** button at the top right.
4. The fields become boxes you can type in.

   ![Editing a record](../img/shots/records/edit.png)

5. Click into any field and change it.
6. Click **Save** at the bottom.

To abandon your changes, click **Cancel**. Nothing is saved.

## Changing one field quickly

You do not always need **Edit**.

1. Open the record.
2. Hover over the field you want to change. A small pencil appears on its right.
3. Click the pencil.
4. Change the value.
5. Click **Save**.

This is quicker when you only need to fix one thing.

## If a field will not change

Some fields cannot be edited. There are three reasons:

| Reason | What it looks like | What to do |
|---|---|---|
| The system works it out | No pencil appears | Nothing — it updates itself. |
| You do not have permission | No pencil appears | Ask your administrator. |
| The record is read-only to you | **Edit** is missing | Ask your administrator. |

Which one it is comes down to [permissions](../administration/permissions.md) and
[sharing](../administration/sharing.md).

## If Save shows an error

A message appears naming the field that is wrong. The usual causes:

- A **required** field is empty. Required fields have a red line on their left.
- A date, number or email address is in the wrong format.
- A value is not one of the allowed options.

Fix the field the message names, then click **Save** again. Your other changes are still
there — nothing is lost.
`;

f["your-records/create-a-record.md"] = `---
title: Adding a record
sidebar_position: 6
---

# Adding a record

**What it is.** Creating a record that did not exist before.

**When to use it.** For one or two records. To add many at once, use a spreadsheet instead —
see [CSV Import](../administration/csv-import.md).

## Adding one

**Where:** **Accounts** (or any tab) → **New**

1. Click the tab for the kind of record you want to add — **Accounts**, for example.
2. The list opens.
3. Click the **New** button at the top right of the list.
4. A window opens with empty fields.

   ![Adding a record](../img/shots/records/new-window.png)

5. Fill in the fields.

   Fields with a **red line on the left** are required. You cannot save without them.

6. Click **Save**.

The new record opens so you can check it.

## If you are asked to pick a kind first

Some records come in more than one kind, and you are asked which before the form appears.
Choose, then carry on. See [Kinds of record](./record-types.md).

## If the New button is missing

You do not have permission to create that kind of record. Ask your administrator — it is set
under [Permissions](../administration/permissions.md).

## Adding many at once

For more than a handful, a spreadsheet is far faster. An administrator can load hundreds of
records in one go — see [CSV Import](../administration/csv-import.md).
`;

f["your-records/filters.md"] = `---
title: Filtering a list
sidebar_position: 2
---

# Filtering a list

**What it is.** Rules that hide the records you are not interested in.

**What it does.** Only records matching your rules stay on screen. Nothing is deleted — the
rest are just hidden from this view.

**Why it helps.** A list of fifty thousand records answers nothing. A filtered list of twelve
answers a question.

## Adding a filter

**Where:** **Accounts** → the filter button (top right of the list) → **Add Filter**

1. Click the tab for the records you want — **Accounts**, for example.
2. Look at the three small buttons above the table on the right. The last one, shaped like a
   funnel, is the filter button. Click it.
3. A panel opens on the right.

   ![The Filters panel](../img/shots/lists/filters-panel.png)

4. Click **Add Filter**.
5. Choose three things:
   - **Field** — what to look at, such as Billing City.
   - **Operator** — how to compare it, such as "equals" or "contains".
   - **Value** — what to compare it to, such as London.
6. Click **Save**.

The list now shows only matching records, and the count at the top changes.

## Using more than one filter

Add as many as you need, the same way.

By default a record must match **every** filter. Two filters means both must be true.

## Changing that with filter logic

**Where:** the filters panel → **Add Filter Logic**

Each filter has a number — 1, 2, 3 — in the order you added them. Filter logic lets you
combine them differently.

1. Click **Add Filter Logic** at the bottom of the panel.
2. Type a rule using the numbers:

| Rule | Means |
|---|---|
| 1 AND 2 | Both must be true. This is the default. |
| 1 OR 2 | Either will do. |
| 1 AND (2 OR 3) | Filter 1, plus either 2 or 3. |
| 1 AND NOT 2 | Filter 1, but not filter 2. |

3. Click **Save**.

Brackets work the way you would expect from arithmetic.

## Removing a filter

1. Open the filters panel.
2. Click the small cross beside the filter.
3. Click **Save**.

To clear everything at once, remove each filter, or switch to a different list.
`;

f["your-records/columns.md"] = `---
title: Choosing columns
sidebar_position: 3
---

# Choosing columns

**What it is.** Control over which fields the list shows as columns, and in what order.

**What it does.** You move fields into and out of the table, and arrange them left to right.

**Why it helps.** Each person sees the fields that matter to their job, instead of scrolling
sideways past twenty they never use. Your choice is remembered for next time.

## Changing the columns

**Where:** **Accounts** → the gear button (top right of the list)

1. Click the tab for the records you want — **Accounts**, for example.
2. Above the table on the right there are three small buttons. The middle one is a gear.
   Click it.
3. A window opens with two lists side by side.

   ![Choosing columns](../img/shots/lists/choose-columns.png)

   - **Available** on the left — fields not currently shown.
   - **Selected** on the right — the columns in your list now, top to bottom matching left to
     right in the table.

4. To add a column: click a field on the left, then click the right-pointing arrow between
   the lists.
5. To remove one: click a field on the right, then click the left-pointing arrow.
6. To reorder: click a field on the right, then use the up and down arrows.
7. Click **Save**.

The table redraws with your columns.

## Finding a field quickly

There can be a great many fields. Type into the search box above either list to narrow it
down.

Searching never loses a field you have already chosen — the ones on the right stay where they
are.

## Who this affects

Only you. Other people keep their own columns.

To change what **everybody** sees on the record page itself, an administrator uses
[Page layouts](../administration/page-layouts.md) instead.
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Rewrote ${n} pages.`);
