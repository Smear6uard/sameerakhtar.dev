// Sky dome: coral sunset in the west fading to a starred indigo night.

import { BackSide, Mesh, ShaderMaterial, SphereGeometry } from "three";
import { GLSL_NOISE, GLSL_SKY, type SharedUniforms } from "../shared";

export function createSky(shared: SharedUniforms): Mesh {
  const material = new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    fog: false,
    uniforms: { uTime: shared.uTime, uNight: shared.uNight },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      varying vec3 vDir;
      ${GLSL_NOISE}
      ${GLSL_SKY}

      void main() {
        vec3 d = normalize(vDir);
        if (d.y < 0.0) {
          // Below the horizon only matters for reflections: keep it dim.
          gl_FragColor = vec4(skyBase(vec3(d.x, 0.0, d.z)) * 0.35, 1.0);
          return;
        }
        vec3 col = skyBase(d);
        float day = 1.0 - uNight;

        // Sun sitting on the western horizon.
        vec3 sunDir = normalize(vec3(0.06, 0.035 - uNight * 0.12, 1.0));
        float sd = max(dot(d, sunDir), 0.0);
        col += vec3(1.9, 0.62, 0.22) * pow(sd, 90.0) * 1.4 * day;
        col += vec3(1.2, 0.3, 0.16) * pow(sd, 9.0) * 0.55 * day;
        col += vec3(6.0, 3.2, 1.4) * smoothstep(0.99965, 0.9998, sd) * day;

        // Streaked cloud deck, lit from underneath by the sunset.
        vec2 cp = d.xz / (d.y + 0.16);
        float c = fbm(cp * vec2(0.55, 1.6) + vec2(uTime * 0.004, 0.0));
        c = smoothstep(0.5, 0.82, c) * smoothstep(0.02, 0.2, d.y) * (1.0 - smoothstep(0.45, 0.9, d.y));
        float west = clamp(normalize(d.xz + vec2(1e-5)).y * 0.5 + 0.5, 0.0, 1.0);
        vec3 cloudLit = mix(vec3(0.07, 0.055, 0.13), vec3(1.5, 0.36, 0.22), pow(west, 3.0));
        vec3 cloudNight = vec3(0.014, 0.013, 0.026);
        col = mix(col, mix(cloudLit, cloudNight, uNight), c * 0.7);

        // Stars.
        vec3 sp = d * 260.0;
        vec3 cell = floor(sp);
        float h = hash21(cell.xy + cell.z * 17.13);
        float star = step(0.9965, h) * (1.0 - smoothstep(0.0, 0.5, length(fract(sp) - 0.5)));
        float twinkle = 0.7 + 0.3 * sin(uTime * 2.0 + h * 400.0);
        col += vec3(0.8, 0.85, 1.0) * star * twinkle * uNight * smoothstep(0.05, 0.3, d.y) * (1.0 - c) * 1.6;

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  const mesh = new Mesh(new SphereGeometry(1, 48, 24), material);
  mesh.scale.setScalar(1800);
  mesh.frustumCulled = false;
  mesh.renderOrder = -10;
  return mesh;
}
