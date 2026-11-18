// Lofted car bodywork. A shell is two grids of rings swept along the car's
// length: the lower body (closed rings) and the greenhouse (open arches).
// The hero limousine and the traffic cars are cut from the same profiles at
// different resolutions.
//
// Stations are measured in `s`, metres ahead of the car's origin. The car
// faces -Z, so a station sits at z = -s.

import { BufferAttribute, BufferGeometry } from "three";

export const CAR = {
  front: 2.8,
  rear: -3.05,
  axleFront: 1.9,
  axleRear: -1.8,
  wheelR: 0.39,
  arch: 0.455,
  /** Wheel centre, metres off the centreline. */
  track: 0.835,
  halfWidth: 0.99,
  /** Where the glass ends and the roof begins, front and back. */
  screenTop: 0.3,
  backlightTop: -1.52,
  /** Side glass runs between the pillars. */
  cPillar: -1.42,
  bPillar: [-0.2, -0.08],
  cabinFront: 1.02,
  cabinRear: -2.2,
} as const;

type P2 = [number, number];
type Fn = (s: number) => number;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Monotone cubic through [s, value] keys: no overshoot between keys. */
export function keyed(keys: readonly (readonly [number, number])[]): Fn {
  const n = keys.length;
  const xs = keys.map((k) => k[0]);
  const ys = keys.map((k) => k[1]);
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  const m: number[] = new Array<number>(n).fill(0);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const h = a * a + b * b;
    if (h > 9) {
      const t = 3 / Math.sqrt(h);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }
  return (s) => {
    if (s <= xs[0]) return ys[0];
    if (s >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (s > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i];
    const t = (s - xs[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h * m[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h * m[i + 1]
    );
  };
}

const knot = (a: P2, b: P2) => Math.max(1e-4, Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1])));

/**
 * Centripetal Catmull-Rom through a half cross-section. The last point is on
 * the centreline and mirrors; the first does too when `mirrorStart` is set.
 * `per[k]` samples are taken on the span from point k to k + 1.
 */
function spline(pts: P2[], per: readonly number[], mirrorStart: boolean): P2[] {
  const n = pts.length;
  const ext: P2[] = [
    mirrorStart ? [-pts[1][0], pts[1][1]] : [2 * pts[0][0] - pts[1][0], 2 * pts[0][1] - pts[1][1]],
    ...pts,
    [-pts[n - 2][0], pts[n - 2][1]],
  ];
  const out: P2[] = [];
  for (let k = 0; k < n - 1; k++) {
    const p0 = ext[k];
    const p1 = ext[k + 1];
    const p2 = ext[k + 2];
    const p3 = ext[k + 3];
    const t1 = knot(p0, p1);
    const t2 = t1 + knot(p1, p2);
    const t3 = t2 + knot(p2, p3);
    for (let q = 0; q < per[k]; q++) {
      const t = t1 + (t2 - t1) * (q / per[k]);
      const pt: P2 = [0, 0];
      for (let c = 0; c < 2; c++) {
        const a1 = ((t1 - t) / t1) * p0[c] + (t / t1) * p1[c];
        const a2 = ((t2 - t) / (t2 - t1)) * p1[c] + ((t - t1) / (t2 - t1)) * p2[c];
        const a3 = ((t3 - t) / (t3 - t2)) * p2[c] + ((t - t2) / (t3 - t2)) * p3[c];
        const b1 = ((t2 - t) / t2) * a1 + (t / t2) * a2;
        const b2 = ((t3 - t) / (t3 - t1)) * a2 + ((t - t1) / (t3 - t1)) * a3;
        pt[c] = ((t2 - t) / (t2 - t1)) * b1 + ((t - t1) / (t2 - t1)) * b2;
      }
      out.push(pt);
    }
  }
  out.push(pts[n - 1]);
  return out;
}

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------

/** 0 to 1 with a vertical tangent at 1: a quarter superellipse. */
const roll = (t: number, e: number) => 1 - Math.pow(1 - Math.pow(clamp01(t), e), 1 / e);
const toFront = (s: number, depth: number) => (s - (CAR.front - depth)) / depth;
const toRear = (s: number, depth: number) => (CAR.rear + depth - s) / depth;

