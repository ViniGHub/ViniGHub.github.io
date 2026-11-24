import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
