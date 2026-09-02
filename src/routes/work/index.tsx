import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@/components/ui/Link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/fx/SectionTitle";
import { Spotlight } from "@/components/fx/Spotlight";
import { WorkCard } from "@/components/work/WorkCard";
import { getArchivedProjects, getFeaturedProjects } from "@/lib/projects";
import { seo } from "@/lib/seo";
import { site } from "@/lib/site";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      ...seo({
        title: "Work | Sameer Akhtar",
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
  const [first, ...rest] = getFeaturedProjects();
  const archived = getArchivedProjects();

  return (
    <div className="wrap relative z-10 pt-12 pb-8 md:pt-20">
      <Reveal>
        <SectionTitle text="work" />
        <h1 className="display-lg mt-4">Case studies</h1>
        <p className="lede mt-4 max-w-[52ch]">
          What each project does, what broke along the way, and the numbers that came out of it.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Reveal className="md:col-span-2">
          <WorkCard project={first} featured />
        </Reveal>
        {rest.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 2) * 0.08} className="h-full">
            <WorkCard project={project} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16">
        <SectionTitle text="earlier" />
        <ul className="mt-6 grid gap-5 md:grid-cols-2">
          {archived.map((project) => (
            <li key={project.slug} className="h-full">
              <Spotlight className="flex h-full flex-col p-6">
                <p className="eyebrow">
                  {project.year} · {project.role}
                </p>
                <h2 className="mt-3 text-xl font-bold text-ink">
                  <Link
                    href={`/work/${project.slug}`}
                    className="transition-colors hover:text-accent"
                  >
                    {project.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-ink-2">{project.subtitle}</p>
                <p className="mt-4 font-mono text-[11px] text-ink-3">{project.stack.join(" · ")}</p>
                <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-5 text-sm">
                  <Link href={`/work/${project.slug}`} className="link">
                    view case study →
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
              </Spotlight>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
