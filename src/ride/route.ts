// The route: stop list and world constants. No three.js imports, so the
// page can read stop metadata without loading the engine.
//
// World axes: the avenue runs along -Z (east, toward the lake). The sun
// sets at +Z. Units are metres.

export interface StopDef {
  /** DOM id of the section that owns this stop. */
  id: string;
  /** Station name on the route rail. */
  label: string;
  /** Metres travelled from the pick-up when the car rests here. */
  dist: number;
}

export const STOPS: readonly StopDef[] = [
  { id: "pickup", label: "Pick-up", dist: 0 },
  { id: "work", label: "Quantum Metric", dist: 240 },
  { id: "renaro", label: "Renaro", dist: 480 },
  { id: "styleum", label: "Styleum", dist: 720 },
  { id: "more-work", label: "More work", dist: 960 },
  { id: "about", label: "About", dist: 1200 },
  { id: "contact", label: "Drop-off", dist: 1480 },
];

export const LAST_STOP = STOPS.length - 1;

/** Street grid: avenues at x = 80k, cross streets at z = 40 + 80k. */
export const BLOCK = 80;
export const ROAD_HALF = 7;
export const BUILDING_LINE = 11;
/** The lake starts here; the avenue continues onto a pier. */
export const SHORE_Z = -1360;
export const PIER_END_Z = -1640;
/** City extends this far behind the pick-up so the sunset has a skyline. */
export const WEST_Z = 360;
/** The car keeps to the right-hand lane. */
export const CAR_X = 1.75;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** Metres travelled at stop-index `u`. Eases to rest at every stop. */
export function carDistance(u: number): number {
  const c = clamp(u, 0, LAST_STOP);
  const i = Math.min(Math.floor(c), LAST_STOP - 1);
  const t = smoother(c - i);
  return STOPS[i].dist + (STOPS[i + 1].dist - STOPS[i].dist) * t;
}

/** 0 at the sunset pick-up, 1 once it is fully dark (before the Renaro stop). */
export function nightAt(u: number): number {
  return smooth(clamp((u - 0.12) / 1.7, 0, 1));
}

export interface Progress {
  /** Stop the car is at, or leaving. */
  stop: number;
  /** True while resting at `stop`; false while driving to the next one. */
  hold: boolean;
  /** Position within the hold or the drive, 0 to 1. */
  t: number;
  /** Continuous stop index, eased while driving. */
  u: number;
}

/**
 * The page reports one number, `w`. Each stop owns two units of it: a hold
 * [2i, 2i + 1] while its section is on screen, then a drive [2i + 1, 2i + 2]
 * to the next stop.
 */
export const MAX_PROGRESS = LAST_STOP * 2 + 1;

export function splitProgress(w: number): Progress {
  const c = clamp(w, 0, MAX_PROGRESS);
  const stop = Math.min(Math.floor(c / 2), LAST_STOP);
  const local = c - stop * 2;
  if (local <= 1 || stop === LAST_STOP) {
    return { stop, hold: true, t: Math.min(local, 1), u: stop };
  }
  const t = local - 1;
  return { stop, hold: false, t, u: stop + t };
}