const widthBase = keyed([
  [-3.05, 0.9],
  [-2.4, 0.968],
  [-1.8, 0.992],
  [-0.7, 0.978],
  [0.7, 0.978],
  [1.9, 0.99],
  [2.45, 0.958],
  [2.8, 0.91],
]);
const beltBase = keyed([
  [-3.05, 0.935],
  [-2.5, 0.968],
  [-1.8, 0.99],
  [-0.5, 1.0],
  [0.9, 1.0],
  [1.9, 0.978],
  [2.5, 0.94],
  [2.8, 0.905],
]);
const crownBase = keyed([
  [-3.05, 0.018],
  [-2.6, 0.03],
  [-2.2, 0.04],
  [1.1, 0.05],
  [1.9, 0.06],
  [2.6, 0.045],
  [2.8, 0.03],
]);
const floorBase = keyed([
  [-3.05, 0.33],
  [-2.7, 0.29],
  [-2.3, 0.215],
  [2.2, 0.205],
  [2.55, 0.235],
  [2.8, 0.29],
]);
/** Greenhouse height above the belt line. */
const cabinHeight = keyed([
  [-2.2, 0],
  [-2.05, 0.11],
  [-1.85, 0.27],
  [-1.62, 0.41],
  [-1.35, 0.475],
  [-0.9, 0.497],
  [-0.35, 0.5],
  [0.05, 0.475],
  [0.3, 0.42],
  [0.55, 0.3],
  [0.8, 0.15],
  [1.02, 0],
]);

/** Corner depth of the nose and tail in plan. */
const NOSE = 0.46;
const TAIL = 0.42;

const halfWidth: Fn = (s) =>
  widthBase(s) * (1 - 0.28 * roll(toFront(s, NOSE), 2.6)) * (1 - 0.25 * roll(toRear(s, TAIL), 2.6));
const belt: Fn = (s) =>
  beltBase(s) - 0.075 * roll(toFront(s, 0.2), 2.2) - 0.06 * roll(toRear(s, 0.18), 2.2);
const crown: Fn = (s) =>
  crownBase(s) * (1 - 0.6 * roll(toFront(s, 0.2), 2.2)) * (1 - 0.5 * roll(toRear(s, 0.18), 2.2));
const floor: Fn = (s) =>
  floorBase(s) + 0.06 * roll(toFront(s, 0.26), 2.2) + 0.05 * roll(toRear(s, 0.24), 2.2);

const BODY_PER = {
  hero: [2, 3, 3, 3, 4, 3, 3, 2, 4, 4, 3],
  low: [1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1],
} as const;
const CABIN_PER = {
  hero: [4, 4, 2, 4, 4],
  low: [2, 2, 1, 2, 2],
} as const;

export type Detail = keyof typeof BODY_PER;

/** Half cross-section of the lower body, bottom centre round to top centre. */
function bodySection(s: number, detail: Detail): P2[] {
  const w = halfWidth(s);
  const f = floor(s);
  const b = belt(s);
  const c = crown(s);
  const side = b - f;
  return spline(
    [
      [0, f],
      [0.5 * w, f],
      [0.84 * w, f + 0.004],
      [0.945 * w, f + 0.05],
      [0.985 * w, f + 0.16],
      [w, f + 0.56 * side],
      [0.994 * w, b - 0.13],
      [0.972 * w, b - 0.022],
      [0.925 * w, b + 0.008],
      [0.7 * w, b + 0.62 * c],
      [0.36 * w, b + 0.93 * c],
      [0, b + c],
    ],
    BODY_PER[detail],
    true,
  );
}

const cabinBaseX: Fn = (s) => 0.925 * halfWidth(s) - 0.03;

/** Half arch of the greenhouse, belt line up to the roof centre. */
function cabinSection(s: number, detail: Detail): P2[] {
  const h = Math.max(0, cabinHeight(s));
  const y0 = belt(s) + 0.006;
  const wb = cabinBaseX(s);
  const wr = wb - 0.33 * h;
  const k = Math.min(1, h / 0.12);
  return spline(
    [
      [wb, y0],
      [wb - 0.1485 * h + 0.016 * k - 0.02 * (1 - k), y0 + 0.45 * h],
      [wr + 0.036 * k - 0.04 * (1 - k), y0 + 0.86 * h],
      [wr - 0.03 * k - 0.08 * (1 - k), y0 + 0.955 * h],
      [0.55 * wr, y0 + 0.992 * h],
      [0, y0 + h],
    ],
    CABIN_PER[detail],
    false,
  );
}

/** The screen and the backlight wrap around in plan: metres the glass centre
 *  sits ahead of (or behind) its corners. */
export const screenBow = (s: number) =>
  0.26 * clamp01((s - 0.25) / 0.77) - 0.15 * clamp01((-1.55 - s) / 0.65);

// ---------------------------------------------------------------------------
// Grids
// ---------------------------------------------------------------------------

