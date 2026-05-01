import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'

import { WorkCard } from './WorkCard'
import type { WorkProject } from './work-data'

export interface WorkRailHandle {
  scrollToIndex: (index: number) => void
  scrollByDirection: (dir: 1 | -1) => void
  getElement: () => HTMLDivElement | null
}

interface WorkRailProps {
  projects: readonly WorkProject[]
  reducedMotion: boolean
  onScroll: (info: { index: number; progress: number }) => void
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function getCardSpan(rail: HTMLDivElement): number {
  const first = rail.querySelector<HTMLElement>('[data-card-position]')
  const second = rail.querySelector<HTMLElement>('[data-card-position="1"]')
  if (first && second) {
    return Math.max(1, Math.round(second.offsetLeft - first.offsetLeft))
  }
  if (first) {
    return Math.max(1, first.offsetWidth)
  }
  return rail.clientWidth
}

export const WorkRail = forwardRef<WorkRailHandle, WorkRailProps>(function WorkRail(
  { projects, reducedMotion, onScroll },
  ref,
) {
  const railRef = useRef<HTMLDivElement | null>(null)
  const onScrollRef = useRef(onScroll)

  useEffect(() => {
    onScrollRef.current = onScroll
  }, [onScroll])

  useImperativeHandle(
    ref,
    () => ({
      scrollToIndex(index: number) {
        const rail = railRef.current
        if (!rail) return
        const target = rail.querySelector<HTMLElement>(`[data-card-position="${String(index)}"]`)
        if (!target) return
        rail.scrollTo({ left: target.offsetLeft, behavior: 'smooth' })
      },
      scrollByDirection(dir: 1 | -1) {
        const rail = railRef.current
        if (!rail) return
        const span = getCardSpan(rail)
        rail.scrollBy({ left: span * dir, behavior: 'smooth' })
      },
      getElement() {
        return railRef.current
      },
    }),
    [],
  )

  // Scroll progress + active index reporting.
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    let raf: number | null = null

    const report = () => {
      raf = null
      const span = getCardSpan(rail)
      const max = Math.max(1, rail.scrollWidth - rail.clientWidth)
      const progress = clamp(rail.scrollLeft / max, 0, 1)
      const index = clamp(Math.round(rail.scrollLeft / span), 0, projects.length - 1)
      onScrollRef.current({ index, progress })
    }

    const schedule = () => {
      if (raf !== null) return
      raf = window.requestAnimationFrame(report)
    }

    schedule()
    rail.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })

    return () => {
      rail.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf !== null) window.cancelAnimationFrame(raf)
    }
  }, [projects.length])

  // Click-and-drag to scroll on desktop, with snap restoring on release.
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    if (typeof window === 'undefined') return
    const fineQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!fineQuery.matches) return

    let pointerId: number | null = null
    let startX = 0
    let startScroll = 0
    let dragged = false
    const DRAG_THRESHOLD = 4

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      const target = e.target as HTMLElement | null
      // Don't intercept clicks on links/buttons inside cards.
      if (target?.closest('a, button')) return
      pointerId = e.pointerId
      startX = e.clientX
      startScroll = rail.scrollLeft
      dragged = false
      rail.classList.add('work-rail--grabbing')
    }

    const onPointerMove = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return
      const dx = e.clientX - startX
      if (!dragged && Math.abs(dx) > DRAG_THRESHOLD) {
        dragged = true
        rail.setPointerCapture(e.pointerId)
        rail.classList.add('work-rail--dragging')
      }
      if (dragged) {
        rail.scrollLeft = startScroll - dx
        e.preventDefault()
      }
    }

    const release = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return
      pointerId = null
      rail.classList.remove('work-rail--grabbing')
      if (dragged) {
        rail.classList.remove('work-rail--dragging')
        try {
          rail.releasePointerCapture(e.pointerId)
        } catch {
          // ignore
        }
      }
      dragged = false
    }

    rail.addEventListener('pointerdown', onPointerDown)
    rail.addEventListener('pointermove', onPointerMove)
    rail.addEventListener('pointerup', release)
    rail.addEventListener('pointercancel', release)

    return () => {
      rail.removeEventListener('pointerdown', onPointerDown)
      rail.removeEventListener('pointermove', onPointerMove)
      rail.removeEventListener('pointerup', release)
      rail.removeEventListener('pointercancel', release)
    }
  }, [])

  // Keyboard nav.
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const rail = railRef.current
    if (!rail) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      rail.scrollBy({ left: getCardSpan(rail), behavior: 'smooth' })
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      rail.scrollBy({ left: -getCardSpan(rail), behavior: 'smooth' })
    }
  }, [])

  return (
    <div
      ref={railRef}
      className={reducedMotion ? 'work-rail work-rail--reduced' : 'work-rail'}
      tabIndex={0}
      role="region"
      aria-label="Selected work projects"
      onKeyDown={onKeyDown}
    >
      <div className="work-rail-track">
        {projects.map((project, i) => (
          <div className="work-rail-slot" data-card-position={String(i)} key={project.id}>
            <WorkCard project={project} reducedMotion={reducedMotion} position={i} />
          </div>
        ))}
        <div className="work-rail-tail" aria-hidden="true" />
      </div>
    </div>
  )
})
