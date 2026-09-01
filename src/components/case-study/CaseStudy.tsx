import { Link } from "@/components/ui/Link";
import { Reveal } from "@/components/ui/Reveal";
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
      <article className="wrap pt-10 pb-8 md:pt-14">
        <Reveal>
          <Link href="/work" className="link-quiet text-sm">
            ← All work
          </Link>
          <p className="eyebrow mt-8">
            {project.timeline} · {project.role}
          </p>
          <h1 className="display-xl mt-4 max-w-[16ch]">{project.title}</h1>
          <p className="lede mt-6 max-w-[58ch]">{project.subtitle}</p>
        </Reveal>

        <Reveal className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <WorkVisual slug={project.slug} />
          </div>
          <div className="lg:col-span-5">
            <dl className="grid gap-5">
              {project.highlights.map((h) => (
                <div key={h.label} className="hairline pt-4 first:border-0 first:pt-0">
                  <dt className="font-display text-2xl font-semibold tracking-tight text-ink">
                    {h.value}
                  </dt>
                  <dd className="mt-1 text-sm text-ink-3">{h.label}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 font-mono text-xs leading-relaxed text-ink-3">
              {project.stack.join(" · ")}
            </p>
            {project.links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
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
          </div>
        </Reveal>

        <div className="prose-site mt-16 max-w-[68ch]">
          {content.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </div>

        <Reveal className="hairline mt-20 pt-10">
          <Link
            href="/work"
            className="group flex items-center justify-between rounded-2xl border border-line p-6 transition-colors hover:border-line-strong"
          >
            <span>
              <span className="eyebrow">Next</span>
              <span className="mt-1 block text-lg text-ink">All work</span>
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
          {block.filename && (
            <figcaption className="flex items-center justify-between border-b border-[rgba(237,232,223,0.1)] px-4 py-2 font-mono text-[11px] text-[rgba(237,232,223,0.55)]">
              <span>{block.filename}</span>
              <span>{block.language}</span>
            </figcaption>
          )}
          <pre className="!my-0 !rounded-none !border-0">
            {/* Safe: pre-highlighted from static developer-controlled content. */}
            <code dangerouslySetInnerHTML={{ __html: block.highlightedCode }} />
          </pre>
        </figure>
      );
    default:
      return null;
  }
}
