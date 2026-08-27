// Publish gate for `dist/`. The library build (`build:lib`) and the demo-site
// build once shared this directory, so a site build could silently replace the
// package with a bundled demo — a failure invisible until someone installs it
// (see 1.2.2). The builds are separated now; this asserts it stayed that way.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const errors = []

const mustExist = (path, why) => {
  if (!existsSync(path)) errors.push(`missing ${path} — ${why}`)
}

// Every entry the export map promises, resolved literally.
mustExist(pkg.exports['.'].import, 'the root entry ("." in exports)')
mustExist(pkg.exports['.'].types, 'root type declarations')
mustExist(pkg.exports['./react'].import, 'the React wrappers entry')
mustExist(pkg.exports['./react'].types, 'React wrapper declarations')

// A sample of deep subpaths, matched by the `./*` export pattern. These are the
// imports that broke in 1.2.2 while the root entry's absence went unnoticed.
for (const sub of ['navigation/menu-bar', 'actions/button', 'windowing/window', 'forms/input']) {
  mustExist(join('dist', `${sub}.js`), `the "@mk/film/${sub}" subpath`)
  mustExist(join('dist', `${sub}.d.ts`), `types for "@mk/film/${sub}"`)
}

// Demo-site artifacts in dist/ mean a plain `vite build` wrote here.
for (const artifact of ['index.html', 'assets']) {
  if (existsSync(join('dist', artifact))) {
    errors.push(`dist/${artifact} exists — this is a demo-site build, not the library. Run \`npm run build:lib\`.`)
  }
}

// preserveModules emits one file per source module; a handful means a bundle.
const count = existsSync('dist') ? readdirSync('dist', { recursive: true }).length : 0
if (count < 100) errors.push(`dist/ has only ${count} entries — expected one module per component (~195).`)

if (errors.length > 0) {
  console.error('✗ dist/ is not a publishable library build:')
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

console.log(`✓ dist/ looks like a library build (${count} entries, all export-map entries resolve)`)
