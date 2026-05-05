"use client";

import { motion } from "framer-motion";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { SectionScramble } from "@/components/ui/SectionScramble";

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
            <SectionScramble text="contact" className="section-heading" />
            <h2 className="heading-lg mt-2">I&apos;m always up to chat.</h2>
          </motion.div>

          <p className="mt-6 text-text-secondary text-lg">
            I&apos;m looking for Summer 2026 opportunities in software engineering or
            AI/ML—somewhere I can learn fast and contribute meaningfully.
          </p>

          <p className="mt-4 text-text-muted">
            Open to full-time internships, contract work, or interesting collaborations.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <MagneticWrapper radius={100} maxDistance={6}>
              <a href="mailto:sameer@sameerakhtar.dev" className="btn-primary">
                Send me an email
                <span>→</span>
              </a>
            </MagneticWrapper>
            <MagneticWrapper radius={100} maxDistance={6}>
              <a
                href="/Sameer_Akhtar_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
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
            <MagneticWrapper radius={60} maxDistance={6}>
              <a
                href="https://sameerakhtar.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent link-underline transition-colors"
              >
                newsletter
              </a>
            </MagneticWrapper>
          </div>

          <p className="mt-8 font-mono text-sm text-text-muted">Greater Chicago Area</p>
        </div>
      </div>
    </section>
  );
}
