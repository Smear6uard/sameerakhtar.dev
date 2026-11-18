// Camera choreography. One shot per stop, described relative to the car in
// polar form so the camera swings around it instead of cutting through it.
//
// Car-local frame: r = metres to the car's right (+X), y = up,
// f = metres ahead of the car (-Z). Angle 0 is dead ahead, 90 is the right.

import { Vector3 } from "three";
import { LAST_STOP, smoother, type Progress } from "./route";

interface Shot {
  ang: number; // degrees
  rad: number;
  y: number;
  /** Look target, car-local [r, y, f]. */
  look: [number, number, number];
  fov: number;
  /** Metres to the plane of focus; 0 keeps the car sharp. */
  focus: number;
  /** How far the background is thrown out of focus, 0 to 1. */
  aperture: number;
  /** Slow move while the car rests here: change at the end of the hold. */
  dAng: number;
  dRad: number;
  dY: number;
  /** Shaping of the move to the next stop. */
  lift: number;
  squeeze: number;
  turnFrom: number;
}

const SHOTS: Shot[] = [
  // Pick-up: low, ahead of the car on the kerb side, looking back into the sunset.
  {
    ang: 27,
    rad: 9.4,
    y: 0.66,
    look: [1.75, 1.4, -1.0],
    fov: 34,
    focus: 0,
    aperture: 0.8,
    dAng: 7,
    dRad: -0.9,
    dY: 0.06,
    lift: 2.4,
    squeeze: 0.45,
    turnFrom: 0,
  },
  // Quantum Metric: behind the car, looking up the avenue at the palette tower.
  {
    ang: 195,
    rad: 9.9,
    y: 1.15,
    look: [8, 14, 60],
    fov: 40,
    focus: 0,
    aperture: 0.1,
    dAng: -3,
    dRad: -1.4,
    dY: 0.2,
    lift: 0,
    squeeze: 0,
    turnFrom: 0,
  },
  // Renaro: straight above, the grid as a dispatch map.
  {
    ang: 180,
    rad: 30,
    y: 330,
    look: [3, 0, 28],
    fov: 30,
    focus: 0,
    aperture: 0,
    dAng: 0,
    dRad: 0,
    dY: -36,
    lift: 0,
    squeeze: 0,
    turnFrom: 0,
  },
  // Styleum: tracking shot across the car into the boutique window.
  {
    ang: 103.6,
    rad: 6.6,
    y: 1.25,
    look: [-12, 2.7, 1.0],
    fov: 44,
    focus: 15,
    aperture: 0.12,
    dAng: -9,
    dRad: 0.3,
    dY: 0,
    lift: 2,
    squeeze: 0.14,
    turnFrom: 0,
  },
  // More work: from the far kerb, the marquee over the car.
  {
    ang: -50.5,
    rad: 11,
    y: 1.1,
    look: [5.5, 6.0, -3.6],
    fov: 52,
    focus: 0,
    aperture: 0.4,
    dAng: -5,
    dRad: -0.5,
    dY: 0.1,
    lift: 1.5,
    squeeze: 0.35,
    turnFrom: 0,
  },
  // About: crane behind the car, billboards on both sides.
  {
    ang: -174.7,
    rad: 12.5,
    y: 4.6,
    look: [5.5, 6.6, 40],
    fov: 48,
    focus: 0,
    aperture: 0.05,
    dAng: 0,
    dRad: -2.2,
    dY: 0.5,
    lift: 9,
    squeeze: 0.2,
    turnFrom: 0.4,
  },
  // Drop-off: from the end of the pier, the city behind the car.
  {
    ang: -345,
    rad: 15.5,
    y: 1.05,
    look: [-4.2, 5.6, -40],
    fov: 44,
    focus: 0,
    aperture: 0.36,
    dAng: 3,
    dRad: -1.5,
    dY: 0.1,
    lift: 0,
    squeeze: 0,
    turnFrom: 0,
  },
];

export interface CameraSample {
  /** Camera position relative to the car, world axes. */
  offset: Vector3;
  /** Look target relative to the car, world axes. */
  look: Vector3;
  fov: number;
  /** Metres to the plane of focus; 0 means the car. */
  focus: number;
  aperture: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function place(
  out: CameraSample,
  ang: number,
  rad: number,
  y: number,
  look: number[],
  fov: number,
) {
  const a = (ang * Math.PI) / 180;
  out.offset.set(Math.sin(a) * rad, y, -Math.cos(a) * rad);
  out.look.set(look[0], look[1], -look[2]);
  out.fov = fov;
}

/** Shot `i` with its slow hold move applied: d runs -1 (arriving) to 1 (leaving). */
function held(i: number, d: number) {
  const s = SHOTS[i];
  const k = (d + 1) / 2;
  return { ang: s.ang + s.dAng * k, rad: s.rad + s.dRad * k, y: s.y + s.dY * k };
}

export function sampleShot(p: Progress, out: CameraSample): CameraSample {
  const a = SHOTS[p.stop];
  if (p.hold || p.stop >= LAST_STOP) {
    const h = held(p.stop, p.t * 2 - 1);
    place(out, h.ang, h.rad, h.y, a.look, a.fov);
    out.focus = a.focus;
    out.aperture = a.aperture;
    return out;
  }
  const b = SHOTS[p.stop + 1];
  const from = held(p.stop, 1);
  const to = held(p.stop + 1, -1);
  const e = smoother(p.t);
  const turn = smoother(clamp01((p.t - a.turnFrom) / (1 - a.turnFrom)));
  const arc = Math.sin(Math.PI * e);
  place(
    out,
    lerp(from.ang, to.ang, turn),
    lerp(from.rad, to.rad, e) * (1 - a.squeeze * arc),
    lerp(from.y, to.y, e) + a.lift * arc,
    [lerp(a.look[0], b.look[0], e), lerp(a.look[1], b.look[1], e), lerp(a.look[2], b.look[2], e)],
    lerp(a.fov, b.fov, e),
  );
  // Focus pulls between two distances; "the car" is resolved by the engine.
  out.focus = a.focus && b.focus ? lerp(a.focus, b.focus, e) : e < 0.5 ? a.focus : b.focus;
  out.aperture =
    a.focus === b.focus || (a.focus && b.focus)
      ? lerp(a.aperture, b.aperture, e)
      : Math.abs(e - 0.5) * 2 * (e < 0.5 ? a.aperture : b.aperture);
  return out;
}
