import { Link } from "@/components/ui/Link";
import { Reveal } from "@/components/ui/Reveal";
import { WorkRow } from "@/components/work/WorkRow";
import { getFeaturedProjects } from "@/lib/projects";

export function WorkSection() {
  const featured = getFeaturedProjects();

  return (
    <section id="work" className="wrap pt-16 md:pt-24">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Selected work</p>
          <h2 className="display-lg mt-4 max-w-[20ch]">
            Systems I have shipped, with the numbers that came out of them.
          </h2>
        </div>
        <Link href="/work" className="link text-sm">
          All work →
        </Link>
      </Reveal>

      <div className="mt-10">
        {featured.map((project) => (
          <WorkRow key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
