# sameerakhtar.dev

Personal site for Sameer Akhtar, software engineer in Chicago. The homepage hero runs a live
hand-tracking demo (MediaPipe Hand Landmarker on WebAssembly + WebGL) entirely in the browser.

## Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7), file-based routing
- **Build / SSR**: [Nitro](https://nitro.build), deployed on [Vercel](https://vercel.com)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with CSS-variable tokens (dark and light)
- **Type**: Bricolage Grotesque (display), Satoshi (body, self-hosted), JetBrains Mono (labels)
- **Motion**: Framer Motion, kept to load and scroll reveals; reduced motion is respected
- **Perception demo**: `@mediapipe/tasks-vision` on the main thread with GPU delegate and CPU fallback

## Develop

```bash
pnpm install
pnpm dev
```

| Command             | What it does                              |
| ------------------- | ----------------------------------------- |
| `pnpm dev`          | Vite dev server with HMR                  |
| `pnpm build`        | Production build (Nitro emits `.output/`) |
| `pnpm start`        | Run the production server                 |
| `pnpm typecheck`    | `tsc --noEmit`                            |
| `pnpm lint`         | ESLint                                    |
| `pnpm format:check` | Prettier check                            |

## Where things live

```
src/
├── routes/                 # __root, index, work/, blog/, sitemap.xml, robots.txt
├── components/
│   ├── sections/           # Home page: hero, work, experience, about, contact
│   ├── perception/         # Hand-tracking demo (landmarker loader, live loop, skeleton)
│   ├── work/               # Work rows and architecture diagrams
│   ├── case-study/         # Case-study page layout
│   └── ui/                 # Theme toggle, toast, reveal, link
├── lib/
│   ├── site.ts             # Identity, links, availability copy
│   ├── resume.ts           # Experience, skills, education, honors, proof numbers
│   ├── projects.ts         # Case-study content
│   └── blog-posts.ts       # Posts
└── styles/globals.css      # Tokens, type scale, components
```

Content changes usually mean editing `src/lib/*.ts` and replacing `public/Sameer_Akhtar_Resume.pdf`.

## Theme

`data-theme="dark" | "light"` on `<html>`, set before hydration by an inline script. Follows the
OS preference unless the visitor picks one; the choice is stored in `localStorage` under `theme`.
