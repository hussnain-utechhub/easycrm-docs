---
title: Data and integration
sidebar_position: 8
---

# Data and integration

Getting information in, and out to other systems.

## Spreadsheet import

**What it is.** Loading many records from a CSV file, matching columns to fields on screen.

**What it does.** A summary reports how many were created and lists anything that failed, with
the reason.

**What you gain:** onboarding a new client's data without a data-loading tool or a developer.

## Standing column mappings

**What it is.** For lists that arrive repeatedly from the same source, the column-to-field
matching saved once, per company.

**What you gain:** recurring imports stop being a manual matching exercise every time.

## A read-only API

**What it is.** Keys that let another system fetch your portal data. Each key is attached to a
person, scoped to chosen objects and fields, and can be filtered to a subset of records.

**What it does.** Secrets are shown once. Keys can be edited, regenerated or revoked.

**What you gain:** integrations without exposing your Salesforce org — and without any risk of
an integration changing or deleting data, because keys can only read.

## API usage analytics

**What it is.** Request volumes by period, company and user, with export.

**What you gain:** integrations you can supervise, and unused keys you can retire.

## API log retention

**What it is.** Request logs kept for a period and then tidied up automatically.

**What you gain:** usage history for as long as it is useful, without a log table that grows
for ever.

## Publishing reports back to Salesforce

**What it is.** Portal reports re-created as Salesforce reports on a schedule.

**What it does.** Off until deliberately enabled. If a published report is deleted, the schedule
pauses rather than silently re-creating it. A digest reports what published and what did not.

**What you gain:** portal users and Salesforce users looking at the same numbers, without
anybody maintaining the report twice.

## Activity emails

**What it is.** Emails composed against a record and sent from the portal, plain or formatted.

**What you gain:** correspondence recorded with the customer it concerns.
