import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// Two build targets share this config:
//   - default (`vite build`)      → the demo site deployed to GitHub Pages
//   - library  (`vite build --mode lib`) → the publishable component library
export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [dts({ include: ['src'], exclude: ['src/**/*.test.ts'] })],
      build: {
        copyPublicDir: false,
        lib: {
          // Full barrel + a React-wrappers entry.
          entry: {
            index: 'src/index.ts',
            'react/index': 'src/react/index.ts'
          },
          formats: ['es']
        },
        rollupOptions: {
          // Peers of the consumer app; don't bundle them in.
          external: [/^lit(\/.*)?$/, 'react', 'react-dom', '@lit/react'],
          output: {
            // Preserve the source module structure so consumers can import
            // individual components (e.g. `@mk/film/actions/button`) and tree-shake.
            preserveModules: true,
            preserveModulesRoot: 'src',
            entryFileNames: '[name].js'
          }
        }
      }
    }
  }

  // Demo site build. `base` is set for project-page hosting on GitHub Pages.
  // It writes to `dist-site`, NOT `dist`: the library build owns `dist`, and a
  // site build landing there would replace the published package with a bundled
  // demo — invisible until someone installs it.
  return {
    base: process.env.GITHUB_ACTIONS ? '/film/' : '/',
    build: {
      target: 'es2022',
      outDir: 'dist-site'
    }
  }
})
