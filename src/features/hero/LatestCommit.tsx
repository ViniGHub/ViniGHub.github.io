import { useEffect, useState } from 'react'
import { profile } from '@/content/profile'
import { locale } from '@/i18n/lang'
import { ui } from '@/i18n/ui'

type Commit = { repo: string; message: string; url: string; date: string }
type State = { status: 'loading' } | { status: 'ready'; commit: Commit } | { status: 'failed' }

const CACHE_KEY = 'portfolio:ultimo-commit'
/** GitHub allows 60 anonymous requests an hour per visitor; ten minutes of cache is plenty. */
const CACHE_MS = 10 * 60 * 1000

/**
 * The latest commit on a public repository of the account, leaving out this portfolio itself so the line
 * talks about the projects. (The public events feed no longer lists commits and arrives late, so this asks
 * for the most recently pushed repository and then for its latest commit.)
 */
async function fetchLatestCommit(user: string): Promise<Commit> {
  const get = async (path: string) => {
    const response = await fetch(`https://api.github.com${path}`, { headers: { Accept: 'application/vnd.github+json' } })
    if (!response.ok) throw new Error(`GitHub ${response.status}`)
    return response.json()
  }
  const repos: { name: string; full_name: string; fork: boolean; archived: boolean }[] = await get(`/users/${user}/repos?sort=pushed&per_page=10`)
  const repo = repos.find((r) => !r.fork && !r.archived && r.name.toLowerCase() !== `${user}.github.io`.toLowerCase())
  if (!repo) throw new Error('nenhum repositório')
  const [latest] = await get(`/repos/${repo.full_name}/commits?per_page=1`)
  return { repo: repo.name, message: latest.commit.message.split('\n')[0], url: latest.html_url, date: latest.commit.committer.date }
}

function readCache(): Commit | null {
  try {
    const saved = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null')
    return saved && Date.now() - saved.at < CACHE_MS ? saved.commit : null
  } catch {
    return null
  }
}

function writeCache(commit: Commit) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), commit }))
  } catch {
    // private mode or storage full: the next visit just asks GitHub again
  }
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['week', 604_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
]
const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

/** "há 2 horas", "ontem", "há 3 dias" (or "2 hours ago", "yesterday"); under a minute, "agora". */
function since(iso: string, now = Date.now()) {
  const seconds = (Date.parse(iso) - now) / 1000
  const unit = UNITS.find(([, size]) => Math.abs(seconds) >= size)
  return unit ? relative.format(Math.round(seconds / unit[1]), unit[0]) : ui.hero.justNow
}

/** One row of the hero's facts: when and where the last public commit happened, linking to it. */
export function LatestCommit() {
  const [state, setState] = useState<State>(() => {
    const cached = readCache()
    return cached ? { status: 'ready', commit: cached } : { status: 'loading' }
  })

  useEffect(() => {
    if (state.status !== 'loading') return
    let alive = true
    fetchLatestCommit(profile.githubUser)
      .then((commit) => {
        writeCache(commit)
        if (alive) setState({ status: 'ready', commit })
      })
      .catch(() => alive && setState({ status: 'failed' }))
    return () => {
      alive = false
    }
  }, [state.status])

  return (
    <div data-fact className="grid grid-cols-[140px_1fr] border-b border-line py-3.5 text-[15px]">
      <dt className="label pt-0.5">
        <span aria-hidden className="mr-1.5 inline-block size-1.5 rounded-full bg-accent align-middle motion-safe:animate-pulse" />
        {ui.hero.nowLabel}
      </dt>
      {/* Two lines are reserved from the start, so nothing jumps when GitHub answers. */}
      <dd className="min-h-[2lh] min-w-0">
        {state.status === 'loading' && <span className="text-muted">{ui.hero.nowLoading}</span>}
        {state.status === 'failed' && (
          <a href={`https://github.com/${profile.githubUser}`} target="_blank" rel="noreferrer" className="hover:text-accent">
            github.com/{profile.githubUser} ↗
          </a>
        )}
        {state.status === 'ready' && (
          <a href={state.commit.url} target="_blank" rel="noreferrer" className="group block" title={state.commit.message}>
            <span>
              {since(state.commit.date)} {ui.hero.nowIn} <span className="font-mono text-[14px] text-accent">{state.commit.repo}</span>
            </span>
            <span className="block truncate font-mono text-[13px] text-muted group-hover:text-soft">{state.commit.message}</span>
          </a>
        )}
      </dd>
    </div>
  )
}
