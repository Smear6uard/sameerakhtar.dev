export type Easing = (t: number) => number

export const easeOutCubic: Easing = (t) => 1 - Math.pow(1 - t, 3)

export const easeInOutCubic: Easing = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export interface TweenHandle {
  cancel: () => void
  finished: Promise<void>
}

export function tween(
  from: number,
  to: number,
  durationMs: number,
  ease: Easing,
  onUpdate: (value: number) => void,
): TweenHandle {
  if (typeof window === 'undefined' || durationMs <= 0) {
    onUpdate(to)
    return { cancel: () => {}, finished: Promise.resolve() }
  }

  let raf: number | null = null
  let start: number | null = null
  let cancelled = false
  let resolve: (() => void) | null = null

  const finished = new Promise<void>((r) => {
    resolve = r
  })

  const tick = (now: number) => {
    if (cancelled) {
      resolve?.()
      return
    }
    if (start === null) start = now
    const progress = Math.min(1, (now - start) / durationMs)
    onUpdate(from + (to - from) * ease(progress))
    if (progress < 1) {
      raf = window.requestAnimationFrame(tick)
    } else {
      resolve?.()
    }
  }
  raf = window.requestAnimationFrame(tick)

  return {
    cancel: () => {
      cancelled = true
      if (raf !== null) {
        window.cancelAnimationFrame(raf)
      }
      resolve?.()
    },
    finished,
  }
}
