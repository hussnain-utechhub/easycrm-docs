/*
 * Capture-time branding neutraliser.
 *
 * The source org is configured as one particular customer's tenant: its portal name, logo and
 * published sign-in layout all carry that customer's identity. These are PRODUCT docs, so the
 * screenshots have to show EasyCRM instead.
 *
 * This runs in the browser just before each screenshot and changes nothing server-side. The
 * org is never written to. Re-running the capture against a differently-branded org needs only
 * a change to TENANT_STRINGS below.
 *
 * It also freezes everything that would otherwise differ between two runs of the same shot -
 * clock-dependent greetings, today's date, last-login stamps - so re-capturing a single page
 * does not show up as 170 changed files in the diff.
 */

// A square mark for the shell, where the logo sits in a ~32px chip.
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#2a6fb5"/><path d="M9 10.5h9M9 16h7M9 21.5h9" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="22.5" cy="16" r="2.2" fill="#9ed0ff"/></svg>`;

// A wordmark for the sign-in page, where the logo block is ~210px wide.
const WORDMARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 64"><rect x="0" y="16" width="32" height="32" rx="7" fill="#2a6fb5"/><path d="M9 26.5h9M9 32h7M9 37.5h9" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="22.5" cy="32" r="2.2" fill="#9ed0ff"/><text x="44" y="41" font-family="Segoe UI, system-ui, Arial, sans-serif" font-size="25" font-weight="650" fill="#17212b">EasyCRM</text></svg>`;

const dataUri = (svg) => "data:image/svg+xml;utf8," + encodeURIComponent(svg);

/*
 * Tenant copy, longest first.
 *
 * Order matters: "Outbound Operators CRM" has to be replaced before "Outbound Operators", or
 * the shorter rule fires first and leaves a stranded "CRM" behind.
 */
const TENANT_STRINGS = [
  ["OUTBOUND OPERATORS CRM", "EASYCRM"],
  ["Outbound Operators CRM", "EasyCRM"],
  ["OUTBOUND OPERATORS", "EASYCRM"],
  ["Outbound Operators", "EasyCRM"],

  // Full hosts before the bare domain, or the bare rule fires first and leaves the tenant's
  // own subdomain in front of the replacement ("lists.easycrm.example.com").
  ["lists.outboundoperators.com", "import.easycrm.example.com"],
  ["scoring.outboundoperators.com", "reports.easycrm.example.com"],
  ["outboundoperators.com", "easycrm.example.com"],

  ["OUTBOUND", "EASYCRM"],
  ["Outbound", "EasyCRM"],

  // The tenant's own pipeline stages, shown as a chip row on the published sign-in layout.
  // Replaced with the portal's actual tabs.
  ["Activations", "Dashboards"],
  ["Completions", "Tasks"],
  ["Connects", "Contacts"],
  ["Dials", "Accounts"],

  // Tenant marketing copy on the published sign-in layout. Replaced with neutral product
  // copy so the sign-in page reads as EasyCRM rather than as one customer's landing page.
  ["Your next conversation is waiting.", "Welcome to your portal."],
  ["Market truth, one conversation at a time.", "Everything in one secure place."],
  [
    "Every dial, connect, and follow-up, tracked in one place.",
    "Your records, reports and files, always up to date.",
  ],
  ["Drop in a file here for easy uploads directly to Salesforce.", "Import records from a spreadsheet in a few clicks."],
  ["Score contacts, analyse your results and top up any time.", "Build reports and dashboards from your own data."],
  ["Locked out? Message your shared channel.", "Locked out? Contact your administrator."],
  ["Upload a list", "Import data"],
  ["Credits and scoring", "Reports and dashboards"],
];

/*
 * Volatile content, pinned so repeat runs are byte-stable.
 *
 * Each entry is [pattern, replacement]. These are applied as regular expressions after the
 * literal tenant strings above.
 */
const FROZEN = [
  // "Good afternoon, admin" / "Good evening, ..." -> one fixed greeting
  [/\bGood (morning|afternoon|evening)\b/g, "Good morning"],
  // "Tuesday, 6 October 2026" -> fixed
  [
    /\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), \d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}\b/g,
    "Monday, 1 June 2026",
  ],
  // "Oct 06, 01:45 PM" -> fixed
  [
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{2}, \d{2}:\d{2} (AM|PM)\b/g,
    "Jun 01, 09:30 AM",
  ],
];

