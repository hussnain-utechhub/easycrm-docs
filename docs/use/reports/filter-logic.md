---
title: Filter logic
sidebar_position: 9
---

# Filter logic

## What it is

A rule that says how your filters combine. By default every filter must match. Filter logic
lets you say "either of these" or "this but not that".

## When you need it

The moment a question contains **or**, or **except**.

"Open opportunities in the North **or** the West." "Every account **except** the ones we
already contacted." Neither is expressible with filters alone, because filters are joined with
*and*.

**When not to:** if all your conditions must be true, leave it alone. Writing
`1 AND 2 AND 3` is exactly what happens without it, and a rule you did not need is a rule
somebody has to understand later.

## Writing a rule

**Where:** **Reports** → a folder → the report's name → **Edit** → **Filters** → **Filter Logic**

1. Open the report in the builder.
2. Click the **Filters** tab.
3. Add the filters you need first. Each one takes a number in the order you add it.
4. Click **Filter Logic**.
5. Type a rule using those numbers.
6. Click **Apply**.

## The operators

| Operator | Means | Example |
|---|---|---|
| **AND** | Both must be true | `1 AND 2` |
| **OR** | Either will do | `1 OR 2` |
| **NOT** | Must not be true | `1 AND NOT 2` |
| **( )** | Do this part first | `1 AND (2 OR 3)` |

Brackets work exactly as they do in arithmetic, and they matter just as much:

| Rule | Means |
|---|---|
| `1 AND 2 OR 3` | Ambiguous. Avoid writing this. |
| `(1 AND 2) OR 3` | Both 1 and 2 — or else 3 on its own. |
| `1 AND (2 OR 3)` | 1 always, plus either 2 or 3. |

**Bracket anything with an OR in it.** It costs nothing and removes the ambiguity.

## A worked example

You want open opportunities, in the North or the West, that are not already marked lost.

| # | Filter |
|---|---|
| 1 | Stage equals Open |
| 2 | Region equals North |
| 3 | Region equals West |
| 4 | Status equals Lost |

Rule: `1 AND (2 OR 3) AND NOT 4`

## A shortcut worth knowing

For several values of the **same field**, you usually do not need logic at all. One filter
with multiple values — Region equals North, West — behaves as an OR between them.

Reach for filter logic when the OR spans **different fields**.

## What goes wrong

| Symptom | Cause |
|---|---|
| "Filter logic is invalid" | A number with no matching filter, usually after deleting one. Renumber the rule. |
| Far more records than expected | An unbracketed OR. `1 AND 2 OR 3` often means "or everything in 3". |
| Far fewer than expected | ANDs that cannot all be true at once — Region equals North AND Region equals West. |
| The rule stops working | A filter was removed and the numbers shifted. Logic does not renumber itself. |

**Delete a filter, re-read the rule.** That is the single most common way a working report
quietly starts returning the wrong set.

## Where this fits

Filter logic refines what [Filters](./filters.md) include. The same AND/OR/NOT grammar is used
when [filtering a list](../records/filtering.md), so learning it once covers both.
