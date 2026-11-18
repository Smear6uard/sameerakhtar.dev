// Camera effects. CinePass draws the scene, then adds what a lens would:
// depth of field, motion blur while the car is driving, and shafts of light
// from the low sun. The blur work happens at half resolution and is skipped
// entirely on frames that do not need it. FinalShader tone maps and grades.

import {
  DepthTexture,
  HalfFloatType,
  LinearFilter,
  Matrix4,
  NearestFilter,
  NoBlending,
  ShaderMaterial,
  UnsignedIntType,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  type PerspectiveCamera,
  type Scene,
  type WebGLRenderer,
} from "three";
import { FullScreenQuad, Pass } from "three/examples/jsm/postprocessing/Pass.js";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/** Highlights are capped: one Inf pixel would spread through every blur. */
const SANITISE = /* glsl */ `
  vec3 sanitise(vec3 c) {
    if (any(isnan(c)) || any(isinf(c))) return vec3(0.0);
    return clamp(c, 0.0, 24.0);
  }
`;

const VIEW = /* glsl */ `
  uniform mat4 uCamWorld;
  uniform vec2 uTan;
  vec3 worldAt(vec2 uv, float z) {
    vec3 vp = vec3((uv * 2.0 - 1.0) * uTan, -1.0) * z;
    return (uCamWorld * vec4(vp, 1.0)).xyz;
  }
`;

// Half-size copy of the frame. Alpha carries distance from the camera,
// negative on the car so the motion blur can leave it alone.
const PREFILTER = /* glsl */ `
  uniform sampler2D tScene;
  uniform sampler2D tDepth;
  uniform float uNear;
  uniform float uFar;
  uniform vec3 uCar;
  varying vec2 vUv;
  ${SANITISE}
  ${VIEW}
  void main() {
    vec3 c = sanitise(texture2D(tScene, vUv).rgb);
    float d = texture2D(tDepth, vUv).r * 2.0 - 1.0;
    float z = (2.0 * uNear * uFar) / (uFar + uNear - d * (uFar - uNear));
    vec3 q = worldAt(vUv, z) - uCar;
    float car = step(abs(q.x), 1.25) * step(abs(q.z - 0.12), 3.2) * step(0.05, q.y) * step(q.y, 1.75);
    gl_FragColor = vec4(c, car > 0.5 ? -z : z);
  }
`;

const DOF_TAPS = 20;
const MOTION_TAPS = 12;

const GATHER = /* glsl */ `
  uniform sampler2D tHalf;
  uniform vec2 uTexel;
  uniform float uFocus;
  uniform float uAperture;
  uniform float uMaxRadius;
  uniform float uMotion;
  uniform float uShutter;
  uniform mat4 uPrevViewProj;
  varying vec2 vUv;
  ${VIEW}

  // White noise: what is left after the smoothing pass reads as film grain.
  // A structured dither left a visible weave at this resolution.
  float noise(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  // Blur radius in texels for something z metres away. Sharp for a band
  // either side of the focus plane deep enough to hold the whole car.
  float cocAt(float z) {
    return clamp((abs(z - uFocus) / max(z, 0.3) - 0.32) * 1.5, 0.0, 1.0) * uAperture * uMaxRadius;
  }

  void main() {
    vec4 c0 = texture2D(tHalf, vUv);
    float z0 = abs(c0.a);
    vec3 col = c0.rgb;
    float blend = 0.0;
    float n = noise(gl_FragCoord.xy);

    if (uAperture > 0.001) {
      float r0 = cocAt(z0);
      vec3 acc = c0.rgb;
      float tot = 1.0;
      float ang = n * 6.2831853;
      for (int i = 1; i <= ${DOF_TAPS}; i++) {
        float rad = sqrt(float(i) / ${DOF_TAPS}.0) * uMaxRadius;
        ang += 2.39996323;
        vec4 s = texture2D(tHalf, vUv + vec2(cos(ang), sin(ang)) * rad * uTexel);
        float zs = abs(s.a);
        float rs = cocAt(zs);
        // What is behind cannot smear over something sharp in front of it.
        if (zs > z0) rs = min(rs, r0 * 2.0);
        float m = smoothstep(rad - 0.5, rad + 0.5, rs);
        acc += mix(acc / tot, s.rgb, m);
        tot += 1.0;
      }
      col = acc / tot;
      blend = smoothstep(0.15, 1.1, r0);
    }

    if (uMotion > 0.5 && c0.a > 0.0) {
      vec4 pc = uPrevViewProj * vec4(worldAt(vUv, z0), 1.0);
      if (pc.w > 0.0) {
        vec2 vel = (vUv - (pc.xy / pc.w * 0.5 + 0.5)) * uShutter;
        float len = length(vel);
        vel *= min(1.0, 0.045 / max(len, 1e-5));
        float px = min(len, 0.045) / uTexel.y;
        if (px > 0.35) {
          vec3 acc = col;
          float tot = 1.0;
          for (int i = 0; i < ${MOTION_TAPS}; i++) {
            float t = (float(i) + n) / ${MOTION_TAPS}.0 - 0.5;
            vec4 s = texture2D(tHalf, vUv + vel * t);
            float w = step(0.0, s.a);
            acc += s.rgb * w;
            tot += w;
          }
          float k = smoothstep(0.35, 2.5, px);
          col = mix(col, acc / tot, k);
          blend = max(blend, k);
        }
      }
    }
    gl_FragColor = vec4(col, blend);
  }
`;

