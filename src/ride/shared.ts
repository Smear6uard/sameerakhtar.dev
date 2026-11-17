// Uniforms and GLSL shared by every custom material in the ride, plus a
// helper for drawing sign text to a texture.

import { CanvasTexture, LinearFilter, SRGBColorSpace, Vector3 } from "three";

export interface SharedUniforms {
  uTime: { value: number };
  /** 0 sunset, 1 night. */
  uNight: { value: number };
  uFogDensity: { value: number };
  /** Car position in world space. */
  uCar: { value: Vector3 };
  /** 0..1, how strongly the dispatch-map overlay is drawn on the streets. */
  uDispatch: { value: number };
}

export function createSharedUniforms(): SharedUniforms {
  return {
    uTime: { value: 0 },
    uNight: { value: 0 },
    uFogDensity: { value: 0.001 },
    uCar: { value: new Vector3() },
    uDispatch: { value: 0 },
  };
}

export const GLSL_NOISE = /* glsl */ `
float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}
float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + 11.7;
    a *= 0.5;
  }
  return v;
}
`;

/** Sky gradient without sun, clouds or stars. Doubles as the fog colour so
 *  distant geometry dissolves into whatever sky is behind it. Linear RGB. */
export const GLSL_SKY = /* glsl */ `
uniform float uNight;
vec3 skyBase(vec3 d) {
  float y = max(d.y, 0.0);
  vec2 az = normalize(d.xz + vec2(1e-5));
  float west = clamp(az.y * 0.5 + 0.5, 0.0, 1.0);
  float w2 = pow(west, 2.2);
  float hz = exp(-y * 5.5);
  float mid = exp(-y * 2.0);

  vec3 zen = vec3(0.014, 0.024, 0.095);
  vec3 midc = mix(vec3(0.055, 0.05, 0.16), vec3(0.46, 0.105, 0.22), w2);
  vec3 hor = mix(vec3(0.1, 0.085, 0.2), vec3(1.4, 0.4, 0.16), w2);
  vec3 dusk = mix(zen, midc, mid);
  dusk = mix(dusk, hor, hz);

  vec3 nzen = vec3(0.0012, 0.0026, 0.012);
  vec3 nhor = mix(vec3(0.012, 0.02, 0.055), vec3(0.05, 0.02, 0.05), w2) + vec3(0.006, 0.008, 0.014);
  vec3 night = mix(nzen, nhor, hz);

  return mix(dusk, night, uNight);
}
`;

export const GLSL_FOG = /* glsl */ `
uniform float uFogDensity;
vec3 applyFog(vec3 col, vec3 worldPos, float keep) {
  vec3 toP = worldPos - cameraPosition;
  float dist = length(toP);
  float f = 1.0 - exp(-pow(dist * uFogDensity, 2.0));
  vec3 dir = normalize(vec3(toP.x, max(toP.y, 0.0) * 0.25 + 4.0, toP.z));
  return mix(col, skyBase(dir) * 0.6, f * keep);
}
`;

/** Linear-RGB palette shared by JS-side materials. */
export const LIN = {
  coral: [0.93, 0.147, 0.095],
  periwinkle: [0.26, 0.33, 1.0],
  sodium: [1.0, 0.48, 0.147],
  bone: [0.905, 0.863, 0.791],
  mint: [0.212, 0.745, 0.381],
} as const;

let glow: CanvasTexture | null = null;

/** Soft radial falloff used for lamp halos and light glows. */
export function glowTexture(): CanvasTexture {
  if (glow) return glow;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.18, "rgba(255,255,255,0.55)");
    g.addColorStop(0.5, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  }
  glow = new CanvasTexture(c);
  return glow;
}

export interface SignOptions {
  width: number;
  height: number;
  /** CSS font shorthand, e.g. `900 120px "Big Shoulders Display"`. */
  font: string;
  color?: string;
  background?: string;
  /** Letter spacing in px. */
  tracking?: number;
  /** Stack one character per line (theatre blade signs). */
  vertical?: boolean;
  lineHeight?: number;
}

/** Draws lines of text to a canvas texture for illuminated signs. */
export function signTexture(lines: string[], opts: SignOptions): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = opts.width;
  canvas.height = opts.height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = opts.background ?? "#000";
    ctx.fillRect(0, 0, opts.width, opts.height);
    ctx.fillStyle = opts.color ?? "#fff";
    ctx.font = opts.font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if ("letterSpacing" in ctx) {
      (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
        `${opts.tracking ?? 0}px`;
    }
    const rows = opts.vertical ? lines.join("").split("") : lines;
    const lh = opts.lineHeight ?? opts.height / (rows.length + 0.4);
    const top = opts.height / 2 - (lh * (rows.length - 1)) / 2;
    rows.forEach((row, i) => {
      ctx.fillText(row, opts.width / 2 + (opts.tracking ?? 0) / 2, top + i * lh);
    });
  }
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.minFilter = LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}
