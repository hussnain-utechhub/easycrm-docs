/* Final batch: sharing panels, remaining admin, remaining reports, account pages. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

const SHARING_NAV = "**Where:** **Admin** → **Sharing** → ";

f["administration/sharing-defaults.md"] = `---
title: Who sees what, by default
sidebar_position: 7
---

# Who sees what, by default

**What it is.** The starting rule for each kind of record: who can see it before any other
rule applies.

**What it does.** It sets the floor. Everything else only ever raises access from here.

**Why it matters.** This is the most important setting in the portal. Get it wrong and either
nobody can do their job, or everybody sees everybody else's customers.

## Opening it

${SHARING_NAV}**Org-Wide Defaults**

1. Click **Admin** in the top menu.
2. Click **Sharing** in the row of tabs.
3. Click **Org-Wide Defaults**.

![Org-wide defaults](../img/shots/admin/sharing-org-wide-defaults.png)

Each kind of record has its own setting, so accounts and tasks can be different.

## Setting one

1. Find the kind of record in the list.
2. Click **Edit** beside it.
3. Choose the default access.
4. Click **Save**.

| Setting | What it means |
|---|---|
| **Private** | You see only records you own. |
| **Public Read Only** | Everybody sees them. Only the owner can change them. |
| **Public Read/Write** | Everybody sees and changes them. |

## How to choose

**Start with Private and open it up.** It is much easier to grant access to the people who
need it than to work out, months later, who should never have had it.

Use **Public Read Only** for reference data everybody needs and nobody should edit.

Use **Public Read/Write** only where a team genuinely shares ownership of everything, which is
rarer than people expect.

## Grant via Hierarchy

Beside each setting is **Grant via Hierarchy**.

With it on, a manager automatically sees whatever the people they manage can see. Set who
manages whom under [Roles](./roles.md).

Leave it on unless you have a specific reason not to. Without it you have to build a sharing
rule for every manager, and keep adding to it as the team changes.

## Changing it later

You can, and the change takes effect immediately.

**Tightening** a default — Public to Private — can make records disappear for people who could
see them a minute ago. Tell people before you do it, and check with
[Record Access](./record-access.md) first.
`;

f["administration/sharing-rules.md"] = `---
title: Sharing rules
sidebar_position: 8
---

# Sharing rules

**What it is.** A standing rule that opens access up beyond the default.

**What it does.** It says "records like this should also be visible to these people", and
keeps applying — to new records as well as the ones that exist today.

**Why it helps.** It is how you keep a **Private** default while still letting a team see each
other's work. You set the rule once instead of sharing records one at a time.

## Opening it

${SHARING_NAV}**Sharing Rules**

1. Click **Admin** in the top menu.
2. Click **Sharing**, then **Sharing Rules**.

![Sharing rules](../img/shots/admin/sharing-sharing-rules.png)

## Creating one

1. Click **New**.
2. Choose the **Object** — the kind of record the rule covers.
3. Choose which records it applies to:
   - **Owned by** — records belonging to certain people, a role or a group.
   - **Matching criteria** — records where a field has a particular value, such as Region
     equals North.
4. Choose who to **Share With**: a [public group](./public-groups.md), a
   [role](./roles.md), or a company.
5. Choose the **Access**: **Read** or **Read/Write**.
6. Click **Save**.

The rule applies straight away, to existing records as well as future ones.

## Owned by, or matching criteria?

| Use | When |
|---|---|
| **Owned by** | The team is the thing. "Everything the support team owns." |
| **Matching criteria** | The record is the thing. "Every account in the North region." |

Criteria rules keep working when people change jobs, because they follow the data rather than
the person.

## A rule can only ever add

A sharing rule never takes access away. If somebody can already see a record, no rule here
will hide it.

To restrict, use a [restriction rule](./restriction-rules.md) — the only thing in the portal
that narrows access.

## Turning one off

Set it to **Inactive** rather than deleting it.

The rule is kept but stops applying. That is far safer while you work out whether it was the
cause of something, and you can switch it back on in one click.

## Checking a rule did what you meant

Open [Record Access](./record-access.md), find a record the rule should cover, and look at the
**Reason** column. A rule that is working shows up there by name.
`;

f["administration/public-groups.md"] = `---
title: Public groups
sidebar_position: 9
---

# Public groups

**What it is.** A named list of people.

**What it does.** Nothing on its own. You use it in [sharing rules](./sharing-rules.md), so a
rule can point at one group instead of listing individuals.

**Why it helps.** When somebody joins the team you add them to one group, rather than editing
every rule that should apply to them.

## Opening it

${SHARING_NAV}**Public Groups**

1. Click **Admin** in the top menu.
2. Click **Sharing**, then **Public Groups**.

![Public groups](../img/shots/admin/sharing-public-groups.png)

## Creating one

1. Click **New**.
2. Name it after the people in it, such as "Support Team".
3. Add members.
4. Click **Save**.

## What can go in a group

| Member | Effect |
|---|---|
| A person | Just them. |
| A role | Everybody in that role. |
| Another group | Everybody in that group, including its own nested members. |

A group inside a group brings all of its members with it, so you can build "Everybody in
Sales" out of smaller groups without listing anybody twice.

## Naming them

Name a group for **who is in it**, not what it is currently used for.

"Support Team" still makes sense in a year. "Can See Invoices" stops making sense the moment
you use the same group for something else — and somebody will.

## Using one

Open [Sharing Rules](./sharing-rules.md), create a rule, and choose the group under **Share
With**.

## Changing membership

Add or remove people at any time. Every rule using the group follows immediately — that is the
whole point of groups.
`;

f["administration/roles.md"] = `---
title: Roles
sidebar_position: 10
---

# Roles

**What it is.** A tree showing who reports to whom.

**What it does.** It records the management line, and lets access flow up it.

**Why it helps.** With **Grant via Hierarchy** on, a manager automatically sees what their
people see. You never have to build a rule for each manager, or remember to update one when
the team changes.

## Opening it

${SHARING_NAV}**Roles**

1. Click **Admin** in the top menu.
2. Click **Sharing**, then **Roles**.

![Roles](../img/shots/admin/sharing-roles.png)

## Creating a role

1. Click **New**.
2. Name the role after the job, such as "Sales Manager".
3. Choose which role it **Reports To**. Leave it empty for the top of the tree.
4. Click **Save**.

Build from the top down, so the role you need to report to already exists.

## Putting people in roles

**Where:** **Admin** → **Users** → the person's row → **Set portal role**

1. Click **Admin**, then **Users**.
2. Find the person.
3. Click **Set portal role** in their row and choose the role.

## How access flows

Access flows **upwards only**. A manager sees what their people see. The people do not see
what their manager sees.

This only happens if **Grant via Hierarchy** is on for that kind of record — see
[Who sees what, by default](./sharing-defaults.md).

## Roles are not permissions

This catches people out, so it is worth being plain about:

| Thing | Decides |
|---|---|
| **Role** | Whose records you can see. |
| [Profile](./profiles.md) / [permissions](./permissions.md) | What you may do with them. |

Somebody can be at the top of the hierarchy and still unable to delete anything. The two are
deliberately separate.

## Keeping it current

When somebody changes job, change their role. If you do not, their old manager keeps seeing
their records and their new one does not.
`;

f["administration/restriction-rules.md"] = `---
title: Restriction rules
sidebar_position: 11
---

# Restriction rules

**What it is.** A rule that narrows what somebody can see, rather than widening it.

**What it does.** Of the records a person could otherwise see, it keeps only those matching
your criteria.

**Why it matters.** This is the **only** thing in the portal that takes access away.
Everything else — defaults, sharing rules, groups, hierarchy — only ever adds.

## Opening it

${SHARING_NAV}**Restriction Rules**

1. Click **Admin** in the top menu.
2. Click **Sharing**, then **Restriction Rules**.

![Restriction rules](../img/shots/admin/sharing-restriction-rules.png)

## Creating one

1. Click **New**.
2. Choose the **Object** — the kind of record.
3. Choose who it **Applies To** — a person, a role, or a group.
4. Set what records must match for them to keep seeing them.
5. Click **Save**.

From then on, those people see only records that match.

## Use it carefully

A restriction rule can make records vanish for somebody who could see them a minute ago, and
from their side it looks exactly like data loss.

Three habits worth keeping:

1. **Test with one person first**, not a whole role.
2. **Tell people before you turn it on.**
3. **Check with [Record Access](./record-access.md)** afterwards, on a record you expect them
   to keep and one you expect them to lose.

## When it is the right tool

When somebody needs broad permission for most of their job but must not see one slice of the
data — a contractor who works on one company's records only, for example.

If you find yourself reaching for a restriction rule often, the
[default](./sharing-defaults.md) is probably too open. Tightening the floor is usually
cleaner than cutting people back one rule at a time.

## Turning one off

Set it to **Inactive**. Access returns immediately to whatever the other rules allow.
`;

f["administration/record-access.md"] = `---
title: Checking who can see a record
sidebar_position: 12
---

# Checking who can see a record

**What it is.** A screen that answers "who can see this, and why".

**What it does.** You pick a record, and it lists everybody with access and the reason each
one has it.

**Why it helps.** When somebody says "I cannot see this", or "why can they see this?", this
turns a guess into an answer in about ten seconds.

## Opening it

${SHARING_NAV}**Record Access**

1. Click **Admin** in the top menu.
2. Click **Sharing**, then **Record Access**.

![Record access](../img/shots/admin/sharing-record-access.png)

## Finding a record

Two ways:

- **Find a record** — type the name.
- **Browse by owner** — pick a person and look through what they own.

Click the record. The list of everybody with access appears.

## Reading the reasons

The **Reason** column is the useful part, because it tells you what to change.

| Reason | Means | To change it |
|---|---|---|
| **Owner** | They own the record. | [Change the owner](../your-records/change-owner.md). |
| **Org-Wide Default** | Everybody has it. | [Defaults](./sharing-defaults.md). |
| **Sharing Rule** | A rule grants it. | [Sharing rules](./sharing-rules.md). |
| **Hierarchy** | They manage somebody who has it. | [Roles](./roles.md). |

## Using it to solve the two common complaints

**"I cannot see this record."**

Look for the person in the list.

- **Not there?** The problem is sharing. Add a [sharing rule](./sharing-rules.md), or check
  the [default](./sharing-defaults.md).
- **There, but they still cannot open it?** The problem is
  [permissions](./permissions.md) — they have the record but not Read on that object.

That single distinction is the whole reason this screen exists, and it saves a great deal of
guessing.

**"Why can they see this?"**

Find them in the list and read the reason. It names the rule, so you know exactly what to
change.

## Before you tighten anything

Check here first. It shows who is about to lose access, which is much better than finding out
from the people who lost it.
`;

f["your-account/profile.md"] = `---
title: Your profile
sidebar_position: 1
---

# Your profile

**What it is.** Your own details, and the settings that affect only you.

**Why it matters.** Nothing you change here affects anybody else.

## Opening it

**Where:** your name (top right) → **Settings**

1. Click your name in the top right corner of the screen.
2. Click **Settings**.

![Your profile](../img/shots/profile/view.png)

## What you can see

| Detail | Can you change it? |
|---|---|
| Your name | Usually yes. |
| Your username | No — your administrator sets it. |
| Your email address | Usually yes. Password resets go here, so keep it current. |
| Your role | No. See [What you can see](../getting-started/roles.md). |
| Your company | No. |

![Settings](../img/shots/settings/overview.png)

## Changing a detail

1. Click into the field.
2. Change it.
3. Click **Save**.

## Your password

See [Changing your password](./password.md).

## How the portal looks to you

That is not here — it is the **gear** in the top bar. See
[Getting around](../getting-started/the-screen.md).

The whole page looks like this:

![Your profile in full](../img/shots/profile/view-full.png)
`;

f["your-account/password.md"] = `---
title: Changing your password
sidebar_position: 2
---

# Changing your password

**What it is.** Setting a new password for yourself.

**Why it matters.** The password your administrator sent arrived by email, which means it has
been sitting in an inbox. Changing it to something only you know is worth doing on your first
day.

## Changing it

**Where:** your name (top right) → **Settings** → **Change Password**

1. Click your name in the top right corner.
2. Click **Settings**.
3. Click **Change Password**.

   ![Changing your password](../img/shots/settings/change-password.png)

4. Type your **current** password.
5. Type your **new** password.
6. Type the new password again to confirm it.
7. Click **Save**.

You stay signed in. Use the new password next time.

## If it will not save

| Message | What to do |
|---|---|
| The current password is wrong | Check for typing mistakes and Caps Lock. |
| The two new passwords do not match | Retype both. |
| The new password is not acceptable | Make it longer, and mix letters and numbers. |

## If you cannot remember the current one

You cannot change it from here — you need the old one.

Sign out and use **Forgot password?** on the sign-in page instead. See
[Signing in](../getting-started/sign-in.md).

Your administrator can also set a new one for you.

## Choosing a password

Length matters more than symbols. Three or four unrelated words are both easier to remember
and harder to guess than one short word with a number stuck on the end.

Do not reuse a password from somewhere else.
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Rewrote ${n} pages.`);
