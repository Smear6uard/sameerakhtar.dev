# Night Ride Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home page with a scroll-driven three.js night ride through Chicago whose stops carry the résumé content.

**Architecture:** A framework-free three.js engine in `src/ride/` exposes `createRide(canvas, options)`. React mounts it client-only behind normal document-flow sections. Scroll position is mapped to a continuous stop index `u` (0 to 6) that drives car distance, sky and camera shots.

**Tech Stack:** three 0.187 (plain, with `three/examples/jsm` postprocessing and Reflector), React 19, TanStack Start, Tailwind v4, Big Shoulders Display via fontsource.

**Spec:** `docs/superpowers/specs/2026-11-16-night-ride-design.md`

## Global Constraints

- No italics, script or handwriting fonts anywhere. Copy is plain concrete statements.
- All résumé facts are real DOM text, readable with the canvas absent.
- The engine never runs on the server: it is loaded with a dynamic `import()` inside an effect.
- No canvas when `prefers-reduced-motion: reduce` or WebGL is unavailable.
- World axes: the avenue runs along −Z (east, toward the lake); the sun sets at +Z. Units are metres.
- Colours come from the Chicago dusk tokens: `#0d1121`, `#f76b57`, `#8b9cff`, `#ffb86b`, `#f4efe6`.
- The project has no test runner and none is added. Each task is verified by `pnpm typecheck`, `pnpm lint` and a browser check at the stated scroll position.

## Review Focus

- Phone-width viewport: content must not overflow horizontally and the scene must hold a usable frame rate on the low tier.
- Reduced motion or no WebGL: page reads as a normal dark page with every section visible.
- Navigating home → case study → home: the engine disposes and remounts without leaking a second render loop.
- Tab hidden or canvas route left: the render loop stops.
- Deep link to `/#about` and `/#contact`: lands on the right stop with the camera at that stop.

## File Structure

| File                                 | Responsibility                                                                            |
| ------------------------------------ | ----------------------------------------------------------------------------------------- |
| `src/ride/route.ts`                  | Stop list, world constants, `carDistance(u)`, `nightAt(u)`. No three imports.             |
| `src/ride/shared.ts`                 | Shared uniforms (`uTime`, `uNight`, fog), GLSL hash/fog chunks, canvas text textures.     |
| `src/ride/world/sky.ts`              | Sky dome shader: sunset to night, stars.                                                  |
| `src/ride/world/ground.ts`           | Street-grid ground shader with wet planar reflection, lamp pools, lake, dispatch overlay. |
| `src/ride/world/city.ts`             | Instanced buildings with window shader, landmark towers.                                  |
| `src/ride/world/car.ts`              | Procedural black car, light bars, headlight beams, wheel spin.                            |
| `src/ride/world/street.ts`           | Lamps and halos, L viaduct and train, traffic.                                            |
| `src/ride/world/stops.ts`            | Palette tower, boutique, marquee, photo billboards, lakefront wheel.                      |
| `src/ride/world/rain.ts`             | Rain streaks around the camera.                                                           |
| `src/ride/shots.ts`                  | Camera shot per stop and `sampleShot(u, drift)`.                                          |
| `src/ride/engine.ts`                 | Renderer, composer, quality tiers, loop, `createRide`.                                    |
| `src/ride/store.ts`                  | Tiny external store for the active stop index.                                            |
| `src/components/ride/RideCanvas.tsx` | Mounts the engine, maps scroll to `u`, handles fallbacks.                                 |
| `src/components/ride/RideHud.tsx`    | Route rail, stop counter, Chicago time.                                                   |
| `src/components/ride/Stop.tsx`       | Section wrapper with `data-stop`, side layout, reveal.                                    |
| `src/components/stops/*.tsx`         | One component per stop, content from `lib/resume.ts`, `lib/projects.ts`, `lib/site.ts`.   |

## Interfaces

```ts
// route.ts
export interface StopDef {
  id: string;
  label: string;
  dist: number;
}
export const STOPS: readonly StopDef[]; // 7 entries, ids: pickup, work, renaro, styleum, more-work, about, contact
export function carDistance(u: number): number; // metres travelled, eased to rest at each stop
export function nightAt(u: number): number; // 0 at pick-up, 1 by the Styleum stop

// engine.ts
export interface Ride {
  setProgress(u: number, drift: number): void; // u in [0, 6], drift in [-1, 1]
  setPointer(x: number, y: number): void; // each in [-1, 1]
  dispose(): void;
}
export function createRide(
  canvas: HTMLCanvasElement,
  opts: { low: boolean; onReady: () => void },
): Ride;

// store.ts
export const rideStore: {
  get(): number;
  set(i: number): void;
  subscribe(fn: () => void): () => void;
};
```

## Tasks

### Task 1: Dependencies, tokens, type

- [ ] Add `three`, `@types/three`, `@fontsource/big-shoulders-display`.
- [ ] `globals.css`: import Big Shoulders 800 and 900, add `--font-display`, darken `--bg` on the home route, remove the one `font-style: italic` rule, add `.cover-type` and ticket styles.
- [ ] Verify: `pnpm typecheck && pnpm lint` pass.

### Task 2: Engine and world

- [ ] `route.ts`, `shared.ts`, then `world/*` in the order sky, ground, city, car, street, stops, rain.
- [ ] `shots.ts`, `engine.ts` with tiers: high = DPR ≤ 1.5, reflection, live car cube map; low = DPR ≤ 1.25, neither.
- [ ] Verify in the browser at each of the 7 stops: the subject named in the spec table is in frame and lit.

### Task 3: Page

- [ ] `store.ts`, `RideCanvas.tsx`, `RideHud.tsx`, `Stop.tsx`, seven stop components, new `routes/index.tsx`.
- [ ] `TopNav.tsx` and `useActiveSection.ts`: nav targets become `work`, `about`, `contact`; header is transparent over the canvas.
- [ ] `__root.tsx`: orbs hidden on the home route.
- [ ] Delete the five replaced files in `src/components/sections/`.
- [ ] Verify: every Review Focus line, by hand in the browser.

### Task 4: Final checks

- [ ] `pnpm typecheck && pnpm lint && pnpm build` all pass.
- [ ] Screenshots at desktop and phone widths for each stop.
