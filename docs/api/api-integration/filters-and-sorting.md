---
title: Filters and sorting
sidebar_position: 3
---

# Filters and sorting

Two things a caller can control — **if** the administrator allowed it. Both are off by
default.

## The rule that governs both

> The administrator's settings always apply. A caller can only ever **narrow** the result,
> never widen it.

A caller's filter is combined with the administrator's, not swapped for it. A caller's sort
changes only the order rows arrive in, never which rows those are.

## Filters

Send a `filters` parameter holding a JSON array:

```
&filters=[{"field":"Type","operator":"eq","value":"Customer"}]
```

More than one entry means all of them must match:

```json
[
  { "field": "Type", "operator": "eq", "value": "Customer" },
  { "field": "Name", "operator": "contains", "value": "Acme" }
]
```

### The operators

| Operator | Means |
|---|---|
| `eq` | equals |
| `ne` | not equal to |
| `contains` | contains |
| `ncontains` | does not contain |
| `starts` | starts with |
| `lt` | is before |
| `le` | is on or before |
| `gt` | is after |
| `ge` | is on or after |

### When it is not allowed

If the administrator did not tick **Allow the caller to add their own filters**, a `filters`
parameter is **ignored, not refused**. You get a normal `200` with the administrator's rows.

That is worth knowing, because it looks like your filter did nothing — which is exactly what
happened. Ask your administrator whether the box is ticked.

### A malformed filter is ignored too

If the JSON cannot be read, it is dropped and the administrator's filter still applies. It
never fails open: a broken caller filter cannot accidentally remove the filter protecting
the data.

## Filter logic

This is the **administrator's** setting, not something a caller sends. In the admin screen,
under Filters, the **Filter logic** box takes an expression where the numbers are the filter
rows in order:

```
1 AND 2
1 OR 2
(1 OR 2) AND 3
```

Blank means all filters must match.

A caller's filters are added after the administrator's and the logic is extended to include
them, so `1 AND 2` becomes `(1 AND 2) AND 3` once a caller adds one. Both still apply.

## Sorting

```
&sortField=Name&sortDir=desc
```

`sortDir` is `asc` or `desc`. Anything else is refused with a `400`.

### Two limits worth knowing

**You can only sort by a field you were given.** Sorting by a field that is not in the key's
Selected list is refused:

```json
{ "error": "You cannot sort by Industry - it is not one of the fields available to this key." }
```

This is deliberate. Ordering by a field you cannot see would let you work out its values
from the sequence the records arrive in — a slower way of reading it, not a safer one.

**Address and long text fields cannot be sorted on at all.** Not by a caller, and not by an
administrator either — they are left out of the admin's Sort by picker for the same reason:

```json
{ "error": "Records cannot be sorted by BillingAddress. Address and long text fields are not sortable - choose another field." }
```

This is a Salesforce limitation rather than a portal one. Choose another field.

### When it is not allowed

Like filters, if **Allow the caller to choose their own sort** is not ticked, `sortField`
and `sortDir` are ignored and you get the administrator's saved order.

## Combining everything

Filters, sorting and paging all work together in one request:

```
?object=Account
&limit=25
&filters=[{"field":"Type","operator":"eq","value":"Customer"}]
&sortField=Name
&sortDir=desc
```

And they are carried forward automatically as you page — see [Paging](./paging.md).