export interface Grid {
  rows: number;
  cols: number;
  /** Rings wrap around. */
  closed: boolean;
  pos: Float32Array;
  nor: Float32Array;
  /** Station of each row. */
  s: number[];
}

export function makeGrid(
  rings: number[][],
  s: number[],
  closed: boolean,
  /** A vertex whose normal must point along +axis (0 = x, 1 = y). */
  ref: { row: number; col: number; axis: number },
): Grid {
  const rows = rings.length;
  const cols = rings[0].length / 3;
  const pos = new Float32Array(rows * cols * 3);
  rings.forEach((ring, i) => pos.set(ring, i * cols * 3));
  const nor = new Float32Array(rows * cols * 3);
  const at = (i: number, j: number) => (i * cols + j) * 3;
  for (let i = 0; i < rows; i++) {
    const i0 = Math.max(0, i - 1);
    const i1 = Math.min(rows - 1, i + 1);
    for (let j = 0; j < cols; j++) {
      const j0 = closed ? (j - 1 + cols) % cols : Math.max(0, j - 1);
      const j1 = closed ? (j + 1) % cols : Math.min(cols - 1, j + 1);
      const a = at(i1, j);
      const b = at(i0, j);
      const c = at(i, j1);
      const d = at(i, j0);
      const ux = pos[a] - pos[b];
      const uy = pos[a + 1] - pos[b + 1];
      const uz = pos[a + 2] - pos[b + 2];
      const vx = pos[c] - pos[d];
      const vy = pos[c + 1] - pos[d + 1];
      const vz = pos[c + 2] - pos[d + 2];
      let nx = uy * vz - uz * vy;
      let ny = uz * vx - ux * vz;
      let nz = ux * vy - uy * vx;
      const len = Math.hypot(nx, ny, nz);
      if (len < 1e-9) {
        nx = 0;
        ny = 1;
        nz = 0;
      } else {
        nx /= len;
        ny /= len;
        nz /= len;
      }
      const o = at(i, j);
      nor[o] = nx;
      nor[o + 1] = ny;
      nor[o + 2] = nz;
    }
  }
  if (nor[at(ref.row, ref.col) + ref.axis] < 0) {
    for (let k = 0; k < nor.length; k++) nor[k] = -nor[k];
  }
  // Collapsed rows (where the glass meets the body) have no usable tangent.
  for (let k = 0; k < nor.length; k += 3) {
    if (nor[k] === 0 && nor[k + 1] === -1) nor[k + 1] = 1;
  }
  return { rows, cols, closed, pos, nor, s };
}

export interface GridMeshOptions {
  /** Keep only these cells. Cell (i, j) spans rows i..i+1, columns j..j+1. */
  pick?: (i: number, j: number) => boolean;
  /** Metres to sink the surface along its normal. */
  inset?: number;
  /** Constant vertex colour, for geometry that will be merged. */
  color?: readonly [number, number, number];
}

export function gridGeometry(g: Grid, opts: GridMeshOptions = {}): BufferGeometry {
  const { rows, cols, closed } = g;
  const cells = closed ? cols : cols - 1;
  const inset = opts.inset ?? 0;
  const map = new Int32Array(rows * cols).fill(-1);
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  const vert = (i: number, j: number) => {
    const k = i * cols + (j % cols);
    if (map[k] < 0) {
      map[k] = pos.length / 3;
      const o = k * 3;
      pos.push(
        g.pos[o] - g.nor[o] * inset,
        g.pos[o + 1] - g.nor[o + 1] * inset,
        g.pos[o + 2] - g.nor[o + 2] * inset,
      );
      nor.push(g.nor[o], g.nor[o + 1], g.nor[o + 2]);
    }
    return map[k];
  };
  const tri = (a: number, b: number, c: number) => {
    const ax = pos[a * 3];
    const ay = pos[a * 3 + 1];
    const az = pos[a * 3 + 2];
    const ux = pos[b * 3] - ax;
    const uy = pos[b * 3 + 1] - ay;
    const uz = pos[b * 3 + 2] - az;
    const vx = pos[c * 3] - ax;
    const vy = pos[c * 3 + 1] - ay;
    const vz = pos[c * 3 + 2] - az;
    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;
    if (nx * nx + ny * ny + nz * nz < 1e-16) return;
    const facing =
      nx * (nor[a * 3] + nor[b * 3] + nor[c * 3]) +
      ny * (nor[a * 3 + 1] + nor[b * 3 + 1] + nor[c * 3 + 1]) +
      nz * (nor[a * 3 + 2] + nor[b * 3 + 2] + nor[c * 3 + 2]);
    if (facing >= 0) idx.push(a, b, c);
    else idx.push(a, c, b);
  };
  for (let i = 0; i < rows - 1; i++) {
    for (let j = 0; j < cells; j++) {
      if (opts.pick && !opts.pick(i, j)) continue;
      const a = vert(i, j);
      const b = vert(i + 1, j);
      const c = vert(i + 1, j + 1);
      const d = vert(i, j + 1);
      tri(a, b, c);
      tri(a, c, d);
    }
  }
  return finish(pos, nor, idx, opts.color);
}

