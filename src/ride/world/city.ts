// The city: instanced box buildings on the street grid with a procedural
// window shader, plus two recognisable Chicago towers.

import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
} from "three";
import { BLOCK, BUILDING_LINE, WEST_Z } from "../route";
import { GLSL_FOG, GLSL_NOISE, GLSL_SKY, type SharedUniforms } from "../shared";

/** Lots that set pieces occupy: [x0, x1, z0, z1]. */
const RESERVED: [number, number, number, number][] = [
  [11, 44, -349, -291], // palette tower
  [-69, -11, -749, -691], // boutique
  [11, 40, -989, -931], // theatre
  [-40, 40, -1309, -1171], // billboards
  [171, 229, -349, -291], // Willis
  [-149, -91, -1149, -1091], // Hancock
];

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Box {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  y?: number;
  seed: number;
}

function reserved(x0: number, x1: number, z0: number, z1: number) {
  return RESERVED.some(([rx0, rx1, rz0, rz1]) => x0 < rx1 && x1 > rx0 && z0 < rz1 && z1 > rz0);
}

function heightAt(x: number, z: number, r1: number, r2: number, r3: number) {
  if (z > 40) {
    // West of the pick-up: low, so the sunset stays open, with a few spires.
    return 12 + 30 * r1 + (r2 > 0.88 ? 50 + 90 * r3 : 0);
  }
  const core = Math.exp(-Math.pow((z + 300) / 190, 2)) * Math.exp(-Math.pow(x / 300, 2));
  const lake = Math.exp(-Math.pow((z + 1180) / 150, 2));
  // Keep the Renaro stretch lower: the camera looks straight down there.
  const aerial = Math.exp(-Math.pow((z + 480) / 150, 2));
  let h = 16 + 34 * r1 + core * (30 + 170 * r2 * r2) + lake * (14 + 110 * r3 * r3);
  h = h * (1 - 0.45 * aerial) + (r2 > 0.93 ? 40 * (1 - aerial) : 0);
  return h;
}

function layout(): Box[] {
  const rand = mulberry(20270601);
  const boxes: Box[] = [];
  const inner0 = BUILDING_LINE;
  const inner1 = BLOCK - BUILDING_LINE;
  for (let kx = -6; kx <= 5; kx++) {
    for (let j = -17; j <= Math.floor((WEST_Z - 51) / BLOCK); j++) {
      const bx = kx * BLOCK;
      const bz = 40 + j * BLOCK;
      const slabs = rand() < 0.28;
      const cols = 2;
      const rows = slabs ? 1 : 2;
      for (let cx = 0; cx < cols; cx++) {
        for (let cr = 0; cr < rows; cr++) {
          const lotW = (inner1 - inner0) / cols;
          const lotD = (inner1 - inner0) / rows;
          const x0 = bx + inner0 + cx * lotW;
          const z0 = bz + inner0 + cr * lotD;
          const r1 = rand();
          const r2 = rand();
          const r3 = rand();
          const r4 = rand();
          if (reserved(x0, x0 + lotW, z0, z0 + lotD)) continue;
          if (r4 < 0.035) continue; // the odd empty lot
          const inset = 0.6 + r4 * 2.2;
          const w = lotW - inset * 2;
          const d = lotD - inset * 2;
          const cxm = x0 + lotW / 2;
          const czm = z0 + lotD / 2;
          const h = heightAt(cxm, czm, r1, r2, r3);
          boxes.push({ x: cxm, z: czm, w, d, h, seed: rand() * 100 });
          // Taller buildings get a setback crown.
          if (h > 70 && r3 > 0.35) {
            boxes.push({
              x: cxm + (r1 - 0.5) * 4,
              z: czm + (r2 - 0.5) * 4,
              w: w * 0.62,
              d: d * 0.62,
              h: h * (0.18 + 0.2 * r4),
              y: h,
              seed: rand() * 100,
            });
          }
        }
      }
    }
  }
  // Backing buildings behind the set pieces.
  boxes.push({ x: -55, z: -720, w: 26, d: 56, h: 64, seed: 7.3 });
  boxes.push({ x: 26, z: -960, w: 28, d: 56, h: 27, seed: 3.1 });
  // Willis: three stepped tiers.
  boxes.push({ x: 200, z: -320, w: 54, d: 54, h: 150, seed: 91.2 });
  boxes.push({ x: 196, z: -324, w: 40, d: 40, h: 90, y: 150, seed: 91.2 });
  boxes.push({ x: 192, z: -328, w: 27, d: 27, h: 70, y: 240, seed: 91.2 });
  return boxes;
}

