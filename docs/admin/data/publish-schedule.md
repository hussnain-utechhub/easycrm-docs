---
title: Publish Schedule
sidebar_position: 19
---

# Publish Schedule

**What it is.** Copying portal reports into Salesforce automatically — on a timetable, or the
moment a report is saved.

**What it does.** It publishes a portal report as a Salesforce report, and keeps that Salesforce
report up to date.

**Why it helps.** People who work in Salesforce see the same numbers as people in the portal,
without anybody rebuilding the report twice or exporting it by hand.

:::note Super Admin only
Only a **Super Admin** sees this tab. It cannot be given to a company's Admins.
:::

This is the unattended version of a job you can also do by hand from Salesforce — see
[Publishing a portal report to Salesforce](../salesforce/publish-reports.md). Everything that page
says applies here too, because a scheduled publish uses exactly the same machinery — including
this:

:::caution Reports synced from Salesforce are published over their originals
A report that was brought into the portal from Salesforce is linked to that Salesforce report.
Scheduling it, or saving it with **Publish on save** on, **overwrites the original Salesforce
report** with the portal's version.
:::

## Opening it

**Where:** In the portal → **Admin** → **Publish Schedule**

1. Click **Admin** in the top menu.
2. Click **Publish Schedule** in the row of tabs.

![Publish Schedule](../../img/shots/admin/publish-schedule.png)

## Two things must be true before anything publishes

1. **Auto-publish** is **ON** — the switch at the top of this screen.
2. **The hourly job is installed in Salesforce** — a one-off step for a Salesforce
   administrator.

Schedules can be set up before either is done; they just do not run.

### Auto-publish

The **Auto-publish** card at the top reads **OFF** or **ON**.

| State | What happens |
|---|---|
| **OFF** *(default)* | *Nothing publishes automatically while this is off. Publishing by hand is unaffected.* |
| **ON** | *Reports with a schedule below publish automatically.* |

Click **Turn on** or **Turn off**. Turning it off keeps every schedule, so you can turn it back on
without setting anything up again.

That is deliberate: it writes into Salesforce on a timer, and that should be a decision rather
than a default.

### Installing the hourly job in Salesforce

Until it is installed, the screen shows:

*The hourly job is not installed in Salesforce yet. Schedules can be set up here, but nothing will
publish until an administrator schedules PortalPublishScheduler once in Setup → Apex Classes →
Schedule Apex.*

![Publish Schedule with Auto-publish on and the banner saying the hourly job is not installed](../../img/shots/admin/publish-schedule-not-installed.png)

A Salesforce administrator does this once. The simplest way is one line of Apex, run from the
Developer Console (**Debug** → **Open Execute Anonymous Window**):

```apex
System.schedule('EasyCRM Portal Auto-Publish', '0 5 * * * ?', new PortalPublishScheduler());
```

That runs the job at five past every hour. If you use **Schedule Apex** in Setup instead, keep
**Auto-Publish** in the job's name — that is how this screen recognises the job.

:::caution Schedule it as a service user, not as a person
The job runs as whoever scheduled it. Use a dedicated Salesforce admin account that has API
access and can edit reports — not a person who may leave or lose their rights, which would stop
publishing without anyone noticing.
:::

Press **Refresh** on this screen afterwards. The toast confirms it:
**Refreshed. Hourly job installed; next sweep** *time*.

:::note If Salesforce refuses the line
In an org where the package is installed with its namespace, Salesforce may refuse to schedule
the class from your org. If it does, contact support rather than working around it.
:::

### How often it really checks

The hourly job is the safety net. While **Auto-publish** is on, the portal also checks every
minute for reports that are due, so a report normally publishes within a minute of its time. The
hourly job restarts that per-minute check if it ever stops.

The line above the table says which is in charge — **N scheduled · M paused ·** and then:

| Engine status | Meaning |
|---|---|
| **checking every minute (last check** *N*s **ago)** | Everything is working. |
| **per-minute checking stopped - hourly backup runs at** *time* | Reports still publish, at the next hourly run. |
| **idle - auto-publish is off** | Nothing publishes. Turn **Auto-publish** on. |
| **not installed - schedules will not run** | Install the hourly job. |

**Refresh** re-reads everything — useful straight after installing the job.

## Scheduling a report

**Where:** **Admin** → **Publish Schedule** → the report's row

1. Find the report. Its folder is shown under its name.
2. Choose **How often**: **Off**, **Hourly**, **Daily** or **Weekly**.
3. For **Daily** or **Weekly**, set the **Time**. For **Weekly**, choose the **Day** too.
4. Check **Next run**.

