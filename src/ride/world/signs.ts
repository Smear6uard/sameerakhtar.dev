// Neon along the avenue: blade signs that stand out from the buildings and
// a few wide ones over the pavement. Every sign is drawn into one texture
// and built into one mesh, so the whole street's signage is a single draw.

import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Float32BufferAttribute,
  Group,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshBasicMaterial,
  SRGBColorSpace,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const DISPLAY = '"Big Shoulders Display", "Arial Narrow", sans-serif';

const CORAL = "#ff5a47";
const PERI = "#8b9cff";
const AMBER = "#ffb24d";
const MINT = "#58e0a0";
const ROSE = "#ff5fa2";
const BONE = "#fff1dc";

interface Sign {
  text: string;
  color: string;
  /** Which kerb: 1 right, -1 left. */
  side: 1 | -1;
  z: number;
  /** Height of the bottom edge. */
  y: number;
  /** Stacked letters on a blade, or one line across. */
  blade: boolean;
}

// Clear of the set pieces and of the kerbs the camera works from.
const SIGNS: Sign[] = [
  { text: "HOTEL", color: CORAL, side: 1, z: 232, y: 7.5, blade: true },
  { text: "JAZZ", color: PERI, side: -1, z: 168, y: 6.4, blade: true },
  { text: "DINER", color: AMBER, side: 1, z: 92, y: 6.2, blade: true },
  { text: "BLUES", color: PERI, side: -1, z: 12, y: 7.2, blade: true },
  { text: "OPEN LATE", color: MINT, side: 1, z: -72, y: 5.5, blade: false },
  { text: "PIZZA", color: CORAL, side: -1, z: -150, y: 6.6, blade: true },
  { text: "RECORDS", color: ROSE, side: 1, z: -228, y: 5.5, blade: false },
  { text: "DEPAUL", color: PERI, side: -1, z: -392, y: 7.0, blade: true },
  { text: "PARK", color: BONE, side: 1, z: -428, y: 6.4, blade: true },
  { text: "TAXI", color: AMBER, side: -1, z: -548, y: 6.0, blade: true },
  { text: "CAFE", color: MINT, side: 1, z: -590, y: 6.8, blade: true },
  { text: "TAILOR", color: BONE, side: -1, z: -812, y: 6.6, blade: true },
  { text: "BOOKS", color: AMBER, side: 1, z: -828, y: 6.2, blade: true },
  { text: "DEEP DISH", color: CORAL, side: -1, z: -1068, y: 5.5, blade: false },
  { text: "LOOP", color: ROSE, side: 1, z: -1050, y: 6.8, blade: true },
  { text: "PIER", color: PERI, side: -1, z: -1140, y: 7.0, blade: true },
];

const ATLAS = 2048;
const BLADE_CELL = { w: 148, h: 1000 };
const WIDE_CELL = { w: 660, h: 230 };

function drawAtlas() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = ATLAS;
  const ctx = canvas.getContext("2d");
  const cells: { x: number; y: number; w: number; h: number }[] = [];
  let blades = 0;
  let wides = 0;
  for (const sign of SIGNS) {
    const cell = sign.blade
      ? { x: 8 + blades++ * (BLADE_CELL.w + 8), y: 8, ...BLADE_CELL }
      : {
          x: 8 + (wides % 3) * (WIDE_CELL.w + 8),
          y: 1040 + Math.floor(wides++ / 3) * 250,
          ...WIDE_CELL,
        };
    cells.push(cell);
    if (!ctx) continue;
    ctx.save();
    ctx.translate(cell.x, cell.y);
    ctx.fillStyle = "#07050a";
    ctx.fillRect(0, 0, cell.w, cell.h);
    // Tube border.
    ctx.strokeStyle = sign.color;
    ctx.lineWidth = 5;
    ctx.shadowColor = sign.color;
    ctx.shadowBlur = 18;
    ctx.strokeRect(12, 12, cell.w - 24, cell.h - 24);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const rows = sign.blade ? sign.text.split("") : [sign.text];
    const size = sign.blade ? Math.min(150, (cell.h - 80) / rows.length / 0.96) : 150;
    const lh = size * 0.96;
    ctx.font = `900 ${Math.round(size)}px ${DISPLAY}`;
    if (!sign.blade && "letterSpacing" in ctx) {
      (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "8px";
    }
    const top = cell.h / 2 - (lh * (rows.length - 1)) / 2 + size * 0.04;
    // Glow first, then a hot core, the way a neon tube photographs.
    for (const pass of [0, 1]) {
      ctx.shadowBlur = pass === 0 ? 30 : 0;
      ctx.fillStyle = pass === 0 ? sign.color : "#ffffff";
      ctx.globalAlpha = pass === 0 ? 1 : 0.55;
      rows.forEach((row, i) => ctx.fillText(row, cell.w / 2, top + i * lh, cell.w - 44));
    }
    ctx.restore();
  }
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.magFilter = LinearFilter;
  tex.anisotropy = 4;
  return { tex, cells };
}

