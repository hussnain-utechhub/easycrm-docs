---
title: Lookup fields
sidebar_position: 7
---

# Lookup fields

What a field that points at another record returns, and how to change it.

A **lookup** is any field holding a reference to another record — an Account's owner, a
Contact's account, a record type. There are two useful things it could give you: the name a
person reads, or the id a program matches on. Your administrator chooses which.

## The four modes

Set on the key, per key, under **Lookup fields** on the API Integration tab. For a lookup
field called `RecordTypeId`:

| Mode | What you get back |
|---|---|
| **Name + id + object** *(default)* | `RecordTypeId` (the name), `RecordTypeId_id`, `RecordTypeId_obj` |
| **Name only** | `RecordTypeId` (the name), nothing else |
| **Id only** | `RecordTypeId` (the 18-character id) |
| **Id + name** | `RecordTypeId` (the id) and `RecordTypeId_name` (the name) |

## The default, in full

```json
{
  "Id": "001Bi00000UMyF1IAL",
  "Name": "Acme Corporation",
  "RecordTypeId": "Enterprise",
  "RecordTypeId_id": "012Bi0000016H8rIAE",
  "RecordTypeId_obj": "RecordType"
}
```

Three keys from one selected field: the display value, the record it points at, and that
record's object.

:::note Why the default looks surprising
A field called `RecordTypeId` returning `"Enterprise"` reads like a bug to anyone who did not
write it — the name says *id*. It is deliberate: for a human reading a response, the name is
almost always the useful part, and the id is still there beside it.
:::

## Choosing a mode

| If you are | Choose |
|---|---|
| putting values on a screen or in a report | **Name only** — the id is noise |
| matching records against another system | **Id only** or **Id + name** |
| not sure, or you have an integration already running | leave it alone |

## Changing it on a key that is already in use

:::caution This changes every response that key produces
Switching mode changes which keys appear in the JSON, for every object and every field, from
the next call onward. An integration reading `RecordTypeId` as a name will suddenly receive
an id — or the key it was reading will stop appearing at all.

Treat it as a breaking change to anything already consuming that key. If an integration is
live, add a second key in the new mode and move over, rather than switching underneath it.
:::

A key created before this setting existed behaves as **Name + id + object**, which is what
this API has always returned — nobody's integration moved when the option arrived.

## It does not affect writing

The mode controls what comes back in a response. When you **set** a lookup field with
`POST` or `PATCH`, always send the **Id**:

```json
{ "AccountId": "001Bi00000UMyF1IAL" }
```

A name is not looked up for you. Send one and the save is refused with a `400`, because the
value is not a record reference.
