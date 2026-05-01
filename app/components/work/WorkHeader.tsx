interface WorkHeaderProps {
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
}

export function WorkHeader({ onPrev, onNext, canPrev, canNext }: WorkHeaderProps) {
  return (
    <header className="work-header">
      <div className="work-header-left">
        <span className="work-header-bar" aria-hidden="true" />
        <span className="work-header-label">Selected Work</span>
      </div>

      <div className="work-header-right">
        <span className="work-header-hint" aria-hidden="true">
          Drag or scroll →
        </span>
        <div className="work-nav-buttons">
          <button
            type="button"
            className="work-nav-button"
            onClick={onPrev}
            disabled={!canPrev}
            aria-label="Scroll to previous project"
          >
            <svg viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M9 2.5 L4 7 L9 11.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="work-nav-button"
            onClick={onNext}
            disabled={!canNext}
            aria-label="Scroll to next project"
          >
            <svg viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M5 2.5 L10 7 L5 11.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
