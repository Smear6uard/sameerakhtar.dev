import { Link } from "@/components/ui/Link";
import { Reveal } from "@/components/ui/Reveal";
import type { Project } from "@/lib/projects";
import { WorkVisual } from "./WorkVisual";

export function WorkRow({ project }: { project: Project }) {
  return (
    <Reveal as="article" className="hairline grid gap-8 py-12 md:grid-cols-12 md:gap-12 md:py-14">
      <div className="md:col-span-7">
        <p className="eyebrow">
          {project.year} · {project.role}
        </p>
        <h3 className="display-md mt-3">
          <Link href={`/work/${project.slug}`} className="transition-colors hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 max-w-[56ch] text-ink-2">{project.summary}</p>

        <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-3">
          {project.highlights.map((h) => (
            <div key={h.label}>
              <dt className="font-mono text-[15px] font-medium tracking-tight text-ink">
                {h.value}
              </dt>
              <dd className="mt-1 text-[13px] leading-snug text-ink-3">{h.label}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 font-mono text-xs text-ink-3">{project.stack.join(" · ")}</p>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href={`/work/${project.slug}`} className="link">
            Case study →
          </Link>
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>

      <div className="md:col-span-5">
        <Link href={`/work/${project.slug}`} aria-label={`${project.title} case study`}>
          <WorkVisual slug={project.slug} />
        </Link>
      </div>
    </Reveal>
  );
}
