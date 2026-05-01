import type { Annotation as AnnotationData } from './lens-data'

export interface AnnotationRect {
  x: number
  y: number
  w: number
  h: number
}

interface AnnotationProps {
  annotation: AnnotationData
  rect: AnnotationRect | null
}

export function Annotation({ annotation, rect }: AnnotationProps) {
  if (!rect) return null

  const isGhost = annotation.kind === 'ghost'
  const className = isGhost ? 'annotation annotation--ghost' : 'annotation'

  return (
    <div
      className={className}
      data-annotation-id={annotation.id}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
      }}
    >
      <span className="annotation-glow" aria-hidden="true" />
      <span className="annotation-bracket annotation-bracket--tl" aria-hidden="true" />
      <span className="annotation-bracket annotation-bracket--br" aria-hidden="true" />
      <span className="annotation-label">
        {annotation.label}
        <span className="annotation-label-confidence">
          {' · '}
          {annotation.confidence.toFixed(2)}
        </span>
      </span>
    </div>
  )
}
