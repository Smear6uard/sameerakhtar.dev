import type { CSSProperties, RefObject } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useLensMode } from '@/hooks/useLensMode'
import { useLensPosition } from '@/hooks/useLensPosition'

import type { AnnotationRect } from './Annotation'
import { AutoTour } from './AutoTour'
import { DetectionCounter } from './DetectionCounter'
import { DetectionLayer } from './DetectionLayer'
import { EntranceScan } from './EntranceScan'
import { Lens } from './Lens'
import { ANNOTATIONS, REAL_ANNOTATIONS, TOTAL_TARGETS, SESSION_KEYS } from './lens-data'

type RectMap = Record<string, AnnotationRect | null>

const GHOST_WIDTH = 92
const GHOST_HEIGHT = 38

function fadeStyle(delayMs: number): CSSProperties {
  return { '--fade-delay': `${String(delayMs)}ms` } as CSSProperties
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    // Hydrate from external media-query state on mount.
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

function useDetectionRects(): RectMap {
  const [rects, setRects] = useState<RectMap>({})

  useEffect(() => {
    if (typeof window === 'undefined') return

    const state = { cancelled: false, raf: null as number | null }

    const compute = () => {
      state.raf = null
      if (state.cancelled) return
      const next: RectMap = {}
      for (const annotation of ANNOTATIONS) {
        if (annotation.kind === 'real') {
          const el = document.querySelector<HTMLElement>(
            `[data-annotation="${annotation.targetId}"]`,
          )
          if (!el) {
            next[annotation.id] = null
            continue
          }
          const rect = el.getBoundingClientRect()
          const padding = annotation.padding ?? 4
          next[annotation.id] = {
            x: rect.left - padding,
            y: rect.top - padding,
            w: rect.width + padding * 2,
            h: rect.height + padding * 2,
          }
        } else {
          next[annotation.id] = {
            x: window.innerWidth * annotation.position.xPct - GHOST_WIDTH / 2,
            y: window.innerHeight * annotation.position.yPct - GHOST_HEIGHT / 2,
            w: GHOST_WIDTH,
            h: GHOST_HEIGHT,
          }
        }
      }
      setRects(next)
    }

    const schedule = () => {
      if (state.raf !== null) return
      state.raf = window.requestAnimationFrame(compute)
    }

    schedule()

    void document.fonts.ready.then(() => {
      if (!state.cancelled) schedule()
    })

    window.addEventListener('resize', schedule, { passive: true })

    return () => {
      state.cancelled = true
      window.removeEventListener('resize', schedule)
      if (state.raf !== null) window.cancelAnimationFrame(state.raf)
    }
  }, [])

  return rects
}

function useScannedSet(
  currentDetectionId: string | null,
  userMovedRef: RefObject<boolean>,
): Set<string> {
  const [scanned, setScanned] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.sessionStorage.getItem(SESSION_KEYS.scanned)
      if (!raw) return
      const parsed: unknown = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        const ids = parsed.filter((s): s is string => typeof s === 'string')
        // Hydrate from sessionStorage on mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setScanned(new Set(ids))
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.sessionStorage.setItem(SESSION_KEYS.scanned, JSON.stringify([...scanned]))
    } catch {
      // ignore
    }
  }, [scanned])

  useEffect(() => {
    if (!currentDetectionId) return
    if (!userMovedRef.current) return
    const isReal = REAL_ANNOTATIONS.some((a) => a.id === currentDetectionId)
    if (!isReal) return
    // Updating in response to a derived ID change; React's docs allow this
    // exact pattern when no upstream prop or state captures the same info.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScanned((prev) => {
      if (prev.has(currentDetectionId)) return prev
      const next = new Set(prev)
      next.add(currentDetectionId)
      return next
    })
  }, [currentDetectionId, userMovedRef])

  return scanned
}

