/// <reference lib="webworker" />

import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

const VERSION = "0.10.35";
const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VERSION}/wasm`;
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

let landmarker: HandLandmarker | null = null;

self.onmessage = async (event: MessageEvent) => {
  if (event.data?.type === "init") {
    try {
      const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
      landmarker = await HandLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: "CPU" },
        runningMode: "VIDEO",
        numHands: 2,
        minHandDetectionConfidence: 0.55,
        minHandPresenceConfidence: 0.55,
        minTrackingConfidence: 0.65,
      });
      self.postMessage({ type: "ready" });
    } catch {
      self.postMessage({ type: "error" });
    }
    return;
  }

  if (event.data?.type !== "frame") return;
  const bitmap = event.data.bitmap as ImageBitmap;
  try {
    const result = landmarker?.detectForVideo(bitmap, event.data.timestamp);
    const landmarks = (result?.landmarks ?? []).map((hand) =>
      hand.map((point) => [point.x, point.y] as const),
    );
    self.postMessage({ type: "result", landmarks });
  } catch {
    self.postMessage({ type: "result", landmarks: [] });
  } finally {
    bitmap.close();
  }
};
