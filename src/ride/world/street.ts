// Street furniture and street life: lamps and their light cones, the L
// viaducts with their trains, traffic and parked cars, signals, trees strung
// with lights, and steam rising from the road.

import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Frustum,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  Points,
  PointsMaterial,
  ShaderMaterial,
  Sphere,
  Vector2,
  Vector3,
  type Camera,
  type Texture,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { BLOCK, PIER_END_Z, SHORE_Z, WEST_Z } from "../route";
import { GLSL_NOISE, glowTexture } from "../shared";
import { patchBodywork, tameHighlights } from "./car";
import { PAINTS, SALOON, saloonGeometry } from "./vehicles";

export interface StreetFrame {
  time: number;
  night: number;
  /** 0..1, strength of the dispatch-map view from above. */
  dispatch: number;
  carZ: number;
  camera: Camera;
}

export interface Street {
  group: Group;
  update(frame: StreetFrame): void;
  setEnvMap(tex: Texture | null): void;
  /** Hide whatever samples the reflection map while it is being drawn. */
  setEnvPass(on: boolean): void;
}

/** Cross streets that carry the elevated tracks. */
export const VIADUCT_Z = [-360, -1080];

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

/** True where a cross street meets the avenue, with `margin` metres to spare. */
function atJunction(z: number, margin: number) {
  const d = Math.abs((((z - 40) % BLOCK) + BLOCK) % BLOCK);
  return Math.min(d, BLOCK - d) < margin;
}

// ---------------------------------------------------------------------------
// Lamps
// ---------------------------------------------------------------------------

function createLamps(low: boolean) {
  const group = new Group();
  const zs: number[] = [];
  for (let z = WEST_Z - 20; z >= PIER_END_Z + 20; z -= 40) zs.push(z);
  const count = zs.length * 2;

  const steel = new MeshBasicMaterial({ color: 0x08090d });
  const headMat = new MeshBasicMaterial();
  const pole = new InstancedMesh(new CylinderGeometry(0.07, 0.11, 8.2, 8), steel, count);
  const arm = new InstancedMesh(new BoxGeometry(2.7, 0.09, 0.09), steel, count);
  const head = new InstancedMesh(new BoxGeometry(0.75, 0.09, 0.3), headMat, count);

  // The light a lamp throws into wet air: a soft cone under each head.
  const coneMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    blending: AdditiveBlending,
    uniforms: { uStrength: { value: 0 } },
    vertexShader: /* glsl */ `
      varying float vAlong;
      varying float vNear;
      varying vec3 vN;
      varying vec3 vView;
      void main() {
        vAlong = uv.y;
        mat4 m = modelMatrix * instanceMatrix;
        vec4 mv = viewMatrix * m * vec4(position, 1.0);
        vN = normalize(mat3(viewMatrix * m) * normal);
        vView = normalize(-mv.xyz);
        // Fades out close up, so flying through a cone does not fog the lens.
        vNear = smoothstep(3.0, 14.0, length(mv.xyz));
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uStrength;
      varying float vAlong;
      varying float vNear;
      varying vec3 vN;
      varying vec3 vView;
      void main() {
        float edge = pow(abs(dot(normalize(vN), normalize(vView))), 1.5);
        float fall = pow(max(vAlong, 0.0), 1.7);
        gl_FragColor = vec4(vec3(0.62, 0.76, 1.0) * fall * edge * uStrength * vNear, 1.0);
      }
    `,
  });
  const coneGeo = new ConeGeometry(4.6, 8, 20, 1, true);
  coneGeo.translate(0, -4, 0); // apex at the lamp
  const cones = new InstancedMesh(coneGeo, coneMat, count);
  cones.renderOrder = 4;

  const haloPos: number[] = [];
  const m = new Matrix4();
  let i = 0;
  for (const z of zs) {
    for (const side of [-1, 1]) {
      // No posts in front of the photo billboards, or beside the last camera.
      if (z < -1210 && z > -1310) continue;
      if (side > 0 && z < -1490) continue;
      m.makeTranslation(side * 8.6, 4.1, z);
      pole.setMatrixAt(i, m);
      m.makeTranslation(side * 7.3, 8.15, z);
      arm.setMatrixAt(i, m);
      m.makeTranslation(side * 6.2, 8.08, z);
      head.setMatrixAt(i, m);
      m.makeTranslation(side * 6.2, 8.0, z);
      cones.setMatrixAt(i, m);
      haloPos.push(side * 6.2, 8.0, z);
      i++;
    }
  }
  for (const im of [pole, arm, head, cones]) {
    im.count = i;
    im.frustumCulled = false;
  }
  group.add(pole, arm, head);
  if (!low) group.add(cones);

  // Lamps on the neighbouring streets only matter as points of light.
  if (!low) {
    for (let x = -400; x <= 400; x += 80) {
      if (x === 0) continue;
      for (let z = 300; z >= -1340; z -= 80) haloPos.push(x + 6.2, 8, z + 20);
    }
  }
  const haloGeo = new BufferGeometry();
  haloGeo.setAttribute("position", new Float32BufferAttribute(haloPos, 3));
  const haloMat = new PointsMaterial({
    size: 6,
    map: glowTexture(),
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    sizeAttenuation: true,
    fog: false,
  });
  const halos = new Points(haloGeo, haloMat);
  halos.frustumCulled = false;
  group.add(halos);

  return {
    group,
    update(night: number) {
      const on = Math.min(1, Math.max(0, (night - 0.1) / 0.32));
      headMat.color.setRGB(0.05 + 2.5 * on, 0.04 + 3.0 * on, 0.03 + 3.8 * on);
      haloMat.color.setRGB(0.55 * on, 0.7 * on, 1.0 * on);
      haloMat.opacity = 0.4;
      coneMat.uniforms.uStrength.value = 0.03 * on;
      cones.visible = on > 0.01;
    },
  };
}

