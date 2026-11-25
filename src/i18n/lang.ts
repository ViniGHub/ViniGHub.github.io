/**
 * The page's language comes from its address: /en/... is English, everything else is Portuguese. Switching
 * language loads the other page, so the language is fixed while a page is open and can be a plain constant.
 * (Outside the browser, as in vite.config.ts, it is Portuguese.)
 */
export type Lang = 'pt' | 'en'

export const lang: Lang = typeof window !== 'undefined' && /^\/en(\/|$)/.test(window.location.pathname) ? 'en' : 'pt'

/** The Portuguese or the English version of a text, side by side where the text is written. */
export const t = <T>(pt: T, en: T): T => (lang === 'en' ? en : pt)

/** Locale for dates and numbers. */
export const locale = t('pt-BR', 'en')

/** The home page of a language. */
export const homePath = (l: Lang = lang) => (l === 'en' ? '/en/' : '/')

/** A section of the home page, from another page (a case study). */
export const homeSection = (id: string, l: Lang = lang) => `${homePath(l)}#${id}`

/** The address of a project's case study, in a language. */
export const caseStudyPath = (projectId: string, l: Lang = lang) => (l === 'en' ? `/en/projects/${projectId}/` : `/projetos/${projectId}/`)

/** Reads a case study address in either language; null when the address is something else. */
export const caseStudyIdFrom = (pathname: string) => pathname.match(/^(?:\/en\/projects|\/projetos)\/([^/]+)\/?$/)?.[1] ?? null

/** The same page in the other language: the switch in the top bar links here. */
export function otherLanguagePath(pathname: string, hash = '') {
  const other: Lang = lang === 'en' ? 'pt' : 'en'
  const study = caseStudyIdFrom(pathname)
  return study ? caseStudyPath(study, other) : `${homePath(other)}${hash}`
}
