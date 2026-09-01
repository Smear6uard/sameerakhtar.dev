// Loads MediaPipe's HandLandmarker on the main thread.
//
// Why not a worker: the tasks-vision runtime loads its WASM glue through
// `importScripts`, which does not exist inside module workers, and its
// fallback (`document.createElement("script")`) has no `document` in a
// worker either. Main-thread + GPU delegate is MediaPipe's supported path
// and is also faster, since frames never have to be copied out of the tab.

import type { HandLandmarker } from "@mediapipe/tasks-vision";

export const MEDIAPIPE_VERSION = "0.10.35";
const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export type Delegate = "GPU" | "CPU";

export interface LoadedLandmarker {
  instance: HandLandmarker;
  delegate: Delegate;
}

let pending: Promise<LoadedLandmarker> | null = null;

/** Memoised so a second "try again" or re-mount is instant. */
export function loadHandLandmarker(): Promise<LoadedLandmarker> {
  if (!pending) {
    pending = create().catch((error) => {
      pending = null;
      throw error;
    });
  }
  return pending;
}

async function create(): Promise<LoadedLandmarker> {
  const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");
  const fileset = await FilesetResolver.forVisionTasks(WASM_URL);

  const options = (delegate: Delegate) => ({
    baseOptions: { modelAssetPath: MODEL_URL, delegate },
    runningMode: "VIDEO" as const,
    numHands: 2,
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  let loaded: LoadedLandmarker;
  try {
    const instance = await HandLandmarker.createFromOptions(fileset, options("GPU"));
    loaded = { instance, delegate: "GPU" };
  } catch {
    const instance = await HandLandmarker.createFromOptions(fileset, options("CPU"));
    loaded = { instance, delegate: "CPU" };
  }
  warmUp(loaded.instance);
  return loaded;
}

// The first inference compiles shaders and can take several seconds. Run it
// on a blank frame while the camera is still starting so the first real
// frame is not a multi-second stall.
function warmUp(instance: HandLandmarker) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    canvas.getContext("2d")?.fillRect(0, 0, 64, 64);
    instance.detectForVideo(canvas, performance.now());
  } catch {
    /* warm-up is best effort */
  }
}
