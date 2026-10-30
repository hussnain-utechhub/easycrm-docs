---
title: Staying signed in
sidebar_position: 1.5
---

# Staying signed in

**What it is.** How long the portal keeps you signed in, the warning it gives before it signs
you out, and how to carry on without losing what is on your screen.

**Why it matters.** A session that never ended would be a risk on a shared or lost computer. A
session that ended without warning would cost you whatever you were typing. The portal does
neither: it warns you five minutes before the end, lets you add more time, and if the time does
run out it lets you sign in again on top of the page you were on.

## How long a session lasts

| | |
|---|---|
| A new session | 2 hours from the moment you sign in |
| Each **Stay signed in** | 2 more hours, counted from when you click it |
| The most a session can run | 12 hours after you signed in |

The two hours count from when you signed in, not from your last click. Working steadily does not
keep you signed in — choosing **Stay signed in** does.

After 12 hours you have to sign in again, however often you chose **Stay signed in**. Near the
end of a long day it may give you less than 2 hours, because it never goes past that limit.

## The countdown in the top bar

**Where:** In the portal → the top bar, to the left of the gear (last 5 minutes only)

In the last five minutes of your session a small clock appears in the top bar, reading
**Session ends in** and the minutes and seconds left — **Session ends in 4:59**, for example.
It turns red in the final minute.

<!-- SHOT: session/countdown-chip.png | Any portal page, top bar, about 3 minutes left in the session: the "Session ends in 2:59" chip beside the gear (a second capture with the chip red in the last minute is welcome) -->

Hovering over it says **Time left in this session - click for options**. Click it to open the
warning described below.

Outside the last five minutes there is nothing to see. That is normal.

## The warning

When five minutes are left, a box opens over whatever you are doing. The page behind it is not
touched.

<!-- SHOT: session/expiry-warning.png | Any record page with the session at about 4:30 left: the "Your session is about to expire" box with the countdown and the Log out / Stay signed in buttons -->

It says **Your session is about to expire**, then **For your security you'll be signed out in**
with a countdown in minutes and seconds, then:

> Anything you haven't saved will be lost. Choose **Stay signed in** to keep working - you'll get another 2 hours.

### Keeping going

**Where:** the warning → **Stay signed in**

1. Click **Stay signed in**. It reads **Extending...** for a moment.
2. The box closes, and a green notice gives the new end time — **You're signed in until 3:45 PM.**,
   for example.
3. Carry on. Nothing on the page changed.

Your other portal tabs in the same browser pick up the new end time by themselves.

### Other choices in the box

| Control | What it does |
|---|---|
| **Log out** | Signs you out, the same as **Log Out** in your name menu. If a report or dashboard has unsaved changes, it asks **You have unsaved changes that will be lost. Leave anyway?** first. |
| **×**, or the Esc key | Closes the box and leaves the countdown running. It comes back once more when one minute is left. You can also reopen it from the clock in the top bar. |

### At the 12-hour limit

Once the session cannot run any longer, the warning says:

> This session has reached its 12-hour limit and can't be extended. Save your work now - you'll need to sign in again.

**Stay signed in** is no longer offered. Save what you are doing; when the time runs out you can
sign in again over the page, as described next.

<!-- SHOT: session/twelve-hour-limit.png | The expiry warning for a session that started almost 12 hours ago: the 12-hour limit message shown and only the Log out button -->

### If the portal cannot be reached

If your connection drops as you click **Stay signed in**, the box says **Couldn't reach the
server. Check your connection and try again.** and the button changes to **Try again**. Your
session has not been extended yet — click **Try again** once you are back online.

## When the session ends

If the time runs out, a box opens over the page. **What you were looking at, and anything you had
typed, is still there underneath.**

<!-- SHOT: session/sign-in-again.png | A record page in inline edit with one field changed, session expired: the "Your session has expired" box with the username shown, the Password box and "Sign in and continue" -->

It says **Your session has expired**, then **Sign in again to carry on. Your work on this page is
still here.** Your username is shown and cannot be changed.

### Signing in again without losing your work

**Where:** the **Your session has expired** box

1. Type your password in **Password**.
2. Press Enter, or click **Sign in and continue**. It reads **Signing in...** for a moment.
3. The box closes and you are exactly where you were, with what you had typed. Now save it.

This is an ordinary sign-in: the same checks and the same lockout apply as on the sign-in page.

| Message | What it means |
|---|---|
| **Enter your password.** | The box was empty. |
| **Invalid username or password.** | The password is wrong. Check Caps Lock. |
| **Account temporarily locked until 3:45 PM.** | Five wrong passwords in a row. See [Signing in](./sign-in.md). |
| **Couldn't reach the server. Check your connection and try again.** | Your connection dropped. Try again when it is back. |

**Go to the login page**, at the bottom left of the box, leaves the page instead. Anything you had
not saved is lost.

The Esc key does not close this box — there is no way to keep working on the page without
signing in again.

### "You've been signed out"

The same box sometimes says **You've been signed out** instead. That means the session was ended
somewhere else rather than running out:

- you clicked **Log Out** in another tab of the portal in this browser, or
- the session had already been ended when you chose **Stay signed in** — usually because you
  signed in on another computer or browser, which ends this one. See
  [Signing in](./sign-in.md).

Signing in again in the box works the same way.

## Several tabs at once

Tabs of the portal in the same browser share one session:

- **Stay signed in** in one tab extends them all.
- **Log Out** in one tab signs out the others; they show **You've been signed out**.
- Signing in again in one tab is picked up by the others, as long as it is the same person.

## When an administrator uses Log in as

An administrator using [Log in as](../../admin/users/login-as.md) has a session of its own for
the account they entered, with the same two hours and the same countdown, worded differently:

| Normal session | Log in as session |
|---|---|
| **Session ends in** | **Log in as ends in** |
| **Your session is about to expire** | **The Log in as session is about to end** |
| **For your security you'll be signed out in** | **Your session as** *username* **ends in** |
| **Log out** · **Stay signed in** | **Return to my account** · **Stay in this session** |

**Stay in this session** adds two hours to the Log in as session only — never past 12 hours after
the administrator's own sign-in. The person whose account it is keeps their own session
untouched.

When it ends, the box says **The Log in as session has ended** and **Your session as** *username*
**has ended. Return to your own account, or go to the login page.** There is no password box:
choose **Return to my account** or **Go to the login page**.

<!-- SHOT: session/log-in-as-warning.png | An admin in a Log in as session with under 5 minutes left: the "You are logged in as" banner above the top bar, the "Log in as ends in" chip, and "The Log in as session is about to end" box with Return to my account / Stay in this session -->

## What goes wrong

| Symptom | Cause |
|---|---|
| Signed out after two hours although you were busy | The session counts from sign-in, not from your last click. Choose **Stay signed in** when the warning appears. |
| **Stay signed in** is missing | The session has reached its 12-hour limit. Save, and sign in again when it ends. |
| The extension gave you less than 2 hours | It never goes past 12 hours after you signed in. |
| **You've been signed out** | You signed out in another tab, or signed in somewhere else. |
| A screen says **Your session has expired. Please log in again.** | The session has already ended on the server — for example because you signed in on another computer. Sign in again. |
| Your work was lost after the session ended | **Go to the login page** was chosen, or the page was reloaded. Signing in again in the box keeps the page. |

## Where this fits

Signing in itself, the lockout and forgotten passwords are on [Signing in](./sign-in.md).
