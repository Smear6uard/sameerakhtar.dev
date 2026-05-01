# sameerakhtar.dev

Personal portfolio rebuild on TanStack Start. Phase 1 is the foundation only: project setup, tokens, fonts, theme persistence, and the global layout chrome.

## Requirements

- Node `>=22.12.0`
- pnpm `>=9`

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm format:check
```

`pnpm dev` starts TanStack Start through Vite. `pnpm build` runs TypeScript first, then produces the production build.

## Structure

- `app/routes/__root.tsx` owns the HTML document, global CSS link, no-flash theme script, providers, and shell.
- `app/routes/index.tsx` is the only Phase 1 route.
- `app/components/layout/` contains the top bar, side rails, right-edge text, bottom bar, and shell wrapper.
- `app/components/theme/` and `app/hooks/useTheme.ts` contain the localStorage-backed theme system.
- `app/styles/global.css` contains Tailwind v4 CSS-first configuration, design tokens, theme values, and self-hosted font faces.

TanStack Start is configured with `srcDirectory: 'app'`, so later routes can be added under `app/routes`, for example `app/routes/writing.tsx` or `app/routes/work/$slug.tsx`.

## Design Tokens

Tailwind v4 tokens are defined in `app/styles/global.css` using `@theme`, then mapped to runtime CSS variables. Use utilities like `bg-bg`, `text-fg`, `text-fg-2`, `text-accent`, `border-border`, `font-display`, `font-body`, and `font-mono`.

Theme values live on `html[data-theme='light']` and `html[data-theme='dark']`. The base palette is bone/ink with mustard amber:

- Light: `--bg #F4F0E6`, `--fg #0E0F12`, `--accent #C58A1B`
- Dark: `--bg #0C0D10`, `--fg #F2EDDF`, `--accent #E8B548`

Layout constants are also CSS variables:

- `--rail-left`: `24px` mobile, `56px` desktop
- `--rail-right`: `24px` mobile, `56px` desktop
- `--topbar-height`: `80px`

## Fonts

Fonts are self-hosted from `@fontsource` packages. Runtime font files are bundled by Vite from `node_modules`; there is no Google Fonts CDN dependency.

- Display: Fraunces variable, with `opsz`, `SOFT`, and `WONK` exposed through CSS variables
- Body: Bricolage Grotesque variable
- Mono: JetBrains Mono `400` and `500`

## Theme System

The inline script in `app/routes/__root.tsx` runs in the document head before the stylesheet and React hydration. It reads `localStorage`, falls back to `prefers-color-scheme`, and writes `data-theme` plus `color-scheme` to `<html>`.

The React theme state is intentionally small: `ThemeProvider` reads the document theme after the script has run, persists changes to `localStorage`, and updates `<html data-theme>`. `ThemeToggle` is keyboard accessible and uses the accent focus ring.

## Later Phases

- Phase 2: replace the centered placeholder in `app/routes/index.tsx` with the custom lens-interaction hero.
- Phase 3: add selected work sections and pipeline diagrams under `app/components/work/` and future `app/routes/work/`.
- Phase 4: add timeline, about, and contact sections under page-mirrored component folders.
