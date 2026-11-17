import {
  Cover,
  Figures,
  SceneNote,
  Stop,
  TextLink,
  Ticket,
  TicketRule,
} from "@/components/ride/Stop";
import { getProject } from "@/lib/projects";
import { experience } from "@/lib/resume";

/** Stop 1: the internship, under a tower cycling brand palettes. */
export function QuantumMetricStop() {
  const role = experience[0];
  const project = getProject("brand-discovery");
  if (!project) return null;

  return (
    <Stop id="work" side="left">
      <p className="stop-meta">
        {role.title}, {role.period}
      </p>
      <Cover>Quantum Metric</Cover>
      <Ticket>
        <h3 className="ticket-title">{project.title}</h3>
        <p className="mt-2">
          A GenAI feature that derives survey branding from a client&apos;s PDFs and website. I
          owned it from pre-GA design to production launch. Per-client branding setup went from
          about 2 hours of manual work to under 5 minutes.
        </p>
        <Figures items={project.highlights} />
        <TicketRule />
        <ul className="dash-list text-[0.9375rem]">
          <li>
            Go and Gemini 2.5 Flash on Vertex AI, with schema-constrained output and
            prompt-injection defenses. Colors are grounded in measured palettes and checked against
            WCAG contrast.
          </li>
          <li>
            A Cloud Run and Playwright service for untrusted URLs, SSRF-hardened by DNS pinning and
            redirect revalidation, with the Terraform for its network.
          </li>
        </ul>
        <div className="ticket-links">
          <TextLink href={`/work/${project.slug}`}>Read the case study</TextLink>
        </div>
      </Ticket>
      <SceneNote>
        The tower is cycling brand palettes, which is what the feature extracts.
      </SceneNote>
    </Stop>
  );
}
