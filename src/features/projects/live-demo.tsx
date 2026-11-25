import { Dialog } from 'radix-ui'
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { projects, type LiveShowcase, type Project } from '@/content/projects'
import { usePauseScroll } from '@/lib/smooth-scroll'
import { cn } from '@/lib/utils'

type LiveDemoApi = { open: (projectId: string) => void }
const LiveDemoContext = createContext<LiveDemoApi>({ open: () => {} })

/** Opens a project's real demo in the page's demo window (from its section, or later from the command palette). */
export const useLiveDemo = () => useContext(LiveDemoContext)

const shortUrl = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

/**
 * One window for every live demo on the page. The frame is created when the window opens and removed when
 * it closes, so a demo only loads (and wakes its server) when someone asks for it.
 */
export function LiveDemoProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null)
  // The window opens from ordinary buttons (not a Radix trigger), so it must remember where focus was.
  const returnFocus = useRef<HTMLElement | null>(null)
  const pauseScroll = usePauseScroll()
  const project = projects.find((p) => p.id === openId)
  const showcase = project?.showcase.kind === 'live' ? project.showcase : null

  useEffect(() => pauseScroll(showcase !== null), [showcase, pauseScroll])
  const api = useMemo<LiveDemoApi>(
    () => ({
      open: (projectId) => {
        returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
        setOpenId(projectId)
      },
    }),
    [],
  )
  const restoreFocus = () => {
    if (returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true })
  }

  return (
    <LiveDemoContext.Provider value={api}>
      {children}
      <Dialog.Root open={showcase !== null} onOpenChange={(open) => !open && setOpenId(null)}>
        {project && showcase && <DemoWindow key={project.id} name={project.name} showcase={showcase} onClosed={restoreFocus} />}
      </Dialog.Root>
    </LiveDemoContext.Provider>
  )
}

const barButton = 'shrink-0 border border-line-strong px-2.5 py-1.5 font-mono text-xs text-text transition-colors hover:border-accent hover:text-accent'

/** The demo window: almost the whole screen on a computer, the whole screen on a phone. Esc or a click outside closes it. */
function DemoWindow({ name, showcase, onClosed }: { name: string; showcase: LiveShowcase; onClosed: () => void }) {
  const [loaded, setLoaded] = useState(false)
  const close = useRef<HTMLButtonElement>(null)

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[80] bg-[rgb(5_6_7/0.82)] motion-safe:animate-[fade-in_0.3s_ease-out]" />
      <Dialog.Content
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          close.current?.focus()
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          onClosed()
        }}
        className="fixed inset-0 z-[81] mx-auto flex max-w-[1440px] flex-col bg-panel md:inset-x-[3vw] md:inset-y-[3vh] md:border md:border-line-strong md:shadow-[0_50px_120px_-40px_rgb(0_0_0/0.9)] motion-safe:animate-[rise-in_0.45s_var(--ease-out-soft)]"
      >
        <div className="flex items-center gap-2.5 border-b border-line px-3 py-2.5">
          <Dialog.Title className="sr-only">Demo do {name}</Dialog.Title>
          <span className="min-w-0 flex-1 truncate border border-line bg-node px-2.5 py-1.5 font-mono text-xs text-soft">{shortUrl(showcase.url)}</span>
          <a href={showcase.url} target="_blank" rel="noreferrer" className={barButton}>
            <span className="max-sm:hidden">abrir em </span>nova aba ↗
          </a>
          <Dialog.Close ref={close} className={barButton}>
            fechar<span className="max-sm:hidden"> · esc</span>
          </Dialog.Close>
        </div>
        <Dialog.Description className="border-b border-line px-3 py-2 font-mono text-xs text-muted">{showcase.hint}</Dialog.Description>
        <div className="relative flex-1 bg-bg">
          <iframe
            src={showcase.url}
            title={`Demo do ${name}`}
            allow={showcase.allow}
            onLoad={() => window.setTimeout(() => setLoaded(true), 300)}
            className="absolute inset-0 size-full border-0"
          />
          <div aria-hidden className={cn('absolute inset-0 flex flex-col items-center justify-center gap-3.5 bg-bg transition-opacity duration-500', loaded && 'pointer-events-none opacity-0')}>
            <span className="font-mono text-xs text-text">abrindo a demo…</span>
            <span className="relative h-0.5 w-44 overflow-hidden bg-line-strong">
              <span className="absolute inset-y-0 left-0 w-2/5 bg-accent motion-safe:animate-[loading-bar_1.2s_ease-in-out_infinite]" />
            </span>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

/**
 * A capture of the demo inside a browser frame. On a computer the invitation appears on hover; on a touch
 * screen it is always visible. A click opens the real demo in the demo window.
 */
export function LiveWindow({ project, showcase }: { project: Project; showcase: LiveShowcase }) {
  const demo = useLiveDemo()

  return (
    <div className="border border-line-strong bg-panel shadow-[0_30px_80px_-40px_rgb(198_243_94/0.18)]">
      <div className="flex items-center gap-3 border-b border-line px-3 py-2">
        <span className="min-w-0 flex-1 truncate border border-line bg-node px-2.5 py-1 font-mono text-xs text-soft">{shortUrl(showcase.url)}</span>
        <a href={showcase.url} target="_blank" rel="noreferrer" className="font-mono text-xs text-accent hover:underline">
          abrir ↗
        </a>
      </div>
      <button type="button" onClick={() => demo.open(project.id)} className="group relative block aspect-[1568/744] w-full cursor-pointer overflow-hidden bg-black">
        <img src={showcase.shot.src} alt={showcase.shot.alt} loading="lazy" className="size-full object-cover motion-safe:transition-[transform,filter] motion-safe:duration-700 motion-safe:group-hover:scale-[1.03] group-hover:blur-[1px]" />
        <span className="absolute inset-0 flex items-center justify-center transition-colors duration-500 group-hover:bg-bg/45 group-focus-visible:bg-bg/45">
          <span className="bg-accent px-4.5 py-3 font-mono text-sm text-bg transition-[opacity,translate] duration-300 pointer-fine:translate-y-2 pointer-fine:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            <span aria-hidden>▶ </span>testar aqui mesmo
          </span>
        </span>
      </button>
    </div>
  )
}
