import { Magnetic } from "@/components/fx/Magnetic";
import { Cover, Stop, Ticket } from "@/components/ride/Stop";
import { useToast } from "@/components/ui/Toast";
import { site } from "@/lib/site";

/** Stop 6: the end of the pier. Contact. */
export function DropoffStop() {
  const { showToast } = useToast();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      showToast("Email copied");
    } catch {
      showToast(site.email);
    }
  };

  return (
    <Stop id="contact" side="left" last>
      <Cover>Contact</Cover>
      <Ticket>
        <p className="lede">
          I graduate in {site.graduation} and I&apos;m looking for new-grad software engineering
          roles, remote or in Chicago. If you&apos;re hiring for product engineering, infrastructure
          or AI features, email me.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Magnetic>
            <a href={`mailto:${site.email}`} className="btn btn-primary">
              Email me
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Résumé
            </a>
          </Magnetic>
        </div>
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm">
          <a href={`mailto:${site.email}`} className="link">
            {site.email}
          </a>
          <button type="button" onClick={copyEmail} className="link-quiet text-xs">
            Copy
          </button>
        </p>
        <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="link-quiet">
            GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="link-quiet">
            LinkedIn
          </a>
          <a
            href={site.newsletter}
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet"
          >
            Newsletter
          </a>
        </p>
      </Ticket>
    </Stop>
  );
}
