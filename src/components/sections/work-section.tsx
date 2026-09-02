import { Link } from "@/components/ui/Link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/fx/SectionTitle";
import { WorkCard } from "@/components/work/WorkCard";
import { getFeaturedProjects } from "@/lib/projects";

export function WorkSection() {
  const [first, ...rest] = getFeaturedProjects();

  return (
    <section id="work" className="wrap relative z-10 pt-20 md:pt-28">
      <Reveal className="flex items-end justify-between gap-4">
        <div>
          <SectionTitle text="selected work" />
          <p className="mt-4 max-w-[48ch] text-ink-2">
            Five projects with real users, real load, or a real prize.
          </p>
        </div>
        <Link href="/work" className="link text-sm">
          all work →
        </Link>
      </Reveal>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Reveal className="md:col-span-2">
          <WorkCard project={first} featured />
        </Reveal>
        {rest.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 2) * 0.08} className="h-full">
            <WorkCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
