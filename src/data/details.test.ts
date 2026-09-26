import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './details.js'
import type { Details } from './details.js'

describe('film-details', () => {
  it('shows its summary and starts closed', async () => {
    const el = await fixture<Details>(html`<film-details summary="More">Body</film-details>`)
    expect(el.shadowRoot?.querySelector('summary')?.textContent?.trim()).to.equal('More')
    expect((el.shadowRoot?.querySelector('details') as HTMLDetailsElement).open).to.equal(false)
  })

  it('opens from its summary and fires film-toggle', async () => {
    const el = await fixture<Details>(html`<film-details summary="More">Body</film-details>`)
    setTimeout(() => (el.shadowRoot?.querySelector('summary') as HTMLElement).click())
    const event = await oneEvent(el, 'film-toggle')
    expect(event.detail.open).to.equal(true)
    expect(el.open).to.equal(true)
  })

  it('opens from code', async () => {
    const el = await fixture<Details>(html`<film-details summary="More">Body</film-details>`)
    el.open = true
    await el.updateComplete
    expect((el.shadowRoot?.querySelector('details') as HTMLDetailsElement).open).to.equal(true)
  })
})
