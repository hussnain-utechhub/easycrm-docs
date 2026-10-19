---
title: Publishing a portal report to Salesforce
sidebar_position: 1
---

# Publishing a portal report to Salesforce

**What it is.** Taking a report somebody built in the portal and creating it as a **real native
Salesforce report** in your org.

**What it does.** It builds the equivalent Salesforce report — the same object, columns, grouping,
filters and chart — and puts it in a Salesforce folder. From then on it is an ordinary Salesforce
report: it opens in Salesforce, it can go on a Salesforce dashboard, and it can be scheduled.

**Why it helps.** People who live in Salesforce and never open the portal can still see the
numbers, without anyone rebuilding the report by hand.

## Before you start

- The report must already exist **in the portal**. This screen publishes existing reports; it does
  not create them. See [Starting a new report](../../use/reports/report-types.md).
- You need access to the **EasyCRM app in Salesforce** — see [The EasyCRM app](./index.md).

## Opening the screen

**Where:** In Salesforce → **App Launcher** → **EasyCRM** → **Publish Portal Reports**

1. Sign in to **Salesforce**.
2. Open the **App Launcher** (the nine dots, top left) and choose **EasyCRM**.
3. Click the **Publish Portal Reports** tab.

![The Publish Portal Reports screen, listing every portal report with a Publish button](../../img/shots/sf/app-publish-reports.png)

Every report built in the portal is listed here, one per row.

## What each column tells you

| Column | What it means |
|---|---|
| **Report** | The report's name in the portal. |
| **Object** | What the report is built on — Account, Contact, Activity and so on. |
| **Chart** | The chart type on the portal report, or **Table** if it has none. |
| **Folder** | The Salesforce folder the published report will go into. **Private Reports** means only you will see it. |
| **Native Report** | **Open in Salesforce** appears once it has been published. Before that, there is nothing to open. |
| **Action** | The **Publish** button. |

## Publishing one

1. Find the report's row in the list.
2. Check the **Folder** column. If it says **Private Reports**, only you will be able to see the
   result — move it to a shared folder afterwards if other people need it.
3. Click **Publish** on that row.
4. Wait for the page to come back. It is talking to Salesforce's own reporting API, so it takes a
   few seconds.
5. Click **Open in Salesforce** in that row to check the result.

Publishing the same report again **replaces** what was published before. It does not create a
second copy.

## Messages you may see, and what they mean

Publishing tells you when the Salesforce version cannot be exactly the portal version, rather than
quietly producing something that looks right and counts differently. These are the ones worth
knowing.

:::caution A different number in Salesforce than in the portal
If a message mentions the **join** or the **report type**, read it before trusting the figure.
Salesforce has no report type for some of the combinations the portal supports — an "all rows, with
or without" join is the common one. The nearest Salesforce type counts **fewer** rows, so the
published report can show a lower total than the portal. The message says so explicitly; it is not
a failure, it is a warning that the two will not agree.
:::

| If the message says | What has happened |
|---|---|
| *"Salesforce would not accept the formula column…"* | The report published, but without that formula column. Everything else is correct. |
| *"…no matching report type"* / *"all rows (with or without)"* | The join could not be reproduced exactly. Expect a lower count in Salesforce. |
| *"Salesforce counts an activity once per related…"* | An activity shared with several contacts is counted differently by Salesforce than by the portal. |
| *"Could not create the activity report in Salesforce"* | Nothing was published. Nothing in Salesforce was changed. |

## Row-level formulas do not come across

Summary-level formulas publish with the report. **Row-level formulas do not** — Salesforce only
exposes those through a different API. After publishing, use
[Sync Report Formulas](./sync-formulas.md) to bring them across.

## If a report is not in the list

Only reports saved in the portal appear here. If one is missing, it has not been saved, or it was
saved into a personal folder that this screen cannot read.
