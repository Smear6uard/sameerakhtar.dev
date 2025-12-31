"use client";

import { useState, useEffect, useRef } from "react";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

interface SectionScrambleProps {
  text: string;
  className?: string;
}

export function SectionScramble({ text, className }: SectionScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          runScramble();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated, text]);

  const runScramble = () => {
    const scrambleFrames = 12; // Pure scramble before decode starts
    const decodeFrames = 20; // Frames to decode
    const intervalMs = 40;
    let frame = 0;

    const interval = setInterval(() => {
      // Phase 1: Pure scramble (all random)
      if (frame < scrambleFrames) {
        setDisplayText(
          text
            .split("")
            .map((char) =>
              char === " " ? " " : chars[Math.floor(Math.random() * chars.length)]
            )
            .join("")
        );
      }
      // Phase 2: Progressive decode with stagger
      else {
        const decodeProgress = (frame - scrambleFrames) / decodeFrames;

        setDisplayText(
          text
            .split("")
            .map((char, i) => {
              if (char === " ") return " ";
              // Each character decodes based on its position
              const charThreshold = i / text.length;
              if (decodeProgress > charThreshold + 0.3) return text[i];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );
      }

      frame++;
      if (frame >= scrambleFrames + decodeFrames + 5) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, intervalMs);
  };

  return (
    <span ref={ref} className={className}>
      {displayText}
    </span>
  );
}
