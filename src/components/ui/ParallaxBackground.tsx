"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FloatingOrb {
  size: number;
  x: string;
  y: string;
  color: string;
  blur: number;
  speed: number;
}

const orbs: FloatingOrb[] = [
  // Main accent orb (orange)
  {
    size: 400,
    x: "20%",
    y: "30%",
    color: "rgba(249, 115, 22, 0.15)",
    blur: 100,
    speed: -30,
  },
  // Secondary accent orb
  {
    size: 300,
    x: "70%",
    y: "60%",
    color: "rgba(249, 115, 22, 0.08)",
    blur: 120,
    speed: -50,
  },
  // Subtle blue accent
  {
    size: 250,
    x: "80%",
    y: "20%",
    color: "rgba(96, 165, 250, 0.06)",
    blur: 80,
    speed: -20,
  },
  // Deep purple hint
  {
    size: 350,
    x: "10%",
    y: "70%",
    color: "rgba(168, 85, 247, 0.05)",
    blur: 100,
    speed: -40,
  },
];

export function ParallaxBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      orbRefs.current.forEach((orb, index) => {
        if (!orb) return;

        // Parallax scroll effect
        gsap.to(orb, {
          yPercent: orbs[index].speed,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        // Subtle floating animation
        gsap.to(orb, {
          y: "+=20",
          x: "+=10",
          duration: 4 + index,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {orbs.map((orb, index) => (
        <div
          key={index}
          ref={(el) => {
            orbRefs.current[index] = el;
          }}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
