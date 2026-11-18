// The car: a long black limousine. The bodywork is lofted (see carShell),
// then dressed with glass you can see through, a lit cabin, alloy wheels and
// wrap-around light blades. It faces -Z.

import {
  AdditiveBlending,
  BackSide,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Path,
  PlaneGeometry,
  ShaderMaterial,
  Shape,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector3,
  type Material,
  type Texture,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { glowTexture, streakTexture } from "../shared";
import {
  CAR,
  buildShell,
  capGeometry,
  gridGeometry,
  isGlass,
  latheX,
  type Shell,
} from "./carShell";

export interface Car {
  group: Group;
  /** Advance wheel rotation by metres travelled. */
  roll(metres: number): void;
  setEnvMap(tex: Texture | null): void;
  /** 0..1 headlight beam visibility. */
  setBeams(v: number): void;
  /** 0..1, brake lights brighten when the car is slowing or stopped. */
  setBrake(v: number): void;
  /** Body attitude on its springs: radians nose-down, metres of lift. */
  setPose(pitch: number, heave: number): void;
  /** 0..1 brightness of the hazard flashers. */
  setHazard(v: number): void;
  /** Draw the number plate. Call once the display font has loaded. */
  dress(): void;
}

const { front: FRONT, rear: REAR, wheelR: R, arch: ARCH } = CAR;

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

const dummy = new Object3D();

/** Bake a transform into a geometry and make it mergeable. */
function prep(geo: BufferGeometry, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  for (const name of Object.keys(g.attributes)) {
    if (name !== "position" && name !== "normal") g.deleteAttribute(name);
  }
  dummy.position.set(x, y, z);
  dummy.rotation.set(rx, ry, rz);
  dummy.updateMatrix();
  g.applyMatrix4(dummy.matrix);
  return g;
}

/** Reflect a prepared geometry across the car's centreline. */
function mirrored(geo: BufferGeometry) {
  const g = geo.clone();
  g.scale(-1, 1, 1);
  for (const name of ["position", "normal"]) {
    const attr = g.getAttribute(name);
    const a = attr.array as Float32Array;
    for (let i = 0; i < attr.count; i += 3) {
      for (let c = 0; c < 3; c++) {
        const t = a[(i + 1) * 3 + c];
        a[(i + 1) * 3 + c] = a[(i + 2) * 3 + c];
        a[(i + 2) * 3 + c] = t;
      }
    }
  }
  return g;
}

function tube(points: Vector3[], radius: number, closed = false, radial = 6) {
  const curve = new CatmullRomCurve3(points, closed, "centripetal");
  return new TubeGeometry(curve, Math.max(12, points.length * 3), radius, radial, closed);
}

function roundedRect(shape: Shape | Path, w: number, h: number, r: number) {
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

/**
 * A line of points at height `y` that runs across one end of the car from
 * `xInner`, round the corner and back along the flank to station `sSide`.
 * This is what the light blades and chrome strips follow. Right-hand side.
 */
function wrapPath(
  shell: Shell,
  y: number,
  end: 1 | -1,
  xInner: number,
  sSide: number,
  lift: number,
): Vector3[] {
  const face = end > 0 ? FRONT : REAR;
  const depth = Math.abs(face - sSide);
  const raw: [number, number][] = [[xInner, face]];
  const xFace = shell.skinX(face, y);
  if (xFace - xInner > 0.12) raw.push([(xInner + xFace) / 2, face]);
  const n = 22;
  for (let k = 0; k <= n; k++) {
    const s = face - end * depth * Math.pow(k / n, 2.3);
    raw.push([shell.skinX(s, y), s]);
  }
  // Push the line off the skin along its normal in plan.
  return raw.map(([x, s], i) => {
    const a = raw[Math.max(0, i - 1)];
    const b = raw[Math.min(raw.length - 1, i + 1)];
    let nx = -(b[1] - a[1]) * end;
    let ns = (b[0] - a[0]) * end;
    const len = Math.hypot(nx, ns) || 1;
    nx /= len;
    ns /= len;
    if (i === 0) {
      nx = 0;
      ns = end;
    }
    return new Vector3(x + nx * lift, y, -(s + ns * lift));
  });
}

/** Mirror a right-hand path into one that crosses the whole car. */
function fullWidth(right: Vector3[]) {
  const left = right
    .slice(1)
    .reverse()
    .map((p) => new Vector3(-p.x, p.y, p.z));
  return [...left, new Vector3(0, right[0].y, right[0].z), ...right.slice(1)];
}

// ---------------------------------------------------------------------------
// Paint
// ---------------------------------------------------------------------------

/**
 * Cuts the wheel arches out of a body material, and for the hero car draws
 * the shut lines of the doors, bonnet and boot.
 */
export function patchBodywork(mat: Material, axleFront: number, axleRear: number, hero: boolean) {
  const f = (v: number) => v.toFixed(4);
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vCar;\nvarying vec3 vCarN;")
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvCar = position;\nvCarN = normal;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        /* glsl */ `#include <common>
        varying vec3 vCar;
        varying vec3 vCarN;
        float shutLine(float d, float w) {
          float aa = fwidth(d) * 0.75;
          return 1.0 - smoothstep(w - aa, w + aa, abs(d));
        }`,
      )
      .replace(
        "#include <clipping_planes_fragment>",
        /* glsl */ `#include <clipping_planes_fragment>
        {
          vec2 af = vCar.zy - vec2(${f(-axleFront)}, ${f(R)});
          vec2 ar = vCar.zy - vec2(${f(-axleRear)}, ${f(R)});
          if (min(dot(af, af), dot(ar, ar)) < ${f(ARCH * ARCH)}) discard;
        }`,
      );
    if (!hero) return;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      /* glsl */ `{
        float s = -vCar.z;
        float ax = abs(vCar.x);
        vec3 cn = normalize(vCarN);
        float side = smoothstep(0.5, 0.8, abs(cn.x)) * step(0.27, vCar.y);
        float top = smoothstep(0.5, 0.8, cn.y);
        float gap = side * (shutLine(s - 1.16, 0.0035) + shutLine(s + 0.14, 0.0035) + shutLine(s + 1.3, 0.0035));
        float hoodX = mix(0.84, 0.66, smoothstep(1.3, 2.62, s));
        gap += top * step(1.34, s) * step(s, 2.62) * shutLine(ax - hoodX, 0.003);
        gap += top * step(ax, hoodX) * shutLine(s - 2.62, 0.003);
        gap += top * step(-2.95, s) * step(s, -2.46) * shutLine(ax - 0.78, 0.003);
        gap += top * step(ax, 0.78) * shutLine(s + 2.46, 0.003);
        outgoingLight *= 1.0 - 0.92 * clamp(gap, 0.0, 1.0);
        // The floor of the cabin, seen through the glass.
        float bow = 1.0 - pow(min(1.0, ax / 0.875), 2.2);
        float cabin = top * step(ax, 0.868) * step(-2.2 - 0.15 * bow, s) * step(s, 1.02 + 0.26 * bow);
        outgoingLight *= 1.0 - 0.97 * cabin;
      }
      #include <opaque_fragment>`,
    );
  };
  mat.customProgramCacheKey = () => `ride-body-${hero}-${f(axleFront)}-${f(axleRear)}`;
}

