import { Link } from "@/components/ui/Link";
import { Spotlight } from "@/components/fx/Spotlight";
import type { Project } from "@/lib/projects";
import { WorkVisual } from "./WorkVisual";

interface WorkCardProps {
  project: Project;
  /** Wide layout: visual beside the copy instead of above it. */
  featured?: boolean;
}

export function WorkCard({ project, featured = false }: WorkCardProps) {
  return (
    <Spotlight
      as="article"
      className={`group flex h-full flex-col ${featured ? "md:col-span-2 md:flex-row" : ""}`}
    >
      <Link
        href={`/work/${project.slug}`}
        aria-label={`${project.title} case study`}
        className={`block border-line ${featured ? "border-b md:w-1/2 md:border-r md:border-b-0" : "border-b"}`}
      >
        <WorkVisual
          slug={project.slug}
          className={featured ? "aspect-[16/10] md:h-full md:min-h-[320px]" : "aspect-[16/9]"}
        />
      </Link>

      <div className={`flex flex-1 flex-col p-6 ${featured ? "md:p-8" : ""}`}>
        <p className="eyebrow">
          {project.year} · {project.role}
        </p>
        <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink">
          <Link
            href={`/work/${project.slug}`}
            className="transition-colors group-hover:text-accent"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">{project.summary}</p>

        <dl className="mt-5 grid grid-cols-3 gap-3">
          {project.highlights.map((h) => (
            <div key={h.label}>
              <dt className="font-mono text-sm font-medium text-accent">{h.value}</dt>
              <dd className="mt-1 text-xs leading-snug text-ink-3">{h.label}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 font-mono text-[11px] leading-relaxed text-ink-3">
          {project.stack.join(" · ")}
        </p>

        <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6 text-sm">
          <Link href={`/work/${project.slug}`} className="link">
            view case study{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet"
            >
              {link.label.toLowerCase()} ↗
            </a>
          ))}
        </div>
      </div>
    </Spotlight>
  );
}
