// The ground: one plane whose shader draws the Chicago street grid, lane
// markings, lamp pools, the lake and pier, the wet-road reflection, and the
// dispatch-map overlay used at the Renaro stop.

import { Color, PlaneGeometry, Vector3, Vector4 } from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { PIER_END_Z, SHORE_Z } from "../route";
import { GLSL_FOG, GLSL_NOISE, GLSL_SKY, type SharedUniforms } from "../shared";

export interface Ground {
  mesh: Reflector;
  /** Coloured light spilling from set pieces onto the road. */
  glows: { pos: Vector4[]; col: Vector3[] };
  setReflection(on: boolean): void;
  setBeam(v: number): void;
}

const vertexShader = /* glsl */ `
  uniform mat4 textureMatrix;
  varying vec4 vUvP;
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    vUvP = textureMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform vec3 color;
  uniform float uReflect;
  uniform float uTime;
  uniform vec3 uCar;
  uniform float uDispatch;
  uniform float uBeam;
  uniform float uRain;
  uniform vec4 uGlowPos[4];
  uniform vec3 uGlowCol[4];
  varying vec4 vUvP;
  varying vec3 vWorld;

  ${GLSL_NOISE}
  ${GLSL_SKY}
  ${GLSL_FOG}

  const float SHORE = ${SHORE_Z.toFixed(1)};
  const float PIER_END = ${PIER_END_Z.toFixed(1)};

  float band(float d, float halfWidth, float aa) {
    return 1.0 - smoothstep(halfWidth - aa, halfWidth + aa, abs(d));
  }

  // One raindrop per cell: a ring that spreads and dies. Returns the tilt it
  // gives the surface.
  vec2 ripple(vec2 p) {
    vec2 cell = floor(p);
    float h = hash21(cell);
    float age = fract(uTime * (0.8 + h * 0.7) + h * 7.0);
    vec2 centre = (vec2(hash21(cell + 3.1), hash21(cell + 7.7)) - 0.5) * 0.5;
    vec2 dv = fract(p) - 0.5 - centre;
    float r = length(dv);
    float front = r - age * 0.42;
    float ring = sin(front * 46.0) * smoothstep(0.07, 0.0, abs(front)) * (1.0 - age);
    return dv / max(r, 1e-3) * ring;
  }

  void main() {
    vec3 p = vWorld;
    vec3 toCam = cameraPosition - p;
    float dist = length(toCam);
    vec3 V = toCam / dist;
    float aa = clamp(dist * 0.0022, 0.02, 0.6);

    float ax = abs(mod(p.x + 40.0, 80.0) - 40.0); // distance to nearest avenue centre
    float cz = abs(mod(p.z, 80.0) - 40.0);        // distance to nearest cross-street centre

    bool lake = p.z < SHORE;
    bool pier = lake && p.z > PIER_END &&
      (abs(p.x) < 16.0 || (p.x > -62.0 && p.x < -15.0 && p.z < -1410.0 && p.z > -1470.0));
    bool water = lake && !pier;
    if (lake) { ax = abs(p.x); cz = 99.0; }

    float dRoad = min(ax, cz);
    float road = water ? 0.0 : 1.0 - smoothstep(7.0 - aa, 7.0 + aa, dRoad);
    float walk = water ? 0.0 : (1.0 - road) * (1.0 - smoothstep(11.0 - aa, 11.0 + aa, dRoad));
    if (pier) walk = 1.0 - road;

    // ---- surface ----
    float n = fbm(p.xz * 0.11);
    float puddle = smoothstep(0.5, 0.68, n);
    float grain = vnoise(p.xz * 7.0);

    vec3 albedo = vec3(0.012);                                   // lots
    albedo = mix(albedo, vec3(0.05, 0.05, 0.055) * (0.8 + 0.4 * grain), walk);
    albedo = mix(albedo, vec3(0.02, 0.02, 0.023) * (0.7 + 0.6 * grain), road);
    if (pier) {
      float plank = 1.0 - smoothstep(0.0, 0.03, abs(fract(p.z * 1.6) - 0.5) - 0.46);
      albedo = mix(albedo, albedo * 0.45, plank * walk);
    } else {
      // pavement joints
      vec2 j = abs(fract(p.xz / 2.4) - 0.5);
      albedo *= 1.0 - walk * 0.35 * smoothstep(0.47, 0.5, max(j.x, j.y)) * (1.0 - smoothstep(20.0, 120.0, dist));
    }
    if (water) albedo = vec3(0.002, 0.004, 0.009);

    // ---- markings ----
    float markFade = 1.0 - smoothstep(40.0, 340.0, dist);
    float mark = 0.0;
    float yellow = 0.0;
    if (!water) {
      float along = step(11.0, cz);   // avenue stretch, clear of the intersection
      float across = step(11.0, ax);
      float centreA = band(ax - 0.2, 0.075, aa) * along;
      float centreC = band(cz - 0.2, 0.075, aa) * across;
      yellow = max(centreA, centreC);
      float dashA = band(ax - 3.5, 0.075, aa) * step(fract(p.z / 9.0), 0.36) * along;
      float dashC = band(cz - 3.5, 0.075, aa) * step(fract(p.x / 9.0), 0.36) * across;
      float edgeA = band(ax - 6.75, 0.06, aa) * along * 0.6;
      float zebraA = band(cz - 9.0, 1.3, aa) * step(ax, 6.4) * step(fract(p.x / 1.3), 0.5);
      float zebraC = band(ax - 9.0, 1.3, aa) * step(cz, 6.4) * step(fract(p.z / 1.3), 0.5);
      mark = max(max(dashA, dashC), max(edgeA, max(zebraA, zebraC)));
      if (pier) { mark = 0.0; yellow = band(abs(p.x) - 6.9, 0.07, aa); }
    }
    mark *= markFade; yellow *= markFade;
    float worn = 0.55 + 0.45 * vnoise(p.xz * 1.7);
    albedo = mix(albedo, vec3(0.42, 0.42, 0.4) * worn, mark);
    albedo = mix(albedo, vec3(0.5, 0.3, 0.035) * worn, yellow);

    // ---- light arriving at the ground ----
    float lampOn = smoothstep(0.1, 0.42, uNight);
    vec3 lamp = vec3(0.7, 0.82, 1.0); // white LED street lighting
    vec3 E = skyBase(vec3(0.0, 1.0, 0.0)) * 1.2 + skyBase(vec3(0.0, 0.12, 1.0)) * 0.22;
    if (!water) {
      float dzl = mod(p.z, 40.0) - 20.0;
      float dxl = mod(p.x, 40.0) - 20.0;
      // Squared by multiplication: pow() of a negative base is undefined in GLSL.
      float da = ax - 6.0;
      float dc = cz - 6.0;
      float la = exp(-(da * da + dzl * dzl) / 52.0);
      float lc = lake ? 0.0 : exp(-(dc * dc + dxl * dxl) / 52.0);
      E += lamp * (la + lc) * 4.4 * lampOn;
    }

    // headlights and tail glow of the car
    vec2 q = p.xz - uCar.xz;
    float f = -q.y;
    float l = q.x;
    float spread = 1.1 + 0.2 * max(f, 0.0);
    float beam = smoothstep(2.4, 5.5, f) * exp(-max(f, 0.0) / 26.0) * exp(-(l * l) / (2.0 * spread * spread));
    E += vec3(1.0, 0.96, 0.88) * beam * 16.0 * uBeam;
    float ft = f + 4.4;
    float tail = exp(-(ft * ft) / 5.0) * exp(-(l * l) / 3.2);
    E += vec3(1.0, 0.07, 0.04) * tail * 2.0;

    for (int i = 0; i < 4; i++) {
      vec2 gd = p.xz - uGlowPos[i].xy;
      float r = uGlowPos[i].z;
      E += uGlowCol[i] * exp(-dot(gd, gd) / (2.0 * r * r));
    }

    // contact shadow under the car
    vec2 cs = abs(q - vec2(0.0, 0.12)) - vec2(0.82, 2.82);
    float shadow = 1.0 - 0.85 * (1.0 - smoothstep(-0.2, 0.9, max(cs.x, cs.y)));
    vec3 col = albedo * E * shadow;

    // ---- reflection ----
    float wet = mix(0.45, 1.0, puddle);
    wet = mix(wet * 0.45, wet, road);
    if (water) wet = 1.0;
    wet *= 1.0 - 0.5 * max(mark, yellow);

    vec2 uv = vUvP.xy / vUvP.w;
    vec2 nrm;
    float smear;
    if (water) {
      vec2 wp = p.xz * vec2(0.09, 0.3);
      nrm = vec2(vnoise(wp + vec2(uTime * 0.25, 0.0)), vnoise(wp * 1.7 - vec2(0.0, uTime * 0.2))) - 0.5;
      nrm *= 0.05;
      smear = 0.09;
    } else {
      // Fine grit breaks the mirror up; puddles stay glassy.
      nrm = (vec2(vnoise(p.xz * 17.0), vnoise(p.xz * 17.0 + 31.0)) - 0.5) * 0.012 * (1.0 - puddle * 0.9);
      nrm += (vec2(vnoise(p.xz * 1.3), vnoise(p.xz * 1.3 + 7.0)) - 0.5) * 0.004;
      smear = 0.05 * (1.0 - puddle * 0.55);
    }
    if (uRain > 0.01 && dist < 46.0 && !water) {
      float nearK = uRain * (1.0 - smoothstep(22.0, 46.0, dist));
      nrm += (ripple(p.xz * 1.9) + ripple(p.xz * 1.9 + 17.3)) * 0.016 * nearK;
    }
    float persp = 1.0 / (1.0 + dist * 0.05);
    uv += nrm * (0.25 + persp);
    vec3 refl = vec3(0.0);
    float wsum = 0.0;
    for (int i = -3; i <= 3; i++) {
      float t = float(i) / 3.0;
      float w = exp(-t * t * 2.2);
      refl += texture2D(tDiffuse, uv + vec2(0.0, t * smear)).rgb * w;
      wsum += w;
    }
    refl /= wsum;
    vec3 R = reflect(-V, vec3(0.0, 1.0, 0.0));
    vec3 skyRefl = skyBase(normalize(R + vec3(nrm.x, 0.0, nrm.y) * 3.0));
    refl = mix(skyRefl, refl, uReflect);
    if (!water) {
      // Tarmac texture shows through wherever it is merely damp.
      float tex = 0.45 + 0.55 * vnoise(p.xz * 26.0);
      wet *= mix(tex * 0.6, 1.0, puddle);
    }

    float fres = 0.04 + 0.86 * pow(clamp(1.0 - V.y, 0.0, 1.0), 4.0);
    col += refl * fres * wet * shadow;

    // ---- dispatch-map overlay ----
    if (uDispatch > 0.001 && !lake) {
      vec3 peri = vec3(0.26, 0.33, 1.0);
      vec3 coral = vec3(1.0, 0.17, 0.1);
      float lines = max(band(ax, 0.45, aa), band(cz, 0.45, aa));
      vec3 over = peri * lines * 0.5;

      float route = band(p.x - uCar.x, 1.1, aa) * step(p.z, uCar.z - 3.0);
      float dash = 0.55 + 0.45 * sin(p.z * 0.35 + uTime * 5.0);
      over += coral * route * dash * 2.6;

      vec2 cell = vec2(floor(p.x / 80.0 + 0.5), floor(p.z / 80.0));
      vec2 centre = vec2(cell.x * 80.0, cell.y * 80.0 + 40.0);
      float h = hash21(cell);
      if (h > 0.68) {
        float r = length(p.xz - centre);
        float phase = fract(uTime * 0.45 + h * 9.0);
        float ring = band(r - phase * 24.0, 0.7, aa * 2.0) * (1.0 - phase);
        float dotc = 1.0 - smoothstep(1.6, 2.2, r);
        vec3 pin = h > 0.86 ? coral : vec3(0.3, 0.95, 0.5);
        over += pin * (ring * 2.2 + dotc * 2.0);
      }
      // Our car: a steady ring and a ping, so it is easy to find from above.
      float cr = length(p.xz - uCar.xz);
      float cph = fract(uTime * 0.6);
      over += coral * (band(cr - 7.0, 0.55, aa * 2.0) * 2.4 + band(cr - 7.0 - cph * 14.0, 0.6, aa * 2.0) * (1.0 - cph) * 2.0);
      col += over * uDispatch;
    }

    col = applyFog(col, p, 1.0);
    gl_FragColor = vec4(col * color, 1.0);
  }
`;

