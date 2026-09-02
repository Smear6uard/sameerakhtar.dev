import { useCallback, type PointerEvent, type ReactNode } from "react";

interface SpotlightProps {
  children: ReactNode;
  className?: string;
  lift?: boolean;
  as?: "div" | "article" | "li";
}

/** Glass card whose highlight follows the pointer (see .glass in globals.css). */
export function Spotlight({ children, className = "", lift = true, as = "div" }: SpotlightProps) {
  const onMove = useCallback((e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  const Tag = as;
  return (
    <Tag className={`glass ${lift ? "glass-lift" : ""} ${className}`} onPointerMove={onMove}>
      {children}
    </Tag>
  );
}
