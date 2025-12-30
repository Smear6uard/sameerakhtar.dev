"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function AboutSection() {
  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <span className="section-heading">about</span>
        </motion.div>

        <div className="mt-8 grid md:grid-cols-[280px_1fr] gap-12">
          <div>
            <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="/profile.jpg"
                alt="Sameer Akhtar"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-lg text-text-secondary leading-relaxed">
              I&apos;m a Computer Science student at DePaul University (3.8 GPA)
              graduating July 2027. Member of Upsilon Pi Epsilon Honor Society.
            </p>

            <p className="text-lg text-text-secondary leading-relaxed">
              Currently, I&apos;m building{" "}
              <a href="https://styleum.co" target="_blank" rel="noopener noreferrer" className="text-accent link-underline">Styleum</a>
              —an AI-powered personal styling platform—while leading the modernization
              of a legacy codebase at BRUNOSOFT. I believe in shipping fast and learning from real users.
            </p>

            <p className="text-lg text-text-secondary leading-relaxed">
              I co-founded DePaul&apos;s Computer Science Club and curate a tech
              newsletter reaching 300+ subscribers. Outside of code, I shoot with a
              Fujifilm X-T30 II — I believe good engineers have an eye for
              craft.
            </p>

            {/* Social Proof */}
            <div className="flex flex-wrap gap-6 sm:gap-8 pt-4">
              <a
                href="https://github.com/Smear6uard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <span className="text-2xl font-bold text-accent">50+</span>
                <span className="text-text-muted text-sm">repositories</span>
              </a>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-accent">300+</span>
                <span className="text-text-muted text-sm">newsletter subscribers</span>
              </div>
            </div>

            {/* Tech Stack */}
            <p className="text-xs sm:text-sm text-white/30 font-mono pt-4 break-words">
              JavaScript · Python · Java · React · Next.js · Node.js · Docker · AWS
            </p>

            <div className="pt-6 border-t border-white/10">
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                <span className="font-mono text-xs text-text-muted uppercase tracking-wider w-20 shrink-0">
                  education
                </span>
                <div>
                  <span className="text-text-primary">DePaul University</span>
                  <span className="text-text-muted">
                    {" "}
                    · BS Computer Science · 3.8 GPA · Jul 2027
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
