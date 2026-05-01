import { Link } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'

interface CaseStudyShellProps {
  tag: string
  title: string
}

export function CaseStudyShell({ tag, title, children }: PropsWithChildren<CaseStudyShellProps>) {
  return (
    <article className="case-study-shell">
      <Link to="/" hash="work" className="case-study-back">
        <span aria-hidden="true">←</span>
        <span>back to work</span>
      </Link>

      <div className="case-study-meta">
        <span className="case-study-tag">{tag}</span>
      </div>

      <h1 className="case-study-title">{title}</h1>

      <div className="case-study-body">{children}</div>
    </article>
  )
}
