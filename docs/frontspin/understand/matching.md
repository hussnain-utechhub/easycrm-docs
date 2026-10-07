---
title: How records are matched
sidebar_position: 3
---

# How records are matched

## The problem this solves

Before creating a contact in FrontSpin, the integration has to know whether that person is
**already there**. Otherwise every uncertain attempt produces a duplicate, and a dialler full of
duplicates calls people twice.

That turns out to be harder than it sounds, for a reason worth knowing.

## FrontSpin cannot be asked "do you have this person?"

There is no lookup. Searching by email, phone, Salesforce Id or any external reference is
rejected outright, and fetching a single record by its id is not allowed either.

What **is** available is listing records a page at a time. So the integration reads the list and
does the matching itself, in Salesforce.

This is why matching behaves the way it does below — it is working with the only evidence the
interface will hand over.

## Matching an Account

The only usable key is the **name**.

| Situation | Result |
|---|---|
| Exactly one FrontSpin account with that name | Matched |
| No FrontSpin account with that name | **Not matched** — nothing is created |
| Two or more with that name | **Not matched**, reported as ambiguous |

A name is a weak key, so the integration refuses rather than guesses. Attaching a contact to the
wrong company in FrontSpin is worse than not creating the contact at all — one is a visible gap,
the other is a quiet error somebody acts on.

### What this means for you

**Account names must match between Salesforce and FrontSpin**, or contacts under that account
cannot be created.

If contacts for one customer consistently fail to create, compare the Salesforce Account Name
with the account name in FrontSpin. A trailing "Ltd", a different ampersand, or an extra space is
enough.

Duplicate account names in FrontSpin cause the same failure, and need fixing there.

## Matching a Contact

A contact has much better evidence available, so matching runs a ladder — strongest key first,
stopping at the first match.

| Order | Key | Why there |
|---|---|---|
| 1–5 | **Phone 1 … Phone 5** | A direct number identifies one person |
| 6 | **Email** | Strong, but people have more than one |
| 7 | **Name** | Weakest, and never allowed to decide alone |

All five numbered phone fields are searched, in order.

### Why phone beats email

A direct-dial number belongs to one person. It is not shared the way a role address
(\`info@\`, \`sales@\`) is, and not repeated the way a name is.

Email comes second because one person can legitimately appear under both a personal and a work
address, and shared mailboxes exist.

### Name alone never decides

A name match must be **corroborated by the parent account**. "John Smith" on its own is not
evidence; "John Smith at this specific company" is.

### One case where email is no help

Contacts that had no email in Salesforce are sent with a
[stand-in address shared by everybody at their company](../setup/fields-going-out.md#contacts-with-no-email-address).

That address identifies a company, not a person, so for those contacts matching relies on the
phone numbers and the name. It is another reason the phone fields sit at the top of the ladder.

## Phone numbers are normalised before comparing

The same function that formatted a number when it was written is used to compare it, so a
difference in formatting — spaces, brackets, a country code — can never cause a missed match.

Emails are trimmed and lower-cased for the same reason.

## What this prevents

The case this really exists for: a create was sent, and the answer never arrived — a timeout, a
dropped connection. Did it work?

Without matching, the safe-looking choice is to try again, and that produces a duplicate. With
matching, the next attempt finds the contact already there and adopts it instead.

## When it refuses

A refusal appears as a [sync error](../troubleshooting/sync-errors.md) with a reason, not as
silence. The common ones:

| Reason | Means | Fix |
|---|---|---|
| No matching FrontSpin account | The account name does not exist there | Correct the name, or create the account in FrontSpin |
| Ambiguous account | Two FrontSpin accounts share the name | Resolve the duplicate in FrontSpin |
| Indeterminate create | It could not be established whether the contact already exists | Usually resolves on [retry](../troubleshooting/retries.md) |

## Matching costs nothing extra at save time

Checks that depend on evidence the record already carries — which tenant issued a stored id, for
instance — make **no** call to FrontSpin at all. They cost nothing from a daily allowance that can
be as low as 500 requests.

That is deliberate: a safety check expensive enough to be noticed is a safety check somebody
eventually switches off.

## Where this fits

Which tenant a record is matched *within* is
[Tenants and Record Types](./tenants-and-record-types.md). What happens when matching refuses is
[Sync errors](../troubleshooting/sync-errors.md).
