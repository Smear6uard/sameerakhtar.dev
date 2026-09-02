import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Dot + trailing ring cursor. Desktop pointers only; native cursor stays. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { damping: 28, stiffness: 320, mass: 0.6 });
  const ringY = useSpring(y, { damping: 28, stiffness: 320, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      setHovering(Boolean(target?.closest("a, button, [role=button], input, textarea, label")));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[90] h-1.5 w-1.5 rounded-full bg-accent"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[90] rounded-full border border-accent/60"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? 44 : 28,
          height: hovering ? 44 : 28,
          opacity: hovering ? 0.9 : 0.6,
        }}
        transition={{ duration: 0.18 }}
        aria-hidden="true"
      />
    </>
  );
}
