"use client";

import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!hash) return;

    const targetId = decodeURIComponent(hash);
    const timeout = window.setTimeout(() => {
      const target = document.getElementById(targetId);
      if (!target) return;

      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, { immediate: false });
        return;
      }

      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [hash, pathname]);

  return <>{children}</>;
}
