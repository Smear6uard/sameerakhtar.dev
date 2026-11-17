import { useEffect, useRef, useState } from "react";
import type { Ride } from "@/ride/engine";
import { LAST_STOP, MAX_PROGRESS } from "@/ride/route";
import { rideStore } from "@/ride/store";

function webglAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

/**
 * Maps scroll position to the ride timeline. Each `[data-stop]` section owns
 * a hold while it crosses the middle of the viewport; the gap before the next
 * section is the drive between them.
 */
function measure(sections: HTMLElement[]) {
  const vh = window.innerHeight;
  const y = window.scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - vh);
  const spans = sections.map((el, i) => {
    const rect = el.getBoundingClientRect();
    const start = i === 0 ? 0 : rect.top + y - vh * 0.55;
    const end = i === sections.length - 1 ? max : rect.bottom + y - vh * 0.45;
    return { start, end: Math.max(end, start + 1) };
  });
  for (let i = 0; i < spans.length; i++) {
    const { start, end } = spans[i];
    if (y <= end) return 2 * i + Math.min(1, Math.max(0, (y - start) / (end - start)));
    const next = spans[i + 1];
    if (next && y < next.start) return 2 * i + 1 + (y - end) / Math.max(1, next.start - end);
  }
  return MAX_PROGRESS;
}

/** The fixed 3D stage behind the home page, plus its static fallback. */
export function RideCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "off">("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-stop]"));
    if (!canvas || sections.length === 0) return;

    let ride: Ride | null = null;
    let cancelled = false;
    let queued = 0;

    const update = () => {
      queued = 0;
      const w = measure(sections);
      ride?.setProgress(w);
      const stop = Math.min(Math.floor(w / 2), LAST_STOP);
      const driving = w - stop * 2 > 1 && stop < LAST_STOP;
      const t = driving ? w - stop * 2 - 1 : 0;
      rideStore.set(driving && t > 0.5 ? stop + 1 : stop);
      document.documentElement.style.setProperty("--ride-p", ((stop + t) / LAST_STOP).toFixed(4));
    };
    const schedule = () => {
      if (!queued) queued = requestAnimationFrame(update);
    };
    const onPointer = (e: PointerEvent) => {
      ride?.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pointermove", onPointer, { passive: true });
    // Section heights settle after fonts load.
    const settle = new ResizeObserver(schedule);
    settle.observe(document.body);
    update();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !webglAvailable()) {
      setState("off");
    } else {
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
      const low =
        window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 760 || memory < 4;
      import("@/ride/engine")
        .then(({ createRide }) => {
          if (cancelled) return;
          ride = createRide(canvas, { low, onReady: () => !cancelled && setState("ready") });
          update();
        })
        .catch(() => !cancelled && setState("off"));
    }

    return () => {
      cancelled = true;
      if (queued) cancelAnimationFrame(queued);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onPointer);
      settle.disconnect();
      ride?.dispose();
      rideStore.set(0);
      document.documentElement.style.removeProperty("--ride-p");
    };
  }, []);

  return (
    <div className="ride-stage" data-state={state} aria-hidden="true">
      <canvas ref={canvasRef} className="ride-canvas" />
      <div className="ride-scrim" />
    </div>
  );
}