const RAY_TAPS = 22;

const RAYS = /* glsl */ `
  uniform sampler2D tHalf;
  uniform vec2 uSun;
  varying vec2 vUv;
  // White noise: what is left after the smoothing pass reads as film grain.
  // A structured dither left a visible weave at this resolution.
  float noise(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  void main() {
    vec2 stride = (uSun - vUv) * (0.92 / ${RAY_TAPS}.0);
    vec2 uv = vUv + stride * noise(gl_FragCoord.xy);
    vec3 acc = vec3(0.0);
    float w = 1.0;
    for (int i = 0; i < ${RAY_TAPS}; i++) {
      vec4 s = texture2D(tHalf, uv);
      // Only open sky lights the air.
      float sky = step(1100.0, s.a);
      acc += max(s.rgb - 0.55, 0.0) * sky * w;
      w *= 0.955;
      uv += stride;
    }
    float fall = 1.0 - smoothstep(0.0, 1.15, length((uSun - vUv) * vec2(1.6, 1.0)));
    gl_FragColor = vec4(acc / ${RAY_TAPS}.0 * fall, 1.0);
  }
`;

const COMPOSITE = /* glsl */ `
  uniform sampler2D tScene;
  uniform sampler2D tBlur;
  uniform sampler2D tRays;
  uniform float uBlur;
  uniform float uRays;
  uniform vec2 uTexel;
  varying vec2 vUv;
  ${SANITISE}
  void main() {
    vec3 c = sanitise(texture2D(tScene, vUv).rgb);
    if (uBlur > 0.5) {
      // A small tent filter: the gather is dithered, this smooths the dither out.
      vec4 o = vec4(uTexel, -uTexel);
      vec4 b = 0.25 * (texture2D(tBlur, vUv + o.xy) + texture2D(tBlur, vUv + o.zy)
        + texture2D(tBlur, vUv + o.xw) + texture2D(tBlur, vUv + o.zw));
      c = mix(c, b.rgb, b.a);
    }
    if (uRays > 0.001) {
      // The shafts are marched with a dithered start at quarter size.
      vec4 o = vec4(uTexel, -uTexel) * 3.0;
      c += 0.25 * uRays * (texture2D(tRays, vUv + o.xy).rgb + texture2D(tRays, vUv + o.zy).rgb
        + texture2D(tRays, vUv + o.xw).rgb + texture2D(tRays, vUv + o.zw).rgb);
    }
    gl_FragColor = vec4(c, 1.0);
  }
`;

function material(fragmentShader: string, uniforms: Record<string, { value: unknown }>) {
  return new ShaderMaterial({
    uniforms,
    vertexShader: VERT,
    fragmentShader,
    depthTest: false,
    depthWrite: false,
    blending: NoBlending,
    toneMapped: false,
  });
}

