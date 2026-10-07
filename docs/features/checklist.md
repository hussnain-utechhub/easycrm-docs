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
- Delegated administration, including which console tabs each company's admins see
- Deactivation that preserves records and audit history
- Administrator-initiated password resets
- Support impersonation, logged on both names and opt-in
- Account lockout after repeated failed sign-ins, with email warning
- Automatic session expiry
- Sign-in hour restrictions, per profile
- IP range restrictions, per profile
- Default landing tab, per profile
- Portal users linkable to Salesforce users; manager relationships
- In-portal notifications with unread count
- Automatic emails: credentials, password reset, account locked, account closed

## [Records](./records.md)

- List views with saved columns, filters and sorting; pin a default
- Filters with AND / OR / NOT and brackets
- Per-person column selection
- Sorting, with picklists in defined order
- Search within a list, and global search across all objects
- Row-level action menus
- Configurable record pages with sections and related lists
- Separate, shorter field set for the new-record window
- Full editing and single-field inline editing
- Field-level edit control
- Record types, assignable per company
- Ownership and transfer
- Clickable emails, phone numbers, addresses and linked records
- Configurable home page, per app, with an announcement
- Personal display settings: menu position, theme, row density

## [Activities and files](./activities-and-files.md)

- Calls, tasks, events and emails against any record
- Activity timeline with date, type and status filters
- Expand-all and full-history views
- Tasks on the assignee's home page, with overdue flagging
- Upcoming events on the home page
- File upload, preview, download and delete
- Files attached to records, inheriting record access
- Recent, Owned by Me and All Files views

## [Reporting](./reporting.md)

- On-screen report builder with live preview, undo and redo
- Single-object and two-object report types, with and without matches
- Tabular, summary and matrix reports
- Multi-level grouping down the side and across the top
- Sum, average, minimum and maximum, with subtotals and grand totals
- Report filters with filter logic
- Relative date ranges
- Locked filters readers cannot change
- Reader-side filtering that does not alter the saved report
- Bucket columns for picklist, number and text fields
- Row-level and summary formula columns
- Bar, column, line, pie, donut and gauge charts, re-sliceable by any grouping
- Folders and favourites
- Clone and Save As
- Export as formatted report or details only
- Sharing with companies or named users, at read or edit, revocable
- Import of existing Salesforce reports
- Formula sync between portal and Salesforce reports

## [Dashboards](./dashboards.md)

- Metric, bar, column, line, pie, donut, gauge and table tiles
- Drag-and-drop layout on a configurable grid
- Separate page and tile themes, light or dark
- Dashboard-wide filters with per-tile field mapping
- Run as the viewer, or across all data
- Cached results with on-demand refresh

## [Security](./security.md)

- Per-user, per-object read, create, edit and delete
- Layout-edit permission and field-level edit control
- Profiles for baselines; permission sets for exceptions
- Org-wide defaults: private, public read, public read/write
- Sharing rules by owner or by field criteria
- Public groups, nestable, containing users, roles and other groups
- Role hierarchy with upward access inheritance
- Restriction rules to narrow access
- Account scoping: users tied to an account see only that account's records
- Child records scoped through a parent field
- User-match field tying records directly to a person
- Manual sharing of a single record with a person or group
- Record-access diagnostics showing who and why

## [Configuration and branding](./configuration.md)

- Page layouts: fields, sections, related lists, new-record window
- Tab selection and ordering
- Apps, assignable per company
- Custom buttons — web address, Salesforce flow, new child record, background action
- Extension point for bespoke record-page screens
- Home page cards, per app, with an announcement
- Portal name, logo, favicon and colour themes
- Default navigation layout, overridable by each person
- Block-based sign-in designer with draft, preview, publish and restore
- Desktop and phone previews
- Protected credential fields that cannot be moved or imitated
- Automatic creation of the portal's own fields on your objects
- Import of existing Salesforce page layouts

## [Data and integration](./data.md)

- CSV import with on-screen column mapping and a failure report
- Saved column mappings for recurring imports, per company
- Read-only REST API with scoped, filterable keys
- One-time secrets; edit, regenerate and revoke
- API usage analytics by period, company and user, with export
- Automatic retention and tidy-up of API request logs
- Scheduled publishing of portal reports into Salesforce, with a result digest
- Activity emails sent from a record, plain or formatted

## [Operations and scale](./operations.md)

- Tamper-proof audit log, filterable and searchable
- Installation health checks
- Virtualised rendering of large lists and wide reports
- Exact record counts at volume
- Report cache control, org-wide or per company
- Licence limits with per-company overrides
