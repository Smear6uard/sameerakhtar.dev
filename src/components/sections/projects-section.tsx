"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const projects = [
  {
    num: "01",
    title: "Styleum",
    description:
      "Existing wardrobe apps take 20+ minutes to set up and lack habit mechanics. Styleum gets users styled in 3 minutes with a hybrid AI pipeline at $0.002/call — 10x cheaper than competitors. Launching Q1 2025.",
    metric: "$0.002/call",
    slug: "styleum",
    live: "https://styleum.co",
  },
  {
    num: "02",
    title: "AI Answer Engine",
    description:
      "Research is slow — finding answers means dozens of tabs. Built a system that scrapes 100+ URLs/hour and synthesizes answers in under 2 seconds. Key challenge: graceful fallbacks for unreliable external sources.",
    metric: "98% accuracy",
    slug: "ai-answer-engine",
    github: "https://github.com/Smear6uard/AI-Answer-Engine",
    live: "https://ai-answer-engine.vercel.app",
  },
  {
    num: "03",
    title: "Mock Stock Exchange",
    description:
      "Built a complete trading system to understand exchange mechanics. Price-time priority matching engine executes 500+ trades with millisecond order-book updates. Hardest part: handling partial fills correctly.",
    metric: "500+ trades/session",
    slug: "stock-exchange",
  },
];

export function ProjectsSection() {
  return (
    <section id="work" className="py-32">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <span className="section-heading">selected work</span>
        </motion.div>

        <div className="mt-16 space-y-8">
          {projects.map((project, i) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="group border border-white/[0.06] rounded-lg overflow-hidden hover:border-accent/50 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(249,115,22,0.06)] transition-all duration-300"
            >
              {/* Project Image Placeholder */}
              <div className="relative h-[260px] bg-[#112240] border-b border-white/[0.06] overflow-hidden flex items-center justify-center">
                <span className="text-[140px] font-bold text-white/[0.03] select-none">
                  {project.num}
                </span>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <span className="font-mono text-sm text-text-muted">
                    {project.num}
                  </span>
                  <span className="font-mono text-sm text-accent">
                    {project.metric}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-3">
                  {project.title}
                </h3>

                <p className="text-text-secondary mb-6 max-w-2xl">
                  {project.description}
                </p>

                <div className="flex items-center gap-6">
                  <Link
                    href={`/work/${project.slug}`}
                    className="text-sm text-accent link-underline inline-flex items-center gap-1"
                  >
                    view case study{" "}
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-muted hover:text-accent transition-colors"
                    >
                      github
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-muted hover:text-accent transition-colors"
                    >
                      live
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
