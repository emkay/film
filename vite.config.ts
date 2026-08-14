import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// Two build targets share this config:
//   - default (`vite build`)      → the demo site deployed to GitHub Pages
//   - library  (`vite build --mode lib`) → the publishable component library
export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [dts({ include: ['src'], rollupTypes: true })],
      build: {
        copyPublicDir: false,
        lib: {
          entry: 'src/index.ts',
          formats: ['es'],
          fileName: () => 'film.js'
        },
        rollupOptions: {
          // Lit is a peer of the consumer app; don't bundle it in.
          external: /^lit(\/.*)?$/
        }
      }
    }
  }

  // Demo site build. `base` is set for project-page hosting on GitHub Pages.
  return {
    base: process.env.GITHUB_ACTIONS ? '/film/' : '/',
    build: {
      target: 'es2022'
    }
  }
})
