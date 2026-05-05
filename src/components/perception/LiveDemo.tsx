"use client";

import { useEffect, useRef, useState } from "react";
import type { HandLandmarker } from "@mediapipe/tasks-vision";
import { HandSkeleton } from "./HandSkeleton";
import type { NormalizedPoint } from "./perception-sample";

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

const FPS_WINDOW = 30;
const LOW_FPS_THRESHOLD = 10;
const LOW_FPS_PROBE_FRAMES = 60;

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
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const vfcRef = useRef<number | null>(null);
  const frameTimesRef = useRef<number[]>([]);
  const probeFramesRef = useRef(0);
  const probeStartRef = useRef(0);
  const lastVideoTimeRef = useRef(-1);
  const isInViewRef = useRef(isInView);

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

      // 1. Camera access
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
      } catch {
        if (!cancelled) onUnsupported("camera access unavailable");
        return;
      }
      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play().catch(() => {
        /* play() can reject on rapid mount/unmount — ignore. */
      });

      // 2. MediaPipe — lazy import keeps the ~10MB cost off the initial bundle.
      let landmarker: HandLandmarker;
      try {
        const { FilesetResolver, HandLandmarker: HandLandmarkerClass } =
          await import("@mediapipe/tasks-vision");
        const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
        landmarker = await HandLandmarkerClass.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
          runningMode: "VIDEO",
          numHands: 2,
        });
      } catch {
        if (!cancelled) onUnsupported("model failed to load");
        return;
      }
      if (cancelled) {
        landmarker.close();
        return;
      }
      landmarkerRef.current = landmarker;

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
      const landmarker = landmarkerRef.current;
      if (!video || !landmarker) return;

      // Only run inference while in view. Keep the loop alive (cheap) so we
      // resume instantly when the section scrolls back.
      if (!isInViewRef.current) {
        scheduleFrame();
        return;
      }

      if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        const now = performance.now();
        try {
          const result = landmarker.detectForVideo(video, now);
          const detected = (result.landmarks ?? []).map((hand) =>
            hand.map((p) => [p.x, p.y] as NormalizedPoint),
          );
          setHands(detected);
        } catch {
          /* Transient detection errors are non-fatal — drop the frame. */
        }

        // FPS rolling average (over the last FPS_WINDOW frames)
        const times = frameTimesRef.current;
        times.push(now);
        if (times.length > FPS_WINDOW) times.shift();
        if (times.length >= 2) {
          const elapsed = (times[times.length - 1] - times[0]) / 1000;
          if (elapsed > 0) setFps((times.length - 1) / elapsed);
        }

        // Low-performance probe over the first LOW_FPS_PROBE_FRAMES
        probeFramesRef.current += 1;
        if (probeFramesRef.current === LOW_FPS_PROBE_FRAMES) {
          const totalElapsed = (now - probeStartRef.current) / 1000;
          const avg = totalElapsed > 0 ? LOW_FPS_PROBE_FRAMES / totalElapsed : 0;
          if (avg < LOW_FPS_THRESHOLD) {
            onLowPerformance();
            return; // Stop scheduling — parent will tear us down.
          }
        }
      }

      scheduleFrame();
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
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
        landmarkerRef.current = null;
      }
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
