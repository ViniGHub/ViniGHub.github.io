import { useEffect, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import type { CaseStudy } from '@/content/case-studies'
import { profile } from '@/content/profile'
import { projects, type Project } from '@/content/projects'
import { SiteFooter } from '@/features/nav/SiteFooter'
import { useLiveDemo } from '@/features/projects/live-demo'
import { SystemDiagram } from '@/features/projects/SystemDiagram'
import { homePath, homeSection } from '@/i18n/lang'
import { ui } from '@/i18n/ui'
import { LanguageSwitch } from '@/features/nav/LanguageSwitch'

const pad = (n: number) => String(n).padStart(2, '0')

/** The bar of a case study page: back to the portfolio, and the contact, like on the home page. */
function CaseTopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-8 py-4 max-sm:px-5" aria-label={ui.nav.sections}>
        <a href={homePath()} className="font-mono font-medium" aria-label={ui.nav.backToPortfolio}>
          vr<span className="text-accent">/</span>
          {profile.handle}
        </a>
        <div className="flex items-center gap-6 font-mono text-xs whitespace-nowrap text-muted max-sm:gap-3">
          <a href={homeSection('projetos')} className="text-text transition-colors hover:text-accent">
            ← <span className="max-sm:hidden">{ui.nav.allProjects}</span>
            <span className="sm:hidden">{ui.nav.projects}</span>
          </a>
          <LanguageSwitch />
          <Button asChild variant="accent" size="sm">
            <a href={homeSection('contato')}>{ui.nav.contact}</a>
          </Button>
        </div>
      </nav>
    </header>
  )
}

/** One numbered part of the page: its name on the left, the content on the right. */
function Part({ n, name, children }: { n: number; name: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`parte-${n}`} className="mx-auto grid max-w-[1200px] gap-6 border-t border-line px-8 py-16 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10">
      <div>
        <p className="font-mono text-xs text-accent">{pad(n)}</p>
        <h2 id={`parte-${n}`} className="mt-1.5 text-[22px] font-semibold tracking-[-0.02em]">
          {name}
        </h2>
      </div>
      <div className="max-w-[46em]">{children}</div>
    </section>
  )
}

/**
 * A project told in full: the problem, how a request goes through it, the decisions and why, what went
 * wrong, the numbers and what comes next. Served at /projetos/<id>/.
 */
export function CaseStudyPage({ study, project }: { study: CaseStudy; project: Project }) {
  const demo = useLiveDemo()
  const index = projects.findIndex((p) => p.id === project.id)

  useEffect(() => {
    window.scrollTo(0, 0)
    // The build writes this title into the page's HTML; this keeps the tab right in development too.
    document.title = ui.caseStudy.pageTitle(project.name)
  }, [project.name])

  return (
    <>
      <CaseTopBar />
      <main>
        <header className="mx-auto max-w-[1200px] px-8 pt-20 pb-16">
          <p className="font-mono text-xs text-accent">
            {ui.caseStudy.kicker} {pad(index + 1)} / {pad(projects.length)}
          </p>
          <h1 className="mt-2 text-[clamp(3rem,7vw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.035em]">{project.name}</h1>
          <p className="mt-6 max-w-[24em] text-[clamp(1.4rem,2.4vw,2rem)] leading-tight font-semibold tracking-[-0.02em]">{study.title}</p>
          <p className="mt-5 max-w-[46em] text-[17px] leading-relaxed text-soft">{study.lead}</p>
          <p className="label mt-5">{project.stack.join(' · ')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {project.showcase.kind === 'live' ? (
              <Button variant="accent" onClick={() => demo.open(project.id)}>
                {ui.caseStudy.tryLive}
              </Button>
            ) : (
              <Button asChild variant="accent">
                <a href={homeSection(`${project.id}-testar`)}>{ui.caseStudy.tryToy}</a>
              </Button>
            )}
            <Button asChild>
              <a href={project.links.code} target="_blank" rel="noreferrer">
                {ui.project.code}
              </a>
            </Button>
            {study.docs?.map((doc) => (
              <Button asChild key={doc.href}>
                <a href={doc.href} target="_blank" rel="noreferrer">
                  {doc.label} ↗
                </a>
              </Button>
            ))}
          </div>
        </header>

        <dl className="mx-auto grid max-w-[1200px] grid-cols-2 border-t border-line px-8 md:grid-cols-4">
          {study.numbers.map((item) => (
            <div key={item.value + item.label} className="border-line py-7 pr-6 max-md:odd:border-r max-md:[&:nth-child(-n+2)]:border-b md:border-r md:pl-6 md:first:pl-0 md:last:border-r-0">
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className="block font-mono text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-accent">{item.value}</span>
                <span className="mt-2.5 block text-[14px] leading-snug text-soft">{item.label}</span>
              </dd>
            </div>
          ))}
        </dl>

        <Part n={1} name={ui.caseStudy.parts.problem}>
          {study.problem.map((paragraph) => (
            <p key={paragraph} className="mb-4 text-[17px] leading-relaxed text-soft last:mb-0">
              {paragraph}
            </p>
          ))}
        </Part>

        <Part n={2} name={ui.caseStudy.parts.how}>
          <figure className="mb-8 border border-line bg-panel p-4">
            <figcaption className="label mb-2">// {project.diagram.caption}</figcaption>
            <SystemDiagram diagram={project.diagram} lit />
          </figure>
          <ol className="border-t border-line">
            {study.steps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[44px_minmax(0,1fr)] border-b border-line py-5">
                <span className="font-mono text-xs text-accent">{pad(i + 1)}</span>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="mt-1.5 leading-relaxed text-soft">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Part>

        <Part n={3} name={ui.caseStudy.parts.decisions}>
          <dl className="border-t border-line">
            {study.decisions.map((item) => (
              <div key={item.decision} className="grid gap-x-8 gap-y-1.5 border-b border-line py-5 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                <dt className="font-semibold">{item.decision}</dt>
                <dd className="leading-relaxed text-soft">{item.why}</dd>
              </div>
            ))}
          </dl>
        </Part>

        <Part n={4} name={ui.caseStudy.parts.wrong}>
          <ul className="border-t border-line">
            {study.lessons.map((lesson) => (
              <li key={lesson.title} className="border-b border-line py-5">
                <p className="font-semibold">
                  <span aria-hidden className="mr-2 font-mono text-warn">!</span>
                  {lesson.title}
                </p>
                <p className="mt-1.5 leading-relaxed text-soft">{lesson.text}</p>
              </li>
            ))}
          </ul>
        </Part>

        <Part n={5} name={ui.caseStudy.parts.next}>
          <ul className="border-t border-line">
            {study.next.map((item) => (
              <li key={item} className="grid grid-cols-[28px_minmax(0,1fr)] border-b border-line py-4 leading-relaxed text-soft">
                <span aria-hidden className="font-mono text-accent">→</span>
                {item}
              </li>
            ))}
          </ul>
        </Part>

        <nav aria-label={ui.caseStudy.others} className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 border-t border-line px-8 py-12">
          <a href={homeSection('projetos')} className="font-mono text-sm text-text transition-colors hover:text-accent">
            ← {ui.nav.allProjects}
          </a>
          <a href={homeSection(project.id)} className="font-mono text-sm text-muted transition-colors hover:text-text">
            {ui.caseStudy.seeOnHome(project.name)}
          </a>
        </nav>
      </main>
      <SiteFooter />
    </>
  )
}
