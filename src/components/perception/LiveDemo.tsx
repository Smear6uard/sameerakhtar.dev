import { useEffect, useRef, useState } from "react";
import { HandSkeleton } from "./HandSkeleton";
import { loadHandLandmarker, type Delegate } from "./landmarker";
import type { NormalizedPoint } from "./perception-sample";

const SMOOTHING_ALPHA = 0.6;
const TRACK_RESET_DISTANCE = 0.18;
const STATS_INTERVAL = 400;
const FPS_WINDOW = 30;
const CAMERA_TIMEOUT = 15000;
const MODEL_TIMEOUT = 45000;

export interface LiveStats {
  fps: number;
  inferenceMs: number;
  hands: number;
}

interface LiveDemoProps {
  width: number;
  height: number;
  /** Inference pauses while the panel is scrolled out of view. */
  isInView: boolean;
  onReady: (delegate: Delegate) => void;
  onStats: (stats: LiveStats) => void;
  onError: (reason: string) => void;
}

export function LiveDemo({ width, height, isInView, onReady, onStats, onError }: LiveDemoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sizeRef = useRef({ width, height });
  const isInViewRef = useRef(isInView);
  const [hands, setHands] = useState<ReadonlyArray<ReadonlyArray<NormalizedPoint>>>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    sizeRef.current = { width, height };
  }, [width, height]);

  useEffect(() => {
    isInViewRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    // Explicit type: narrowing does not survive into the hoisted `start`.
    const video: HTMLVideoElement = videoEl;

    let cancelled = false;
    let stream: MediaStream | null = null;
    let frameHandle: number | null = null;
    let usingVfc = false;
    let lastVideoTime = -1;
    let lastStatsAt = 0;
    let inferenceEma = 0;
    let smoothed: ReadonlyArray<ReadonlyArray<NormalizedPoint>> = [];
    const frameTimes: number[] = [];

    type VideoWithVfc = HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number;
      cancelVideoFrameCallback?: (handle: number) => void;
    };
    const vfcVideo = video as VideoWithVfc;

    function schedule(tick: () => void) {
      if (typeof vfcVideo.requestVideoFrameCallback === "function") {
        usingVfc = true;
        frameHandle = vfcVideo.requestVideoFrameCallback(tick);
      } else {
        frameHandle = requestAnimationFrame(tick);
      }
    }

    async function start() {
      const cameraRequest = navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 960 },
          height: { ideal: 720 },
          frameRate: { ideal: 30, max: 30 },
        },
        audio: false,
      });

      const [cameraResult, modelResult] = await Promise.allSettled([
        withTimeout(cameraRequest, CAMERA_TIMEOUT, "camera-timeout"),
        withTimeout(loadHandLandmarker(), MODEL_TIMEOUT, "model-timeout"),
      ]);

      if (cameraResult.status === "rejected") {
        // A timeout doesn't cancel the underlying request; release a late stream.
        cameraRequest.then((late) => late.getTracks().forEach((t) => t.stop())).catch(() => {});
        if (!cancelled) onError(describeCameraError(cameraResult.reason));
        return;
      }
      stream = cameraResult.value;

      if (modelResult.status === "rejected") {
        stream.getTracks().forEach((t) => t.stop());
        if (!cancelled) {
          onError("Couldn't load the hand-tracking model. Check your connection and try again.");
        }
        return;
      }

      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      const { instance: landmarker, delegate } = modelResult.value;
      video.srcObject = stream;
      try {
        await video.play();
      } catch {
        /* play() can reject on rapid mount/unmount */
      }
      if (cancelled) return;

      setReady(true);
      onReady(delegate);

      const tick = () => {
        if (cancelled) return;
        if (
          isInViewRef.current &&
          video.readyState >= 2 &&
          video.currentTime !== lastVideoTime &&
          video.videoWidth > 0
        ) {
          lastVideoTime = video.currentTime;
          const t0 = performance.now();
          let landmarks: ReadonlyArray<ReadonlyArray<{ x: number; y: number }>> = [];
          try {
            landmarks = landmarker.detectForVideo(video, t0).landmarks ?? [];
          } catch {
            landmarks = [];
          }
          const t1 = performance.now();

          const { width: w, height: h } = sizeRef.current;
          const detected = landmarks
            .filter((hand) => hand.length === 21)
            .map((hand) =>
              hand.map((p) => projectCover(p.x, p.y, video.videoWidth, video.videoHeight, w, h)),
            );
          smoothed = smoothHands(smoothed, detected);
          setHands(smoothed);

          inferenceEma = inferenceEma === 0 ? t1 - t0 : inferenceEma * 0.85 + (t1 - t0) * 0.15;
          frameTimes.push(t1);
          if (frameTimes.length > FPS_WINDOW) frameTimes.shift();
          if (t1 - lastStatsAt >= STATS_INTERVAL && frameTimes.length >= 2) {
            lastStatsAt = t1;
            const elapsed = (frameTimes[frameTimes.length - 1] - frameTimes[0]) / 1000;
            onStats({
              fps: elapsed > 0 ? (frameTimes.length - 1) / elapsed : 0,
              inferenceMs: inferenceEma,
              hands: smoothed.length,
            });
          }
        }
        schedule(tick);
      };
      schedule(tick);
    }

    start().catch(() => {
      if (!cancelled) onError("Live tracking couldn't start. Try again.");
    });

    return () => {
      cancelled = true;
      if (frameHandle !== null) {
        if (usingVfc && vfcVideo.cancelVideoFrameCallback) {
          vfcVideo.cancelVideoFrameCallback(frameHandle);
        } else {
          cancelAnimationFrame(frameHandle);
        }
      }
      stream?.getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    };
    // Runs once per mount; callbacks are stable refs from the parent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0">
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
        style={{ transform: "scaleX(-1)", opacity: ready ? 1 : 0 }}
      />
      {ready && (
        <HandSkeleton hands={hands} width={width} height={height} className="absolute inset-0" />
      )}
      {!ready && (
        <div className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-2 px-6">
          <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-[rgba(230,241,255,0.7)]">
            Starting camera · loading model (~7 MB)
          </span>
          <span className="relative block h-px w-40 overflow-hidden bg-[rgba(230,241,255,0.15)]">
            <span
              className="absolute inset-y-0 left-0 w-1/3 bg-[#fdba74]"
              style={{ animation: "shimmer 1.4s ease-in-out infinite" }}
            />
          </span>
        </div>
      )}
    </div>
  );
}

