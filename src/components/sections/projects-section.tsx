"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { Img as Image } from "@/components/ui/Img";
import Tilt from "react-parallax-tilt";
import { SectionScramble } from "@/components/ui/SectionScramble";
import { ProjectArchitectureVisual } from "@/components/ui/ProjectArchitectureVisual";

type ProjectCard = {
  num: string;
  title: string;
  description: string;
  metric: string;
  slug: string;
  live?: string;
  github?: string;
  image?: string;
  imageAlt: string;
  gradient: string;
};

const projects: ProjectCard[] = [
  {
    num: "01",
    title: "Styleum",
    description:
      "5-stage ML pipeline (BiRefNet, Florence-2, FashionSigLIP, AWS Rekognition, Gemini) generating AI outfits at $0.002 each — 40% below competitors. Full-stack iOS app shipped to the App Store in 8 weeks.",
    metric: "$0.002/outfit",
    slug: "styleum",
    live: "https://apps.apple.com/us/app/styleum-daily-fits/id6757777880",
    imageAlt: "Styleum AI styling iOS app interface",
    gradient: "from-orange-500/20 to-amber-500/10",
  },
  {
    num: "02",
    title: "HazardLens",
    description:
      "Real-time construction safety detection using YOLO26 NMS-free inference at 15+ FPS. Temporal event detection identifies zone violations, PPE removal, and near-miss incidents with severity-based alerting and a live compliance dashboard.",
    metric: "15+ FPS",
    slug: "hazardlens",
    github: "https://github.com/Smear6uard/HazardLens",
    imageAlt: "HazardLens real-time safety detection dashboard",
    gradient: "from-red-500/20 to-orange-500/10",
  },
  {
    num: "03",
    title: "Intelligent LLM Router",
    description:
      "Routing layer classifying prompt complexity across 7 task types using 6 weighted signals to select the optimal model (GPT-4o, Claude, Gemini, DeepSeek), cutting API costs by up to 40% with under 50ms overhead.",
    metric: "40% cost savings",
    slug: "llm-router",
    github: "https://github.com/Smear6uard/Intelligent-LLM-Router",
    imageAlt: "Intelligent LLM Router analytics dashboard",
    gradient: "from-blue-500/20 to-cyan-500/10",
  },
  {
    num: "04",
    title: "DeepCite",
    description:
      "Dual-mode retrieval pipeline (Cheerio to Puppeteer fallback + Serper web search) with Redis caching, processing 100+ URLs/hr. LLM streaming with server-sent events achieving sub-100ms perceived latency with inline source citations.",
    metric: "100+ URLs/hr",
    slug: "deepcite",
    github: "https://github.com/Smear6uard/DeepCite",
    live: "https://deep-cite-git-main-sameer-akhtars-projects.vercel.app/",
    imageAlt: "DeepCite AI research engine interface",
    gradient: "from-green-500/20 to-emerald-500/10",
  },
];

export function ProjectsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    if (scrollLeft > 20 && !hasScrolled) {
      setHasScrolled(true);
    }

    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 0;
    const gap = 24;
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(index, projects.length - 1));

    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", updateScrollState);
    updateScrollState();
    return () => container.removeEventListener("scroll", updateScrollState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 0;
    const gap = 24;
    const targetIndex =
      direction === "left"
        ? Math.max(0, activeIndex - 1)
        : Math.min(projects.length - 1, activeIndex + 1);
    scrollRef.current.scrollTo({
      left: targetIndex * (cardWidth + gap),
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
            <SectionScramble text="selected work" className="section-heading" />

            <div className="flex items-center gap-4">
              <AnimatePresence>
                {!hasScrolled && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0.5, 1] }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 2,
                      times: [0, 0.3, 0.6, 0.8, 1],
                      ease: "easeOut",
                    }}
                    className="font-mono text-xs uppercase tracking-widest text-text-muted/60"
                  >
                    <span className="hidden md:inline">drag or scroll →</span>
                    <span className="md:hidden">swipe →</span>
                  </motion.span>
                )}
              </AnimatePresence>

              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  className="p-2 rounded-full border border-white/10 text-text-muted hover:text-accent hover:border-accent/50 hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-[180ms]"
                  aria-label="Previous project"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  className="p-2 rounded-full border border-white/10 text-text-muted hover:text-accent hover:border-accent/50 hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-[180ms]"
                  aria-label="Next project"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
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
            <Tilt
              key={project.slug}
              tiltMaxAngleX={5}
              tiltMaxAngleY={5}
              glareEnable={true}
              glareMaxOpacity={0.1}
              glareColor="#f97316"
              glarePosition="all"
              glareBorderRadius="8px"
              scale={1.02}
              transitionSpeed={400}
              className="flex-shrink-0 w-[85vw] md:w-[calc(50vw-80px)] lg:w-[calc(40vw-60px)] snap-center"
            >
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="group h-full min-h-[420px] md:min-h-[520px] border border-white/[0.06] rounded-lg overflow-hidden hover:border-accent/50 hover:shadow-[0_0_40px_rgba(249,115,22,0.08)] transition-all duration-200 ease-out bg-bg-primary"
              >
                {/* Project Image */}
                <div
                  className={`relative h-[240px] md:h-[300px] bg-gradient-to-br ${project.gradient} border-b border-white/[0.06] overflow-hidden`}
                >
                  <ProjectImage
                    src={project.image}
                    alt={project.imageAlt}
                    fallbackNum={project.num}
                    title={project.title}
                  />
                  <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-300" />
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-mono text-sm text-text-muted">{project.num}</span>
                    <span className="font-mono text-base font-semibold text-accent">
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
            </Tilt>
          ))}
        </div>

        {/* Scroll indicators */}
        <div className="mt-6">
          {/* Desktop: Progress bar */}
          <div className="hidden md:flex justify-center">
            <div className="w-40 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-150"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>

          {/* Mobile: Dots */}
          <div className="flex md:hidden justify-center items-center gap-2">
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
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-6 bg-accent" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to project ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectImage({
  src,
  alt,
  fallbackNum,
  title,
}: {
  src?: string;
  alt: string;
  fallbackNum: string;
  title: string;
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(src));

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      setHasError(false);
      return;
    }

    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };
  }, [src]);

  if (!src || hasError || isLoading) {
    return (
      <div className="absolute inset-0">
        <ProjectArchitectureVisual src={src} title={title} variant="thumbnail" />
        <span className="absolute right-4 top-3 font-mono text-5xl font-bold text-white/[0.05] select-none md:text-7xl">
          {fallbackNum}
        </span>
        {hasError && null}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
      sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 40vw"
    />
  );
}
