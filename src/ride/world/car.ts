// The car: a long black sedan built from extruded profiles. It faces -Z.

import {
  AdditiveBlending,
  BoxGeometry,
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
  ShaderMaterial,
  Shape,
  Sprite,
  SpriteMaterial,
  type Texture,
} from "three";
import { glowTexture } from "../shared";

export interface Car {
  group: Group;
  /** Advance wheel rotation by metres travelled. */
  roll(metres: number): void;
  setEnvMap(tex: Texture | null): void;
  /** 0..1 headlight beam visibility. */
  setBeams(v: number): void;
  /** 0..1, brake lights brighten when the car is slowing or stopped. */
  setBrake(v: number): void;
}

const LENGTH = 5.9;
const WIDTH = 1.94;
const WHEEL_R = 0.37;
const AXLE_FRONT = 1.82;
const AXLE_REAR = -1.92;

/** Extrude a side profile (x = length, y = up) across the car's width. */
function extrudeProfile(shape: Shape, width: number, bevel: number) {
  const geo = new ExtrudeGeometry(shape, {
    depth: width - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 20,
  });
  geo.translate(0, 0, -(width - bevel * 2) / 2);
  geo.rotateY(Math.PI / 2); // profile +x becomes world -z (forward)
  return geo;
}

function bodyShape() {
  const s = new Shape();
  const h = LENGTH / 2;
  const arch = WHEEL_R + 0.09;
  s.moveTo(-h + 0.1, 0.34);
  s.quadraticCurveTo(-h - 0.02, 0.6, -h + 0.04, 0.86); // rear face
  s.quadraticCurveTo(-h + 0.1, 0.99, -h + 0.5, 1.0); // trunk lip
  s.lineTo(-1.2, 1.03); // rear deck up to the shoulder
  s.lineTo(1.25, 1.02); // shoulder line
  s.quadraticCurveTo(2.2, 0.98, h - 0.25, 0.84); // hood
  s.quadraticCurveTo(h + 0.02, 0.76, h, 0.52); // nose
  s.quadraticCurveTo(h - 0.02, 0.3, h - 0.3, 0.26); // chin
  s.lineTo(AXLE_FRONT + arch, 0.26);
  s.absarc(AXLE_FRONT, WHEEL_R, arch, 0, Math.PI, false);
  s.lineTo(AXLE_FRONT - arch, 0.25);
  s.lineTo(AXLE_REAR + arch, 0.25);
  s.absarc(AXLE_REAR, WHEEL_R, arch, 0, Math.PI, false);
  s.lineTo(AXLE_REAR - arch, 0.26);
  s.lineTo(-h + 0.3, 0.26);
  s.quadraticCurveTo(-h + 0.12, 0.27, -h + 0.1, 0.34);
  return s;
}

function cabinShape() {
  const s = new Shape();
  s.moveTo(-2.2, 1.0);
  s.quadraticCurveTo(-1.95, 1.36, -1.45, 1.45); // rear glass
  s.quadraticCurveTo(-0.4, 1.5, 0.45, 1.44); // roof
  s.quadraticCurveTo(0.95, 1.32, 1.5, 1.0); // windshield
  s.lineTo(-2.2, 1.0);
  return s;
}

function roofShape() {
  const s = new Shape();
  s.moveTo(-1.62, 1.41);
  s.quadraticCurveTo(-0.4, 1.5, 0.52, 1.43);
  s.lineTo(0.5, 1.47);
  s.quadraticCurveTo(-0.4, 1.535, -1.6, 1.45);
  s.lineTo(-1.62, 1.41);
  return s;
}

