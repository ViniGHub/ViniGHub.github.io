import { profile } from '@/content/profile'
import { projects } from '@/content/projects'
import { About } from '@/features/about/About'
import { Contact } from '@/features/contact/Contact'
import { Hero } from '@/features/hero/Hero'
import { CommandPaletteProvider } from '@/features/nav/command-palette'
import { ProjectChip } from '@/features/nav/ProjectChip'
import { TopBar } from '@/features/nav/TopBar'
import { LiveDemoProvider } from '@/features/projects/live-demo'
import { ProjectIndex } from '@/features/projects/ProjectIndex'
import { ProjectSection } from '@/features/projects/ProjectSection'
import { SmoothScroll } from '@/lib/smooth-scroll'

export function App() {
  return (
    <SmoothScroll>
      <LiveDemoProvider>
        <CommandPaletteProvider>
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
          <footer className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-x-8 gap-y-2 border-t border-line px-8 pt-6 pb-10 font-mono text-xs text-muted">
            <span>feito com react, gsap e three.js</span>
            {/* The avatar comes from Meshy's free plan, licensed CC BY 4.0: the license asks for this credit. */}
            {profile.avatarModel && (
              <span>
                avatar 3D gerado no{' '}
                <a href="https://www.meshy.ai" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-text">Meshy</a>
                , otimizado para a web ·{' '}
                <a href="https://creativecommons.org/licenses/by/4.0/deed.pt-br" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-text">CC BY 4.0</a>
              </span>
            )}
            <span>© 2026</span>
          </footer>
          <ProjectChip />
        </CommandPaletteProvider>
      </LiveDemoProvider>
    </SmoothScroll>
  )
}
