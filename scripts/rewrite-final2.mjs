/* Last batch: the remaining reports pages, files, and three admin pages. */
import fs from "node:fs";
import path from "node:path";

const DOCS = path.join(process.cwd(), "docs");
const f = {};

const BUILDER_NAV =
  "**Where:** **Reports** → a folder → the report's name → **Edit**";

f["reports-and-dashboards/bucket-columns.md"] = `---
title: Bucket columns
sidebar_position: 7
---

# Bucket columns

**What it is.** A column you invent, which sorts existing values into groups you name
yourself.

**What it does.** You take a field and say "these values are Small, these are Medium, these
are Large". The report then has a column holding those names.

**Why it helps.** You can group and total by categories that matter to your business without
anybody adding a field to the database. No developer, no waiting.

## Creating one

${BUILDER_NAV} → **Outline** → **Add column…** → **Add Bucket Column**

1. Click **Reports** in the top menu.
2. Click the folder, then the report's **name**, then **Edit**.
3. In the **Outline** tab, click the **Add column…** box.
4. Choose **Add Bucket Column**.
5. Pick the field whose values you want to sort.
6. Name each bucket, and put values into it.
7. Click **Apply**.

The new column appears in the preview straight away.

## How values are sorted depends on the field

| Field type | How you define the buckets |
|---|---|
| **Picklist** | Drag the available values into named buckets. |
| **Number** | Set ranges, such as 0–99, 100–999, 1000 and above. |
| **Text** | List which exact values belong in each bucket. |

## Anything left over

Values you do not place land in **Unbucketed Values**. You can rename that to something
clearer, such as "Other" or "Not set".

Always check what has fallen in there. A large Unbucketed group usually means values you did
not expect — which is itself worth knowing.

## Using the column

A bucket column behaves like any other column. You can:

- Group rows by it, to get a subtotal per bucket.
- Group columns by it in a matrix.
- Filter on it.
- Sort by it.

## Changing one

Click **Column actions** on the bucket column, then edit it. The report updates immediately;
no data is changed, because a bucket exists only inside this report.

## It lives in one report

A bucket column belongs to the report you made it in. To use the same grouping elsewhere,
either copy the report with **Save As**, or ask an administrator for a real field if you need
it everywhere.
`;

f["reports-and-dashboards/formulas.md"] = `---
title: Formula columns
sidebar_position: 8
---

# Formula columns

**What it is.** A column that calculates its own value instead of reading a field.

**What it does.** You write a short expression and the report works out the answer — for every
row, or for every group.

**Why it helps.** Percentages, differences and ratios stop being something you do afterwards
in a spreadsheet. The report is the finished answer.

There are two kinds, and the difference matters more than anything else on this page.

## Row-level formula — calculates per record

${BUILDER_NAV} → **Outline** → **Add column…** → **Add Row-Level Formula**

1. Open the report in the builder.
2. In the **Outline** tab, click **Add column…**
3. Choose **Add Row-Level Formula**.
4. Name the column.
5. Write the expression, using the fields and functions offered.
6. Click **Apply**.

Use it for things that are true of a single record: days between two dates, a value times a
rate, two fields added together.

## Summary formula — calculates per group

${BUILDER_NAV} → **Outline** → **Add column…** → **Add Summary Formula**

1. Open the report in the builder.
2. Click **Add column…**
3. Choose **Add Summary Formula**.
4. Name it and write the expression, using the report's totals.
5. Choose **How to apply this formula**:
   - at every grouping level, or
   - only at the grand total.
6. Click **Apply**.

Use it for things that only make sense across several records: a percentage of a total, a
conversion rate, an average of averages.

A summary formula needs the report to be **grouped**. With no groups there is nothing to
summarise.

## Which one do I want?

Ask whether the answer makes sense for one record on its own.

| Question | Makes sense for one record? | Use |
|---|---|---|
| How many days old is this? | Yes | **Row-level** |
| Value times commission rate | Yes | **Row-level** |
| What share of the month's total is this rep? | No | **Summary** |
| Win rate | No | **Summary** |

Choosing the wrong one is the usual reason a formula shows a plausible but wrong number.

## Percentages

A formula returning 0.25 is shown as 25%. Set the column's format to percent and let the
report do the conversion — do not multiply by 100 yourself as well, or you will get 2500%.

## Editing or removing one

Click **Column actions** on the formula column, then edit or remove it. Nothing outside this
report is affected.
`;

