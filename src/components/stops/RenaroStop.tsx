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
import { links } from "@/lib/site";

/** Stop 2: Renaro, seen from above as a live dispatch map. */
export function RenaroStop() {
  const role = experience[1];
  const project = getProject("renaro");
  if (!project) return null;

  return (
    <Stop id="renaro" side="right">
      <p className="stop-meta">
        {role.title}, {role.period}
      </p>
      <Cover>Renaro</Cover>
      <Ticket>
        <p>
          Multi-tenant dispatch software for taxi and limo fleets: dispatch, payments, driver
          operations, messaging and analytics. Built and shipped solo, with $3K+ in pre-launch
          revenue.
        </p>
        <Figures items={project.highlights} />
        <TicketRule />
        <ul className="dash-list text-[0.9375rem]">
          <li>
            Hardened WebSockets against a 10K-client reconnect storm, and replaced per-tenant
            polling with a SKIP LOCKED batch claim.
          </li>
          <li>
            Stripe Connect payments on idempotent, webhook-deduplicated, compare-and-swap money
            paths.
          </li>
          <li>
            Forced PostgreSQL row-level security on every tenant table, enforced by CI schema gates
            and an adversarial test suite.
          </li>
        </ul>
        <div className="ticket-links">
          <TextLink href={`/work/${project.slug}`}>Read the case study</TextLink>
          <TextLink href={links.renaro}>renaroapp.com</TextLink>
        </div>
      </Ticket>
      <SceneNote>
        The idea came from nearly two years integrating a dispatch system at American Coach
        Limousine.
      </SceneNote>
    </Stop>
  );
}
