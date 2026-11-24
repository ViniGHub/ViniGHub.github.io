import { useEffect, useState } from 'react'

/**
 * Which of the given sections crosses a line at `line` (0 = top, 1 = bottom of the window).
 * IntersectionObserver reads the real layout, pinned sections included, so the order in which the
 * page sets things up does not matter.
 */
export function useSectionInView(selectors: string[], line = 0.45) {
  const [current, setCurrent] = useState<string | null>(null)
  const key = selectors.join('|')

  useEffect(() => {
    const elements = key.split('|').map((s) => document.querySelector(s)).filter((e): e is Element => !!e)
    const margin = `-${line * 100}% 0px -${(1 - line) * 100}% 0px`
    const crossing = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) crossing.add(`#${entry.target.id}`)
          else crossing.delete(`#${entry.target.id}`)
        }
        // The line can only be inside one section at a time; between sections (or past the last) it is null.
        setCurrent([...crossing].pop() ?? null)
      },
      { rootMargin: margin },
    )
    elements.forEach((e) => observer.observe(e))
    return () => observer.disconnect()
  }, [key, line])

  return current
}

/** True once the page is scrolled to (almost) the very end. */
export function useAtPageEnd(threshold = 60) {
  const [atEnd, setAtEnd] = useState(false)
  useEffect(() => {
    const check = () => setAtEnd(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold)
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [threshold])
  return atEnd
}
