/* Enterprise-depth rewrite of the admin access model, plus the pages that were missing. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

/* ---------------------------------------------- the access model, as a landing */
f["admin/access/index.md"] = `---
title: Permissions
sidebar_position: 0
slug: /admin/access
---

# Permissions and access

Access in EasyCRM is two independent questions, and almost every access problem comes from
answering only one of them.

| Question | Answered by | Set where |
|---|---|---|
| **What** may this person do? | Permissions | [Permissions](./permissions.md) |
| **Which** records may they do it to? | Sharing | [Sharing](../sharing/index.md) |

Somebody needs **both**. The failure modes look identical to the user and have completely
different fixes:

- **Read permission, no sharing** → the tab opens and the list is empty.
- **Sharing, no read permission** → nothing at all, or an error.

Learning to tell those two apart is most of administering this product. The fastest way is
[Checking who can see a record](../sharing/record-access.md), which names the reason.

## The building blocks

| Tool | Grants | Scope |
|---|---|---|
| [Permissions](./permissions.md) | Read, create, edit, delete, layout editing, field editing | One person, one object |
| [Profiles](./profiles.md) | A baseline of the above | A kind of person |
| [Permission sets](./permission-sets.md) | Extra access on top | Named individuals |

## The order to set them up

1. **Profile** for the baseline — what everybody doing that job needs.
2. **Permission sets** for the exceptions — the three people who need more.
3. **Direct permissions** only for genuine one-offs.

Setting permissions person by person works and does not scale. Six months later nobody can say
why a particular user has what they have.

## One rule that catches everybody

**Unticking a permission is a baseline, not a lock.** If the person also holds a permission set
that grants the same thing, the permission set wins.

So if you remove access and it still works, stop looking at permissions and look for a
permission set.
`;

/* ---------------------------------------------- account scoping (was undocumented) */
f["admin/sharing/account-scoping.md"] = `---
title: Account scoping
sidebar_position: 7
---

# Account scoping

## What it is

Tying a portal user to an **Account**, so they see only the records belonging to that account.

This is the arrangement most customer portals need: every client signs in to the same portal
and sees only their own data, without you writing a sharing rule per client.

## When to use it

**Use it when** your portal users are customers, partners or franchisees — people who belong
to one account and must never see another's records.

**Do not use it when** your portal users are your own staff. Staff usually need to see many
accounts, and scoping them to one is exactly wrong. Use
[sharing rules](./rules.md) and the [role hierarchy](./roles.md) instead.

## How it works

Three settings do the work, and they build on each other.

| Setting | Does |
|---|---|
| The user's **Account** | Ties that person to one account |
| **Account scope field** | Names the field on each object that points back to an account |
| **Parent field** | Lets child records inherit the scope from their parent |

Once set, every list, report and dashboard that person opens is filtered to their account
automatically. There is nothing for them to switch on and nothing they can switch off.

## Setting it up

### 1 · Tie the user to an account

**Where:** **Admin** → **Users** → the person → **Account**

Set the account they belong to. A user with no account is not scoped at all — they fall back
to ordinary [sharing](./index.md).

### 2 · Name the scope field per object

For each object, say which field points at the account.

| Object | Typical scope field |
|---|---|
| Account | The record itself |
| Contact | The account it belongs to |
| Task, Event | The related account |

If an object has no sensible field pointing at an account, it cannot be scoped this way — use
a [sharing rule](./rules.md) with criteria instead.

### 3 · Follow the chain for child records

The **parent field** lets a record inherit scope from its parent. A task attached to a contact
has no account of its own, but the contact does — so the task follows the contact, which
follows the account.

Without this, child records fall outside the scope and the user cannot see the tasks on their
own contacts, which looks like a bug and is a configuration gap.

### 4 · Matching records to a person, not an account

A **user match field** ties records directly to the individual rather than their account. Use
it where a person should see only their own items within an account their colleagues also use.

## Choosing the access level

Scoping says *which* records. It does not say what the person may do with them — that is still
[Permissions](../access/permissions.md). A scoped user with no edit permission can see their
account's records and change nothing.

## What goes wrong

| Symptom | Cause |
|---|---|
| A user sees everything, not just their account | No account set on the user, or no scope field on that object. |
| They see their account but none of its contacts | Contact has no scope field, or needs the parent chain. |
| They see accounts but no tasks | Tasks need the parent field to follow the contact or account. |
| A client briefly saw another client's record | The object was not scoped. Check every object on a tab, not just the main one. |
| Reports show more than lists do | Older configurations set scope per tab rather than per object. Set it on the object. |

That fourth row is the one to take seriously. **Scoping is per object** — adding a tab without
setting its scope field exposes that object to everybody.

## Testing it before you trust it

Do not assume. For each new client:

1. Create a test user on that account.
2. Use **Log in as user** from [Users](../users/index.md).
3. Open every tab and check the counts.
4. Open [Record access](./record-access.md) on a record belonging to a *different* account and
   confirm that user is not listed.

Step 4 is the one people skip, and it is the one that catches a missing scope field.

## Where this fits

Account scoping narrows what somebody sees before any other rule applies.
[Sharing rules](./rules.md) can still widen access, and
[restriction rules](./restriction-rules.md) can narrow it further. When they disagree,
[Record access](./record-access.md) tells you which one is deciding.
`;

