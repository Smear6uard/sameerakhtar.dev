"use client";

import { useRef, useState, useEffect } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate active index based on scroll position
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 0;
    const gap = 24; // gap-6 = 24px
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(index, projects.length - 1));
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", updateScrollState);
    updateScrollState();
    return () => container.removeEventListener("scroll", updateScrollState);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 0;
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="work" className="py-32">
      <div className="px-4 md:px-8">
        <div className="max-w-6xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between"
          >
            <span className="section-heading">selected work</span>

            {/* Desktop navigation arrows */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="p-2 rounded-full border border-white/10 text-text-muted hover:text-accent hover:border-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Previous project"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="p-2 rounded-full border border-white/10 text-text-muted hover:text-accent hover:border-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Next project"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4 md:-mx-8 md:px-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {projects.map((project, i) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="group flex-shrink-0 w-[85vw] md:w-[calc(50vw-80px)] lg:w-[calc(40vw-60px)] snap-center border border-white/[0.06] rounded-lg overflow-hidden hover:border-accent/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.06)] transition-all duration-300"
            >
              {/* Project Image Placeholder */}
              <div className="relative h-[200px] md:h-[240px] bg-[#112240] border-b border-white/[0.06] overflow-hidden flex items-center justify-center">
                <span className="text-[100px] md:text-[140px] font-bold text-white/[0.03] select-none">
                  {project.num}
                </span>
              </div>

              <div className="p-5 md:p-6">
                <div className="flex items-start justify-between mb-3">
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

                <p className="text-text-secondary text-sm md:text-base mb-5 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex items-center gap-5">
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

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!scrollRef.current) return;
                const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 0;
                const gap = 24;
                scrollRef.current.scrollTo({
                  left: i * (cardWidth + gap),
                  behavior: "smooth",
                });
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "bg-accent w-6"
                  : "bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
