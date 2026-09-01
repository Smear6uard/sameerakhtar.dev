import { Reveal } from "@/components/ui/Reveal";
import { experience } from "@/lib/resume";

export function ExperienceSection() {
  return (
    <section id="experience" className="wrap pt-20 md:pt-28">
      <Reveal>
        <p className="eyebrow">Experience</p>
        <h2 className="display-lg mt-4 max-w-[18ch]">Where the numbers above come from.</h2>
      </Reveal>

      <ol className="mt-10">
        {experience.map((role) => (
          <Reveal
            as="li"
            key={role.company}
            className="hairline grid gap-4 py-10 md:grid-cols-12 md:gap-10"
          >
            <div className="md:col-span-3">
              <p className="font-mono text-xs tracking-[0.08em] text-ink-2 uppercase">
                {role.period}
              </p>
              <p className="mt-1 font-mono text-xs tracking-[0.08em] text-ink-3 uppercase">
                {role.location}
              </p>
            </div>
            <div className="md:col-span-9">
              <h3 className="display-md">
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
              <p className="mt-1 text-ink-2">{role.title}</p>
              <ul className="dash-list mt-5 max-w-[70ch]">
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
