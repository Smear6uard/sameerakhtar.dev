import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/fx/SectionTitle";
import { Magnetic } from "@/components/fx/Magnetic";
import { useToast } from "@/components/ui/Toast";
import { site } from "@/lib/site";

export function ContactSection() {
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
    <section id="contact" className="wrap relative z-10 pt-24 pb-8 md:pt-32">
      <Reveal className="max-w-2xl">
        <SectionTitle text="contact" />
        <h2 className="display-lg mt-4">Let&apos;s talk.</h2>
        <p className="lede mt-5">
          I graduate in {site.graduation} and I&apos;m looking for new-grad software engineering
          roles, remote or in Chicago. Product engineering, infrastructure, AI features: if
          you&apos;re hiring for any of them, get in touch.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Magnetic>
            <a href={`mailto:${site.email}`} className="btn btn-primary">
              Send me an email <span aria-hidden="true">→</span>
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              View my resume <span aria-hidden="true">↗</span>
            </a>
          </Magnetic>
        </div>

        <p className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm text-ink-3">
          <a href={`mailto:${site.email}`} className="link">
            {site.email}
          </a>
          <button type="button" onClick={copyEmail} className="link-quiet text-xs">
            [copy]
          </button>
        </p>

        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="link-quiet">
            github
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="link-quiet">
            linkedin
          </a>
          <a
            href={site.newsletter}
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet"
          >
            newsletter
          </a>
          <span className="text-ink-3">{site.location}</span>
        </p>
      </Reveal>
    </section>
  );
}
