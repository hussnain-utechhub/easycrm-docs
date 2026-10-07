---
title: Security
sidebar_position: 6
---

# Security

A complete access model, in two independent halves.

| Half | Decides | Set by |
|---|---|---|
| **Permissions** | What somebody may **do** | Per person, per object |
| **Sharing** | Which **records** they may do it to | Defaults, rules, hierarchy |

## Six permissions per object

**What it is.** Read, create, edit and delete, plus permission to change the page layout for
everybody, plus field-by-field control over which fields a person may edit.

**What you gain:** somebody can maintain two fields on a record without being able to touch the
rest.

## Profiles

**What it is.** A baseline of access for a kind of person.

**What you gain:** new joiners are set up correctly by assigning one thing.

## Permission sets

**What it is.** Extra access handed to particular people, on top of their profile.

**What it does.** A permission set only ever **adds**.

**What you gain:** exceptions handled without widening access for a whole group.

## Org-wide defaults

**What it is.** The starting access for each object — private, public read, or public read and
write.

**What you gain:** a floor you set deliberately, rather than one you inherit.

## Sharing rules

**What it is.** Standing rules that widen access beyond the default, targeting records by owner
or by field criteria, granting to a company, a role or a named group.

**What you gain:** a private-by-default portal where teams still see each other's work,
maintained by rules rather than record by record.

## Public groups

**What it is.** Named lists of people, which can contain roles and other groups.

**What you gain:** add somebody to one group and every relevant rule follows.

## Role hierarchy

**What it is.** A reporting tree where access flows upward.

**What you gain:** managers get visibility automatically as teams change, with no rule per
manager.

## Restriction rules

**What it is.** The one mechanism that **narrows** access — of the records somebody could
otherwise see, keep only those matching your criteria.

**What you gain:** contractors and partners given broad capability on a deliberately narrow
slice of data.

## Account scoping

**What it is.** Tying a portal user to an Account, so they see only that account's records —
with child records following through a parent field, and an optional user-match field tying
records directly to a person.

**What you gain:** the classic customer-portal arrangement. Every client signs in to the same
portal and sees only their own data, with no rule written per client.

## Manual record sharing

**What it is.** Sharing one individual record with a named person or group, at a chosen access
level, with the reason recorded.

**What you gain:** the one-off exception handled without a rule that would also catch a hundred
other records.

## Access diagnostics

**What it is.** Pick any record and see everybody who can access it, with the reason for each —
owner, default, a named sharing rule, or the hierarchy.

**What you gain:** access questions answered with evidence in seconds, and you know exactly
which setting to change.
