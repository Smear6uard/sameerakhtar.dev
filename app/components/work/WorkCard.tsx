import { Link } from '@tanstack/react-router'

import { Pipeline } from './Pipeline'
import { PIPELINES } from './pipelines'
import type { WorkLink, WorkProject } from './work-data'

interface WorkCardProps {
  project: WorkProject
  reducedMotion: boolean
  position: number
}

function LinkLabel({ link }: { link: WorkLink }) {
  return (
    <span className="work-link-inner">
      <span className="work-link-text">{link.label}</span>
      <span className="work-link-arrow" aria-hidden="true">
        →
      </span>
    </span>
  )
}

function WorkLinkAnchor({ link }: { link: WorkLink }) {
  if (link.toCaseStudy) {
    return (
      <Link to={link.href} className="work-link">
        <LinkLabel link={link} />
      </Link>
    )
  }
  if (link.external) {
    return (
      <a className="work-link" href={link.href} target="_blank" rel="noreferrer noopener">
        <LinkLabel link={link} />
      </a>
    )
  }
  return (
    <a className="work-link" href={link.href}>
      <LinkLabel link={link} />
    </a>
  )
}

export function WorkCard({ project, reducedMotion, position }: WorkCardProps) {
  const pipeline = PIPELINES[project.pipelineId]

  return (
    <article
      className="work-card"
      data-card-position={position}
      aria-labelledby={`work-${project.id}-title`}
    >
      <header className="work-card-header">
        <span className="work-card-tag">{project.tag}</span>
        <span className="work-card-index" aria-hidden="true">
          {project.index}
        </span>
      </header>

      <div className="work-card-pipeline">
        {pipeline ? <Pipeline pipeline={pipeline} reducedMotion={reducedMotion} /> : null}
      </div>

      <div className="work-card-metric">
        <span className="work-card-metric-pill">{project.metric}</span>
      </div>

      <h3 id={`work-${project.id}-title`} className="work-card-title">
        {project.title}
      </h3>

      <p className="work-card-description">{project.description}</p>

      <footer className="work-card-footer">
        <ul className="work-card-stack">
          {project.stack.map((tag, i) => (
            <li key={tag}>
              {i > 0 ? <span aria-hidden="true">{' · '}</span> : null}
              {tag}
            </li>
          ))}
        </ul>
        <div className="work-card-links">
          {project.links.map((link) => (
            <WorkLinkAnchor key={link.label} link={link} />
          ))}
        </div>
      </footer>
    </article>
  )
}