// ---------------------------------------------------------------------------
// The L
// ---------------------------------------------------------------------------

function createViaducts() {
  const group = new Group();
  const steel = new MeshBasicMaterial({ color: 0x0a0b10 });
  const span = 960;
  const colsX: number[] = [];
  for (let x = -span / 2 + 8; x < span / 2; x += 16) colsX.push(x);
  const colCount = colsX.length * 2 * VIADUCT_Z.length;
  const cols = new InstancedMesh(new BoxGeometry(0.5, 6.4, 0.5), steel, colCount);
  const caps = new InstancedMesh(new BoxGeometry(0.55, 0.7, 9.6), steel, colCount / 2);
  const m = new Matrix4();
  let ci = 0;
  let pi = 0;
  for (const z of VIADUCT_Z) {
    const deck = new Mesh(new BoxGeometry(span, 0.5, 8.6), steel);
    deck.position.set(0, 7.35, z);
    group.add(deck);
    for (const side of [-1, 1]) {
      const girder = new Mesh(new BoxGeometry(span, 1.3, 0.3), steel);
      girder.position.set(0, 6.75, z + side * 4.3);
      group.add(girder);
      const rail = new Mesh(new BoxGeometry(span, 0.08, 0.08), steel);
      rail.position.set(0, 8.7, z + side * 4.2);
      group.add(rail);
    }
    for (const x of colsX) {
      for (const side of [-1, 1]) {
        m.makeTranslation(x, 3.2, z + side * 4.4);
        cols.setMatrixAt(ci++, m);
      }
      m.makeTranslation(x, 6.4, z);
      caps.setMatrixAt(pi++, m);
    }
  }
  cols.frustumCulled = false;
  caps.frustumCulled = false;
  group.add(cols, caps);

  // Trains: six cars, lit from inside.
  const shell = new MeshBasicMaterial({ color: 0x15171d });
  const windows = new MeshBasicMaterial();
  windows.color.setRGB(2.6, 2.1, 1.5);
  const lampMat = new MeshBasicMaterial();
  lampMat.color.setRGB(8, 7.5, 6.5);
  const trains: { obj: Group; dir: number; offset: number }[] = [];
  const carLen = 14.6;
  VIADUCT_Z.forEach((z, vi) => {
    for (let t = 0; t < 2; t++) {
      const train = new Group();
      const bodies: BufferGeometry[] = [];
      const panes: BufferGeometry[] = [];
      for (let c = 0; c < 6; c++) {
        const x = (c - 2.5) * carLen;
        bodies.push(new BoxGeometry(carLen - 0.5, 2.9, 2.75).translate(x, 0, 0));
        // Window bands, broken up by the doors.
        for (let w = 0; w < 4; w++) {
          panes.push(
            new BoxGeometry(2.5, 0.8, 2.8).translate(x - carLen / 2 + 2.4 + w * 3.3, 0.45, 0),
          );
        }
      }
      train.add(new Mesh(mergeGeometries(bodies), shell));
      train.add(new Mesh(mergeGeometries(panes), windows));
      for (const end of [-1, 1]) {
        const lamp = new Mesh(new BoxGeometry(0.1, 0.25, 1.1), lampMat);
        lamp.position.set(end * (3 * carLen - 0.2), -0.6, 0);
        train.add(lamp);
      }
      const dir = t === 0 ? 1 : -1;
      train.position.set(0, 9.25, z + dir * 2.05);
      train.scale.z = 0.72; // two tracks share the deck
      group.add(train);
      trains.push({ obj: train, dir, offset: vi * 290 + t * 520 });
    }
  });

  return {
    group,
    update(time: number) {
      const range = span + 240;
      for (const t of trains) {
        const s = (((time * 19 + t.offset) % range) + range) % range;
        t.obj.position.x = t.dir * (s - range / 2);
      }
    },
  };
}

