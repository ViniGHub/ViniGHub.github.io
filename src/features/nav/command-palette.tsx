import { Command } from 'cmdk'
import { Dialog } from 'radix-ui'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { caseStudyFor } from '@/content/case-studies'
import { profile } from '@/content/profile'
import { projects } from '@/content/projects'
import { useLiveDemo } from '@/features/projects/live-demo'
import { usePauseScroll, useScrollTo } from '@/lib/smooth-scroll'
import { caseStudyPath, homePath, otherLanguagePath } from '@/i18n/lang'
import { ui } from '@/i18n/ui'

type PaletteApi = { open: () => void }
const PaletteContext = createContext<PaletteApi>({ open: () => {} })

/** Opens the command palette (the top bar's button uses it; the keyboard shortcut is global). */
export const useCommandPalette = () => useContext(PaletteContext)

/** "⌘ K" on a Mac, "ctrl K" elsewhere. */
export const paletteShortcut = () => (/mac|iphone|ipad/i.test(navigator.userAgent) ? '⌘ K' : 'ctrl K')

type Action = { label: string; hint: string; keywords?: string[]; run: () => void }

/**
 * Ctrl+K (or ⌘K): a list of everything the page can do, filtered as you type. Built on cmdk, the
 * library behind shadcn's Command, inside the same Radix dialog as the demo window.
 */