f["reports-and-dashboards/charts.md"] = `---
title: Charts on a report
sidebar_position: 9
---

# Charts on a report

**What it is.** A picture of the report, shown above the table.

**What it does.** It draws whatever the report has grouped, measured by whatever the report
totals.

**Why it helps.** A trend or an outlier is obvious in a chart and invisible in four hundred
rows.

## A report must be grouped first

A chart plots **groups**. If the report has none, there is nothing to draw and the chart
options do nothing.

Add a row group first — see [Grouping and totals](./group-and-summarise.md).

## Adding a chart

${BUILDER_NAV} → **Chart properties**

1. Click **Reports** in the top menu.
2. Click the folder, then the report's **name**, then **Edit**.
3. Click **Chart properties** at the top.

   ![Chart properties](../img/shots/report-builder/chart-properties.png)

4. Choose the **chart type**.
5. Choose what it **measures** — which total to plot.
6. Click **Apply**.
7. Click **Save**.

## Choosing a type

| Type | Best for | Avoid when |
|---|---|---|
| **Bar** / **Column** | Comparing groups | — |
| **Line** | A value changing over time | The groups are not in time order |
| **Pie** / **Donut** | Parts of one whole | There are more than about six slices |
| **Gauge** | Progress towards a target | There is no target |

A pie chart with twenty slices tells nobody anything. Use a bar chart.

## Sliced by

If a report has more than one grouping, you can choose which one the chart draws.

That means the same report answers two questions: by owner, or by month, without being
rebuilt.

## Charts on dashboards

A dashboard tile draws its own chart from the report's data, and does not have to match the
chart on the report. See [The dashboard builder](./dashboard-builder.md).
`;

f["reports-and-dashboards/export.md"] = `---
title: Exporting a report
sidebar_position: 10
---

# Exporting a report

**What it is.** Downloading a report as a spreadsheet file.

**What it does.** It writes the report to a file you can open in Excel or Google Sheets.

**Why it helps.** For sending to somebody without a portal login, or for working on the
numbers somewhere else.

## Exporting

**Where:** **Reports** → a folder → the report's name → **Export**

1. Click **Reports** in the top menu.
2. Click the folder, then the report's **name**. It runs.
3. Click **Export** at the top.
4. Choose which kind of export you want.

   ![Exporting](../img/shots/analytics/export.png)

5. Click **Export**.

The file downloads through your browser, like any other download.

## The two kinds

| Kind | What you get | Use it when |
|---|---|---|
| **Formatted Report** | What you see — groups, subtotals and headings kept. | It is the finished thing. |
| **Details Only** | Just rows and columns, no grouping. | It is a starting point for more work. |

**Details Only** is nearly always the right choice if the spreadsheet is going to be sorted,
filtered or pivoted. Group headings get in the way of all three.

## What gets exported

Whatever the report currently shows, including any filters you changed while reading it.

If you narrowed the report before exporting, the file is narrowed too. That is usually what
people want, but it surprises them if they have forgotten.

## A word about what leaves the portal

An exported file is an ordinary spreadsheet. Nothing in it is protected any more — no sharing
rules, no permissions. Anybody who gets the file sees everything in it.

Think about that before exporting anything with personal data, and prefer sharing the report
itself where you can — see [Sharing a report](./share-a-report.md).
`;

