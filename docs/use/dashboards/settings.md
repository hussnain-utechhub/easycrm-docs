---
title: Dashboard settings
sidebar_position: 5
---

# Dashboard settings

**What it is.** The settings that apply to the whole dashboard rather than to one tile.

**What it does.** Name, layout, colours, and — most importantly — whose data the dashboard
counts.

**Why it matters.** That last one is the setting people most often get wrong, and it is not
obvious from looking at the dashboard that anything is amiss.

## Opening the settings

**Where:** In the portal → **Dashboards** → the dashboard's name → **Edit** → **Properties**

1. Click **Dashboards** in the top menu.
2. Open the dashboard, then click **Edit**.
3. Click the gear (**Properties**) at the top.

![Dashboard properties](../../img/shots/dashboard-builder/properties.png)

The **Properties** dialog holds four settings: **Dashboard Name**, **Dashboard Grid Size**,
**Dashboard Theme** and **View Dashboard As**.

Each change takes effect the moment you click it. **Done** and **Cancel** both just close the
dialog, so **Cancel** does not take anything back. Use **Undo** in the toolbar for that. Nothing
is stored until you **Save** the dashboard.

Three things you might expect here live elsewhere:

| Setting | Where it is |
|---|---|
| Folder, **Visibility**, **Company access** | the **Save Dashboard** dialog, when you first save and on **Save As**. See [Saving](./builder.md#saving). |
| Description, the **Shared** box | the Dashboards list → the dashboard's row menu (▾) → **Edit Properties**. See [Name and description](#name-and-description). |
| A tile's own theme | **Widget Theme**, in that tile's **Add Widget** / **Edit Widget** dialog |

## View Dashboard As

This decides **whose records** the dashboard counts.

| Setting | What people see |
|---|---|
| **All data** | Everybody sees the same data. |
| **The logged-in user** | Each person sees only the records they are allowed to see — their own numbers. |

The dialog explains it: *“The logged-in user” runs the dashboard as whoever is viewing it, so each
person sees only the records they have access to (a dynamic dashboard). “All data” shows everyone
the same data.*

Use **The logged-in user** for a dashboard each person uses for their own work — "my pipeline",
"my tasks".

Use **All data** for a company-wide view that should look the same to everybody.

**Admins and Super Admins always see all the data.** **The logged-in user** only narrows the
figures for Standard users. An Admin opening a "logged-in user" dashboard sees everybody's records.

**Getting this wrong is quiet.** A rep on **All data** sees the whole company's figures and has no
reason to doubt them. A Standard user on **The logged-in user** sees only their own, which may
look like a quiet week. And because you, as an admin, see everything either way, checking the
dashboard yourself tells you nothing. Ask a Standard user what they see. None of these situations
shows an error.

## Grid size

How many columns the dashboard is divided into: **12 Columns** (the default) or **9 Columns**.

Tiles snap to the columns. Twelve gives finer control over widths. Nine gives bigger steps, which
can be quicker to line up.

## Themes

| Setting | Where | Changes |
|---|---|---|
| **Dashboard Theme** | **Properties** | The whole dashboard — **Light** or **Dark**. On **Dark**, every tile is dark too. |
| **Widget Theme** | each tile's **Add Widget** / **Edit Widget** dialog | That one tile — **Light** or **Dark**. |

**Widget Theme** lets you pick out single tiles: a dark tile or two on a light dashboard draws the
eye to the figures that matter most. It cannot do the reverse. On a **Dark** dashboard every tile
is dark, whatever its own **Widget Theme** says.

## Name and description

The name is what people see in the dashboards list. Set it in **Properties** → **Dashboard Name**,
or in the box at the top left of the builder. The builder will not save a name that matches
another dashboard you can see. Case does not count.

The description is not in the builder. Set it from the list:

1. Click **Dashboards**, then ▾ at the end of the dashboard's row.
2. Click **Edit Properties**.
3. Fill in **Description**, and click **Save**.

A short description helps whoever finds it in six months work out whether it is the one they
want. It shows in the list's **Description** column, and the list's search looks in it.

## What goes wrong

| Symptom | Cause |
|---|---|
| A Standard user sees smaller numbers than I do | **View Dashboard As** is **The logged-in user**, and you are an admin, so you see everything. |
| Everybody sees the whole company's figures | **View Dashboard As** is **All data**. |
| I set a tile to **Light** and it is still dark | The dashboard's theme is **Dark**, which darkens every tile. |
| **Cancel** did not undo my change | **Cancel** only closes the dialog. Use **Undo**. |
| There is no folder or visibility setting in **Properties** | Those are asked when you save. See [Saving](./builder.md#saving). |

## Where this fits

| | |
|---|---|
| [The dashboard builder](./builder.md) | everything else in the builder |
| [Sharing a report](../reports/sharing.md) | who can open the dashboard at all, as against what it counts |
