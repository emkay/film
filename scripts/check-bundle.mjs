// Smoke test for the `sideEffects` field: bundle a consumer that imports the
// package purely for its side effects (element registration) with tree-shaking
// on, and assert the registrations survive. Guards against the silent class of
// bug where components get dropped from a consumer's production bundle.
import { build } from 'esbuild'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const cwd = process.cwd()
const dir = mkdtempSync(join(tmpdir(), 'film-bundle-'))
const entry = join(dir, 'entry.js')
writeFileSync(entry, `import ${JSON.stringify(join(cwd, 'dist/index.js'))}\n`)

const result = await build({
  entryPoints: [entry],
  bundle: true,
  minify: true,
  treeShaking: true,
  format: 'esm',
  write: false,
  logLevel: 'silent',
  external: ['lit', 'lit/*', '@lit/react', 'react', 'react-dom']
})

const output = result.outputFiles[0].text
// The tag strings only survive if the (side-effectful) modules weren't dropped.
// customElements.define itself lives in the external Lit lib, not this bundle.
const expected = ['film-button', 'film-dialog', 'film-input']
const missing = expected.filter((token) => !output.includes(token))

if (missing.length > 0) {
  console.error('✗ Bundle smoke test FAILED — registrations were tree-shaken out:', missing.join(', '))
  console.error('  Ensure package.json "sideEffects" covers ./dist/**/*.js')
  process.exit(1)
}

console.log(`✓ Bundle smoke test passed — registrations survive tree-shaking (${Math.round(output.length / 1024)} kB)`)
