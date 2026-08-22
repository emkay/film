import { fixture, html, expect } from '@open-wc/testing'
import './button.js'
import type { Button } from './button.js'

describe('film-button', () => {
  it('renders slotted content in a button', async () => {
    const el = await fixture<Button>(html`<film-button>Click</film-button>`)
    expect(el.shadowRoot?.querySelector('button')).to.exist
    expect(el.textContent).to.equal('Click')
  })

  it('applies the invert class when inverted', async () => {
    const el = await fixture<Button>(html`<film-button invert>x</film-button>`)
    expect(el.invert).to.equal(true)
    expect(el.shadowRoot?.querySelector('button')?.classList.contains('invert')).to.equal(true)
  })

  it('disables the inner button', async () => {
    const el = await fixture<Button>(html`<film-button disabled>x</film-button>`)
    expect(el.shadowRoot?.querySelector('button')?.disabled).to.equal(true)
  })

  it('defaults to medium size and reflects the size attribute', async () => {
    const el = await fixture<Button>(html`<film-button>x</film-button>`)
    expect(el.size).to.equal('medium')
    el.size = 'small'
    await el.updateComplete
    expect(el.getAttribute('size')).to.equal('small')
  })
})
