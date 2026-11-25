import { projects } from '@/content/projects'
import { useSectionInView } from '@/hooks/use-section-in-view'
import { cn } from '@/lib/utils'
import { ui } from '@/i18n/ui'

const SELECTORS = projects.map((p) => `#${p.id}`)

/** A small tag in the corner that says which project is on screen ("projeto 02/03 · TicketFlow"). */
export function ProjectChip() {
  const inView = useSectionInView(SELECTORS, 0.5)
  const index = projects.findIndex((p) => `#${p.id}` === inView)
  const project = index >= 0 ? projects[index] : null
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed bottom-5 left-6 z-30 border border-line-strong bg-panel px-3.5 py-2.5 font-mono text-xs text-text',
        'translate-y-3 opacity-0 transition-all duration-300',
        project && 'translate-y-0 opacity-100',
      )}
    >
      {project && (
        <>
          <span className="text-accent">{ui.chip.project} {pad(index + 1)}/{pad(projects.length)}</span> · {project.name}
        </>
      )}
    </div>
  )
}
