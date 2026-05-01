import { Annotation, type AnnotationRect } from './Annotation'
import { ANNOTATIONS } from './lens-data'

type RectMap = Record<string, AnnotationRect | null>

interface DetectionLayerProps {
  rects: RectMap
}

export function DetectionLayer({ rects }: DetectionLayerProps) {
  return (
    <div className="detection-layer" aria-hidden="true">
      {ANNOTATIONS.map((annotation) => (
        <Annotation
          key={annotation.id}
          annotation={annotation}
          rect={rects[annotation.id] ?? null}
        />
      ))}
    </div>
  )
}
