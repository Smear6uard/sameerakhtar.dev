import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** Extra reach beyond the element's own edge, in px. */
  radius?: number;
  /** Maximum displacement, in px. */
  strength?: number;
}

/**
 * Pulls the child toward the pointer as it approaches, not only once it is
 * already over the element. Listens on the window (rAF-throttled) so the
 * effect starts from a distance. No-op on touch and under reduced motion.
 */
export function Magnetic({ children, className = "", radius = 80, strength = 7 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 170, damping: 16, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 170, damping: 16, mass: 0.5 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last: { x: number; y: number } | null = null;

    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el || !last) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = last.x - cx;
      const dy = last.y - cy;
      const d = Math.hypot(dx, dy);
      const reach = radius + Math.max(rect.width, rect.height) / 2;
      if (d < reach) {
        const s = 1 - d / reach;
        x.set(clamp(dx * 0.2 * s, strength));
        y.set(clamp(dy * 0.2 * s, strength));
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const onMove = (e: PointerEvent) => {
      last = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [radius, strength, x, y]);

  return (
    <motion.span ref={ref} className={`inline-block ${className}`} style={{ x: sx, y: sy }}>
      {children}
    </motion.span>
  );
}

function clamp(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value));
}
