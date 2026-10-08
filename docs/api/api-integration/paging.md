---
title: Paging
sidebar_position: 4
---

# Paging

You do not get everything at once. The maximum is **200 records** per request, so anything
larger arrives a page at a time.

## Follow the links

Every response carries two complete addresses:

```json
{
  "count": 200,
  "hasMore": true,
  "nextUrl": "https://.../api/v1/query?object=Account&limit=200&cursor=eyJ2...",
  "prevUrl": ""
}
```

**Open `nextUrl` to go forward. Open `prevUrl` to go back.** That is the whole mechanism.

Both carry your original parameters — object, limit, filters, sort — already included, so
you never rebuild the request.

## How to actually do it

1. Find the `nextUrl` line in the response and copy the whole address between the quotation
   marks.
2. Paste it into the address bar, or into Postman's address box, replacing what is there.
3. Keep your two headers exactly as they are — they are still required.
4. Send.

Repeat until `nextUrl` comes back as an empty string. That means you have reached the end.

`prevUrl` works identically in the other direction. **On the first page it is always empty**,
which is how you know you are at the start.

## Do not build the cursor yourself

`nextCursor` and `prevCursor` are also returned, and you can pass either as a `cursor`
parameter. But they are deliberately opaque — an encoded marker whose contents are not part
of the contract and may change.

Following `nextUrl` and `prevUrl` is the supported way. Assembling the address by hand means
getting the encoding right yourself, and a damaged cursor quietly falls back to the first
page, so you would see the same records repeatedly with nothing explaining why.

## Why not just ask for everything?

Because a request has to finish inside Salesforce's limits, and because a page is a natural
place to stop if something goes wrong halfway through a large export.

If you are pulling a lot of data, take more pages. Asking for a larger page does not help:
anything above 200 is not honoured.

## A note on records changing mid-export

Paging walks the records in order from a fixed point, rather than counting "skip the first
N". That makes deep paging fast and consistent — but it also means a record created while
you are part-way through an export may or may not appear, depending on where it lands in
the order.

For a nightly export that is normally fine. If it matters, filter on a date range that has
already closed.
