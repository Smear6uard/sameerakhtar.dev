// Everyday cars for traffic and the kerb. One low-detail saloon, cut from
// the same profiles as the limousine with the wheelbase shortened, merged
// into a single geometry so a street full of them is one draw call.

import { BoxGeometry, CylinderGeometry, type BufferGeometry } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { CAR, buildShell, capGeometry, constantColor, gridGeometry, isGlass } from "./carShell";

type Rgb = readonly [number, number, number];

// Stations of the limousine and where they land on the shorter car. The two
// spans around the axles keep their length, so the arches stay round.
const FROM = [-3.05, -2.3, -1.3, 1.4, 2.4, 2.8];
const TO = [-2.365, -1.745, -0.745, 1.005, 2.005, 2.365];

function shorten(s: number) {
  let i = 0;
  while (i < FROM.length - 2 && s > FROM[i + 1]) i++;
  const t = (s - FROM[i]) / (FROM[i + 1] - FROM[i]);
  return TO[i] + (TO[i + 1] - TO[i]) * t;
}

export const SALOON = {
  front: TO[TO.length - 1],
  rear: TO[0],
  axleFront: shorten(CAR.axleFront),
  axleRear: shorten(CAR.axleRear),
} as const;

// Vertex colours. Paint is white so the instance colour tints only the body.
const PAINT: Rgb = [1, 1, 1];
const GLASS: Rgb = [0.02, 0.024, 0.032];
const TYRE: Rgb = [0.012, 0.012, 0.013];
const RIM: Rgb = [0.2, 0.2, 0.21];
const WELL: Rgb = [0.004, 0.004, 0.005];

function tinted(geo: BufferGeometry, color: Rgb, x = 0, y = 0, z = 0) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  for (const name of Object.keys(g.attributes)) {
    if (name !== "position" && name !== "normal") g.deleteAttribute(name);
  }
  g.translate(x, y, z);
  g.setAttribute("color", constantColor(g.getAttribute("position").count, color));
  return g;
}

export interface SaloonGeometry {
  /** Bodywork, glass and wheels. */
  body: BufferGeometry;
  /** Head and tail lamps, vertex-coloured above 1.0 so they bloom. */
  lamps: BufferGeometry;
}

export function saloonGeometry(): SaloonGeometry {
  const shell = buildShell("low", shorten);
  const parts: BufferGeometry[] = [
    tinted(gridGeometry(shell.body), PAINT),
    tinted(capGeometry(shell.body, 0), PAINT),
    tinted(capGeometry(shell.body, shell.body.rows - 1), PAINT),
    tinted(gridGeometry(shell.cabin, { pick: (i, j) => !isGlass(shell, i, j) }), PAINT),
    tinted(gridGeometry(shell.cabin, { pick: (i, j) => isGlass(shell, i, j) }), GLASS),
  ];
  for (const axle of [SALOON.axleFront, SALOON.axleRear]) {
    // The arches are cut out of the body; this is what shows through them.
    parts.push(tinted(new BoxGeometry(1.66, 0.62, 0.98), WELL, 0, 0.53, -axle));
    for (const side of [-1, 1]) {
      const tyre = new CylinderGeometry(CAR.wheelR, CAR.wheelR, 0.24, 12);
      tyre.rotateZ(Math.PI / 2);
      parts.push(tinted(tyre, TYRE, side * 0.845, CAR.wheelR, -axle));
      const rim = new CylinderGeometry(0.26, 0.26, 0.02, 10);
      rim.rotateZ(Math.PI / 2);
      parts.push(tinted(rim, RIM, side * 0.968, CAR.wheelR, -axle));
    }
  }

  const zf = -SALOON.front - 0.012;
  const zr = -SALOON.rear + 0.012;
  const lamps: BufferGeometry[] = [
    tinted(new BoxGeometry(0.56, 0.02, 0.04), [1.6, 0.07, 0.04], 0, 0.8, zr),
  ];
  for (const side of [-1, 1]) {
    lamps.push(tinted(new BoxGeometry(0.3, 0.07, 0.05), [6.5, 6.3, 5.6], side * 0.46, 0.67, zf));
    lamps.push(tinted(new BoxGeometry(0.34, 0.055, 0.05), [4.2, 0.18, 0.1], side * 0.46, 0.8, zr));
  }
  return { body: mergeGeometries(parts), lamps: mergeGeometries(lamps) };
}

/** Linear-RGB paint colours seen on the street, most common first. */
export const PAINTS: Rgb[] = [
  [0.012, 0.012, 0.014],
  [0.045, 0.047, 0.052],
  [0.3, 0.31, 0.33],
  [0.52, 0.52, 0.5],
  [0.012, 0.022, 0.07],
  [0.13, 0.012, 0.012],
  [0.03, 0.05, 0.04],
  [0.62, 0.38, 0.02],
];
