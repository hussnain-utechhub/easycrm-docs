---
title: Sharing a report
sidebar_position: 16
---

# Sharing a report

**What it is.** Letting somebody other than you open a report you saved.

**What it does.** There are three ways. Two are yours to use, and an administrator does the third.
Dashboards are shared in exactly the same three ways.

**Why it matters.** The three reach different people. The one that is easiest to find, the
**Shared** box, does not reach ordinary colleagues in a portal with companies. So it is worth
knowing which one you need before relying on it.

## The three ways

| | Who does it | Where | What it gives |
|---|---|---|---|
| **The Shared box** | anybody who can edit the report | the list's row menu → **Edit Properties** | **Read**, to Admins and to people with no company. See below. |
| **Visibility: My company** | the report's owner, or a Super Admin | in the builder: **Save options** (▾) → **Properties** | **Read** or **Edit**, to your company's **Admins** |
| **Sharing to named people** | an Admin at your company, or a Super Admin | **Admin** → **Reports & Dashboards** | **Read** or **Edit**, to the Standard users they choose |

In a portal with companies, the usual route to a colleague is the second and third together:
the owner sets **My company**, then an Admin shares it on to the people who need it.

## The Shared box

**Where:** In the portal → **Reports** → the report's row menu (▾) → **Edit Properties**

The box is labelled **Shared (visible to all portal users)**. It is not in the report builder. It
is only in the **Edit Properties** dialog on the list.

1. Click **Reports** in the top menu.
2. Find the report and click ▾ at the end of its row.
3. Click **Edit Properties**.
4. Tick **Shared (visible to all portal users)**.
5. Click **Save**.

For a dashboard, do the same from the **Dashboards** list.

The ticked box is what the list calls **Public**. It decides whether the report shows under
**Public Reports** or **Private Reports**, and what the **Visibility** column says.

:::caution "All portal users" is not what it does in a portal with companies
Despite its label, the box gives **Read** access to these people only:

| The other person | Can they open it? |
|---|---|
| A **Standard** user who belongs to a company | **No** |
| A user who does not belong to a company | **Yes** |
| An **Admin**, at any company | **Yes** |
| A **Super Admin** | **Yes** (they can open everything anyway) |

So in a portal shared by several companies, ticking **Shared** changes nothing for your ordinary
colleagues. It does show the report to the Admins of **every** company, not just yours. Nothing
on screen tells you either of these things.
:::

If everybody in your portal is outside any company — one organisation using the portal — the box
does reach every portal user.

## Visibility: My company

**Where:** In the portal → **Reports** → the report → **Edit** → **Save options** (▾ beside
**Save**) → **Properties**

This is the setting your company's administrators work from.

1. Open the report in the builder.
2. Click the ▾ beside **Save**, then **Properties**. The **Report Properties** dialog opens.
3. Under **Visibility**, choose **My company**.

   <!-- SHOT: analytics/report-properties-visibility.png | report builder signed in as a user who belongs to a company, Save options ▾ → Properties, the "Report Properties" dialog with Visibility set to My company and Company access set to Read, the note visible -->

4. Under **Company access**, choose **Read** or **Edit**.
5. Click **Apply**, then save the report. As the dialog says: *Your company's admins can see it;
   you can then re-share it to your team on the Reports tab. Applied when you Save.*

**My company** only appears if you belong to a company. Otherwise the only choice is
**Only me (private)**.

What it does:

- Every **Admin** at your company can open the report, at the level you chose.
- **Standard** users at your company get nothing yet. An Admin shares it on to the ones who need it
  (next section).

**For a dashboard,** the same **Visibility** and **Company access** choices are in the
**Save Dashboard** dialog. That dialog appears the first time you save a dashboard, and on
**Save As**. See [The dashboard builder](../dashboards/builder.md#saving).

**Only the owner or a Super Admin can change Visibility.** If somebody else with edit access
changes it and saves, their change is quietly ignored. Their other edits are saved.

A new report, a new dashboard and a **Clone** always start as **Only me (private)**, with the
**Shared** box unticked.

## Sharing to named people

An **Admin** at your company, or a **Super Admin**, does this under **Admin** →
**Reports & Dashboards** in the portal. They pick reports or dashboards, pick Standard users at
your company, and choose **Read** or **Edit**. See
[Reports and Dashboards](../../admin/data/report-folders.md).

The limits they work within:

- They can only share what your company holds. A report built here is held by your company once
  its owner sets **Visibility** to **My company**. An Admin can also share on a dashboard they
  own themselves.
- They cannot give more than your company has. A report held at **Read** cannot be shared at
  **Edit**.
- Sharing is per report. Ticking a folder on their screen selects the reports in it at that
  moment. A report put in the folder later has to be shared separately.

A report that came **from Salesforce** reaches your company a different way. A Salesforce
administrator shares it with your company from the
[Portal Users](../../admin/salesforce/portal-users.md) tab in Salesforce, and then an Admin shares
it on in the same way.

| Access | Lets them |
|---|---|
| **Read** | open and run it |
| **Edit** | open it and change it for everybody it is shared with |

**Read is the right default.** Edit means their changes land for everyone the report is shared
with, including you.

## Who can always see your report

Two people see it whatever you do:

- **you**, because you own it
- a **Super Admin**, who can see and edit everything

## Taking access away

| To undo | Do this |
|---|---|
| The **Shared** box | Untick it in **Edit Properties**. Its effect stops at once. |
| **My company** | Set **Visibility** back to **Only me (private)** and save. Your company's Admins lose the access it gave them. |
| A share to a named person | Ask the Admin who made it. They remove it, or lower it from **Edit** to **Read**, under **Admin** → **Reports & Dashboards** → **Current access**. |

Setting **Only me** does **not** undo shares an Admin has already made to named people from your
company. Those people keep their access until the Admin removes it.

## What goes wrong

| Symptom | Cause |
|---|---|
| I ticked **Shared** and my colleagues still cannot see it | They are Standard users at a company. The box never reaches them. Use **My company**, then ask an Admin to share it with them. |
| I ticked **Shared**, edited the report, and now the list says **Private** again | Saving a report in the builder clears its **Shared** box. Tick it again in **Edit Properties** after each save. |
| There is no **My company** choice | You do not belong to a company. Only **Only me (private)** is offered. |
| My **Visibility** change did nothing | You are not the owner. Only the owner or a Super Admin can change it. |
| I cannot find where to change a dashboard's **Visibility** | It is only asked in the **Save Dashboard** dialog, which appears on the first save and on **Save As**. To change it later, use **Save As** and set it on the copy. A Super Admin can also change your company's level between **Read** and **Edit** under **Admin** → **Reports & Dashboards**. |
| An Admin at another company can see my report | Its **Shared** box is ticked. That box reaches every Admin in the portal. |
| I set **Only me** and a colleague can still open it | An Admin shared it with them by name. Those shares stay until the Admin removes them. |
| The list shows **Private** for a report my company can see | **Private** and **Public** only follow the **Shared** box, not **Visibility**. |

## Related

| | |
|---|---|
| [Report folders](./folders.md) | organising reports into folders, which shares nothing |
| [Reports and Dashboards](../../admin/data/report-folders.md) | the administrator's sharing screen |
| [Exporting](./exporting.md) | sending the numbers to somebody with no portal login |
