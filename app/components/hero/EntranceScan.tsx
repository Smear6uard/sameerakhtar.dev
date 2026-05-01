import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

import { easeInOutCubic, easeOutCubic, tween, type TweenHandle } from '@/lib/tween'

import {
  ENTRANCE_BURST_MS,
  ENTRANCE_CONTRACT_MS,
  ENTRANCE_DELAY_MS,
  ENTRANCE_GHOST_LABELS,
  SESSION_KEYS,
} from './lens-data'

interface EntranceScanProps {
  enabled: boolean
  onComplete: () => void
  getStartPosition: () => { x: number; y: number } | null
  setLensPosition: (x: number, y: number) => void
}

interface BurstGhost {
  id: number
  label: string
  confidence: string
  x: number
  y: number
  delay: number
}

const GHOST_COUNT = 13
const GHOST_BLIP_MS = 220
const TOP_SAFE = 100
const BOTTOM_SAFE = 80
const SIDE_SAFE = 64
const ENTRANCE_FADE_MS = 520

function generateGhosts(): BurstGhost[] {
  const ghosts: BurstGhost[] = []
  const vw = window.innerWidth
  const vh = window.innerHeight
  const usableW = Math.max(120, vw - SIDE_SAFE * 2)
  const usableH = Math.max(120, vh - TOP_SAFE - BOTTOM_SAFE)
  const delayWindow = Math.max(0, ENTRANCE_BURST_MS - GHOST_BLIP_MS - 60)

  for (let i = 0; i < GHOST_COUNT; i++) {
    const label = ENTRANCE_GHOST_LABELS[i % ENTRANCE_GHOST_LABELS.length] ?? 'NOISE'
    const confidence = (Math.random() * 0.18 + 0.02).toFixed(2)
    const x = SIDE_SAFE + Math.random() * usableW
    const y = TOP_SAFE + Math.random() * usableH
    const delay = Math.random() * delayWindow
    ghosts.push({ id: i, label, confidence, x, y, delay })
  }

  return ghosts.sort((a, b) => a.delay - b.delay)
}

type Phase = 'idle' | 'fade-in' | 'burst' | 'contract' | 'done'

function setRootVar(name: string, value: string) {
  document.documentElement.style.setProperty(name, value)
}

export function EntranceScan({
  enabled,
  onComplete,
  getStartPosition,
  setLensPosition,
}: EntranceScanProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [ghosts, setGhosts] = useState<BurstGhost[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const state = {
      cancelled: false,
      tweens: [] as TweenHandle[],
      timers: [] as ReturnType<typeof setTimeout>[],
    }

    const isCancelled = (): boolean => state.cancelled

    const finishImmediately = () => {
      setRootVar('--lens-scale', '1')
      setRootVar('--lens-opacity', '1')
      const start = getStartPosition()
      if (start) setLensPosition(start.x, start.y)
      setPhase('done')
      onComplete()
    }

    const alreadyPlayed = (() => {
      try {
        return window.sessionStorage.getItem(SESSION_KEYS.entrancePlayed) === '1'
      } catch {
        return false
      }
    })()

    if (!enabled || alreadyPlayed) {
      finishImmediately()
      return () => {
        state.cancelled = true
      }
    }

    try {
      window.sessionStorage.setItem(SESSION_KEYS.entrancePlayed, '1')
    } catch {
      // ignore
    }

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    setLensPosition(centerX, centerY)
    setRootVar('--lens-scale', '2.5')
    setRootVar('--lens-opacity', '0')

    const choreograph = async () => {
      await new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ENTRANCE_DELAY_MS)
        state.timers.push(t)
      })
      if (isCancelled()) return

      setPhase('fade-in')
      const fade = tween(0, 1, ENTRANCE_FADE_MS, easeOutCubic, (v) => {
        setRootVar('--lens-opacity', String(v))
      })
      state.tweens.push(fade)
      await fade.finished
      if (isCancelled()) return

      setGhosts(generateGhosts())
      setPhase('burst')
      await new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ENTRANCE_BURST_MS)
        state.timers.push(t)
      })
      if (isCancelled()) return

      setPhase('contract')
      const start = getStartPosition() ?? {
        x: window.innerWidth * 0.18,
        y: window.innerHeight * 0.36,
      }
      const fromX = centerX
      const fromY = centerY

      const scaleTween = tween(2.5, 1, ENTRANCE_CONTRACT_MS, easeInOutCubic, (v) => {
        setRootVar('--lens-scale', String(v))
      })
      const moveTween = tween(0, 1, ENTRANCE_CONTRACT_MS, easeInOutCubic, (t) => {
        const x = fromX + (start.x - fromX) * t
        const y = fromY + (start.y - fromY) * t
        setLensPosition(x, y)
      })
      state.tweens.push(scaleTween, moveTween)
      await Promise.all([scaleTween.finished, moveTween.finished])
      if (isCancelled()) return

      setPhase('done')
      setGhosts([])
      onComplete()
    }

    void choreograph()

    return () => {
      state.cancelled = true
      state.tweens.forEach((t) => {
        t.cancel()
      })
      state.timers.forEach((t) => {
        clearTimeout(t)
      })
    }
    // Choreography runs once on mount; props are stable from parent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (phase !== 'burst' || ghosts.length === 0) return null

  return (
    <div aria-hidden="true">
      {ghosts.map((g) => (
        <motion.div
          key={g.id}
          className="ghost-burst"
          initial={{ opacity: 0, y: 4, scale: 0.94 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [4, 0, 0, 0],
            scale: [0.94, 1, 1, 1],
          }}
          transition={{
            duration: GHOST_BLIP_MS / 1000,
            times: [0, 0.35, 0.7, 1],
            ease: 'easeOut',
            delay: g.delay / 1000,
          }}
          style={{ left: g.x, top: g.y }}
        >
          {g.label}
          <span style={{ marginLeft: 6, opacity: 0.7 }}>· {g.confidence}</span>
        </motion.div>
      ))}
    </div>
  )
}
