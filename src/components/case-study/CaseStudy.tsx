import { Link } from "@/components/ui/Link";
import { Reveal } from "@/components/ui/Reveal";
import { Spotlight } from "@/components/fx/Spotlight";
import { WorkVisual } from "@/components/work/WorkVisual";
import type { ProcessedContentBlock, Project } from "@/lib/projects";
import { ReadingProgress } from "./ReadingProgress";

interface CaseStudyProps {
  project: Project;
  content: ProcessedContentBlock[];
}

export function CaseStudy({ project, content }: CaseStudyProps) {
  return (
    <>
      <ReadingProgress />
      <article className="wrap relative z-10 pt-12 pb-8 md:pt-16">
        <Reveal>
          <Link href="/work" className="link-quiet group inline-flex items-center gap-1 text-sm">
            <span className="transition-transform group-hover:-translate-x-1">←</span> back to work
          </Link>
          <p className="eyebrow mt-8">
            {project.timeline} · {project.role}
          </p>
          <h1 className="display-xl mt-4">{project.title}</h1>
          <p className="lede mt-5 max-w-[58ch]">{project.subtitle}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span key={tech} className="pill pill-accent font-mono text-xs">
                {tech}
              </span>
            ))}
          </div>

          {project.links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal className="glass mt-10 overflow-hidden" delay={0.05}>
          <WorkVisual slug={project.slug} className="aspect-[16/9] md:aspect-[21/9]" />
        </Reveal>

        <Reveal className="mt-6 grid gap-4 sm:grid-cols-3" delay={0.1}>
          {project.highlights.map((h) => (
            <Spotlight key={h.label} className="p-5" lift={false}>
              <p className="font-mono text-2xl font-bold text-accent">{h.value}</p>
              <p className="mt-1 text-sm text-ink-3">{h.label}</p>
            </Spotlight>
          ))}
        </Reveal>

        <div className="prose-site mt-14 max-w-[68ch]">
          {content.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </div>

        <Reveal className="mt-20">
          <Link
            href="/work"
            className="glass group flex items-center justify-between p-6 transition-colors"
          >
            <span>
              <span className="eyebrow">Back to</span>
              <span className="mt-1 block text-lg text-ink transition-colors group-hover:text-accent">
                All work
              </span>
            </span>
            <span className="text-2xl text-accent transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </article>
    </>
  );
}

function Block({ block }: { block: ProcessedContentBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 2 ? <h2>{block.content}</h2> : <h3>{block.content}</h3>;
    case "text":
      return <p>{block.content}</p>;
    case "list":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "callout":
      return <blockquote>{block.content}</blockquote>;
    case "code":
      return (
        <figure className="my-6 overflow-hidden rounded-xl border border-line bg-panel">
          <figcaption className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5 font-mono text-[11px] text-white/55">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            </span>
            <span>{block.filename ?? block.language}</span>
          </figcaption>
          <pre>
            {/* Safe: pre-highlighted from static developer-controlled content. */}
            <code dangerouslySetInnerHTML={{ __html: block.highlightedCode }} />
          </pre>
        </figure>
      );
    default:
      return null;
  }
}
