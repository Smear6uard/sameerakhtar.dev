"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure plugin is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationOptions {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
}

export function useScrollAnimation() {
  const contextRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    contextRef.current = gsap.context(() => {});
    return () => contextRef.current?.revert();
  }, []);

  const createParallax = (
    element: string | Element,
    yPercent: number,
    options: ScrollAnimationOptions = {}
  ) => {
    if (!contextRef.current) return;

    contextRef.current.add(() => {
      gsap.to(element, {
        yPercent,
        ease: "none",
        scrollTrigger: {
          trigger: options.trigger || element,
          start: options.start || "top bottom",
          end: options.end || "bottom top",
          scrub: options.scrub ?? true,
          markers: options.markers || false,
        },
      });
    });
  };

  const createFadeOut = (
    element: string | Element,
    options: ScrollAnimationOptions = {}
  ) => {
    if (!contextRef.current) return;

    contextRef.current.add(() => {
      gsap.to(element, {
        opacity: 0,
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: options.trigger || element,
          start: options.start || "top top",
          end: options.end || "bottom top",
          scrub: options.scrub ?? true,
          markers: options.markers || false,
        },
      });
    });
  };

  const createReveal = (
    element: string | Element,
    options: ScrollAnimationOptions = {}
  ) => {
    if (!contextRef.current) return;

    contextRef.current.add(() => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: options.trigger || element,
            start: options.start || "top 80%",
            end: options.end || "top 20%",
            toggleActions: "play none none reverse",
            markers: options.markers || false,
          },
        }
      );
    });
  };

  const createStaggerReveal = (
    container: string | Element,
    childSelector: string,
    options: ScrollAnimationOptions = {}
  ) => {
    if (!contextRef.current) return;

    contextRef.current.add(() => {
      gsap.fromTo(
        `${container} ${childSelector}`,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: options.start || "top 75%",
            toggleActions: "play none none reverse",
            markers: options.markers || false,
          },
        }
      );
    });
  };

  const createCountUp = (
    element: string | Element,
    endValue: number,
    options: ScrollAnimationOptions = {}
  ) => {
    if (!contextRef.current) return;

    contextRef.current.add(() => {
      const target = typeof element === "string" ? document.querySelector(element) : element;
      if (!target) return;

      const obj = { value: 0 };
      gsap.to(obj, {
        value: endValue,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: options.trigger || element,
          start: options.start || "top 80%",
          toggleActions: "play none none none",
          markers: options.markers || false,
        },
        onUpdate: () => {
          target.textContent = Math.floor(obj.value).toString();
        },
      });
    });
  };

  return {
    createParallax,
    createFadeOut,
    createReveal,
    createStaggerReveal,
    createCountUp,
    context: contextRef,
  };
}

// Text split utility for character animations
export function splitTextToChars(text: string): string[] {
  return text.split("");
}
