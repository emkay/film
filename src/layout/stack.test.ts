import { fixture, html, expect } from '@open-wc/testing'
import './stack.js'
import type { Stack } from './stack.js'

describe('film-stack', () => {
  it('reflects the space property to the --stack-space custom property', async () => {
    const el = await fixture<Stack>(html`<film-stack space="var(--s2)"><p>a</p><p>b</p></film-stack>`)
    await el.updateComplete
    expect(el.style.getPropertyValue('--stack-space')).to.equal('var(--s2)')
  })

  it('pushes the items after split-after to the end', async () => {
    const el = await fixture<Stack>(
      html`<film-stack split-after="1" style="block-size: 300px"><p>a</p><p>b</p></film-stack>`
    )
    await el.updateComplete
    const [first, second] = Array.from(el.querySelectorAll('p'))
    expect(second.getBoundingClientRect().top - first.getBoundingClientRect().bottom).to.be.greaterThan(150)
  })

  it('drops the split when split-after is cleared', async () => {
    const el = await fixture<Stack>(
      html`<film-stack split-after="1" style="block-size: 300px"><p>a</p><p>b</p></film-stack>`
    )
    el.splitAfter = null
    await el.updateComplete
    const [first, second] = Array.from(el.querySelectorAll('p'))
    expect(second.getBoundingClientRect().top - first.getBoundingClientRect().bottom).to.be.lessThan(100)
  })
})