/** Flat cap over the first or last ring of a closed grid. */
export function capGeometry(
  g: Grid,
  row: number,
  color?: readonly [number, number, number],
): BufferGeometry {
  const { cols } = g;
  const nz = row === 0 ? 1 : -1; // the rear faces +Z
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  let cx = 0;
  let cy = 0;
  let cz = 0;
  for (let j = 0; j < cols; j++) {
    const o = (row * cols + j) * 3;
    pos.push(g.pos[o], g.pos[o + 1], g.pos[o + 2]);
    nor.push(0, 0, nz);
    cx += g.pos[o];
    cy += g.pos[o + 1];
    cz += g.pos[o + 2];
  }
  pos.push(cx / cols, cy / cols, cz / cols);
  nor.push(0, 0, nz);
  for (let j = 0; j < cols; j++) {
    const a = j;
    const b = (j + 1) % cols;
    const ux = pos[a * 3] - pos[cols * 3];
    const uy = pos[a * 3 + 1] - pos[cols * 3 + 1];
    const vx = pos[b * 3] - pos[cols * 3];
    const vy = pos[b * 3 + 1] - pos[cols * 3 + 1];
    if ((ux * vy - uy * vx) * nz >= 0) idx.push(cols, a, b);
    else idx.push(cols, b, a);
  }
  return finish(pos, nor, idx, color);
}

function finish(
  pos: number[],
  nor: number[],
  idx: number[],
  color?: readonly [number, number, number],
) {
  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
  geo.setAttribute("normal", new BufferAttribute(new Float32Array(nor), 3));
  if (color) geo.setAttribute("color", constantColor(pos.length / 3, color));
  geo.setIndex(idx);
  return geo;
}

export function constantColor(count: number, color: readonly [number, number, number]) {
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) colors.set(color, i * 3);
  return new BufferAttribute(colors, 3);
}

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------

export type CabinZone = "side" | "rail" | "top";

export interface Shell {
  body: Grid;
  cabin: Grid;
  /** Where the station ends up along the car after `remap`. */
  place(s: number): number;
  /** Half-width of the body skin at station `s`, `y` metres up. */
  skinX(s: number, y: number): number;
  /** Height of the bonnet or boot lid at station `s`, `x` metres off centre. */
  deckY(s: number, x: number): number;
  beltY(s: number): number;
  /** Top of the greenhouse on the centreline. */
  roofY(s: number): number;
  /** Half-width of the foot of the glass. */
  cabinBaseX(s: number): number;
  cabinZone(j: number): CabinZone;
  /** Columns in one side window, bottom to top. */
  sideCols: number;
}

function stations(step: number, ends: number) {
  const out: number[] = [];
  const from = CAR.rear + TAIL;
  const to = CAR.front - NOSE;
  for (let k = 0; k < ends; k++) {
    out.push(CAR.rear + TAIL * Math.pow(k / ends, 2.4));
  }
  const n = Math.round((to - from) / step);
  for (let k = 0; k <= n; k++) out.push(from + ((to - from) * k) / n);
  for (let k = ends - 1; k >= 0; k--) {
    out.push(CAR.front - NOSE * Math.pow(k / ends, 2.4));
  }
  return out;
}

function cabinStations(step: number) {
  const marks = [
    CAR.cabinRear,
    CAR.backlightTop,
    CAR.cPillar,
    CAR.bPillar[0],
    CAR.bPillar[1],
    CAR.screenTop,
    0.92,
    CAR.cabinFront,
  ];
  const out: number[] = [];
  for (let k = 0; k < marks.length - 1; k++) {
    const a = marks[k];
    const b = marks[k + 1];
    const n = Math.max(1, Math.round((b - a) / step));
    for (let q = 0; q < n; q++) out.push(a + ((b - a) * q) / n);
  }
  out.push(CAR.cabinFront);
  return out;
}

/**
 * Build the shell. `remap` moves stations along the car, which is how the
 * shorter traffic cars are made without redrawing the wheel arches.
 */
