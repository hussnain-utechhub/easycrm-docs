# EasyCRM Documentation

End-to-end documentation for the EasyCRM portal, written for people who do not work in
Salesforce and do not want to.

Live: https://hussnain-utechhub.github.io/easycrm-docs/

## Layout

| Path | What it holds |
|---|---|
| `docs/` | The pages. Markdown, one folder per section. |
| `static/img/shots/` | Screenshots, committed and optimised. |
| `shots/` | The capture harness that produces them. |
| `src/css/custom.css` | Theme tweaks. Deliberately plain. |

## Writing rules

These are rules, not aspirations. A page that breaks them gets rewritten.

1. One idea per sentence. Aim for twelve words.
2. Say "you". Never "the user".
3. Name buttons exactly as the screen does: **Log In**, not "the login button".
4. No jargon. Never assume the reader knows Salesforce, or cares that it is underneath.
5. Under 400 words per page. Longer means it is two pages.
6. A picture after every step, not a wall of text followed by a wall of images.
7. Open with the goal, then the steps.

## Screenshots

    cd shots && cp .env.example .env    # fill in the portal URL and logins
    npm run shots                       # capture
    npm run shots:optimise              # compress into static/img/shots/

The harness logs in once per role and reuses the session. It neutralises tenant branding in
the browser at capture time, so the images show EasyCRM rather than whichever customer the
source org happens to be configured as. It never writes to the org.

## Building

    npm ci
    npm start      # dev server, no search index
    npm run build  # production build, with search

Search only works in a production build. `npm start` never builds an index, so never diagnose
search on the dev server.
