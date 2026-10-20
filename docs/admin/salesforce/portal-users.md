---
title: Portal Users and Portal Reports
sidebar_position: 3
---

# Portal Users and Portal Reports

One Salesforce tab, two cards. **Portal Users** is the Salesforce-side view of who can sign in.
**Portal Reports** is how a Salesforce report becomes visible in the portal at all.

**Where:** In Salesforce → **App Launcher** → **EasyCRM** → **Portal Users**

1. Sign in to **Salesforce**.
2. Open the **App Launcher** (the nine dots, top left) and choose **EasyCRM**.
3. Click the **Portal Users** tab.

![The Portal Users tab, showing the Portal Users list and the Portal Reports card](../../img/shots/sf/app-portal-users.png)

## Portal Users

| Control | What it does |
|---|---|
| **New User** | Creates a portal user without leaving Salesforce. |
| **Search username…** | Finds somebody in the list. |
| **Username** / **Email** / **Role** | Who they are and what they are. |
| **Manager** | Who they report to, which is what a Standard user's Admin is working from. |
| **Active** | Whether they can sign in. |
| **Last Login** | When they last did. Blank means never. |
| **Locked** | Whether they are locked out. |

A blank **Last Login** on an account somebody says is broken usually means they have never
successfully signed in, rather than that something stopped working.

## Portal Reports

This is the one that catches people out: **a Salesforce report is not visible in the portal until
it has been synced here.** Sharing it in the portal first does nothing, because there is nothing
to share.

| Control | What it does |
|---|---|
| **Sync & Share Folders** | Opens the wizard: pick Salesforce folders, sync them, then share them with companies. |
| **Refresh All Data** | Re-runs every snapshot. |
| **Find a report** | Searches what is already synced. |
| **Synced Live — runs on the site** | The reports that run live against your data each time somebody opens them. |
| **Report** / **Object** / **Chart** / **Folder** / **Updated** | What each synced report is and when it last changed. |
| The bin icon | Stops syncing that report. |

### Live or snapshot is decided for you

**Sync to Site** runs the report **live on the site when possible**, so it is always current. If
the report is too complex to run that way, it **falls back to a cached Snapshot** that refreshes
on a schedule.

That is automatic. You are not choosing between them — you are being told which one you got.

:::tip A number that disagrees with Salesforce
Check whether the report is live or a snapshot. A snapshot is a picture from its last refresh, so
disagreeing with Salesforce is normal and means only that the data has moved since. **Refresh All
Data** re-runs the snapshots.
:::

### Sharing folders with companies, step by step

This is the wizard that puts Salesforce report folders in front of portal companies. It has three
steps, and it will not let you past one until that step has something chosen.

**Where:** Salesforce → **App Launcher** → **EasyCRM** → **Portal Users** tab → **Portal Reports**

---

#### 1. Open it and choose what you are sharing

1. Click **Sync & Share Folders**. A panel opens with two tabs: **Share new** and
   **Already shared**. You start on **Share new**.
2. Choose the kind, using the two buttons at the top:

   | Button | Shares |
   |---|---|
   | **Reports** | report folders |
   | **Dashboards** | dashboard folders |

   You can only do one kind at a time. To do both, run the wizard twice.

3. Under **Folders on this org**, tick each folder you want to share.

   **Clear** unticks everything, if you want to start again.

4. Click **Next: choose companies**.

:::tip Share the folder, not the report
Everything in the folder is covered — including reports added to it next month. That is why this
screen is folder-first: share once, and you are not back here every time somebody builds a report.
:::

---

#### 2. Choose who receives it, and how much

5. Under **Companies — who receives this**, tick each company that should get these folders.
6. Choose the access, with the two buttons:

   | Access | What that company can do |
   |---|---|
   | **Read** | open and run everything in the folder |
   | **Edit** | open it and change it — and their changes are what everyone else then sees |

   **Read is the right default.** Pick Edit only when somebody has actually asked to change the
   reports, not just to look at them.

7. Click **Review**.

---

#### 3. Check it, then share

8. The **About to share** panel lists exactly what is about to happen — which folders, to which
   companies, at what level. Read it; this is the last point before anything changes.
9. Click **Share**.

That is it. The companies you picked can see those folders in the portal immediately.

| Button | What it does |
|---|---|
| **Back** | returns to the previous step, keeping what you chose |
| **Cancel** / **Close** | abandons the whole thing, changing nothing |

:::note Running it twice is safe
Sharing the same folder with the same company again **updates** the existing grant rather than
adding a second one. So if you shared at Read and meant Edit, simply run it again and choose Edit
— you will not end up with two grants fighting each other.
:::

---

### Changing or removing access later

1. Click **Sync & Share Folders**.
2. Click the **Already shared** tab.

Under **Existing company grants** you get every grant that exists, with:

| Control | What it does |
|---|---|
| **Read** / **Edit** | changes that company's level on that folder, in place |
| **Revoke** | removes the grant entirely |
| **Refresh** | re-reads the list, if somebody else has been changing things |

**Changes here take effect immediately** — there is no confirmation step and no Save. A revoke is
live the moment you click it.

If it says **No company grants yet**, nothing has been shared from this screen.

## Related

- [Reports and Dashboards](../data/report-folders.md) — sharing, from inside the portal, once a
  report is here.
- [Publishing a portal report to Salesforce](./publish-reports.md) — the opposite direction.
