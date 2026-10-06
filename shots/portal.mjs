/*
 * Driving the portal from Playwright.
 *
 * Two things here are not obvious and cost an afternoon each if you rediscover them:
 *
 *  1. LWC rewrites template id="" attributes to generated unique ids at runtime, so #lf-user
 *     and friends never match in the live DOM. Everything is selected by placeholder, role or
 *     visible text instead - which is also what the documentation calls these controls, so the
 *     selectors stay readable.
 *
 *  2. The portal is a Lightning Out app inside a Visualforce page. Nothing exists until the
 *     framework boots, which takes seconds on a cold load, and `networkidle` never settles
 *     because the framework keeps a connection warm. Wait on real elements, never on the
 *     network.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { rebrand } from "./rebrand.mjs";

export const VIEWPORT = { width: 1440, height: 900 };
export const SCALE = 2;

const BOOT_TIMEOUT = 90_000;

export function config() {
  const portal = process.env.PORTAL_URL;
  if (!portal) throw new Error("PORTAL_URL is not set. Copy shots/.env.example to shots/.env.");
  return {
    portal: portal.replace(/\/+$/, ""),
    users: {
      superadmin: { user: process.env.SUPERADMIN_USER, pass: process.env.SUPERADMIN_PASS },
      admin: { user: process.env.ADMIN_USER, pass: process.env.ADMIN_PASS },
      standard: { user: process.env.STANDARD_USER, pass: process.env.STANDARD_PASS },
    },
  };
}

export async function launch() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: SCALE,
    // Pin these so a machine in another timezone or locale produces identical captures.
    locale: "en-GB",
    timezoneId: "UTC",
    reducedMotion: "reduce",
  });
  ctx.setDefaultTimeout(45_000);
  return { browser, ctx };
}

/** The sign-in form, before anyone has signed in. */
export async function openLogin(page, cfg) {
  await page.goto(cfg.portal, { waitUntil: "domcontentloaded", timeout: BOOT_TIMEOUT });
  await page
    .getByPlaceholder("Enter your username")
    .waitFor({ state: "visible", timeout: BOOT_TIMEOUT });
  await page.waitForTimeout(1200); // fonts and the brand panel
}

export async function signIn(page, cfg, role = "superadmin") {
  const who = cfg.users[role];
  if (!who?.user || !who?.pass) throw new Error(`No credentials configured for role "${role}".`);

  await openLogin(page, cfg);
  await page.getByPlaceholder("Enter your username").fill(who.user);
  await page.getByPlaceholder("Enter your password").fill(who.pass);
  await page.getByRole("button", { name: "Log In" }).click();

  // The form is removed from the DOM once the shell takes over. Waiting on that, rather than
  // on a shell element, means a failed sign-in surfaces here instead of 40 shots later.
  await page
    .getByPlaceholder("Enter your username")
    .waitFor({ state: "detached", timeout: 60_000 });
  await settle(page, 2500);
}

/**
 * Navigate by hash route - how the shell addresses its own tabs.
 *
 * The reload is not optional. page.goto() to a URL that differs only in its hash does NOT
 * reload: the SPA just switches tab, and anything left open - a filter panel, the view
 * settings popover, a half-finished modal - stays open. The next shot then captures the
 * previous shot's leftovers, and worse, an overlay silently swallows the click that was
 * meant to open the screen being documented. That failure looks like a bad selector and
 * costs an afternoon.
 *
 * A reload re-boots Lightning Out, which is the slow part, but determinism is the entire
 * value of a scripted capture. Roughly four seconds a shot, and worth every one.
 */
export async function gotoTab(page, cfg, key) {
  const url = `${cfg.portal}#tab=${encodeURIComponent(key)}`;
  const sameHash = page.url() === url;

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: BOOT_TIMEOUT });
  if (sameHash || page.url() === url) {
    await page.reload({ waitUntil: "domcontentloaded", timeout: BOOT_TIMEOUT });
  }

  // The shell is up once the account button is painted.
  await page.locator("button.userbtn").waitFor({ state: "visible", timeout: BOOT_TIMEOUT });
  await settle(page, 2500);
}

/** Wait for the page to stop moving. Spinner-aware, with a floor so nothing is caught mid-paint. */
export async function settle(page, floor = 1200) {
  try {
    await page
      .locator(".slds-spinner, .spinner, lightning-spinner")
      .first()
      .waitFor({ state: "hidden", timeout: 20_000 });
  } catch {
    /* no spinner on this screen, or it never appeared */
  }
  await page.waitForTimeout(floor);
}

/** Click something by its visible label, the way the documentation names it. */
export async function click(page, label, opts = {}) {
  const el = page.getByRole(opts.role || "button", { name: label, exact: opts.exact ?? false });
  await el.first().click();
  await settle(page, opts.settle ?? 1500);
}

export async function clickText(page, label, settleMs = 1500) {
  await page.getByText(label, { exact: false }).first().click();
  await settle(page, settleMs);
}

/**
 * Playwright's fullPage does nothing here.
 *
 * The shell is `position: fixed; inset: 0; overflow: hidden` - it IS the viewport at every
 * scroll position - and the scrolling happens inside `.content { overflow-y: auto }`. The
 * document itself never grows, so fullPage returns the same pixels as a normal capture.
 *
 * Growing the VIEWPORT is what works: the fixed shell grows with it and `.content` stops
 * needing to scroll. Measure what the content wants, resize to fit, capture, restore.
 */
async function withTallViewport(page, fn) {
  const original = page.viewportSize() || VIEWPORT;
  let needed = original.height;

  try {
    needed = await page.evaluate(() => {
      // The tallest internal scroller on screen decides how tall the window has to be.
      const roots = [document];
      const walk = (r) => {
        for (const el of r.querySelectorAll("*")) {
          if (el.shadowRoot) {
            roots.push(el.shadowRoot);
            walk(el.shadowRoot);
          }
        }
      };
      walk(document);

      let extra = 0;
      for (const root of roots) {
        for (const el of root.querySelectorAll("*")) {
          const over = el.scrollHeight - el.clientHeight;
          if (over > extra && el.clientHeight > 150) extra = over;
        }
      }
      return window.innerHeight + extra;
    });
  } catch {
    /* fall back to the viewport we already have */
  }

  const height = Math.min(Math.max(needed + 40, original.height), 6000);
  if (height > original.height) {
    await page.setViewportSize({ width: original.width, height });
    await page.waitForTimeout(900); // re-layout, lazy rows, virtualised lists
  }
  try {
    return await fn();
  } finally {
    if (height > original.height) {
      await page.setViewportSize(original);
      await page.waitForTimeout(400);
    }
  }
}

/**
 * Capture one shot.
 *
 * Branding is neutralised immediately before the shutter, never earlier: any navigation or
 * re-render since would have restored the tenant's own copy from the server.
 */
export async function shoot(page, outDir, id, opts = {}) {
  const file = path.join(outDir, `${id}.png`);
  fs.mkdirSync(path.dirname(file), { recursive: true });

  const take = async () => {
    await rebrand(page);
    if (opts.selector) {
      await page.locator(opts.selector).first().screenshot({ path: file });
    } else {
      await page.screenshot({ path: file });
    }
  };

  if (opts.tall) await withTallViewport(page, take);
  else await take();

  return file;
}
