/* FrontSpin tab, part 2: setting a tenant up, end to end. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};
const cat = { "frontspin/setup": { label: "Setting it up", position: 2, collapsed: true } };

f["frontspin/setup/index.md"] = `---
title: Before you start
sidebar_position: 0
---

# Setting up a FrontSpin tenant

This section takes one customer from nothing to syncing. Follow it in order — each step depends
on the one before.

## Where the work happens

Almost all of it is in **Salesforce Setup**, not in the EasyCRM portal. You need an administrator
login to Salesforce itself.

## What you need from FrontSpin first

Ask whoever runs the FrontSpin account for these. Nothing below works without them.

| You need | Looks like | Used for |
|---|---|---|
| **Tenant ID** | \`100142\` | Identifying the FrontSpin account |
| **API key** | a long secret string | Authenticating every request |
| **Webhook secret** | another secret string | Proving an incoming webhook is genuine |

Both secrets go into Salesforce **once** and are never typed again. The API key is held in a
Named Credential, so it is injected by the platform and never appears in Apex or in a log.

## The order of work

| Step | Page | Roughly |
|---|---|---|
| 1 | [The Record Type](./record-types.md) | 5 min |
| 2 | [The configuration row](./configuration.md) | 5 min |
| 3 | [Permissions](./permissions.md) | 10 min |
| 4 | [Fields going out](./fields-going-out.md) | 15 min |
| 5 | [Fields coming back](./fields-coming-back.md) | 10 min |
| 6 | [Webhooks](./webhooks.md) | 20 min |
| 7 | [Checking it](./checking-it.md) | 5 min |

Steps 4 and 5 are optional at first. A tenant with no field mappings still syncs the standard
fields; mappings add your own.

## A note on the screenshots

The screens below are real, with customer names, tenant ids and the org address replaced by
example values. Field names, layout and everything you click are untouched.

## One thing to decide before step 2

**Are you setting up the only FrontSpin account, or an additional one?**

- **The only one** — follow this section and ignore [Routing](../routing/index.md) entirely. The
  org stays in its default mode and everything works.
- **An additional one** — do this section first anyway, then read
  [Routing](../routing/index.md), which is about running several tenants at once safely.
`;

f["frontspin/setup/record-types.md"] = `---
title: 1. The Record Type
sidebar_position: 1
---

# Step 1 — The Record Type

## What you are doing

Creating the label that says "this record belongs to that customer". Everything downstream routes
on it, so it comes first.

## Where

**Setup** → **Object Manager** → **Contact** → **Record Types**

1. Click the gear, top right of Salesforce, then **Setup**.
2. Click **Object Manager** in the top bar.
3. Find and click **Contact**.
4. Click **Record Types** in the left-hand menu.

![Record Types on Contact](../../img/shots/frontspin/setup-record-types.png)

## Creating one

1. Click **New**, top right.
2. Fill in:

| Field | What to put |
|---|---|
| **Record Type Label** | The customer's name, as people say it |
| **Record Type Name** | Fills itself in. This is the **developer name** the configuration uses. |
| **Description** | Optional, but useful a year later |
| **Active** | Tick it |

3. Choose which profiles may use it.
4. Click **Next**, then **Save**.

## Write the developer name down

The **Record Type Name** — not the label — is what
[the configuration row](./configuration.md) refers to. In the screen above it is the value behind
each label.

Developer names are used rather than ids so the same configuration works in a sandbox and in
production without editing. A record type label can be renamed freely; changing the **developer
name** breaks the link and stops that customer syncing.

## Do the same on Account and Lead

If you sync Accounts or Leads for this customer, repeat the steps on those objects, using the
**same developer name**. The configuration matches on object plus developer name, so keeping them
identical across objects keeps one row covering all three.

## How many Record Types

One per customer, not one per team or per campaign. The Record Type answers "whose FrontSpin does
this belong in?", and that question has exactly as many answers as you have FrontSpin tenants.

An org with 61 Record Types on Contact is not unusual for a business running many customers'
calling operations.

## What goes wrong

| Symptom | Cause |
|---|---|
| Users cannot pick the new Record Type | Their profile was not given access in step 3 of the wizard. |
| Records are refused with "no Record Type" | Existing records were created before the Record Type existed. Set it on them. |
| One customer's records stopped syncing | The developer name was changed. Change it back, or update the configuration row. |

## Where this fits

Next: [point this Record Type at a FrontSpin tenant](./configuration.md).
`;

f["frontspin/setup/configuration.md"] = `---
title: 2. The configuration row
sidebar_position: 2
---

# Step 2 — The configuration row

## What you are doing

Joining the Record Type from step 1 to a FrontSpin tenant. This is the row that makes a record
sync anywhere at all.

## Where

**Setup** → search **Custom Metadata Types** → **FrontSpin Configuration Settings** → **Manage
Records**

1. In Setup, type \`custom meta\` into the quick-find box on the left.
2. Click **Custom Metadata Types**.
3. Find **FrontSpin Configuration Settings** and click **Manage Records**.

![The configuration rows](../../img/shots/frontspin/setup-config-list.png)

One row per customer. Click **New** to add one, or a **Label** to open it.

## What a row holds

![A configuration row](../../img/shots/frontspin/setup-config-detail.png)

| Field | What to put | Notes |
|---|---|---|
| **Label** | The customer's name | What you will see in lists |
| **FrontSpin Configuration Setting Name** | Fills itself in | The **developer name**, used by [list mappings](../lists/report-to-list.md) |
| **Company** | The company name as FrontSpin knows it | |
| **Named Credential** | The credential holding the API key | See below |
| **Record Type Developer Name** | The developer names from [step 1](./record-types.md), comma-separated | One row can cover many |
| **Tenant ID** | The number FrontSpin gave you | e.g. \`100142\` |
| **Token Frontspin** | Usually left blank | Only used where no Named Credential exists |

## Record Type Developer Name takes a list

This is the field people most often under-use. It accepts **several** developer names separated by
commas, so one customer with ten Record Types needs one row, not ten.

Type them exactly as the Record Type Name appears — no spaces around the commas is safest.

## About the Named Credential

A Named Credential is where Salesforce keeps the API key. The integration never reads the key,
never holds it and never writes it to a log — it asks the platform to attach it.

That is why the **Token Frontspin** field is normally blank. Putting a key there means it lives in
configuration you can read, which is worse. Use a Named Credential unless somebody has told you
otherwise.

Setting up the Named Credential itself is standard Salesforce work: **Setup** → **Named
Credentials** → **New**, pointing at FrontSpin's API base address with the key as the
authentication.

## Saving and checking

Click **Save**. The row takes effect immediately — there is no deploy and no cache to clear.

Then run the [health check](./checking-it.md), which will tell you whether the row resolves.

## What goes wrong

| Symptom | Cause |
|---|---|
| Nothing syncs for this customer | The Record Type developer name does not match exactly. Check spelling and capitals. |
| "The named configuration is missing or incomplete" | A blank Tenant ID or Named Credential. |
| Records reach the wrong FrontSpin | Two rows claim the same Record Type. See [the eight outcomes](../routing/outcomes.md). |
| Still nothing, and no errors | No rows exist at all — the integration treats that as "not switched on" and stays quiet on purpose. |

That last row is worth remembering. With **zero** configuration rows the integration does not log
a failure per record, because that would put hundreds of pointless rows in the log for one bulk
load. It simply does nothing. Once at least one row exists, unroutable records *are* logged.

## Where this fits

Next: [permissions](./permissions.md), without which the scheduled jobs cannot write anything.
`;

f["frontspin/setup/permissions.md"] = `---
title: 3. Permissions
sidebar_position: 3
---

# Step 3 — Permissions

## Why this step exists

The integration does its work as real Salesforce users, and those users need access like anybody
else. Most "it is configured but nothing happens" reports are a permission, not a configuration.

Three different identities matter, and they need different things.

## 1. The person who schedules the jobs

Scheduled Apex runs as **whoever created the schedule**, forever — not as the person who happens
to be logged in when it fires.

That user needs:

| Access | On | Why |
|---|---|---|
| Read, Create, Edit | **FrontSpin List** | Recording which lists exist |
| Read, Create, Edit | **FrontSpin List Membership** | Recording who was added |
| Read, Create, Edit | **FrontSpin Sync Error** | Writing down failures |
| Read | The reports used by [Report to List](../lists/report-to-list.md) | Running them |
| Visibility of the Contacts | — | See below |

**Schedule the jobs as a dedicated, permanent admin user.** If they are scheduled by somebody who
later leaves and is deactivated, the jobs stop.

## Contact visibility bounds what syncs

Contact's org-wide default is normally **Private**, and the Report-to-List sync respects sharing.
So the scheduling user's visibility is a ceiling on what can sync — a Contact they cannot see is a
Contact that cannot be added to a list.

This does not fail silently. The sync reports the shortfall as **CONTACTS_NOT_VISIBLE** rather
than quietly syncing fewer people than the report returned.

If a list is consistently short, check the scheduling user's sharing access before suspecting
FrontSpin.

## 2. Internal users who edit records

Ordinary users need nothing special. Saving a Contact queues the sync automatically; the queued
job does the talking.

They do need **read access to FrontSpin Sync Errors** if you want them to see why their own record
did not sync.

## 3. The portal's guest user

This one has a trap in it, and it is worth reading even if everything currently works.

The EasyCRM portal runs as the **Site Guest User**. Unlike normal Apex, object permissions **are**
enforced for a guest, so the guest needs explicit access:

| Access | On | For |
|---|---|---|
| Read | **FrontSpin List** | Showing the list picker in [List Mappings](../portal/list-mappings.md) |
| Create | **FrontSpin List** | The **Refresh lists** button adding newly-found lists |
| Read | **FrontSpin List Membership** | Showing sync health |

Grant these through the permission set the portal already uses for field access, on both the
admin and guest sides.

### The limit you cannot configure away

**A Guest User Licence forbids Edit and Delete on objects.** No permission set can grant it, and
Salesforce refuses the assignment if you try.

The practical consequence: the guest can **add** newly-discovered lists but can never **update** an
existing one. Refreshing a list that already exists fails with a duplicate-value error on the
list's key.

So the **Refresh lists** button in the portal reliably picks up lists that are new, and cannot
refresh the details of lists already recorded. The hourly
[List Catalog job](../lists/index.md) — which runs as a real user, not the guest — is what keeps
existing entries current.

This is a platform limit, not a bug, and not something a permission set will fix.

## What goes wrong

| Symptom | Cause |
|---|---|
| "Access to entity 'FrontSpin_List__c' denied" | The guest has no object permission at all. |
| "duplicate value found: List_Key__c" | The guest is trying to update an existing list. Expected — see above. |
| Jobs stopped after somebody left | They scheduled them. Reschedule as a permanent user. |
| A list is short every run | The scheduling user cannot see all the Contacts. |

## Where this fits

Next: [fields going out](./fields-going-out.md).
`;

f["frontspin/setup/fields-going-out.md"] = `---
title: 4. Fields going out
sidebar_position: 4
---

# Step 4 — Fields going out

## What you are doing

Saying which Salesforce fields should travel to FrontSpin when a record is sent. Standard fields
go anyway; this is for your own.

**This step is optional.** Skip it and the integration still syncs.

## Where

**Setup** → **Custom Metadata Types** → **FrontSpin Field Mapping** → **Manage Records**

![An outbound field mapping](../../img/shots/frontspin/setup-field-mapping-out.png)

## What a mapping holds

| Field | Means |
|---|---|
| **Label** | What you call it |
| **Object API Name** | \`Contact\`, \`Account\` or \`Lead\` |
| **Salesforce Field** | The field's API name, e.g. \`BDR__c\` |
| **FrontSpin Field** | The name FrontSpin knows it by |
| **Active** | Untick to switch the mapping off without deleting it |
| **Is Other Field** | See below |
| **Send When Blank** | Whether an empty value is sent, or the field omitted |
| **Skip Change Detection** | Send this field even when nothing changed |
| **Limit To Tenants** | Apply this mapping only to some tenants |
| **Tenant Ids** | Which ones, comma-separated |

## Is Other Field

FrontSpin has a fixed set of built-in fields, plus a bag of custom ones.

- **Unticked** — the field maps to one of FrontSpin's built-in fields.
- **Ticked** — the field goes into FrontSpin's custom-field area.

Anything of your own invention is almost always **ticked**.

## Send When Blank, and why it matters

With it **off**, an empty Salesforce field is left out of the message entirely, so FrontSpin keeps
whatever it already had.

With it **on**, the empty value is sent, and FrontSpin's value is cleared.

**Off is the safer default.** On is right when Salesforce is the authority for that field and
clearing it in Salesforce should clear it everywhere.

## Limit To Tenants

Leave unticked and the mapping applies to every tenant.

Tick it, and fill in **Tenant Ids** with a comma-separated list, to apply the mapping only to
those tenants. Use it when one customer has a custom field others do not.

## Skip Change Detection

Normally a record is only sent when a mapped field actually changed — which keeps you inside
FrontSpin's daily request allowance.

Tick this to send the field regardless. Use it sparingly: on a busy object it can turn a quiet
day into a day that exhausts the quota.

## A sensible order to add mappings

1. Start with none and confirm records sync at all.
2. Add the two or three fields the calling team actually reads.
3. Add the rest later, if anybody asks.

Mapping forty fields on day one makes the first failure much harder to diagnose.

## What goes wrong

| Symptom | Cause |
|---|---|
| The field never arrives | **Active** unticked, or the Salesforce API name is wrong. |
| It arrives empty | The field is empty on the record, or **Send When Blank** is off and it was cleared. |
| A custom field is rejected | **Is Other Field** should probably be ticked. |
| One tenant gets it, another does not | **Limit To Tenants** is on. |

## Where this fits

Next: [fields coming back](./fields-coming-back.md), which is the same idea in reverse and is
configured separately.
`;

f["frontspin/setup/fields-coming-back.md"] = `---
title: 5. Fields coming back
sidebar_position: 5
---

# Step 5 — Fields coming back

## What you are doing

Saying which values arriving **from** FrontSpin should be written onto the Salesforce record.

This is a **separate** list from [fields going out](./fields-going-out.md), on purpose. A field you
send is not automatically a field you accept back, and for most fields you do not want it to be —
otherwise FrontSpin could overwrite the number your team just corrected.

## Where

**Setup** → **Custom Metadata Types** → **FrontSpin Inbound Field Mapping** → **Manage Records**

![An inbound field mapping](../../img/shots/frontspin/setup-field-mapping-in.png)

## What a mapping holds

| Field | Means |
|---|---|
| **Label** | What you call it |
| **Object API Name** | \`Contact\`, \`Account\` or \`Lead\` |
| **Salesforce Field** | Where the value lands |
| **FrontSpin Path** | Where to find it in the incoming message |
| **Active** | Untick to switch it off |
| **Overwrite With Blank** | Whether an empty incoming value clears the Salesforce field |
| **Description** | Free text. Worth filling in. |

## FrontSpin Path

The incoming message is structured, so the path says where in it to look. A custom field arrives
under \`otherFields\`, so the path is typically:

\`\`\`
otherFields.BDR__c
\`\`\`

A built-in FrontSpin field is named directly, with no prefix.

## Overwrite With Blank

Off — an empty incoming value is ignored, and Salesforce keeps what it has.

On — the empty value is written, and the Salesforce field is cleared.

**Leave it off unless you are certain.** On means a blank in FrontSpin can wipe a value in
Salesforce, and the person who typed that value will not be told.

## Pairing inbound with outbound

For a field that should round-trip, create **both** a
[field going out](./fields-going-out.md) and a field coming back, with matching names. The
description field is a good place to note that they are a pair — the screen above does exactly
that.

For a field Salesforce owns, create only the outbound one. For a field FrontSpin owns — a call
outcome, say — create only the inbound one.

## What goes wrong

| Symptom | Cause |
|---|---|
| The value never arrives | **Active** unticked, or the path is wrong. |
| It arrives on the wrong field | **Salesforce Field** names a different field. |
| A good value was replaced by a blank | **Overwrite With Blank** is on. |
| A custom field never arrives | The path probably needs the \`otherFields.\` prefix. |

## Where this fits

Field mappings describe *what* comes back. [Webhooks](./webhooks.md) are *how* it gets here, and
without them nothing arrives at all.
`;

f["frontspin/setup/webhooks.md"] = `---
title: 6. Webhooks
sidebar_position: 6
---

# Step 6 — Webhooks

## What a webhook is

A message FrontSpin sends to your Salesforce org the moment something happens — a call is made, a
contact is edited. Without one, nothing comes back from FrontSpin at all.

## The two halves

| Half | Where | Who does it |
|---|---|---|
| A public address to receive messages | Salesforce Setup → Sites | You, once per org |
| Configuration saying which tenant a message belongs to | Custom Metadata | You, once per tenant |

Plus telling FrontSpin the address — done in FrontSpin, usually by whoever runs that account.

## The receiving address

**Setup** → search **Sites** → **Sites**

![Sites in Setup](../../img/shots/frontspin/setup-sites.png)

A Force.com site is what makes a URL in your org reachable from the internet. The one that
receives FrontSpin messages is usually called something like **Webhook Receiver**.

The address FrontSpin posts to ends in:

\`\`\`
/services/apexrest/frontspin/v1/<your url token>
\`\`\`

The **url token** on the end is how the receiver knows which tenant the message is about — the
message body does not reliably say. That is why each tenant gets its own token.

## The tenant configuration

**Setup** → **Custom Metadata Types** → **FrontSpin Webhook Config** → **Manage Records**

![A webhook configuration](../../img/shots/frontspin/setup-webhook-instance.png)

| Field | What to put |
|---|---|
| **Label** | The customer's name |
| **URL Token** | The secret ending of the receiving address |
| **Webhook Secret** | The signing secret FrontSpin gave you |
| **Instance Name** | The tenant's short name |
| **Tenant ID** | The same number as in [the configuration row](./configuration.md) |
| **Expected Webhook Id** | Optional. Extra confirmation the message is genuine. |
| **Correlation Retry Attempts** | Optional. See below. |
| **Correlation Retry Delay Minutes** | Optional. See below. |

The two secrets are hidden once saved — the screens above show them blacked out for exactly that
reason.

## Per-object configuration

A tenant may have more than one row, one per kind of message:

![A per-object webhook configuration](../../img/shots/frontspin/setup-webhook-object.png)

Here the label ends in \`contact\`, marking it as the configuration for contact messages from that
tenant.

## The correlation retry fields

Sometimes a message arrives about a record Salesforce has not finished creating — a call logged
within a second of the contact being made.

These two fields say how many times, and how far apart, to look again before giving up. Leave them
blank unless you are seeing messages rejected for an unknown record; the defaults are sensible.

## How a message is proved genuine

FrontSpin signs every message with a header named \`x-frontspin-signature\`, computed from the
webhook secret and the message body. The receiver recalculates the signature and refuses anything
that does not match.

That is why the secret matters: without it, anybody who learned your URL could post fake calls
into your CRM.

## What FrontSpin does when delivery fails

It retries up to **four** times, at random intervals of one to five minutes, giving up after about
ten minutes.

So a brief outage loses nothing. A long one does, and those events do not come back — which is
why the [sync health view](../portal/sync-health.md) is worth a look after any extended outage.

## What goes wrong

| Symptom | Cause |
|---|---|
| Nothing ever arrives | FrontSpin has the wrong address, or the site is inactive. |
| Messages are refused | The **Webhook Secret** does not match the one FrontSpin is signing with. |
| They arrive but match no record | The record does not exist yet. Try the correlation retry fields. |
| One tenant works, another does not | Each tenant needs its own row and its own **URL Token**. |

## Where this fits

Last step: [check the whole thing](./checking-it.md).
`;

f["frontspin/setup/checking-it.md"] = `---
title: 7. Checking it
sidebar_position: 7
---

# Step 7 — Checking it

## The built-in health check

There is a configuration checker that reads everything you have just set up and reports what is
wrong with it. It makes **no** calls to FrontSpin, writes nothing, and never prints a secret.

**Where:** Salesforce **Setup** → **Developer Console** → **Debug** → **Open Execute Anonymous
Window**

Run:

\`\`\`java
System.debug(FrontSpinConfigCheck.report());
\`\`\`

Tick **Open Log**, click **Execute**, and read the result.

## What it tells you

Findings come at three levels:

| Level | Means |
|---|---|
| **ERROR** | Something is genuinely wrong and must be fixed |
| **WARNING** | Incomplete, or would be refused once routing is enforced |
| **INFO** | Normal state, or something you should know |

A Record Type with no mapping yet is reported as a **warning or information**, never an error —
because during a rollout that is simply work not done yet, not a mistake.

## Run it before switching anything on

The check exists so that the state of the configuration is obvious **before** anyone enforces
strict routing. If you are planning to move off the default mode, run this first and clear every
error. See [moving off LEGACY](../routing/index.md#moving-off-legacy).

## A first real test

Once the check is clean:

1. Open a Contact with the new Record Type.
2. Change something small — a job title.
3. Save.
4. Wait a minute.
5. Look at the contact in FrontSpin.

If it arrived, the outbound path works end to end.

Then make a change **in FrontSpin** to a mapped field and watch it appear in Salesforce. That
proves the webhook.

## If the test fails

Check in this order — it is roughly cheapest-first:

1. **[Sync errors](../troubleshooting/sync-errors.md)** — did the record fail, and why?
2. **The configuration row** — does the Record Type developer name match exactly?
3. **[Permissions](./permissions.md)** — can the running user write what it needs to?
4. **The health check** again — it may have been clean before your last edit.

## What to hand over

When the tenant is live, whoever runs it day to day needs:

- Where [sync errors](../troubleshooting/sync-errors.md) are, and what to do about them
- That [lists are add-only](../understand/what-syncs.md#why-add-only-matters-more-than-it-sounds)
- The [checklist](../reference/checklist.md)

## Where this fits

The tenant is live. If this is the **only** FrontSpin account, you are done. If there are
others, read [Routing](../routing/index.md) next.
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
for (const [rel, body] of Object.entries(cat)) {
  const dest = path.join(DOCS, rel, "_category_.json");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, JSON.stringify(body, null, 2) + "\n", "utf8");
}
console.log(`Wrote ${n} pages and ${Object.keys(cat).length} categories.`);
