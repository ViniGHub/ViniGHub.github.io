import { useEffect } from 'react'
import { caseStudyFor } from '@/content/case-studies'
import { projects } from '@/content/projects'
import { About } from '@/features/about/About'
import { CaseStudyPage } from '@/features/case-study/CaseStudyPage'
import { Contact } from '@/features/contact/Contact'
import { Hero } from '@/features/hero/Hero'
import { CommandPaletteProvider } from '@/features/nav/command-palette'
import { ProjectChip } from '@/features/nav/ProjectChip'
import { SiteFooter } from '@/features/nav/SiteFooter'
import { TopBar } from '@/features/nav/TopBar'
import { LiveDemoProvider } from '@/features/projects/live-demo'
import { ProjectIndex } from '@/features/projects/ProjectIndex'
import { ProjectSection } from '@/features/projects/ProjectSection'
import { caseStudyIdFrom, lang } from '@/i18n/lang'
import { SmoothScroll, useScrollTo } from '@/lib/smooth-scroll'

/**
 * A case study lives at /projetos/<id>/ or /en/projects/<id>/ (the build writes one HTML file per study and
 * language); anything else is the home page.
 */
function currentCaseStudy() {
  const id = caseStudyIdFrom(window.location.pathname)
  const study = id ? caseStudyFor(id) : undefined
  const project = study && projects.find((p) => p.id === study.projectId)
  return study && project ? { study, project } : null
}

/**
 * Coming back from a case study ("/#projetos"), the section only exists after React draws the page and the
 * pinned diagrams take their space, so the browser's own jump to the anchor misses it. This waits and scrolls.
 */
function ScrollToHash() {
  const scrollTo = useScrollTo()
  useEffect(() => {
    const target = window.location.hash
    if (!target || !document.querySelector(target)) return
    const timer = window.setTimeout(() => scrollTo(target), 400)
    return () => window.clearTimeout(timer)
  }, [scrollTo])
  return null
}

function Home() {
  return (
    <CommandPaletteProvider>
      <ScrollToHash />
      <TopBar />
      <main>
        <Hero />
        <ProjectIndex />
        {projects.map((project, i) => (
          <ProjectSection key={project.id} project={project} index={i} total={projects.length} />
        ))}
        <About />
        <Contact />
      </main>
      <SiteFooter />
      <ProjectChip />
    </CommandPaletteProvider>
  )
}

export function App() {
  const caseStudy = currentCaseStudy()
  // The built HTML already says it; this covers development, where every address gets the same index.html.
  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR'
    if (!caseStudy) document.title = lang === 'en' ? 'Vinicius Rodrigues · front-end developer' : 'Vinicius Rodrigues · desenvolvedor front-end'
  }, [caseStudy])
  return (
    <SmoothScroll>
      <LiveDemoProvider>{caseStudy ? <CaseStudyPage study={caseStudy.study} project={caseStudy.project} /> : <Home />}</LiveDemoProvider>
    </SmoothScroll>
  )
}
