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
  PointLight,
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
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import { CinePass, FinalShader } from "./post";
import { CAR_X, PIER_END_Z, WEST_Z, carDistance, nightAt, smooth, splitProgress } from "./route";
import { createSharedUniforms } from "./shared";
import { sampleShot, type CameraSample } from "./shots";
import { createCar } from "./world/car";
import { createCity } from "./world/city";
import { createFireworks } from "./world/fireworks";
import { createGround } from "./world/ground";
import { createRain } from "./world/rain";
import { createSigns } from "./world/signs";
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

const FOG_NIGHT = new Color(0.01, 0.016, 0.04);
const LAMP_POWER = 420;

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
  const fireworks = createFireworks(shared);
  scene.add(sky, ground.mesh, city, car.group, street.group, rain.mesh, fireworks.mesh);
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
    const sets = createStops(shared, ground);
    const signs = createSigns();
    car.dress();
    // Compiled before they join the scene, so they do not stall a frame.
    void Promise.all([precompile(sets.group), precompile(signs)]).then(() => {
      if (disposed) return;
      stops = sets;
      scene.add(sets.group, signs);
    });
  });

  // Light for the few physically shaded things: the car and the boutique.
  const hemi = new HemisphereLight(0x8b9cff, 0x05060a, 0.35);
  const sun = new DirectionalLight(0xff8a5c, 0);
  const moon = new DirectionalLight(0x9fb4ff, 0);
  scene.add(hemi, sun, sun.target, moon, moon.target);
  // The four street lamps nearest the car are real lights, so their
  // highlights slide along the bodywork as it passes under them.
  const lampLights = [0, 1, 2, 3].map(() => {
    const light = new PointLight(0xbcd4ff, 0, 42, 1.7);
    scene.add(light);
    return light;
  });

  // The car mirrors its surroundings through a small live cube map.
  const cubeTarget = new WebGLCubeRenderTarget(low ? 64 : 192, {
    type: HalfFloatType,
    generateMipmaps: true,
    minFilter: LinearMipmapLinearFilter,
  });
  const cubeCamera = new CubeCamera(0.4, 2600, cubeTarget);
  scene.add(cubeCamera);
  // Its six faces are drawn a couple per frame rather than all at once, so
  // the cost is spread evenly instead of landing on every third frame.
  cubeCamera.coordinateSystem = renderer.coordinateSystem;
  cubeCamera.updateCoordinateSystem();
  const cubeFaces = cubeCamera.children as PerspectiveCamera[];
  let cubeFace = 0;
  car.setEnvMap(cubeTarget.texture);
  street.setEnvMap(cubeTarget.texture);
  const proxyGround = new Mesh(
    new PlaneGeometry(600, 600),
    new MeshBasicMaterial({ color: 0x020203, fog: false }),
  );
  proxyGround.rotation.x = -Math.PI / 2;
  proxyGround.visible = false;
  scene.add(proxyGround);

  // Materials compile differently for an off-screen target, which is where
  // the scene is always drawn, so that is what the warm-up targets.
  const warmTarget = new WebGLRenderTarget(1, 1);
  const precompile = (root: Object3D) => {
    renderer.setRenderTarget(warmTarget);
    const done = renderer.compileAsync(root, camera, scene).catch(() => undefined);
    renderer.setRenderTarget(null);
    return done;
  };

  // Post: the lens, bloom in HDR, then tone map and grade.
  const composer = new EffectComposer(
    renderer,
    new WebGLRenderTarget(1, 1, { type: HalfFloatType }),
  );
  const cine = new CinePass(scene, camera, { samples: low ? 0 : 4, lens: !low });
  composer.addPass(cine);
  const bloom = new UnrealBloomPass(new Vector2(1, 1), 0.42, 0.62, 1.2);
  composer.addPass(bloom);
  const grade = new ShaderPass(FinalShader);
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
  const sample: CameraSample = {
    offset: new Vector3(),
    look: new Vector3(),
    fov: 40,
    focus: 0,
    aperture: 0,
  };
  const sunDir = new Vector3();
  const sunPoint = new Vector3();
  const forward = new Vector3();
  const carPos = new Vector3(CAR_X, 0, 0);
  const lookAt = new Vector3();
  const right = new Vector3();
  let prevDist = 0;
  let speed = 0;
  let accel = 0;
  let pitch = 0;
  let pitchVel = 0;
  let hazard = 0;
  let time = 0;
  let last = 0;
  let frame = 0;
  let raf = 0;
  let ready = false;
  let compiled = false;
  /** Dev only: a free camera around the car, set from the console. */
  let orbit: { ang: number; rad: number; y: number; lookY: number; fov: number } | null = null;

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
      cine.lens = false;
    } else if (step === 3) {
      ground.setReflection(false);
    }
  };

  const renderFrame = (now: number) => {
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    time += dt;
    frame += 1;

    if (frame > 90 && step < 3 && !low) {
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
    const prevSpeed = speed;
    speed += ((dist - prevDist) / Math.max(dt, 0.001) - speed) * 0.2;
    accel += ((speed - prevSpeed) / Math.max(dt, 0.001) - accel) * 0.15;
    car.roll(dist - prevDist);
    prevDist = dist;
    carPos.z = -dist;
    car.group.position.copy(carPos);
    // The body squats under power and dips on the brakes, on a soft spring.
    const lean = Math.min(0.018, Math.max(-0.014, -accel * 0.0006));
    pitchVel += ((lean - pitch) * 60 - pitchVel * 9) * dt;
    pitch += pitchVel * dt;
    car.setPose(pitch, -Math.abs(pitch) * 0.6);
    // Waiting at the kerb with the hazards on.
    const waiting = p.stop === 0 ? 1 - Math.min(1, p.u * 5) : 0;
    const blink = time % 1.2 < 0.6 ? waiting : 0;
    hazard += (blink - hazard) * (1 - Math.exp(-dt * 16));
    car.setHazard(hazard);

    shared.uTime.value = time;
    shared.uNight.value = night;
    shared.uCar.value.copy(carPos);
    const uEased = p.hold ? p.stop : p.stop + smooth(p.t);
    shared.uDispatch.value =
      smooth(Math.min(1, Math.max(0, (uEased - 1.5) / 0.45))) *
      (1 - smooth(Math.min(1, Math.max(0, (uEased - 2.05) / 0.4))));

    // Camera.
    sampleShot(p, sample);
    if (orbit) {
      const a = (orbit.ang * Math.PI) / 180;
      sample.offset.set(Math.sin(a) * orbit.rad, orbit.y, -Math.cos(a) * orbit.rad);
      sample.look.set(0, orbit.lookY, 0);
      sample.fov = orbit.fov;
    }
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
    const rush = orbit ? 0 : smooth(Math.min(1, Math.abs(speed) / 70));
    const fov = Math.min(78, sample.fov * narrow + 5 * rush);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(lookAt);
    camera.updateMatrixWorld();
    sky.position.copy(camera.position);

    // Lens.
    cine.car.copy(carPos);
    cine.focus = sample.focus > 0 ? sample.focus : camera.position.distanceTo(car.group.position);
    cine.aperture = orbit ? 0 : sample.aperture;
    sunDir.set(0.06, 0.035 - night * 0.12, 1).normalize();
    sunPoint.copy(camera.position).addScaledVector(sunDir, 1000).project(camera);
    cine.sun.set(sunPoint.x * 0.5 + 0.5, sunPoint.y * 0.5 + 0.5);
    const toSun = camera.getWorldDirection(forward).dot(sunDir);
    cine.rays = (1 - night) * (1 - night) * smooth(Math.min(1, Math.max(0, (toSun - 0.3) / 0.5)));
    grade.uniforms.uFringe.value = 0.012 * rush;

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
    moon.intensity = 0.7 * night;
    moon.position.set(carPos.x - 26, 34, carPos.z - 44);
    moon.target.position.copy(carPos);
    const lampOn = Math.min(1, Math.max(0, (night - 0.1) / 0.32));
    const nearest = Math.round((carPos.z - 20) / 40) * 40 + 20;
    const next = carPos.z < nearest ? nearest - 40 : nearest + 40;
    lampLights.forEach((light, i) => {
      const z = i < 2 ? nearest : next;
      const side = i % 2 ? 1 : -1;
      // Mirrors the gaps in createLamps.
      const standing =
        z <= WEST_Z - 20 &&
        z >= PIER_END_Z + 20 &&
        !(z < -1210 && z > -1310) &&
        !(side > 0 && z < -1490);
      light.position.set(side * 6.2, 7.9, z);
      light.intensity = standing ? LAMP_POWER * lampOn : 0;
    });
    ground.setBeam(0.35 + 0.65 * night);
    // Looking straight into the headlights would white the frame out.
    const facing = Math.max(0, -sample.offset.z / Math.max(1, sample.offset.length()));
    car.setBeams((0.25 + 0.75 * night) * (1 - 0.9 * smooth(Math.min(1, facing / 0.9))));
    car.setBrake(speed < 1.5 ? 1 : 0);
    const rainAmount = smooth(Math.min(1, Math.max(0, (night - 0.55) / 0.45))) * (1 - high);
    rain.setAmount(rainAmount);
    shared.uRain.value = rainAmount;
    // The show over the lake starts as the car leaves the theatre.
    fireworks.setAmount(smooth(Math.min(1, Math.max(0, (p.u - 4.25) / 0.6))));
    street.update({
      time,
      night,
      dispatch: shared.uDispatch.value,
      carZ: carPos.z,
      camera,
    });
    stops?.update(time, night);

    // Car reflections: the next face or two of the cube map.
    const moving = Math.abs(speed) > 0.5;
    const faces = frame < 4 ? 6 : low || step >= 3 ? (frame % 4 === 0 ? 1 : 0) : moving ? 2 : 1;
    if (faces > 0) {
      cubeCamera.position.set(carPos.x, 1.0, carPos.z);
      cubeCamera.updateMatrixWorld();
      car.group.visible = false;
      street.setEnvPass(true);
      ground.mesh.visible = false;
      rain.mesh.visible = false;
      proxyGround.position.set(carPos.x, 0, carPos.z);
      proxyGround.visible = true;
      for (let i = 0; i < faces; i++) {
        const last = cubeFace === 5;
        // Mip levels and the blurred copy the materials read are rebuilt
        // once per lap, after the sixth face.
        cubeTarget.texture.mipmapsAutoUpdate = last;
        renderer.setRenderTarget(cubeTarget, cubeFace);
        renderer.render(scene, cubeFaces[cubeFace]);
        if (last) cubeTarget.texture.needsPMREMUpdate = true;
        cubeFace = (cubeFace + 1) % 6;
      }
      cubeTarget.texture.mipmapsAutoUpdate = true;
      renderer.setRenderTarget(null);
      proxyGround.visible = false;
      ground.mesh.visible = true;
      street.setEnvPass(false);
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
    if (raf || disposed || !compiled) return;
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
      cine,
      lampLights,
      moon,
      state: () => ({ w, target, step, pixelRatio, speed, compiled, frame }),
      /** Drive from one timeline position to another and hold the last frame. */
      drive(from: number, to: number, frames = 30) {
        stop();
        let now = performance.now();
        last = 0;
        for (let i = 0; i <= frames; i++) {
          target = w = from + ((to - from) * i) / frames;
          renderFrame(now);
          now += 1000 / 60;
        }
      },
      resume: () => start(),
      /** Look at the car from anywhere: degrees round it, metres out, metres up. */
      orbit(ang: number | null, rad = 8, y = 1.4, lookY = 0.8, fov = 36) {
        orbit = ang === null ? null : { ang, rad, y, lookY, fov };
      },
      /** Jump straight to a timeline position and draw it, without easing. */
      snap(value: number) {
        target = value;
        w = -1;
        last = 0;
        for (let i = 0; i < 5; i++) {
          // The jump is a cut, not a drive: no speed, no blur.
          speed = accel = pitch = pitchVel = 0;
          cine.cut();
          renderFrame(performance.now());
        }
      },
    };
  }
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);
  // The first frame waits for the shaders, which compile off the main thread
  // where the browser allows it. The page stays responsive meanwhile.
  const patience = new Promise((resolve) => window.setTimeout(resolve, 5000));
  void Promise.race([precompile(scene), patience]).then(() => {
    compiled = true;
    start();
  });

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
      warmTarget.dispose();
      ground.mesh.dispose();
      cine.dispose();
      composer.dispose();
      renderer.dispose();
    },
  };
}
