import { defineConfig } from 'vite'
import { resolve } from 'node:path'

// Two pages: the home page and /dashboards/. The site is served from the domain
// root, so paths are absolute and work from either page.
export default defineConfig({
  base: '/',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        dashboards: resolve(import.meta.dirname, 'dashboards/index.html'),
      },
    },
  },
})