// ---------------------------------------------------------------------------
// Cars
// ---------------------------------------------------------------------------

/** Beyond this many metres a car's bodywork is not drawn. */
const FAR_CAR = 380;

interface Vehicle {
  kind: 0 | 1 | 2; // 0 main avenue oncoming, 1 parallel avenue, 2 cross street
  lane: number;
  fixed: number;
  base: number;
  speed: number;
  dir: number;
  size: number;
  paint: Color;
}

function createCars(low: boolean) {
  const group = new Group();
  const { body, lamps } = saloonGeometry();
  const paint = new MeshStandardMaterial({
    vertexColors: true,
    metalness: 0.35,
    roughness: 0.3,
    envMapIntensity: 0.9,
  });
  patchBodywork(paint, SALOON.axleFront, SALOON.axleRear, false);
  tameHighlights(paint, 0.2, 2);
  const lampMat = new MeshBasicMaterial({ vertexColors: true });
  const rnd = mulberry(7);
  const tint = new Color();
  const pickPaint = (c: Color) => {
    const r = rnd();
    const p = PAINTS[Math.min(PAINTS.length - 1, Math.floor(r * r * (PAINTS.length + 0.6)))];
    return c.setRGB(p[0], p[1], p[2]);
  };

  // ---- traffic ----
  const vehicles: Vehicle[] = [];
  const nMain = low ? 5 : 8;
  for (let i = 0; i < nMain; i++) {
    vehicles.push({
      kind: 0,
      lane: -5.25,
      fixed: 0,
      base: (i / nMain) * 1680 + rnd() * 60,
      speed: 12 + rnd() * 4,
      dir: 1,
      size: 0.9 + rnd() * 0.07,
      paint: pickPaint(new Color()),
    });
  }
  const avenues = [-240, -160, -80, 80, 160, 240];
  const nPar = low ? 10 : 30;
  for (let i = 0; i < nPar; i++) {
    const dir = rnd() > 0.5 ? 1 : -1;
    vehicles.push({
      kind: 1,
      lane: dir > 0 ? -(1.75 + 3.5 * Math.round(rnd())) : 1.75 + 3.5 * Math.round(rnd()),
      fixed: avenues[i % avenues.length],
      base: rnd() * 1680,
      speed: 9 + rnd() * 7,
      dir,
      size: 0.9 + rnd() * 0.07,
      paint: pickPaint(new Color()),
    });
  }
  const nCross = low ? 12 : 44;
  for (let i = 0; i < nCross; i++) {
    const dir = rnd() > 0.5 ? 1 : -1;
    vehicles.push({
      kind: 2,
      lane: dir > 0 ? 1.75 + 3.5 * Math.round(rnd()) : -(1.75 + 3.5 * Math.round(rnd())),
      fixed: -(40 + 80 * Math.floor(rnd() * 17)),
      base: rnd() * 828,
      speed: 8 + rnd() * 7,
      dir,
      size: 0.9 + rnd() * 0.07,
      paint: pickPaint(new Color()),
    });
  }
  const moving = new InstancedMesh(body, paint, vehicles.length);
  const movingLamps = new InstancedMesh(lamps, lampMat, vehicles.length);
  vehicles.forEach((v, i) => moving.setColorAt(i, v.paint));
  moving.frustumCulled = false;
  movingLamps.frustumCulled = false;
  group.add(moving, movingLamps);

  // ---- parked ----
  // Kept clear of junctions, the set pieces' frontages, the kerbs the camera
  // works from, and the stretch of the left kerb lane that carries traffic.
  const parked: { mesh: InstancedMesh; centre: Vector3 }[] = [];
  const spots: { x: number; z: number; yaw: number }[] = [];
  const kerb = (side: number, from: number, to: number, skip: [number, number][]) => {
    for (let z = from; z > to; z -= 5.9 + rnd() * 0.9) {
      const taken = rnd() < (low ? 0.4 : 0.72);
      if (!taken || atJunction(z, 15)) continue;
      if (skip.some(([a, b]) => z < a && z > b)) continue;
      spots.push({
        x: side * (6.0 + (rnd() - 0.5) * 0.2),
        z,
        yaw: (side < 0 ? Math.PI : 0) + (rnd() - 0.5) * 0.05,
      });
    }
  };
  kerb(-1, -616, -1190, [
    [-686, -754],
    [-872, -1048],
  ]);
  kerb(1, WEST_Z - 30, 16, []);
  kerb(1, -252, -470, []);
  const dummy = new Object3D();
  const bounds = new Sphere();
  const chunks = new Map<number, typeof spots>();
  for (const s of spots) {
    const key = Math.floor(s.z / 160);
    chunks.set(key, [...(chunks.get(key) ?? []), s]);
  }
  for (const list of chunks.values()) {
    const mesh = new InstancedMesh(body, paint, list.length);
    list.forEach((s, i) => {
      dummy.position.set(s.x, 0, s.z);
      dummy.rotation.set(0, s.yaw, 0);
      dummy.scale.setScalar(0.9 + rnd() * 0.07);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, pickPaint(tint));
    });
    mesh.computeBoundingSphere();
    group.add(mesh);
    parked.push({ mesh, centre: mesh.boundingSphere?.center.clone() ?? new Vector3() });
  }

  return {
    group,
    paint,
    /** Everything that samples the reflection map. */
    bodies: [moving, ...parked.map((p) => p.mesh)] as Object3D[],
    /**
     * `grow` enlarges traffic so it reads as markers from the air. Only cars
     * the camera can see are written to the instance buffers.
     */
    update(time: number, grow: number, view: Frustum, eye: Vector3) {
      dummy.rotation.set(0, 0, 0);
      let shown = 0;
      let lit = 0;
      vehicles.forEach((v) => {
        let scale = 1;
        if (v.kind === 2) {
          // Cross traffic stays clear of the main avenue so nothing drives
          // through the car: it runs on either side and fades at the gap.
          const s = (((v.base + time * v.speed) % 828) + 828) % 828;
          const half = s < 414 ? s : s - 414;
          const side = s < 414 ? 1 : -1;
          const x =
            v.dir > 0 ? (side > 0 ? 26 + half : -440 + half) : side > 0 ? 440 - half : -26 - half;
          dummy.position.set(x, 0, v.fixed + v.lane);
          dummy.rotation.y = v.dir > 0 ? -Math.PI / 2 : Math.PI / 2;
          scale = Math.min(1, half / 12, (414 - half) / 12);
        } else {
          // The main avenue only carries oncoming traffic downtown, which
          // leaves the far lanes free for the camera later in the ride.
          const span = v.kind === 0 ? 940 : 1680;
          const s = (((v.base + time * v.speed) % span) + span) % span;
          const z = v.dir > 0 ? 340 - span + s : 340 - s;
          dummy.position.set(v.fixed + v.lane, 0, z);
          dummy.rotation.y = v.dir > 0 ? Math.PI : 0;
          scale = Math.min(1, s / 12, (span - s) / 12);
        }
        const size = scale * grow * v.size;
        bounds.center.set(dummy.position.x, 0.7, dummy.position.z);
        bounds.radius = 3.2 * size;
        if (size < 0.01 || !view.intersectsSphere(bounds)) return;
        dummy.scale.setScalar(size);
        dummy.updateMatrix();
        movingLamps.setMatrixAt(lit++, dummy.matrix);
        // Far down the street a car is only its lamps.
        if (bounds.center.distanceToSquared(eye) > FAR_CAR * FAR_CAR) return;
        moving.setMatrixAt(shown, dummy.matrix);
        moving.setColorAt(shown, v.paint);
        shown++;
      });
      moving.count = shown;
      movingLamps.count = lit;
      moving.instanceMatrix.needsUpdate = true;
      movingLamps.instanceMatrix.needsUpdate = true;
      if (moving.instanceColor) moving.instanceColor.needsUpdate = true;
      for (const p of parked) {
        p.mesh.visible = p.centre.distanceToSquared(eye) < (FAR_CAR + 90) * (FAR_CAR + 90);
      }
    },
  };
}