const vertexShader = /* glsl */ `
  attribute float aSeed;
  uniform float uTaper;
  varying vec3 vWorld;
  varying vec3 vN;
  varying vec2 vFace;
  varying float vSeed;
  varying float vTop;
  varying vec3 vLp;
  varying vec3 vSz;
  void main() {
    #ifdef USE_INSTANCING
      mat4 im = instanceMatrix;
      vSeed = aSeed;
    #else
      mat4 im = mat4(1.0);
      vSeed = 57.7;
    #endif
    vec3 size = vec3(length(im[0].xyz), length(im[1].xyz), length(im[2].xyz));
    #ifndef USE_INSTANCING
      size = vec3(1.0);
    #endif
    vec3 lp = position * size;
    vLp = lp;
    vSz = size;
    vN = normal;
    vFace = abs(normal.x) > 0.5 ? vec2(lp.z, lp.y) : vec2(lp.x, lp.y);
    #ifndef USE_INSTANCING
      vFace = vec2(atan(position.x, position.z) * 14.0, position.y);
      vN = normalize(vec3(normal.x, 0.0, normal.z));
    #endif
    vTop = size.y - lp.y;
    #ifndef USE_INSTANCING
      vTop = uTaper - position.y;
    #endif
    vec4 wp = modelMatrix * im * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorld;
  varying vec3 vN;
  varying vec2 vFace;
  varying float vSeed;
  varying float vTop;
  varying vec3 vLp;
  varying vec3 vSz;
  ${GLSL_NOISE}
  ${GLSL_SKY}
  ${GLSL_FOG}

  void main() {
    vec3 N = normalize(vN);
    vec3 V = normalize(cameraPosition - vWorld);
    vec3 col;
    float glow = 0.0;

    if (N.y > 0.5) {
      // Roof: tar, a parapet line and a little rooftop plant.
      vec2 inset = vSz.xz * 0.5 - abs(vLp.xz);
      float edge = min(inset.x, inset.y);
      float parapet = 1.0 - smoothstep(0.45, 0.8, edge);
      float plant = step(0.84, hash21(floor(vLp.xz / 4.0) + vSeed)) * step(3.5, edge);
      col = mix(vec3(0.006, 0.007, 0.011), vec3(0.028, 0.028, 0.036), parapet) + plant * vec3(0.016);
      col += skyBase(vec3(0.0, 1.0, 0.0)) * 0.05;
    } else {
      float s1 = hash11(vSeed);
      float s2 = hash11(vSeed + 4.7);
      float s3 = hash11(vSeed + 9.1);
      // 0 punched masonry, 1 curtain wall, 2 ribbon windows
      float style = floor(s3 * 3.0);
      vec2 cell = vec2(mix(1.5, 2.6, s1), mix(3.3, 3.9, s2));
      vec2 g = vFace / cell;
      vec2 id = floor(g);
      vec2 f = fract(g);
      float aa = clamp(1.0 - length(fwidth(g)) * 0.9, 0.0, 1.0);

      vec2 lo = style < 0.5 ? vec2(0.24, 0.26) : style < 1.5 ? vec2(0.05, 0.06) : vec2(0.0, 0.36);
      vec2 hi = style < 0.5 ? vec2(0.76, 0.8) : style < 1.5 ? vec2(0.95, 0.9) : vec2(1.0, 0.82);
      float win = step(lo.x, f.x) * step(f.x, hi.x) * step(lo.y, f.y) * step(f.y, hi.y);
      float area = (hi.x - lo.x) * (hi.y - lo.y);

      // Lights come on a room at a time, and a room spans a few panes.
      vec2 room = vec2(floor(id.x / (1.0 + floor(s2 * 2.0))), id.y);
      float r = hash21(room + vSeed * 13.7);
      float litFrac = mix(0.09, 0.4, uNight) * (0.5 + s2);
      float floorLit = step(0.94, hash11(id.y * 3.1 + vSeed)) * step(0.3, uNight);
      float lit = max(step(1.0 - litFrac, r), floorLit);
      float bright = 0.12 + 0.8 * hash21(room * 1.7 + 3.3 + vSeed);

      vec3 warm = vec3(1.0, 0.64, 0.36);
      vec3 cool = vec3(0.42, 0.62, 1.0);
      vec3 wc = mix(warm, cool, step(0.64, hash21(room.yx + vSeed * 3.0)));

      // Facade: brick, limestone or dark steel, lit only by the sky it faces.
      vec3 tone = s1 < 0.34 ? vec3(0.034, 0.017, 0.013) : s1 < 0.67 ? vec3(0.05, 0.046, 0.042) : vec3(0.011, 0.013, 0.019);
      vec3 ambient = skyBase(normalize(N + vec3(0.0, 0.35, 0.0)));
      vec3 wall = tone * (0.35 + ambient * 2.6);
      wall *= 0.82 + 0.18 * step(0.5, fract(id.x * 0.25 + s2)); // piers
      vec3 Rv = reflect(-V, N);
      float fres = pow(clamp(1.0 - dot(V, N), 0.0, 1.0), 3.0);
      float blind = 0.55 + 0.45 * hash21(id + 7.7 + vSeed);
      vec3 glass = skyBase(Rv) * (0.05 + 0.3 * fres) * blind + vec3(0.002);

      vec3 near = mix(wall, glass, win);
      // Brighter near the ceiling, with the odd blind half drawn.
      float inside = (0.55 + 0.45 * f.y) * mix(1.0, 0.45, step(0.7, hash21(id + 1.9)) * step(f.y, 0.55));
      // Frame and meeting rail, so a lit window is not one flat panel.
      vec2 wl = (f - lo) / (hi - lo);
      float frame = step(0.04, wl.x) * step(wl.x, 0.96) * step(0.03, wl.y) * step(wl.y, 0.97);
      frame *= mix(1.0, step(0.018, abs(wl.y - 0.52)), step(style, 0.5));
      vec3 emitNear = wc * bright * lit * win * inside * mix(0.25, 1.0, frame);
      // Far away the grid dissolves into its average so it does not shimmer.
      vec3 far = mix(wall, glass * 0.8, area);
      vec3 emitFar = mix(warm, cool, 0.4) * litFrac * area * 1.25;
      col = mix(far, near, aa);
      vec3 emit = mix(emitFar, emitNear, aa);

      // Street level: shop bays, some shut, each with a sign above the glass.
      float street = 1.0 - smoothstep(4.6, 4.9, vFace.y);
      float bay = floor(vFace.x / 7.0);
      float bx = fract(vFace.x / 7.0);
      float shop = hash21(vec2(bay, vSeed));
      float glassBand = step(0.55, vFace.y) * step(vFace.y, 3.3);
      float pane = step(0.05, bx) * step(bx, 0.95) * step(0.045, fract(bx * 3.0));
      vec3 shopCol = mix(vec3(1.0, 0.64, 0.36), vec3(0.5, 0.68, 1.0), step(0.68, shop));
      float evening = smoothstep(0.05, 0.4, uNight + 0.15);
      vec3 shopEmit = shopCol * (0.08 + 0.42 * shop) * step(0.3, shop) * glassBand * pane
        * (0.45 + 0.55 * smoothstep(0.55, 3.3, vFace.y));
      float sign = step(3.6, vFace.y) * step(vFace.y, 4.25) * step(0.14, bx) * step(bx, 0.86) * step(0.6, shop);
      vec3 signCol = mix(vec3(1.0, 0.2, 0.12), vec3(0.3, 0.42, 1.0), step(0.5, hash11(bay + vSeed * 2.0)));
      signCol = mix(signCol, vec3(1.0, 0.8, 0.55), step(0.7, hash11(bay * 1.7 + vSeed)));
      shopEmit += signCol * sign * 0.75;
      col = mix(col, wall * 0.55 + glass * 0.5 * glassBand * pane, street);
      emit = mix(emit, shopEmit * evening, street);

      // A lit crown on some of the tall ones.
      float crown = (1.0 - smoothstep(2.0, 5.0, vTop)) * step(0.82, s2) * step(60.0, vFace.y + vTop);
      vec3 crownCol = mix(vec3(1.0, 0.2, 0.12), vec3(0.3, 0.4, 1.0), step(0.5, s1));
      emit += crownCol * crown * 2.2 * smoothstep(0.2, 0.6, uNight);

      col += emit;
      glow = 1.0;
    }

    col = applyFog(col, vWorld, mix(1.0, 0.86, glow));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function createCity(shared: SharedUniforms): Group {
  const group = new Group();
  const boxes = layout();

  const material = new ShaderMaterial({
    uniforms: {
      uTime: shared.uTime,
      uNight: shared.uNight,
      uFogDensity: shared.uFogDensity,
      uTaper: { value: 0 },
    },
    vertexShader,
    fragmentShader,
  });

  const geo = new BoxGeometry(1, 1, 1);
  geo.translate(0, 0.5, 0);
  const mesh = new InstancedMesh(geo, material, boxes.length);
  const seeds = new Float32Array(boxes.length);
  const m = new Matrix4();
  boxes.forEach((b, i) => {
    m.makeScale(b.w, b.h, b.d);
    m.setPosition(b.x, b.y ?? 0, b.z);
    mesh.setMatrixAt(i, m);
    seeds[i] = b.seed;
  });
  geo.setAttribute("aSeed", new InstancedBufferAttribute(seeds, 1));
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;
  group.add(mesh);

  // Hancock: a tapered shaft with twin masts.
  const taperMat = material.clone();
  taperMat.uniforms.uTime = shared.uTime;
  taperMat.uniforms.uNight = shared.uNight;
  taperMat.uniforms.uFogDensity = shared.uFogDensity;
  taperMat.uniforms.uTaper = { value: 250 };
  const shaft = new CylinderGeometry(21, 33, 250, 4, 1, true);
  shaft.rotateY(Math.PI / 4);
  shaft.translate(0, 125, 0);
  const hancock = new Mesh(shaft, taperMat);
  hancock.position.set(-120, 0, -1120);
  group.add(hancock);
  const cap = new Mesh(new BoxGeometry(29, 3, 29), new MeshBasicMaterial({ color: 0x030305 }));
  cap.position.set(-120, 250, -1120);
  group.add(cap);

  // Masts and aviation lights.
  const mastMat = new MeshBasicMaterial({ color: 0x0c0d12 });
  const beacon = new MeshBasicMaterial({ color: 0xffffff });
  beacon.color.setRGB(5, 0.35, 0.25);
  const masts: [number, number, number, number][] = [
    [-127, 250, -1120, 96],
    [-113, 250, -1120, 96],
    [188, 310, -332, 82],
    [197, 310, -324, 82],
  ];
  for (const [x, y, z, h] of masts) {
    const mast = new Mesh(new CylinderGeometry(0.5, 1.1, h, 6), mastMat);
    mast.position.set(x, y + h / 2, z);
    group.add(mast);
    const light = new Mesh(new BoxGeometry(1.6, 1.6, 1.6), beacon);
    light.position.set(x, y + h, z);
    group.add(light);
  }

  return group;
}
