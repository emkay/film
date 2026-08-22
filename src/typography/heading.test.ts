import { fixture, html, expect } from '@open-wc/testing'
import './heading.js'
import type { Heading } from './heading.js'

describe('film-heading', () => {
  it('renders the semantic heading tag for the level', async () => {
    const el = await fixture<Heading>(html`<film-heading level="1">Title</film-heading>`)
    expect(el.shadowRoot?.querySelector('h1')).to.exist
    expect(el.shadowRoot?.querySelector('h2')).to.not.exist
  })

  it('defaults to level 2', async () => {
    const el = await fixture<Heading>(html`<film-heading>Title</film-heading>`)
    expect(el.shadowRoot?.querySelector('h2')).to.exist
  })
})
