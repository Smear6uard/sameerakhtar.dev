import { useCallback, useEffect, useRef } from 'react'

export interface LensPositionApi {
  setPosition: (x: number, y: number) => void
  getPosition: () => { x: number; y: number }
}

const POINTER_FINE_QUERY = '(hover: hover) and (pointer: fine)'

export function useLensPosition(): LensPositionApi {
  const positionRef = useRef({ x: 0, y: 0 })
  const pendingRef = useRef<{ x: number; y: number } | null>(null)
  const rafRef = useRef<number | null>(null)

  const flush = useCallback(() => {
    rafRef.current = null
    const pending = pendingRef.current
    if (!pending) return
    pendingRef.current = null
    positionRef.current = pending
    const root = document.documentElement
    root.style.setProperty('--lens-x', `${String(pending.x)}px`)
    root.style.setProperty('--lens-y', `${String(pending.y)}px`)
  }, [])

  const schedule = useCallback(
    (x: number, y: number) => {
      pendingRef.current = { x, y }
      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(flush)
      }
    },
    [flush],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    schedule(window.innerWidth / 2, window.innerHeight / 2)

    if (!window.matchMedia(POINTER_FINE_QUERY).matches) return

    const onMouseMove = (event: MouseEvent) => {
      schedule(event.clientX, event.clientY)
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [schedule])

  const setPosition = useCallback(
    (x: number, y: number) => {
      schedule(x, y)
    },
    [schedule],
  )

  const getPosition = useCallback(() => positionRef.current, [])

  return { setPosition, getPosition }
}
