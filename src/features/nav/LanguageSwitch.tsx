import { lang, otherLanguagePath } from '@/i18n/lang'
import { ui } from '@/i18n/ui'

/**
 * "en" on the Portuguese pages, "pt" on the English ones: the same page in the other language. On the home
 * page it keeps the section the visitor is reading (`hash`).
 */
export function LanguageSwitch({ hash = '' }: { hash?: string }) {
  const other = lang === 'en' ? 'pt' : 'en'
  return (
    <a
      href={otherLanguagePath(window.location.pathname, hash)}
      hrefLang={other === 'en' ? 'en' : 'pt-BR'}
      lang={other === 'en' ? 'en' : 'pt-BR'}
      aria-label={ui.nav.switchLanguage}
      className="border border-line-strong px-1.5 py-0.5 text-[11px] text-soft uppercase transition-colors hover:border-accent hover:text-accent"
    >
      {other}
    </a>
  )
}
