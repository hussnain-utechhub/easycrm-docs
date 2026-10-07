---
title: Checklist
sidebar_position: 2
---

# Checklist

## Setting up a new tenant

- [ ] Tenant ID, API key and webhook secret obtained from FrontSpin
- [ ] Named Credential created, holding the API key
- [ ] [Record Type](../setup/record-types.md) created on Contact
- [ ] Same Record Type created on Account and Lead, if those sync
- [ ] Record Type developer name written down
- [ ] Profiles given access to the Record Type
- [ ] [Configuration row](../setup/configuration.md) created
- [ ] Record Type developer names entered, comma-separated, spelled exactly
- [ ] Tenant ID and Named Credential filled in
- [ ] [Permissions](../setup/permissions.md) granted to the scheduling user
- [ ] Jobs scheduled as a **permanent** user
- [ ] [Outbound field mappings](../setup/fields-going-out.md) added, if needed
- [ ] [Inbound field mappings](../setup/fields-coming-back.md) added, if needed
- [ ] Receiving site active
- [ ] [Webhook configuration](../setup/webhooks.md) created, with URL token and secret
- [ ] FrontSpin told the webhook address
- [ ] [Health check](../setup/checking-it.md) run and clean
- [ ] A test record synced out
- [ ] A test change synced back

## Adding a second tenant

- [ ] Everything above, for the new tenant
- [ ] [Instance](../routing/instances.md) created
- [ ] Routing rules created, one per object per Record Type
- [ ] No two active rules send one Record Type to different instances
- [ ] Mode set to **CONFIGURATION**
- [ ] Health check clean — no errors, warnings understood
- [ ] Mode set to **STRICT**
- [ ] [Sync errors](../troubleshooting/sync-errors.md) watched for a day

## Setting up Report to List

- [ ] The report exists and returns the right people
- [ ] The report has been checked — **people cannot be removed from a list afterwards**
- [ ] The FrontSpin list exists, and its **number** is known
- [ ] [Which source is live](../lists/where-mappings-live.md) confirmed
- [ ] Mapping created in that source
- [ ] Member Type is `Contacts`
- [ ] Active ticked
- [ ] The scheduling user can see every Contact the report returns
- [ ] First run confirmed within the hour

## Monthly health check

- [ ] [Sync health](../portal/sync-health.md) looks normal
- [ ] No growing pile of **Failed_Permanent** [sync errors](../troubleshooting/sync-errors.md)
- [ ] Scheduled jobs still exist, and their owner is still active
- [ ] No list with a stale **Last Synced On**
- [ ] [Health check](../setup/checking-it.md) still clean

## Before blaming FrontSpin

- [ ] [Health check](../setup/checking-it.md) run
- [ ] [Sync errors](../troubleshooting/sync-errors.md) read for the record in question
- [ ] [The nine silent cases](../troubleshooting/silent-failures.md) ruled out
- [ ] The failure class is one that points outward — 5xx, or a quota
