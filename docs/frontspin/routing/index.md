---
title: The three modes
sidebar_position: 0
---

# Running several tenants

## What this section is for

One Salesforce org can talk to several FrontSpin accounts. This section is about doing that
safely — and in particular about **not** switching on enforcement until the configuration is
ready for it.

If you have one FrontSpin account, you can skip the whole section. The default mode is exactly
right for you.

## The three modes

The org runs in one of three modes. The mode decides how strictly per-Record-Type routing is
applied.

| Mode | Routing rules are | Traffic uses | Unmapped records are |
|---|---|---|---|
| **LEGACY** | Ignored for traffic | The original single tenant | Sent as before |
| **CONFIGURATION** | Loaded and checked | The original single tenant | Sent as before |
| **STRICT** | Enforced | The tenant the rule names | **Refused**, not guessed |

**LEGACY is the default**, and it is the fail-safe. The org only reaches STRICT by somebody
deliberately setting it.

## Why CONFIGURATION exists

It is the rehearsal. In CONFIGURATION mode you can load every routing rule, run the
[health check](../setup/checking-it.md), and see exactly what STRICT **would** do — while traffic
carries on going where it always went and nothing is refused.

Going straight from LEGACY to STRICT without that rehearsal is how an org discovers at nine on a
Monday that fourteen Record Types have no rule.

## How the mode is set

**Setup** → **Custom Metadata Types** → **FrontSpin Setting** → **Manage Records**

There should be exactly **one active row**, with **Routing Mode** set to `LEGACY`,
`CONFIGURATION` or `STRICT`.

## Everything ambiguous means LEGACY

This is worth knowing in full, because it means a configuration mistake can never accidentally
switch enforcement on:

| Situation | Resulting mode |
|---|---|
| No setting row at all | LEGACY |
| The row is inactive | LEGACY |
| **Two or more** active rows | LEGACY |
| Routing Mode is blank | LEGACY |
| Routing Mode is a word nobody recognises | LEGACY |

So if you set STRICT and nothing changes, the first thing to check is whether a **second** active
row exists. Two active rows is not an error — it is silently LEGACY.

## Moving off LEGACY {#moving-off-legacy}

1. Create the [instances and routing rules](./instances.md) you need.
2. Set the mode to **CONFIGURATION**.
3. Run the [health check](../setup/checking-it.md). Fix every **ERROR**.
4. Work through the **WARNING** lines. Each one is a Record Type that STRICT would refuse.
5. When the check is clean, set the mode to **STRICT**.
6. Watch [sync errors](../troubleshooting/sync-errors.md) closely for a day.

**You can go back.** Setting the mode to LEGACY restores the previous behaviour immediately, with
no deploy. If STRICT causes trouble you cannot diagnose quickly, switch back and investigate
calmly.

## What goes wrong

| Symptom | Cause |
|---|---|
| STRICT was set, nothing changed | Two active setting rows, or a typo in the mode. |
| Records suddenly refused after a change | STRICT is on and a Record Type has no rule. |
| The health check is clean but traffic still goes to one tenant | Mode is CONFIGURATION, not STRICT. That is CONFIGURATION working correctly. |

## Where this fits

[Instances and routing rules](./instances.md) are what STRICT enforces.
[The eight outcomes](./outcomes.md) are what it reports.
