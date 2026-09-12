import { fixture, html, expect } from '@open-wc/testing'
import './switch.js'
import type { Switch } from './switch.js'

describe('film-switch', () => {
  it('has the switch role', async () => {
    const el = await fixture<Switch>(html`<film-switch>Wifi</film-switch>`)
    expect(el.getAttribute('role')).to.equal('switch')
  })

  it('labels from the label property, matching the other form controls', async () => {
    const el = await fixture<Switch>(html`<film-switch label="Wifi"></film-switch>`)
    expect(el.label).to.equal('Wifi')
    expect(el.shadowRoot?.textContent).to.contain('Wifi')
    expect(el.getAttribute('aria-label')).to.equal('Wifi')
  })

  it('drops the aria-label when the label is cleared', async () => {
    const el = await fixture<Switch>(html`<film-switch label="Wifi"></film-switch>`)
    el.label = ''
    await el.updateComplete
    expect(el.hasAttribute('aria-label')).to.equal(false)
  })
})
