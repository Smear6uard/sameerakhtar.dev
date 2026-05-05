"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Img as Image } from "@/components/ui/Img";

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedSection({ children, delay = 0, className = "" }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedMetricProps {
  value: string;
  label: string;
  index: number;
}

export function AnimatedMetric({ value, label, index }: AnimatedMetricProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    // Extract numeric part and suffix (%, +, etc.)
    const numMatch = value.match(/^([\d.]+)/);
    const suffixMatch = value.match(/[^\d.]+$/);
    const prefixMatch = value.match(/^[^\d]+/);

    const numericValue = numMatch ? parseFloat(numMatch[1]) : 0;
    const suffix = suffixMatch ? suffixMatch[0] : "";
    const prefix = prefixMatch && !numMatch ? prefixMatch[0] : "";

    // Handle non-numeric values (like "Building")
    if (!numMatch) {
      setDisplayValue(value);
      return;
    }

    // Animate the count
    const duration = 1000;
    const startTime = Date.now();
    const isDecimal = value.includes(".");

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numericValue * eased;

      if (isDecimal) {
        setDisplayValue(`${prefix}${current.toFixed(3)}${suffix}`);
      } else {
        setDisplayValue(`${prefix}${Math.floor(current)}${suffix}`);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    // Small delay based on index for stagger effect
    const timer = setTimeout(animate, index * 100);
    return () => clearTimeout(timer);
  }, [isInView, value, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="p-4 border border-white/10 rounded-lg hover:border-accent/30 hover:bg-accent/5 transition-all duration-300"
    >
      <p className="text-2xl font-bold text-accent">{displayValue}</p>
      <p className="text-sm text-text-muted">{label}</p>
    </motion.div>
  );
}

interface AnimatedCodeBlockProps {
  highlightedCode: string;
  filename?: string;
}

/**
 * Animated code block with line-by-line reveal animation.
 * Note: The highlightedCode prop contains pre-processed HTML from the server's
 * highlightCode function, which only processes static, developer-controlled
 * content from the projects object. This is safe as the content is not
 * user-generated.
 */
export function AnimatedCodeBlock({ highlightedCode, filename }: AnimatedCodeBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [visibleLines, setVisibleLines] = useState(0);
  const lines = highlightedCode.split("\n");

  useEffect(() => {
    if (!isInView) return;

    let currentLine = 0;
    const interval = setInterval(() => {
      currentLine++;
      setVisibleLines(currentLine);
      if (currentLine >= lines.length) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isInView, lines.length]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="my-6 rounded-lg overflow-hidden border border-white/10"
    >
      {filename && (
        <div className="px-4 py-2 bg-white/5 border-b border-white/10 font-mono text-xs text-text-muted flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
          </span>
          <span className="ml-2">{filename}</span>
        </div>
      )}
      <pre className="p-4 bg-[#0d1117] overflow-x-auto">
        <code className="text-sm font-mono leading-relaxed block">
          {lines.map((line, i) => (
            <span
              key={i}
              className="block transition-opacity duration-150"
              style={{ opacity: i < visibleLines ? 1 : 0 }}
            >
              {/* Safe: content is pre-processed from static developer data */}
              <span dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }} />
            </span>
          ))}
        </code>
      </pre>
    </motion.div>
  );
}

interface AnimatedHeadingProps {
  level: 2 | 3;
  children: React.ReactNode;
}

export function AnimatedHeading({ level, children }: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  const Component = level === 2 ? motion.h2 : motion.h3;
  const className =
    level === 2
      ? "text-xl font-semibold text-text-primary mt-12 mb-4"
      : "text-lg font-medium text-text-primary mt-8 mb-3";

  return (
    <Component
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {children}
    </Component>
  );
}

interface AnimatedListProps {
  items: string[];
}

export function AnimatedList({ items }: AnimatedListProps) {
  const ref = useRef<HTMLUListElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <ul ref={ref} className="list-none mb-4 space-y-3">
      {items.map((item, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="text-text-secondary flex items-start gap-3"
        >
          <span className="text-accent mt-1.5 flex-shrink-0">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
          {item}
        </motion.li>
      ))}
    </ul>
  );
}

interface AnimatedCalloutProps {
  content: string;
  variant?: "info" | "warning" | "success";
}

export function AnimatedCallout({ content, variant = "info" }: AnimatedCalloutProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  const variants = {
    info: "border-blue-500/50 bg-blue-500/10",
    warning: "border-yellow-500/50 bg-yellow-500/10",
    success: "border-green-500/50 bg-green-500/10",
  };

  const icons = {
    info: (
      <svg
        className="w-5 h-5 text-blue-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg
        className="w-5 h-5 text-yellow-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    success: (
      <svg
        className="w-5 h-5 text-green-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className={`my-6 p-4 rounded-lg border-l-4 ${variants[variant]} flex items-start gap-3`}
    >
      <span className="flex-shrink-0 mt-0.5">{icons[variant]}</span>
      <p className="text-text-secondary">{content}</p>
    </motion.div>
  );
}

interface AnimatedTextProps {
  children: string;
}

export function AnimatedText({ children }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
      className="text-text-secondary leading-relaxed mb-4"
    >
      {children}
    </motion.p>
  );
}

interface AnimatedImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export function AnimatedImage({ src, alt, caption }: AnimatedImageProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.figure
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="my-8"
    >
      <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-300" />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-text-muted">{caption}</figcaption>
      )}
    </motion.figure>
  );
}
