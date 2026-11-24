import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import type { Project } from '@/content/projects'
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/motion'
import { SystemDiagram } from './SystemDiagram'

const ACCENT = '#c6f35e'
const LINE = '#33373e'
/** The pinned diagram stays just below the fixed top bar. */
const PIN_TOP = 'top 96px'
/** How far the visitor scrolls while the diagram stays on screen. */
const PIN_LENGTH = 1100

const pad = (n: number) => String(n).padStart(2, '0')

export function ProjectSection({ project, index, total }: { project: Project; index: number; total: number }) {
  const root = useRef<HTMLElement>(null)
  const system = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const pieces = gsap.utils.toArray<SVGElement | HTMLElement>('[data-step]', root.current)

    // The diagram and the log stay on screen while the scroll walks one request through the system.
    // This runs even for people who ask for reduced motion: nothing moves across the screen, only lines
    // and text light up, and it happens at the pace of their own scroll.
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: system.current, start: PIN_TOP, end: `+=${PIN_LENGTH}`, scrub: 0.6, pin: true },
    })
    for (const piece of pieces) {
      const at = Number(piece.dataset.step) * 0.5
      const kind = piece.dataset.kind
      if (kind === 'wire') {
        const length = (piece as SVGPathElement).getTotalLength()
        gsap.set(piece, { strokeDasharray: length, strokeDashoffset: length })
        timeline.to(piece, { strokeDashoffset: 0, duration: 0.5, ease: 'none' }, at)
      } else if (kind === 'node') {
        const box = piece.querySelector('rect')
        timeline.to(box, { stroke: ACCENT, duration: 0.15 }, at)
        if (piece.dataset.off) {
          const off = Number(piece.dataset.off) * 0.5
          timeline.to(piece, { opacity: 0.35, duration: 0.2 }, off).to(box, { stroke: LINE, duration: 0.2 }, off)
        }
      } else {
        timeline.to(piece, { opacity: 1, duration: 0.15 }, at)
      }
    }
    timeline.to({}, { duration: 0.6 }) // a short rest on the finished picture before the pin lets go

    if (prefersReducedMotion()) return
    gsap.from('[data-head] > *', {
      opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: '[data-head]', start: 'top 80%' },
    })
  }, { scope: root })

  return (
    <section ref={root} id={project.id} aria-labelledby={`${project.id}-title`} className="border-t border-line pt-28 pb-24">
      <div className="mx-auto max-w-[1200px] px-8">
        <header data-head className="mb-9 flex items-end justify-between gap-8 max-md:flex-col max-md:items-start">
          <div>
            <p className="font-mono text-xs text-accent">projeto {pad(index + 1)} / {pad(total)}</p>
            <h2 id={`${project.id}-title`} className="mt-1.5 mb-1 text-[clamp(2.75rem,6vw,5rem)] font-semibold tracking-[-0.03em]">{project.name}</h2>
            <p className="mt-3.5 max-w-[44em] text-[17px] leading-relaxed text-soft">{project.description}</p>
            <p className="label mt-3.5">{project.stack.join(' · ')}</p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Button asChild><a href={project.links.code} target="_blank" rel="noreferrer">código ↗</a></Button>
            {project.links.demo && <Button asChild><a href={project.links.demo} target="_blank" rel="noreferrer">demo ↗</a></Button>}
          </div>
        </header>

        <div ref={system} className="grid gap-6 md:grid-cols-[1.25fr_0.75fr]">
          <figure className="border border-line bg-panel p-4">
            <figcaption className="label mb-2 flex justify-between"><span>// {project.diagram.caption}</span><span aria-hidden>role ↓</span></figcaption>
            <SystemDiagram diagram={project.diagram} />
          </figure>
          <div className="border border-line bg-panel p-[18px] font-mono text-[13px] leading-[1.95]" aria-label="Log do pedido">
            <p className="label mb-2.5">// log</p>
            {project.log.map((line) => (
              <p key={line.text} data-step={line.step} data-kind="log" className={line.ok ? 'truncate whitespace-pre text-accent opacity-[0.14]' : 'truncate whitespace-pre opacity-[0.14]'}>
                {line.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