f["reports-and-dashboards/folders.md"] = `---
title: Folders
sidebar_position: 10.2
---

# Folders

**What it is.** Folders hold reports and dashboards, and decide who can see them.

**What it does.** A report lives in exactly one folder. Who can open the folder decides who
can open the report.

**Why it helps.** It is how one company's reports stay out of another's sight, without anybody
setting access report by report.

## The folders you always have

**Where:** **Reports** → the folder list on the left

| Folder | Who sees what is in it |
|---|---|
| **Recent** | Not a real folder — just what you opened lately. |
| **Favorites** | Reports you starred. |
| **Private Reports** | Only you. |
| Any folder you create | Whoever it is shared with. |

## Making a folder

**Where:** **Reports** → **New Folder**

1. Click **Reports** in the top menu.
2. Click **New Folder**.
3. Type a name.

   ![A new folder](../img/shots/analytics/new-folder.png)

4. Click **Save**.

A new folder starts out visible only to you.

## Letting other people see it

A Super Admin shares folders with companies, under
[Reports and Dashboards](../administration/reports-dashboards.md) in the Admin Console.

A folder shared with nobody is visible only to Super Admins — which is why a brand-new folder
looks empty to everybody else.

## Moving a report into a folder

**Where:** **Reports** → the report's name → **Edit Properties**

1. Click **Reports**, then open the report.
2. Click **Edit Properties**.

   ![Report properties](../img/shots/analytics/edit-properties.png)

3. Change the **Folder**.
4. Click **Save**.

Moving a report changes who can see it, because access follows the folder. Moving something
into **Private Reports** hides it from everybody else immediately.

## Naming folders

Name them for the audience or the subject — "Sales — Monthly", "Support". Avoid names like
"New folder 2", which tell nobody anything when there are twenty of them.
`;

f["reports-and-dashboards/share-a-report.md"] = `---
title: Sharing a report
sidebar_position: 10.5
---

# Sharing a report

**What it is.** Giving another company access to a report or dashboard you own.

**What it does.** It grants that company read, or read and edit, on that one item.

**Why it helps.** You do not have to rebuild the same report for each company, and you do not
have to ask an administrator every time.

## Sharing one

**Where:** **Reports** → a folder → the report's name → **Share**

1. Click **Reports** in the top menu.
2. Click the folder, then the report's **name**.
3. Click **Share**.
4. Choose the company.
5. Choose the access:

| Access | Lets them |
|---|---|
| **Read** | Open and run it. |
| **Edit** | Open it and change it for everybody it is shared with. |

6. Click **Save**.

Give **Read** unless somebody has specifically asked to change it.

## Who you can share with

Only companies you are allowed to reach. A Super Admin sets that ceiling under
[Reports and Dashboards](../administration/reports-dashboards.md).

So there are two levels: an administrator decides which companies are available to you, and
within that you decide who actually gets this report.

## Taking it back

1. Open the report.
2. Click **Share**.
3. Click **Revoke** beside the company.

They lose access immediately.

## Sharing one report does not share its folder

Somebody given a single report sees that report and nothing else beside it. They do not get
the folder it lives in.

If you want somebody to have a whole set, share the [folder](./folders.md) instead — and
anything added to it later is included automatically.
`;

f["reports-and-dashboards/dashboard-builder.md"] = `---
title: The dashboard builder
sidebar_position: 12
---

# The dashboard builder

**What it is.** The screen where you arrange a dashboard.

**What it does.** You add tiles, point each one at a report, and lay them out on a grid.

**Why it helps.** One screen answers the questions people ask every morning, instead of five
reports opened one at a time.

## Opening the builder

**Where:** **Dashboards** → a folder → the dashboard's name → **Edit**

For a new one: **Dashboards** → **New Dashboard**.

1. Click **Dashboards** in the top menu.
2. Click the folder, then the dashboard's **name**. It opens and the tiles load.
3. Click **Edit** at the top.

![The dashboard builder](../img/shots/dashboard-builder/overview.png)

If **Edit** is missing you have read-only access. Use **Save As** to take your own copy.

## Adding a tile

**Where:** the dashboard builder → **+ Widget**

1. Click **+ Widget** at the top.
2. Choose the **report** the tile reads from.

   ![Adding a widget](../img/shots/dashboard-builder/add-widget.png)

3. Choose how it should look — see the table below.
4. Set the title and any units or decimal places.
5. Click **Save**.

**Every tile reads from a report.** If a number on a tile looks wrong, open its report — that
is where the figure comes from, and the tile is only drawing it.

## The kinds of tile

| Tile | Shows | Good for |
|---|---|---|
| **Metric** | One big number | A single figure people watch daily. |
| **Bar** / **Column** | Groups side by side | Comparing. |
| **Line** | A value over time | Trends. |
| **Pie** / **Donut** | Parts of a whole | A handful of categories. |
| **Gauge** | Progress to a target | Targets. |
| **Table** | Rows straight from the report | Detail people need to read. |

## Moving and resizing tiles

- **To move:** drag the tile.
- **To resize:** drag its corner.

Tiles snap to the grid. How fine that grid is comes from **Properties** — see
[Dashboard settings](./dashboard-properties.md).

## Changing or removing a tile

Use **Edit** or **Remove** on the tile itself.

Removing a tile does not touch its report. The report stays exactly where it was.

## Undo and redo

**Undo** and **Redo** at the top step through your changes. Nothing is saved until you click
**Save**, so you can rearrange freely.

## Saving

| Button | What it does |
|---|---|
| **Save** | Keeps your changes to this dashboard. |
| **Save As** | Makes a copy under a new name, leaving the original alone. |

![Save As](../img/shots/dashboard-builder/save-as.png)

**Save As** is the safe way to change somebody else's dashboard.
`;

