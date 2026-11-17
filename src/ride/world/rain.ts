// Light rain: streaks in a box that follows the camera.

import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  LineSegments,
  ShaderMaterial,
} from "three";
import type { SharedUniforms } from "../shared";

export interface Rain {
  mesh: LineSegments;
  setAmount(v: number): void;
}

export function createRain(shared: SharedUniforms, count: number): Rain {
  const S = 44;
  const H = 22;
  const pos: number[] = [];
  const end: number[] = [];
  const speed: number[] = [];
  let seed = 3;
  const rnd = () => {
    seed = (seed * 48271) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < count; i++) {
    const x = rnd() * S;
    const y = rnd() * H;
    const z = rnd() * S;
    const sp = rnd();
    pos.push(x, y, z, x, y, z);
    end.push(0, 1);
    speed.push(sp, sp);
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
  geo.setAttribute("aEnd", new Float32BufferAttribute(end, 1));
  geo.setAttribute("aSpeed", new Float32BufferAttribute(speed, 1));

  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: shared.uTime, uAmount: { value: 0 } },
    vertexShader: /* glsl */ `
      attribute float aEnd;
      attribute float aSpeed;
      uniform float uTime;
      varying float vAlpha;
      const float S = ${S.toFixed(1)};
      const float H = ${H.toFixed(1)};
      void main() {
        float fall = uTime * (19.0 + aSpeed * 9.0);
        vec3 p;
        p.x = mod(position.x - cameraPosition.x, S) - S * 0.5 + cameraPosition.x;
        p.z = mod(position.z - cameraPosition.z, S) - S * 0.5 + cameraPosition.z;
        p.y = mod(position.y - fall, H) + cameraPosition.y - H * 0.45;
        p.y += aEnd * (0.5 + aSpeed * 0.4);
        p.x += aEnd * 0.05;
        float d = distance(p, cameraPosition);
        vAlpha = (1.0 - aEnd * 0.85) * (1.0 - smoothstep(S * 0.2, S * 0.5, d)) * step(0.0, p.y);
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uAmount;
      varying float vAlpha;
      void main() {
        gl_FragColor = vec4(vec3(0.55, 0.62, 0.8) * vAlpha * uAmount * 0.5, 1.0);
      }
    `,
  });
  const mesh = new LineSegments(geo, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = 6;
  return {
    mesh,
    setAmount(v) {
      material.uniforms.uAmount.value = v;
      mesh.visible = v > 0.01;
    },
  };
}