export function createCar(): Car {
  const group = new Group();

  const paint = new MeshPhysicalMaterial({
    color: new Color(0.0025, 0.0025, 0.004),
    metalness: 0,
    roughness: 0.3,
    // Keeps the flank from washing out when the low sun glances along it.
    specularIntensity: 0.25,
    clearcoat: 1,
    clearcoatRoughness: 0.09,
    envMapIntensity: 0.45,
  });
  const glass = new MeshStandardMaterial({
    color: new Color(0.001, 0.0015, 0.003),
    metalness: 0,
    roughness: 0.08,
    envMapIntensity: 1.7,
  });
  const chrome = new MeshStandardMaterial({
    color: new Color(0.55, 0.55, 0.58),
    metalness: 1,
    roughness: 0.2,
    envMapIntensity: 1.1,
  });
  const rubber = new MeshStandardMaterial({
    color: new Color(0.006, 0.006, 0.007),
    roughness: 0.85,
    metalness: 0,
  });
  const envMaterials = [paint, glass, chrome, rubber];

  group.add(new Mesh(extrudeProfile(bodyShape(), WIDTH, 0.07), paint));
  group.add(new Mesh(extrudeProfile(cabinShape(), WIDTH - 0.3, 0.05), glass));
  group.add(new Mesh(extrudeProfile(roofShape(), WIDTH - 0.36, 0.03), paint));

  // Pillars and beltline trim.
  for (const side of [-1, 1]) {
    const x = side * (WIDTH / 2 - 0.145);
    for (const z of [0.55, -0.72]) {
      const pillar = new Mesh(new BoxGeometry(0.03, 0.36, 0.1), paint);
      pillar.position.set(x, 1.19, z);
      group.add(pillar);
    }
    const belt = new Mesh(new BoxGeometry(0.014, 0.022, 3.75), chrome);
    belt.position.set(side * (WIDTH / 2 - 0.005), 1.035, 0.35);
    group.add(belt);
    const sill = new Mesh(new BoxGeometry(0.014, 0.03, 3.2), chrome);
    sill.position.set(side * (WIDTH / 2 + 0.001), 0.3, 0.05);
    group.add(sill);
    const mirror = new Mesh(new BoxGeometry(0.2, 0.1, 0.13), paint);
    mirror.position.set(side * (WIDTH / 2 + 0.06), 1.08, -1.28);
    group.add(mirror);
  }

  // Wheels.
  const wheels: Group[] = [];
  const tireGeo = new CylinderGeometry(WHEEL_R, WHEEL_R, 0.27, 36);
  tireGeo.rotateZ(Math.PI / 2);
  const rimGeo = new CylinderGeometry(0.25, 0.25, 0.28, 28);
  rimGeo.rotateZ(Math.PI / 2);
  const spokeGeo = new BoxGeometry(0.285, 0.44, 0.05);
  const rimDark = new MeshStandardMaterial({
    color: new Color(0.02, 0.02, 0.024),
    metalness: 1,
    roughness: 0.3,
  });
  envMaterials.push(rimDark);
  for (const axle of [AXLE_FRONT, AXLE_REAR]) {
    for (const side of [-1, 1]) {
      const wheel = new Group();
      wheel.add(new Mesh(tireGeo, rubber));
      wheel.add(new Mesh(rimGeo, rimDark));
      for (let i = 0; i < 5; i++) {
        const spoke = new Mesh(spokeGeo, chrome);
        spoke.rotation.x = (i / 5) * Math.PI;
        wheel.add(spoke);
      }
      wheel.position.set(side * (WIDTH / 2 - 0.15), WHEEL_R, -axle);
      group.add(wheel);
      wheels.push(wheel);
    }
  }

  // Lights. Colours above 1.0 feed the bloom pass.
  const tailMat = new MeshBasicMaterial();
  const headMat = new MeshBasicMaterial();
  headMat.color.setRGB(3.4, 3.4, 3.9);
  const rear = LENGTH / 2;
  const tailBar = new Mesh(new BoxGeometry(WIDTH - 0.34, 0.035, 0.04), tailMat);
  tailBar.position.set(0, 0.86, rear + 0.05);
  group.add(tailBar);
  for (const side of [-1, 1]) {
    const cluster = new Mesh(new BoxGeometry(0.34, 0.1, 0.05), tailMat);
    cluster.position.set(side * (WIDTH / 2 - 0.24), 0.84, rear + 0.04);
    group.add(cluster);
    const lamp = new Mesh(new BoxGeometry(0.4, 0.06, 0.05), headMat);
    lamp.position.set(side * (WIDTH / 2 - 0.32), 0.74, -rear - 0.045);
    lamp.rotation.x = -0.2;
    group.add(lamp);
    const drl = new Mesh(new BoxGeometry(0.5, 0.014, 0.04), headMat);
    drl.position.set(side * (WIDTH / 2 - 0.36), 0.81, -rear - 0.005);
    group.add(drl);
  }
  const plate = new Mesh(new BoxGeometry(0.44, 0.12, 0.01), chrome);
  plate.position.set(0, 0.56, rear + 0.1);
  group.add(plate);
  const grille = new Mesh(new BoxGeometry(0.95, 0.2, 0.02), rimDark);
  grille.position.set(0, 0.52, -rear - 0.08);
  group.add(grille);

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
    beam.position.set(side * (WIDTH / 2 - 0.32), 0.74, -rear - 0.06);
    beam.renderOrder = 5;
    group.add(beam);
  }

  // Glows are sprites rather than bloom, so the tail lights stay red
  // instead of tone-mapping toward white.
  const halo = (
    color: [number, number, number],
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
  ) => {
    const mat = new SpriteMaterial({
      map: glowTexture(),
      blending: AdditiveBlending,
      depthWrite: false,
      transparent: true,
      fog: false,
    });
    mat.color.setRGB(...color);
    const sprite = new Sprite(mat);
    sprite.position.set(x, y, z);
    sprite.scale.set(w, h, 1);
    group.add(sprite);
    return mat;
  };
  const tailGlows = [
    halo([1, 0.04, 0.02], -0.72, 0.85, rear + 0.12, 1.3, 1.0),
    halo([1, 0.04, 0.02], 0.72, 0.85, rear + 0.12, 1.3, 1.0),
    halo([1, 0.04, 0.02], 0, 0.85, rear + 0.12, 3.4, 0.7),
  ];
  halo([0.55, 0.58, 0.68], -0.65, 0.76, -rear - 0.12, 1.5, 1.1);
  halo([0.55, 0.58, 0.68], 0.65, 0.76, -rear - 0.12, 1.5, 1.1);

  let brake = 0;
  const applyTail = () => {
    tailMat.color.setRGB(1.5 + brake * 0.7, 0.035, 0.02);
    for (const g of tailGlows) g.opacity = 0.55 + brake * 0.35;
  };
  applyTail();

  return {
    group,
    roll(metres) {
      const a = metres / WHEEL_R;
      for (const w of wheels) w.rotation.x -= a;
    },
    setEnvMap(tex) {
      for (const m of envMaterials) {
        m.envMap = tex;
        m.needsUpdate = true;
      }
    },
    setBeams(v) {
      beamMat.uniforms.uStrength.value = v;
    },
    setBrake(v) {
      brake = v;
      applyTail();
    },
  };
}