f["reports-and-dashboards/dashboard-filters.md"] = `---
title: Dashboard filters
sidebar_position: 13
---

# Dashboard filters

**What it is.** A control at the top of a dashboard that changes every tile at once.

**What it does.** You pick one value — an owner, a region, a month — and all the tiles narrow
to it together.

**Why it helps.** One dashboard serves everybody. Without filters you would need a separate
copy per team.

## Adding a filter

**Where:** **Dashboards** → the dashboard's name → **Edit** → **+ Filter**

1. Click **Dashboards** in the top menu.
2. Open the dashboard, then click **Edit**.
3. Click **+ Filter** at the top.

   ![Adding a filter](../img/shots/dashboard-builder/add-filter.png)

4. Choose the field to filter by.
5. Add the values people will be able to choose from.
6. Set up **Apply to Each Component** — see below.
7. Click **Save**.

## Apply to Each Component

This is the part that is easy to miss, and the reason a filter sometimes seems not to work.

Each tile reads from a **different report**, and those reports do not always name the same
thing the same way. One might call it **Owner**, another **Assigned To**.

**Apply to Each Component** is where you tell the dashboard which field on each report the
filter matches.

- Fields with the same name are matched for you.
- You only have to set the ones that differ.
- **A tile you leave unmapped ignores the filter** and keeps showing everything.

That last point is what makes a dashboard look broken: nine tiles narrow and one does not.
If that happens, this is where to look.

## Editing a filter

1. Open the dashboard in the builder.
2. Click **Edit filter** on the filter you want to change.

   ![Editing a filter](../img/shots/dashboard-builder/edit-filter.png)

3. Change it and click **Save**.

**Remove filter** deletes it. The tiles go back to showing everything.

## Using one

On the dashboard itself, choose a value from the filter bar at the top. Every mapped tile
updates together.

Click **Clear all** to return to the full picture.

Choosing a filter value changes only your own view, and only while you are on the page.
Nobody else is affected.
`;

f["reports-and-dashboards/dashboard-properties.md"] = `---
title: Dashboard settings
sidebar_position: 14
---

# Dashboard settings

**What it is.** The settings that apply to the whole dashboard rather than to one tile.

**What it does.** Name, layout, colours, and — most importantly — whose data the dashboard
counts.

**Why it matters.** That last one is the setting people most often get wrong, and it is not
obvious from looking at the dashboard that anything is amiss.

## Opening the settings

**Where:** **Dashboards** → the dashboard's name → **Edit** → **Properties**

1. Click **Dashboards** in the top menu.
2. Open the dashboard, then click **Edit**.
3. Click **Properties** at the top.

![Dashboard properties](../img/shots/dashboard-builder/properties.png)

## View Dashboard As

This decides **whose records** the dashboard counts.

| Setting | What people see |
|---|---|
| **The logged-in user** | Each person sees their own numbers. |
| **All data** | Everybody sees the same totals, across every record. |

Use **the logged-in user** for a dashboard each person uses for their own work — "my pipeline",
"my tasks".

Use **all data** for a company-wide view that should look the same to everybody.

**Getting this wrong is quiet.** A rep set to "all data" sees the whole company's figures and
has no reason to doubt them. A manager set to "the logged-in user" sees only their own and
assumes the team is idle. Neither shows an error.

## Grid size

How many columns the dashboard is divided into.

More columns means finer control over tile sizes, but also more fiddling. Start with the
default and increase it only if tiles will not sit where you want.

## Themes

| Setting | Changes |
|---|---|
| **Dashboard Theme** | The page — **Light** or **Dark**. |
| **Widget Theme** | The tiles. |

They are separate so you can put light tiles on a dark page, which is a common look for a
dashboard shown on a wall screen.

## Name and description

The name is what people see in the dashboards list. A short description helps whoever finds it
in six months work out whether it is the one they want.
`;

