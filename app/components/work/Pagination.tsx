import type { WorkProject } from './work-data'

interface PaginationProps {
  projects: readonly WorkProject[]
  activeIndex: number
  progress: number
  onJump: (index: number) => void
}

export function Pagination({ projects, activeIndex, progress, onJump }: PaginationProps) {
  return (
    <div className="work-pagination">
      <ul className="work-pagination-dots" aria-label="Project navigation">
        {projects.map((project, i) => {
          const active = i === activeIndex
          return (
            <li key={project.id}>
              <button
                type="button"
                onClick={() => {
                  onJump(i)
                }}
                className={
                  active ? 'work-pagination-dot work-pagination-dot--active' : 'work-pagination-dot'
                }
                aria-label={`Jump to project ${String(i + 1)}: ${project.title}`}
                aria-current={active ? 'true' : undefined}
              />
            </li>
          )
        })}
      </ul>

      <div className="work-pagination-progress" role="presentation">
        <div className="work-pagination-progress-track" />
        <div
          className="work-pagination-progress-fill"
          style={{ transform: `scaleX(${String(progress)})` }}
        />
      </div>

      <div className="work-pagination-counter" aria-hidden="true">
        <span className="work-pagination-counter-current">
          {String(activeIndex + 1).padStart(2, '0')}
        </span>
        <span className="work-pagination-counter-sep">/</span>
        <span className="work-pagination-counter-total">
          {String(projects.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