// ---------------------------------------------------------------------------
// Signals
// ---------------------------------------------------------------------------

const SIGNAL = {
  red: [5.2, 0.24, 0.14],
  amber: [4.6, 2.1, 0.18],
  green: [0.3, 4.3, 1.7],
  off: [0.02, 0.02, 0.022],
} as const;

function createSignals() {
  const group = new Group();
  const junctions: number[] = [];
  for (let z = 280; z > SHORE_Z; z -= BLOCK) junctions.push(z);
  const steel = new MeshBasicMaterial({ color: 0x08090d });
  const n = junctions.length * 2;
  const poles = new InstancedMesh(new CylinderGeometry(0.09, 0.13, 6.6, 8), steel, n);
  const arms = new InstancedMesh(new BoxGeometry(7.2, 0.11, 0.11), steel, n);
  const heads = new InstancedMesh(new BoxGeometry(0.34, 1.02, 0.26), steel, n * 2);
  const lights = new InstancedMesh(new CircleGeometry(0.105, 14), new MeshBasicMaterial(), n * 6);
  const dummy = new Object3D();
  let hi = 0;
  let li = 0;
  junctions.forEach((zc, j) => {
    // Signals hang on the far side of the junction, facing what approaches.
    for (const dir of [1, -1]) {
      const k = j * 2 + (dir > 0 ? 0 : 1);
      const z = zc - dir * 9.6;
      dummy.rotation.set(0, 0, 0);
      dummy.position.set(dir * 8.3, 3.3, z);
      dummy.updateMatrix();
      poles.setMatrixAt(k, dummy.matrix);
      dummy.position.set(dir * 4.8, 6.35, z);
      dummy.updateMatrix();
      arms.setMatrixAt(k, dummy.matrix);
      for (const lane of [1.75, 5.25]) {
        dummy.rotation.set(0, 0, 0);
        dummy.position.set(dir * lane, 5.75, z);
        dummy.updateMatrix();
        heads.setMatrixAt(hi++, dummy.matrix);
        for (let lamp = 0; lamp < 3; lamp++) {
          dummy.position.set(dir * lane, 6.07 - lamp * 0.32, z + dir * 0.135);
          dummy.rotation.set(0, dir > 0 ? 0 : Math.PI, 0);
          dummy.updateMatrix();
          lights.setMatrixAt(li++, dummy.matrix);
        }
      }
    }
  });
  const c = new Color();
  for (let i = 0; i < n * 6; i++) lights.setColorAt(i, c.setRGB(0, 0, 0));
  for (const im of [poles, arms, heads, lights]) im.frustumCulled = false;
  group.add(poles, arms, heads, lights);

  const state = new Int8Array(junctions.length).fill(-1);
  return {
    group,
    update(time: number, carZ: number) {
      let changed = false;
      junctions.forEach((zc, j) => {
        // The limousine catches every light: a junction it is nearing holds green.
        const ahead = carZ - zc;
        const t = (((time + zc * 0.045) % 26) + 26) % 26;
        const next = ahead > -12 && ahead < 150 ? 0 : t < 13 ? 0 : t < 15.5 ? 1 : 2;
        if (next === state[j]) return;
        state[j] = next;
        changed = true;
        for (let k = 0; k < 4; k++) {
          const at = (j * 4 + k) * 3;
          lights.setColorAt(at, c.fromArray(next === 2 ? SIGNAL.red : SIGNAL.off));
          lights.setColorAt(at + 1, c.fromArray(next === 1 ? SIGNAL.amber : SIGNAL.off));
          lights.setColorAt(at + 2, c.fromArray(next === 0 ? SIGNAL.green : SIGNAL.off));
        }
      });
      if (changed && lights.instanceColor) lights.instanceColor.needsUpdate = true;
    },
  };
}

