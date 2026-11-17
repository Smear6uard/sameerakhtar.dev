import { Cover, Stop, TextLink, Ticket } from "@/components/ride/Stop";
import { Link } from "@/components/ui/Link";
import { getProject } from "@/lib/projects";

const SLUGS = ["hazardlens", "windwalk", "llm-router", "deepcite"];

/** Stop 4: four more projects, listed on a theatre marquee. */
export function MoreWorkStop() {
  const projects = SLUGS.map(getProject).filter((p) => p !== undefined);

  return (
    <Stop id="more-work" side="right">
      <Cover>More work</Cover>
      <Ticket>
        <ul className="bill">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link href={`/work/${project.slug}`} className="bill-row">
                <span className="bill-title">{project.title}</span>
                <span className="bill-figure">
                  {project.highlights[0].value} {project.highlights[0].label}
                </span>
                <span className="bill-sub">{project.subtitle}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="ticket-links">
          <TextLink href="/work">See all work</TextLink>
        </div>
      </Ticket>
    </Stop>
  );
}