export interface CineOptions {
  /** MSAA samples for the scene itself. */
  samples: number;
  /** Depth of field, motion blur and light shafts. Off on weak devices. */
  lens: boolean;
}

export class CinePass extends Pass {
  /** Metres to the plane of sharp focus. */
  focus = 10;
  /** 0 = everything sharp, 1 = the background fully thrown out of focus. */
  aperture = 0;
  /** Strength of the light shafts; 0 skips them. */
  rays = 0;
  /** Where the sun is on screen, in uv. */
  readonly sun = new Vector2(0.5, 0.5);
  readonly car = new Vector3();
  /** Turn the lens effects off at run time (adaptive quality). */
  lens: boolean;

  private readonly sceneRT: WebGLRenderTarget;
  private readonly halfRT: WebGLRenderTarget;
  private readonly blurRT: WebGLRenderTarget;
  private readonly raysRT: WebGLRenderTarget;
  private readonly prefilter: ShaderMaterial;
  private readonly gather: ShaderMaterial;
  private readonly raysMat: ShaderMaterial;
  private readonly composite: ShaderMaterial;
  private readonly quad = new FullScreenQuad();
  private readonly viewProj = new Matrix4();
  private readonly prevViewProj = new Matrix4();
  private readonly prevPos = new Vector3();
  private fresh = true;

  constructor(
    private readonly scene: Scene,
    private readonly camera: PerspectiveCamera,
    opts: CineOptions,
  ) {
    super();
    this.lens = opts.lens;
    this.needsSwap = true;

    this.sceneRT = new WebGLRenderTarget(2, 2, { type: HalfFloatType, samples: opts.samples });
    if (opts.lens) {
      const depth = new DepthTexture(2, 2, UnsignedIntType);
      depth.minFilter = depth.magFilter = NearestFilter;
      this.sceneRT.depthTexture = depth;
    }
    const small = (filter: typeof LinearFilter | typeof NearestFilter) =>
      new WebGLRenderTarget(2, 2, {
        type: HalfFloatType,
        depthBuffer: false,
        minFilter: filter,
        magFilter: filter,
      });
    this.halfRT = small(NearestFilter);
    this.blurRT = small(LinearFilter);
    this.raysRT = small(LinearFilter);

    const camWorld = { value: camera.matrixWorld };
    const tan = { value: new Vector2(1, 1) };
    this.prefilter = material(PREFILTER, {
      tScene: { value: this.sceneRT.texture },
      tDepth: { value: this.sceneRT.depthTexture },
      uNear: { value: camera.near },
      uFar: { value: camera.far },
      uCar: { value: this.car },
      uCamWorld: camWorld,
      uTan: tan,
    });
    this.gather = material(GATHER, {
      tHalf: { value: this.halfRT.texture },
      uTexel: { value: new Vector2(1, 1) },
      uFocus: { value: 10 },
      uAperture: { value: 0 },
      uMaxRadius: { value: 6 },
      uMotion: { value: 0 },
      uShutter: { value: 0.55 },
      uPrevViewProj: { value: this.prevViewProj },
      uCamWorld: camWorld,
      uTan: tan,
    });
    this.raysMat = material(RAYS, {
      tHalf: { value: this.halfRT.texture },
      uSun: { value: this.sun },
    });
    this.composite = material(COMPOSITE, {
      tScene: { value: this.sceneRT.texture },
      tBlur: { value: this.blurRT.texture },
      tRays: { value: this.raysRT.texture },
      uBlur: { value: 0 },
      uRays: { value: 0 },
      uTexel: this.gather.uniforms.uTexel,
    });
  }

  setSize(width: number, height: number) {
    const w = Math.max(2, Math.floor(width));
    const h = Math.max(2, Math.floor(height));
    this.sceneRT.setSize(w, h);
    const hw = Math.max(1, w >> 1);
    const hh = Math.max(1, h >> 1);
    this.halfRT.setSize(hw, hh);
    this.blurRT.setSize(hw, hh);
    this.raysRT.setSize(Math.max(1, w >> 2), Math.max(1, h >> 2));
    (this.gather.uniforms.uTexel.value as Vector2).set(1 / hw, 1 / hh);
    // Bokeh size follows the frame, so the look holds at any resolution.
    this.gather.uniforms.uMaxRadius.value = hh * 0.016;
  }

