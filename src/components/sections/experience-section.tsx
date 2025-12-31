"use client";

import { motion } from "framer-motion";

const experiences = [
  {
    year: "2025",
    roles: [
      {
        company: "STYLEUM",
        title: "Founder & CEO",
        period: "Dec 2025 – Present",
        description:
          "Building the AI stylist that becomes your daily ritual. Designed hybrid Claude Haiku pipeline at $0.002/call — 10x cheaper than funded competitors. Targeting 1,000 users by Q2 2025 with $6.99/mo Pro tier.",
        tech: "Next.js · Supabase · Claude API · Stripe",
      },
      {
        company: "BRUNOSOFT",
        title: "Software Engineering Intern",
        period: "Oct 2025 – Present",
        description:
          "Leading migration of 100+ AngularJS components to Angular 17 using incremental ngUpgrade strategy. Introduced Docker/Kubernetes workflows enabling parallel staging environments for a 5-person engineering team.",
        tech: "Angular · Docker · Kubernetes · PHP",
      },
      {
        company: "APPLE",
        title: "Specialist",
        period: "Jul 2025 – Nov 2025",
        description:
          "Technical advisor resolving complex iOS/macOS issues for 50+ monthly clients. Specialized in enterprise MDM enrollment and multi-device configurations. Consistently achieved 95%+ satisfaction rating.",
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
          "Reduced partner response times by 30% through software tools. Streamlined operations for 15+ corporate clients.",
        tech: "Operations · Software Tools",
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
          <span className="section-heading">experience</span>
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
