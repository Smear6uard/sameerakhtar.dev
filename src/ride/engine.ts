// The ride engine: renderer, post-processing, quality tiers and the frame
// loop. Framework-free; React only calls createRide() and setProgress().

import {
  ACESFilmicToneMapping,
  Color,
  CubeCamera,
  DirectionalLight,
  FogExp2,
  HalfFloatType,
  HemisphereLight,
  LinearMipmapLinearFilter,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Vector2,
  Vector3,
  WebGLCubeRenderTarget,
  WebGLRenderer,
  WebGLRenderTarget,
  type Material,
  type Object3D,
  type Texture,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import { CAR_X, carDistance, nightAt, smooth, splitProgress } from "./route";
import { createSharedUniforms } from "./shared";
import { sampleShot, type CameraSample } from "./shots";
import { createCar } from "./world/car";
import { createCity } from "./world/city";
import { createGround } from "./world/ground";
import { createRain } from "./world/rain";
import { createSky } from "./world/sky";
import { createStops, type StopSets } from "./world/stops";
import { createStreet } from "./world/street";

export interface Ride {
  /** Position on the hold/drive timeline, see route.splitProgress. */
  setProgress(w: number): void;
  /** Pointer position, each axis in [-1, 1]. */
  setPointer(x: number, y: number): void;
  dispose(): void;
}

export interface RideOptions {
  /** Phones and weak GPUs: no planar reflection, no live car reflections. */
  low: boolean;
  onReady: () => void;
}

const GradeShader = {
  name: "RideGrade",
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 } },
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
    varying vec2 vUv;
    float hash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }
    void main() {
      vec2 c = vUv - 0.5;
      float r2 = dot(c, c);
      vec2 ca = c * r2 * 0.006;
      vec3 col;
      col.r = texture2D(tDiffuse, vUv + ca).r;
      col.g = texture2D(tDiffuse, vUv).g;
      col.b = texture2D(tDiffuse, vUv - ca).b;
      float vig = 1.0 - smoothstep(0.22, 0.92, length(c * vec2(1.0, 1.12)));
      col *= mix(0.58, 1.0, vig);
      col += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) * 0.04;
      col += vec3(0.004, 0.005, 0.011) * (1.0 - col);
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

/**
 * Mirror-smooth clearcoat can throw a specular spike past what a half-float
 * holds. One such pixel becomes Inf, and the bloom blur spreads it into a
 * black frame, so highlights are capped before bloom sees them.
 */
