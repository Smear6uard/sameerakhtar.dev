"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionScramble } from "@/components/ui/SectionScramble";

export function AboutSection() {
  return (
    <section id="about" className="py-32">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <SectionScramble text="about" className="section-heading" />
        </motion.div>

        <div className="mt-8 grid md:grid-cols-[280px_1fr] gap-12">
          <div>
            <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="/profile.jpg"
                alt="Sameer Akhtar"
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover border-2 border-orange-500 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-lg text-text-secondary leading-relaxed">
              I care about the details most people skip.
              The animation that&apos;s 200ms faster. The API call that costs $0.002 instead of $0.02.
              The feature that users don&apos;t notice—because it doesn&apos;t get in their way.
            </p>

            <p className="text-lg text-text-secondary leading-relaxed">
              Right now I&apos;m building{" "}
              <a
                href="https://styleum.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent link-underline"
              >
                Styleum
              </a>
              , because getting dressed shouldn&apos;t require a 20-minute app setup.
              By day, I&apos;m at BRUNOSOFT wrestling legacy code into modern Angular—migration is
              where you learn what &ldquo;at scale&rdquo; actually means.
            </p>

            <p className="text-lg text-text-secondary leading-relaxed">
              Co-founded DePaul&apos;s CS Club to build the community I wished existed.
              I write a{" "}
              <a
                href="https://sameerakhtar.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent link-underline"
              >
                weekly tech newsletter
              </a>
              {" "}for 300+ builders.
            </p>

            <p className="text-lg text-text-secondary leading-relaxed">
              When I&apos;m not shipping code, I shoot on a Fujifilm X-T30 II.
              Photography taught me that composition matters—in pixels and in prose.
            </p>

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
