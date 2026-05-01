import { useCallback, useEffect, useRef, useState } from 'react'

import { Pagination } from './Pagination'
import { WorkHeader } from './WorkHeader'
import { WorkRail, type WorkRailHandle } from './WorkRail'
import { WORK_PROJECTS } from './work-data'

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(mq.matches)
    const listener = (e: MediaQueryListEvent) => {
      setReduced(e.matches)
    }
    mq.addEventListener('change', listener)
    return () => {
      mq.removeEventListener('change', listener)
    }
  }, [])
  return reduced
}

export function Work() {
  const railRef = useRef<WorkRailHandle | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const reducedMotion = usePrefersReducedMotion()

  const onScroll = useCallback((info: { index: number; progress: number }) => {
    setActiveIndex(info.index)
    setProgress(info.progress)
  }, [])

  const handlePrev = useCallback(() => {
    railRef.current?.scrollByDirection(-1)
  }, [])
  const handleNext = useCallback(() => {
    railRef.current?.scrollByDirection(1)
  }, [])
  const handleJump = useCallback((index: number) => {
    railRef.current?.scrollToIndex(index)
  }, [])

  return (
    <section id="work" className="work-section" aria-label="Selected work">
      <div className="work-section-inner">
        <WorkHeader
          onPrev={handlePrev}
          onNext={handleNext}
          canPrev={activeIndex > 0}
          canNext={activeIndex < WORK_PROJECTS.length - 1}
        />

        <WorkRail
          ref={railRef}
          projects={WORK_PROJECTS}
          reducedMotion={reducedMotion}
          onScroll={onScroll}
        />

        <Pagination
          projects={WORK_PROJECTS}
          activeIndex={activeIndex}
          progress={progress}
          onJump={handleJump}
        />
      </div>
    </section>
  )
}