/**
 * Polished metal under a point light returns a highlight hundreds of times
 * brighter than anything else in the frame, which the bloom turns into a
 * neon tube. This scales a material's direct highlights and rolls them off
 * below `cap`; reflections of the surroundings are untouched.
 */
export function tameHighlights(mat: Material, scale: number, cap: number, coatCap = 0) {
  const before = mat.onBeforeCompile;
  const key = mat.customProgramCacheKey();
  // Passed as a uniform, so materials that differ only in these numbers
  // still share one compiled program.
  const value = new Vector3(scale, cap, coatCap);
  mat.onBeforeCompile = (shader, renderer) => {
    before.call(mat, shader, renderer);
    shader.uniforms.uHighlight = { value };
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 uHighlight;")
      .replace(
        "#include <aomap_fragment>",
        /* glsl */ `{
          vec3 hl = reflectedLight.directSpecular * uHighlight.x;
          reflectedLight.directSpecular = hl / (1.0 + hl / uHighlight.y);
          #ifdef USE_CLEARCOAT
            if (uHighlight.z > 0.0) {
              clearcoatSpecularDirect /= 1.0 + clearcoatSpecularDirect / uHighlight.z;
            }
          #endif
        }
        #include <aomap_fragment>`,
      );
  };
  mat.customProgramCacheKey = () => `${key}|highlights`;
}

