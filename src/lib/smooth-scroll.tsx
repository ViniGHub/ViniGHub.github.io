import Lenis from 'lenis'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger } from './motion'

type ScrollTo = (target: string | number) => void
type SmoothScrollApi = {
  scrollTo: ScrollTo
  /** Stops the page from scrolling (while a modal is open) and lets it scroll again. */
  pause: (paused: boolean) => void
}
const SmoothScrollContext = createContext<SmoothScrollApi>({ scrollTo: () => {}, pause: () => {} })

/** Height of the fixed top bar: in-page links stop just below it. */
const BAR_OFFSET = 72

/**
 * Smooth scroll for the whole page (Lenis), driven by the GSAP ticker so ScrollTrigger and the scroll
 * never disagree about where the page is. With reduced motion, the browser scrolls normally.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenis = useRef<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const instance = new Lenis({ lerp: 0.09 })
    lenis.current = instance
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      lenis.current = null
    }
  }, [])

  const scrollTo = useCallback<ScrollTo>((target) => {
    const element = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : null
    if (typeof target === 'string' && !element) return
    const destination = element ?? (target as number)
    const offset = element ? -BAR_OFFSET : 0
    if (lenis.current) lenis.current.scrollTo(destination, { offset, duration: 1.4 })
    else {
      const top = element ? element.getBoundingClientRect().top + window.scrollY + offset : (target as number)
      window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    }
  }, [])

  // Lenis listens to the wheel on the whole window, so a modal must stop it explicitly.
  const pause = useCallback((paused: boolean) => {
    if (paused) lenis.current?.stop()
    else lenis.current?.start()
  }, [])

  const api = useMemo(() => ({ scrollTo, pause }), [scrollTo, pause])
  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>
}

export const useScrollTo = () => useContext(SmoothScrollContext).scrollTo
export const usePauseScroll = () => useContext(SmoothScrollContext).pause
