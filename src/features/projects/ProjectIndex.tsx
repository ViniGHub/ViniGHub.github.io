import { useRef, type MouseEvent } from 'react'
import { projects } from '@/content/projects'
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/motion'
import { useScrollTo } from '@/lib/smooth-scroll'

const pad = (n: number) => String(n).padStart(2, '0')

/** Right after the hero: says plainly that what follows are projects, and links to each one. */
export function ProjectIndex() {
  const root = useRef<HTMLElement>(null)
  const scrollTo = useScrollTo()

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.from('[data-row]', { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '[data-list]', start: 'top 85%' } })
  }, { scope: root })

  const go = (id: string) => (event: MouseEvent) => {
    event.preventDefault()
    scrollTo(`#${id}`)
  }

  return (
    <section ref={root} id="projetos" className="border-t border-line py-28">
      <div className="mx-auto max-w-[1200px] px-8">
        <p className="label">// projetos</p>
        <h2 className="mt-2.5 text-[clamp(2.1rem,4.4vw,3.5rem)] font-semibold tracking-[-0.03em]">Três sistemas, explicados por dentro</h2>
        <p className="mt-3.5 max-w-[44em] text-[17px] leading-relaxed text-soft">
          Cada projeto tem um diagrama que se monta enquanto você rola: o caminho de um pedido, do clique até a resposta, com o que acontece em cada parte.
        </p>
        <ol data-list className="mt-11 border-t border-line">
          {projects.map((project, i) => (
            <li key={project.id} data-row>
              <a
                href={`#${project.id}`}
                onClick={go(project.id)}
                className="group relative grid items-baseline gap-x-4.5 border-b border-line py-6 transition-[padding] duration-300 ease-out-soft hover:pl-4 md:grid-cols-[70px_200px_1fr_260px_60px] max-md:grid-cols-[50px_1fr]"
              >
                <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 origin-center scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100" />
                <span className="font-mono text-accent">{pad(i + 1)}</span>
                <span className="text-2xl font-semibold tracking-[-0.02em]">{project.name}</span>
                <span className="text-soft max-md:col-start-2">{project.summary}</span>
                <span className="label max-md:col-start-2">{project.stack.slice(0, 3).join(' · ')}</span>
                <span className="label text-right max-md:col-start-2 max-md:text-left">ver ↓</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
