import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/fx/SectionTitle";
import { experience } from "@/lib/resume";

export function ExperienceSection() {
  return (
    <section id="experience" className="wrap relative z-10 pt-20 md:pt-28">
      <Reveal>
        <SectionTitle text="experience" />
      </Reveal>

      <ol className="timeline mt-10 ml-1 space-y-12">
        {experience.map((role) => (
          <Reveal as="li" key={role.company} className="relative pl-8 md:pl-10">
            <span className="timeline-dot" aria-hidden="true" />
            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
              <h3 className="text-xl font-bold text-ink md:text-2xl">
                {role.href ? (
                  <a
                    href={role.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-accent"
                  >
                    {role.company} <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  role.company
                )}
              </h3>
              <p className="font-mono text-sm text-ink-3">
                {role.period} · {role.location}
              </p>
            </div>
            <p className="mt-1 font-medium text-accent">{role.title}</p>
            <ul className="dash-list mt-4 max-w-[72ch]">
              {role.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-xs text-ink-3">{role.tech}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
