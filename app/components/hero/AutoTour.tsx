import { useEffect, useRef } from 'react'

import { easeInOutCubic, tween, type TweenHandle } from '@/lib/tween'

import type { AnnotationRect } from './Annotation'
import { AUTO_TOUR_IDLE_MS, TOUR_POINTS, TOUR_TRANSITION_MS } from './lens-data'

type RectMap = Record<string, AnnotationRect | null>

interface AutoTourProps {
  enabled: boolean
  rects: RectMap
  setLensPosition: (x: number, y: number) => void
  getLensPosition: () => { x: number; y: number }
}

const POINTER_FINE_QUERY = '(hover: hover) and (pointer: fine)'

export function AutoTour({ enabled, rects, setLensPosition, getLensPosition }: AutoTourProps) {
  const rectsRef = useRef<RectMap>({})

  useEffect(() => {
    rectsRef.current = rects
  }, [rects])

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const isPointerFine = window.matchMedia(POINTER_FINE_QUERY).matches

    interface LoopState {
      cancelled: boolean
      touring: boolean
      stepIndex: number
      activeTween: TweenHandle | null
      activeTimer: ReturnType<typeof setTimeout> | null
      idleTimer: ReturnType<typeof setTimeout> | null
    }

    const state: LoopState = {
      cancelled: false,
      touring: false,
      stepIndex: 0,
      activeTween: null,
      activeTimer: null,
      idleTimer: null,
    }

    const isAborted = (): boolean => state.cancelled || !state.touring

    const cancelActive = () => {
      state.activeTween?.cancel()
      state.activeTween = null
      if (state.activeTimer !== null) {
        clearTimeout(state.activeTimer)
        state.activeTimer = null
      }
    }

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        state.activeTimer = setTimeout(() => {
          state.activeTimer = null
          resolve()
        }, ms)
      })

    const runStep = async (): Promise<void> => {
      if (isAborted()) return

      const point = TOUR_POINTS[state.stepIndex % TOUR_POINTS.length]
      if (!point) return

      const rect = rectsRef.current[point.annotationId]
      if (!rect) {
        state.stepIndex += 1
        await wait(120)
        if (isAborted()) return
        return runStep()
      }

      const targetX = rect.x + rect.w / 2
      const targetY = rect.y + rect.h / 2
      const fromPos = getLensPosition()
      const fromX = fromPos.x
      const fromY = fromPos.y

      state.activeTween = tween(0, 1, TOUR_TRANSITION_MS, easeInOutCubic, (t) => {
        setLensPosition(fromX + (targetX - fromX) * t, fromY + (targetY - fromY) * t)
      })
      await state.activeTween.finished
      state.activeTween = null
      if (isAborted()) return

      await wait(point.holdMs)
      if (isAborted()) return

      state.stepIndex += 1
      return runStep()
    }

    const startTour = () => {
      if (state.touring) return
      state.touring = true
      void runStep()
    }

    const stopTour = () => {
      state.touring = false
      cancelActive()
    }

    const scheduleIdleStart = (delay: number) => {
      if (state.idleTimer !== null) clearTimeout(state.idleTimer)
      state.idleTimer = setTimeout(() => {
        state.idleTimer = null
        startTour()
      }, delay)
    }

    const onMouseMove = () => {
      if (state.touring) {
        stopTour()
      }
      scheduleIdleStart(AUTO_TOUR_IDLE_MS)
    }

    if (isPointerFine) {
      scheduleIdleStart(AUTO_TOUR_IDLE_MS)
      window.addEventListener('mousemove', onMouseMove, { passive: true })
    } else {
      state.stepIndex = 0
      startTour()
    }

    return () => {
      state.cancelled = true
      stopTour()
      if (state.idleTimer !== null) clearTimeout(state.idleTimer)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [enabled, getLensPosition, setLensPosition])

  return null
}
