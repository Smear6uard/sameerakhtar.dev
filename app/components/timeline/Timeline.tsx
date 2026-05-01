import { TIMELINE_GROUPS } from './timeline-data'

export function Timeline() {
  return (
    <section id="timeline" className="section" aria-label="Experience">
      <div className="section-inner">
        <header className="section-eyebrow">
          <span className="section-eyebrow-bar" aria-hidden="true" />
          <span className="section-eyebrow-label">Experience</span>
        </header>

        <div className="timeline">
          {TIMELINE_GROUPS.map((group) => (
            <div key={group.year}>
              <div className="timeline-year">
                <span className="timeline-year-label">{group.year}</span>
                <span className="timeline-year-rule" aria-hidden="true" />
              </div>

              {group.entries.map((entry) => (
                <article key={entry.id} className="timeline-entry">
                  <span className="timeline-entry-dot" aria-hidden="true" />

                  <div className="timeline-entry-head">
                    <h3 className="timeline-entry-company">{entry.company}</h3>
                    <span className="timeline-entry-dates">{entry.dates}</span>
                  </div>

                  <h4 className="timeline-entry-role">{entry.role}</h4>

                  <p className="timeline-entry-description">{entry.description}</p>

                  <div className="timeline-entry-stack">
                    {entry.stack.map((tech, i) => (
                      <span key={tech}>
                        {tech}
                        {i < entry.stack.length - 1 && (
                          <span className="timeline-entry-stack-sep" aria-hidden="true">
                            ·
                          </span>
                        )}
                      </span>
                    ))}
                    <span className="timeline-entry-stack-end" aria-hidden="true" />
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
