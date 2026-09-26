import { expect } from '@open-wc/testing'
import { version } from '../index.js'
import '../layout/stack.js'

describe('version', () => {
  it('matches package.json, so a release can never ship a stale string', async () => {
    const pkg = await (await fetch('/package.json')).json() as { version: string }
    expect(version).to.equal(pkg.version)
  })

  it('records every loaded copy of Film on a global, like Lit does', () => {
    expect(globalThis.filmVersions).to.include(version)
  })

  it('records a copy once, however many components it registers', () => {
    expect(globalThis.filmVersions?.filter((v) => v === version)).to.have.length(1)
  })
})