/* ---------------------------------------------- users, split */
f["admin/users/adding.md"] = `---
title: Adding a user
sidebar_position: 1
---

# Adding a user

## Before you start

Create the person's [company](../companies/index.md) first. Company drives most access rules,
and a user created without one is the most common setup mistake in the product.

## Adding somebody

**Where:** **Admin** → **Users** → **+ New User**

1. Click **Admin** in the top menu.
2. Click **Users** in the row of tabs.
3. Click the blue **+ New User** button on the right.

   ![Adding a user](../../img/shots/admin/modal-new-user.png)

4. Fill in each field:

| Field | Notes |
|---|---|
| **Username** | What they type to sign in. Must be unique across the portal. |
| **Email** | Where their password is sent. Must be real and reachable. |
| **Role** | See below. |
| **Company** | Always set this. |

5. Click **Save**.

The password is generated and emailed automatically. You never see it, and neither does anybody
else.

## Choosing the role

| Role | Can | Give it to |
|---|---|---|
| **Standard** | See and work on their own records | Most people |
| **Admin** | The above, plus manage people at their own company | One or two per company |
| **Super Admin** | Everything, for every company | Whoever runs the portal |

**Be sparing with Super Admin.** It crosses company boundaries, which is precisely what the
rest of the model exists to prevent.

## Why the company field matters so much

A blank company matches no company rule. The symptoms are confusing and rarely point at the
cause:

- Their Admin cannot see or manage them.
- Report folders shared with their company do not appear.
- Apps assigned to their company do not appear.

All three are the same missing field.

## After creating them

A new user has a role and a company but no specific access yet. Decide:

| Next | Page |
|---|---|
| What they may do | [Permissions](../access/permissions.md) |
| Which records they may do it to | [Sharing](../sharing/index.md) |
| Whether they are tied to one account | [Account scoping](../sharing/account-scoping.md) |

## What goes wrong

| Symptom | Cause |
|---|---|
| "Username already exists" | Usernames are unique portal-wide, including inactive users. |
| No welcome email | Check spam; then check email deliverability in [Setup Assistant](../operations/setup-assistant.md). |
| They sign in but see nothing | Permissions without sharing. |
| Save is refused | You may have hit a [licence limit](../operations/licence.md). |
`;

f["admin/users/deactivating.md"] = `---
title: When somebody leaves
sidebar_position: 2
---

# When somebody leaves

## Switch them off — never delete

**Where:** **Admin** → **Users** → the **Active** switch

1. Click **Admin**, then **Users**.
2. Find the person.
3. Click the **Active** switch so it turns grey.

They can no longer sign in. Everything else stays exactly as it was.

## Why not delete

Deleting breaks two things that matter later:

| Kept by deactivating | Lost by deleting |
|---|---|
| Their records, still owned by them | Ownership, leaving records orphaned |
| Their history in the [Audit Log](../operations/audit-log.md) | The trail of who did what |

Deactivating is reversible in one click. Deleting is not reversible at all.

## What to do with their records

Deactivating does **not** reassign anything. Their records keep them as owner, and under
**Private** sharing that can mean nobody else can see them.

For each account or contact that matters, use
[Change Owner](../../use/records/changing-owner.md) to move it to whoever picks the work up.

Do this **before** you deactivate if you can — it is easier to find their records while their
name is still on active lists.

## A leaver checklist

1. Change the owner of records somebody else needs.
2. Reassign their open tasks.
3. Switch **Active** off.
4. Revoke any [API key](../data/api-integration.md) attached to them.

Step 4 is the one that gets forgotten. A key keeps working after the person is gone, because
the key is not the person.

## Bringing somebody back

Switch **Active** on again. Their role, company, permissions and records are all as they were.
Reset their password if they no longer have it.

## What goes wrong

| Symptom | Cause |
|---|---|
| Records vanished after deactivation | Still owned by the inactive user. Change the owner. |
| They can still sign in | The switch did not save. Reload and check. |
| An integration broke | An API key attached to them. See [API Integration](../data/api-integration.md). |
`;

f["admin/users/login-as.md"] = `---
title: Seeing the portal as somebody else
sidebar_position: 4
---

# Seeing the portal as somebody else

## What it is

An administrator viewing the portal exactly as another person sees it, without their password.

## When to use it

When somebody reports a problem you cannot reproduce. "The tab isn't there", "my list is
empty", "I can't edit this" — all three are answered in seconds by looking at their screen
rather than reasoning about their permissions.

**When not to:** to do somebody's work for them. Everything you do is recorded against both
names, and it muddies who actually did what.

## Using it

**Where:** **Admin** → **Users** → the person's row → the person icon

1. Click **Admin**, then **Users**.
2. Find the person in the list.
3. Click the **person icon** in the **Actions** column.

You are now seeing their portal. A banner shows whose account you are in. Leave it to return
to your own.

## What is recorded

This is deliberately the most heavily logged thing in the product.

| Recorded | Always |
|---|---|
| Every attempt | Whether allowed **or refused** |
| Anything you do during the session | Against **both** names |

So the [Audit Log](../operations/audit-log.md) always answers "who really did this?", not just
"whose account was it?".

The person is **not** signed out and does not notice.

## Who may do it

| Role | Can view as |
|---|---|
| **Super Admin** | Anyone |
| **Admin** | Standard users they manage, and other Admins at their own company |
| **Admin** | **Never** a Super Admin |

It is switched **off** until a Super Admin turns it on, and that is the right default — it is a
powerful capability and should be a decision rather than something that was always there.

## Using it well

**Reproduce, do not fix.** Look, confirm what they are seeing, then come back to your own
account and change the setting. Fixing from inside their session makes the audit trail harder
to read.

**Check both halves.** If their list is empty, you now know whether it is
[permissions](../access/permissions.md) or [sharing](../sharing/index.md) — which is the
question you could not answer from your own screen.

## What goes wrong

| Symptom | Cause |
|---|---|
| The icon is missing | The feature is off, or that person is above you. |
| You see your own data | You left the session. Check the banner. |
| The problem does not reproduce | It may be browser-side — ask them to reload, or compare [view settings](../../use/start/the-screen.md). |
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Wrote ${n} admin pages at depth.`);
