// Fireworks over the lake for the last stop. Every spark is a point whose
// whole flight is worked out in the vertex shader from the time alone, so
// the show costs one draw call and nothing on the CPU.

import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  ShaderMaterial,
  Vector2,
} from "three";
import { GLSL_NOISE, type SharedUniforms } from "../shared";

export interface Fireworks {
  mesh: Points;
  /** 0..1: the show fades in as the car nears the pier. */
  setAmount(v: number): void;
}

const SHELLS = 7;
const SPARKS = 96;
/** Each spark is drawn a few times at slightly earlier moments: its trail. */
const TRAIL = 4;

export function createFireworks(shared: SharedUniforms): Fireworks {
  const pos: number[] = [];
  const dir: number[] = [];
  const info: number[] = [];
  let seed = 11;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let s = 0; s < SHELLS; s++) {
    for (let i = 0; i < SPARKS; i++) {
      // Even spread over a sphere.
      const y = 1 - (2 * (i + 0.5)) / SPARKS;
      const r = Math.sqrt(1 - y * y);
      const a = i * 2.39996323 + s;
      const speed = 0.78 + rnd() * 0.3;
      for (let t = 0; t < TRAIL; t++) {
        pos.push(0, 0, 0);
        dir.push(Math.cos(a) * r, y, Math.sin(a) * r);
        info.push(s, speed, t);
      }
    }
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
  geo.setAttribute("aDir", new Float32BufferAttribute(dir, 3));
  geo.setAttribute("aInfo", new Float32BufferAttribute(info, 3));

  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: shared.uTime, uAmount: { value: 0 }, uScale: { value: 1000 } },
    vertexShader: /* glsl */ `
      attribute vec3 aDir;
      attribute vec3 aInfo;
      uniform float uTime;
      uniform float uScale;
      varying vec3 vCol;
      ${GLSL_NOISE}

      vec3 palette(float h) {
        if (h < 0.24) return vec3(1.0, 0.2, 0.12);
        if (h < 0.48) return vec3(0.3, 0.4, 1.0);
        if (h < 0.7) return vec3(1.0, 0.62, 0.2);
        if (h < 0.86) return vec3(1.0, 0.88, 0.7);
        return vec3(0.25, 0.9, 0.5);
      }

      void main() {
        float shell = aInfo.x;
        // Shells go up one after another, each on its own beat.
        float period = 3.4 + hash11(shell * 3.7) * 2.4;
        float clock = (uTime + shell * 1.9) / period;
        float turn = floor(clock);
        float t = fract(clock) * period - aInfo.z * 0.07;
        float id = shell * 17.0 + turn * 5.3;

        vec3 centre = vec3(
          mix(-115.0, 115.0, hash11(id + 1.1)),
          mix(52.0, 112.0, hash11(id + 2.3)),
          mix(-1375.0, -1285.0, hash11(id + 3.7)));
        float reach = mix(22.0, 38.0, hash11(id + 4.9));
        float life = 2.5;

        float spread = 1.0 - exp(-2.4 * max(t, 0.0));
        vec3 p = centre + aDir * reach * aInfo.y * spread;
        p.y -= 5.5 * t * t;

        float alive = step(0.0, t) * step(t, life);
        float fade = pow(clamp(1.0 - t / life, 0.0, 1.0), 1.6);
        float glitter = 0.6 + 0.4 * sin(uTime * 31.0 + aDir.x * 90.0 + aDir.z * 50.0);
        // The outer sparks of some shells burn a second colour.
        float two = step(0.55, hash11(id + 6.1)) * step(1.0, aInfo.y);
        vec3 col = mix(palette(hash11(id + 7.3)), palette(hash11(id + 8.9)), two);
        // White hot at the moment of the burst.
        col = mix(col, vec3(1.0, 0.95, 0.85), exp(-t * 5.0));
        vCol = col * alive * fade * glitter * (1.0 - aInfo.z * 0.24) * 5.0;

        vec4 mv = viewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float px = 0.75 * uScale / max(-mv.z, 1.0);
        float size = clamp(px, 1.5, 28.0);
        gl_PointSize = size;
        vCol *= min(1.0, (px * px) / (size * size));
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uAmount;
      varying vec3 vCol;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float a = 1.0 - smoothstep(0.02, 0.25, dot(c, c));
        gl_FragColor = vec4(vCol * a * uAmount, 1.0);
      }
    `,
  });

  const mesh = new Points(geo, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = 3;
  mesh.visible = false;
  const target = new Vector2();
  mesh.onBeforeRender = (renderer, _scene, camera) => {
    const rt = renderer.getRenderTarget();
    const height = rt ? rt.height : renderer.getDrawingBufferSize(target).y;
    material.uniforms.uScale.value = height * camera.projectionMatrix.elements[5] * 0.5;
    material.uniformsNeedUpdate = true;
  };

  return {
    mesh,
    setAmount(v) {
      material.uniforms.uAmount.value = v;
      mesh.visible = v > 0.01;
    },
  };
}
