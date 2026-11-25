import { profile } from '@/content/profile'
import { ui } from '@/i18n/ui'

/** The same footer on every page. */
export function SiteFooter() {
  return (
    <footer className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-x-8 gap-y-2 border-t border-line px-8 pt-6 pb-10 font-mono text-xs text-muted">
      <span>{ui.footer.madeWith}</span>
      {/* The avatar comes from Meshy's free plan, licensed CC BY 4.0: the license asks for this credit. */}
      {profile.avatarModel && (
        <span>
          {ui.footer.avatarBy}{' '}
          <a href="https://www.meshy.ai" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-text">Meshy</a>
          {ui.footer.optimized}{' '}
          <a href={ui.footer.license} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-text">CC BY 4.0</a>
        </span>
      )}
      <span>© 2026</span>
    </footer>
  )
}
