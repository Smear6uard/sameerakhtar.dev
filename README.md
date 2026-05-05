# sameerakhtar.dev

Personal portfolio site. Migrated from Next.js 15 (App Router) to TanStack Start in May 2026 — same visual design, same color palette, same copy, ported framework-by-framework.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7)
- **Routing**: [TanStack Router](https://tanstack.com/router) (file-based, type-safe)
- **Build / SSR**: [Nitro](https://nitro.build) (auto-detects Vercel)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Animation**: [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com) (ScrollTrigger) + [Lenis](https://github.com/darkroomengineering/lenis) (smooth scroll)
- **Fonts**: Satoshi (self-hosted, `src/fonts/`) + JetBrains Mono (via `@fontsource/jetbrains-mono`)
- **Analytics**: [@vercel/analytics](https://vercel.com/docs/analytics)
- **Deployment**: [Vercel](https://vercel.com)

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view.

### Scripts

| Command             | What it does                                                |
| ------------------- | ----------------------------------------------------------- |
| `pnpm dev`          | Start the Vite dev server with HMR                          |
| `pnpm build`        | Build for production (Nitro emits `.output/`)               |
| `pnpm start`        | Run the production server (`node .output/server/index.mjs`) |
| `pnpm typecheck`    | Run TypeScript in `--noEmit` mode                           |
| `pnpm lint`         | Run ESLint (use `pnpm lint --max-warnings=0` in CI)         |
| `pnpm format`       | Apply Prettier formatting                                   |
| `pnpm format:check` | Verify Prettier formatting                                  |

## Project Structure

```
src/
├── routes/                       # File-based routes (TanStack Router)
│   ├── __root.tsx               # Root layout (was app/layout.tsx)
│   ├── index.tsx                # Home page (was app/page.tsx)
│   ├── blog/
│   │   ├── index.tsx           # Blog index
│   │   └── $slug.tsx           # Blog post (was blog/[slug]/page.tsx)
│   ├── work/
│   │   └── $slug.tsx           # Project case study (was work/[slug]/page.tsx)
│   ├── sitemap[.]xml.ts         # Server route — XML sitemap
│   └── robots[.]txt.ts          # Server route — robots.txt
├── router.tsx                    # TanStack Router setup (createRouter)
├── components/
│   ├── sections/                 # Page sections (Hero, Projects, Experience, About, Contact)
│   ├── ui/                       # Reusable UI (cost calculator, magnetic, theme toggle, etc.)
│   ├── case-study/               # Case study layout & content blocks
│   └── providers/                # ThemeProvider, GSAPProvider, PageTransition
├── hooks/                        # useMagneticEffect, useActiveSection, useKonamiCode, useScrollAnimation
├── lib/                          # Pure utilities (utils, blog-posts, projects, seo)
├── styles/
│   └── globals.css              # Tailwind + theme tokens + @font-face for Satoshi
└── fonts/                        # Satoshi-{Regular,Medium,Bold}.woff2
```

## Theme System

- `data-theme="dark"` (default) and `data-theme="light"` on `<html>`.
- Persisted to `localStorage` under the key `theme`.
- Falls back to `prefers-color-scheme` on first visit.
- An inline FOUC-prevention script (rendered via TanStack head `scripts`) sets the attribute synchronously before React hydrates.
- The `useTheme()` hook in `src/components/providers/ThemeProvider.tsx` exposes `{ theme, resolvedTheme, setTheme }` — same shape as `next-themes`.

## Deployment (Vercel)

The build is wired through Nitro, which auto-detects the Vercel build environment. **No `vercel.json` needed.**

When you redeploy after this migration, in the Vercel project settings:

1. **Framework preset** → change from **"Next.js"** to **"Other"**.
2. **Build command** → leave default or set to `pnpm build`.
3. **Output directory** → leave default (Nitro writes to `.output/`, which Vercel picks up automatically).
4. **Install command** → leave default (`pnpm install`).
5. Push to `main` and trigger a new deploy.

Custom domain, env vars, and analytics carry over unchanged.

## License

MIT