/**
 * The function body below is serialised and run inside the page, so it may not close over
 * anything from this module - everything it needs arrives as the single argument.
 */
function applyInPage({ strings, frozen, markUri, wordmarkUri, title }) {
  const frozenRx = frozen.map(([src, flags, rep]) => [new RegExp(src, flags), rep]);

  /* Collect every root in the document, including open shadow roots, which is where all of
     the portal's own markup lives. A closed root would be invisible here - LWC does not use
     one, and if that ever changes this walk is where it will show up. */
  function roots() {
    const found = [document];
    const walk = (root) => {
      let els;
      try {
        els = root.querySelectorAll("*");
      } catch {
        return;
      }
      for (const el of els) {
        if (el.shadowRoot) {
          found.push(el.shadowRoot);
          walk(el.shadowRoot);
        }
      }
    };
    walk(document);
    return found;
  }

  const allRoots = roots();

  /* ---- text ---- */
  for (const root of allRoots) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    for (const node of nodes) {
      let t = node.nodeValue;
      if (!t || !t.trim()) continue;
      const before = t;
      for (const [from, to] of strings) {
        if (t.includes(from)) t = t.split(from).join(to);
      }
      for (const [rx, rep] of frozenRx) t = t.replace(rx, rep);
      if (t !== before) node.nodeValue = t;
    }
  }

  /* ---- attributes that surface as visible text ---- */
  for (const root of allRoots) {
    let els;
    try {
      els = root.querySelectorAll("[title],[alt],[placeholder],[aria-label]");
    } catch {
      continue;
    }
    for (const el of els) {
      for (const attr of ["title", "alt", "placeholder", "aria-label"]) {
        const v = el.getAttribute(attr);
        if (!v) continue;
        let t = v;
        for (const [from, to] of strings) if (t.includes(from)) t = t.split(from).join(to);
        if (t !== v) el.setAttribute(attr, t);
      }
    }
  }

  /* ---- logos ---- */
  // The shell renders the uploaded logo in a small chip; the sign-in page renders it large.
  // Different art for each, so neither is a stretched version of the other.
  const swap = (selector, uri) => {
    for (const root of allRoots) {
      let els;
      try {
        els = root.querySelectorAll(selector);
      } catch {
        continue;
      }
      for (const el of els) {
        el.setAttribute("src", uri);
        el.removeAttribute("srcset");
      }
    }
  };
  swap("img.logo-img", markUri);
  swap("img.lf-head-logo, img.lf-brand-logo, .lf-blocks img, .lf-brand-inner img", wordmarkUri);

  /*
   * A portal with no uploaded logo renders the tenant's INITIALS in the chip instead, so the
   * image swap above finds nothing and the tenant's initials survive into the screenshot.
   * Only a childless .logo is touched, so the chip's text is replaced without disturbing the
   * portal name that sits beside it in .brand.
   */
  for (const root of allRoots) {
    let els;
    try {
      els = root.querySelectorAll(".logo");
    } catch {
      continue;
    }
    for (const el of els) {
      if (el.children.length) continue;
      const t = (el.textContent || "").trim();
      if (t && t.length <= 3 && t === t.toUpperCase()) el.textContent = "EC";
    }
  }

  /* ---- tab title and favicon ---- */
  try {
    document.title = title;
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = markUri;
  } catch {
    /* ignore */
  }
}

/**
 * Neutralise tenant branding on the page currently loaded in `page`.
 * Call immediately before taking a screenshot.
 *
 * `extra` is applied BEFORE the standard map, for screens carrying identities this module
 * knows nothing about - the FrontSpin screens show a tenant's whole client roster in a list
 * picker, so that capture supplies its own token map. The caller orders `extra` longest-first,
 * for the same reason TENANT_STRINGS is ordered that way.
 */
export async function rebrand(page, extra = []) {
  await page.evaluate(applyInPage, {
    strings: [...extra, ...TENANT_STRINGS],
    // RegExp does not survive the structured clone into the page, so send the parts.
    frozen: FROZEN.map(([rx, rep]) => [rx.source, rx.flags, rep]),
    markUri: dataUri(MARK),
    wordmarkUri: dataUri(WORDMARK),
    title: "EasyCRM",
  });
}

export const BRAND_NAME = "EasyCRM";
