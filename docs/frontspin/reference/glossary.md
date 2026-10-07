---
title: Glossary
sidebar_position: 0
---

# Glossary

| Term | Means |
|---|---|
| **Tenant** | One FrontSpin account. A Salesforce org can talk to several. |
| **Tenant ID** | The number identifying a tenant, e.g. `100142`. |
| **Instance** | The Salesforce configuration describing how to reach one tenant. |
| **Record Type** | The Salesforce label that decides which tenant a record belongs to. |
| **Developer name** | A Record Type's unchanging internal name. Configuration refers to this, not the label. |
| **Configuration row** | The record joining Record Types to a tenant. |
| **Routing rule** | In multi-tenant orgs, the record saying which Record Type goes to which instance. |
| **Routing mode** | LEGACY, CONFIGURATION or STRICT. How strictly routing is applied. |
| **Named Credential** | Where Salesforce keeps the API key, so code never sees it. |
| **Webhook** | A message FrontSpin sends your org when something happens. |
| **URL token** | The secret ending of the webhook address, identifying the tenant. |
| **Webhook secret** | The key used to prove a webhook is genuine. |
| **List** | A FrontSpin calling list. Created and managed in FrontSpin. |
| **List catalogue** | Salesforce's hourly record of which lists exist. |
| **Report to List** | Running a Salesforce report and adding its contacts to a list. |
| **Membership** | A record that somebody was added to a list. |
| **Sync error** | One failed synchronisation, with its reason. |
| **Failure class** | What kind of failure, and whether retrying helps. |
| **Quota** | A tenant's daily request allowance. Can be as low as 500. |
| **Resync** | Sending records to FrontSpin on demand. |
| **Site Guest User** | The identity the portal runs as. Cannot edit or delete records. |
| **202** | FrontSpin's "accepted, will do shortly". Not proof of completion. |
