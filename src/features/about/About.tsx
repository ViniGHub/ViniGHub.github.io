import { useRef } from 'react'
import { profile } from '@/content/profile'
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/motion'

export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.from('[data-reveal]', { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: root.current, start: 'top 75%' } })
  }, { scope: root })

  return (
    <section ref={root} id="sobre" aria-labelledby="sobre-title" className="border-t border-line py-28">
      <div className="mx-auto grid max-w-[1200px] gap-14 px-8 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p data-reveal className="label">// sobre</p>
          <h2 data-reveal id="sobre-title" className="mt-2.5 text-[clamp(2.1rem,4.4vw,3.5rem)] font-semibold tracking-[-0.03em]">Sobre</h2>
          <p data-reveal className="mt-3.5 max-w-[44em] text-[17px] leading-relaxed text-soft">{profile.about}</p>
        </div>
        <dl className="self-start border-t border-line font-mono text-xs">
          {profile.toolbox.map(([area, tools]) => (
            <div data-reveal key={area} className="grid grid-cols-[110px_1fr] border-b border-line py-3.5">
              <dt className="text-muted">{area}</dt>
              <dd className="text-text">{tools}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
