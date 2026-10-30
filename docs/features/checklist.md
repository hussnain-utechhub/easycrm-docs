---
title: Feature checklist
sidebar_position: 10
---

# Feature checklist

Everything EasyCRM does, on one page. Each group links to the detail.

## [Access and users](./access-and-users.md)

- Username and password sign-in — no Salesforce licence for portal users
- Self-service password reset
- Three roles: Standard, Admin, Super Admin
- Multi-company: one installation serving many client companies
- Delegated administration, including which console tabs each company's admins see — every tab
  except Companies, Apps and Publish Schedule, which stay with Super Admins
- Deactivation that preserves records and audit history
- Administrator password resets, emailed to the person
- Support impersonation, logged on both names and opt-in
- Account lockout after five failed sign-ins, with email warning and one-click unlock
- Two-hour sessions with a five-minute warning and **Stay signed in**, up to twelve hours
- Signing in again over the page you were on, without losing unsaved work
- Sign-in hour restrictions, per profile
- IP range restrictions, per profile
- Default landing tab, per profile
- Managers for Standard users; portal users linkable to Salesforce users
- In-portal notifications of record changes, with unread count
- Automatic emails: credentials, password reset, account locked, account closed
- Portal users also manageable from the EasyCRM app in Salesforce

## [Records](./records.md)

- List views with saved columns, filters and sorting; pin a default
- Filters with AND / OR / NOT and brackets
- Filter fields matching Salesforce list views, including owner and parent fields
- Per-person column selection, with admin defaults for everyone
- Sorting, with picklists in defined order
- Search within a list, and global search across all objects, reports and dashboards
- Row-level action menus
- Editing straight in a list — one cell, or the same change on up to 200 records at once
- Configurable record pages with sections and related lists
- Separate, shorter field set for the new-record window
- Full editing, and inline editing of every editable field on the record page
- Field-level edit control
- Record types, assignable per company
- Ownership and transfer
- Clickable emails, phone numbers, addresses, linked records and formula links
- Custom buttons on list pages as well as record pages
- Configurable home page, per app, with an announcement
- Personal display settings: menu position, theme, row density

## [Activities and files](./activities-and-files.md)

- Calls, tasks, events and emails against any record
- Account timelines that include activities logged with the account's contacts
- Activity timeline with time and type filters
- Expand-all and full-history views
- Open tasks and upcoming events from your recent records on the home page, with overdue
  flagging
- File upload, preview, download, new versions, public links and delete
- Files attached to records, shown on the record's Files card
- Recent, Owned by Me and All Files views

## [Reporting](./reporting.md)

- On-screen report builder with live preview, undo and redo
- Single-object and two-object report types, with and without matches
- Tabular, summary and matrix reports
- Multi-level grouping down the side and across the top
- Sum, average, minimum, maximum, median and unique counts, with subtotals and grand totals
- Report filters with filter logic
- Relative date ranges
- Long text filters, including on very large reports
- Locked filters readers cannot change
- Reader-side filtering that does not alter the saved report
- Bucket columns for picklist, number and text fields
- Row-level and summary formula columns
- Bar, stacked bar, line, pie, donut, funnel, scatter, metric and gauge charts, re-sliceable by
  any grouping
- Click-to-sort and column menus on the run page, sorting every row, not just the page on screen
- Editing values straight from a report, including summary and matrix detail rows
- Fields a person cannot read hidden from every report they run
- Folders and favourites
- Clone and Save As
- Export as formatted report or details only, to Excel or CSV
- Sharing with companies or named users, at read or edit, revocable
- Sync of existing Salesforce reports, naming anything that could not come across
- Formula sync between portal and Salesforce reports
- Publishing portal reports to Salesforce — by hand, on a schedule or on save

## [Dashboards](./dashboards.md)

- Bar, stacked bar, line, donut, funnel, scatter, metric, gauge and table tiles
- Drag-and-drop layout on a configurable grid
- Separate page and tile themes, light or dark
- Dashboard-wide filters with per-tile field mapping, remembered for each person
- Clicking a chart opens the report behind it, filtered to what was clicked
- Run as the viewer, or across all data
- Cached results with on-demand refresh

## [Security](./security.md)

- Per-user, per-object read, create, edit and delete
- Layout-edit permission and field-level edit control
- Profiles for baselines; permission sets for exceptions
- Org-wide defaults: Private, Public Read Only, Public Read/Write, Controlled by Parent, Field
  Scoped
- Field Scoped objects: each person sees only the records holding their own values
- Sharing rules by owner or by field criteria
- Public groups, nestable, containing users, roles and other groups
- Role hierarchy with upward access inheritance
- Restriction rules to narrow access
- Account scoping already configured keeps working: users tied to an account, child records
  through a parent field, a user-match field
- Manual sharing of a single record with a person or group
- Record-access diagnostics showing who and why

## [Configuration and branding](./configuration.md)

- Page layouts: fields, sections, related lists, new-record window
- Tab selection and ordering; the Home tab can be hidden
- Apps, set up by a Super Admin and assignable per company
- Custom buttons — web address, Salesforce flow, new child record, your own screen, background
  action — limited by role and record type
- Extension class for bespoke screens and actions, named in Salesforce
- Home page cards, per app, with an announcement
- Portal name, logo, favicon and colour themes
- Default navigation layout, overridable by each person
- Block-based sign-in designer with draft, preview, publish and restore
- Desktop and phone previews
- Protected credential fields that cannot be moved or imitated
- Automatic creation — and removal — of the portal's own fields on your objects
- Salesforce's own field labels kept on layouts brought over from Salesforce

## [Data and integration](./data.md)

- CSV and Excel import of accounts and contacts: add, update or both, with matching and
  fill-in-blanks
- Imports run in the background, with progress, a completion email and on-screen fixing of
  failed rows
- Report-to-calling-list mappings for FrontSpin, per company
- REST API that reads, creates, updates and deletes, granted per object
- Scoped, filterable keys; one-time secrets; edit, regenerate and revoke
- Separate hourly ceilings for reads and writes
- API usage analytics by period, company and user, with export
- Automatic retention and tidy-up of API request logs
- Syncing Salesforce reports into the portal, and sharing them with companies
- Publishing portal reports into Salesforce — by hand, on a schedule or on save — with an
  email to Super Admins when anything fails
- Activity emails sent from a record, plain or formatted

## [Operations and scale](./operations.md)

- Tamper-proof audit log, filterable by action, user and record
- A full audit trail for records, reports and dashboards, including refused attempts
- Actions taken in the EasyCRM app in Salesforce logged under the Salesforce user
- Installation health checks with one-click auto-configure
- Virtualised rendering of large lists and wide reports
- Exact record counts at volume
- Long text filters on large reports, answered from prepared copies
- Report cache control, org-wide or per company
- Licence limits — companies, Super Admins, and Admins and Standard users per company — with
  per-company overrides
