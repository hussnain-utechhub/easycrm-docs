---
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
