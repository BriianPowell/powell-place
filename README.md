# Portfolio — Win95 Desktop

A Next.js portfolio with a **Win95-style** desktop: draggable browser window, Start menu profile panel, and taskbar. Content mirrors [powell.place](https://powell.place).

## Quick start

```bash
cd portfolio
npm install
cp .env.example .env.local   # optional: contact form
npm run dev
```

Open [http://localhost:3000/about](http://localhost:3000/about) (`/` redirects there).

## Desktop UI

- **Browser:** Drag the title bar to move; drag the status-bar grip to resize (default 960×640). Toolbar: Back, Forward, Home, address bar.
- **Title bar:** **Minimize** hides the window to the taskbar; click **Brian Powell** on the taskbar to restore. **Maximize** toggles native browser fullscreen (press **Esc** to exit).
- **Taskbar:** **Start** opens the profile panel (contacts + social links). **Brian Powell** focuses or restores the browser window.
- **Assets:** `public/icons/w95.ico` (tab + Start), `public/icons/html.ico` (title bar + status page icon), `public/icons/earth.ico` (app button + Internet zone), `public/icons/internet.ico` (taskbar tray), `public/fonts/w-95-sans-serif.woff2` ([Windows 95 UI Kit](https://github.com/themesberg/windows-95-ui-kit), MIT).

## Contact form

Copy `.env.example` to `.env.local` and set `WEB3FORMS_ACCESS_KEY` ([Web3Forms](https://web3forms.com)). Without it, the form shows an error on submit.

## Reusing the theme

Import `src/theme/desktop.css` for design tokens (`--chrome-face`, `--font-win95`, etc.) in other self-hosted apps.

## Structure

| Path | Purpose |
|------|---------|
| `src/data/site.ts` | Copy, resume, links, tab routes |
| `src/theme/desktop.css` | Design tokens (Win95 chrome, spacing) |
| `src/lib/` | `routing`, `address`, `fullscreen`, `contactMap`, `formatClock`, `icons` |
| `src/components/browser/` | Browser window + toolbar |
| `src/components/desktop/` | Taskbar, profile panel, desktop state, map provider |
| `src/components/sidebar/` | Profile content (Start menu) |
| `src/components/content/` | About, Resume, Contact pages |
| `src/app/(site)/` | `/about`, `/resume`, `/contact` |
| `src/app/api/contact/` | Contact form POST handler |

## Lint and format

```bash
npm run lint              # ESLint via Next.js
npm run lint:fix          # Next.js ESLint with auto-fix
npm run lint:eslint       # ESLint directly (all .js/.ts/.tsx)
npm run lint:eslint:fix   # ESLint direct with auto-fix
npm run format            # Prettier — write
npm run format:check      # Prettier — check only
npm run check             # lint + format:check (CI-friendly)
```

After `npm install`, **Husky** runs a **pre-commit** hook via **lint-staged**: staged `*.{js,ts,tsx}` files get `eslint --fix` and Prettier; staged `*.{css,json,md}` get Prettier only.

ESLint rules match [collective/.eslintrc.js](https://github.com/BriianPowell/collective/blob/master/.eslintrc.js) (import order, `prefer-template`, `no-console`, etc.), plus `next/core-web-vitals`. Prettier uses `.prettierrc.js` and `.editorconfig`.

## Deploy

```bash
npm run build
npm start
```
