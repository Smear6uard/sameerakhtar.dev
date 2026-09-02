import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/fx/SectionTitle";
import { Spotlight } from "@/components/fx/Spotlight";
import { CountUp } from "@/components/fx/CountUp";
import { education, honors, skills, stats } from "@/lib/resume";
import { site } from "@/lib/site";

// Camera data read from the original files' EXIF.
const photos = [
  {
    base: "/photography/photo-1",
    alt: "Chicago skyline silhouetted at golden hour",
    meta: "45mm · f/5.6 · 1/320 s · ISO 320 · Jul 2025",
  },
  {
    base: "/photography/photo-2",
    alt: "Wrigley Field under stadium lights at dusk",
    meta: "27mm · f/5 · 1/125 s · ISO 640 · May 2025",
  },
  {
    base: "/photography/photo-3",
    alt: "Stone church in a mountain valley",
    meta: "22mm · f/22 · 1/420 s · ISO 640 · Aug 2025",
  },
  {
    base: "/photography/photo-4",
    alt: "Red brick church against a mountain range",
    meta: "45mm · f/5.6 · 1/4000 s · ISO 800 · Jul 2025",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="wrap relative z-10 pt-20 md:pt-28">
      <Reveal>
        <SectionTitle text="about" />
      </Reveal>

      <div className="mt-8 grid auto-rows-[minmax(150px,auto)] grid-cols-1 gap-4 md:grid-cols-4">
        {/* Bio */}
        <Reveal className="md:col-span-2 md:row-span-2">
          <Spotlight className="flex h-full flex-col md:flex-row" lift={false}>
            <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden md:aspect-auto md:w-[42%]">
              <img
                src="/profile.jpg"
                alt="Sameer Akhtar"
                width={600}
                height={800}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center p-6 md:p-7">
              <p className="text-ink-2">
                Math &amp; CS at DePaul, graduating July 2027. Over the last year I&apos;ve shipped
                a GenAI feature at Quantum Metric, built Renaro on my own, and launched Styleum to
                100+ users. I care about the details that make software feel reliable: the retry,
                the migration, the idempotent webhook.
              </p>
              <p className="mt-4 text-sm text-ink-3">
                Off the clock I co-founded the Muslim Tech Founders newsletter and shoot on a
                Fujifilm X-T30 II.
              </p>
            </div>
          </Spotlight>
        </Reveal>

        {/* Stats */}
        <Reveal delay={0.05}>
          <Spotlight className="flex h-full flex-col justify-center p-6">
            <div className="grid grid-cols-2 gap-5 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-accent">
                    {typeof stat.value === "number" ? (
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="eyebrow mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </Spotlight>
        </Reveal>

        {/* Location */}
        <Reveal delay={0.1}>
          <Spotlight className="flex h-full flex-col items-center justify-center p-6 text-center">
            <span className="relative">
              <span className="breathe absolute inset-0 rounded-full bg-accent/25 blur-xl" />
              <svg
                className="relative h-8 w-8 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
            </span>
            <p className="mt-3 font-medium text-ink">{site.location}</p>
            <p className="mt-1 text-xs text-ink-3">Open to remote</p>
          </Spotlight>
        </Reveal>

        {/* Now */}
        <Reveal delay={0.15}>
          <Spotlight className="flex h-full flex-col justify-between p-6">
            <div>
              <span className="eyebrow inline-flex items-center gap-2">
                <span className="pulse-dot h-2 w-2 rounded-full bg-live" aria-hidden />
                Now
              </span>
              <h3 className="mt-2 text-lg font-bold text-ink">Quantum Metric</h3>
              <p className="mt-1 text-sm text-ink-2">
                SWE intern, owning AI Brand Discovery end to end.
              </p>
            </div>
            <p className="mt-4 font-mono text-xs text-ink-3">Go · Gemini · Cloud Run</p>
          </Spotlight>
        </Reveal>

        {/* Newsletter */}
        <Reveal delay={0.2}>
          <Spotlight className="flex h-full flex-col justify-between p-6">
            <div>
              <span className="eyebrow">Newsletter</span>
              <h3 className="mt-2 text-lg font-bold text-ink">Muslim Tech Founders</h3>
              <p className="mt-1 text-sm text-ink-2">
                Co-founder. Startup insights for{" "}
                <span className="text-accent">
                  <CountUp value={500} suffix="+" />
                </span>{" "}
                subscribers.
              </p>
            </div>
            <a
              href={site.newsletter}
              target="_blank"
              rel="noopener noreferrer"
              className="link mt-4 text-sm"
            >
              subscribe →
            </a>
          </Spotlight>
        </Reveal>

        {/* Tech stack */}
        <Reveal className="md:col-span-2">
          <Spotlight className="h-full p-6" lift={false}>
            <span className="eyebrow">Tech stack</span>
            <TechStack />
          </Spotlight>
        </Reveal>

        {/* Photography */}
        <Reveal className="md:col-span-2" delay={0.05}>
          <Spotlight className="h-full" lift={false}>
            <PhotoGallery />
          </Spotlight>
        </Reveal>

        {/* Education */}
        <Reveal className="md:col-span-2">
          <Spotlight className="flex h-full items-center justify-between gap-6 p-6">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
                  />
                </svg>
              </span>
              <div>
                <h3 className="font-bold text-ink">{education.school}</h3>
                <p className="text-sm text-ink-2">
                  {education.degree} · {education.gpa} GPA
                </p>
                <p className="mt-0.5 text-xs text-ink-3">{education.coursework}</p>
              </div>
            </div>
            <GraduationCountdown target="2027-07-01" />
          </Spotlight>
        </Reveal>

        {/* Honors */}
        <Reveal className="md:col-span-2" delay={0.05}>
          <Spotlight className="flex h-full flex-col justify-center gap-4 p-6">
            {honors.map((honor) => (
              <div key={honor.title} className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-ink">
                    <a
                      href={honor.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-accent"
                    >
                      {honor.title} <span aria-hidden="true">↗</span>
                    </a>
                  </p>
                  <p className="text-sm text-ink-2">{honor.detail}</p>
                </div>
                <p className="shrink-0 font-mono text-xs text-ink-3">{honor.when}</p>
              </div>
            ))}
          </Spotlight>
        </Reveal>
      </div>
    </section>
  );
}

function TechStack() {
  const [active, setActive] = useState(0);
  const group = skills[active];

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {skills.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-full border px-3 py-1 text-xs transition-all ${
              i === active
                ? "border-accent/40 bg-accent/15 text-accent"
                : "border-line text-ink-3 hover:border-accent/30 hover:text-ink-2"
            }`}
            aria-pressed={i === active}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div key={group.label} className="animate-fade-in mt-4 flex flex-wrap gap-2">
        {group.items.map((item) => (
          <span key={item} className="pill cursor-default">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function PhotoGallery() {
  const [active, setActive] = useState(0);
  const photo = photos[active];

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-[16rem] flex-1 overflow-hidden">
        <picture key={photo.base}>
          <source type="image/webp" srcSet={`${photo.base}.webp`} />
          <img
            src={`${photo.base}.jpg`}
            alt={photo.alt}
            width={1800}
            height={1200}
            loading="lazy"
            decoding="async"
            className="animate-fade-in absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <span className="absolute top-4 left-4 rounded bg-black/40 px-2 py-1 font-mono text-[10px] tracking-widest text-white/85 uppercase backdrop-blur-sm">
          Photography · X-T30 II · XC 15-45mm
        </span>
        <span
          key={photo.meta}
          className="animate-fade-in absolute bottom-3 left-4 rounded bg-black/45 px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-white/80 backdrop-blur-sm"
        >
          {photo.meta}
        </span>
      </div>
      <div className="flex gap-2 px-4 py-3">
        {photos.map((p, i) => (
          <button
            key={p.base}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show photo ${i + 1}`}
            aria-pressed={i === active}
            className={`relative h-14 flex-1 overflow-hidden rounded-lg transition-all ${
              i === active
                ? "ring-2 ring-accent ring-offset-2 ring-offset-elev"
                : "opacity-55 hover:opacity-100"
            }`}
          >
            <picture>
              <source type="image/webp" srcSet={`${p.base}-thumb.webp`} />
              <img
                src={`${p.base}-thumb.jpg`}
                alt=""
                width={640}
                height={427}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </picture>
          </button>
        ))}
      </div>
    </div>
  );
}

function GraduationCountdown({ target }: { target: string }) {
  const months = Math.max(
    0,
    Math.round((new Date(target).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30.44)),
  );
  return (
    <div className="shrink-0 text-right">
      <p className="text-3xl font-bold text-accent tabular-nums">{months}</p>
      <p className="eyebrow">months to grad</p>
    </div>
  );
}
