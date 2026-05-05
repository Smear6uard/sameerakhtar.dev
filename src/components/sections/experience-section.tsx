"use client";

import { motion } from "framer-motion";
import { SectionScramble } from "@/components/ui/SectionScramble";

const experiences = [
  {
    year: "2025",
    roles: [
      {
        company: "STYLEUM",
        title: "Founder & Engineer",
        period: "Dec 2025 – Present",
        description:
          "Architected 5-stage ML pipeline (BiRefNet, Florence-2, FashionSigLIP, AWS Rekognition, Gemini) for AI outfit generation at $0.002/outfit — 40% below competitor costs. Built full-stack iOS app (Swift/SwiftUI + Hono/TypeScript backend), shipping first commit to App Store in 8 weeks as sole engineer.",
        tech: "Swift · SwiftUI · Hono · TypeScript · AWS · Gemini",
      },
      {
        company: "BRUNOSOFT",
        title: "Software Engineering Intern",
        period: "Oct 2025 – Present",
        description:
          "Led migration of 100+ AngularJS components to Angular with lazy-loaded routing and modular state management, reducing bundle size by ~30% and build times by ~40%. Containerized dev and prod environments with Docker/docker-compose, cutting setup from 2+ hrs to 15 min; configured Kubernetes for zero-downtime releases.",
        tech: "Angular · Docker · Kubernetes · CI/CD",
      },
      {
        company: "APPLE",
        title: "Specialist",
        period: "Jul 2025 – Nov 2025",
        description:
          "Diagnosed and resolved iOS/macOS issues for 50+ clients monthly. Focused on enterprise MDM configurations and multi-device sync failures. 95%+ satisfaction rating.",
        tech: "iOS · macOS · MDM",
      },
    ],
  },
  {
    year: "2022",
    roles: [
      {
        company: "AMERICAN COACH LIMOUSINE",
        title: "Systems Integration Specialist",
        period: "Jul 2022 – Feb 2024",
        description:
          "Integrated FastTrak booking API with internal dispatch via REST, automating reservations for 50+ affiliates and reducing manual entry by 40% across 3,000+ weekly bookings. Built real-time ride tracking workflows improving coordination for 15+ corporate accounts, reducing partner response times by 30%.",
        tech: "REST APIs · Operations · Software Integration",
      },
    ],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="py-32">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <SectionScramble text="experience" className="section-heading" />
        </motion.div>

        <div className="mt-16 space-y-12">
          {experiences.map((group) => (
            <div key={group.year}>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-mono text-sm text-text-muted">{group.year}</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div className="space-y-8 pl-4 border-l border-white/10">
                {group.roles.map((role, roleIndex) => (
                  <div key={roleIndex} className="relative pl-8">
                    <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-accent -translate-x-[calc(50%+1px)]" />

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <span className="text-accent font-medium">{role.company}</span>
                      <span className="font-mono text-sm text-text-muted">{role.period}</span>
                    </div>

                    <h3 className="text-xl font-semibold text-text-primary mb-2">{role.title}</h3>

                    <p className="text-text-secondary mb-3">{role.description}</p>

                    <span className="font-mono text-xs text-text-muted">{role.tech}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
