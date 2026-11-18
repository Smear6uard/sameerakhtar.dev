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

  const vec3 SUN = vec3(0.0599, 0.0349, 0.9976);

  // Interior mapping: a window is a box of room behind the glass, found by
  // following the eye ray to whichever wall it reaches first. p is where
  // the ray enters (0..1 across and up), d the ray in the same units with
  // z running into the room. Returns the wall hit: xyz position, w = kind
  // (0 back wall, 1 side wall, 2 ceiling, 3 floor).
  vec4 roomHit(vec2 p, vec3 d) {
    vec2 inv = 1.0 / (d.xy + sign(d.xy) * 1e-4 + 1e-5);
    vec2 tw = (step(0.0, d.xy) - p) * inv;
    float tz = 1.0 / max(d.z, 1e-4);
    float t = min(min(tw.x, tw.y), tz);
    vec3 h = vec3(p, 0.0) + d * t;
    float kind = t == tz ? 0.0 : tw.x < tw.y ? 1.0 : d.y > 0.0 ? 2.0 : 3.0;
    return vec4(h, kind);
  }

  vec3 hue(float t) {
    return 0.5 + 0.5 * cos(6.2831853 * (t + vec3(0.0, 0.33, 0.67)));
  }

  // Darkens the corners of a room, which is most of what makes it read as a box.
  float cornerShade(vec2 e) {
    vec2 ed = min(e, 1.0 - e);
    return 0.4 + 0.6 * smoothstep(0.0, 0.2, min(ed.x, ed.y));
  }

  // A flat or an office: painted walls lit by one ceiling lamp, some furniture.
  vec3 roomShade(vec2 p, vec3 d, float seed) {
    vec4 hit = roomHit(p, d);
    vec3 h = hit.xyz;
    vec3 paint = mix(vec3(0.72), hue(seed), 0.28);
    vec3 c;
    vec2 e;
    if (hit.w < 0.5) {
      c = paint;
      e = h.xy;
      float at = fract(seed * 7.13);
      float furniture = step(abs(h.x - 0.25 - 0.5 * at), 0.16 + 0.1 * fract(seed * 3.7))
        * step(h.y, 0.3 + 0.22 * fract(seed * 5.3));
      c *= 1.0 - 0.72 * furniture;
      float picture = step(abs(h.x - 0.74 + 0.45 * at), 0.09) * step(abs(h.y - 0.62), 0.1)
        * step(0.45, fract(seed * 11.1));
      c = mix(c, paint.zxy * 0.45, picture);
    } else if (hit.w < 1.5) {
      c = paint * 0.85;
      e = h.zy;
      float door = step(abs(h.z - 0.55), 0.14) * step(h.y, 0.68) * step(0.5, fract(seed * 13.3));
      c *= 1.0 - 0.5 * door;
    } else if (hit.w < 2.5) {
      c = vec3(0.6);
      e = h.xz;
    } else {
      c = paint * 0.3 + 0.05;
      e = h.xz;
    }
    vec3 toLamp = h - vec3(0.5, 0.97, 0.42);
    toLamp.z *= 1.3;
    float fall = 0.16 + 1.25 / (1.0 + 7.0 * dot(toLamp, toLamp));
    float bulb = step(1.5, hit.w) * step(hit.w, 2.5) * (1.0 - smoothstep(0.03, 0.1, length(toLamp.xz))) * 3.0;
    return c * cornerShade(e) * fall + bulb;
  }

  // Shelving with stock on it, as seen on a shop wall.
  vec3 shelves(vec2 q, float seed) {
    vec2 sh = vec2(q.x * 14.0, q.y * 5.0);
    vec2 si = floor(sh);
    vec2 sf = fract(sh);
    float item = step(0.35, hash21(si + seed * 31.0)) * step(0.16, sf.y) * step(sf.y, 0.8)
      * step(0.1, sf.x) * step(q.y, 0.8);
    vec3 stock = mix(vec3(0.55, 0.5, 0.45), hue(hash21(si * 1.7 + seed)), 0.26);
    vec3 c = mix(vec3(0.3, 0.29, 0.28), stock, item);
    return c * (1.0 - 0.55 * step(sf.y, 0.1) * step(q.y, 0.85));
  }

  // Behind a shop window: a store with strip lights, or a bar with a backlit
  // shelf of bottles and lamps hung over the counter.
  vec3 shopShade(vec2 p, vec3 d, float seed) {
    vec4 hit = roomHit(p, d);
    vec3 h = hit.xyz;
    float bar = step(0.62, fract(seed * 5.7));
    vec3 wood = vec3(0.17, 0.09, 0.05);
    vec3 c;
    vec2 e;
    if (hit.w < 0.5) {
      e = h.xy;
      vec3 store = shelves(h.xy, seed) * (0.4 + 0.6 * h.y);
      float bottle = step(0.42, h.y) * step(h.y, 0.63) * step(0.08, h.x) * step(h.x, 0.92);
      vec3 bottles = vec3(1.25, 0.82, 0.4) * (0.35 + 0.65 * step(0.38, fract(h.x * 46.0)))
        * (0.6 + 0.4 * hash11(floor(h.x * 46.0) + seed));
      vec3 lounge = mix(wood, bottles, bottle);
      for (int i = 0; i < 3; i++) {
        vec2 lp = h.xy - vec2(0.2 + 0.3 * float(i), 0.76);
        lounge += vec3(1.3, 0.8, 0.42) * exp(-dot(lp, lp) * 220.0) * 2.2;
      }
      c = mix(store, lounge, bar);
    } else if (hit.w < 1.5) {
      e = h.zy;
      c = mix(shelves(h.zy, seed + 3.0) * (0.3 + 0.5 * h.y), wood * 0.75, bar);
    } else if (hit.w < 2.5) {
      e = h.xz;
      float strip = step(abs(fract(h.z * 3.0) - 0.5), 0.07);
      c = mix(vec3(0.32) + 2.4 * strip, vec3(0.05, 0.03, 0.02), bar);
    } else {
      e = h.xz;
      float sheen = step(abs(fract(h.z * 3.0) - 0.5), 0.12);
      c = mix(vec3(0.2) + 0.2 * sheen, vec3(0.07, 0.04, 0.03), bar);
    }
    return c * cornerShade(e) * (1.0 - 0.5 * clamp(h.z, 0.0, 1.0));
  }

  void main() {
    vec3 N = normalize(vN);
    vec3 toP = vWorld - cameraPosition;
    vec3 V = -normalize(toP);
    vec3 col;
    float glow = 0.0;

    if (N.y > 0.5) {
      // Roof: tar, a parapet, plant, the odd skylight.
      vec2 inset = vSz.xz * 0.5 - abs(vLp.xz);
      float edge = min(inset.x, inset.y);
      float parapet = 1.0 - smoothstep(0.45, 0.8, edge);
      vec2 pc = floor(vLp.xz / 4.0);
      vec2 pf = fract(vLp.xz / 4.0);
      float inner = step(3.5, edge);
      float plant = step(0.8, hash21(pc + vSeed)) * inner
        * step(0.15, pf.x) * step(pf.x, 0.85) * step(0.2, pf.y) * step(pf.y, 0.8);
      col = mix(vec3(0.006, 0.007, 0.011), vec3(0.028, 0.028, 0.036), parapet) + plant * vec3(0.024);
      col += skyBase(vec3(0.0, 1.0, 0.0)) * 0.05;
      float lit = smoothstep(0.1, 0.5, uNight);
      float skylight = step(0.93, hash21(pc * 1.3 + vSeed + 5.0)) * inner
        * step(0.25, pf.x) * step(pf.x, 0.75) * step(0.3, pf.y) * step(pf.y, 0.7);
      col += vec3(1.0, 0.7, 0.42) * skylight * 0.55 * lit;
      // A helipad on the tall ones.
      float pad = step(120.0, vWorld.y) * step(9.0, min(vSz.x, vSz.z) * 0.5);
      float ring = 1.0 - smoothstep(0.2, 0.34, abs(length(vLp.xz) - 6.0));
      float mark = step(abs(vLp.z), 0.32) * step(abs(vLp.x), 2.0)
        + step(abs(abs(vLp.x) - 1.9), 0.32) * step(abs(vLp.z), 2.7);
      col += pad * (ring + min(mark, 1.0)) * vec3(0.3, 0.3, 0.27);
      // Red obstruction lights on the corners of anything high.
      float corner = (1.0 - smoothstep(0.3, 0.75, length(inset - 0.7))) * step(70.0, vWorld.y);
      col += vec3(3.2, 0.12, 0.08) * corner * (0.55 + 0.45 * sin(uTime * 2.2 + vSeed * 6.0)) * lit;
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

      // Facade: brick, limestone or dark steel, lit by the sky it faces and,
      // low down, by the street lamps.
      vec3 tone = s1 < 0.34 ? vec3(0.034, 0.017, 0.013) : s1 < 0.67 ? vec3(0.05, 0.046, 0.042) : vec3(0.011, 0.013, 0.019);
      vec3 ambient = skyBase(normalize(N + vec3(0.0, 0.35, 0.0)));
      float lampOn = smoothstep(0.1, 0.42, uNight);
      vec3 wall = tone * (0.35 + ambient * 2.6 + vec3(0.7, 0.82, 1.0) * 1.5 * lampOn * exp(-vFace.y / 7.0));
      wall *= 0.82 + 0.18 * step(0.5, fract(id.x * 0.25 + s2)); // piers
      vec3 Rv = reflect(-V, N);
      float fres = pow(clamp(1.0 - dot(V, N), 0.0, 1.0), 3.0);
      float blind = 0.55 + 0.45 * hash21(id + 7.7 + vSeed);
      vec3 sunGlint = vec3(1.9, 0.62, 0.22) * pow(max(dot(Rv, SUN), 0.0), 60.0) * (1.0 - uNight) * 0.7;
      vec3 glass = (skyBase(Rv) * (0.05 + 0.3 * fres) + sunGlint * (0.15 + 0.85 * fres)) * blind + vec3(0.002);

      vec3 near = mix(wall, glass, win);
      vec3 emitNear = wc * bright * lit * win * (0.55 + 0.45 * f.y);
      #ifdef CITY_BOXES
        // The eye ray in facade space: x along the wall, y up, z into it.
        vec3 d = vec3(abs(N.x) > 0.5 ? -V.z : -V.x, -V.y, max(dot(V, N), 1e-3));
        if (aa > 0.02) {
          // The glass sits back from the face of the wall.
          float recess = style < 0.5 ? 0.3 : style < 1.5 ? 0.06 : 0.15;
          vec3 dc = vec3(d.xy / cell, d.z);
          vec2 p1 = f + dc.xy * (recess / dc.z);
          float open = step(lo.x, p1.x) * step(p1.x, hi.x) * step(lo.y, p1.y) * step(p1.y, hi.y);
          near = mix(wall, mix(wall * 0.4, glass, open), win);
          if (lit * win * open > 0.5) {
            vec3 interior = roomShade(p1, vec3(dc.xy, dc.z / 4.5), hash21(room + vSeed)) * wc * bright * 2.3;
            // The odd blind half drawn.
            float drawn = step(0.7, hash21(id + 1.9)) * step(0.5, p1.y);
            interior = mix(interior, wc * bright * 0.5, drawn * 0.85);
            // Frame and meeting rail.
            vec2 wl = (p1 - lo) / (hi - lo);
            float frame = step(0.04, wl.x) * step(wl.x, 0.96) * step(0.03, wl.y) * step(wl.y, 0.97);
            frame *= mix(1.0, step(0.018, abs(wl.y - 0.52)), step(style, 0.5));
            emitNear = interior * mix(0.2, 1.0, frame);
          } else {
            emitNear = vec3(0.0);
          }
        }
      #endif
      // Far away the grid dissolves into its average so it does not shimmer.
      vec3 far = mix(wall, glass * 0.8, area);
      vec3 emitFar = mix(warm, cool, 0.4) * litFrac * area * 1.25;
      col = mix(far, near, aa);
      vec3 emit = mix(emitFar, emitNear, aa);

      // Street level: shop bays, some shut, each with a sign above the glass.
      float street = 1.0 - smoothstep(4.6, 4.9, vFace.y);
      if (street > 0.001) {
        float bay = floor(vFace.x / 7.0);
        float bx = fract(vFace.x / 7.0);
        float shop = hash21(vec2(bay, vSeed));
        float trading = step(0.3, shop);
        float evening = smoothstep(0.05, 0.4, uNight + 0.15);
        vec3 shopCol = mix(vec3(1.0, 0.66, 0.38), vec3(0.62, 0.78, 1.0), step(0.68, shop));
        float pane = fract(bx * 3.0);
        float inGlass = step(0.5, vFace.y) * step(vFace.y, 3.35) * step(0.04, bx) * step(bx, 0.96)
          * step(0.025, pane) * step(pane, 0.975);
        vec3 shopEmit = shopCol * (0.1 + 0.4 * shop) * (0.45 + 0.55 * smoothstep(0.5, 3.35, vFace.y));
        #ifdef CITY_BOXES
          float nearK = 1.0 - smoothstep(70.0, 150.0, length(toP));
          if (nearK * inGlass * trading > 0.0) {
            vec3 inside = shopShade(vec2(bx, vFace.y / 3.9), vec3(d.x / 7.0, d.y / 3.9, d.z / 6.0), shop + vSeed);
            shopEmit = mix(shopEmit, inside * shopCol * (0.55 + 0.85 * shop), nearK);
          }
        #endif
        shopEmit *= inGlass * trading;

        // The sign: lettering as blocks, either lit on dark or dark on a lit box.
        float sy = (vFace.y - 3.62) / 0.68;
        float sx = (bx - 0.12) / 0.76;
        float inSign = step(0.0, sy) * step(sy, 1.0) * step(0.0, sx) * step(sx, 1.0) * step(0.45, shop);
        vec3 signCol = mix(vec3(1.0, 0.2, 0.12), vec3(0.3, 0.42, 1.0), step(0.5, hash11(bay + vSeed * 2.0)));
        signCol = mix(signCol, vec3(1.0, 0.8, 0.55), step(0.7, hash11(bay * 1.7 + vSeed)));
        float gx = sx * 16.0;
        float gl = floor(gx);
        float letter = step(2.0, gl) * step(gl, 13.0) * step(0.2, hash21(vec2(gl, bay + vSeed)))
          * step(0.2, fract(gx)) * step(0.24, sy) * step(sy, 0.76);
        letter = mix(0.4, letter, clamp(1.0 - fwidth(gx) * 1.3, 0.0, 1.0));
        float neon = step(0.5, hash11(bay * 3.3 + vSeed));
        shopEmit += signCol * mix(mix(0.55, 0.05, letter), 0.03 + 1.6 * letter, neon) * inSign;

        col = mix(col, wall * 0.55 + glass * 0.6 * inGlass, street);
        emit = mix(emit, shopEmit * evening, street);
      }

      float nightOn = smoothstep(0.2, 0.6, uNight);
      // A lit crown on some of the tall ones.
      float crown = (1.0 - smoothstep(2.0, 5.0, vTop)) * step(0.82, s2) * step(60.0, vFace.y + vTop);
      vec3 accent = mix(vec3(1.0, 0.2, 0.12), vec3(0.3, 0.4, 1.0), step(0.5, s1));
      emit += accent * crown * 2.2 * nightOn;
      #ifdef CITY_BOXES
        // And light strips up the corners of a few towers.
        float halfU = (abs(N.x) > 0.5 ? vSz.z : vSz.x) * 0.5;
        // Never thinner than a pixel and a half, or the line breaks into dots.
        float texel = fwidth(vFace.x);
        float corner = (1.0 - smoothstep(max(0.22, texel * 0.8), max(0.5, texel * 1.6), halfU - abs(vFace.x)))
          * min(1.0, 0.36 / max(texel * 1.2, 1e-3));
        float outlined = step(0.74, hash11(vSeed + 2.2)) * step(70.0, vSz.y) * step(5.2, vFace.y);
        vec3 stripCol = mix(accent, vec3(1.0, 0.72, 0.4), step(0.6, hash11(vSeed + 6.1)));
        emit += stripCol * corner * outlined * 1.7 * nightOn;
      #endif

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
    // three.js only tells the vertex shader about instancing.
    defines: { CITY_BOXES: "" },
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
  taperMat.defines = {};
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