const ClampShader = {
  name: "RideClamp",
  uniforms: { tDiffuse: { value: null } },
  vertexShader: GradeShader.vertexShader,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main() {
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      if (any(isnan(c)) || any(isinf(c))) c = vec3(0.0);
      gl_FragColor = vec4(clamp(c, 0.0, 24.0), 1.0);
    }
  `,
};

const FOG_NIGHT = new Color(0.01, 0.016, 0.04);

function disposeTree(root: Object3D) {
  root.traverse((obj) => {
    const mesh = obj as Mesh;
    mesh.geometry?.dispose?.();
    const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as (
      | Material
      | undefined
    )[];
    for (const m of mats) {
      if (!m) continue;
      const map = (m as Material & { map?: Texture | null }).map;
      map?.dispose?.();
      m.dispose();
    }
  });
}

export function createRide(canvas: HTMLCanvasElement, opts: RideOptions): Ride {
  const { low } = opts;
  let disposed = false;

  const renderer = new WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
  });
  let pixelRatio = Math.min(window.devicePixelRatio || 1, low ? 1.25 : 1.5);
  renderer.setPixelRatio(pixelRatio);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new Scene();
  const fogColor = new Color();
  scene.fog = new FogExp2(0x000000, 0.0013);
  const camera = new PerspectiveCamera(40, 1, 0.12, 4200);
  scene.add(camera);

  const shared = createSharedUniforms();
  const sky = createSky(shared);
  const ground = createGround(shared, low ? 0.3 : 0.55);
  const city = createCity(shared);
  const car = createCar();
  const street = createStreet(low);
  const rain = createRain(shared, low ? 500 : 1500);
  scene.add(sky, ground.mesh, city, car.group, street.group, rain.mesh);
  ground.setReflection(!low);

  // Set pieces draw sign text, so they wait for the display font.
  let stops: StopSets | null = null;
  const fonts = [
    '900 64px "Big Shoulders Display"',
    '800 64px "Big Shoulders Display"',
    '500 40px "JetBrains Mono"',
  ];
  const fontsReady = Promise.all(fonts.map((f) => document.fonts.load(f))).catch(() => undefined);
  const timeout = new Promise((resolve) => window.setTimeout(resolve, 2500));
  void Promise.race([fontsReady, timeout]).then(() => {
    if (disposed) return;
    stops = createStops(shared, ground);
    scene.add(stops.group);
  });

  // Light for the few physically shaded things: the car and the boutique.
  const hemi = new HemisphereLight(0x8b9cff, 0x05060a, 0.35);
  const sun = new DirectionalLight(0xff8a5c, 0);
  scene.add(hemi, sun, sun.target);

  // The car mirrors its surroundings through a small live cube map.
  const cubeTarget = new WebGLCubeRenderTarget(low ? 64 : 128, {
    type: HalfFloatType,
    generateMipmaps: true,
    minFilter: LinearMipmapLinearFilter,
  });
  const cubeCamera = new CubeCamera(0.4, 2600, cubeTarget);
  scene.add(cubeCamera);
  car.setEnvMap(cubeTarget.texture);
  const proxyGround = new Mesh(
    new PlaneGeometry(600, 600),
    new MeshBasicMaterial({ color: 0x020203, fog: false }),
  );
  proxyGround.rotation.x = -Math.PI / 2;
  proxyGround.visible = false;
  scene.add(proxyGround);

  // Post: bloom in HDR, tone map, then a light grade.
  const composer = new EffectComposer(
    renderer,
    new WebGLRenderTarget(1, 1, { type: HalfFloatType, samples: low ? 0 : 4 }),
  );
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new ShaderPass(ClampShader));
  const bloom = new UnrealBloomPass(new Vector2(1, 1), 0.42, 0.62, 1.2);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const grade = new ShaderPass(GradeShader);
  composer.addPass(grade);

  const size = new Vector2();
  const resize = () => {
    const w = Math.max(2, canvas.clientWidth || window.innerWidth);
    const h = Math.max(2, canvas.clientHeight || window.innerHeight);
    if (w === size.x && h === size.y) return;
    size.set(w, h);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(w, h, false);
    composer.setPixelRatio(pixelRatio);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  // State.
  let target = 0;
  let w = -1; // snaps to the first reported value
  const pointer = new Vector2();
  const pointerSmooth = new Vector2();
  const sample: CameraSample = { offset: new Vector3(), look: new Vector3(), fov: 40 };
  const carPos = new Vector3(CAR_X, 0, 0);
  const lookAt = new Vector3();
  const right = new Vector3();
  let prevDist = 0;
  let speed = 0;
  let time = 0;
  let last = 0;
  let frame = 0;
  let raf = 0;
  let ready = false;

  // Adaptive quality: step down if the frame rate cannot hold.
  let slowMs = 0;
  let measured = 0;
  let step = 0;
  const stepDown = () => {
    step += 1;
    if (step === 1) {
      pixelRatio = Math.min(pixelRatio, 1);
      size.set(0, 0);
      resize();
    } else if (step === 2) {
      ground.setReflection(false);
    }
  };

  const renderFrame = (now: number) => {
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    time += dt;
    frame += 1;

    if (frame > 90 && step < 2 && !low) {
      slowMs += dt * 1000;
      measured += 1;
      if (measured >= 75) {
        if (slowMs / measured > 27) stepDown();
        slowMs = 0;
        measured = 0;
      }
    }

    w = w < 0 ? target : w + (target - w) * (1 - Math.exp(-dt * 3.4));
    const p = splitProgress(w);
    const night = nightAt(p.u);
    const dist = carDistance(p.u);
    speed += ((dist - prevDist) / Math.max(dt, 0.001) - speed) * 0.2;
    car.roll(dist - prevDist);
    prevDist = dist;
    carPos.z = -dist;
    car.group.position.copy(carPos);

    shared.uTime.value = time;
    shared.uNight.value = night;
    shared.uCar.value.copy(carPos);
    const uEased = p.hold ? p.stop : p.stop + smooth(p.t);
    shared.uDispatch.value =
      smooth(Math.min(1, Math.max(0, (uEased - 1.5) / 0.45))) *
      (1 - smooth(Math.min(1, Math.max(0, (uEased - 2.05) / 0.4))));

    // Camera.
    sampleShot(p, sample);
    // On a portrait screen there is no room to hold the car off to one side.
    if (camera.aspect < 1) sample.look.x *= 0.35;
    pointerSmooth.lerp(pointer, 1 - Math.exp(-dt * 2.5));
    camera.position.copy(carPos).add(sample.offset);
    lookAt.copy(carPos).add(sample.look);
    const reach = Math.min(1, sample.offset.length() / 12);
    right.set(sample.look.z - sample.offset.z, 0, -(sample.look.x - sample.offset.x)).normalize();
    const sway = Math.sin(time * 0.31) * 0.04 + Math.sin(time * 0.83) * 0.015;
    camera.position.addScaledVector(right, -(pointerSmooth.x * 0.45 + sway) * (0.4 + reach));
    camera.position.y = Math.max(0.3, camera.position.y + pointerSmooth.y * 0.18 * (0.4 + reach));
    const narrow = camera.aspect < 1 ? 1.32 : camera.aspect < 1.4 ? 1.12 : 1;
    const fov = Math.min(75, sample.fov * narrow);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(lookAt);
    sky.position.copy(camera.position);

    // Atmosphere.
    const high = smooth(Math.min(1, Math.max(0, (camera.position.y - 30) / 220)));
    shared.uFogDensity.value = 0.001 * (1 - 0.72 * high);
    fogColor.setRGB(0.2, 0.12, 0.2).lerp(FOG_NIGHT, night);
    (scene.fog as FogExp2).color.copy(fogColor);
    (scene.fog as FogExp2).density = shared.uFogDensity.value;
    sun.intensity = 1.8 * (1 - night);
    sun.position.set(carPos.x + 3, 6, carPos.z + 60);
    sun.target.position.copy(carPos);
    hemi.intensity = 0.4 - 0.2 * night;
    ground.setBeam(0.35 + 0.65 * night);
    // Looking straight into the headlights would white the frame out.
    const facing = Math.max(0, -sample.offset.z / Math.max(1, sample.offset.length()));
    car.setBeams((0.25 + 0.75 * night) * (1 - 0.9 * smooth(Math.min(1, facing / 0.9))));
    car.setBrake(speed < 1.5 ? 1 : 0);
    const rainAmount = smooth(Math.min(1, Math.max(0, (night - 0.55) / 0.45))) * (1 - high);
    rain.setAmount(rainAmount);
    street.update(time, night, shared.uDispatch.value);
    stops?.update(time, night);

    // Car reflections.
    const every = low || step >= 2 ? 24 : 3;
    if (frame % every === 1 || frame < 3) {
      cubeCamera.position.set(carPos.x, 1.0, carPos.z);
      car.group.visible = false;
      ground.mesh.visible = false;
      rain.mesh.visible = false;
      proxyGround.position.set(carPos.x, 0, carPos.z);
      proxyGround.visible = true;
      cubeCamera.update(renderer, scene);
      proxyGround.visible = false;
      ground.mesh.visible = true;
      car.group.visible = true;
      rain.mesh.visible = rainAmount > 0.01;
    }

    grade.uniforms.uTime.value = time;
    composer.render(dt);

    if (!ready && frame >= 2) {
      ready = true;
      opts.onReady();
    }
  };
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    renderFrame(now);
  };

  const start = () => {
    if (raf || disposed) return;
    last = 0;
    raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };
  if (import.meta.env.DEV) {
    // Handle for poking at the scene from the console while developing.
    (window as unknown as Record<string, unknown>).__ride = {
      renderer,
      scene,
      camera,
      composer,
      shared,
      bloom,
      /** Jump straight to a timeline position and draw it, without easing. */
      snap(value: number) {
        target = value;
        w = -1;
        last = 0;
        for (let i = 0; i < 4; i++) renderFrame(performance.now());
      },
    };
  }
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);
  start();

  return {
    setProgress(value) {
      target = value;
    },
    setPointer(x, y) {
      pointer.set(x, y);
    },
    dispose() {
      disposed = true;
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
      disposeTree(scene);
      cubeTarget.dispose();
      ground.mesh.dispose();
      composer.dispose();
      renderer.dispose();
    },
  };
}
