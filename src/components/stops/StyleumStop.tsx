import { Cover, Figures, SceneNote, Stop, TextLink, Ticket } from "@/components/ride/Stop";
import { getProject } from "@/lib/projects";
import { links } from "@/lib/site";

/** Stop 3: Styleum, outside a lit boutique window. */
export function StyleumStop() {
  const project = getProject("styleum");
  if (!project) return null;

  return (
    <Stop id="styleum" side="left">
      <p className="stop-meta">
        {project.role}, {project.timeline}
      </p>
      <Cover>Styleum</Cover>
      <Ticket>
        <p>{project.summary}</p>
        <Figures items={project.highlights} />
        <div className="ticket-links">
          <TextLink href={`/work/${project.slug}`}>Read the case study</TextLink>
          <TextLink href={links.styleumAppStore}>App Store</TextLink>
        </div>
      </Ticket>
      <SceneNote>The mannequins change outfits, the way the app does each morning.</SceneNote>
    </Stop>
  );
}
