"use client";

import { motion } from "framer-motion";

export function ContactSection() {
  return (
    <section id="contact" className="py-20 px-6 bg-bg-secondary/30">
      <div className="max-w-6xl mx-auto">
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
            <a
              href="mailto:Sameer_Akhtar@icloud.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-bg-primary font-medium rounded-md hover:bg-accent/90 transition-colors"
            >
              Send me an email
              <span>→</span>
            </a>
            <a
              href="/Sameer-Akhtar-Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-text-primary font-medium rounded-md hover:border-accent hover:text-accent transition-colors"
            >
              View my resume
              <span>↗</span>
            </a>
          </div>

          <div className="mt-8 flex items-center gap-6">
            <a
              href="https://github.com/Smear6uard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent transition-colors"
            >
              github
            </a>
            <a
              href="https://linkedin.com/in/sameer-a-akhtar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent transition-colors"
            >
              linkedin
            </a>
          </div>

          <p className="mt-8 font-mono text-sm text-text-muted">
            Greater Chicago Area
          </p>
        </div>
      </div>
    </section>
  );
}
