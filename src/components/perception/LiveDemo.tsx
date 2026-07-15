"use client";

import { useEffect, useRef, useState } from "react";
import { HandSkeleton } from "./HandSkeleton";
import type { NormalizedPoint } from "./perception-sample";

const FPS_WINDOW = 30;
const LOW_FPS_THRESHOLD = 10;
const LOW_FPS_PROBE_FRAMES = 60;
const SMOOTHING_ALPHA = 0.55;
const TRACK_RESET_DISTANCE = 0.18;
const MIN_INFERENCE_INTERVAL = 1000 / 20;
const FPS_UPDATE_INTERVAL = 500;
const CAMERA_TIMEOUT = 10000;
const MODEL_TIMEOUT = 25000;

interface LiveDemoProps {
  /** Visible-on-screen state from the parent IntersectionObserver. */
  isInView: boolean;
  /** Called with the measured FPS when the section loads — parent decides
   *  whether to fall back to sample-only mode on slow devices. */
  onLowPerformance: () => void;
  /** Called if the browser, the model, or getUserMedia fails. */
  onUnsupported: (reason: string) => void;
}

export function LiveDemo({ isInView, onLowPerformance, onUnsupported }: LiveDemoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const vfcRef = useRef<number | null>(null);
  const frameTimesRef = useRef<number[]>([]);
  const probeFramesRef = useRef(0);
  const probeStartRef = useRef(0);
  const lastVideoTimeRef = useRef(-1);
  const lastInferenceTimeRef = useRef(0);
  const lastFpsUpdateRef = useRef(0);
  const isInViewRef = useRef(isInView);
  const framePendingRef = useRef(false);
  const smoothedHandsRef = useRef<ReadonlyArray<ReadonlyArray<NormalizedPoint>>>([]);

  const [hands, setHands] = useState<ReadonlyArray<ReadonlyArray<NormalizedPoint>>>([]);
  const [fps, setFps] = useState(0);
  const [status, setStatus] = useState<"loading" | "running" | "error">("loading");

  useEffect(() => {
    isInViewRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    let cancelled = false;
    // Snapshot the video element at effect-start so the cleanup doesn't
    // dereference a possibly-null ref after unmount.
    const videoEl = videoRef.current;

    async function start() {
      if (!videoRef.current) return;

      // Camera permission and model loading can happen concurrently after the
      // user's click. This removes several seconds from the live-demo startup
      // path on slower connections.
      const pendingCamera = navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 24, max: 24 },
        },
        audio: false,
      });
      const worker = new Worker(new URL("./hand-landmarker.worker.ts", import.meta.url), {
        type: "module",
      });
      workerRef.current = worker;
      const pendingModel = initializeWorker(worker);
      const [cameraResult, modelResult] = await Promise.allSettled([
        withTimeout(pendingCamera, CAMERA_TIMEOUT, "camera timed out"),
        withTimeout(pendingModel, MODEL_TIMEOUT, "model timed out"),
      ]);

      if (cameraResult.status === "rejected" || modelResult.status === "rejected") {
        if (cameraResult.status === "fulfilled") {
          cameraResult.value.getTracks().forEach((track) => track.stop());
        }
        worker.terminate();
        workerRef.current = null;
        // A timeout does not cancel the browser operation. Dispose a late
        // result so retries never leave a camera stream or model behind.
        if (cameraResult.status === "rejected") {
          pendingCamera.then(
            (lateStream) => lateStream.getTracks().forEach((track) => track.stop()),
            () => undefined,
          );
        }
        if (!cancelled) {
          onUnsupported(
            cameraResult.status === "rejected"
              ? "camera access unavailable"
              : "hand-tracking model failed to load",
          );
        }
        return;
      }

      const stream = cameraResult.value;
      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        worker.terminate();
        return;
      }
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play().catch(() => {
        /* play() can reject on rapid mount/unmount — ignore. */
      });

      worker.onmessage = handleWorkerMessage;

      probeStartRef.current = performance.now();
      setStatus("running");
      scheduleFrame();
    }

    function scheduleFrame() {
      const video = videoRef.current;
      if (!video) return;
      type WithVFC = HTMLVideoElement & {
        requestVideoFrameCallback?: (cb: () => void) => number;
        cancelVideoFrameCallback?: (handle: number) => void;
      };
      const vfcVideo = video as WithVFC;
      if (typeof vfcVideo.requestVideoFrameCallback === "function") {
        vfcRef.current = vfcVideo.requestVideoFrameCallback(processFrame);
      } else {
        rafRef.current = requestAnimationFrame(processFrame);
      }
    }

    function processFrame() {
      const video = videoRef.current;
      const worker = workerRef.current;
      if (!video || !worker) return;

      // Only run inference while in view. Keep the loop alive (cheap) so we
      // resume instantly when the section scrolls back.
      if (!isInViewRef.current) {
        scheduleFrame();
        return;
      }

      if (
        video.readyState >= 2 &&
        video.currentTime !== lastVideoTimeRef.current &&
        !framePendingRef.current &&
        performance.now() - lastInferenceTimeRef.current >= MIN_INFERENCE_INTERVAL
      ) {
        lastVideoTimeRef.current = video.currentTime;
        const now = performance.now();
        lastInferenceTimeRef.current = now;
        framePendingRef.current = true;
        createImageBitmap(video)
          .then((bitmap) => worker.postMessage({ type: "frame", bitmap, timestamp: now }, [bitmap]))
          .catch(() => {
            framePendingRef.current = false;
          });
      }

      scheduleFrame();
    }

    function handleWorkerMessage(event: MessageEvent) {
      if (event.data?.type !== "result") return;
      framePendingRef.current = false;
      const video = videoRef.current;
      if (!video) return;

      const detected = (event.data.landmarks as NormalizedPoint[][])
        .map((hand) => hand.map(([x, y]) => projectVideoPoint(video, x, y)))
        .filter((hand) => hand.length === 21);
      const smoothed = smoothHands(smoothedHandsRef.current, detected);
      smoothedHandsRef.current = smoothed;
      setHands(smoothed);

      const now = performance.now();
      const times = frameTimesRef.current;
      times.push(now);
      if (times.length > FPS_WINDOW) times.shift();
      if (times.length >= 2 && now - lastFpsUpdateRef.current >= FPS_UPDATE_INTERVAL) {
        const elapsed = (times[times.length - 1] - times[0]) / 1000;
        if (elapsed > 0) {
          setFps((times.length - 1) / elapsed);
          lastFpsUpdateRef.current = now;
        }
      }

      probeFramesRef.current += 1;
      if (probeFramesRef.current === LOW_FPS_PROBE_FRAMES) {
        const totalElapsed = (now - probeStartRef.current) / 1000;
        const avg = totalElapsed > 0 ? LOW_FPS_PROBE_FRAMES / totalElapsed : 0;
        if (avg < LOW_FPS_THRESHOLD) onLowPerformance();
      }
    }

    start().catch(() => {
      if (!cancelled) {
        setStatus("error");
        onUnsupported("initialization failed");
      }
    });

    return () => {
      cancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      const video = videoEl as
        | (HTMLVideoElement & {
            cancelVideoFrameCallback?: (handle: number) => void;
          })
        | null;
      if (vfcRef.current !== null && video?.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(vfcRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      workerRef.current?.terminate();
      workerRef.current = null;
    };
    // Only run once per mount — the loop is owned by this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <video
        ref={videoRef}
        playsInline
        muted
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: "scaleX(-1)" }}
      />
      <HandSkeleton hands={hands} mirrored className="absolute inset-0 h-full w-full" />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-accent animate-breathe">
            loading model…
          </span>
        </div>
      )}
      <div className="absolute bottom-3 left-3 z-10">
        <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-accent bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
          live · hand_landmarks · {fps.toFixed(1)} fps
        </span>
      </div>
    </div>
  );
}

