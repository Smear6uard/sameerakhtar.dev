"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKonamiCode } from "@/hooks/useKonamiCode";

interface DevStats {
  loadTime: number;
  framework: string;
  styling: string;
  animations: string;
  hosting: string;
  buildSize: string;
}

export function KonamiEasterEgg() {
  const [showDevMode, setShowDevMode] = useState(false);
  const [stats, setStats] = useState<DevStats | null>(null);
  const [matrixActive, setMatrixActive] = useState(false);

  const handleActivate = useCallback(() => {
    setShowDevMode(true);
    setMatrixActive(true);

    // Gather performance stats
    const loadTime =
      typeof window !== "undefined" && window.performance ? Math.round(performance.now()) : 0;

    setStats({
      loadTime,
      framework: "Next.js 15 + React 19",
      styling: "Tailwind CSS + CSS Variables",
      animations: "Framer Motion + GSAP",
      hosting: "Vercel Edge Network",
      buildSize: "~180KB gzipped",
    });

    // Auto-hide after 10 seconds
    setTimeout(() => {
      setMatrixActive(false);
    }, 3000);
  }, []);

  const { reset } = useKonamiCode(handleActivate);

  const handleClose = () => {
    setShowDevMode(false);
    setMatrixActive(false);
    reset();
  };

  // Matrix rain effect characters
  const matrixChars = "アイウエオカキクケコサシスセソタチツテト01";

  return (
    <>
      {/* Matrix rain overlay */}
      <AnimatePresence>
        {matrixActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <MatrixColumn key={i} chars={matrixChars} delay={i * 0.1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Developer Mode Panel */}
      <AnimatePresence>
        {showDevMode && stats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-8 right-8 z-[9999] max-w-sm"
          >
            <div className="bg-bg-primary/95 backdrop-blur-xl border border-accent/30 rounded-lg p-6 shadow-2xl shadow-accent/10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <h3 className="font-mono text-sm font-bold text-accent uppercase tracking-wider">
                    Developer Mode
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  className="text-text-muted hover:text-accent transition-colors"
                  aria-label="Close developer mode"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Stats */}
              <div className="space-y-3 font-mono text-xs">
                <StatRow label="Page Load" value={`${stats.loadTime}ms`} />
                <StatRow label="Framework" value={stats.framework} />
                <StatRow label="Styling" value={stats.styling} />
                <StatRow label="Animations" value={stats.animations} />
                <StatRow label="Hosting" value={stats.hosting} />
                <StatRow label="Bundle" value={stats.buildSize} />
              </div>

              {/* Secret message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 pt-4 border-t border-white/10 text-xs text-text-muted"
              >
                You found the secret! Type <span className="text-accent font-mono">↑↑↓↓←→←→BA</span>{" "}
                anytime to toggle this panel.
              </motion.p>

              {/* Easter egg hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-2 text-xs text-text-muted/60 italic"
              >
                There might be more secrets hidden...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex justify-between items-center"
    >
      <span className="text-text-muted">{label}</span>
      <span className="text-text-primary">{value}</span>
    </motion.div>
  );
}

function MatrixColumn({ chars, delay }: { chars: string; delay: number }) {
  const [drops, setDrops] = useState<string[]>([]);

  useEffect(() => {
    const generateDrops = () => {
      const newDrops = Array.from({ length: 20 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length)),
      );
      setDrops(newDrops);
    };

    generateDrops();
    const interval = setInterval(generateDrops, 100);
    return () => clearInterval(interval);
  }, [chars]);

  const left = Math.random() * 100;

  return (
    <motion.div
      initial={{ y: "-100%" }}
      animate={{ y: "100vh" }}
      transition={{
        duration: 2 + Math.random() * 2,
        delay,
        ease: "linear",
      }}
      className="absolute font-mono text-accent/60 text-sm whitespace-nowrap"
      style={{ left: `${left}%` }}
    >
      {drops.map((char, i) => (
        <div
          key={i}
          style={{
            opacity: 1 - i * 0.05,
            textShadow: i === 0 ? "0 0 10px #f97316" : "none",
          }}
        >
          {char}
        </div>
      ))}
    </motion.div>
  );
}
