---
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