// ---------------------------------------------------------------------------
// Wheels
// ---------------------------------------------------------------------------

const TIRE: [number, number][] = [
  [0.285, -0.122],
  [0.302, -0.138],
  [0.336, -0.146],
  [0.368, -0.138],
  [0.384, -0.116],
  [0.39, -0.085],
  [0.39, 0.085],
  [0.384, 0.116],
  [0.368, 0.138],
  [0.336, 0.146],
  [0.302, 0.138],
  [0.285, 0.122],
];
const BARREL: [number, number][] = [
  [0.286, -0.124],
  [0.268, -0.1],
  [0.258, 0.04],
  [0.266, 0.1],
  [0.284, 0.126],
  [0.29, 0.134],
];

/** The turning part of a wheel: twin spokes, hub and polished lip. Faces +X. */
function wheelFace() {
  const parts: BufferGeometry[] = [];
  const r0 = 0.07;
  const r1 = 0.272;
  const spoke = new Shape();
  spoke.moveTo(-0.015, r0);
  spoke.lineTo(0.015, r0);
  spoke.lineTo(0.0105, r1);
  spoke.lineTo(-0.0105, r1);
  spoke.closePath();
  for (let i = 0; i < 5; i++) {
    for (const lean of [-0.115, 0.115]) {
      const g = new ExtrudeGeometry(spoke, {
        depth: 0.02,
        bevelEnabled: true,
        bevelThickness: 0.004,
        bevelSize: 0.004,
        bevelSegments: 1,
      });
      g.rotateY(Math.PI / 2); // depth along the axle
      g.translate(0, -r1, 0);
      g.rotateZ(-0.2); // dished: the hub sits deeper than the rim
      g.translate(0.102, r1, 0);
      g.rotateX((i / 5) * Math.PI * 2 + lean);
      parts.push(prep(g));
    }
  }
  const hub = new CylinderGeometry(0.082, 0.098, 0.05, 24);
  parts.push(prep(hub, 0.072, 0, 0, 0, 0, -Math.PI / 2));
  const cap = new CylinderGeometry(0.05, 0.058, 0.02, 24);
  parts.push(prep(cap, 0.104, 0, 0, 0, 0, -Math.PI / 2));
  const lip = new TorusGeometry(0.282, 0.009, 6, 44);
  parts.push(prep(lip, 0.128, 0, 0, 0, Math.PI / 2, 0));
  return mergeGeometries(parts);
}

// ---------------------------------------------------------------------------
// The car
// ---------------------------------------------------------------------------

