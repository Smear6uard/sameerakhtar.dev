"use client";

import { motion } from "framer-motion";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";

export function ContactSection() {
  return (
    <section id="contact" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <span className="section-heading">contact</span>
            <h2 className="heading-lg mt-2">Let&apos;s build something together</h2>
          </motion.div>

          <p className="mt-6 text-text-secondary text-lg">
            Currently seeking Summer 2026 internships at companies solving hard problems
            in software engineering, AI/ML, and full-stack development.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <MagneticWrapper radius={100} maxDistance={6}>
              <a
                href="mailto:Sameer_Akhtar@icloud.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-accent text-bg-primary rounded-md hover:bg-[#ea580c] transition-all duration-200"
              >
                Send me an email
                <span>→</span>
              </a>
            </MagneticWrapper>
            <MagneticWrapper radius={100} maxDistance={6}>
              <a
                href="/Sameer-Akhtar-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium border border-white/15 text-text-primary rounded-md hover:border-accent hover:text-accent transition-all duration-200"
              >
                View my resume
                <span>↗</span>
              </a>
            </MagneticWrapper>
          </div>

          <div className="mt-8 flex items-center gap-6">
            <MagneticWrapper radius={60} maxDistance={6}>
              <a
                href="https://github.com/Smear6uard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent link-underline transition-colors"
              >
                github
              </a>
            </MagneticWrapper>
            <MagneticWrapper radius={60} maxDistance={6}>
              <a
                href="https://linkedin.com/in/sameer-a-akhtar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent link-underline transition-colors"
              >
                linkedin
              </a>
            </MagneticWrapper>
          </div>

          <p className="mt-8 font-mono text-sm text-text-muted">
            Greater Chicago Area
          </p>
        </div>
      </div>
    </section>
  );
}