function describeCameraError(error: unknown): string {
  const name = error instanceof Error ? error.name : "";
  const message = error instanceof Error ? error.message : "";
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "Camera permission was denied. Allow access in your browser and try again.";
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return "No camera was found on this device.";
  }
  if (name === "NotReadableError") {
    return "The camera is in use by another app.";
  }
  if (message === "camera-timeout") {
    return "The camera didn't respond. Try again.";
  }
  return "Camera access is unavailable here.";
}

function withTimeout<T>(promise: Promise<T>, ms: number, tag: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(tag)), ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        window.clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/** Map a normalized video coordinate onto an object-cover, mirrored panel. */
function projectCover(
  x: number,
  y: number,
  videoWidth: number,
  videoHeight: number,
  panelWidth: number,
  panelHeight: number,
): NormalizedPoint {
  const scale = Math.max(panelWidth / videoWidth, panelHeight / videoHeight);
  const renderedWidth = videoWidth * scale;
  const renderedHeight = videoHeight * scale;
  const offsetX = (panelWidth - renderedWidth) / 2;
  const offsetY = (panelHeight - renderedHeight) / 2;
  const px = (x * renderedWidth + offsetX) / panelWidth;
  const py = (y * renderedHeight + offsetY) / panelHeight;
  return [1 - clamp01(px), clamp01(py)];
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
      const prev = previous[index];
      if (!prev) return point;
      return [
        prev[0] + (point[0] - prev[0]) * SMOOTHING_ALPHA,
        prev[1] + (point[1] - prev[1]) * SMOOTHING_ALPHA,
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
  const aw = a[0];
  const bw = b[0];
  if (!aw || !bw) return Number.POSITIVE_INFINITY;
  return Math.hypot(aw[0] - bw[0], aw[1] - bw[1]);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}
