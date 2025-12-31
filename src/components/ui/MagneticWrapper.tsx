"use client";

import { useRef, useState, useEffect, useCallback, ReactNode } from "react";
import { motion } from "framer-motion";

interface MagneticWrapperProps {
  children: ReactNode;
  className?: string;
  radius?: number;
  maxDistance?: number;
}

export function MagneticWrapper({
  children,
  className = "",
  radius = 100,
  maxDistance = 8,
}: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches
    ) {
      setIsTouch(true);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current || isTouch) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      if (distance < radius) {
        const strength = 1 - distance / radius;
        const moveX = (distanceX / radius) * maxDistance * strength;
        const moveY = (distanceY / radius) * maxDistance * strength;
        setPosition({ x: moveX, y: moveY });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    },
    [radius, maxDistance, isTouch]
  );

  useEffect(() => {
    if (isTouch) return;

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove, isTouch]);

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  if (isTouch) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.span>
  );
}