// ---------------------------------------------------------------------------
// Trees
// ---------------------------------------------------------------------------

/** One bare tree: merged branch tubes, and where its string lights hang. */
function growTree(seed: number) {
  const rnd = mulberry(seed);
  const tubes: BufferGeometry[] = [];
  const bulbs: number[] = [];
  const dummy = new Object3D();
  const up = new Vector3(0, 1, 0);
  const branch = (from: Vector3, dir: Vector3, length: number, radius: number, depth: number) => {
    const to = from.clone().addScaledVector(dir, length);
    // The finest twigs are only ever seen as the lights strung along them.
    if (depth < 4) {
      const geo = new CylinderGeometry(radius * 0.7, radius, length, depth > 1 ? 3 : 5, 1, true);
      geo.translate(0, length / 2, 0);
      dummy.position.copy(from);
      dummy.quaternion.setFromUnitVectors(up, dir);
      dummy.updateMatrix();
      geo.applyMatrix4(dummy.matrix);
      tubes.push(geo);
    }
    if (depth > 0) {
      const count = Math.max(2, Math.round(length / 0.17));
      for (let i = 0; i < count; i++) {
        const t = (i + rnd()) / count;
        bulbs.push(
          from.x + dir.x * length * t + (rnd() - 0.5) * 0.07,
          from.y + dir.y * length * t + (rnd() - 0.5) * 0.07,
          from.z + dir.z * length * t + (rnd() - 0.5) * 0.07,
        );
      }
    }
    if (depth >= 4) return;
    const kids = depth === 0 ? 3 : 2 + (rnd() > 0.6 ? 1 : 0);
    const spin = rnd() * Math.PI * 2;
    for (let k = 0; k < kids; k++) {
      const az = spin + (k / kids) * Math.PI * 2 + (rnd() - 0.5) * 0.7;
      const tilt = 0.36 + rnd() * 0.28;
      const side = new Vector3(Math.cos(az), 0, Math.sin(az));
      const next = dir
        .clone()
        .multiplyScalar(Math.cos(tilt))
        .addScaledVector(side, Math.sin(tilt))
        .add(new Vector3(0, 0.14, 0))
        .normalize();
      branch(to, next, length * (0.66 + rnd() * 0.12), radius * 0.62, depth + 1);
    }
  };
  branch(
    new Vector3(),
    new Vector3((rnd() - 0.5) * 0.06, 1, (rnd() - 0.5) * 0.06).normalize(),
    2.7,
    0.13,
    0,
  );
  return { geometry: mergeGeometries(tubes), bulbs };
}

