// Set pieces, one per stop: the palette tower (Quantum Metric), the
// boutique (Styleum), the theatre marquee (more work), photo billboards
// (about) and the pier with its wheel (drop-off).

import {
  BoxGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  PointLight,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  TorusGeometry,
  Vector3,
} from "three";
import { PIER_END_Z, SHORE_Z } from "../route";
import { GLSL_FOG, GLSL_SKY, signTexture, type SharedUniforms } from "../shared";
import type { Ground } from "./ground";

export interface StopSets {
  group: Group;
  update(time: number, night: number): void;
}

const DISPLAY = '"Big Shoulders Display", "Arial Narrow", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

// ---------------------------------------------------------------------------
// Quantum Metric: a tower whose LED skin cycles through brand palettes, the
// way AI Brand Discovery derives a palette from a client's site.
// ---------------------------------------------------------------------------

const PALETTES = [
  ["#0d1121", "#f76b57", "#ffb86b", "#f4efe6", "#8b9cff"],
  ["#0a2540", "#635bff", "#00d4ff", "#f6f9fc", "#ffb86b"],
  ["#1b4332", "#40916c", "#95d5b2", "#f1faee", "#e63946"],
  ["#2b2d42", "#ef233c", "#edf2f4", "#8d99ae", "#ffd166"],
  ["#3a0ca3", "#7209b7", "#f72585", "#4cc9f0", "#fff3b0"],
].map((p) => p.map((hex) => new Color(hex)));