export function Hero() {
  const { mode, cycleMode } = useLensMode()
  const { setPosition, getPosition } = useLensPosition()
  const rects = useDetectionRects()
  const reducedMotion = usePrefersReducedMotion()
  const [entranceComplete, setEntranceComplete] = useState(false)
  const [currentDetectionId, setCurrentDetectionId] = useState<string | null>(null)
  const [heroVisible, setHeroVisible] = useState(true)
  const sectionRef = useRef<HTMLElement | null>(null)
  const userMovedRef = useRef(false)
  const scanned = useScannedSet(currentDetectionId, userMovedRef)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const el = sectionRef.current
    if (!el) return

    const checkRect = () => {
      const rect = el.getBoundingClientRect()
      const inView = rect.bottom > 0 && rect.top < window.innerHeight
      setHeroVisible((prev) => (prev === inView ? prev : inView))
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        setHeroVisible(entry.isIntersecting)
      },
      { threshold: 0 },
    )
    observer.observe(el)

    let raf: number | null = null
    const schedule = () => {
      if (raf !== null) return
      raf = window.requestAnimationFrame(() => {
        raf = null
        checkRect()
      })
    }

    checkRect()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf !== null) window.cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!entranceComplete) return
    const onMouseMove = () => {
      userMovedRef.current = true
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [entranceComplete])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const state = { raf: null as number | null, lastId: null as string | null }

    const tick = () => {
      state.raf = window.requestAnimationFrame(tick)
      const pos = getPosition()
      let nextId: string | null = null
      for (const annotation of REAL_ANNOTATIONS) {
        const rect = rects[annotation.id]
        if (!rect) continue
        if (
          pos.x >= rect.x &&
          pos.x <= rect.x + rect.w &&
          pos.y >= rect.y &&
          pos.y <= rect.y + rect.h
        ) {
          nextId = annotation.id
          break
        }
      }
      if (nextId !== state.lastId) {
        state.lastId = nextId
        setCurrentDetectionId(nextId)
      }
    }

    state.raf = window.requestAnimationFrame(tick)
    return () => {
      if (state.raf !== null) window.cancelAnimationFrame(state.raf)
    }
  }, [rects, getPosition])

  const detection = useMemo(() => {
    if (!currentDetectionId) return null
    const ann = REAL_ANNOTATIONS.find((a) => a.id === currentDetectionId)
    if (!ann) return null
    return { label: ann.label, confidence: ann.confidence }
  }, [currentDetectionId])

  const getStartPosition = useMemo(() => {
    return () => {
      const rect = rects['sameer']
      if (!rect) return null
      return { x: rect.x + 24, y: rect.y + rect.h * 0.55 }
    }
  }, [rects])

  return (
    <section
      ref={sectionRef}
      className="hero-section relative flex min-h-[calc(100dvh-var(--topbar-height)-3.5rem)] flex-col justify-center px-4 sm:px-10"
      data-lens-mode={mode}
    >
      <div className="flex flex-col gap-10 sm:gap-14">
        <h1
          className="font-display-name text-fg leading-[0.9]"
          style={{ fontSize: 'clamp(72px, 17vw, 280px)' }}
        >
          <span className="hero-name-fade-in block" style={fadeStyle(120)}>
            <span data-annotation="sameer">sameer</span>
          </span>
          <span className="hero-name-fade-in block" style={fadeStyle(280)}>
            <span data-annotation="akhtar">akhtar</span>
            <span data-annotation="period" className="font-display-name-period text-accent">
              .
            </span>
          </span>
        </h1>

        <p
          className="text-fg max-w-[34ch] font-[family-name:var(--font-display)] text-2xl leading-[1.18] sm:max-w-[42ch] sm:text-[clamp(22px,2.4vw,34px)]"
          style={fadeStyle(540)}
        >
          <span className="hero-fade-in" style={fadeStyle(540)}>
            I build{' '}
          </span>
          <span
            data-annotation="computer-vision"
            className="font-display-italic-cv text-accent hero-fade-in"
            style={fadeStyle(620)}
          >
            computer vision
          </span>
          <span className="hero-fade-in" style={fadeStyle(540)}>
            {' '}
            systems that ship. From <span data-annotation="research-labs">
              research labs
            </span> to <span data-annotation="production">production</span>.
          </span>
        </p>

        <p
          className="text-fg-2 hero-fade-in font-mono text-[10px] leading-[1.4] tracking-[0.18em] uppercase sm:text-[11px]"
          style={fadeStyle(760)}
        >
          <span data-annotation="institution">math &amp; cs · depaul</span>
          <span className="text-fg-4 mx-3" aria-hidden="true">
            /
          </span>
          <span data-annotation="mentor">cv research · dr. huzaifa</span>
          <span className="text-fg-4 mx-3" aria-hidden="true">
            /
          </span>
          <span data-annotation="org">engineering · brunosoft</span>
        </p>
      </div>

      {heroVisible && <DetectionLayer rects={rects} />}
      {heroVisible && <Lens mode={mode} detection={detection} onCycle={cycleMode} />}
      {heroVisible && (
        <EntranceScan
          enabled={!reducedMotion}
          onComplete={() => {
            setEntranceComplete(true)
          }}
          getStartPosition={getStartPosition}
          setLensPosition={setPosition}
        />
      )}
      {heroVisible && (
        <AutoTour
          enabled={entranceComplete && !reducedMotion}
          rects={rects}
          setLensPosition={setPosition}
          getLensPosition={getPosition}
          userMovedRef={userMovedRef}
        />
      )}
      {heroVisible && <DetectionCounter scanned={scanned.size} total={TOTAL_TARGETS} />}
    </section>
  )
}