export function createGround(shared: SharedUniforms, textureScale: number): Ground {
  const glowPos = [new Vector4(), new Vector4(), new Vector4(), new Vector4()].map((v) =>
    v.set(0, 0, 1, 0),
  );
  const glowCol = [new Vector3(), new Vector3(), new Vector3(), new Vector3()];

  const mesh = new Reflector(new PlaneGeometry(4200, 4200), {
    clipBias: 0.003,
    textureWidth: Math.max(256, Math.floor(window.innerWidth * textureScale)),
    textureHeight: Math.max(256, Math.floor(window.innerHeight * textureScale)),
    multisample: 0,
    color: 0xffffff,
    shader: {
      name: "RideGround",
      uniforms: {
        color: { value: new Color(0xffffff) },
        tDiffuse: { value: null },
        textureMatrix: { value: null },
        uReflect: { value: 1 },
        uBeam: { value: 0 },
        uGlowPos: { value: glowPos },
        uGlowCol: { value: glowCol },
      },
      vertexShader,
      fragmentShader,
    },
  });
  mesh.rotateX(-Math.PI / 2);
  mesh.position.set(0, 0, -640);

  // Reflector clones its uniforms, so wire the shared ones in afterwards.
  const u = (mesh.material as unknown as { uniforms: Record<string, { value: unknown }> }).uniforms;
  u.uTime = shared.uTime;
  u.uNight = shared.uNight;
  u.uFogDensity = shared.uFogDensity;
  u.uCar = shared.uCar;
  u.uDispatch = shared.uDispatch;
  u.uRain = shared.uRain;
  u.uGlowPos = { value: glowPos };
  u.uGlowCol = { value: glowCol };

  const renderMirror = mesh.onBeforeRender;
  const noop = () => {};

  return {
    mesh,
    glows: { pos: glowPos, col: glowCol },
    setReflection(on: boolean) {
      mesh.onBeforeRender = on ? renderMirror : noop;
      u.uReflect.value = on ? 1 : 0;
    },
    setBeam(v: number) {
      u.uBeam.value = v;
    },
  };
}
