import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@/components/ui/Link";
import { Reveal } from "@/components/ui/Reveal";
import { WorkRow } from "@/components/work/WorkRow";
import { getArchivedProjects, getFeaturedProjects } from "@/lib/projects";
import { seo } from "@/lib/seo";
import { site } from "@/lib/site";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      ...seo({
        title: "Work — Sameer Akhtar",
        description:
          "Case studies from Sameer Akhtar: Renaro dispatch SaaS, AI Brand Discovery at Quantum Metric, Styleum, HazardLens, and WindWalk.",
        url: `${site.url}/work`,
      }),
    ],
    links: [{ rel: "canonical", href: `${site.url}/work` }],
  }),
  component: WorkPage,
});

function WorkPage() {
  const featured = getFeaturedProjects();
  const archived = getArchivedProjects();

  return (
    <div className="wrap pt-10 pb-8 md:pt-16">
      <Reveal>
        <p className="eyebrow">Work</p>
        <h1 className="display-xl mt-5 max-w-[16ch]">Everything I have shipped, in one place.</h1>
        <p className="lede mt-6 max-w-[56ch]">
          Five projects with real users, real load, or a real prize. Each case study covers what
          broke, what changed, and what came out of it.
        </p>
      </Reveal>

      <div className="mt-10">
        {featured.map((project) => (
          <WorkRow key={project.slug} project={project} />
        ))}
      </div>

      <Reveal className="hairline mt-4 pt-12">
        <p className="eyebrow">Earlier</p>
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {archived.map((project) => (
            <li key={project.slug} className="card p-6">
              <p className="eyebrow">
                {project.year} · {project.role}
              </p>
              <h2 className="display-md mt-3">
                <Link
                  href={`/work/${project.slug}`}
                  className="transition-colors hover:text-accent"
                >
                  {project.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-ink-2">{project.subtitle}</p>
              <p className="mt-4 font-mono text-xs text-ink-3">{project.stack.join(" · ")}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
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
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
