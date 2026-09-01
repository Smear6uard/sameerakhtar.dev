import { Reveal } from "@/components/ui/Reveal";
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
    <section id="contact" className="wrap pt-20 md:pt-28">
      <Reveal>
        <p className="eyebrow">Contact</p>
        <h2 className="display-xl mt-5 max-w-[14ch]">Let&apos;s talk about 2027.</h2>
        <p className="lede mt-6 max-w-[56ch]">
          I graduate in {site.graduation} and I&apos;m looking for new-grad software engineering
          roles, remote or in Chicago. If you&apos;re hiring for product engineering,
          infrastructure, or AI features, my inbox is open.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-3">
          <a href={`mailto:${site.email}`} className="display-md link">
            {site.email}
          </a>
          <button type="button" onClick={copyEmail} className="btn btn-ghost btn-sm">
            Copy
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Resume
            <span aria-hidden="true">↗</span>
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            LinkedIn
          </a>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            GitHub
          </a>
        </div>
      </Reveal>
    </section>
  );
}
