---
title: 3. Permissions
sidebar_position: 3
---

# Step 3 — Permissions

## Why this step exists

The integration does its work as real Salesforce users, and those users need access like anybody
else. Most "it is configured but nothing happens" reports are a permission, not a configuration.

Three different identities matter, and they need different things.

## 1. The person who schedules the jobs

Scheduled Apex runs as **whoever created the schedule**, forever — not as the person who happens
to be logged in when it fires.

That user needs:

| Access | On | Why |
|---|---|---|
| Read, Create, Edit | **FrontSpin List** | Recording which lists exist |
| Read, Create, Edit | **FrontSpin List Membership** | Recording who was added |
| Read, Create, Edit | **FrontSpin Sync Error** | Writing down failures |
| Read | The reports used by [Report to List](../lists/report-to-list.md) | Running them |
| Visibility of the Contacts | — | See below |

**Schedule the jobs as a dedicated, permanent admin user.** If they are scheduled by somebody who
later leaves and is deactivated, the jobs stop.

## Granting the access, step by step

**Where:** Salesforce **Setup** → **Permission Sets**

Do this once per permission set — one for the scheduling user, and the portal's own set for the
guest.

1. Click the **gear** at the top right of Salesforce, then **Setup**.
2. Type `permission` into the **Quick Find** box on the left.
3. Click **Permission Sets**.
4. Click the name of the set you are granting through — or **New** to make one, giving it a
   **Label** such as `FrontSpin Integration` and clicking **Save**.
5. Click **Object Settings**.
6. Click **FrontSpin List**.
7. Click **Edit**.
8. Tick **Read**, **Create** and **Edit** under **Object Permissions**.
9. Click **Save**.
10. Click **Object Settings** again and repeat steps 6–9 for **FrontSpin List Membership** and
    **FrontSpin Sync Error**.

Then assign it:

1. From the permission set, click **Manage Assignments**.
2. Click **Add Assignment**.
3. Tick the user, and click **Assign** → **Done**.

:::note The guest user is assigned differently
A Site Guest User is not in that list. Assign its permission set from **Setup** → **Sites** → the
site's label → **Public Access Settings**, or through the site's **Guest User** record. Grant the
guest **Read** only on FrontSpin List Membership, and **Read** plus **Create** on FrontSpin List —
Edit and Delete cannot be granted at all, for the reason below.
:::

## Contact visibility bounds what syncs

Contact's org-wide default is normally **Private**, and the Report-to-List sync respects sharing.
So the scheduling user's visibility is a ceiling on what can sync — a Contact they cannot see is a
Contact that cannot be added to a list.

This does not fail silently. The sync reports the shortfall as **CONTACTS_NOT_VISIBLE** rather
than quietly syncing fewer people than the report returned.

If a list is consistently short, check the scheduling user's sharing access before suspecting
FrontSpin.

## 2. Internal users who edit records

Ordinary users need nothing special. Saving a Contact queues the sync automatically; the queued
job does the talking.

They do need **read access to FrontSpin Sync Errors** if you want them to see why their own record
did not sync.

## 3. The portal's guest user

This one has a trap in it, and it is worth reading even if everything currently works.

The EasyCRM portal runs as the **Site Guest User**. Unlike normal Apex, object permissions **are**
enforced for a guest, so the guest needs explicit access:

| Access | On | For |
|---|---|---|
| Read | **FrontSpin List** | Showing the list picker in [List Mappings](../portal/list-mappings.md) |
| Create | **FrontSpin List** | The **Refresh lists** button adding newly-found lists |
| Read | **FrontSpin List Membership** | Showing sync health |

Grant these through the permission set the portal already uses for field access, on both the
admin and guest sides.

### The limit you cannot configure away

**A Guest User Licence forbids Edit and Delete on objects.** No permission set can grant it, and
Salesforce refuses the assignment if you try.

The practical consequence: the guest can **add** newly-discovered lists but can never **update** an
existing one. Refreshing a list that already exists fails with a duplicate-value error on the
list's key.

So the **Refresh lists** button in the portal reliably picks up lists that are new, and cannot
refresh the details of lists already recorded. The hourly
[List Catalog job](../lists/index.md) — which runs as a real user, not the guest — is what keeps
existing entries current.

This is a platform limit, not a bug, and not something a permission set will fix.

## What goes wrong

| Symptom | Cause |
|---|---|
| "Access to entity 'FrontSpin_List__c' denied" | The guest has no object permission at all. |
| "duplicate value found: List_Key__c" | The guest is trying to update an existing list. Expected — see above. |
| Jobs stopped after somebody left | They scheduled them. Reschedule as a permanent user. |
| A list is short every run | The scheduling user cannot see all the Contacts. |

## Where this fits

Next: [fields going out](./fields-going-out.md).
