// Docusaurus 3.x
//
// CommonJS on purpose. Do not add "type": "module" to package.json and do not switch this
// file to `export default`. With type:module the production build compiles and then dies in
// server-side rendering with "require.resolveWeak is not a function", because the server
// bundle is CommonJS and Node reads it as ESM. The .mjs files under shots/ are unaffected:
// they are ESM by their own extension.
//
// Plain theme on purpose. The sister site (easycrm-api-docs) carries a client's visual
// identity; this one documents the product itself, so it stays unbranded and stock.

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "EasyCRM Documentation",
  tagline: "How to use your portal",
  favicon: "img/favicon.svg",

  // url is the ORIGIN; baseUrl is the path under it.
  //
  // Until a custom domain is attached this is a GitHub Pages PROJECT site, served from
  // /<repo>/ - so baseUrl must be "/easycrm-docs/" or every asset resolves one directory
  // too high and the site 404s. On a custom domain the site is served at the root, so it
  // becomes "/". Both are repo VARIABLES and the workflow passes them, so moving to a
  // customer domain is a settings change rather than a commit.
  url: process.env.DOCS_SITE_URL || "https://hussnain-utechhub.github.io",
  baseUrl: process.env.DOCS_BASE_URL || "/easycrm-docs/",
  organizationName: "hussnain-utechhub",
  projectName: "easycrm-docs",

  // Fail the build on a broken internal link. Worth it: dead links are how documentation
  // quietly stops being trustworthy, and a reader cannot work around one.
  onBrokenLinks: "throw",

  /*
   * No "faster: true" here, and no @docusaurus/faster dependency.
   *
   * Faster builds with rspack, whose native binary is a PLATFORM-SPECIFIC optional
   * dependency. A package-lock.json generated on Windows pins only the win32 binding, so
   * "npm ci" on Linux installs exactly that and the build dies with
   * "Cannot find module '@rspack/binding-linux-x64-gnu'". It builds locally and can never
   * build in CI - see npm/cli#4828.
   *
   * For a site this size the speed was worth nothing anyway.
   */
  future: { v4: { removeLegacyPostBuildHeadAttribute: true } },

  markdown: {
    // Parse .md as CommonMark, .mdx as MDX. The default runs everything through MDX, which
    // reads an angle bracket in prose as a JSX tag and fails the build. We use no JSX here,
    // so this costs nothing and removes a whole class of build failure.
    format: "detect",
    hooks: { onBrokenMarkdownLinks: "warn" },
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/", // the docs ARE the site; there is no separate landing page
          sidebarPath: "./sidebars.js",
          editUrl: "https://github.com/hussnain-utechhub/easycrm-docs/edit/main/",
          showLastUpdateTime: true,
        },
        blog: false,
        theme: { customCss: "./src/css/custom.css" },
        sitemap: { changefreq: "weekly", priority: 0.5 },
      }),
    ],
  ],

  plugins: [
    /*
     * The site was flat before the two-track split, and those URLs are already shared and
     * bookmarked. Every moved page redirects from its old address, generated from the same
     * map the restructure used - see scripts/redirects.json.
     */
    [
      "@docusaurus/plugin-client-redirects",
      { redirects: require("./scripts/redirects.json") },
    ],
  ],

  themes: [
    [
      // Search is built at build time and ships with the site, so it needs no third-party
      // crawler and keeps working whatever the hosting.
      //
      // NOTE: if siteConfig.noIndex is ever turned on, this plugin silently indexes NOTHING
      // (it skips any page carrying a robots noindex tag) and every search returns no
      // results. The escape hatch is forceIgnoreNoIndex: true. We do not set noIndex here.
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: "/",
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  themeConfig: {
    image: "img/social-card.png",
    navbar: {
      title: "EasyCRM",
      logo: { alt: "EasyCRM", src: "img/logo.svg" },
      items: [
        { type: "docSidebar", sidebarId: "features", position: "left", label: "Features" },
        { type: "docSidebar", sidebarId: "use", position: "left", label: "Using EasyCRM" },
        { type: "docSidebar", sidebarId: "admin", position: "left", label: "Administering" },
        { type: "docSidebar", sidebarId: "frontspin", position: "left", label: "FrontSpin" },
        { type: "docSidebar", sidebarId: "standardBuild", position: "left", label: "Standard Build" },
        {
          href: "https://github.com/hussnain-utechhub/easycrm-docs",
          position: "right",
          className: "navbar-github",
          "aria-label": "GitHub repository",
        },
      ],
    },
    footer: {
      style: "light",
      copyright: `EasyCRM Documentation · last built ${new Date().getFullYear()}`,
    },
    colorMode: { respectPrefersColorScheme: true },
    docs: { sidebar: { hideable: true } },
  },
};

module.exports = config;
