"use client";

import { motion } from "framer-motion";
import { SectionScramble } from "@/components/ui/SectionScramble";

const experiences = [
  {
    year: "2025",
    roles: [
      {
        company: "STYLEUM",
        title: "Founder & CEO",
        period: "Dec 2025 – Present",
        description:
          "6-stage AI pipeline: AWS Rekognition, BiRefNet, Florence-2, FashionSigLIP (768-dim), Gemini 2.5 Flash-Lite, pgvector. Total cost: $0.01/item processed. FashionSigLIP over CLIP—74% vs 47% fashion retrieval accuracy.",
        tech: "Next.js · Hono · Railway · pgvector · Gemini",
      },
      {
        company: "BRUNOSOFT",
        title: "Software Engineering Intern",
        period: "Oct 2025 – Present",
        description:
          "Migrating 100+ AngularJS components to Angular 17 via ngUpgrade. Built Docker/Kubernetes CI pipeline that cut deploy times from 45min to 12min. Team of 5 engineers.",
        tech: "Angular · Docker · Kubernetes · PHP",
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
          "Built internal tools that cut partner communication from 24hrs to 8hrs average. Managed software integrations for 15+ corporate transportation clients.",
        tech: "Operations · Software Integration",
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
                <span className="font-mono text-sm text-text-muted">
                  {group.year}
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div className="space-y-8 pl-4 border-l border-white/10">
                {group.roles.map((role, roleIndex) => (
                  <div key={roleIndex} className="relative pl-8">
                    <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-accent -translate-x-[calc(50%+1px)]" />

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <span className="text-accent font-medium">
                        {role.company}
                      </span>
                      <span className="font-mono text-sm text-text-muted">
                        {role.period}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      {role.title}
                    </h3>

                    <p className="text-text-secondary mb-3">
                      {role.description}
                    </p>

                    <span className="font-mono text-xs text-text-muted">
                      {role.tech}
                    </span>
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
