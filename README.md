# sameerakhtar.dev

Personal site for Sameer Akhtar, software engineer in Chicago. The homepage hero runs a live
hand-tracking demo (MediaPipe Hand Landmarker on WebAssembly + WebGL) entirely in the browser.

## Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7), file-based routing
- **Build / SSR**: [Nitro](https://nitro.build), deployed on [Vercel](https://vercel.com)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with CSS-variable tokens; navy + orange theme, dark by default with a light variant
- **Type**: Satoshi (self-hosted) with JetBrains Mono for labels and code
- **Motion**: CSS reveals plus Framer Motion for the cursor, magnetic buttons, and nav; reduced motion is respected
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
│   ├── work/               # Work cards and architecture diagrams
│   ├── fx/                 # Atmosphere, cursor, magnetic, spotlight, scramble, count-up
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

`data-theme="dark" | "light"` on `<html>`, set before hydration by an inline script. Dark by
default; a visitor's choice is stored in `localStorage` under `theme`.
