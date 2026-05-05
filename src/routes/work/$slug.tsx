// Project case study — equivalent of `src/app/work/[slug]/page.tsx` in Next.js.
// Next dynamic segment `[slug]` becomes `$slug` in TanStack Router conventions.

import { createFileRoute, notFound } from "@tanstack/react-router";
import { BreadcrumbJsonLd, ProjectJsonLd } from "@/components/JsonLd";
import { HeroImage } from "@/components/ui/HeroImage";
import { CaseStudyClient } from "@/components/case-study/CaseStudyClient";
import { getProject, processContentBlocks } from "@/lib/projects";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return {
      project,
      processedContent: processContentBlocks(project.content),
    };
  },
  head: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) return { meta: [{ title: "Project Not Found" }] };

    return {
      meta: [
        ...seo({
          title: `${project.title} | Sameer Akhtar`,
          description: project.subtitle,
          type: "article",
          url: `https://sameerakhtar.dev/work/${params.slug}`,
        }),
      ],
      links: [
        {
          rel: "canonical",
          href: `https://sameerakhtar.dev/work/${params.slug}`,
        },
      ],
    };
  },
  component: CaseStudy,
});

function CaseStudy() {
  const { slug } = Route.useParams();
  const { project, processedContent } = Route.useLoaderData();

  const datePublished = project.timeline.includes("Dec 2025")
    ? "2025-12-01"
    : project.timeline.includes("Feb 2026")
      ? "2026-02-01"
      : "2025-10-01";

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://sameerakhtar.dev" },
          { name: "Projects", url: "https://sameerakhtar.dev/#work" },
          {
            name: project.title,
            url: `https://sameerakhtar.dev/work/${slug}`,
          },
        ]}
      />
      <ProjectJsonLd
        title={project.title}
        description={project.subtitle}
        url={`https://sameerakhtar.dev/work/${slug}`}
        datePublished={datePublished}
        author="Sameer Akhtar"
      />

      <div className="pt-32">
        <HeroImage src={project.heroImage} alt={project.title} />
      </div>

      <CaseStudyClient
        title={project.title}
        subtitle={project.subtitle}
        timeline={project.timeline}
        role={project.role}
        stack={project.stack}
        github={project.github}
        live={project.live}
        metrics={project.metrics}
        content={processedContent}
      />
    </>
  );
}
