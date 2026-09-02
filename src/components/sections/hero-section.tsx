import type { CSSProperties } from "react";
import { PerceptionDemo } from "@/components/perception/PerceptionDemo";
import { Magnetic } from "@/components/fx/Magnetic";
import { useToast } from "@/components/ui/Toast";
import { proof } from "@/lib/resume";
import { links, site } from "@/lib/site";

const rise = (delay: number): CSSProperties => ({ animationDelay: `${delay}s` });

export function HeroSection() {
  const { showToast } = useToast();

  const copyEmail = async (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(site.email);
      showToast("Email copied");
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section id="hero" className="wrap relative z-10 pt-12 pb-10 md:pt-20 md:pb-14">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <p
            className="rise flex items-center gap-2.5 font-mono text-sm tracking-wide text-accent"
            style={rise(0)}
          >
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-accent" aria-hidden />
            open to 2027 new-grad roles · chicago / remote
          </p>

          <h1 className="display-xl rise mt-5" style={rise(0.06)}>
            sameer akhtar
          </h1>
          <p className="rise mt-3 text-xl text-ink-2 md:text-2xl" style={rise(0.12)}>
            Software Engineer &amp; Founder
          </p>

          <p className="lede rise mt-7 max-w-[34rem]" style={rise(0.18)}>
            I build AI features and real-time systems. Right now that means owning{" "}
            <strong>AI Brand Discovery</strong> at Quantum Metric. Before that I founded{" "}
            <a href={links.renaro} target="_blank" rel="noopener noreferrer" className="link">
              Renaro
            </a>
            , dispatch software for taxi and limo fleets, and shipped{" "}
            <a
              href={links.styleumAppStore}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Styleum
            </a>{" "}
            to the App Store.
          </p>
          <p className="rise mt-4 text-ink-3" style={rise(0.22)}>
            Math &amp; CS at DePaul, class of 2027.
          </p>

          <div className="rise mt-8 flex flex-wrap items-center gap-3" style={rise(0.28)}>
            <Magnetic>
              <a href={`mailto:${site.email}`} className="btn btn-primary">
                Email me <span aria-hidden="true">→</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={site.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Resume <span aria-hidden="true">↗</span>
              </a>
            </Magnetic>
          </div>

          <div className="rise mt-7 flex items-center gap-5" style={rise(0.34)}>
            <Magnetic radius={60} strength={6}>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="link-quiet block"
              >
                <GitHubIcon />
              </a>
            </Magnetic>
            <Magnetic radius={60} strength={6}>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="link-quiet block"
              >
                <LinkedInIcon />
              </a>
            </Magnetic>
            <Magnetic radius={60} strength={6}>
              <a
                href={`mailto:${site.email}`}
                onClick={copyEmail}
                aria-label="Copy email address"
                title="Click to copy, Cmd/Ctrl+click to open your mail app"
                className="link-quiet block"
              >
                <MailIcon />
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="rise lg:col-span-6" style={rise(0.24)}>
          <PerceptionDemo />
        </div>
      </div>

      <dl className="rise mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" style={rise(0.42)}>
        {proof.map((item) => (
          <div key={item.value} className="glass px-5 py-4">
            <dt className="font-mono text-2xl font-bold text-accent">{item.value}</dt>
            <dd className="mt-1 text-[13px] leading-snug text-ink-3">{item.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function GitHubIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6L12 13L2 6" />
    </svg>
  );
}
