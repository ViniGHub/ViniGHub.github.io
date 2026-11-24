import { projects } from '@/content/projects'
import { About } from '@/features/about/About'
import { Contact } from '@/features/contact/Contact'
import { Hero } from '@/features/hero/Hero'
import { ProjectChip } from '@/features/nav/ProjectChip'
import { TopBar } from '@/features/nav/TopBar'
import { ProjectIndex } from '@/features/projects/ProjectIndex'
import { ProjectSection } from '@/features/projects/ProjectSection'
import { SmoothScroll } from '@/lib/smooth-scroll'

export function App() {
  return (
    <SmoothScroll>
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
      <footer className="mx-auto flex max-w-[1200px] justify-between border-t border-line px-8 pt-6 pb-10 font-mono text-xs text-muted">
        <span>feito com react, gsap e three.js</span>
        <span>© 2026</span>
      </footer>
      <ProjectChip />
    </SmoothScroll>
  )
}
