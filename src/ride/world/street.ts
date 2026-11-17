// Street furniture: lamps, the L viaducts with their trains, and traffic.

import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CylinderGeometry,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Points,
  PointsMaterial,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { PIER_END_Z, WEST_Z } from "../route";
import { glowTexture } from "../shared";

export interface Street {
  group: Group;
  update(time: number, night: number, dispatch: number): void;
}

/** Cross streets that carry the elevated tracks. */
export const VIADUCT_Z = [-360, -1080];

function paint(geo: BufferGeometry, r: number, g: number, b: number) {
  const n = geo.getAttribute("position").count;
  const colors = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;
  }
  geo.setAttribute("color", new BufferAttribute(colors, 3));
  return geo;
}

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
      haloPos.push(side * 6.2, 8.0, z);
      i++;
    }
  }
  for (const im of [pole, arm, head]) {
    im.count = i;
    im.frustumCulled = false;
    group.add(im);
  }

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
    },
  };
}

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
      for (let c = 0; c < 6; c++) {
        const body = new Mesh(new BoxGeometry(carLen - 0.5, 2.9, 2.75), shell);
        body.position.x = (c - 2.5) * carLen;
        train.add(body);
        const glass = new Mesh(new BoxGeometry(carLen - 1.6, 0.8, 2.8), windows);
        glass.position.set((c - 2.5) * carLen, 0.45, 0);
        train.add(glass);
      }
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

interface Vehicle {
  kind: 0 | 1 | 2; // 0 main avenue oncoming, 1 parallel avenue, 2 cross street
  lane: number;
  fixed: number;
  base: number;
  speed: number;
  dir: number;
}

function createTraffic(low: boolean) {
  const body = paint(new BoxGeometry(1.85, 1.2, 4.5), 0.012, 0.013, 0.018);
  body.translate(0, 0.78, 0);
  const cabin = paint(new BoxGeometry(1.6, 0.5, 2.3), 0.008, 0.009, 0.014);
  cabin.translate(0, 1.55, 0.2);
  const head = paint(new BoxGeometry(1.5, 0.16, 0.08), 7, 6.8, 6);
  head.translate(0, 0.72, -2.27);
  const tail = paint(new BoxGeometry(1.5, 0.12, 0.08), 4.2, 0.18, 0.1);
  tail.translate(0, 0.86, 2.27);
  const geo = mergeGeometries([body, cabin, head, tail]);

  const vehicles: Vehicle[] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const nMain = low ? 6 : 9;
  for (let i = 0; i < nMain; i++) {
    vehicles.push({
      kind: 0,
      lane: -5.25,
      fixed: 0,
      base: (i / nMain) * 1680 + rnd() * 60,
      speed: 13 + rnd() * 4,
      dir: 1,
    });
  }
  const avenues = [-240, -160, -80, 80, 160, 240];
  const nPar = low ? 14 : 36;
  for (let i = 0; i < nPar; i++) {
    const dir = rnd() > 0.5 ? 1 : -1;
    vehicles.push({
      kind: 1,
      lane: dir > 0 ? -(1.75 + 3.5 * Math.round(rnd())) : 1.75 + 3.5 * Math.round(rnd()),
      fixed: avenues[i % avenues.length],
      base: rnd() * 1680,
      speed: 9 + rnd() * 7,
      dir,
    });
  }
  const nCross = low ? 16 : 56;
  for (let i = 0; i < nCross; i++) {
    const dir = rnd() > 0.5 ? 1 : -1;
    vehicles.push({
      kind: 2,
      lane: dir > 0 ? 1.75 + 3.5 * Math.round(rnd()) : -(1.75 + 3.5 * Math.round(rnd())),
      fixed: -(40 + 80 * Math.floor(rnd() * 17)),
      base: rnd() * 828,
      speed: 8 + rnd() * 7,
      dir,
    });
  }

  const mesh = new InstancedMesh(
    geo,
    new MeshBasicMaterial({ vertexColors: true }),
    vehicles.length,
  );
  mesh.frustumCulled = false;
  const dummy = new Object3D();

  return {
    mesh,
    /** `grow` enlarges vehicles so they read as markers from the air. */
    update(time: number, grow: number) {
      vehicles.forEach((v, i) => {
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
        dummy.scale.setScalar(Math.max(0.0001, scale * grow));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}

export function createStreet(low: boolean): Street {
  const group = new Group();
  const lamps = createLamps(low);
  const viaducts = createViaducts();
  const traffic = createTraffic(low);
  group.add(lamps.group, viaducts.group, traffic.mesh);
  return {
    group,
    update(time, night, dispatch) {
      lamps.update(night);
      viaducts.update(time);
      traffic.update(time, 1 + dispatch * 1.8);
    },
  };
}
