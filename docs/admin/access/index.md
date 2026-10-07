---
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
