---
title: Long text filters on large reports
sidebar_position: 2
---

# Long text filters on large reports

## What it is

A Super Admin switch that lets a report filter on a **long text field** — a description, a comments
field, notes — even when the report covers a very large number of records.

## Why it exists

Salesforce's database cannot filter a long text field, so the portal checks those filters itself,
record by record. It can check at most **40,000** records at once — the records that match the
report's other filters.

Past that, the portal used to refuse the report. With this switch on, it keeps a private,
prepared copy of the part of each record's text that Salesforce's own reports compare, and reads
that instead:

| Field | The part compared |
|---|---|
| A custom long text field | The first 255 characters |
| A standard long text field | The first 1,000 characters |
| A rich text field | The first 254 characters |

Records saved since a copy was prepared are always read live, so results stay exact and current.

It makes no difference to a report with 40,000 matching records or fewer: those are checked
directly, exactly as before.

## Where it is

**Where:** In the portal → **Admin** → **Users** → **Long text filters on large reports**

The card sits with the other Super Admin settings below the user list, between **Report speed**
and **FrontSpin sync buttons**. Only a Super Admin sees it.

<!-- SHOT: admin/long-text-filters.png | Super Admin; Admin → Users, scrolled to the "Long text filters on large reports" card with the switch ticked and two prepared copies listed, e.g. "Contact · Description — 52,310 records checked, 1,204 with text · prepared …" -->

## The switch

**Use prepared copies for long text filters on large reports** — ticked by default.

| Setting | What happens to a report filtering a long text field over more than 40,000 matching records |
|---|---|
| **Ticked** | It runs. The first time, it may take a few seconds longer while the copy is prepared behind the loading spinner. |
| **Unticked** | It is refused, exactly as before the copies existed. |

Changing it shows **Long text filters on large reports now run from the prepared notebooks.** or
**Long text notebooks are off. Large reports with a long text filter are refused as before.**

The same switch exists in Salesforce as the **Long Text Notebooks Off** checkbox on the Portal
Branding record — ticked there means **off** here. See
[Settings only Salesforce can change](../salesforce/switches.md).

## The prepared copies

Under the switch is one line per prepared copy:

> ***Object* · *Field*** — ***N* records checked, *M* with text · prepared *date and time***

Copies are prepared in the background as they are needed, and kept current: records saved since
are read live.

### Deleting them

Click **Delete prepared copies** to delete every copy at once. The message **Every long text
notebook was deleted.** confirms it. The button is greyed out when there are none.

Nothing is lost: with the switch still ticked, a copy is prepared again the next time a report
needs one. Use it if you want to free the space, or to start the copies afresh.

## What people see

With the switch **ticked**, nothing — a large report with a long text filter simply opens, a few
seconds slower the first time.

On the rare screen that cannot wait for a copy to be prepared, the report may show:

> This report filters on "*Field*" across more records than one request can read, so the portal is
> getting a quick way to check them ready. Run the report again in a few seconds.

followed by a reference in brackets, such as `(ref: ltx/Contact/Description)`. Running it again a
few seconds later works.

With the switch **unticked**, the report is refused with:

> This report filters on "*Field*", and it is a long text field, which Salesforce's database cannot
> search, so the portal checks each record itself. More than 40,000 records match the report's
> other filters, which is more than it can check at once. Add a filter that narrows the report (a
> date range, record type or owner, for example) and run it again.

## How it is audited

In the [Audit Log](./audit-log.md):

| Action | Details |
|---|---|
| **Change Permission** | `Long text notebooks switched on` or `Long text notebooks switched off` |
| **Delete** | `All long text notebooks deleted` |

## What goes wrong

| Symptom | Cause |
|---|---|
| The card is not on the Users tab | You are not a Super Admin. |
| A report with a long text filter is refused | The switch is off — here, or **Long Text Notebooks Off** is ticked in Salesforce. Or narrow the report below 40,000 records. |
| A large report is slow the first time only | The copy was being prepared. Later runs are fast. |
| **Delete prepared copies** is greyed out | There are no copies to delete. |

## Where this fits

This changes only how the portal answers a long text filter on a large report. Which records
anybody sees is still decided by [Sharing](../sharing/index.md).
