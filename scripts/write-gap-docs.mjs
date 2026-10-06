/* Generator for the records and administration pages that were missing. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

/* ---------------------------------------------------------------- records */

f["your-records/activities.md"] = `---
title: Calls, tasks and meetings
sidebar_position: 8
---

# Calls, tasks and meetings

**What it is.** The panel on the right of every record, showing everything that has happened
with it.

**What it does.** It keeps calls, tasks, meetings and emails attached to the record they
concern, in date order.

**Why it helps.** Anybody opening the record sees the history. Nothing important lives only in
one person's inbox or memory.

## Adding something

1. Open the record.
2. Click **Log a Call**, **New Task**, **New Event** or **Email**.
3. Fill in the details.
4. Click **Save**.

![Logging a call](../img/shots/records/log-a-call.png)

| Button | Use it for |
|---|---|
| **Log a Call** | A call that has already happened. |
| **New Task** | Something still to do. |
| **New Event** | A meeting, with a start and end time. |
| **Email** | A message about this record. |

## Scheduling a meeting

![A new event](../img/shots/records/new-event.png)

An event has a start and an end. It appears under **Upcoming Events** on the home page of
everybody it concerns.

## Setting a task

![A new task](../img/shots/records/new-task.png)

Give it a due date and it appears under **My Tasks**. Overdue ones are marked in red.

## Narrowing the list

The **Filters** line above the timeline limits what is shown — by date, by type, or by whether
it is done.

Click **View All** to see the whole history on its own page.

![All activities](../img/shots/records/activities-view-all.png)

## Changing or removing one

Use **Edit** or **Delete** beside the entry. You can only change what you are allowed to
change.
`;

f["your-records/related-lists.md"] = `---
title: Related records
sidebar_position: 9
---

# Related records

**What it is.** The sections at the bottom of a record showing other records linked to it.

**What it does.** An account shows its contacts. A contact shows its tasks. You move between
connected records without searching.

**Why it helps.** It answers "who else is at this company" without you having to go to
Contacts and filter.

Scroll to the bottom of any record.

![A record in full](../img/shots/records/accounts-detail-full.png)

Click any name to open that record.

## What appears here

Your administrator chooses which related lists appear, and which columns each one shows, under
[Page layouts](../administration/page-layouts.md).

## If a list is empty

It says so. That means nothing is linked yet, not that something is broken.

## If a list is missing

Either the layout does not include it, or you do not have permission to see that kind of
record. Ask your administrator.
`;

f["your-records/change-owner.md"] = `---
title: Changing who owns a record
sidebar_position: 10
---

# Changing who owns a record

**What it is.** Moving a record from one person to another.

**What it does.** It changes who the record belongs to.

**Why it matters.** The owner usually decides who can see the record. Changing the owner can
change who has access, so it is not only a label.

1. Open the record.
2. Click **Change Owner**.
3. Choose the new owner.
4. Click **Save**.

![Changing the owner](../img/shots/records/change-owner.png)

## When to use it

- Somebody leaves and their accounts need a new home.
- A deal moves to a different rep.
- A record was created by the wrong person.

## What changes with it

Under **Private** sharing, the new owner can see the record and the old owner may no longer be
able to. If a rule or a management hierarchy grants access, that follows the new owner too.

If somebody says a record has "disappeared", a change of owner is the first thing to check.
See [Sharing](../administration/sharing.md).
`;

f["your-records/record-types.md"] = `---
title: Kinds of record
sidebar_position: 11
---

# Kinds of record

**What it is.** Some records come in more than one kind, and you pick which when you create
one.

**What it does.** The kind decides which fields you see and which options a drop-down offers.

**Why it helps.** One screen does not have to carry every field for every situation. A
customer and a supplier can both be accounts without sharing a cluttered form.

1. Click **New**.
2. If there is more than one kind, you are asked to pick one.

![Creating a record](../img/shots/records/new-window.png)

3. Choose, then fill in the form.

## If you are not asked

Then there is only one kind, or only one you are allowed to create. Nothing is wrong.

## Who decides

A Super Admin sets which kinds a company may use, under **Assign Record Types** in
[Users](../administration/users.md).
`;

/* ------------------------------------------------------------ administration */

