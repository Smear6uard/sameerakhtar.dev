"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  AnimatedSection,
  AnimatedMetric,
  AnimatedCodeBlock,
  AnimatedHeading,
  AnimatedList,
  AnimatedCallout,
  AnimatedText,
  AnimatedImage,
} from "./AnimatedContent";
import { ReadingProgress } from "./ReadingProgress";

type ContentBlock =
  | { type: "text"; content: string }
  | { type: "heading"; level: 2 | 3; content: string }
  | { type: "code"; language: string; content: string; filename?: string; highlightedCode: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; content: string; variant?: "info" | "warning" | "success" };

interface Metric {
  label: string;
  value: string;
}

interface CaseStudyClientProps {
  title: string;
  subtitle: string;
  timeline: string;
  role: string;
  stack: string[];
  github?: string;
  live?: string;
  metrics: Metric[];
  content: ContentBlock[];
}

function renderContentBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case "heading":
      return (
        <AnimatedHeading key={index} level={block.level}>
          {block.content}
        </AnimatedHeading>
      );

    case "text":
      return <AnimatedText key={index}>{block.content}</AnimatedText>;

    case "code":
      return (
        <AnimatedCodeBlock
          key={index}
          highlightedCode={block.highlightedCode}
          filename={block.filename}
        />
      );

    case "list":
      return <AnimatedList key={index} items={block.items} />;

    case "callout":
      return (
        <AnimatedCallout
          key={index}
          content={block.content}
          variant={block.variant}
        />
      );

    case "image":
      return (
        <AnimatedImage
          key={index}
          src={block.src}
          alt={block.alt}
          caption={block.caption}
        />
      );

    default:
      return null;
  }
}

export function CaseStudyClient({
  title,
  subtitle,
  timeline,
  role,
  stack,
  github,
  live,
  metrics,
  content,
}: CaseStudyClientProps) {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <>
      <ReadingProgress />

      {/* Parallax background element */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-accent/3 rounded-full blur-[80px]" />
      </motion.div>

      <article className="relative z-10 pt-32 pb-20">
        {/* Back link */}
        <div className="max-w-3xl mx-auto px-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/#work"
              className="text-sm text-text-muted hover:text-accent transition-colors inline-flex items-center gap-1 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> back to projects
            </Link>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto px-6">
          <header className="mb-12">
            <AnimatedSection>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight"
              >
                {title}
              </motion.h1>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <p className="mt-4 text-xl text-text-secondary">{subtitle}</p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-6 text-sm">
                <div>
                  <span className="text-text-muted">Timeline</span>
                  <p className="text-text-primary">{timeline}</p>
                </div>
                <div>
                  <span className="text-text-muted">Role</span>
                  <p className="text-text-primary">{role}</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.25}>
              <div className="mt-6 flex flex-wrap gap-2">
                {stack.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                    className="px-3 py-1 text-sm font-mono text-accent bg-accent/10 rounded hover:bg-accent/20 transition-colors cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((metric, i) => (
                  <AnimatedMetric
                    key={metric.label}
                    value={metric.value}
                    label={metric.label}
                    index={i}
                  />
                ))}
              </div>
            </AnimatedSection>

            {(github || live) && (
              <AnimatedSection delay={0.35}>
                <div className="mt-8 flex gap-4">
                  {github && (
                    <a
                      href={github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent link-underline inline-flex items-center gap-1 group"
                    >
                      View on GitHub{" "}
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                  )}
                  {live && (
                    <a
                      href={live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent link-underline inline-flex items-center gap-1 group"
                    >
                      Live Demo{" "}
                      <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                    </a>
                  )}
                </div>
              </AnimatedSection>
            )}
          </header>

          {/* Content blocks */}
          <div className="prose-custom">
            {content.map((block, index) => renderContentBlock(block, index))}
          </div>

          {/* Next project navigation */}
          <AnimatedSection className="mt-20 pt-12 border-t border-white/10">
            <Link
              href="/#work"
              className="group flex items-center justify-between p-6 rounded-xl border border-white/10 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300"
            >
              <div>
                <span className="text-sm text-text-muted">Back to</span>
                <p className="text-lg text-text-primary group-hover:text-accent transition-colors">
                  All Projects
                </p>
              </div>
              <span className="text-2xl text-accent group-hover:translate-x-2 transition-transform">
                →
              </span>
            </Link>
          </AnimatedSection>
        </div>
      </article>
    </>
  );
}