function createTrees(low: boolean) {
  const group = new Group();
  const rnd = mulberry(41);
  const kinds = [growTree(11), growTree(23), growTree(37)];
  const sites: { x: number; z: number; kind: number; yaw: number; size: number }[] = [];
  for (let zc = WEST_Z - BLOCK; zc > SHORE_Z + 60; zc -= BLOCK) {
    for (const dz of low ? [-40] : [-30, -40, -50]) {
      const z = zc + dz;
      for (const side of [-1, 1]) {
        if (z < -1165 && z > -1315) continue; // billboards
        if (side < 0 && z < -696 && z > -744) continue; // boutique window
        if (side < 0 && z < -950 && z > -990) continue; // camera at the theatre
        if (side > 0 && z < -690 && z > -750) continue; // camera at the boutique
        if (side > 0 && z < -940 && z > -980) continue; // theatre canopy
        sites.push({
          x: side * 9.25,
          z: z + (rnd() - 0.5) * 2,
          kind: Math.floor(rnd() * kinds.length),
          yaw: rnd() * Math.PI * 2,
          size: 0.88 + rnd() * 0.24,
        });
      }
    }
  }

  const bark = new MeshBasicMaterial({ color: 0x0a0807, side: DoubleSide });
  const trunks: Object3D[] = [];
  const dummy = new Object3D();
  const bulbs: number[] = [];
  const seeds: number[] = [];
  const p = new Vector3();
  kinds.forEach((kind, k) => {
    const here = sites.filter((s) => s.kind === k);
    const mesh = new InstancedMesh(kind.geometry, bark, here.length);
    here.forEach((s, i) => {
      dummy.position.set(s.x, 0, s.z);
      dummy.rotation.set(0, s.yaw, 0);
      dummy.scale.setScalar(s.size);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      for (let b = 0; b < kind.bulbs.length; b += 3) {
        p.set(kind.bulbs[b], kind.bulbs[b + 1], kind.bulbs[b + 2]).applyMatrix4(dummy.matrix);
        bulbs.push(p.x, p.y, p.z);
        seeds.push(rnd());
      }
    });
    mesh.frustumCulled = false;
    group.add(mesh);
    trunks.push(mesh);
  });

  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(bulbs, 3));
  geo.setAttribute("aSeed", new Float32BufferAttribute(seeds, 1));
  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uScale: { value: 1000 } },
    vertexShader: /* glsl */ `
      attribute float aSeed;
      uniform float uTime;
      uniform float uScale;
      varying float vGain;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float dist = max(-mv.z, 0.1);
        float px = 0.075 * uScale / dist;
        // Keep a bulb at least a pixel and a half wide, and dim it to match,
        // so distant trees glow instead of flickering.
        float size = clamp(px, 1.6, 36.0);
        gl_PointSize = size;
        float twinkle = 0.78 + 0.22 * sin(uTime * (1.2 + aSeed * 2.2) + aSeed * 40.0);
        vGain = twinkle * min(1.0, (px * px) / (size * size)) * exp(-dist * 0.0035);
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vGain;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float a = 1.0 - smoothstep(0.05, 0.25, dot(c, c));
        gl_FragColor = vec4(vec3(2.9, 1.75, 0.78) * a * vGain, 1.0);
      }
    `,
  });
  const lights = new Points(geo, material);
  lights.frustumCulled = false;
  lights.renderOrder = 3;
  // Bulb size depends on the target being drawn: the frame, the road's
  // mirror and the car's small reflection map all differ.
  const target = new Vector2();
  lights.onBeforeRender = (renderer, _scene, camera) => {
    const rt = renderer.getRenderTarget();
    const height = rt ? rt.height : renderer.getDrawingBufferSize(target).y;
    material.uniforms.uScale.value = height * camera.projectionMatrix.elements[5] * 0.5;
    material.uniformsNeedUpdate = true;
  };
  group.add(lights);

  return {
    group,
    trunks,
    update(time: number) {
      material.uniforms.uTime.value = time;
    },
  };
}

