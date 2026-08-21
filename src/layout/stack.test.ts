import { fixture, html, expect } from '@open-wc/testing'
import './stack.js'
import type { Stack } from './stack.js'

describe('film-stack', () => {
  it('reflects the space property to the --stack-space custom property', async () => {
    const el = await fixture<Stack>(html`<film-stack space="var(--s2)"><p>a</p><p>b</p></film-stack>`)
    await el.updateComplete
    expect(el.style.getPropertyValue('--stack-space')).to.equal('var(--s2)')
  })

  it('renders a split-after style when set', async () => {
    const el = await fixture<Stack>(
      html`<film-stack split-after="1"><p>a</p><p>b</p></film-stack>`
    )
    await el.updateComplete
    expect(el.shadowRoot?.querySelector('style')).to.exist
  })
})
