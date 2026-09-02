import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MEDIAPIPE_VERSION } from "@/components/perception/landmarker";
import { site } from "@/lib/site";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

const CONFETTI = Array.from({ length: 22 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i % 7) * 60}ms`,
  color: ["var(--accent)", "var(--sky)", "var(--peach)", "var(--live)"][i % 4],
  size: 5 + (i % 3) * 2,
}));

/** ↑↑↓↓←→←→BA opens a small build-info card with a burst of confetti. */
export function Konami() {
  const [open, setOpen] = useState(false);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    let position = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === SEQUENCE[position]) {
        position += 1;
        if (position === SEQUENCE.length) {
          position = 0;
          setOpen(true);
          setBurst((n) => n + 1);
        }
      } else {
        position = e.code === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  const rows: [string, string][] = [
    ["framework", "TanStack Start · React 19 · Vite 7"],
    ["styling", "Tailwind v4 · CSS tokens"],
    ["type", "Satoshi · JetBrains Mono"],
    ["hand demo", `MediaPipe ${MEDIAPIPE_VERSION} · WASM + WebGL`],
    ["hosting", "Vercel"],
    ["last shipped", formatBuildTime()],
  ];

  return (
    <>
      <AnimatePresence>
        {burst > 0 && (
          <div
            key={burst}
            className="pointer-events-none fixed inset-x-0 top-0 z-[95] h-screen overflow-hidden"
            aria-hidden="true"
          >
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className="confetti absolute -top-3 rounded-sm"
                style={{
                  left: c.left,
                  width: c.size,
                  height: c.size * 1.6,
                  background: c.color,
                  animationDelay: c.delay,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="glass fixed right-4 bottom-4 z-[96] w-[min(22rem,calc(100vw-2rem))] p-5"
            role="dialog"
            aria-label="Developer mode"
          >
            <div className="flex items-center justify-between">
              <p className="section-title !text-xs">dev mode</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="link-quiet text-sm"
                aria-label="Close developer mode"
              >
                esc
              </button>
            </div>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-xs">
              {rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-ink-3">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-ink-3">
              You found it. The whole site is{" "}
              <a href={site.sourceRepo} target="_blank" rel="noopener noreferrer" className="link">
                open source ↗
              </a>
              , camera demo included.
            </p>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function formatBuildTime() {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "America/Chicago",
    }).format(new Date(__BUILD_TIME__));
  } catch {
    return "unknown";
  }
}