f["files/files.md"] = `---
title: Files
sidebar_position: 1
---

# Files

**What it is.** Documents stored in the portal.

**What it does.** You upload a file once, and anybody allowed to see it can open it.

**Why it helps.** Contracts and signed paperwork sit with the customer they belong to, instead
of in somebody's inbox.

## Opening the files area

**Where:** **Files** in the top menu

1. Click **Files** in the row of tabs across the top.

![Files](../img/shots/files/list.png)

## The three views

Choose along the top:

| View | Shows |
|---|---|
| **Recent** | What you opened lately. |
| **Owned by Me** | Files you uploaded. |
| **All Files** | Everything you are allowed to see. |

![All files](../img/shots/files/all-files.png)

**Owned by Me** is the quickest way back to something you added yourself.

![Owned by me](../img/shots/files/owned-by-me.png)

## Uploading a file

**Where:** **Files** → **Upload Files**

1. Click **Files** in the top menu.
2. Click **Upload Files**.
3. Choose a file from your computer.

   ![Uploading](../img/shots/files/upload.png)

4. Wait for it to finish. Large files take a moment.

## Attaching a file to a record

This is usually better, because the file then sits with the customer it concerns.

**Where:** **Accounts** → the record's name → the **Files** section

1. Open the record.
2. Find the **Files** section.
3. Upload there.

Anybody who can see the record can see the file. Anybody who cannot, cannot — file access
follows the record.

## Opening and downloading

- Click a file's **name** to preview it.
- Use the menu beside it to **download** or **delete** it.

## Deleting

Deleting removes the file for everybody, not just you. If it is attached to a record, it
disappears from that record too.

Check whether anybody else is using it first — there is no undo.
`;

f["administration/setup-assistant.md"] = `---
title: Setup Assistant
sidebar_position: 22
---

# Setup Assistant

**What it is.** A checklist that tells you whether the portal is correctly set up.

**What it does.** It checks the things the portal needs on the Salesforce side and reports
each one as done or needing attention.

**Why it helps.** When something does not work **at all** — nobody can sign in, no records
appear anywhere — this says which step was missed instead of leaving you to guess.

## Where it lives

The Setup Assistant is on the **Salesforce** side, not in the portal. Whoever installed the
package opens it there.

Most portal administrators never need it. It matters at installation, and when something
stops working in a way that affects everybody at once.

## What it checks

| Check | Why it matters |
|---|---|
| Permissions on the portal's own user | Without them the portal cannot read anything, for anybody. |
| Field access | New fields are invisible to the portal until access is granted. |
| The site is active | An inactive site serves nothing at all. |
| Email deliverability | Welcome and password-reset emails are dropped silently without it. |

## Reading it

**Completed** means that step is done.

**Needs attention** means it is not, and the item says what to do about it.

## When to run it

- Straight after installing, before adding any users.
- **After adding new fields** — field access is not granted automatically, and this is the
  single most common cause of "the field is there in Salesforce but not in the portal".
- When something stops working for everybody at once, to rule setup out before looking
  anywhere else.

## The difference between this and permissions

[Permissions](./permissions.md) control what one **person** may do.

The Setup Assistant checks what the **portal itself** is allowed to do. If the portal's own
access is wrong, nobody's permissions matter — the portal cannot read the data to show them.

That is why it is worth checking first when the problem affects everybody.
`;

