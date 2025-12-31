"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for touch devices
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Gradient spotlight - larger, more prominent */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        animate={{ x: position.x - 300, y: position.y - 300 }}
        transition={{ type: "spring", damping: 25, stiffness: 150, mass: 0.5 }}
      >
        <div className="h-[600px] w-[600px] rounded-full bg-accent/[0.05] blur-[100px]" />
      </motion.div>

      {/* Cursor dot */}
      <motion.div
        className="pointer-events-none fixed z-50 h-2 w-2 rounded-full bg-accent mix-blend-difference"
        animate={{ x: position.x - 4, y: position.y - 4 }}
        transition={{ type: "spring", damping: 50, stiffness: 500 }}
      />

      {/* Cursor ring */}
      <motion.div
        className="pointer-events-none fixed z-50 rounded-full border border-accent/50 mix-blend-difference"
        animate={{
          x: position.x - (isHovering ? 24 : 16),
          y: position.y - (isHovering ? 24 : 16),
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />
    </>
  );
}
