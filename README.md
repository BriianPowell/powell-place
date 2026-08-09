# Portfolio — Win98 Desktop

[![powell.place status](https://img.shields.io/website?url=https%3A%2F%2Fpowell.place&label=powell.place&logo=cloudflare&logoColor=white)](https://powell.place)

A Next.js portfolio with a **Win98-style** desktop: draggable browser window, Start menu profile panel, and taskbar.

## Quick start

```bash
cd powell-place
npm install
cp .env.example .env.local   # optional: contact form
npm run dev
```

Open [http://localhost:3000/about](http://localhost:3000/about) (`/` redirects there).

## Desktop UI

- **Browser:** Drag the title bar to move; drag the status-bar grip to resize. Toolbar: Back, Forward, Home, address bar.
- **Title bar:** **Minimize** hides the window to the taskbar; click **Brian Powell** on the taskbar to restore. **Maximize** expands the browser window inside the desktop.
- **Taskbar:** **Start** opens the profile panel (contacts + social links). **Brian Powell** focuses or restores the browser window.
- **Wallpaper:** The desktop randomly preloads one image from `public/wallpapers/` on each visit.
- **Assets:** `public/icons/joystick_*.png` (animated favicon), `public/icons/w95.png` (Start), `public/icons/html.png` (title bar + status page icon), `public/icons/earth.png` (app button + Internet zone), `public/icons/connect_*.png` (tray), `public/icons/focus-*.png` (About page focus cards), `public/fonts/w-95-sans-serif.woff2` ([Windows 95 UI Kit](https://github.com/themesberg/windows-95-ui-kit), MIT).

## Contact form

Copy `.env.example` to `.env.local` and set the Resend mail settings plus Cloudflare Turnstile:

```bash
RESEND_API_KEY=...
RESEND_FROM_EMAIL="Portfolio <contact@example.com>"
CONTACT_TO_EMAIL=you@example.com
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
```

`RESEND_FROM_EMAIL` must use a sender/domain that Resend is allowed to send from. In production, verify your own domain in Resend and use an address on that domain. For sandbox testing, use Resend's permitted test sender and recipient rules.

Without those values, the form shows an error on submit.

`NEXT_PUBLIC_TURNSTILE_SITE_KEY` is intentionally public and can live in
`wrangler.jsonc` `vars`. Keep `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY`
server-only in local `.env.local` or Cloudflare secrets.

The contact form saves an in-progress draft in the visitor's browser for up to
7 days and stores a 24-hour "message sent" flag after a successful submission.
If browser storage is unavailable, the form still works without draft recovery.

## Blog posts

Write posts as Markdown files in `src/content/blog`. The file name becomes the URL slug:

```text
src/content/blog/my-post.md -> /blog/my-post
```

Each post starts with frontmatter:

```md
---
title: My Post
description: Short summary for the blog list and SEO.
date: 2026-07-20
tags: cloud, ci/cd
---

## Post heading

Write the post in Markdown.
```

The app generates `src/content/blog/manifest.ts` from those Markdown files before
`dev`, `build`, `preview`, and `deploy`. Run `npm run generate:blog` manually if
you add or edit posts while a dev server is already running.

## SEO and previews

The app defines page-specific metadata, `robots.txt`, `sitemap.xml`, and JSON-LD
structured data. Social previews use a generated Open Graph image at
`/opengraph-image`.

## Reusing the theme

Import `src/theme/desktop.css` for design tokens (`--chrome-face`, `--font-win95`, etc.) in other self-hosted apps.

## Structure

| Path                      | Purpose                                                       |
| ------------------------- | ------------------------------------------------------------- |
| `src/data/site.ts`        | Site copy, resume data, links, service icons, tab routes      |
| `src/data/wallpapers.ts`  | Desktop wallpaper manifest                                    |
| `src/theme/desktop.css`   | Design tokens (Win95 chrome, spacing)                         |
| `src/lib/`                | Routing, SEO, address, contact map, clock, icons              |
| `src/components/browser/` | Browser window, toolbar, tabs, status bar, custom scroll area |
| `src/components/desktop/` | Taskbar, profile panel, desktop state, wallpaper loader       |
| `src/components/sidebar/` | Profile content (Start menu)                                  |
| `src/components/content/` | About, Resume, Blog, Contact pages and page-specific styles   |
| `src/content/blog/`       | Markdown blog posts and generated manifest                    |
| `src/app/(site)/`         | `/about`, `/resume`, `/blog`, `/contact`                      |
| `src/app/api/contact/`    | Contact form POST handler                                     |

## Lint and format

```bash
npm run lint              # ESLint — check
npm run lint:fix          # ESLint with auto-fix
npm run typecheck         # TypeScript — check
npm run test              # Node test runner
npm run format            # Prettier — write
npm run format:check      # Prettier — check only
npm run check             # manifest + typecheck + tests + lint + format:check
```

After `npm install`, **Husky** runs a **pre-commit** hook via **lint-staged**: staged `*.{js,ts,tsx}` files get `eslint --fix` and Prettier; staged `*.{css,json,md}` get Prettier only.

ESLint rules match [collective/.eslintrc.js](https://github.com/BriianPowell/collective/blob/master/.eslintrc.js) (import order, `prefer-template`, `no-console`, etc.), plus `next/core-web-vitals`. Prettier uses `.prettierrc.js` and `.editorconfig`.

## Deploy

This app deploys to Cloudflare Workers through the OpenNext Cloudflare adapter. The older `@cloudflare/next-on-pages` adapter is deprecated for modern Next.js apps.

```bash
npm run preview          # build and preview the preview env locally
npm run deploy           # build and deploy the production env
npm run deploy:preview   # build and deploy the preview env
```

Set these variables in Cloudflare Workers build/runtime settings. Use placeholders
from `.env.example` locally; do not commit real secret values.

```bash
RESEND_API_KEY=...
RESEND_FROM_EMAIL="Portfolio <contact@mail.powell.place>"
CONTACT_TO_EMAIL=you@example.com
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
```

In production, store secret values (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`) as
Cloudflare secrets. Non-secret public values such as
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` may be configured as Wrangler vars.

`wrangler.jsonc` enables `nodejs_compat`, serves OpenNext assets from
`.open-next/assets`, and keeps Workers Logs enabled with full sampling for this
low-traffic site.

Production deploys to the `powell.place` custom domain with `workers_dev`
disabled. The preview environment keeps `workers_dev` enabled for preview-only
deployments.

Cloudflare WAF rate limiting protects `POST /api/contact` at the edge. The
current zone entitlement supports a 10-second sampling period and mitigation
timeout, so the deployed edge rule blocks bursts above 3 requests per 10 seconds;
the app-level limiter remains as a longer-window backup.
