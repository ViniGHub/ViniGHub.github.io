import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { caseStudiesPt } from './src/content/case-studies'
import { caseStudiesEn } from './src/content/case-studies.en'
import { projects } from './src/content/projects'
import { caseStudyPath, homePath, type Lang } from './src/i18n/lang'

const SITE = 'https://vinighub.github.io'

const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** A copy of the built index.html with its own language, title, description and links to the other language. */
function pageFrom(html: string, page: { lang: Lang; title: string; description: string; pt: string; en: string }) {
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  const alternates = [
    `<link rel="alternate" hreflang="pt-BR" href="${SITE}${page.pt}" />`,
    `<link rel="alternate" hreflang="en" href="${SITE}${page.en}" />`,
  ].join('\n    ')
  return html
    .replace(/<html lang="[^"]*">/, `<html lang="${page.lang === 'en' ? 'en' : 'pt-BR'}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${description}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${title}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${description}`)
    .replace(/<link rel="alternate"[^>]*>\s*/g, '')
    .replace('</head>', `  ${alternates}\n  </head>`)
}

function writePage(address: string, html: string) {
  const folder = path.join('dist', address)
  mkdirSync(folder, { recursive: true })
  writeFileSync(path.join(folder, 'index.html'), html)
}

/**
 * GitHub Pages only serves files that exist, so every address of the site gets its own copy of index.html:
 * the English home (/en/) and each case study in both languages (/projetos/<id>/ and /en/projects/<id>/),
 * each with its own language, title and description for search engines and link previews. The app reads
 * the address and draws the right page. (In development, Vite already answers any address.)
 */
function sitePages(): Plugin {
  return {
    name: 'site-pages',
    apply: 'build',
    closeBundle() {
      const html = readFileSync('dist/index.html', 'utf8')
      const home = { pt: homePath('pt'), en: homePath('en') }
      writePage('/', pageFrom(html, { lang: 'pt', title: 'Vinicius Rodrigues · desenvolvedor front-end', description: 'Portfólio de Vinicius Rodrigues, desenvolvedor front-end em São Paulo. Três sistemas explicados por dentro: agenda-ia, TicketFlow e Sinal.', ...home }))
      writePage(home.en, pageFrom(html, { lang: 'en', title: 'Vinicius Rodrigues · front-end developer', description: 'Portfolio of Vinicius Rodrigues, a front-end developer in São Paulo. Three systems explained from the inside: agenda-ia, TicketFlow and Sinal.', ...home }))
      for (const [lang, studies] of [['pt', caseStudiesPt], ['en', caseStudiesEn]] as const) {
        for (const study of studies) {
          const name = projects.find((p) => p.id === study.projectId)?.name ?? study.projectId
          const addresses = { pt: caseStudyPath(study.projectId, 'pt'), en: caseStudyPath(study.projectId, 'en') }
          const title = lang === 'en' ? `${name} · case study · Vinicius Rodrigues` : `${name} · estudo de caso · Vinicius Rodrigues`
          writePage(addresses[lang], pageFrom(html, { lang, title, description: study.lead, ...addresses }))
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), sitePages()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  // The prototypes and the docs are not part of the site; watching their images crashed the dev server
  // on Windows (EBUSY while a file was being copied).
  server: { watch: { ignored: ['**/prototipos/**', '**/docs/**'] } },
  build: {
    rollupOptions: {
      output: {
        // three.js is heavy and only the avatar needs it: keep it in its own file, loaded after the text.
        manualChunks: { three: ['three', '@react-three/fiber'] },
      },
    },
  },
})
