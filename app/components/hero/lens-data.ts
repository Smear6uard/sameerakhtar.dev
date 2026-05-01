export type LensMode = 'detect' | 'edges' | 'heat'

export const LENS_MODES: readonly LensMode[] = ['detect', 'edges', 'heat'] as const

export type AnnotationKind = 'real' | 'ghost'

export interface RealAnnotation {
  id: string
  kind: 'real'
  targetId: string
  label: string
  confidence: number
  padding?: number
}

export interface GhostAnnotation {
  id: string
  kind: 'ghost'
  label: string
  confidence: number
  position: { xPct: number; yPct: number }
}

export type Annotation = RealAnnotation | GhostAnnotation

export interface TourPoint {
  annotationId: string
  holdMs: number
}

export const ANNOTATIONS: readonly Annotation[] = [
  { id: 'sameer', kind: 'real', targetId: 'sameer', label: 'PERSON', confidence: 0.97 },
  { id: 'akhtar', kind: 'real', targetId: 'akhtar', label: 'PERSON', confidence: 0.97 },
  {
    id: 'period',
    kind: 'real',
    targetId: 'period',
    label: 'ARTIFACT',
    confidence: 0.99,
    padding: 6,
  },
  {
    id: 'computer-vision',
    kind: 'real',
    targetId: 'computer-vision',
    label: 'KEYWORD',
    confidence: 0.99,
  },
  {
    id: 'research-labs',
    kind: 'real',
    targetId: 'research-labs',
    label: 'DOMAIN',
    confidence: 0.84,
  },
  { id: 'app-store', kind: 'real', targetId: 'app-store', label: 'PLATFORM', confidence: 0.91 },
  {
    id: 'institution',
    kind: 'real',
    targetId: 'institution',
    label: 'INSTITUTION',
    confidence: 0.88,
  },
  { id: 'mentor', kind: 'real', targetId: 'mentor', label: 'PERSON_REF', confidence: 0.86 },
  { id: 'org', kind: 'real', targetId: 'org', label: 'ORG', confidence: 0.82 },
  { id: 'availability', kind: 'real', targetId: 'availability', label: 'STATUS', confidence: 0.99 },
  {
    id: 'ghost-bg',
    kind: 'ghost',
    label: 'BG_NOISE',
    confidence: 0.04,
    position: { xPct: 0.18, yPct: 0.74 },
  },
  {
    id: 'ghost-texture',
    kind: 'ghost',
    label: 'TEXTURE',
    confidence: 0.11,
    position: { xPct: 0.82, yPct: 0.36 },
  },
  {
    id: 'ghost-edge',
    kind: 'ghost',
    label: 'EDGE',
    confidence: 0.08,
    position: { xPct: 0.74, yPct: 0.84 },
  },
] as const

export const TOUR_POINTS: readonly TourPoint[] = [
  { annotationId: 'sameer', holdMs: 1100 },
  { annotationId: 'computer-vision', holdMs: 1100 },
  { annotationId: 'period', holdMs: 900 },
  { annotationId: 'mentor', holdMs: 1000 },
  { annotationId: 'app-store', holdMs: 1000 },
  { annotationId: 'availability', holdMs: 1100 },
] as const

export const ENTRANCE_GHOST_LABELS: readonly string[] = [
  'NOISE',
  'EDGE',
  'TEXTURE',
  'BG_HUE',
  'BLOB',
  'GRAD',
  'PIX',
  'DRIFT',
  'SAMPLE',
  'WEAK_SIG',
  'CLUSTER',
  'BAND',
] as const

export const REAL_ANNOTATIONS = ANNOTATIONS.filter((a): a is RealAnnotation => a.kind === 'real')

export const GHOST_ANNOTATIONS = ANNOTATIONS.filter((a): a is GhostAnnotation => a.kind === 'ghost')

export const TOTAL_TARGETS = REAL_ANNOTATIONS.length

export const LENS_RADIUS = 150

export const ENTRANCE_DELAY_MS = 900
export const ENTRANCE_BURST_MS = 1400
export const ENTRANCE_CONTRACT_MS = 700
export const AUTO_TOUR_IDLE_MS = 6000
export const TOUR_TRANSITION_MS = 900

export const MODE_HUD_LABELS: Record<LensMode, string> = {
  detect: 'DET',
  edges: 'EDGE',
  heat: 'HEAT',
}

export const MODE_DESCRIPTIONS: Record<LensMode, string> = {
  detect: 'BOUNDING BOXES',
  edges: 'ANALYZING',
  heat: 'ATTENTION MAP',
}

export const SESSION_KEYS = {
  mode: 'lens-mode',
  scanned: 'lens-scanned',
  entrancePlayed: 'lens-entrance-played',
} as const
