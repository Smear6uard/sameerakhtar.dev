"use client";

import { motion } from "framer-motion";
import { Img as Image } from "@/components/ui/Img";
import { SectionScramble } from "@/components/ui/SectionScramble";
import { BentoCard, StatCounter } from "@/components/ui/BentoCard";
import { useState } from "react";

const techStack = {
  languages: ["JavaScript", "TypeScript", "Python", "Java", "Swift", "SQL", "C++"],
  frameworks: ["React", "Next.js", "Angular", "SwiftUI", "FastAPI", "Node.js", "Tailwind"],
  tools: ["Docker", "Kubernetes", "AWS", "PostgreSQL", "Redis", "Supabase", "Git", "Vercel"],
  aiml: ["PyTorch", "YOLO", "OpenCV", "LLM APIs", "BiRefNet", "FashionSigLIP", "Florence-2"],
};

const photos = [
  { src: "/photography/DSCF0606.JPG", alt: "Photography by Sameer Akhtar" },
  { src: "/photography/DSCF1295.JPG", alt: "Photography by Sameer Akhtar" },
  { src: "/photography/DSCF1748.JPG", alt: "Photography by Sameer Akhtar" },
  { src: "/photography/DSCF2111.jpg", alt: "Photography by Sameer Akhtar" },
];

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

        {/* Bento Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(140px,auto)]">
          {/* Main Bio Card - Large */}
          <BentoCard colSpan={2} rowSpan={2} delay={0} className="p-0">
            <div className="h-full flex flex-col">
              {/* Profile Image */}
              <div className="relative h-64 md:h-[26rem] overflow-hidden">
                <Image
                  src="/profile.jpg"
                  alt="Sameer Akhtar"
                  fill
                  className="object-cover object-[center_55%]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary/60 via-transparent to-transparent" />
              </div>

              {/* Bio Text */}
              <div className="p-6 flex-1">
                <p className="text-text-secondary leading-relaxed">
                  I care about the details most people skip. The animation that&apos;s 200ms faster.
                  The API call that costs <span className="text-accent font-mono">$0.002</span>{" "}
                  instead of $0.02. The feature users don&apos;t notice—because it doesn&apos;t get
                  in their way.
                </p>
                <p className="text-text-muted text-sm mt-4">
                  When I&apos;m not shipping code, I shoot on a Fujifilm X-T30 II.
                </p>
              </div>
            </div>
          </BentoCard>

          {/* Stats Card */}
          <BentoCard delay={1} className="p-6 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4">
              <StatCounter value={4} suffix="+" label="Years Coding" delay={0.2} />
              <StatCounter value={15} suffix="+" label="Projects" delay={0.3} />
            </div>
          </BentoCard>

          {/* Location Card */}
          <BentoCard delay={2} className="p-6 flex flex-col justify-center items-center">
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-accent/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.3, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <svg
                className="w-8 h-8 text-accent relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-text-primary mt-3 font-medium">Chicago Area</p>
            <p className="text-xs text-text-muted mt-1">Open to Remote</p>
          </BentoCard>

          {/* Tech Stack Card */}
          <BentoCard colSpan={2} delay={3} className="p-6">
            <h3 className="text-xs uppercase tracking-wider text-text-muted font-mono mb-4">
              Tech Stack
            </h3>
            <TechStackPills />
          </BentoCard>

          {/* Currently Building Card */}
          <BentoCard delay={4} className="p-6 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted font-mono">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Building
              </span>
              <h3 className="text-xl font-semibold text-text-primary mt-2">Styleum</h3>
              <p className="text-sm text-text-secondary mt-1">AI styling iOS app — $0.002/outfit</p>
            </div>
            <a
              href="https://apps.apple.com/us/app/styleum-daily-fits/id6757777880"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent link-underline mt-4 inline-flex items-center gap-1"
            >
              Visit <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </BentoCard>

          {/* Newsletter Card */}
          <BentoCard delay={5} className="p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-text-muted font-mono">
                Newsletter
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <StatCounter value={500} suffix="+" label="" delay={0.5} />
                <span className="text-sm text-text-muted">subscribers</span>
              </div>
            </div>
            <a
              href="https://sameerakhtar.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent link-underline mt-3 inline-flex items-center gap-1"
            >
              Subscribe <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </BentoCard>

          {/* Photography Gallery Card */}
          <BentoCard colSpan={2} delay={6} className="p-0 overflow-hidden">
            <PhotoGallery photos={photos} />
          </BentoCard>

          {/* Education Card */}
          <BentoCard colSpan={2} delay={7} className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">DePaul University</h3>
                <p className="text-sm text-text-muted">
                  BS Mathematics & Computer Science · 3.8 GPA
                </p>
              </div>
            </div>
            <div className="text-right">
              <GraduationCountdown targetDate="2027-07-01" />
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

function TechStackPills() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof techStack>("languages");

  const categories: { key: keyof typeof techStack; label: string }[] = [
    { key: "languages", label: "Languages" },
    { key: "frameworks", label: "Frameworks" },
    { key: "tools", label: "Dev Tools" },
    { key: "aiml", label: "AI/ML" },
  ];

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
              activeCategory === cat.key
                ? "bg-accent/20 text-accent border border-accent/30"
                : "bg-white/5 text-text-muted border border-white/10 hover:border-accent/20"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Skills */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {techStack[activeCategory].map((skill, i) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className="px-3 py-1.5 text-sm bg-bg-tertiary/50 text-text-secondary rounded-lg border border-white/5 hover:border-accent/30 hover:text-accent hover:shadow-[0_0_15px_rgba(249,115,22,0.1)] transition-all duration-200 cursor-default"
          >
            {skill}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

function PhotoGallery({ photos }: { photos: { src: string; alt: string }[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasError, setHasError] = useState<Record<number, boolean>>({});

  return (
    <div className="flex flex-col">
      {/* Main image */}
      <div className="relative h-[280px] overflow-hidden rounded-t-xl">
        {!hasError[activeIndex] ? (
          <Image
            src={photos[activeIndex].src}
            alt={photos[activeIndex].alt}
            fill
            className="object-cover transition-opacity duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setHasError((prev) => ({ ...prev, [activeIndex]: true }))}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/10 to-transparent">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-accent/40 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                />
              </svg>
              <p className="text-xs text-text-muted mt-2 font-mono">Fujifilm X-T30 II</p>
              <p className="text-xs text-text-muted/60 mt-1">Photos coming soon</p>
            </div>
          </div>
        )}
        {/* Label */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-xs uppercase tracking-wider text-white/80 font-mono bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
            Photography
          </span>
        </div>
      </div>

      {/* Thumbnail strip - below the image */}
      <div className="flex gap-2 px-4 py-3">
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative h-14 flex-1 rounded-lg overflow-hidden transition-all duration-200 ${
              i === activeIndex
                ? "ring-2 ring-accent ring-offset-2 ring-offset-bg-secondary"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            {!hasError[i] ? (
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="100px"
                onError={() => setHasError((prev) => ({ ...prev, [i]: true }))}
              />
            ) : (
              <div className="absolute inset-0 bg-accent/10 flex items-center justify-center">
                <span className="text-xs text-accent/40">{i + 1}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function GraduationCountdown({ targetDate }: { targetDate: string }) {
  const target = new Date(targetDate);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const months = Math.floor(days / 30);

  return (
    <div>
      <p className="text-2xl font-bold text-accent tabular-nums">{months}</p>
      <p className="text-xs text-text-muted uppercase tracking-wider">months to grad</p>
    </div>
  );
}