f["administration/page-layouts.md"] = `---
title: Page layouts
sidebar_position: 20
---

# Page layouts

**What it is.** The editor that decides what a record page looks like.

**What it does.** You choose which fields appear, in what order, grouped into sections, and
which related lists show underneath.

**Why it helps.** Most objects have far more fields than anybody needs. A layout shows the ten
that matter and hides the rest, so the page is readable.

## Opening it

1. Open any record of the kind you want to change.
2. Click **Edit Page Layout**.

![The layout editor](../img/shots/layout/editor.png)

What you change here applies to **everybody** who sees that kind of record, not just you.

## Choosing fields

Fields you are not using are on the left. Fields on the page are on the right.

1. Pick a field on the left.
2. Click the arrow to move it across.
3. Use **Move selection up** and **Move selection down** to order it.

## Finding a field

Type in **Search fields…** above the list.

![Searching for a field](../img/shots/layout/search-fields.png)

Searching never loses a field you have already chosen — the ones on the right stay put.

## Sections

A section is a heading with fields under it, such as "Billing" or "System Information".

1. Click **Add Section**.
2. Name it.
3. Move fields into it.

![Adding a section](../img/shots/layout/add-section.png)

Use **Move section up** and **Move section down** to reorder, and **Remove section** to delete
one. Removing a section does not delete the fields or any data.

## Related lists

These are the sections at the bottom of the record.

1. Click **Add related list…**
2. Choose which records it shows.

![Adding a related list](../img/shots/layout/add-related-list.png)

## The New Record window

A record page and the **New** window can show different fields. Set the New window separately
under **New Record Window Fields** — usually a short list of just what is required.

## Saving, and starting again

Click **Save Layout** to keep it. Click **Cancel** to leave it alone.

**Reset to Default** puts the layout back to how it started. Your field choices are lost, but
no record data is touched.
`;

f["administration/sharing-defaults.md"] = `---
title: Who sees what, by default
sidebar_position: 7
---

# Who sees what, by default

**What it is.** The starting rule for each kind of record: who can see it before any other
rule applies.

**What it does.** It sets the floor. Everything else only ever opens access up from here.

**Why it matters.** This is the single most important setting in the portal. Get it wrong and
either nobody can do their job, or everybody sees everybody else's records.

Click **Admin**, then **Sharing**, then **Org-Wide Defaults**.

![Org-wide defaults](../img/shots/admin/sharing-org-wide-defaults.png)

## The three settings

| Setting | What it means |
|---|---|
| **Private** | You see only records you own. |
| **Public Read Only** | Everybody sees them. Only the owner can change them. |
| **Public Read/Write** | Everybody sees and changes them. |

## How to choose

**Start with Private and open it up.** It is much easier to grant access to the people who
need it than to work out, later, who should never have had it.

Use **Public Read Only** for reference data everybody needs and nobody should edit.

Use **Public Read/Write** only when a team genuinely shares ownership of everything.

## Grant via Hierarchy

With this on, a manager sees whatever the people they manage can see. Set who manages whom
under [Users](./users.md).

This is usually what you want. Without it, a manager has to be granted access team by team.
`;

f["administration/sharing-rules.md"] = `---
title: Sharing rules
sidebar_position: 8
---

# Sharing rules

**What it is.** A standing rule that opens up access beyond the default.

**What it does.** It says "records like this should also be visible to these people" — and it
keeps applying, to new records as well as old ones.

**Why it helps.** It is how you keep a **Private** default while still letting a team see each
other's work. You set the rule once instead of sharing records one at a time.

Click **Admin**, then **Sharing**, then **Sharing Rules**.

![Sharing rules](../img/shots/admin/sharing-rules.png)

## Making one

1. Click **New**.
2. Choose the kind of record.
3. Choose which records it covers:
   - **Owned by** certain people, or
   - **Matching criteria** — records where a field has a particular value.
4. Choose who to share with: a [public group](./public-groups.md), a role, or a company.
5. Choose the access: **Read** or **Read/Write**.
6. Click **Save**.

## A rule can only add

A sharing rule never takes access away. If somebody can already see a record, no rule here
will hide it. To restrict, use [restriction rules](./restriction-rules.md).

## Turning one off

Set it to **Inactive**. The rule is kept but stops applying, which is safer than deleting it
while you work out whether it was the cause of something.
`;

f["administration/public-groups.md"] = `---
title: Public groups
sidebar_position: 9
---

# Public groups

**What it is.** A named list of people.

**What it does.** Nothing on its own. You use it in [sharing rules](./sharing-rules.md) so a
rule can point at a group instead of listing individuals.

**Why it helps.** When somebody joins the team you add them to one group, rather than editing
every rule that should apply to them.

Click **Admin**, then **Sharing**, then **Public Groups**.

![Public groups](../img/shots/admin/public-groups.png)

## Making one

1. Click **New**.
2. Name it after the people in it, such as "Support Team".
3. Add members.
4. Click **Save**.

## What can be in one

Individual people, roles, and other groups. A group inside a group brings all of its members
with it.

## Naming them

Name a group for **who is in it**, not what it is currently used for. "Support Team" still
makes sense in a year. "Can See Invoices" stops making sense the moment you use it for
something else.
`;

f["administration/roles.md"] = `---
title: Roles
sidebar_position: 10
---

# Roles

**What it is.** A tree showing who reports to whom.

**What it does.** It records the management line, and lets access flow up it.

**Why it helps.** With **Grant via Hierarchy** on, a manager automatically sees what their
people see. You never have to build a rule for each manager.

Click **Admin**, then **Sharing**, then **Roles**.

![Roles](../img/shots/admin/roles.png)

## Setting it up

1. Click **New**.
2. Name the role.
3. Choose which role it **reports to**.
4. Click **Save**.

Then assign people to roles under [Users](./users.md).

## Roles are not permissions

A role says **whose records you can see**. A [profile](./profiles.md) or
[permission set](./permission-sets.md) says **what you can do** with them.

Somebody can be high in the hierarchy and still unable to delete anything. The two are
separate on purpose.
`;

