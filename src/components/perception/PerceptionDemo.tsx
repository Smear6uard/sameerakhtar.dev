"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SampleOverlay } from "./SampleOverlay";
import { LiveDemo } from "./LiveDemo";

type Mode = { kind: "sample" } | { kind: "live" } | { kind: "unsupported"; reason: string };

export function PerceptionDemo() {
  const [mode, setMode] = useState<Mode>({ kind: "sample" });
  const [isInView, setIsInView] = useState(true);
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
  const [showMobileTip, setShowMobileTip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pause the inference loop when scrolled out of view. The LiveDemo loop
  // reads `isInView` via ref and skips inference while false, so resume is
  // instant when the section scrolls back.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.05,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px) and (orientation: portrait)");
    const update = () => setIsMobilePortrait(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleActivate = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setMode({ kind: "unsupported", reason: "camera access unavailable" });
      return;
    }
    if (isMobilePortrait) {
      setShowMobileTip(true);
      // Auto-hide the tip after 4s — it's a guidance hint, not blocking.
      window.setTimeout(() => setShowMobileTip(false), 4000);
    }
    setMode({ kind: "live" });
  }, [isMobilePortrait]);

  const handleStop = useCallback(() => {
    setMode({ kind: "sample" });
    setShowMobileTip(false);
  }, []);

  const handleUnsupported = useCallback((reason: string) => {
    setMode({ kind: "unsupported", reason });
  }, []);

  const handleLowPerformance = useCallback(() => {
    setMode({
      kind: "unsupported",
      reason: "live demo unavailable on this device · showing sample",
    });
  }, []);

  const isLive = mode.kind === "live";

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={containerRef}
        className="relative aspect-square w-full overflow-hidden rounded-lg border border-white/[0.06] bg-bg-secondary"
      >
        {/* Sample is always mounted as the visual fallback. Live overlays it. */}
        <SampleOverlay />

        {isLive && (
          <LiveDemo
            isInView={isInView}
            onUnsupported={handleUnsupported}
            onLowPerformance={handleLowPerformance}
          />
        )}

        {!isLive && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-accent bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
              sample · hand_landmarks · 21 keypoints
            </span>
          </div>
        )}

        {showMobileTip && isLive && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-3 left-3 right-3 z-10"
          >
            <span className="block font-mono text-[10px] uppercase tracking-widest text-white/80 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
              tip: hold your phone steady, palm facing camera
            </span>
          </motion.div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        {mode.kind === "unsupported" ? (
          <>
            <p className="font-mono text-xs text-text-muted">{mode.reason}</p>
            <button
              type="button"
              onClick={handleActivate}
              className="btn-secondary text-sm"
              aria-label="Retry activating camera for hand tracking"
            >
              try again ↩
            </button>
          </>
        ) : isLive ? (
          <button
            type="button"
            onClick={handleStop}
            className="btn-secondary text-sm"
            aria-label="Stop camera and return to the sample state"
          >
            stop camera ↩
          </button>
        ) : (
          <button
            type="button"
            onClick={handleActivate}
            className="btn-primary text-sm"
            aria-label="Activate camera and run hand-landmark detection live"
          >
            use my camera →
          </button>
        )}
      </div>
    </div>
  );
}
