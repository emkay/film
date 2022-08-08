// Import rollup plugins

import html from '@web/rollup-plugin-html'
import {copy} from '@web/rollup-plugin-copy'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import {terser} from 'rollup-plugin-terser'
import minifyHTML from 'rollup-plugin-minify-html-literals'
import summary from 'rollup-plugin-summary'
import postcss from 'rollup-plugin-postcss'

export default {
  plugins: [
    // Entry point for application build; can specify a glob to build multiple
    // HTML files for non-SPA app
    html({
      input: 'index.html',
    }),

    // Resolve bare module specifiers to relative paths
    resolve(),

    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),

    // Minify HTML template literals
    minifyHTML(),

    // Minify JS
    terser({
      ecma: 2020,
      module: true,
      warnings: true
    }),

    // Print bundle summary
    summary(),

    // Optional: copy any static assets to build directory
    copy({
      patterns: ['www/**/*'],
    }),
    postcss({
      plugins: []
    })
  ],
  output: {
    dir: 'build',
  },

  preserveEntrySignatures: 'strict'
}