export function buildShell(detail: Detail, remap: Fn = (s) => s): Shell {
  const hero = detail === "hero";

  const bodyS = stations(hero ? 0.085 : 0.42, hero ? 14 : 4);
  const bodyRings = bodyS.map((s) => {
    const half = bodySection(s, detail);
    const z = -remap(s);
    const ring: number[] = [];
    for (const [x, y] of half) ring.push(x, y, z);
    for (let k = half.length - 2; k >= 1; k--) ring.push(-half[k][0], half[k][1], z);
    return ring;
  });
  const bodyPer = BODY_PER[detail];
  const widest = bodyPer.slice(0, 5).reduce((a, b) => a + b, 0);
  const body = makeGrid(bodyRings, bodyS, true, {
    row: Math.floor(bodyS.length / 2),
    col: widest,
    axis: 0,
  });

  const cabinS = cabinStations(hero ? 0.075 : 0.45);
  const cabinRings = cabinS.map((s) => {
    const half = cabinSection(s, detail);
    const wb = cabinBaseX(s);
    const bow = screenBow(s);
    const ring: number[] = [];
    const put = (x: number, y: number) => {
      const q = Math.min(1, Math.abs(x) / wb);
      ring.push(x, y, -remap(s + bow * (1 - Math.pow(q, 2.2))));
    };
    for (const [x, y] of half) put(x, y);
    for (let k = half.length - 2; k >= 0; k--) put(-half[k][0], half[k][1]);
    return ring;
  });
  const cabinPer = CABIN_PER[detail];
  const halfCells = cabinPer.reduce((a, b) => a + b, 0);
  const sideCols = cabinPer[0] + cabinPer[1];
  const railCols = cabinPer[2];
  const cabin = makeGrid(cabinRings, cabinS, false, {
    row: Math.floor(cabinS.length / 2),
    col: halfCells,
    axis: 1,
  });

  return {
    body,
    cabin,
    place: remap,
    skinX(s, y) {
      const pts = bodySection(s, detail);
      for (let k = 1; k < pts.length; k++) {
        const [x0, y0] = pts[k - 1];
        const [x1, y1] = pts[k];
        if (y1 > y0 && y >= y0 && y <= y1 && x1 > 0.5 * pts[widest][0]) {
          return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0);
        }
      }
      return pts[widest][0];
    },
    deckY(s, x) {
      const pts = bodySection(s, detail);
      const ax = Math.abs(x);
      for (let k = pts.length - 1; k > widest; k--) {
        const [x1, y1] = pts[k];
        const [x0, y0] = pts[k - 1];
        if (x0 >= ax) return x0 === x1 ? y1 : y0 + ((y1 - y0) * (x0 - ax)) / (x0 - x1);
      }
      return belt(s);
    },
    beltY: belt,
    roofY: (s) => belt(s) + 0.006 + Math.max(0, cabinHeight(s)),
    cabinBaseX,
    cabinZone(j) {
      const jj = j < halfCells ? j : halfCells * 2 - 1 - j;
      if (jj < sideCols) return "side";
      if (jj < sideCols + railCols) return "rail";
      return "top";
    },
    sideCols,
  };
}

/** Which greenhouse cells are glass. Everything else is roof and pillar. */
export function isGlass(shell: Shell, i: number, j: number): boolean {
  const s = (shell.cabin.s[i] + shell.cabin.s[i + 1]) / 2;
  const zone = shell.cabinZone(j);
  if (zone === "rail") return false;
  if (zone === "top") return s > CAR.screenTop || s < CAR.backlightTop;
  if (s < CAR.cPillar || s > 0.92) return false;
  return s < CAR.bPillar[0] || s > CAR.bPillar[1];
}

/**
 * Revolve a profile of [radius, offset along the axle] points around the X
 * axis. `refRow` names a profile point that faces away from the axle.
 */
export function latheX(
  profile: readonly (readonly [number, number])[],
  segments: number,
  refRow: number,
  color?: readonly [number, number, number],
  /** Face the axle instead: for a surface seen from inside. */
  inward = false,
): BufferGeometry {
  const rings = profile.map(([r, a]) => {
    const ring: number[] = [];
    for (let k = 0; k < segments; k++) {
      const phi = (k / segments) * Math.PI * 2;
      ring.push(a, r * Math.cos(phi), r * Math.sin(phi));
    }
    return ring;
  });
  const grid = makeGrid(
    rings,
    profile.map((p) => p[1]),
    true,
    { row: refRow, col: 0, axis: 1 },
  );
  if (inward) for (let k = 0; k < grid.nor.length; k++) grid.nor[k] = -grid.nor[k];
  return gridGeometry(grid, { color });
}