export function createSigns(): Group {
  const group = new Group();
  const { tex, cells } = drawAtlas();
  const pos: number[] = [];
  const uv: number[] = [];
  const hardware: BufferGeometry[] = [];

  /** A lit face: corners a (bottom left), b (bottom right), then up by `h`. */
  const face = (
    cell: (typeof cells)[number],
    ax: number,
    az: number,
    bx: number,
    bz: number,
    y: number,
    h: number,
  ) => {
    const u0 = cell.x / ATLAS;
    const u1 = (cell.x + cell.w) / ATLAS;
    const v0 = 1 - (cell.y + cell.h) / ATLAS;
    const v1 = 1 - cell.y / ATLAS;
    pos.push(ax, y, az, bx, y, bz, bx, y + h, bz, ax, y, az, bx, y + h, bz, ax, y + h, az);
    uv.push(u0, v0, u1, v0, u1, v1, u0, v0, u1, v1, u0, v1);
  };

  SIGNS.forEach((sign, i) => {
    const cell = cells[i];
    const s = sign.side;
    if (sign.blade) {
      const h = 5.2;
      const w = (h * cell.w) / cell.h;
      const inner = s * 10.9;
      const outer = s * (10.9 - w);
      // One face for each direction of travel.
      face(
        cell,
        Math.min(inner, outer),
        sign.z + 0.09,
        Math.max(inner, outer),
        sign.z + 0.09,
        sign.y,
        h,
      );
      face(
        cell,
        Math.max(inner, outer),
        sign.z - 0.09,
        Math.min(inner, outer),
        sign.z - 0.09,
        sign.y,
        h,
      );
      hardware.push(
        new BoxGeometry(w + 0.06, h + 0.06, 0.16).translate(
          s * (10.9 - w / 2),
          sign.y + h / 2,
          sign.z,
        ),
      );
      for (const at of [0.8, h - 0.8]) {
        hardware.push(new BoxGeometry(3.4, 0.09, 0.09).translate(s * 12.6, sign.y + at, sign.z));
      }
      hardware.push(
        new BoxGeometry(0.14, sign.y + h, 0.14).translate(s * 11.05, (sign.y + h) / 2, sign.z),
      );
    } else {
      const w = 5.6;
      const h = (w * cell.h) / cell.w;
      const x = s * 10.7;
      // Facing the street.
      face(cell, x, sign.z - (s * w) / 2, x, sign.z + (s * w) / 2, sign.y, h);
      hardware.push(
        new BoxGeometry(0.2, h + 0.06, w + 0.06).translate(x + s * 0.11, sign.y + h / 2, sign.z),
      );
      for (const dz of [-w / 3, w / 3]) {
        hardware.push(
          new BoxGeometry(3.6, 0.09, 0.09).translate(s * 12.6, sign.y + h / 2, sign.z + dz),
        );
        hardware.push(
          new BoxGeometry(0.12, sign.y, 0.12).translate(s * 11.0, sign.y / 2, sign.z + dz),
        );
      }
    }
  });

  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  const lit = new MeshBasicMaterial({ map: tex });
  lit.color.setScalar(2.1); // above 1.0: the letters bloom
  const faces = new Mesh(geo, lit);
  faces.frustumCulled = false;
  const steel = new Mesh(mergeGeometries(hardware), new MeshBasicMaterial({ color: 0x08080b }));
  steel.frustumCulled = false;
  group.add(faces, steel);
  return group;
}
