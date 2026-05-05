"use client";

import { motion } from "framer-motion";
import { SectionScramble } from "@/components/ui/SectionScramble";
import { PerceptionDemo } from "@/components/perception/PerceptionDemo";

const TECH_BLOCK = [
  ["model", "hand_landmarker_v3.task"],
  ["runtime", "wasm + simd"],
  ["inference", "~12ms per frame"],
  ["keypoints", "21 per detected hand"],
  ["hands", "up to 2 simultaneous"],
] as const;

export function PerceptionSection() {
  return (
    <section id="perception" className="py-32">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between gap-4 flex-wrap"
        >
          <SectionScramble text="perception" className="section-heading" />
          <span className="font-mono text-xs uppercase tracking-widest text-text-muted/60">
            live inference · browser native
          </span>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left: demo (60% on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-3"
          >
            <PerceptionDemo />
          </motion.div>

          {/* Right: copy (40% on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4 text-text-secondary leading-relaxed">
              <p>
                Hand tracking via MediaPipe Hand Landmarker, running entirely in your browser.{" "}
                <span className="text-text-primary">
                  21 keypoints per hand, 30 frames per second, no data leaves this tab.
                </span>
              </p>
              <p>
                Same perception primitives I use in research with Dr. Huzaifa. Same models that
                power gesture interfaces in AR and humanoid robotics.
              </p>
            </div>

            <dl className="font-mono text-xs text-text-muted border-t border-white/[0.06] pt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
              {TECH_BLOCK.map(([key, value]) => (
                <div key={key} className="contents">
                  <dt className="uppercase tracking-widest text-text-muted/70">{key}</dt>
                  <dd className="text-text-secondary">{value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
