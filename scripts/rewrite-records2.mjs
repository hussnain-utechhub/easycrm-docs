/* Second part of the records rewrite, plus the roles page. Same house style. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

f["getting-started/roles.md"] = `---
title: What you can see
sidebar_position: 3
---

# What you can see

**What it is.** Your role, which decides what you can see and do in the portal.

**Why it matters.** Two people can open the same portal and see different tabs and different
records. That is not a fault — it is the role doing its job.

## The three roles

| Role | What they can do |
|---|---|
| **Standard** | See and work on their own records. Most people are this. |
| **Admin** | Everything a Standard user can, plus manage the people at their own company. |
| **Super Admin** | Everything, for every company. |

Your administrator chooses your role. You cannot change it yourself, and you cannot see what
somebody else's is unless you are an administrator.

## Finding out your own role

**Where:** your name (top right) → **Settings**

1. Click your name in the top right corner.
2. Click **Settings**.
3. Your role is shown with your other details.

![Your profile](../img/shots/profile/view.png)

## Why a tab might be missing

If a colleague has a tab you do not, one of these is true:

| Reason | Who can fix it |
|---|---|
| Your role does not include it. | Your administrator. |
| Your administrator has hidden it for your company. | Your administrator. |
| You have no permission for that kind of record. | Your administrator. |

The **Admin** tab, for example, only appears for Admins and Super Admins.

## Why a record might be missing

Seeing a tab is not the same as seeing every record in it. Two separate things decide that:

- **Permissions** — what you may do with records: read, create, edit, delete.
- **Sharing** — which records you may do it to.

You need both. If you can open **Accounts** but the list is empty, you have permission but no
sharing. Your administrator fixes that under
[Sharing](../administration/sharing.md).

If you think you should see something and do not, ask your administrator — they can check
exactly who has access and why, using
[Checking who can see a record](../administration/record-access.md).
`;

f["your-records/tasks-and-events.md"] = `---
title: Tasks and events
sidebar_position: 7
---

# Tasks and events

**What they are.** A **task** is something to do. An **event** is something in the diary, with
a start and an end.

**What they do.** They sit against the record they concern, so the next person to open that
customer can see what has happened and what is due.

**Why they help.** Follow-up stops living in one person's inbox or memory.

## Seeing your tasks

**Where:** **Task** in the top menu

1. Click **Task** in the row of tabs at the top.
2. The list opens. If it is empty, switch to the **All ...** list — see
   [Looking at a list](./lists.md).

![The Task list](../img/shots/lists/task.png)

Your open tasks also appear under **My Tasks** on the home page. Anything past its due date is
marked **Overdue** in red.

## Opening a task

1. Click the task's **Subject** — the blue text in the first column.

![A task](../img/shots/records/task-detail.png)

2. To mark it done, click **Edit**, change the status to **Completed**, and click **Save**.

## Seeing your events

**Where:** **Event** in the top menu

1. Click **Event** in the row of tabs at the top.
2. The list opens.

![The Event list](../img/shots/lists/event.png)

3. Click an event's **Subject** to open it.

![An event](../img/shots/records/event-detail.png)

Events in the future also appear under **Upcoming Events** on the home page.

## Adding one against a record

This is usually the better way, because the task or event stays attached to the customer it
concerns.

**Where:** **Accounts** → the record's name → **New Task** or **New Event**

See [Calls, tasks and meetings](./activities.md) for the full steps.

## Contacts work the same way

**Where:** **Contacts** in the top menu

![The Contacts list](../img/shots/lists/contacts.png)

Click a contact's name to open it. A contact has the same shape as an account — fields on the
left, activities on the right, related records at the bottom.

![A contact](../img/shots/records/contacts-detail.png)
`;

f["your-records/activities.md"] = `---
title: Calls, tasks and meetings
sidebar_position: 8
---

# Calls, tasks and meetings

**What it is.** The panel on the right-hand side of every record, showing everything that has
happened with it.

**What it does.** It keeps calls, tasks, meetings and emails attached to the record they
concern, in date order.

**Why it helps.** Anybody who opens the record can see the history straight away.

## Finding the panel

**Where:** **Accounts** → the record's name → the panel on the right

1. Click **Accounts** (or any tab) in the top menu.
2. Click the record's **name** to open it.
3. Look at the right-hand side of the page. The four coloured buttons at the top of that
   panel are how you add something.

![A record](../img/shots/records/accounts-detail.png)

## The four buttons

| Button | Use it for |
|---|---|
| **Email** | A message about this record. |
| **New Event** | A meeting, with a start and end time. |
| **Log a Call** | A call that has **already happened**. |
| **New Task** | Something still **to do**. |

The difference between **Log a Call** and **New Task** is time: one is a record of the past,
the other a reminder for the future.

## Logging a call

**Where:** a record → **Log a Call**

1. Open the record.
2. Click **Log a Call** in the right-hand panel.
3. A small form opens.

   ![Logging a call](../img/shots/records/log-a-call.png)

4. Type what the call was about in **Subject**.
5. Add any detail in the comments box.
6. Click **Save**.

The call appears in the timeline below, dated today.

## Setting a task

**Where:** a record → **New Task**

1. Open the record.
2. Click **New Task**.

   ![A new task](../img/shots/records/new-task.png)

3. Type a **Subject** — what needs doing.
4. Set a **Due Date**.
5. Choose who it is **Assigned To**. It defaults to you.
6. Click **Save**.

The task now appears under **My Tasks** on that person's home page.

## Scheduling a meeting

**Where:** a record → **New Event**

1. Open the record.
2. Click **New Event**.

   ![A new event](../img/shots/records/new-event.png)

3. Type a **Subject**.
4. Set the **Start** and **End** times.
5. Click **Save**.

It appears under **Upcoming Events** on the home page of everybody it concerns.

## Narrowing what the timeline shows

Under the four buttons is a line reading something like
**Filters: All time • All activities • All types**.

1. Click the small gear beside it.
2. Choose a date range, whether to show done or outstanding items, and which types.
3. The timeline redraws.

## Seeing the whole history

1. Click **View All** on the right of the activity panel.
2. The full history opens on its own page.

![All activities](../img/shots/records/activities-view-all.png)

**Expand All** opens every entry so you can read the detail without clicking each one.

## Changing or deleting an entry

1. Find the entry in the timeline.
2. Use **Edit** or **Delete** beside it.

You can only change entries you are allowed to change. If the buttons are missing, ask your
administrator.
`;

f["your-records/related-lists.md"] = `---
title: Related records
sidebar_position: 9
---

# Related records

**What it is.** The sections at the bottom of a record, showing other records linked to it.

**What it does.** An account shows its contacts. A contact shows its tasks. You move between
connected records without searching for them.

**Why it helps.** It answers "who else works at this company?" without you going to
**Contacts** and filtering.

## Finding them

**Where:** **Accounts** → the record's name → scroll to the bottom

1. Click **Accounts** (or any tab) in the top menu.
2. Click the record's **name** to open it.
3. Scroll to the bottom of the page.

Each related list is a small table with its own heading.

![A record in full](../img/shots/records/accounts-detail-full.png)

## Using them

- Click any **name** in a related list to open that record.
- If a list is long, it shows the first few with a link to see the rest.
- An empty list says so. That means nothing is linked yet — not that something is broken.

## If a related list is missing

Two possible reasons:

| Reason | Who fixes it |
|---|---|
| It is not on the page layout. | An administrator, under [Page layouts](../administration/page-layouts.md). |
| You have no permission for that kind of record. | An administrator, under [Permissions](../administration/permissions.md). |

An administrator chooses which related lists appear and which columns each shows.
`;

f["your-records/change-owner.md"] = `---
title: Changing who owns a record
sidebar_position: 10
---

# Changing who owns a record

**What it is.** Moving a record from one person to another.

**What it does.** It changes who the record belongs to.

**Why it matters.** The owner usually decides who can see the record. Changing the owner can
change who has access, so this is not just a label.

## Changing the owner

**Where:** **Accounts** → the record's name → **Change Owner**

1. Click **Accounts** (or any tab) in the top menu.
2. Click the record's **name** to open it.
3. Click **Change Owner** at the top right of the record.
4. A window opens.

   ![Changing the owner](../img/shots/records/change-owner.png)

5. Start typing the new owner's name and pick them from the list.
6. Click **Save**.

The record now shows the new owner.

## When you would do this

- Somebody leaves and their accounts need a new home.
- A deal moves to a different rep.
- A record was created by the wrong person.

## What else changes

This is the part people miss.

Under **Private** sharing, the new owner can now see the record — and the previous owner may
no longer be able to. If access came from a sharing rule or from a manager relationship, that
follows the new owner too.

So if a colleague says a record has "disappeared", a change of owner is the first thing to
check. An administrator can see exactly who has access and why, under
[Checking who can see a record](../administration/record-access.md).

## If the button is missing

You do not have permission to change the owner of that record. Ask your administrator.
`;

f["your-records/record-types.md"] = `---
title: Kinds of record
sidebar_position: 11
---

# Kinds of record

**What it is.** Some records come in more than one kind, and you choose which when you create
one.

**What it does.** The kind decides which fields you see on the form and which options the
drop-downs offer.

**Why it helps.** One screen does not have to carry every field for every situation. A
customer and a supplier can both be accounts without sharing one cluttered form.

## Choosing a kind

**Where:** **Accounts** → **New** → pick a kind

1. Click **Accounts** (or any tab) in the top menu.
2. Click **New** at the top right of the list.
3. If there is more than one kind available, you are asked to choose before the form appears.

   ![Creating a record](../img/shots/records/new-window.png)

4. Pick the kind.
5. Fill in the form and click **Save**.

## If you are not asked

Then there is only one kind, or only one you are allowed to create. Nothing is wrong — the
portal skips the question rather than showing you a list of one.

## Changing the kind later

Open the record, click **Edit**, and change the record type field if it is there. If it is
not, you do not have permission to change it.

Changing the kind can change which fields are shown, so a value may stop being visible. It is
not deleted — it just is not on the new layout.

## Who decides which kinds are available

A Super Admin, under **Assign Record Types** in [Users](../administration/users.md). It is set
per company, so two companies on the same portal can offer different kinds.
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Rewrote ${n} pages.`);
