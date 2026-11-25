import { useEffect, useState, type MouseEvent } from 'react'
import { Button } from '@/components/ui/button'
import { projects } from '@/content/projects'
import { profile } from '@/content/profile'
import { useAtPageEnd, useSectionInView } from '@/hooks/use-section-in-view'
import { useScrollTo } from '@/lib/smooth-scroll'
import { cn } from '@/lib/utils'
import { paletteShortcut, useCommandPalette } from './command-palette'

// Each mark of the bar and the sections that count as it. The three projects count as "projetos".
const MARKS = [
  { id: 'inicio', label: '↑ início', sections: ['#inicio'] },
  { id: 'projetos', label: 'projetos', sections: ['#projetos', ...projects.map((p) => `#${p.id}`)] },
  { id: 'sobre', label: 'sobre', sections: ['#sobre'] },
] as const

/** Always on screen: the visitor can go back to the top or jump to the contact from anywhere. */
export function TopBar() {
  const scrollTo = useScrollTo()
  const palette = useCommandPalette()
  const [shortcut, setShortcut] = useState('ctrl K')
  useEffect(() => setShortcut(paletteShortcut()), [])
  const inView = useSectionInView(MARKS.flatMap((m) => [...m.sections]).concat('#contato'))
  const atEnd = useAtPageEnd()
  // Contato is short and sits at the end, so it may never reach the middle of the screen.
  const current = atEnd ? 'contato' : MARKS.find((m) => inView && (m.sections as readonly string[]).includes(inView))?.id ?? (inView === '#contato' ? 'contato' : 'inicio')

  const go = (target: string) => (event: MouseEvent) => {
    event.preventDefault()
    scrollTo(target === '#inicio' ? 0 : target)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-8 py-4" aria-label="Seções">
        <a href="#inicio" onClick={go('#inicio')} className="font-mono font-medium" aria-label="Voltar ao início">
          vr<span className="text-accent">/</span>{profile.handle}
        </a>
        <div className="flex items-center gap-6 font-mono text-xs text-muted">
          {MARKS.map((mark) => (
            <a
              key={mark.id}
              href={`#${mark.id}`}
              onClick={go(`#${mark.id}`)}
              aria-current={current === mark.id ? 'location' : undefined}
              className={cn(
                'relative transition-colors hover:text-text max-sm:hidden',
                mark.id === 'inicio' && 'text-text max-sm:inline',
                current === mark.id && "text-text after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:bg-accent after:content-['']",
              )}
            >
              {mark.label}
            </a>
          ))}
          {/* Phones have no keyboard shortcut to show, and the bar is already full there. */}
          <button
            type="button"
            onClick={palette.open}
            aria-label="Abrir os comandos"
            aria-keyshortcuts="Control+K Meta+K"
            className="border border-line-strong bg-panel px-2 py-1 text-[11px] text-soft transition-colors hover:border-accent hover:text-accent max-md:hidden"
          >
            {shortcut}
          </button>
          <Button asChild variant="accent" size="sm">
            <a href="#contato" onClick={go('#contato')} aria-current={current === 'contato' ? 'location' : undefined}>
              contato
            </a>
          </Button>
        </div>
      </nav>
    </header>
  )
}
