"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CylinderTextProps {
  text: string;
  className?: string;
}

export function CylinderText({ text, className = "" }: CylinderTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const chars = textRef.current.querySelectorAll(".cylinder-char");
    const charCount = chars.length;

    // Calculate cylinder parameters
    const calculateRadius = () => {
      const vw = Math.min(window.innerWidth, 1200);
      return vw * 0.15; // Responsive radius
    };

    let radius = calculateRadius();
    const angleStep = (Math.PI * 0.4) / charCount; // Spread across ~72 degrees of cylinder

    // Position characters on cylinder
    const positionChars = () => {
      radius = calculateRadius();
      chars.forEach((char, i) => {
        const element = char as HTMLElement;
        const angle = (i - charCount / 2) * angleStep;

        // Initial position on cylinder surface
        gsap.set(element, {
          rotateY: angle * (180 / Math.PI),
          z: radius * Math.cos(angle) - radius,
          x: radius * Math.sin(angle),
          transformOrigin: "center center",
          transformPerspective: 1200,
        });
      });
    };

    positionChars();

    // Create scroll-triggered rotation
    const ctx = gsap.context(() => {
      // Main cylinder rotation on scroll
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=150%",
        scrub: 1.5,
        onUpdate: (self) => {
          const progress = self.progress;
          const rotationAmount = progress * 25; // Max 25 degrees rotation

          chars.forEach((char, i) => {
            const element = char as HTMLElement;
            const baseAngle = (i - charCount / 2) * angleStep;
            const currentAngle = baseAngle + (rotationAmount * Math.PI) / 180;

            gsap.to(element, {
              rotateY: currentAngle * (180 / Math.PI),
              z: radius * Math.cos(currentAngle) - radius,
              x: radius * Math.sin(currentAngle),
              opacity: Math.cos(currentAngle) > -0.3 ? 1 : 0.3,
              duration: 0.1,
              ease: "none",
            });
          });
        },
      });

      // Subtle float animation
      chars.forEach((char, i) => {
        gsap.to(char, {
          y: "+=3",
          duration: 2 + i * 0.1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.05,
        });
      });
    }, containerRef);

    // Handle resize
    const handleResize = () => {
      positionChars();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, [text]);

  const chars = text.split("");

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ perspective: "1200px", perspectiveOrigin: "center center" }}
    >
      <div
        ref={textRef}
        className="flex justify-center items-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {chars.map((char, index) => (
          <span
            key={index}
            className="cylinder-char inline-block text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary tracking-tight"
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </div>
  );
}

// Alternative: Simpler wave/spread effect that's more performant
export function WaveText({ text, className = "" }: CylinderTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const chars = containerRef.current.querySelectorAll(".wave-char");

    const ctx = gsap.context(() => {
      // Scroll-triggered wave effect
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=100%",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          chars.forEach((char, i) => {
            const offset = i * 0.1;
            const wave = Math.sin((progress * Math.PI * 2) + offset) * 10;
            const spread = progress * i * 3;

            gsap.to(char, {
              y: wave,
              letterSpacing: `${spread}px`,
              opacity: 1 - progress * 0.3,
              rotateX: progress * -15,
              duration: 0.1,
              ease: "none",
            });
          });
        },
      });

      // Initial entrance animation
      gsap.from(chars, {
        opacity: 0,
        y: 30,
        rotateX: -45,
        stagger: 0.03,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [text]);

  const chars = text.split("");

  return (
    <div
      ref={containerRef}
      className={`${className}`}
      style={{ perspective: "1000px" }}
    >
      <div className="flex" style={{ transformStyle: "preserve-3d" }}>
        {chars.map((char, index) => (
          <span
            key={index}
            className="wave-char inline-block text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary tracking-tight origin-bottom"
            style={{ transformStyle: "preserve-3d" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </div>
  );
}
