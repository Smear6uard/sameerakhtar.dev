import type { CSSProperties } from "react";
import { PerceptionDemo } from "@/components/perception/PerceptionDemo";
import { proof } from "@/lib/resume";
import { site } from "@/lib/site";

const rise = (delay: number) => ({
  className: "rise",
  style: { animationDelay: `${delay}s` } as CSSProperties,
});

export function HeroSection() {
  return (
    <section id="hero" className="wrap pt-10 pb-8 md:pt-16 md:pb-12">
      <p className="eyebrow rise" style={rise(0).style}>
        Sameer Akhtar · Software engineer · Chicago
      </p>

      <h1 className="display-xl rise mt-5 max-w-[18ch]" style={rise(0.06).style}>
        AI features and real‑time systems that survive production.
      </h1>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="rise lg:col-span-5" style={rise(0.14).style}>
          <p className="lede">
            Right now I own <strong>AI Brand Discovery</strong> at Quantum Metric, a GenAI feature
            that went from pre-GA design to production on my watch. Before that I founded{" "}
            <strong>Renaro</strong>, dispatch software for taxi and limo fleets, and shipped{" "}
            <strong>Styleum</strong>, an iOS app past 100 users. Math &amp; CS at DePaul, graduating{" "}
            {site.graduation}.
          </p>

          <p className="mt-6 flex items-start gap-2.5 text-sm text-ink-2">
            <span
              className="live-dot mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-live"
              aria-hidden="true"
            />
            {site.availability}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href={`mailto:${site.email}`} className="btn btn-primary">
              Email me
            </a>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Resume
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <a href={site.github} target="_blank" rel="noopener noreferrer" className="link-quiet">
              GitHub ↗
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet"
            >
              LinkedIn ↗
            </a>
          </p>
        </div>

        <div className="rise lg:col-span-7" style={rise(0.2).style}>
          <PerceptionDemo />
        </div>
      </div>

      <dl
        className="scrollbar-hide hairline rise mt-14 flex gap-8 overflow-x-auto pt-6 md:grid md:grid-cols-4 md:gap-10"
        style={rise(0.3).style}
      >
        {proof.map((item) => (
          <div key={item.value} className="min-w-[13rem] md:min-w-0">
            <dt className="font-display text-2xl font-semibold tracking-tight text-ink">
              {item.value}
            </dt>
            <dd className="mt-1.5 text-[13px] leading-snug text-ink-3">{item.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