f["administration/login-design.md"] = `---
title: The sign-in page
sidebar_position: 21
---

# The sign-in page

**What it is.** An editor for the page people see before they sign in.

**What it does.** You build the page out of blocks — headings, text, images, logos, links —
and arrange them across the two halves of the screen.

**Why it helps.** The sign-in page is the first thing anybody sees, and the only page people
who are not signed in ever see. This lets you make it look like your company without anybody
writing code.

## Opening the designer

**Where:** **Admin** → **Branding** → **Login Design**

1. Click **Admin** in the top menu.
2. Click **Branding** in the row of tabs.
3. Click **Login Design**.

![Login design](../img/shots/admin/branding-login-design.png)

For simple changes — heading, tagline, bullet points, footer — use **Login Page** instead,
which is the panel above it. See [Branding](./branding.md).

## Draft, preview, publish

Nothing you do takes effect for anybody until you publish. There are three states, and keeping
them straight is the whole point.

| Action | What happens |
|---|---|
| **Save draft** | Kept for you. Nobody else sees it. |
| **Live preview** | Shows the result as you work. |
| **Publish** | Everybody sees it from now on. |

Work in a draft, check the preview on both desktop and phone, then publish.

**Restore** puts back an earlier version. Use it the moment a published change turns out to be
wrong — it is faster than undoing by hand.

## Building with blocks

Click anything in the preview to edit it. Each block has its own settings: alignment, width,
height, tone, and whether it is clickable.

| Block | What it is for |
|---|---|
| **Heading** | The big line. |
| **Text** | A sentence or two. |
| **Eyebrow** | A small label above a heading, with an optional dot. |
| **Logo** | Your uploaded logo, or an image you add. |
| **Link** | A clickable line, such as your website. |
| **Separator** | A dividing line. |
| **Spacer** | Breathing room between blocks. |

Blocks sit in regions: the **brand** panel on the left, and above or below the sign-in form on
the right.

## Desktop and phone

Switch between **Desktop** and **Phone** in the preview.

A layout that looks balanced on a wide screen can be cramped on a phone, and plenty of people
sign in on one. Check both before publishing.

## Standard or custom

| Mode | What people get |
|---|---|
| **Standard** | The built-in design with your name, logo and colours. |
| **Custom** | The blocks you have built. |

Switching to **Standard** does not delete your custom design. You can switch back and it is
still there.

## If you want help with the design

The editor can produce a prompt to paste into an AI tool, and accept the answer back as a
design. **Copy AI prompt**, paste the reply into **Paste AI answer**, and check the preview
before publishing.

Treat whatever comes back as a draft, not a finished page.

## The sign-in boxes cannot be moved

The username box, the password box and the **Log In** button are fixed. Nothing you add here
can move them, hide them, or imitate them.

That is deliberate. It means no design change — by anybody, deliberate or not — can turn the
sign-in page into something that collects passwords and sends them elsewhere.
`;

f["administration/licence.md"] = `---
title: Licence limits
sidebar_position: 23
---

# Licence limits

**What it is.** The console that sets how many companies and users an installation may have.

**Where it lives.** In Salesforce, not in the portal. Most portal administrators never see it;
it is for whoever administers the package.

**Why it exists.** It keeps an installation within whatever was agreed, without anybody having
to count users by hand.

## What it limits

| Limit | Meaning |
|---|---|
| **Companies in use** | How many companies may exist. |
| **Admins** | How many Admin users each company may have. |
| **Standard** | How many Standard users each company may have. |

**Default limits** apply to every company. **Per-company overrides** raise or lower them for
one company in particular.

## Signing in to the console

The console has its own password, separate from the portal.

- **Set a new password** changes it.
- **Reset password** is for when it has been lost.

## What happens when a limit is reached

Creating a user beyond the limit is **refused**, with a message saying which limit was hit.

Nothing already created is affected. Existing users keep working exactly as before — the limit
stops new ones, it does not switch anybody off.

## When this is the explanation

If somebody reports that they cannot add a user, and the [permissions](./permissions.md) look
correct, this is the next thing to check.

The symptom is specific: everything else in [Users](./users.md) works, but **Save** on a new
user is refused.

## Raising a limit

Either set a per-company override, if the overall licence allows it, or arrange a larger
licence. The console shows what is currently in use against what is allowed, which is the
number to quote when asking.
`;

let n = 0;
for (const [rel, body] of Object.entries(f)) {
  const dest = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body, "utf8");
  n++;
}
console.log(`Rewrote ${n} pages.`);