function initializeWorker(worker: Worker): Promise<void> {
  return new Promise((resolve, reject) => {
    worker.onmessage = (event) => {
      if (event.data?.type === "ready") resolve();
      if (event.data?.type === "error") reject(new Error("model failed to load"));
    };
    worker.onerror = () => reject(new Error("worker failed to load"));
    worker.postMessage({ type: "init" });
  });
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error(message)), timeoutMs);
    promise.then(
      (value) => {
        window.clearTimeout(timeout);
        resolve(value);
      },
      (error: unknown) => {
        window.clearTimeout(timeout);
        reject(error);
      },
    );
  });
}

function projectVideoPoint(video: HTMLVideoElement, x: number, y: number): NormalizedPoint {
  const container = video.parentElement;
  const videoWidth = video.videoWidth || video.clientWidth || 1;
  const videoHeight = video.videoHeight || video.clientHeight || 1;
  const containerWidth = container?.clientWidth || video.clientWidth || 1;
  const containerHeight = container?.clientHeight || video.clientHeight || 1;

  const scale = Math.max(containerWidth / videoWidth, containerHeight / videoHeight);
  const renderedWidth = videoWidth * scale;
  const renderedHeight = videoHeight * scale;
  const offsetX = (containerWidth - renderedWidth) / 2;
  const offsetY = (containerHeight - renderedHeight) / 2;

  return [
    clamp01((x * videoWidth * scale + offsetX) / containerWidth),
    clamp01((y * videoHeight * scale + offsetY) / containerHeight),
  ];
}

function smoothHands(
  previousHands: ReadonlyArray<ReadonlyArray<NormalizedPoint>>,
  currentHands: ReadonlyArray<ReadonlyArray<NormalizedPoint>>,
): ReadonlyArray<ReadonlyArray<NormalizedPoint>> {
  if (currentHands.length === 0) return [];

  const available = [...previousHands];
  return currentHands.map((current) => {
    const matchIndex = findNearestHandIndex(available, current);
    if (matchIndex === -1) return current;

    const previous = available.splice(matchIndex, 1)[0];
    if (!previous || wristDistance(previous, current) > TRACK_RESET_DISTANCE) return current;

    return current.map((point, index) => {
      const previousPoint = previous[index];
      if (!previousPoint) return point;
      return [
        previousPoint[0] + (point[0] - previousPoint[0]) * SMOOTHING_ALPHA,
        previousPoint[1] + (point[1] - previousPoint[1]) * SMOOTHING_ALPHA,
      ] as NormalizedPoint;
    });
  });
}

function findNearestHandIndex(
  previousHands: ReadonlyArray<ReadonlyArray<NormalizedPoint>>,
  current: ReadonlyArray<NormalizedPoint>,
): number {
  let bestIndex = -1;
  let bestDistance = Number.POSITIVE_INFINITY;

  previousHands.forEach((previous, index) => {
    const distance = wristDistance(previous, current);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function wristDistance(a: ReadonlyArray<NormalizedPoint>, b: ReadonlyArray<NormalizedPoint>) {
  const aWrist = a[0];
  const bWrist = b[0];
  if (!aWrist || !bWrist) return Number.POSITIVE_INFINITY;
  return Math.hypot(aWrist[0] - bWrist[0], aWrist[1] - bWrist[1]);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}