There is no Apply button: each change saves as soon as you make it. A **Daily** or **Weekly**
schedule with no time is kept but never runs, and the screen warns you:
**Set a time for this report — until then it will not publish.**

**Next run** shows exactly when the report will next publish, in your own time zone — so if the
time you chose lands somewhere unexpected, you see it now rather than at 2am.

### What the list shows you

| Column | What it means |
|---|---|
| **Report** | The portal report, with its folder underneath. |
| **How often** | **Off**, **Hourly**, **Daily** or **Weekly**. |
| **Time** | For Daily and Weekly. A dash otherwise. |
| **Day** | For Weekly. A dash otherwise. |
| **Next run** | When it will next publish. A dash when there is no schedule, no time, or the report is paused. |
| **Last published** | When it last published successfully, or **never**. |
| **Status** | See below. Click it to read the full result of the last attempt. |
| Buttons | **Run next sweep** on a scheduled report; **Resume** on a paused one. |

### Status

| Status | Meaning |
|---|---|
| **Off** | No schedule. |
| **Waiting** | Scheduled, and not published yet. |
| **OK** | The last publish worked. |
| **Warning** | It published, but with a note — usually that the Salesforce count cannot match the portal's exactly. |
| **Failed** | The last attempt failed. |
| **Paused** | The Salesforce report was deleted. See [Paused reports](#paused-reports). |

Click a status to open the last result in full, with the report's name as its title. **Close**
puts it away.

![The status window opened from a Warning on Publish Schedule](../../img/shots/admin/publish-schedule-status-dialog.png)

### Choosing a frequency

Match it to how fast the data changes and who is waiting for it.

| Frequency | Suits |
|---|---|
| **Hourly** | Numbers people watch during the day. Publishes at the top of each hour. |
| **Daily** | Most reports. |
| **Weekly** | Summaries nobody reads more often than that. |
| **Off** | Leave it out of the schedule entirely. |

More often is not better. Each publish does real work, and a report nobody looks at before Monday
does not need rebuilding every hour.

## Setting every report at once

The bar above the table reads **Set all reports to** [How often] **at** [time] **on** [day].

1. Choose the frequency, and the time and day where they apply.
2. Click **Apply to all**.
3. Confirm in **Apply to every report** — for example *Set all 30 reports to daily at 02:00?*, or
   *Turn off auto-publish for all 30 reports?* — with **Apply**.

**Paused reports are left alone**, so setting everything to Daily does not silently restart
something that was paused for a reason. The toast says how many were updated and how many paused
reports were skipped.

<!-- SHOT: admin/publish-schedule-apply-all.png | Publish Schedule with the bar set to Weekly at 02:00 on Monday and the "Apply to every report" confirmation open -->

## Publishing sooner

**Run next sweep**, on a scheduled report's row, brings **that one report** forward so the next
check picks it up — normally within a minute. It does not touch any other report, and it does
not publish from the portal directly: the work is always done by the Salesforce job.

The toast reads **Brought forward — it will publish on the next hourly sweep.** The button is
only on reports that have a schedule.

To publish immediately, or to see the full message while you watch, use
[Publish Portal Reports](../salesforce/publish-reports.md) in Salesforce.

## When a publish fails

A failed report is tried again **60 minutes** later, up to **3 attempts** in all. After that it
goes back to its normal schedule, so a report that is genuinely broken reports once a cycle
rather than every hour.

The **Status** column shows **Failed**; click it for the reason. It is usually about a formula
column or a join Salesforce cannot reproduce exactly — publishing it by hand from
[Publish Portal Reports](../salesforce/publish-reports.md) shows the same message.

### The digest email

After a run in which anything **failed**, was **paused** or published **with a warning**, every
active Super Admin with an email address receives one summary email, titled
**Portal auto-publish: N failed, M with warnings**. A run where everything published cleanly
sends nothing. Like every portal email, it needs Salesforce email deliverability to be on.

## Paused reports

A schedule **pauses** when the **Salesforce report it publishes to has been deleted**. Automatic
publishing never re-creates a deleted report: deleting it is usually deliberate, and a robot
re-creating reports — after a sandbox refresh, say — would undo that by the dozen.

The status reads **Paused**, and its result says:
*Paused: the Salesforce report was deleted. Nothing was re-created. Use Publish now to re-create
it, then resume the schedule.*

- A paused report is **skipped** by every check. It is not retried.
- **Apply to all** leaves it alone.

To start it again:

1. In Salesforce, open **Publish Portal Reports** and click **Publish** on that report. Publishing
   by hand does re-create a deleted report.
2. Back here, click **Resume** on its row. The toast reads **Resumed.**

Resuming without step 1 only pauses it again at its next run. Choosing a new frequency for it
also clears the pause.

<!-- SHOT: admin/publish-schedule-paused.png | Publish Schedule with one row showing the Paused status and the Resume button -->

## Publishing the moment a report is saved

**Publish on save** is a second card, shown only while **Auto-publish** is **ON**. Both must be on
for it to do anything.

| Setting | What happens when somebody saves a report in the portal |
|---|---|
| **OFF** *(default)* | *Reports publish on their schedule only. Saving one in the portal does not update Salesforce.* |
| **ON** | *Saving a report that is already linked to Salesforce republishes it within seconds. Portal-only reports are never published automatically.* |

"Linked to Salesforce" means published at least once — or synced from Salesforce in the first
place. A paused report is not published on save.

A save normally reaches Salesforce in **one to four seconds**.

The result is kept as the report's last result, so click its **Status** to read it — for example
**Auto-published on save.**, or *Auto-publish on save stopped: the Salesforce report was deleted.
Nothing was re-created. Publish it by hand to link this report again.* The status colour itself
follows scheduled runs, so read the text.

### Why it is not instant, exactly

The portal runs as the site's guest user, and a Guest User licence can never hold API access. A
publish attempted as the guest comes back refused. So saving a report does not call Salesforce
directly — it raises an internal request, and a subscriber in Salesforce does the work as a proper
licensed user a moment later.

That is also why the delay is a second or two rather than instant, and why this needs one piece of
Salesforce setup before it works at all.

### The setup step in Salesforce, which is easy to miss

Without it the subscriber runs as **Automated Process**, which has no API access either, and every
publish fails — the result reads *Auto-publish on save skipped: no Salesforce session…* or a
permissions error that does not obviously point here.

1. In Salesforce, create a **Platform Event Subscriber Configuration** for
   `Portal_Publish_Request__e`, naming a user who has API access and can edit reports.
2. **Restart the subscriber**: go to the `PortalPublishRequestTrigger` trigger, deactivate it, save,
   then reactivate it and save again.

:::caution Step 2 is not optional
Creating the configuration alone does not take effect. The subscriber keeps running as the old user
until the trigger is restarted — so it looks correctly configured and still fails.
:::

If publish-on-save is switched on and nothing happens, check these two before anything else.

## Turning it off again

Click **Turn off** on the **Auto-publish** card. Schedules are kept but stop running, and
**Publish on save** stops with it.

## What is recorded

Every change on this screen — a schedule, **Apply to all**, **Run next sweep**, **Resume**, either
switch — is written to the [Audit Log](../operations/audit-log.md) under
**Report: Publish schedule**, and so is any attempt that was refused. Each automatic publish is
logged under **Report: Publish to Salesforce** with the username **System**.

## What goes wrong

| Symptom | Cause |
|---|---|
| Nothing ever publishes | **Auto-publish** is off, or the hourly job is not installed. The engine status says which. |
| *Set a time for this report — until then it will not publish.* | A Daily or Weekly schedule has no time. |
| A report shows **Paused** | Its Salesforce report was deleted. Publish it by hand, then **Resume**. |
| A report keeps failing | Click **Failed** to read why, or publish it by hand to see the same message. |
| *Skipped: could not obtain a Salesforce session for unattended publishing. Check that the scheduling user is active and can run Apex.* | The user who scheduled the hourly job is inactive or lacks access. Reschedule it as a working service user. |
| **per-minute checking stopped - hourly backup runs at** … | Reports still publish, hourly. The hourly job restarts the per-minute check. |
| Saving a report does not update Salesforce | **Publish on save** is off, **Auto-publish** is off, the report has never been published, or the subscriber setup step was missed. |
| A Salesforce report someone maintains by hand was overwritten | It was synced into the portal and then scheduled or saved with **Publish on save** on. |
| No digest email arrived | Everything published cleanly, or no active Super Admin has an email address, or email deliverability is off. |

## Related

- [Publishing a portal report to Salesforce](../salesforce/publish-reports.md) — publishing by
  hand, and every message explained.
- [The EasyCRM app in Salesforce](../salesforce/index.md) — where the manual screens live.
