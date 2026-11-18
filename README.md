# sameerakhtar.dev

Personal site for Sameer Akhtar, software engineer in Chicago. The home page is a scroll-driven
night ride through Chicago in three.js: scrolling drives a black car down an avenue, and each
section of the page is a stop on the route.

## Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7), file-based routing
- **Build / SSR**: [Nitro](https://nitro.build), deployed on [Vercel](https://vercel.com)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with CSS-variable tokens; the "Chicago dusk" palette (midnight indigo, coral, periwinkle, amber), dark by default with a light variant
- **Type**: Big Shoulders Display for cover type, Satoshi (self-hosted) for body, JetBrains Mono for readouts and code
- **3D**: plain [three.js](https://threejs.org), no React renderer. Everything in the scene is built in code
- **Motion**: Framer Motion for the cursor, magnetic buttons, and nav; with reduced motion or no WebGL the home page drops the canvas and reads as a normal page

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
│   ├── ride/               # Canvas mount, scroll-to-timeline mapping, route strip, stop wrapper
│   ├── stops/              # Home page: one component per stop on the route
│   ├── perception/         # Hand-tracking demo (not mounted on any page at present)
│   ├── work/               # Work cards and architecture diagrams
│   ├── fx/                 # Atmosphere, cursor, magnetic, spotlight, scramble, count-up
│   ├── case-study/         # Case-study page layout
│   └── ui/                 # Theme toggle, toast, reveal, link
├── ride/                   # The three.js engine, framework-free
│   ├── route.ts            # Stops, street grid constants, scroll timeline
│   ├── shots.ts            # One camera shot per stop and the moves between them
│   ├── engine.ts           # Renderer, lighting, quality tiers, frame loop
│   ├── post.ts             # Depth of field, motion blur, sun shafts, tone map and grade
│   └── world/              # Sky, ground, city, car, street, signs, set pieces, rain, fireworks
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
default; a visitor's choice is stored in `localStorage` under `theme`. The home page is always
dark: the ride takes place at night.

## The ride

`src/ride/route.ts` lists the stops. Each stop is a `[data-stop]` section; `RideCanvas` maps
scroll position to one number on a hold/drive timeline and hands it to the engine, which eases
toward it. To move the camera at a stop, edit its entry in `src/ride/shots.ts`; each shot also
sets where the lens focuses and how far the background falls out of focus.

The car is lofted from cross-sections in `world/carShell.ts` and dressed in `world/car.ts`;
traffic and parked cars are a shortened, low-detail cut of the same shell. Building windows and
shopfronts are flat boxes with rooms drawn behind the glass in the shader (`world/city.ts`).

In development, `window.__ride` has a few handles: `snap(n)` jumps to timeline position `n`
(stop `i` rests at `2 * i`), `orbit(degrees, metres, height)` looks at the car from anywhere
(`orbit(null)` hands the camera back), and `drive(from, to)` plays a stretch of the timeline
and holds its last frame, which is how to look at motion blur.
