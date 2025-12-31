"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

const ascii = `  ██████╗  █████╗ ███╗   ███╗███████╗███████╗██████╗
 ██╔════╝ ██╔══██╗████╗ ████║██╔════╝██╔════╝██╔══██╗
 ╚█████╗  ███████║██╔████╔██║█████╗  █████╗  ██████╔╝
  ╚═══██╗ ██╔══██║██║╚██╔╝██║██╔══╝  ██╔══╝  ██╔══██╗
 ██████╔╝ ██║  ██║██║ ╚═╝ ██║███████╗███████╗██║  ██║
 ╚═════╝  ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝`;

const PROXIMITY_RADIUS = 100;

export function AsciiArt() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isTouch, setIsTouch] = useState(false);

  // Parse ASCII into 2D character grid
  const charGrid = useMemo(() => {
    const lines = ascii.split("\n");
    return lines.map((line) => line.split(""));
  }, []);

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
      if (!containerRef.current || isTouch) return;

      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [isTouch]
  );

  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, isTouch]);

  // Calculate character dimensions (approximate based on font size)
  const charWidth = 8; // Approximate width of monospace char at current size
  const charHeight = 18; // Approximate line height

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="font-mono text-[9px] sm:text-[12px] md:text-lg lg:text-xl leading-none select-none animate-breathe"
    >
      {charGrid.map((line, lineIndex) => (
        <div key={lineIndex} className="whitespace-pre flex">
          {line.map((char, charIndex) => {
            // Calculate character position
            const charX = charIndex * charWidth;
            const charY = lineIndex * charHeight;

            // Calculate distance from mouse
            let brightness = 0;
            if (mousePos && char.trim()) {
              const dx = mousePos.x - charX;
              const dy = mousePos.y - charY;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < PROXIMITY_RADIUS) {
                brightness = 1 - distance / PROXIMITY_RADIUS;
              }
            }

            // Interpolate color from accent (#f97316) to white
            const baseColor = { r: 249, g: 115, b: 22 };
            const targetColor = { r: 255, g: 255, b: 255 };
            const r = Math.round(
              baseColor.r + (targetColor.r - baseColor.r) * brightness
            );
            const g = Math.round(
              baseColor.g + (targetColor.g - baseColor.g) * brightness
            );
            const b = Math.round(
              baseColor.b + (targetColor.b - baseColor.b) * brightness
            );

            return (
              <span
                key={charIndex}
                style={{
                  color: char.trim() ? `rgb(${r}, ${g}, ${b})` : "transparent",
                  transform: brightness > 0 ? `scale(${1 + brightness * 0.05})` : "scale(1)",
                  transition: "color 0.15s ease-out, transform 0.15s ease-out",
                  display: "inline-block",
                }}
              >
                {char || " "}
              </span>
            );
          })}
        </div>
      ))}
    </motion.div>
  );
}
