import { lazy, Suspense, useEffect, useRef, type MouseEvent } from 'react'
import { profile } from '@/content/profile'
import { projects } from '@/content/projects'
import { gsap, prefersReducedMotion, SplitText, useGSAP } from '@/lib/motion'
import { useScrollTo } from '@/lib/smooth-scroll'
import { LatestCommit } from './LatestCommit'

const Avatar = lazy(() => import('./Avatar'))

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const name = useRef<HTMLHeadingElement>(null)
  const coords = useRef<HTMLSpanElement>(null)
  const scrollTo = useScrollTo()

  // The coordinates in the corner follow the pointer, written straight to the DOM (no re-render per move).
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!coords.current) return
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = (event.clientY / window.innerHeight) * 2 - 1
      coords.current.textContent = `x ${x.toFixed(2)} · y ${y.toFixed(2)}`
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useGSAP(() => {
    if (prefersReducedMotion()) return
    // Letters drop in one by one; SplitText splits again if the font finishes loading later.
    SplitText.create(name.current, {
      type: 'chars',
      autoSplit: true,
      onSplit: (self) => gsap.from(self.chars, { yPercent: -60, opacity: 0, duration: 0.7, ease: 'power4.out', stagger: 0.035 }),
    })
    gsap.from('[data-fade]', { opacity: 0, x: -10, duration: 0.6, stagger: 0.1, delay: 0.5 })
    gsap.from('[data-fact]', { opacity: 0, y: 10, duration: 0.5, stagger: 0.09, delay: 0.7 })
    gsap.from('[data-viewport]', { opacity: 0, duration: 1.2, delay: 0.2 })
  }, { scope: root })

  const toProjects = (event: MouseEvent) => {
    event.preventDefault()
    scrollTo('#projetos')
  }

  return (
    <section ref={root} id="inicio" className="relative mx-auto grid min-h-[calc(100dvh-4.5rem)] max-w-[1200px] items-center gap-12 px-8 pt-10 pb-24 md:grid-cols-[0.9fr_1.1fr]">
      <div data-viewport className="grid-paper relative h-[min(70vh,580px)] border border-line max-md:h-[380px]">
        <span className="label absolute top-0 left-0 px-3 py-2.5">{profile.avatarModel ? 'avatar.glb' : 'avatar.glb · provisório'}</span>
        <Suspense fallback={null}>
          <Avatar />
        </Suspense>
        <span ref={coords} className="label absolute right-0 bottom-0 px-3 py-2.5">x 0.00 · y 0.00</span>
      </div>

      <div>
        <p data-fade className="label">// {profile.role}</p>
        <h1 ref={name} className="mt-3 text-[clamp(3rem,6.6vw,6rem)] leading-[0.95] font-semibold tracking-[-0.035em]">
          {profile.name[0]}
          <br />
          {profile.name[1]}
        </h1>
        <p data-fade className="mt-5 mb-9 font-mono text-[15px] text-accent">{profile.stack.join(' · ')}</p>
        <dl className="border-t border-line">
          {profile.facts.map(([term, value]) => (
            <div data-fact key={term} className="grid grid-cols-[140px_1fr] border-b border-line py-3.5 text-[15px]">
              <dt className="label pt-0.5">{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
          <LatestCommit />
        </dl>
      </div>

      <a href="#projetos" onClick={toProjects} className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-xs text-text">
        {projects.length} projetos
        <i aria-hidden className="h-8 w-px origin-top bg-gradient-to-b from-accent to-transparent motion-safe:animate-[drip_1.8s_ease-in-out_infinite]" />
      </a>
    </section>
  )
}