export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const pauseScroll = usePauseScroll()
  const scrollTo = useScrollTo()
  const demo = useLiveDemo()
  // Where focus was when the palette opened, and the command chosen, which runs once the palette is gone.
  const returnFocus = useRef<HTMLElement | null>(null)
  const pending = useRef<(() => void) | null>(null)

  const show = useCallback(() => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setCopied(false)
    setOpen(true)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !(event.ctrlKey || event.metaKey)) return
      event.preventDefault()
      if (open) setOpen(false)
      else if (!document.querySelector('[role="dialog"]')) show() // not on top of a demo window
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, show])

  useEffect(() => {
    pauseScroll(open)
    if (open || !pending.current) return
    const run = pending.current
    pending.current = null
    requestAnimationFrame(run)
  }, [open, pauseScroll])

  /** Scrolls to a section and moves keyboard focus there too, so Tab continues from it. */
  const goTo = useCallback(
    (selector: string) => () => {
      scrollTo(selector === '#inicio' ? 0 : selector)
      const target = document.querySelector<HTMLElement>(selector)
      if (!target) return
      target.tabIndex = -1
      target.focus({ preventScroll: true })
    },
    [scrollTo],
  )

  const groups = useMemo<{ heading: string; actions: Action[] }[]>(
    () => [
      {
        heading: ui.palette.groups.goTo,
        actions: [
          { label: ui.palette.top, hint: ui.palette.topHint, keywords: ['avatar', 'home', 'início'], run: goTo('#inicio') },
          { label: ui.nav.projects, hint: ui.palette.index, run: goTo('#projetos') },
          ...projects.map((p) => ({ label: p.name, hint: ui.palette.project, run: goTo(`#${p.id}`) })),
          { label: ui.nav.about, hint: ui.palette.section, keywords: ['stack', 'toolbox'], run: goTo('#sobre') },
          { label: ui.nav.contact, hint: ui.palette.section, keywords: ['linkedin', 'github'], run: goTo('#contato') },
        ],
      },
      {
        heading: ui.palette.groups.try,
        actions: projects.map((p) =>
          p.showcase.kind === 'live'
            ? { label: ui.palette.tryHere(p.name), hint: ui.palette.window, keywords: ['demo'], run: () => demo.open(p.id) }
            : { label: ui.palette.tryToy(p.name), hint: ui.palette.toy, keywords: ['demo'], run: goTo(`#${p.id}-testar`) },
        ),
      },
      {
        heading: ui.palette.groups.open,
        actions: [
          ...projects
            .filter((p) => caseStudyFor(p.id))
            .map((p) => ({ label: ui.palette.caseStudy(p.name), hint: ui.palette.page, keywords: ['case', 'estudo'], run: () => window.location.assign(caseStudyPath(p.id)) })),
          ...projects.map((p) => ({ label: ui.palette.code(p.name), hint: 'github ↗', keywords: ['repo', 'source'], run: () => window.open(p.links.code, '_blank', 'noopener') })),
          ...profile.links.map((link) => ({ label: link.label, hint: ui.palette.newTab, run: () => window.open(link.href, '_blank', 'noopener') })),
          { label: ui.palette.language, hint: ui.palette.languageHint, keywords: ['english', 'português', 'idioma', 'language'], run: () => window.location.assign(otherLanguagePath(window.location.pathname)) },
        ],
      },
    ],
    [goTo, demo],
  )

  const choose = (action: Action) => {
    pending.current = action.run
    setOpen(false)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + homePath())
      setCopied(true)
      window.setTimeout(() => setOpen(false), 700)
    } catch {
      setOpen(false)
    }
  }

  const api = useMemo(() => ({ open: show }), [show])

  return (
    <PaletteContext.Provider value={api}>
      {children}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/55 motion-safe:animate-[fade-in_0.2s_ease-out]" />
          <Dialog.Content
            onCloseAutoFocus={(event) => {
              event.preventDefault()
              // A chosen command decides where focus goes; Esc or a click outside returns it.
              if (!pending.current && returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true })
            }}
            className="fixed inset-x-0 top-[14vh] z-[71] mx-auto w-[min(560px,calc(100vw-2rem))] border border-line-strong bg-panel shadow-[0_40px_90px_-30px_rgb(0_0_0/0.8)] motion-safe:animate-[rise-in_0.25s_var(--ease-out-soft)]"
          >
            <Dialog.Title className="sr-only">{ui.palette.title}</Dialog.Title>
            <Dialog.Description className="sr-only">{ui.palette.description}</Dialog.Description>
            <Command label={ui.palette.title} loop className="font-mono">
              <Command.Input
                placeholder={ui.palette.placeholder}
                className="w-full border-b border-line bg-transparent px-4.5 py-4 text-sm text-text outline-none placeholder:text-muted"
              />
              <Command.List className="max-h-[min(340px,60vh)] overflow-y-auto overscroll-contain py-1.5 [&_[cmdk-group-heading]]:px-4.5 [&_[cmdk-group-heading]]:pt-2.5 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:text-muted">
                <Command.Empty className="px-4.5 py-4 text-[13px] text-muted">{ui.palette.empty}</Command.Empty>
                {groups.map((group) => (
                  <Command.Group key={group.heading} heading={`// ${group.heading}`}>
                    {group.actions.map((action) => (
                      <Item key={action.label} label={action.label} hint={action.hint} keywords={action.keywords} onSelect={() => choose(action)} />
                    ))}
                  </Command.Group>
                ))}
                <Command.Group heading={`// ${ui.palette.groups.copy}`}>
                  <Item label={ui.palette.copyLink} hint={copied ? ui.palette.copied : ui.palette.clipboard} keywords={['url', 'link']} onSelect={copyLink} />
                </Command.Group>
              </Command.List>
              <p className="label border-t border-line px-4.5 py-2.5">{ui.palette.help}</p>
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </PaletteContext.Provider>
  )
}

function Item({ label, hint, keywords, onSelect }: { label: string; hint: string; keywords?: string[]; onSelect: () => void }) {
  return (
    <Command.Item
      value={label}
      keywords={keywords}
      onSelect={onSelect}
      className="group flex cursor-pointer items-center justify-between gap-4 px-4.5 py-2.5 text-[13px] text-soft data-[selected=true]:bg-node data-[selected=true]:text-text"
    >
      <span className="truncate">
        <span aria-hidden className="text-accent opacity-0 group-data-[selected=true]:opacity-100">
          {'> '}
        </span>
        {label}
      </span>
      <span className="label shrink-0">{hint}</span>
    </Command.Item>
  )
}
