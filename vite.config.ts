import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { caseStudies, caseStudyPath } from './src/content/case-studies'
import { projects } from './src/content/projects'

const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * GitHub Pages only serves files that exist, so each case study gets its own copy of index.html at
 * /projetos/<id>/index.html, with its own title and description for search engines and link previews.
 * The app reads the address and draws the case study. (In development, Vite already answers any address.)
 */
function caseStudyPages(): Plugin {
  return {
    name: 'case-study-pages',
    apply: 'build',
    closeBundle() {
      const html = readFileSync('dist/index.html', 'utf8')
      for (const study of caseStudies) {
        const name = projects.find((p) => p.id === study.projectId)?.name ?? study.projectId
        const title = escapeHtml(`${name} · estudo de caso · Vinicius Rodrigues`)
        const description = escapeHtml(study.lead)
        const page = html
          .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
          .replace(/(<meta name="description" content=")[^"]*/, `$1${description}`)
          .replace(/(<meta property="og:title" content=")[^"]*/, `$1${title}`)
          .replace(/(<meta property="og:description" content=")[^"]*/, `$1${description}`)
        const folder = path.join('dist', caseStudyPath(study.projectId))
        mkdirSync(folder, { recursive: true })
        writeFileSync(path.join(folder, 'index.html'), page)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), caseStudyPages()],
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
