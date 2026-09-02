import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

/** Counts up from zero the first time it scrolls into view. */
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1400,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setCurrent(Math.round(value * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        setCurrent(0);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {current.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
