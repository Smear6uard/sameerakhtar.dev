import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { CaseStudy } from "@/components/case-study/CaseStudy";
import { getProject, processContentBlocks } from "@/lib/projects";
import { seo } from "@/lib/seo";
import { site } from "@/lib/site";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project, content: processContentBlocks(project.content) };
  },
  head: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) return { meta: [{ title: "Not found — Sameer Akhtar" }] };
    return {
      meta: [
        ...seo({
          title: `${project.title} — Sameer Akhtar`,
          description: project.subtitle,
          type: "article",
          url: `${site.url}/work/${params.slug}`,
        }),
      ],
      links: [{ rel: "canonical", href: `${site.url}/work/${params.slug}` }],
    };
  },
  component: CaseStudyPage,
});

function CaseStudyPage() {
  const { slug } = Route.useParams();
  const { project, content } = Route.useLoaderData();
  const url = `${site.url}/work/${slug}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Work", url: `${site.url}/work` },
          { name: project.title, url },
        ]}
      />
      <ArticleJsonLd
        title={project.title}
        description={project.subtitle}
        url={url}
        datePublished={project.datePublished}
      />
      <CaseStudy project={project} content={content} />
    </>
  );
}
