import { useCallback, useEffect, useRef, useState } from "react";
import { SampleOverlay } from "./SampleOverlay";
import { LiveDemo, type LiveStats } from "./LiveDemo";
import type { Delegate } from "./landmarker";

type Mode =
  | { kind: "sample" }
  | { kind: "starting" }
  | { kind: "live"; delegate: Delegate }
  | { kind: "error"; reason: string };

const DEFAULT_SIZE = { width: 800, height: 600 };

export function PerceptionDemo() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [mode, setMode] = useState<Mode>({ kind: "sample" });
  const [isInView, setIsInView] = useState(true);
  const [stats, setStats] = useState<LiveStats>({ fps: 0, inferenceMs: 0, hands: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Real pixel size drives the SVG viewBox so keypoints stay circular.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.05,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const start = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setMode({ kind: "error", reason: "This browser doesn't expose a camera." });
      return;
    }
    setStats({ fps: 0, inferenceMs: 0, hands: 0 });
    setMode({ kind: "starting" });
  }, []);

  const stop = useCallback(() => setMode({ kind: "sample" }), []);
  const handleReady = useCallback((delegate: Delegate) => setMode({ kind: "live", delegate }), []);
  const handleError = useCallback((reason: string) => setMode({ kind: "error", reason }), []);
  const handleStats = useCallback((next: LiveStats) => setStats(next), []);

  const isLive = mode.kind === "live";
  const isStarting = mode.kind === "starting";
  const cameraMounted = isLive || isStarting;

  // The sample hand turns toward the pointer; touch and live mode leave it still.
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (cameraMounted || e.pointerType === "touch") return;
      const rect = e.currentTarget.getBoundingClientRect();
      setTilt({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    },
    [cameraMounted],
  );
  const handlePointerLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  const readout = isLive
    ? `live · ${stats.fps.toFixed(0)} fps · ${stats.inferenceMs.toFixed(0)} ms · ${mode.delegate.toLowerCase()}`
    : isStarting
      ? "starting"
      : "sample";

  return (
    <figure className="m-0">
      <div
        className="rounded-2xl p-px"
        style={{
          background:
            "linear-gradient(135deg, rgba(247,107,87,0.6), rgba(244,239,230,0.08) 45%, rgba(139,156,255,0.45))",
          boxShadow: "0 0 70px -18px var(--glow), var(--shadow)",
        }}
      >
        <div
          ref={panelRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="ticks relative aspect-[4/3] w-full overflow-hidden rounded-[15px] bg-panel"
          style={{
            backgroundImage:
              "radial-gradient(120% 90% at 50% 60%, rgba(247,107,87,0.08), transparent 60%), linear-gradient(rgba(244,239,230,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(244,239,230,0.05) 1px, transparent 1px)",
            backgroundSize: "100% 100%, 40px 40px, 40px 40px",
            backgroundPosition: "center, center, center",
          }}
        >
          <span className="tick" aria-hidden="true" />

          {!isLive && (
            <SampleOverlay width={size.width} height={size.height} tilt={tilt} dim={isStarting} />
          )}

          {cameraMounted && (
            <LiveDemo
              width={size.width}
              height={size.height}
              isInView={isInView}
              onReady={handleReady}
              onStats={handleStats}
              onError={handleError}
            />
          )}

          {/* Readout */}
          <div
            className="pointer-events-none absolute inset-x-8 top-3.5 flex items-center justify-between gap-3 font-mono text-[10.5px] tracking-[0.14em] uppercase"
            style={{ color: "rgba(244,239,230,0.62)" }}
          >
            <span className="truncate">
              hand_landmarker<span className="hidden sm:inline"> · 21 keypoints</span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              {isLive && (
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "#f76b57" }}
                  aria-hidden="true"
                />
              )}
              {readout}
            </span>
          </div>

          {/* Error */}
          {mode.kind === "error" && (
            <div
              role="status"
              className="absolute inset-x-6 bottom-20 rounded-xl border px-4 py-3 text-sm backdrop-blur-md"
              style={{
                background: "rgba(6,16,31,0.85)",
                borderColor: "rgba(230,241,255,0.15)",
                color: "#e6f1ff",
              }}
            >
              {mode.reason}
            </div>
          )}

          {/* Controls */}
          <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-center justify-between gap-3">
            {cameraMounted ? (
              <button type="button" onClick={stop} className="btn btn-sm btn-ghost !text-[#f4efe6]">
                Stop camera
              </button>
            ) : (
              <button type="button" onClick={start} className="btn btn-sm btn-primary">
                {mode.kind === "error" ? "Try again" : "Try it with your camera"}
                <span aria-hidden="true">→</span>
              </button>
            )}
            <span
              className="font-mono text-[10.5px] tracking-[0.1em] uppercase"
              style={{ color: "rgba(244,239,230,0.5)" }}
            >
              <span className="hidden sm:inline">Runs in your browser · </span>nothing uploaded
            </span>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-ink-3">
        Hand tracking with MediaPipe Hand Landmarker on WebAssembly and WebGL, entirely in this tab.
        Two hands, 21 keypoints each, inference paused when scrolled away.
      </figcaption>
    </figure>
  );
}
