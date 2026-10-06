---
title: Licence limits
sidebar_position: 23
---

# Licence limits

**What it is.** The console that sets how many companies and users an installation may have.

**Where it lives.** In Salesforce, not in the portal. It is a page whoever administers the
package opens there, so most portal administrators never see it.

**What it does.** It sets a ceiling on:

| Limit | Meaning |
|---|---|
| **Companies in use** | How many companies may exist. |
| **Admins** | How many Admin users each company may have. |
| **Standard** | How many Standard users each company may have. |

**Default limits** apply to everybody. **Per-company overrides** raise or lower them for one
company.

## Signing in

The console is password-protected, separately from the portal. Use **Reset password** if it is
lost, and **Set a new password** to change it.

## What happens at the limit

Creating a user beyond the limit is refused with a message saying which limit was reached.
Nothing already created is affected — existing users keep working.

If somebody reports that they cannot add a user and permissions look correct, this is the next
thing to check.
