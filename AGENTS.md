# powell-place

A Next.js portfolio site with a Win98-inspired desktop UI: draggable browser
shell, taskbar, profile panel, blog, and contact form. It deploys to Cloudflare
Workers through OpenNext Cloudflare.

## Verify before you finish

Run these and fix failures before reporting a task done. Report which ones you
ran.

- `npm run check` - CI command; runs blog manifest check, TypeScript, Vitest,
  ESLint, and Prettier check.
- `npm run build` - run when changing Next.js routing, app/runtime behavior,
  metadata, deployment config, or anything that needs production build
  verification.

For focused work, targeted commands are useful during development, but
`npm run check` is the final baseline.

## Commands

- `npm run dev` - generate the blog manifest, then start Next.js dev server.
- `npm run generate:blog` - regenerate `src/content/blog/manifest.ts` from
  Markdown posts.
- `npm run generate:blog:check` - fail if the generated blog manifest is stale.
- `npm run test` / `npm run test:watch` - run Vitest once or in watch mode.
- `npm run typecheck` - run `tsc --noEmit`.
- `npm run lint` / `npm run lint:fix` - run ESLint check or autofix.
- `npm run format` / `npm run format:check` - run Prettier write or check.
- `npm run preview` - build with OpenNext Cloudflare and preview the preview
  environment.
- `npm run deploy` / `npm run deploy:preview` - build and deploy production or
  preview Workers environments.
- `npm run cf-typegen` - generate Cloudflare environment types with Wrangler.

## Layout

- `src/app/(site)/` - visible site routes for About, Resume, Blog, and Contact.
- `src/app/api/contact/` - contact form POST endpoint.
- `src/components/browser/` - browser chrome, toolbar, tabs, status bar, and
  custom scroll viewport.
- `src/components/desktop/` - desktop shell, taskbar, profile panel, wallpaper
  loading, and desktop state.
- `src/components/content/` - page-level content components and page-specific
  styles.
- `src/components/sidebar/` - profile/Start menu content.
- `src/content/blog/` - Markdown posts plus generated `manifest.ts`.
- `src/data/` - shared site content and wallpaper metadata.
- `src/lib/` - routing, SEO, address/contact helpers, icons, blog utilities,
  and contact providers.
- `src/theme/` - shared Win98/desktop CSS tokens and controls.
- `public/icons/` and `public/wallpapers/` - static desktop/browser assets.
- `scripts/generate-blog-manifest.mjs` - Markdown-to-manifest generator used by
  dev/build/check.

## Conventions

- Keep edits scoped; avoid broad refactors unless explicitly requested.
- Prefer existing structure: shared data in `src/data`, helpers in `src/lib`,
  route UI in `src/components`, theme tokens in `src/theme`.
- Preserve accessibility on interactive UI: buttons should remain buttons, and
  decorative images should stay `alt=""`/`aria-hidden` when appropriate.
- Preserve the Win98 visual language: gray chrome, beveled controls,
  pixel-aligned icons, compact spacing, and CSS variables from
  `src/theme/desktop.css`.
- Add icon paths through `src/lib/icons.ts` and wallpaper assets through
  `src/data/wallpapers.ts`; avoid scattering literal asset paths.
- Treat `src/content/blog/manifest.ts` as generated. Edit Markdown posts, then
  run `npm run generate:blog` or `npm run generate:blog:check`.
- Blog post filenames are lowercase kebab-case slugs and frontmatter must
  include `title`, `description`, `date`, and `tags`.
- Keep contact validation centralized in `src/lib/contact/schema.ts` and
  provider configuration in `src/lib/contact/config.ts`.
- Preserve server-side Turnstile verification before sending email, and keep
  Resend integration boundaries in `src/lib/contact/resend.ts`.
- Return user-safe contact API errors; do not expose secrets, raw provider
  failures, or production-sensitive details.
- Do not edit generated/build output such as `.next/`, `.open-next/`,
  `cloudflare-env.d.ts`, `tsconfig.tsbuildinfo`, or `graphify-out/` unless a
  task specifically requires regenerating it.
- Never read, print, or commit secrets (`.env*`, keys, tokens, `secrets/`).
- Do not commit or push unless asked.
