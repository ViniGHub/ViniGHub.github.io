import { useRef } from 'react'
import { profile } from '@/content/profile'
import { gsap, useGSAP } from '@/lib/motion'

const ACCENT = '#c6f35e'
const NODE = '#0f1113'

type Entry = (typeof profile.timeline)[number]

const monthNumber = (month: string) => {
  const [year, m] = month.split('-').map(Number)
  return year * 12 + (m - 1)
}
const thisMonth = () => new Date().getFullYear() * 12 + new Date().getMonth()
const showMonth = (month: string) => month.split('-').reverse().join('/')
const period = (entry: Entry) => `${showMonth(entry.from)} – ${entry.to ? showMonth(entry.to) : 'hoje'}`

/** "2 anos e 11 meses", "4 anos", "10 meses": counts the first and the last month, the way a CV does. */
function duration(entry: Entry) {
  const months = (entry.to ? monthNumber(entry.to) : thisMonth()) - monthNumber(entry.from) + 1
  const years = Math.floor(months / 12)
  const rest = months % 12
  return [years && `${years} ${years === 1 ? 'ano' : 'anos'}`, rest && `${rest} ${rest === 1 ? 'mês' : 'meses'}`].filter(Boolean).join(' e ')
}

/**
 * Studies and jobs on one rail that fills up as the visitor scrolls, in the style of the project diagrams:
 * each stop lights up when the line reaches it. As with the diagrams, this runs even with reduced motion,
 * because nothing travels across the screen; only colour and opacity change, at the pace of the scroll.
 */
export function Timeline() {
  const list = useRef<HTMLOListElement>(null)

  useGSAP(
    () => {
      const rail = list.current!
      const rows = gsap.utils.toArray<HTMLElement>('[data-row]', rail)
      gsap.set(rail.querySelectorAll('[data-text]'), { opacity: 0.35 })

      // Ends while the list is still low on the screen: on a tall monitor the page runs out of scroll soon
      // after "Contato", and the last stop must still light up.
      const timeline = gsap.timeline({ scrollTrigger: { trigger: rail, start: 'top 75%', end: 'bottom 80%', scrub: 0.6 } })
      timeline.fromTo('[data-progress]', { scaleY: 0 }, { scaleY: 1, duration: 1, ease: 'none' }, 0)
      for (const row of rows) {
        // The rows are not positioned, so a node's offsetTop is measured from the list itself.
        const node = row.querySelector<HTMLElement>('[data-node]')!
        const at = (node.offsetTop + node.offsetHeight / 2) / rail.offsetHeight
        timeline
          .to(node, { borderColor: ACCENT, backgroundColor: row.dataset.current ? ACCENT : NODE, duration: 0.04 }, at)
          .to(row.querySelectorAll('[data-text]'), { opacity: 1, duration: 0.06 }, at)
      }
    },
    { scope: list },
  )

  const first = profile.timeline[0].from.slice(0, 4)

  return (
    <div className="mx-auto mt-24 max-w-[1200px] px-8">
      <div className="mb-4 flex items-baseline justify-between border-b border-line pb-3">
        <h3 className="label">// trajetória</h3>
        <p className="label">{first} → hoje</p>
      </div>
      <ol ref={list} className="relative">
        {/* The rail, and over it the part already walked. */}
        <span aria-hidden className="absolute inset-y-0 left-[13px] w-px bg-line md:left-[183px]" />
        <span aria-hidden data-progress className="absolute inset-y-0 left-[13px] w-px origin-top bg-accent md:left-[183px]" />
        {profile.timeline.map((entry) => {
          const current = entry.to === null
          return (
            <li key={`${entry.from}-${entry.place}`} data-row data-current={current || undefined} className="grid grid-cols-[28px_minmax(0,1fr)] py-4 md:grid-cols-[170px_28px_minmax(0,1fr)]">
              <p data-text className="pt-0.5 font-mono text-xs text-soft max-md:hidden">
                {period(entry)}
              </p>
              <span data-node aria-hidden className="relative z-[1] mx-auto mt-1.5 size-2.5 border border-line-strong bg-node" />
              <div data-text>
                <p className="mb-1 font-mono text-xs text-soft md:hidden">{period(entry)}</p>
                <p className="text-[17px] leading-snug">
                  {entry.role} <span className="text-muted">· {entry.place}</span>
                  {current && <span className="ml-2 bg-accent px-1.5 py-0.5 align-middle font-mono text-[11px] text-bg">agora</span>}
                </p>
                {/* A course is known by its nominal length ("4 anos"), which month counting would get wrong, so studies just say they are done. */}
                <p className="label mt-1">
                  {entry.kind} · {entry.kind === 'estudo' ? (current ? 'cursando' : 'concluído') : duration(entry)}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