export function createCar(): Car {
  const group = new Group();
  const body = new Group();
  group.add(body);
  const shell = buildShell("hero");

  // ---- materials ----
  const paint = new MeshPhysicalMaterial({
    color: new Color(0.004, 0.0045, 0.007),
    metalness: 0,
    roughness: 0.6,
    // Keeps the flank from washing out when the low sun glances along it.
    specularIntensity: 0.15,
    clearcoat: 1,
    clearcoatRoughness: 0.07,
    envMapIntensity: 0.9,
  });
  const bodyPaint = paint.clone();
  patchBodywork(bodyPaint, CAR.axleFront, CAR.axleRear, true);
  tameHighlights(paint, 1, 24, 7);
  tameHighlights(bodyPaint, 1, 24, 7);
  const glass = new MeshStandardMaterial({
    color: new Color(0.085, 0.095, 0.115),
    metalness: 1,
    roughness: 0.04,
    transparent: true,
    opacity: 0.7,
    envMapIntensity: 2.0,
  });
  const chrome = new MeshStandardMaterial({
    color: new Color(0.72, 0.72, 0.76),
    metalness: 1,
    roughness: 0.14,
    envMapIntensity: 1.25,
  });
  // Smoked chrome for the grille bars.
  const smoked = new MeshStandardMaterial({
    color: new Color(0.16, 0.16, 0.18),
    metalness: 1,
    roughness: 0.2,
    envMapIntensity: 1.0,
  });
  const alloy = new MeshStandardMaterial({
    color: new Color(0.6, 0.6, 0.63),
    metalness: 1,
    roughness: 0.24,
    envMapIntensity: 1.2,
  });
  const rimDark = new MeshStandardMaterial({
    color: new Color(0.03, 0.03, 0.034),
    metalness: 1,
    roughness: 0.34,
  });
  const rubber = new MeshStandardMaterial({
    color: new Color(0.008, 0.008, 0.009),
    roughness: 0.82,
    metalness: 0,
    envMapIntensity: 0.5,
  });
  const steel = new MeshStandardMaterial({
    color: new Color(0.16, 0.16, 0.17),
    metalness: 1,
    roughness: 0.42,
  });
  const caliper = new MeshStandardMaterial({
    color: new Color(0.86, 0.11, 0.06),
    roughness: 0.45,
    metalness: 0.1,
    emissive: new Color(0.1, 0.012, 0.006),
    envMapIntensity: 0.5,
  });
  const leather = new MeshStandardMaterial({
    color: new Color(0.16, 0.075, 0.04),
    roughness: 0.62,
    metalness: 0,
    emissive: new Color(0.016, 0.007, 0.0035),
    envMapIntensity: 0.3,
  });
  const trim = new MeshStandardMaterial({
    color: new Color(0.02, 0.02, 0.024),
    roughness: 0.5,
    metalness: 0,
    envMapIntensity: 0.3,
  });
  const dark = new MeshBasicMaterial({ color: 0x020203, side: DoubleSide });
  // Every opaque standard material goes through the same patch with the
  // same features switched on, so the whole set compiles to one program.
  const metals: [MeshStandardMaterial, number, number][] = [
    [chrome, 0.05, 1.7],
    [smoked, 0.05, 1],
    [alloy, 0.05, 1.4],
    [rimDark, 0.1, 1],
    [steel, 0.1, 1],
    [rubber, 1, 24],
    [caliper, 1, 24],
    [leather, 1, 24],
    [trim, 1, 24],
  ];
  for (const [mat, scale, cap] of metals) tameHighlights(mat, scale, cap);
  tameHighlights(glass, 0.3, 5);
  const envMaterials = [paint, bodyPaint, glass, ...metals.map((m) => m[0])];

  // Lights. Colours above 1.0 feed the bloom pass.
  const headMat = new MeshBasicMaterial();
  headMat.color.setRGB(3.0, 3.1, 3.6);
  const bladeMat = new MeshBasicMaterial();
  bladeMat.color.setRGB(1.7, 1.8, 2.15);
  const tailMat = new MeshBasicMaterial();
  const brakeMat = new MeshBasicMaterial();
  const amberMat = new MeshBasicMaterial();
  const grilleMat = new MeshBasicMaterial();
  grilleMat.color.setRGB(0.2, 0.23, 0.34);
  const screenMat = new MeshBasicMaterial();
  screenMat.color.setRGB(0.42, 0.52, 1.25);
  const ambientMat = new MeshBasicMaterial();
  ambientMat.color.setRGB(1.5, 0.3, 0.17);
  const plateMat = new MeshBasicMaterial({ color: 0xd9d5cc });

  // Everything that shares a material is merged into one mesh.
  const buckets = new Map<Material, BufferGeometry[]>();
  const add = (mat: Material, geo: BufferGeometry) => {
    const list = buckets.get(mat) ?? [];
    list.push(geo);
    buckets.set(mat, list);
  };
  const addPair = (mat: Material, geo: BufferGeometry) => {
    add(mat, geo);
    add(mat, mirrored(geo));
  };

  // ---- bodywork ----
  const hull = mergeGeometries([
    gridGeometry(shell.body),
    capGeometry(shell.body, 0),
    capGeometry(shell.body, shell.body.rows - 1),
  ]);
  body.add(new Mesh(hull, bodyPaint));

  const roof = gridGeometry(shell.cabin, { pick: (i, j) => !isGlass(shell, i, j) });
  add(paint, prep(roof));
  // The same panels from inside: without a headliner the roof vanishes
  // whenever the camera looks up through the glass.
  body.add(new Mesh(roof, new MeshBasicMaterial({ color: 0x040405, side: BackSide })));
  const glazing = new Mesh(
    gridGeometry(shell.cabin, { pick: (i, j) => isGlass(shell, i, j), inset: 0.006 }),
    glass,
  );
  body.add(glazing);

  // Chrome surround of the side windows.
  {
    const cab = shell.cabin;
    const at = (i: number, j: number) => {
      const o = (i * cab.cols + j) * 3;
      return new Vector3(cab.pos[o] + 0.003, cab.pos[o + 1] + 0.002, cab.pos[o + 2]);
    };
    const iRear = cab.s.findIndex((s) => Math.abs(s - CAR.cPillar) < 1e-6);
    const iFront = cab.s.findIndex((s) => Math.abs(s - 0.92) < 1e-6);
    const loop: Vector3[] = [];
    for (let i = iFront; i >= iRear; i--) loop.push(at(i, 0));
    for (let j = 1; j < shell.sideCols; j++) loop.push(at(iRear, j));
    for (let i = iRear; i <= iFront; i++) loop.push(at(i, shell.sideCols));
    addPair(chrome, prep(tube(loop, 0.0085, true, 5)));
  }

  // Wheel arches: a lip on the skin and a dark liner behind it.
  for (const axle of [CAR.axleFront, CAR.axleRear]) {
    const lip: Vector3[] = [];
    const liner: number[] = [];
    const normals: number[] = [];
    const steps = 30;
    const sweep = Math.PI + 0.84;
    let prev: [Vector3, Vector3] | null = null;
    for (let k = 0; k <= steps; k++) {
      const a = -0.42 + (sweep * k) / steps;
      const s = axle + ARCH * Math.cos(a);
      const y = R + ARCH * Math.sin(a);
      const x = shell.skinX(s, Math.max(y, 0.3));
      lip.push(new Vector3(x + 0.002, y, -s));
      const outer = new Vector3(x - 0.004, y, -s);
      const inner = new Vector3(0.5, y, -s);
      if (prev) {
        for (const p of [prev[0], prev[1], outer, prev[1], inner, outer]) {
          liner.push(p.x, p.y, p.z);
          normals.push(0, -Math.sin(a), Math.cos(a));
        }
      }
      prev = [outer, inner];
    }
    addPair(paint, prep(tube(lip, 0.012, false, 6)));
    const linerGeo = new BufferGeometry();
    linerGeo.setAttribute("position", new BufferAttribute(new Float32Array(liner), 3));
    linerGeo.setAttribute("normal", new BufferAttribute(new Float32Array(normals), 3));
    addPair(dark, linerGeo);
    addPair(dark, prep(new CircleGeometry(ARCH + 0.02, 28), 0.5, R, -axle, 0, Math.PI / 2, 0));
  }

  // ---- front ----
  const zf = -FRONT;
  {
    const frame = new Shape();
    roundedRect(frame, 0.86, 0.33, 0.045);
    const hole = new Path();
    roundedRect(hole, 0.79, 0.26, 0.028);
    frame.holes.push(hole);
    const surround = new ExtrudeGeometry(frame, {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005,
      bevelSegments: 2,
      curveSegments: 8,
    });
    add(chrome, prep(surround, 0, 0.615, zf - 0.03));
    add(grilleMat, prep(new PlaneGeometry(0.8, 0.27), 0, 0.615, zf - 0.004, 0, Math.PI, 0));
    for (let k = -6; k <= 6; k++) {
      add(smoked, prep(new BoxGeometry(0.017, 0.265, 0.02), k * 0.059, 0.615, zf - 0.016));
    }
    // Lower intake with a chrome blade across it.
    add(dark, prep(new BoxGeometry(0.98, 0.05, 0.012), 0, 0.405, zf - 0.004));
    add(chrome, prep(new BoxGeometry(0.98, 0.008, 0.012), 0, 0.405, zf - 0.012));

    // Lamp units: three LED projectors under a light blade that wraps the corner.
    addPair(dark, prep(new BoxGeometry(0.185, 0.062, 0.012), 0.548, 0.652, zf - 0.004));
    for (const x of [0.49, 0.548, 0.606]) {
      addPair(headMat, prep(new BoxGeometry(0.04, 0.036, 0.012), x, 0.652, zf - 0.012));
    }
    addPair(bladeMat, prep(tube(wrapPath(shell, 0.722, 1, 0.47, 2.36, 0.004), 0.0105)));
    addPair(amberMat, prep(tube(wrapPath(shell, 0.69, 1, 0.61, 2.52, 0.004), 0.008)));
    // A spear down the bonnet.
    const spear: Vector3[] = [];
    for (let s = 1.42; s <= 2.7; s += 0.16)
      spear.push(new Vector3(0, shell.deckY(s, 0) + 0.002, -s));
    add(chrome, prep(tube(spear, 0.006, false, 5)));
  }

  // ---- rear ----
  const zr = -REAR;
  {
    add(tailMat, prep(tube(fullWidth(wrapPath(shell, 0.802, -1, 0, -2.5, 0.004)), 0.013)));
    addPair(brakeMat, prep(tube(wrapPath(shell, 0.762, -1, 0.4, -2.62, 0.004), 0.009)));
    add(brakeMat, prep(new BoxGeometry(0.46, 0.012, 0.014), 0, shell.roofY(-1.6) - 0.05, 1.6));
    add(chrome, prep(new BoxGeometry(0.94, 0.012, 0.012), 0, 0.705, zr + 0.008));
    add(dark, prep(new BoxGeometry(0.4, 0.2, 0.012), 0, 0.585, zr + 0.003));
    add(dark, prep(new BoxGeometry(0.96, 0.06, 0.012), 0, 0.435, zr + 0.003));
    addPair(amberMat, prep(new BoxGeometry(0.11, 0.016, 0.012), 0.52, 0.47, zr + 0.009));
    const plate = new Mesh(new PlaneGeometry(0.31, 0.155), plateMat);
    plate.position.set(0, 0.585, zr + 0.012);
    body.add(plate);
  }

  // ---- flanks ----
  {
    const rocker: Vector3[] = [];
    for (let s = -1.28; s <= 1.38; s += 0.19) {
      rocker.push(new Vector3(shell.skinX(s, 0.3) + 0.003, 0.3, -s));
    }
    addPair(chrome, prep(tube(rocker, 0.008, false, 5)));
    for (const s of [0.3, -0.96]) {
      const x = shell.skinX(s, 0.9) + 0.004;
      addPair(chrome, prep(new RoundedBoxGeometry(0.016, 0.022, 0.2, 2, 0.007), x, 0.9, -s));
    }
    addPair(
      chrome,
      prep(new BoxGeometry(0.012, 0.13, 0.026), shell.skinX(1.3, 0.63) + 0.003, 0.63, -1.3),
    );
    // Door mirrors.
    const mx = shell.cabinBaseX(0.88) + 0.15;
    const pod = new SphereGeometry(1, 18, 12);
    pod.scale(0.105, 0.062, 0.075);
    addPair(paint, prep(pod, mx, 1.085, -0.88));
    addPair(paint, prep(new BoxGeometry(0.15, 0.02, 0.05), mx - 0.09, 1.05, -0.86));
    addPair(amberMat, prep(new BoxGeometry(0.07, 0.008, 0.01), mx + 0.02, 1.085, -0.957));
    // Aerial fin.
    const fin = new SphereGeometry(1, 12, 8);
    fin.scale(0.022, 0.05, 0.11);
    add(paint, prep(fin, 0, shell.roofY(-1.36) - 0.004, 1.36));
  }

  // ---- cabin ----
  {
    const seat = (x: number, s: number, w: number) => {
      add(leather, prep(new RoundedBoxGeometry(w, 0.36, 0.11, 3, 0.045), x, 1.07, -s, 0.2));
      add(
        leather,
        prep(new RoundedBoxGeometry(0.22, 0.15, 0.085, 3, 0.035), x, 1.32, -s + 0.07, 0.1),
      );
    };
    seat(-0.4, 0, 0.46);
    seat(0.4, 0, 0.46);
    seat(-0.43, -1.36, 0.5);
    seat(0.43, -1.36, 0.5);
    add(leather, prep(new RoundedBoxGeometry(0.3, 0.3, 0.11, 3, 0.045), 0, 1.04, 1.36, 0.2));
    add(trim, prep(new RoundedBoxGeometry(1.6, 0.1, 0.46, 3, 0.04), 0, 1.0, -0.98));
    add(trim, prep(new TorusGeometry(0.17, 0.016, 8, 28), -0.4, 1.07, -0.6, -0.36));
    add(screenMat, prep(new PlaneGeometry(0.92, 0.07), 0.06, 1.078, -0.775, -0.3));
    addPair(ambientMat, prep(new BoxGeometry(0.008, 0.008, 2.7), 0.84, 1.014, 0.42));
  }

  // ---- wheels ----
  const spinners: { mesh: Mesh; dir: number }[] = [];
  {
    const face = wheelFace();
    const tire = prep(latheX(TIRE, 40, 5));
    // The barrel is seen from inside, through the spokes.
    const barrel = prep(latheX(BARREL, 36, 2, undefined, true));
    const disc = prep(new CylinderGeometry(0.215, 0.215, 0.03, 32), 0.02, 0, 0, 0, 0, -Math.PI / 2);
    for (const axle of [CAR.axleFront, CAR.axleRear]) {
      const place = (g: BufferGeometry) => g.clone().translate(CAR.track, R, -axle);
      addPair(rubber, place(tire));
      addPair(rimDark, place(barrel));
      addPair(steel, place(disc));
      const grip = new BoxGeometry(0.066, 0.085, 0.2);
      grip.translate(0, 0.186, 0);
      grip.rotateX(axle > 0 ? 0.95 : -0.95);
      addPair(caliper, prep(grip, CAR.track + 0.04, R, -axle));
      for (const side of [1, -1]) {
        const mesh = new Mesh(face, alloy);
        const mount = new Group();
        mount.position.set(side * CAR.track, R, -axle);
        if (side < 0) mount.rotation.y = Math.PI;
        mount.add(mesh);
        group.add(mount);
        spinners.push({ mesh, dir: side });
      }
    }
  }

  // Wheels stay on the road; everything else rides on the springs.
  const unsprung = new Set<Material>([rubber, rimDark, steel, caliper]);
  for (const [mat, list] of buckets) {
    const mesh = new Mesh(mergeGeometries(list), mat);
    (unsprung.has(mat) ? group : body).add(mesh);
  }

  // Headlight beams: soft additive cones that read as light in wet air.
  const beamMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    blending: AdditiveBlending,
    uniforms: { uStrength: { value: 0 } },
    vertexShader: /* glsl */ `
      varying float vAlong;
      varying vec3 vN;
      varying vec3 vView;
      void main() {
        vAlong = uv.y;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uStrength;
      varying float vAlong;
      varying vec3 vN;
      varying vec3 vView;
      void main() {
        float edge = pow(abs(dot(normalize(vN), normalize(vView))), 1.6);
        float fall = pow(max(vAlong, 0.0), 2.2);
        gl_FragColor = vec4(vec3(1.0, 0.95, 0.86) * fall * edge * uStrength * 0.06, 1.0);
      }
    `,
  });
  const beamLen = 26;
  const beamGeo = new ConeGeometry(3.4, beamLen, 24, 1, true);
  beamGeo.translate(0, -beamLen / 2, 0); // apex at the origin
  beamGeo.rotateX(Math.PI / 2 - 0.035); // open toward -Z, tipped slightly down
  for (const side of [-1, 1]) {
    const beam = new Mesh(beamGeo, beamMat);
    beam.position.set(side * 0.548, 0.652, zf - 0.05);
    beam.renderOrder = 5;
    body.add(beam);
  }

  // Glows are sprites rather than bloom, so the tail lights stay red
  // instead of tone-mapping toward white.
  const halo = (
    map: Texture,
    color: [number, number, number],
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
  ) => {
    const mat = new SpriteMaterial({
      map,
      blending: AdditiveBlending,
      depthWrite: false,
      transparent: true,
      fog: false,
    });
    mat.color.setRGB(...color);
    const sprite = new Sprite(mat);
    sprite.position.set(x, y, z);
    sprite.scale.set(w, h, 1);
    body.add(sprite);
    return mat;
  };
  const tailGlows = [
    halo(glowTexture(), [1, 0.04, 0.02], -0.72, 0.8, zr + 0.1, 1.1, 0.8),
    halo(glowTexture(), [1, 0.04, 0.02], 0.72, 0.8, zr + 0.1, 1.1, 0.8),
    halo(streakTexture(), [1, 0.05, 0.03], 0, 0.8, zr + 0.12, 4.6, 0.5),
  ];
  const headGlows = [
    halo(glowTexture(), [0.5, 0.54, 0.66], -0.55, 0.66, zf - 0.1, 0.8, 0.58),
    halo(glowTexture(), [0.5, 0.54, 0.66], 0.55, 0.66, zf - 0.1, 0.8, 0.58),
    halo(streakTexture(), [0.42, 0.5, 0.75], -0.55, 0.66, zf - 0.12, 3.2, 0.3),
    halo(streakTexture(), [0.42, 0.5, 0.75], 0.55, 0.66, zf - 0.12, 3.2, 0.3),
  ];
  const amberGlows = [
    halo(glowTexture(), [1, 0.42, 0.04], -0.78, 0.69, zf + 0.12, 0.7, 0.5),
    halo(glowTexture(), [1, 0.42, 0.04], 0.78, 0.69, zf + 0.12, 0.7, 0.5),
    halo(glowTexture(), [1, 0.42, 0.04], -0.52, 0.47, zr + 0.06, 0.6, 0.45),
    halo(glowTexture(), [1, 0.42, 0.04], 0.52, 0.47, zr + 0.06, 0.6, 0.45),
  ];

  let brake = 0;
  const applyTail = () => {
    tailMat.color.setRGB(1.5 + brake * 0.5, 0.035, 0.02);
    brakeMat.color.setRGB(0.16 + brake * 2.3, 0.008 + brake * 0.04, 0.005 + brake * 0.02);
    tailGlows.forEach((g, i) => (g.opacity = (i === 2 ? 0.5 : 0.42) + brake * 0.3));
  };
  applyTail();
  const applyHazard = (v: number) => {
    amberMat.color.setRGB(0.05 + 3.2 * v, 0.02 + 1.25 * v, 0.004 + 0.1 * v);
    for (const g of amberGlows) g.opacity = 0.7 * v;
  };
  applyHazard(0);

  let dressed = false;

  return {
    group,
    roll(metres) {
      const a = metres / R;
      for (const w of spinners) w.mesh.rotation.x -= a * w.dir;
    },
    setEnvMap(tex) {
      for (const m of envMaterials) {
        (m as MeshStandardMaterial).envMap = tex;
        m.needsUpdate = true;
      }
    },
    setBeams(v) {
      beamMat.uniforms.uStrength.value = v;
      for (const g of headGlows) g.opacity = 0.22 + 0.78 * v;
    },
    setBrake(v) {
      if (v === brake) return;
      brake = v;
      applyTail();
    },
    setPose(pitch, heave) {
      body.rotation.x = -pitch;
      body.position.y = heave;
    },
    setHazard: applyHazard,
    dress() {
      if (dressed) return;
      dressed = true;
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 256;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ece8df";
      ctx.fillRect(0, 0, 512, 256);
      ctx.strokeStyle = "#1c2a5a";
      ctx.lineWidth = 6;
      ctx.strokeRect(9, 9, 494, 238);
      ctx.fillStyle = "#1c2a5a";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = '800 40px "Big Shoulders Display", "Arial Narrow", sans-serif';
      ctx.fillText("ILLINOIS", 256, 44);
      ctx.font = '900 150px "Big Shoulders Display", "Arial Narrow", sans-serif';
      ctx.fillText("SAMEER", 256, 146);
      ctx.fillStyle = "#b3261e";
      ctx.font = '800 26px "Big Shoulders Display", "Arial Narrow", sans-serif';
      ctx.fillText("CHICAGO  ·  2027", 256, 226);
      const tex = new CanvasTexture(c);
      tex.colorSpace = SRGBColorSpace;
      tex.anisotropy = 4;
      plateMat.map = tex;
      plateMat.color.setScalar(0.85);
      plateMat.needsUpdate = true;
    },
  };
}
