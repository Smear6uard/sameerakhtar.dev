"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
  hover?: boolean;
  delay?: number;
}

export function BentoCard({
  children,
  className = "",
  colSpan = 1,
  rowSpan = 1,
  hover = true,
  delay = 0,
}: BentoCardProps) {
  const colClass = colSpan === 2 ? "md:col-span-2" : "col-span-1";
  const rowClass = rowSpan === 2 ? "md:row-span-2" : "row-span-1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: delay * 0.1, ease: "easeOut" }}
      className={`
        ${colClass} ${rowClass}
        group relative overflow-hidden rounded-xl
        bg-bg-secondary/50 md:backdrop-blur-sm
        border border-white/[0.06]
        ${hover ? "hover:border-accent/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.08)]" : ""}
        transition-all duration-300 ease-out
        ${className}
      `}
    >
      {/* Subtle gradient overlay on hover */}
      {hover && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
        </div>
      )}
      {children}
    </motion.div>
  );
}

// Stat counter component with animation
interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}

export function StatCounter({ value, suffix = "", label, delay = 0 }: StatCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="text-center"
    >
      <motion.span
        className="text-3xl md:text-4xl font-bold text-accent tabular-nums"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <CountUp target={value} duration={2} delay={delay} />
        {suffix}
      </motion.span>
      <p className="text-xs text-text-muted mt-1 uppercase tracking-wider font-mono">{label}</p>
    </motion.div>
  );
}

// Animated counter hook
function CountUp({
  target,
  duration = 2,
  delay = 0,
}: {
  target: number;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1, delay }}
      >
        <Counter target={target} duration={duration} delay={delay} />
      </motion.span>
    </motion.span>
  );
}

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

function Counter({ target, duration, delay }: { target: number; duration: number; delay: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now() + delay * 1000;

    const animate = () => {
      const now = Date.now();
      if (now < startTime) {
        requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, target, duration, delay]);

  return <span ref={ref}>{count}</span>;
}
