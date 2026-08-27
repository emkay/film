// `cem analyze` emits modules in filesystem-walk order, which is not stable
// across machines. That makes custom-elements.json churn by thousands of
// semantically identical lines and turns CI's `git diff --exit-code` gate into
// a coin flip. Sorting by path makes the manifest a function of the source.
import { readFileSync, writeFileSync } from 'node:fs'

const file = 'custom-elements.json'
const manifest = JSON.parse(readFileSync(file, 'utf8'))
manifest.modules.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0))
writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`)
