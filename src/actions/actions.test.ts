import { fixture, html, expect } from '@open-wc/testing'
import './icon-button.js'
import './button-group.js'
import type { IconButton } from './icon-button.js'

describe('film-icon-button', () => {
  it('names its button from `label`', async () => {
    const el = await fixture<IconButton>(html`<film-icon-button label="Close"><svg></svg></film-icon-button>`)
    expect(el.shadowRoot?.querySelector('button')?.getAttribute('aria-label')).to.equal('Close')
  })

  it('disables its button', async () => {
    const el = await fixture<IconButton>(html`<film-icon-button label="x" disabled></film-icon-button>`)
    expect(el.shadowRoot?.querySelector('button')?.disabled).to.equal(true)
  })
})

describe('film-button-group', () => {
  it('is a labelled group', async () => {
    const el = await fixture<HTMLElement>(html`<film-button-group label="Text style"></film-button-group>`)
    expect(el.getAttribute('role')).to.equal('group')
    expect(el.getAttribute('aria-label')).to.equal('Text style')
  })

  it('removes its accessible name when the label is cleared', async () => {
    const el = await fixture<HTMLElement & { label: string, updateComplete: Promise<boolean> }>(
      html`<film-button-group label="Text style"></film-button-group>`
    )
    el.label = ''
    await el.updateComplete
    expect(el.hasAttribute('aria-label')).to.equal(false)
  })
})