f["administration/restriction-rules.md"] = `---
title: Restriction rules
sidebar_position: 11
---

# Restriction rules

**What it is.** A rule that narrows what somebody can see, rather than widening it.

**What it does.** Of the records a person could otherwise see, it keeps only those matching
your criteria.

**Why it matters.** This is the only thing here that takes access away. Everything else —
defaults, sharing rules, groups, hierarchy — only ever adds.

Click **Admin**, then **Sharing**, then **Restriction Rules**.

![Restriction rules](../img/shots/admin/restriction-rules.png)

## Making one

1. Click **New**.
2. Choose the kind of record.
3. Choose who it applies to.
4. Set what records must match.
5. Click **Save**.

## Use it carefully

A restriction rule can make records vanish for somebody who could see them a moment ago, and
from their side it looks like data loss.

Test with one person before applying it widely, and tell people before you turn it on.

## When it is the right tool

When somebody needs broad permission for most of their job but must not see one slice of the
data — a contractor who works on one company's records only, for example.
`;

f["administration/record-access.md"] = `---
title: Checking who can see a record
sidebar_position: 12
---

# Checking who can see a record

**What it is.** A screen that answers "who can see this, and why".

**What it does.** You pick a record and it lists everybody with access, and the reason each
one has it.

**Why it helps.** When somebody says "I cannot see this" or "why can they see this?", this
turns a guess into an answer.

Click **Admin**, then **Sharing**, then **Record Access**.

![Record access](../img/shots/admin/record-access.png)

## Using it

1. **Find a record** by name, or **Browse by owner**.
2. Pick the record.
3. The list shows everybody with access and the **Reason** for it.

## The reasons you will see

| Reason | Means |
|---|---|
| **Owner** | They own the record. |
| **Org-Wide Default** | Everybody has it, from the [default](./sharing-defaults.md). |
| **Sharing Rule** | A [rule](./sharing-rules.md) grants it. |
| **Hierarchy** | They manage somebody who has it. |

## How to use it when something is wrong

If a person is missing from this list, the fix is a sharing rule or the hierarchy — not a
permission. If they are on the list but still cannot open the record, the problem is
[permissions](./permissions.md) instead.

That distinction is the whole reason this screen exists.
`;

f["administration/login-design.md"] = `---
title: The sign-in page
sidebar_position: 21
---

# The sign-in page

**What it is.** An editor for the page people see before they sign in.

**What it does.** You build the page out of blocks — headings, text, images, logos, links —
and arrange them across the two halves of the screen.

**Why it helps.** The sign-in page is the first thing anybody sees. This lets you make it look
like your company without anybody writing code or deploying anything.

![Branding](../img/shots/admin/branding-full.png)

## Draft, preview, publish

Nothing you do takes effect until you publish. There are three states:

| Action | What happens |
|---|---|
| **Save draft** | Kept for you. Nobody else sees it. |
| **Live preview** | Shows you the result as you work. |
| **Publish** | Everybody sees it from now on. |

Work in a draft, check the preview, then publish. **Restore** puts back an earlier version if
a change was wrong.

## The blocks

Click anything in the preview to edit it. Each block has its own settings — alignment, width,
height, tone, whether it is clickable.

| Block | What it is for |
|---|---|
| **Heading** | The big line. |
| **Text** | A sentence or two. |
| **Logo** | Your uploaded logo, or an image you add. |
| **Link** | A clickable line, such as your website. |
| **Separator** | A dividing line. |
| **Spacer** | Breathing room. |
| **Eyebrow** | A small label above a heading, with an optional dot. |

## Desktop and phone

Switch between **Desktop** and **Phone** in the preview. The sign-in page is used on both, and
a layout that works on one can be cramped on the other.

## Standard or custom

**Standard** uses the built-in design with your name, logo and colours. **Custom** uses the
blocks you have built.

Switching to Standard does not delete your custom design. You can switch back.

## The credential fields are fixed

The username box, the password box and the **Log In** button cannot be moved, hidden or
imitated by anything you add here. That is deliberate: no design change can turn the sign-in
page into something that collects passwords somewhere else.
`;

f["administration/setup-assistant.md"] = `---
title: Setup Assistant
sidebar_position: 22
---

# Setup Assistant

**What it is.** A checklist that tells you whether the portal is correctly set up.

**What it does.** It checks the things the portal needs in Salesforce and reports each one as
done or needing attention.

**Why it helps.** When something does not work at all — nobody can sign in, no records appear
— this says which step was missed, instead of leaving you to guess.

## What it checks

| Check | Why it matters |
|---|---|
| Permissions on the portal's own user | Without them the portal cannot read anything. |
| Field access | New fields are invisible until access is granted. |
| The site is active | An inactive site serves nothing. |
| Email deliverability | Welcome and reset emails are silently dropped without it. |

## Reading it

**Completed** is done. **Needs attention** is not, and the item says what to do.

## When to use it

- Straight after installing.
- After adding new fields, which do not get access automatically.
- When something stops working and you want to rule out setup first.
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Wrote ${n} files.`);
