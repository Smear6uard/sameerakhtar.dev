import { type LensMode, MODE_DESCRIPTIONS, MODE_HUD_LABELS } from './lens-data'

interface LensProps {
  mode: LensMode
  detection: { label: string; confidence: number } | null
  onCycle: () => void
}

export function Lens({ mode, detection, onCycle }: LensProps) {
  return (
    <div className="lens" data-mode={mode} aria-hidden="true">
      <div className="lens-hud">
        <HudReadout mode={mode} detection={detection} />
      </div>

      <div className="lens-backdrop" />
      <div className="lens-heat-bloom" />
      <div className="lens-ring" />

      <span className="lens-tick lens-tick--top" />
      <span className="lens-tick lens-tick--bottom" />
      <span className="lens-tick lens-tick--left" />
      <span className="lens-tick lens-tick--right" />

      <div className="lens-crosshair">
        <span className="lens-crosshair-dot" />
      </div>

      <span className="lens-mode-tag">{MODE_HUD_LABELS[mode]}</span>

      <div className="lens-hit" onClick={onCycle} role="presentation" />
    </div>
  )
}

function HudReadout({
  mode,
  detection,
}: {
  mode: LensMode
  detection: { label: string; confidence: number } | null
}) {
  const modeLabel = MODE_HUD_LABELS[mode]

  if (mode === 'detect') {
    if (!detection) {
      return (
        <>
          {modeLabel}
          {' · '}
          <span className="lens-hud-confidence">SCANNING</span>
        </>
      )
    }
    return (
      <>
        {modeLabel}
        {' · '}
        {detection.label}
        <span className="lens-hud-confidence">
          {' · '}
          {detection.confidence.toFixed(2)}
        </span>
      </>
    )
  }

  if (mode === 'edges') {
    return (
      <>
        <span className="lens-hud-dot" aria-hidden="true" />
        {modeLabel}
        {' · '}
        {MODE_DESCRIPTIONS.edges}
      </>
    )
  }

  return (
    <>
      {modeLabel}
      {' · '}
      {MODE_DESCRIPTIONS.heat}
    </>
  )
}
