"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface MagneticOptions {
  radius?: number;
  maxDistance?: number;
  springConfig?: {
    stiffness: number;
    damping: number;
  };
}

export function useMagneticEffect(options: MagneticOptions = {}) {
  const { radius = 100, maxDistance = 8 } = options;

  const ref = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      if (distance < radius) {
        // Calculate pull strength (stronger when closer)
        const strength = 1 - distance / radius;
        const moveX = (distanceX / radius) * maxDistance * strength;
        const moveY = (distanceY / radius) * maxDistance * strength;

        setTransform({ x: moveX, y: moveY });
      } else {
        setTransform({ x: 0, y: 0 });
      }
    },
    [radius, maxDistance]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    // Check for touch devices
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return {
    ref,
    style: {
      transform: `translate(${transform.x}px, ${transform.y}px)`,
      transition: "transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)",
    },
    onMouseLeave: handleMouseLeave,
  };
}