// ---------------------------------------------------------------------------
// Steam
// ---------------------------------------------------------------------------

const VENTS: [number, number][] = [
  [-4.4, -150],
  [5.4, -426],
  [-5.2, -612],
  [4.6, -846],
  [-3.4, -1112],
];

function createSteam() {
  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uStrength: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying float vSeed;
      void main() {
        vUv = uv;
        vec3 centre = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        vSeed = centre.z * 0.37;
        // Turn to face the camera, standing upright.
        vec2 to = normalize(cameraPosition.xz - centre.xz);
        vec3 right = vec3(to.y, 0.0, -to.x);
        vec3 wp = centre + right * (position.x * 3.6) + vec3(0.0, (position.y + 0.5) * 7.0, 0.0);
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uStrength;
      varying vec2 vUv;
      varying float vSeed;
      ${GLSL_NOISE}
      void main() {
        float h = vUv.y;
        float x = (vUv.x - 0.5) / mix(0.1, 0.5, h);
        float body = exp(-x * x * 2.6) * smoothstep(0.0, 0.07, h) * (1.0 - smoothstep(0.4, 1.0, h));
        float n = fbm(vec2(vUv.x * 3.0 + vSeed, h * 3.0 - uTime * 0.5));
        float n2 = vnoise(vec2(vUv.x * 8.0 - vSeed, h * 7.0 - uTime * 0.95));
        float a = body * smoothstep(0.22, 0.72, n * 0.7 + n2 * 0.4);
        gl_FragColor = vec4(vec3(0.72, 0.8, 1.0) * a * uStrength, 1.0);
      }
    `,
  });
  const mesh = new InstancedMesh(new PlaneGeometry(1, 1), material, VENTS.length);
  const m = new Matrix4();
  VENTS.forEach(([x, z], i) => mesh.setMatrixAt(i, m.makeTranslation(x, 0, z)));
  mesh.frustumCulled = false;
  mesh.renderOrder = 4;
  return {
    mesh,
    update(time: number, night: number) {
      const on = Math.min(1, Math.max(0, (night - 0.3) / 0.4));
      material.uniforms.uTime.value = time;
      material.uniforms.uStrength.value = 0.2 * on;
      mesh.visible = on > 0.01;
    },
  };
}

// ---------------------------------------------------------------------------

export function createStreet(low: boolean): Street {
  const group = new Group();
  const lamps = createLamps(low);
  const viaducts = createViaducts();
  const cars = createCars(low);
  const signals = createSignals();
  const trees = createTrees(low);
  const steam = createSteam();
  const view = new Frustum();
  const viewProj = new Matrix4();
  let hidden: Object3D[] = [];
  group.add(lamps.group, viaducts.group, cars.group, signals.group, trees.group);
  if (!low) group.add(steam.mesh);
  return {
    group,
    update({ time, night, dispatch, carZ, camera }) {
      lamps.update(night);
      viaducts.update(time);
      view.setFromProjectionMatrix(
        viewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse),
      );
      cars.update(time, 1 + dispatch * 1.8, view, camera.position);
      signals.update(time, carZ);
      trees.update(time);
      steam.update(time, night);
    },
    setEnvMap(tex) {
      cars.paint.envMap = tex;
      cars.paint.needsUpdate = true;
    },
    setEnvPass(on) {
      // Car bodies sample the map being drawn; bare branches are too thin to
      // show in it.
      if (on) hidden = cars.bodies.filter((b) => b.visible);
      for (const body of hidden) body.visible = !on;
      for (const trunk of trees.trunks) trunk.visible = !on;
    },
  };
}
