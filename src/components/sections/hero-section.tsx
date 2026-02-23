"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AIRoutingDemo } from "@/components/ui/AIRoutingDemo";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { WaveText } from "@/components/ui/CylinderText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Feature flag for 3D effect - can toggle between simple and advanced
const USE_3D_TEXT = true;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Hero content fades and scales down as you scroll
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -100,
        scale: 0.95,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Name splits and spreads on scroll (subtle effect)
      if (headingRef.current) {
        const chars = headingRef.current.querySelectorAll(".char");
        gsap.to(chars, {
          letterSpacing: "0.05em",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "50% top",
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split name into characters for animation
  const name = "sameer akhtar";
  const nameChars = name.split("");

  return (
    <>
      <ParallaxBackground />
      <section
        ref={sectionRef}
        id="hero"
        className="min-h-screen flex flex-col justify-center relative overflow-x-hidden"
      >
        <div className="max-w-6xl mx-auto w-full px-4">
          <div
            ref={contentRef}
            className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            {/* Left column - Text content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Tagline */}
                <motion.p
                  className="font-mono text-sm text-accent mb-4 tracking-wide"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <span className="inline-block animate-pulse mr-2">●</span>
                  building AI that ships to the App Store
                </motion.p>

                {/* 3D Text effect on desktop, simple animation on mobile */}
                {USE_3D_TEXT ? (
                  <>
                    {/* Desktop: 3D Wave Text */}
                    <div className="hidden md:block">
                      <WaveText text={name} />
                    </div>
                    {/* Mobile: Simple fade-in (no per-char stagger) */}
                    <motion.h1
                      className="md:hidden text-5xl font-bold text-text-primary tracking-tight"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      {name}
                    </motion.h1>
                  </>
                ) : (
                  <h1
                    ref={headingRef}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary tracking-tight"
                  >
                    {nameChars.map((char, index) => (
                      <motion.span
                        key={index}
                        className="char inline-block"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.1 + index * 0.03,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </h1>
                )}
                <motion.p
                  className="text-lg md:text-xl text-text-secondary mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  Software Engineer & Founder
                </motion.p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mt-6 text-text-secondary max-w-lg text-lg leading-relaxed"
              >
                Every outfit on{" "}
                <a
                  href="https://apps.apple.com/us/app/styleum-daily-fits/id6757777880"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent link-underline"
                >
                  Styleum
                </a>{" "}
                costs{" "}
                <span className="text-accent font-mono font-semibold">
                  $0.002
                </span>
                . That&apos;s a 5-stage ML pipeline — from wardrobe scan to styled
                outfit — shipped to the App Store in 8 weeks.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="mt-4 text-text-muted text-base"
              >
                Engineering at Brunosoft. Math &amp; CS at DePaul.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="mt-8 flex flex-col gap-4"
              >
                <div className="flex items-center gap-6">
                  <MagneticWrapper radius={60} maxDistance={8}>
                    <a
                      href="https://github.com/Smear6uard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-accent transition-colors duration-300"
                      aria-label="GitHub"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </a>
                  </MagneticWrapper>
                  <MagneticWrapper radius={60} maxDistance={8}>
                    <a
                      href="https://linkedin.com/in/sameer-a-akhtar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-accent transition-colors duration-300"
                      aria-label="LinkedIn"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </MagneticWrapper>
                  <MagneticWrapper radius={60} maxDistance={8}>
                    <CopyEmail
                      email="sameer@sameerakhtar.dev"
                      className="text-text-muted hover:text-accent transition-colors duration-300"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M22 6L12 13L2 6" />
                      </svg>
                    </CopyEmail>
                  </MagneticWrapper>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.55 }}
                  className="flex items-center gap-2 text-sm text-text-muted"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Writing a tech newsletter for 500+ subscribers</span>
                </motion.div>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="mt-12 hidden lg:flex items-center gap-3 text-text-muted text-sm"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </motion.div>
                <span className="font-mono text-xs tracking-wider uppercase">
                  Scroll to explore
                </span>
              </motion.div>
            </div>

            {/* Right column - AI Pipeline Demo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="hidden lg:block mt-16"
            >
              <AIRoutingDemo />
            </motion.div>
          </div>

          {/* Mobile - AI Pipeline Demo below text */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="lg:hidden mt-12"
          >
            <AIRoutingDemo />
          </motion.div>
        </div>
      </section>
    </>
  );
}
