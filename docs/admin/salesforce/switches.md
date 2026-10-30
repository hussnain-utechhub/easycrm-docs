---
title: Settings only Salesforce can change
sidebar_position: 5
---

# Settings only Salesforce can change

**What it is.** A few portal-wide settings are fields on the **Portal Branding** record in
Salesforce, and no portal screen changes them. A Salesforce administrator sets them there.

**Why they are here.** They are rarely changed, and each one alters behaviour for everybody at
once — so they are kept off the portal's own console.

## The settings

| Field on Portal Branding | Default | What it controls | Also in the portal? |
|---|---|---|---|
| **Account Activity Rollup Disabled** | Unticked — activities roll up | Whether an Account's activity timeline includes what was logged on its contacts | No |
| **Long Text Notebooks Off** | Unticked — notebooks are used | Whether long text filters on very large reports can run | Yes — the Super Admin card [Long text filters on large reports](../operations/long-text-filters.md) |
| **Extension Class** | Blank — a class named `PortalExtension` | Which Apex class the portal calls for your organisation's own buttons and integrations | No |

Every other field on the record is either set from a portal screen — mostly **Admin** →
**Branding** — or is the portal's own working storage. Leave those alone.

## Changing one

**Where:** In Salesforce → the **Portal Branding** record

1. Sign in to Salesforce as a user with the **Portal Admin Access** permission set. It lets you
   read and edit the Portal Branding record and these three fields.
2. Open the Portal Branding record. It has no tab in the EasyCRM app, so open it the way you
   would any object without one — from its list view, or with a data tool such as Data Loader.
3. Edit the field, and save.

The change applies from the next thing anybody does in the portal. Nobody has to sign out.

:::note One record, normally
The portal keeps a single Portal Branding record and creates it the first time any of its
settings is saved. If your org has ended up with more than one, these three settings are read from the
**oldest** one — so edit that one.
:::

:::tip If the field is not on the page
The record's page layout may not show these fields. Add them in Setup → **Object Manager** →
**Portal Branding** → **Page Layouts**, or set the value with a data tool instead.
:::

## Account Activity Rollup Disabled

**Unticked (the default):** an Account's activity timeline in the portal shows what was logged on
the account itself **and** what was logged with any of its contacts — the same as Salesforce. A
call logged with a contact appears on that contact and on their account.

**Ticked:** the Account timeline shows only activities logged directly on the account. In most
orgs that is very little, because activity is logged against people.

Only activities that name a contact roll up. A task logged on an opportunity or a case with no
contact does not appear on the Account, which is also how Salesforce behaves.

The setting is named "Disabled" on purpose: an org that upgrades the package gets the Salesforce
behaviour without setting anything.

## Long Text Notebooks Off

**Unticked (the default):** when a report filters on a long text field — Description, an
activity's Comments, a custom long text field — and more records match its other filters than
one request can read, the portal answers from prepared copies of that text (its "notebooks").

**Ticked:** those reports are refused instead, as they were before notebooks existed. Nothing
reads or writes the notebooks.

A Super Admin can flip the same setting in the portal, from the **Long text filters on large
reports** card under **Admin** → **Users**. The two are one setting, so a change in either place
shows in the other. See [Long text filters on large reports](../operations/long-text-filters.md)
for what the notebooks are and when they matter.

## Extension Class

**What it is.** The name of an Apex class in your org that implements `System.Callable`. The
portal calls it for anything specific to your business that the package cannot know about.

**Blank (the default)** means the portal looks for a class named `PortalExtension`.

The portal uses it for:

| Feature | Without an extension class |
|---|---|
| Buttons of type **Component (a portal screen)** and **Server action** — see [Buttons](../appearance/buttons.md) | Those buttons are hidden, rather than shown and failing. Flow, URL and New Child Record buttons are unaffected. |
| **Sync** and **Sync all** on the [List Mappings](../data/list-mappings.md) tab | Refused with *Syncing needs an extension class - add one that implements Callable and name it in Admin, Branding, Extension Class.* |
| Fetching the latest FrontSpin lists on the List Mappings tab | Shows the last lists FrontSpin sent instead, with *Showing the last catalogue FrontSpin sent. A live pull needs an extension class …* |

The class must belong to your org itself, not to an installed package with its own namespace.
If the name is wrong, or the class does not implement `System.Callable`, the portal behaves as if
there were none.

:::note The messages point at the wrong screen
Those messages say to name the class in **Admin**, **Branding**, **Extension Class**. The portal's
Branding tab has no such field — this one, on the Portal Branding record in Salesforce, is the
place.
:::

Writing the class is a developer's job. It receives an action name and its arguments from the
portal, after the portal has already checked who the person is and what they may do.

## What goes wrong

| Symptom | Cause |
|---|---|
| An Account's timeline shows almost nothing, while its contacts have plenty | **Account Activity Rollup Disabled** is ticked. |
| A report with a long text filter is refused on a large object | **Long Text Notebooks Off** is ticked, or the Super Admin card is off. |
| A custom button you configured never appears | It is a **Component** or **Server action** button and no extension class is found. Check the class name and that it implements `System.Callable`. |
| *Syncing needs an extension class …* on List Mappings | No extension class is found. Set **Extension Class**, or deploy a class named `PortalExtension`. |
| You changed a field and nothing happened | Your org has more than one Portal Branding record and you edited a newer one. |

## Where this fits

- [The EasyCRM app in Salesforce](./index.md) — the other Salesforce-side screens.
- [Branding](../appearance/branding.md) — the branding settings the portal does let you change.
