import { useCallback, useEffect, useState } from 'react'

import { LENS_MODES, type LensMode, SESSION_KEYS } from '@/components/hero/lens-data'

const KEY_TO_MODE: Record<string, LensMode> = {
  d: 'detect',
  e: 'edges',
  h: 'heat',
}

function isLensMode(value: string | null): value is LensMode {
  return value === 'detect' || value === 'edges' || value === 'heat'
}

export interface LensModeApi {
  mode: LensMode
  setMode: (next: LensMode) => void
  cycleMode: () => void
}

export function useLensMode(): LensModeApi {
  const [mode, setModeState] = useState<LensMode>('detect')

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = window.sessionStorage.getItem(SESSION_KEYS.mode)
      if (isLensMode(stored)) {
        // Hydrating from sessionStorage; this is the canonical pattern.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setModeState(stored)
      }
    } catch {
      // sessionStorage unavailable; use default
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.sessionStorage.setItem(SESSION_KEYS.mode, mode)
    } catch {
      // ignore
    }
  }, [mode])

  const setMode = useCallback((next: LensMode) => {
    setModeState(next)
  }, [])

  const cycleMode = useCallback(() => {
    setModeState((current) => {
      const idx = LENS_MODES.indexOf(current)
      const next = LENS_MODES[(idx + 1) % LENS_MODES.length]
      return next ?? 'detect'
    })
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const next = KEY_TO_MODE[event.key.toLowerCase()]
      if (next) {
        event.preventDefault()
        setModeState(next)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return { mode, setMode, cycleMode }
}