function createTower(shared: SharedUniforms, ground: Ground) {
  const W = 30;
  const H = 190;
  const from = PALETTES[0].map((c) => c.clone());
  const to = PALETTES[1].map((c) => c.clone());
  const material = new ShaderMaterial({
    uniforms: {
      uNight: shared.uNight,
      uFogDensity: shared.uFogDensity,
      uFrom: { value: from },
      uTo: { value: to },
      uPhase: { value: 0 },
      uSize: { value: new Vector3(W, H, W) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorld;
      varying vec3 vN;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vN = normal;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uFrom[5];
      uniform vec3 uTo[5];
      uniform float uPhase;
      uniform vec3 uSize;
      varying vec3 vWorld;
      varying vec3 vN;
      varying vec2 vUv;
      ${GLSL_SKY}
      ${GLSL_FOG}
      void main() {
        vec3 col;
        if (vN.y > 0.5) {
          col = vec3(0.01);
        } else {
          float y = vUv.y * uSize.y;
          float bandF = vUv.x * 5.0;
          int bi = int(clamp(floor(bandF), 0.0, 4.0));
          float bf = fract(bandF);
          // Each swatch wipes upward a beat after its neighbour.
          float wipe = clamp((uPhase - float(bi) * 0.09) / 0.4, 0.0, 1.0);
          wipe = wipe * wipe * (3.0 - 2.0 * wipe);
          float edge = wipe * 1.04 - vUv.y;
          vec3 sw = edge > 0.0 ? uTo[bi] : uFrom[bi];
          float scan = (1.0 - smoothstep(0.0, 0.012, abs(edge))) * step(0.001, wipe) * step(wipe, 0.999);

          // LED module grid.
          vec2 led = vec2(vUv.x * uSize.x, y) * 2.4;
          float px = 1.0 - smoothstep(0.18, 0.5, length(fract(led) - 0.5));
          float aa = clamp(1.0 - length(fwidth(led)) * 0.9, 0.0, 1.0);
          float mask = mix(0.42, px, aa);

          float gap = smoothstep(0.0, 0.035, bf) * (1.0 - smoothstep(0.965, 1.0, bf));
          float display = step(9.0, y);
          vec3 lit = (sw * 1.7 + 0.02) * mask * gap + vec3(1.0) * scan * 2.0;
          // Lobby: warm glass at street level.
          vec3 lobby = vec3(1.0, 0.62, 0.32) * 0.5 * step(0.8, y) * step(fract(vUv.x * uSize.x / 5.0), 0.92);
          col = mix(lobby, lit, display) * (0.25 + 0.75 * smoothstep(0.0, 0.5, uNight + 0.25));
          col += skyBase(reflect(normalize(vWorld - cameraPosition), vN)) * 0.12;
        }
        gl_FragColor = vec4(applyFog(col, vWorld, 0.8), 1.0);
      }
    `,
  });
  const geo = new BoxGeometry(W, H, W);
  geo.translate(0, H / 2, 0);
  const mesh = new Mesh(geo, material);
  mesh.position.set(28, 0, -320);

  let index = 0;
  const avg = new Color();
  return {
    mesh,
    update(time: number, night: number) {
      const cycle = 4.5;
      const i = Math.floor(time / cycle);
      if (i !== index) {
        index = i;
        const a = PALETTES[i % PALETTES.length];
        const b = PALETTES[(i + 1) % PALETTES.length];
        for (let k = 0; k < 5; k++) {
          from[k].copy(a[k]);
          to[k].copy(b[k]);
        }
      }
      const phase = (time / cycle) % 1;
      material.uniforms.uPhase.value = phase;
      // Spill the brightest swatches onto the wet road.
      avg.setRGB(0, 0, 0);
      const src = phase > 0.4 ? to : from;
      for (const c of src) avg.add(c);
      const k = 0.5 * (0.3 + 0.7 * night);
      ground.glows.pos[0].set(10, -318, 26, 0);
      ground.glows.col[0].set(avg.r * k, avg.g * k, avg.b * k);
    },
  };
}

// ---------------------------------------------------------------------------
// Styleum: a lit boutique window. The mannequins change outfits.
// ---------------------------------------------------------------------------

const FITS = [
  ["#f76b57", "#14162a", "#f4efe6", "#8b9cff"],
  ["#1d3557", "#f4efe6", "#c9a227", "#2a2a2e"],
  ["#e9c46a", "#264653", "#e76f51", "#f1faee"],
  ["#6d597a", "#eaac8b", "#355070", "#e56b6f"],
].map((fit) => fit.map((hex) => new Color(hex)));

function gradientTexture(top: string, bottom: string) {
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 128;
  const ctx = c.getContext("2d");
  if (ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, top);
    g.addColorStop(1, bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 128);
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function createBoutique(ground: Ground) {
  const group = new Group();
  group.position.set(-17.5, 0, -720); // a 13 m deep, 26 m wide lot on the left kerb
  const dark = new MeshBasicMaterial({ color: 0x07070a });
  const stone = new MeshStandardMaterial({ color: 0x9a9084, roughness: 0.5, metalness: 0 });

  // The display sits just behind the glass, on a raised stage.
  const stage = new Mesh(new BoxGeometry(6, 1.0, 26), stone);
  stage.position.set(3.5, 0.5, 0);
  group.add(stage);

  const backMat = new MeshBasicMaterial({ map: gradientTexture("#f6e3c6", "#d9a57c") });
  backMat.color.setScalar(0.72);
  const back = new Mesh(new PlaneGeometry(26, 6), backMat);
  back.rotation.y = Math.PI / 2;
  back.position.set(0.6, 3.5, 0);
  group.add(back);

  // Three tall colour panels behind the figures, like a campaign set.
  const panels: [number, number, number, number][] = [
    [-8.6, 0.85, 0.2, 0.15],
    [0, 0.2, 0.26, 0.82],
    [8.6, 0.86, 0.8, 0.7],
  ];
  for (const [z, r, g, b] of panels) {
    const mat = new MeshBasicMaterial();
    mat.color.setRGB(r * 0.8, g * 0.8, b * 0.8);
    const panel = new Mesh(new PlaneGeometry(5.4, 4.7), mat);
    panel.rotation.y = Math.PI / 2;
    panel.position.set(0.7, 3.35, z);
    group.add(panel);
  }

  const shell = new Mesh(new BoxGeometry(7, 6.6, 26.9), dark);
  shell.position.set(-3, 3.3, 0);
  group.add(shell);
  for (const side of [-1, 1]) {
    const wall = new Mesh(new BoxGeometry(6.2, 6.6, 0.5), dark);
    wall.position.set(3.5, 3.3, side * 13.2);
    group.add(wall);
  }
  const ceiling = new Mesh(new BoxGeometry(6.2, 0.4, 26.9), dark);
  ceiling.position.set(3.5, 6.5, 0);
  group.add(ceiling);
  const stripMat = new MeshBasicMaterial();
  stripMat.color.setRGB(2.4, 1.95, 1.4);
  const strip = new Mesh(new BoxGeometry(0.14, 0.05, 24), stripMat);
  strip.position.set(4.6, 6.27, 0);
  group.add(strip);

  // Shopfront: fascia, sign, mullions.
  const fascia = new Mesh(new BoxGeometry(0.7, 1.9, 26.9), dark);
  fascia.position.set(6.4, 7.6, 0);
  group.add(fascia);
  const signMat = new MeshBasicMaterial({
    map: signTexture(["STYLEUM"], {
      width: 1024,
      height: 190,
      font: `800 150px ${DISPLAY}`,
      tracking: 20,
      background: "#07070a",
    }),
  });
  signMat.color.setScalar(1.7);
  const sign = new Mesh(new PlaneGeometry(7.6, 1.4), signMat);
  sign.rotation.y = Math.PI / 2;
  sign.position.set(6.77, 7.6, 0);
  group.add(sign);
  for (const z of [-13, -4.4, 4.4, 13]) {
    const mullion = new Mesh(new BoxGeometry(0.14, 6.4, 0.14), dark);
    mullion.position.set(6.4, 3.4, z);
    group.add(mullion);
  }

  // Mannequins.
  const skin = new MeshStandardMaterial({ color: 0xe9e2d6, roughness: 0.5, metalness: 0 });
  const garments: MeshStandardMaterial[] = [];
  const fabric = () => {
    const m = new MeshStandardMaterial({ roughness: 0.75, metalness: 0 });
    garments.push(m);
    return m;
  };
  const zs = [-10.4, -6.4, -2.2, 2.2, 6.4, 10.4];
  zs.forEach((z, i) => {
    const fig = new Group();
    fig.position.set(4.9 - (i % 2) * 1.5, 1.0, z);
    fig.scale.setScalar(1.32);
    const top = fabric();
    const bottom = fabric();
    const head = new Mesh(new SphereGeometry(0.115, 20, 14), skin);
    head.position.y = 1.74;
    head.scale.y = 1.18;
    fig.add(head);
    const neck = new Mesh(new CylinderGeometry(0.045, 0.055, 0.14, 10), skin);
    neck.position.y = 1.58;
    fig.add(neck);
    if (i % 2 === 0) {
      // Coat over trousers.
      const coat = new Mesh(new CylinderGeometry(0.21, 0.31, 1.05, 20), top);
      coat.position.y = 1.0;
      coat.scale.z = 0.62;
      fig.add(coat);
      for (const lx of [-0.09, 0.09]) {
        const leg = new Mesh(new CylinderGeometry(0.085, 0.07, 0.6, 12), bottom);
        leg.position.set(lx, 0.3, 0);
        fig.add(leg);
      }
    } else {
      // Fitted top and a long skirt.
      const bodice = new Mesh(new CylinderGeometry(0.19, 0.15, 0.52, 20), top);
      bodice.position.y = 1.26;
      bodice.scale.z = 0.62;
      fig.add(bodice);
      const skirt = new Mesh(new CylinderGeometry(0.15, 0.4, 1.02, 24), bottom);
      skirt.position.y = 0.51;
      skirt.scale.z = 0.8;
      fig.add(skirt);
    }
    for (const sx of [-1, 1]) {
      const arm = new Mesh(new CylinderGeometry(0.05, 0.04, 0.72, 10), top);
      arm.position.set(sx * 0.27, 1.14, 0);
      arm.rotation.z = sx * 0.09;
      fig.add(arm);
    }
    fig.rotation.y = Math.PI / 2 + (i - 2.5) * 0.1; // face the street
    group.add(fig);
  });

  for (const z of [-7, 7]) {
    const light = new PointLight(0xffe2c0, 46, 18, 1.8);
    light.position.set(5.6, 5.6, z);
    group.add(light);
  }

  const a = new Color();
  const b = new Color();
  return {
    group,
    update(time: number) {
      const cycle = 3.4;
      const i = Math.floor(time / cycle);
      const t = Math.min(1, ((time / cycle) % 1) / 0.22);
      const e = t * t * (3 - 2 * t);
      garments.forEach((m, k) => {
        a.copy(FITS[(i + FITS.length - 1) % FITS.length][(k * 3 + i) % 4]);
        b.copy(FITS[i % FITS.length][(k * 3 + i + 1) % 4]);
        m.color.copy(a).lerp(b, e);
      });
      ground.glows.pos[1].set(-7, -720, 11, 0);
      ground.glows.col[1].set(0.8, 0.46, 0.22);
    },
  };
}

// ---------------------------------------------------------------------------
// More work: a theatre marquee with a blade sign and chasing bulbs.
// ---------------------------------------------------------------------------

function createTheatre(ground: Ground) {
  const group = new Group();
  group.position.set(0, 0, -960);
  const dark = new MeshBasicMaterial({ color: 0x0b0607 });

  const canopy = new Mesh(new BoxGeometry(4.8, 1.7, 18), dark);
  canopy.position.set(8.8, 5.1, 0);
  group.add(canopy);

  const boardMat = new MeshBasicMaterial({
    map: signTexture(["HAZARDLENS     WINDWALK     LLM ROUTER     DEEPCITE"], {
      width: 2048,
      height: 150,
      font: `800 96px ${DISPLAY}`,
      tracking: 8,
      color: "#17100b",
      background: "#fff0d2",
    }),
  });
  boardMat.color.setScalar(0.9);
  const board = new Mesh(new PlaneGeometry(17.4, 1.28), boardMat);
  board.rotation.y = -Math.PI / 2;
  board.position.set(6.38, 5.1, 0);
  group.add(board);

  const endMat = new MeshBasicMaterial({
    map: signTexture(["MORE WORK"], {
      width: 512,
      height: 150,
      font: `800 92px ${DISPLAY}`,
      tracking: 6,
      color: "#17100b",
      background: "#fff0d2",
    }),
  });
  endMat.color.setScalar(0.9);
  for (const side of [-1, 1]) {
    const end = new Mesh(new PlaneGeometry(4.3, 1.28), endMat);
    end.rotation.y = side > 0 ? 0 : Math.PI;
    end.position.set(8.8, 5.1, side * 9.02);
    group.add(end);
  }

  // Blade sign.
  const blade = new Mesh(
    new BoxGeometry(1.0, 11.6, 2.9),
    new MeshBasicMaterial({ color: 0x1c0605 }),
  );
  blade.position.set(9.4, 12.7, 0);
  group.add(blade);
  const bladeMat = new MeshBasicMaterial({
    map: signTexture(["AKHTAR"], {
      width: 256,
      height: 1180,
      font: `900 196px ${DISPLAY}`,
      vertical: true,
      lineHeight: 182,
      color: "#fff3df",
      background: "#2a0806",
    }),
  });
  bladeMat.color.setScalar(1.25);
  for (const side of [-1, 1]) {
    const face = new Mesh(new PlaneGeometry(2.3, 10.6), bladeMat);
    face.rotation.y = side > 0 ? 0 : Math.PI;
    face.position.set(9.4, 12.7, side * 1.46);
    group.add(face);
  }
  const bracket = new Mesh(new BoxGeometry(2.2, 0.3, 0.3), dark);
  bracket.position.set(10.4, 9, 0);
  group.add(bracket);

  // Bulbs. Each remembers where it sits in the chase.
  const bulbs: { p: Vector3; phase: number; steady: boolean }[] = [];
  // canopy underside
  for (let r = 0; r < 3; r++) {
    for (let k = 0; k < 22; k++) {
      bulbs.push({ p: new Vector3(7.2 + r * 1.3, 4.2, -8.4 + k * 0.8), phase: 0, steady: true });
    }
  }
  // board border
  for (let k = 0; k <= 44; k++) {
    const z = -8.8 + k * 0.4;
    bulbs.push({ p: new Vector3(6.34, 5.86, z), phase: k, steady: false });
    bulbs.push({ p: new Vector3(6.34, 4.34, z), phase: k + 2, steady: false });
  }
  // blade outline, both faces
  for (const side of [-1, 1]) {
    for (let k = 0; k <= 26; k++) {
      const y = 7.2 + k * 0.423;
      bulbs.push({ p: new Vector3(8.2, y, side * 1.5), phase: k, steady: false });
      bulbs.push({ p: new Vector3(10.6, y, side * 1.5), phase: k, steady: false });
    }
  }
  const bulbMesh = new InstancedMesh(
    new SphereGeometry(0.085, 8, 6),
    new MeshBasicMaterial(),
    bulbs.length,
  );
  const m = new Matrix4();
  const c = new Color();
  bulbs.forEach((bulb, i) => {
    m.makeTranslation(bulb.p.x, bulb.p.y, bulb.p.z);
    bulbMesh.setMatrixAt(i, m);
    bulbMesh.setColorAt(i, c.setRGB(1, 1, 1));
  });
  bulbMesh.frustumCulled = false;
  group.add(bulbMesh);

  return {
    group,
    update(time: number, night: number) {
      const on = 0.25 + 0.75 * night;
      bulbs.forEach((bulb, i) => {
        let v = 1.3;
        if (!bulb.steady) {
          const t = (((bulb.phase - time * 7) % 4) + 4) % 4;
          v = t < 1.4 ? 3.0 : 0.35;
        }
        v *= on;
        bulbMesh.setColorAt(i, c.setRGB(v, v * 0.62, v * 0.26));
      });
      if (bulbMesh.instanceColor) bulbMesh.instanceColor.needsUpdate = true;
      ground.glows.pos[2].set(6, -960, 13, 0);
      ground.glows.col[2].set(1.0 * on, 0.55 * on, 0.24 * on);
    },
  };
}

// ---------------------------------------------------------------------------
// About: his photographs on backlit billboards.
// ---------------------------------------------------------------------------

// Larger on the right, where the About copy leaves the frame clear.
const BILLBOARDS = [
  { x: 18, z: -1230, yaw: -0.5, w: 18, photo: 2, meta: "27MM  F/5  1/125 S  ISO 640" },
  { x: -17.5, z: -1246, yaw: 0.5, w: 15, photo: 1, meta: "45MM  F/5.6  1/320 S  ISO 320" },
  { x: 21, z: -1268, yaw: -0.44, w: 18, photo: 4, meta: "45MM  F/5.6  1/4000 S  ISO 800" },
  { x: -20, z: -1288, yaw: 0.42, w: 15, photo: 3, meta: "22MM  F/22  1/420 S  ISO 640" },
];

function createBillboards() {
  const group = new Group();
  const steel = new MeshBasicMaterial({ color: 0x08090c });
  const lampMat = new MeshBasicMaterial();
  lampMat.color.setRGB(6, 5.4, 4.4);
  const loader = new TextureLoader();
  const BASE = 5.6; // bottom edge of the photograph above the pavement
  for (const b of BILLBOARDS) {
    const W = b.w;
    const H = (W * 2) / 3; // his frames are 3:2
    const board = new Group();
    board.position.set(b.x, 0, b.z);
    board.rotation.y = b.yaw;

    const frame = new Mesh(new BoxGeometry(W + 0.7, H + 1.9, 0.5), steel);
    frame.position.set(0, BASE + H / 2 - 0.45, -0.3);
    board.add(frame);
    for (const px of [-W * 0.26, W * 0.26]) {
      const post = new Mesh(new CylinderGeometry(0.3, 0.36, BASE, 10), steel);
      post.position.set(px, BASE / 2 - 0.4, -0.4);
      board.add(post);
    }
    const catwalk = new Mesh(new BoxGeometry(W + 0.7, 0.12, 1.3), steel);
    catwalk.position.set(0, BASE - 1.05, 0.4);
    board.add(catwalk);

    const photoMat = new MeshBasicMaterial({ color: 0x111111 });
    loader.load(`/photography/photo-${b.photo}.webp`, (tex) => {
      tex.colorSpace = SRGBColorSpace;
      photoMat.map = tex;
      // Backlit: bright enough to be the light source on this block.
      photoMat.color.setScalar(1.55);
      photoMat.needsUpdate = true;
    });
    const photo = new Mesh(new PlaneGeometry(W, H), photoMat);
    photo.position.set(0, BASE + H / 2, 0);
    board.add(photo);

    const capMat = new MeshBasicMaterial({
      map: signTexture([`FUJIFILM X-T30 II     ${b.meta}`], {
        width: 1536,
        height: 96,
        font: `500 40px ${MONO}`,
        tracking: 4,
        color: "#f4efe6",
        background: "#08090c",
      }),
    });
    capMat.color.setScalar(1.6);
    const caption = new Mesh(new PlaneGeometry(W, W / 16), capMat);
    caption.position.set(0, BASE - W / 32 - 0.08, 0);
    board.add(caption);

    for (const lx of [-W / 3, 0, W / 3]) {
      const arm = new Mesh(new BoxGeometry(0.06, 0.06, 1.5), steel);
      arm.position.set(lx, BASE + H + 0.3, 0.55);
      board.add(arm);
      const lamp = new Mesh(new BoxGeometry(0.7, 0.1, 0.16), lampMat);
      lamp.position.set(lx, BASE + H + 0.25, 1.3);
      board.add(lamp);
    }
    group.add(board);
  }
  return { group };
}

// ---------------------------------------------------------------------------
// Drop-off: the pier and its wheel.
// ---------------------------------------------------------------------------

function createPier(ground: Ground) {
  const group = new Group();
  const steel = new MeshBasicMaterial({ color: 0x0a0b10 });

  // Railings.
  const length = SHORE_Z - PIER_END_Z;
  const posts: number[] = [];
  for (let z = SHORE_Z - 2; z > PIER_END_Z; z -= 4) posts.push(z);
  const postMesh = new InstancedMesh(new BoxGeometry(0.1, 1.15, 0.1), steel, posts.length * 2);
  const m = new Matrix4();
  posts.forEach((z, i) => {
    m.makeTranslation(-15.6, 0.58, z);
    postMesh.setMatrixAt(i * 2, m);
    m.makeTranslation(15.6, 0.58, z);
    postMesh.setMatrixAt(i * 2 + 1, m);
  });
  postMesh.frustumCulled = false;
  group.add(postMesh);
  for (const x of [-15.6, 15.6]) {
    const rail = new Mesh(new BoxGeometry(0.08, 0.08, length), steel);
    rail.position.set(x, 1.15, SHORE_Z - length / 2);
    group.add(rail);
  }

  // Wheel.
  const R = 30;
  const centre = new Vector3(-30, R + 6, -1440);
  const wheel = new Group();
  wheel.position.copy(centre);
  for (const dz of [-1.3, 1.3]) {
    const rim = new Mesh(new TorusGeometry(R, 0.2, 6, 120), steel);
    rim.position.z = dz;
    wheel.add(rim);
    const inner = new Mesh(new TorusGeometry(R * 0.56, 0.12, 6, 96), steel);
    inner.position.z = dz;
    wheel.add(inner);
  }
  const SPOKES = 24;
  const spokeGeo = new BoxGeometry(0.13, R, 0.13);
  spokeGeo.translate(0, R / 2, 0);
  const gondolas: Mesh[] = [];
  const gondolaMat = new MeshBasicMaterial({ color: 0x14161d });
  const bulbPos: { p: Vector3; r: number; a: number }[] = [];
  for (let i = 0; i < SPOKES; i++) {
    const a = (i / SPOKES) * Math.PI * 2;
    const spoke = new Mesh(spokeGeo, steel);
    spoke.rotation.z = a;
    wheel.add(spoke);
    const g = new Mesh(new BoxGeometry(2.1, 2.3, 1.9), gondolaMat);
    g.position.set(-Math.sin(a) * (R + 0.2), Math.cos(a) * (R + 0.2) - 1.5, 0);
    wheel.add(g);
    gondolas.push(g);
    for (let k = 1; k <= 9; k++) {
      const r = (k / 9) * R;
      bulbPos.push({
        p: new Vector3(-Math.sin(a) * r, Math.cos(a) * r, 1.5),
        r: k / 9,
        a: i / SPOKES,
      });
    }
  }
  for (let i = 0; i < 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    bulbPos.push({ p: new Vector3(-Math.sin(a) * R, Math.cos(a) * R, 1.6), r: 1.12, a: i / 96 });
  }
  const bulbs = new InstancedMesh(
    new SphereGeometry(0.2, 6, 4),
    new MeshBasicMaterial(),
    bulbPos.length * 2,
  );
  const c = new Color();
  bulbPos.forEach((b, i) => {
    m.makeTranslation(b.p.x, b.p.y, b.p.z);
    bulbs.setMatrixAt(i * 2, m);
    m.makeTranslation(b.p.x, b.p.y, -b.p.z);
    bulbs.setMatrixAt(i * 2 + 1, m);
    bulbs.setColorAt(i * 2, c.setRGB(1, 1, 1));
    bulbs.setColorAt(i * 2 + 1, c);
  });
  bulbs.frustumCulled = false;
  wheel.add(bulbs);
  const hub = new Mesh(new CylinderGeometry(1.6, 1.6, 4.2, 20), steel);
  hub.rotation.x = Math.PI / 2;
  wheel.add(hub);
  group.add(wheel);

  // A-frame legs.
  for (const dz of [-2.4, 2.4]) {
    for (const dx of [-1, 1]) {
      const len = Math.hypot(centre.y, 15);
      const leg = new Mesh(new BoxGeometry(0.7, len, 0.7), steel);
      leg.position.set(centre.x + dx * 7.5, centre.y / 2, centre.z + dz);
      leg.rotation.z = dx * Math.atan2(15, centre.y);
      group.add(leg);
    }
  }
  const booth = new Mesh(new BoxGeometry(14, 3.2, 8), new MeshBasicMaterial({ color: 0x0c0d12 }));
  booth.position.set(centre.x, 1.6, centre.z);
  group.add(booth);

  const coral = new Color(1.0, 0.17, 0.1);
  const peri = new Color(0.26, 0.33, 1.0);
  const bone = new Color(1.0, 0.85, 0.62);
  return {
    group,
    update(time: number, night: number) {
      const rot = time * 0.05;
      wheel.rotation.z = rot;
      for (const g of gondolas) g.rotation.z = -rot;
      const on = 0.15 + 0.85 * night;
      const mode = Math.floor(time / 9) % 3;
      bulbPos.forEach((b, i) => {
        let w: number;
        if (mode === 0) w = 0.5 + 0.5 * Math.sin((b.r - time * 0.35) * 9);
        else if (mode === 1) w = 0.5 + 0.5 * Math.sin((b.a * 3 + time * 0.12) * Math.PI * 2);
        else w = 0.5 + 0.5 * Math.sin((b.r * 1.5 + b.a * 2 - time * 0.3) * Math.PI * 2);
        c.copy(coral).lerp(peri, w);
        if (b.r > 1.05) c.copy(bone);
        const k = (b.r > 1.05 ? 4.5 : 5.5) * on;
        c.multiplyScalar(k);
        bulbs.setColorAt(i * 2, c);
        bulbs.setColorAt(i * 2 + 1, c);
      });
      if (bulbs.instanceColor) bulbs.instanceColor.needsUpdate = true;
      ground.glows.pos[3].set(centre.x, centre.z, 30, 0);
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.4);
      ground.glows.col[3].set((0.5 + 0.3 * pulse) * on, 0.22 * on, (0.3 + 0.5 * (1 - pulse)) * on);
    },
  };
}

export function createStops(shared: SharedUniforms, ground: Ground): StopSets {
  const group = new Group();
  const tower = createTower(shared, ground);
  const boutique = createBoutique(ground);
  const theatre = createTheatre(ground);
  const billboards = createBillboards();
  const pier = createPier(ground);
  group.add(tower.mesh, boutique.group, theatre.group, billboards.group, pier.group);
  return {
    group,
    update(time, night) {
      tower.update(time, night);
      boutique.update(time);
      theatre.update(time, night);
      pier.update(time, night);
    },
  };
}