  /** Forget the previous frame, after a cut. */
  cut() {
    this.fresh = true;
  }

  render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget) {
    const { camera } = this;
    renderer.setRenderTarget(this.sceneRT);
    renderer.render(this.scene, camera);

    this.viewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    const moved = this.fresh ? 0 : this.prevPos.distanceTo(camera.position);
    const moving = this.lens && moved > 0.004;
    const focusing = this.lens && this.aperture > 0.01;
    const shafts = this.lens && this.rays > 0.01;

    if (moving || focusing || shafts) {
      const t = Math.tan((camera.fov * Math.PI) / 360);
      (this.prefilter.uniforms.uTan.value as Vector2).set(t * camera.aspect, t);
      this.quad.material = this.prefilter;
      renderer.setRenderTarget(this.halfRT);
      this.quad.render(renderer);
    }
    if (moving || focusing) {
      const u = this.gather.uniforms;
      u.uFocus.value = this.focus;
      u.uAperture.value = focusing ? this.aperture : 0;
      u.uMotion.value = moving ? 1 : 0;
      this.quad.material = this.gather;
      renderer.setRenderTarget(this.blurRT);
      this.quad.render(renderer);
    }
    if (shafts) {
      this.quad.material = this.raysMat;
      renderer.setRenderTarget(this.raysRT);
      this.quad.render(renderer);
    }

    this.composite.uniforms.uBlur.value = moving || focusing ? 1 : 0;
    this.composite.uniforms.uRays.value = shafts ? this.rays : 0;
    this.quad.material = this.composite;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.quad.render(renderer);

    this.prevViewProj.copy(this.viewProj);
    this.prevPos.copy(camera.position);
    this.fresh = false;
  }

  dispose() {
    this.sceneRT.depthTexture?.dispose();
    for (const rt of [this.sceneRT, this.halfRT, this.blurRT, this.raysRT]) rt.dispose();
    for (const m of [this.prefilter, this.gather, this.raysMat, this.composite]) m.dispose();
    this.quad.dispose();
  }
}

/** Tone map, convert to sRGB, then the lens: fringing, vignette and grain. */
export const FinalShader = {
  name: "RideFinal",
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uExposure: { value: 1 },
    /** Extra colour fringing at speed. */
    uFringe: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uExposure;
    uniform float uFringe;
    varying vec2 vUv;

    float hash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }
    vec3 fit(vec3 v) {
      vec3 a = v * (v + 0.0245786) - 0.000090537;
      vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
      return a / b;
    }
    // ACES filmic, the same fit three.js uses.
    vec3 aces(vec3 color) {
      const mat3 inMat = mat3(
        vec3(0.59719, 0.07600, 0.02840),
        vec3(0.35458, 0.90834, 0.13383),
        vec3(0.04823, 0.01566, 0.83777));
      const mat3 outMat = mat3(
        vec3(1.60475, -0.10208, -0.00327),
        vec3(-0.53108, 1.10813, -0.07276),
        vec3(-0.07367, -0.00605, 1.07602));
      color *= uExposure / 0.6;
      return clamp(outMat * fit(inMat * color), 0.0, 1.0);
    }
    vec3 toSrgb(vec3 c) {
      return mix(pow(c, vec3(0.41666)) * 1.055 - 0.055, c * 12.92, vec3(lessThanEqual(c, vec3(0.0031308))));
    }

    void main() {
      vec2 c = vUv - 0.5;
      float r2 = dot(c, c);
      vec2 ca = c * r2 * (0.006 + uFringe);
      vec3 hdr;
      hdr.r = texture2D(tDiffuse, vUv + ca).r;
      hdr.g = texture2D(tDiffuse, vUv).g;
      hdr.b = texture2D(tDiffuse, vUv - ca).b;
      vec3 col = toSrgb(aces(hdr));
      float vig = 1.0 - smoothstep(0.22, 0.92, length(c * vec2(1.0, 1.12)));
      col *= mix(0.58, 1.0, vig);
      col += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) * 0.04;
      col += vec3(0.004, 0.005, 0.011) * (1.0 - col);
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};
