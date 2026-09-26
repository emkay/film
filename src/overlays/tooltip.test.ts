import { fixture, html, expect } from '@open-wc/testing'
import './tooltip.js'
import type { Tooltip } from './tooltip.js'

async function tooltip (): Promise<{ el: Tooltip, target: HTMLButtonElement, tip: HTMLElement }> {
  const el = await fixture<Tooltip>(html`<film-tooltip content="Save changes"><button>Save</button></film-tooltip>`)
  return {
    el,
    target: el.querySelector('button') as HTMLButtonElement,
    tip: el.shadowRoot?.querySelector('.tip') as HTMLElement
  }
}

describe('film-tooltip', () => {
  it('starts hidden, but already describes its target', async () => {
    const { el, tip, target } = await tooltip()
    expect(tip.matches(':popover-open')).to.equal(false)
    // Described from the start (see accessibility.test.ts): by a light-DOM copy
    // of the text, since an ID can't reach the tip inside the shadow root.
    const description = el.querySelector(`#${target.getAttribute('aria-describedby') ?? ''}`)
    expect(description?.textContent).to.equal('Save changes')
  })

  it('shows on hover and describes its target', async () => {
    const { el, target, tip } = await tooltip()
    el.dispatchEvent(new MouseEvent('mouseenter'))
    await el.updateComplete
    expect(tip.matches(':popover-open')).to.equal(true)
    expect(tip.getAttribute('role')).to.equal('tooltip')
    expect(target.hasAttribute('aria-describedby')).to.equal(true)
    expect(tip.textContent?.trim()).to.equal('Save changes')
  })

  it('hides on mouse leave', async () => {
    const { el, tip, target } = await tooltip()
    el.dispatchEvent(new MouseEvent('mouseenter'))
    await el.updateComplete
    el.dispatchEvent(new MouseEvent('mouseleave'))
    await el.updateComplete
    expect(tip.matches(':popover-open')).to.equal(false)
    expect(target.hasAttribute('aria-describedby'), 'the description stays').to.equal(true)
  })

  it('shows on keyboard focus and hides on Escape', async () => {
    const { el, target, tip } = await tooltip()
    target.focus()
    await el.updateComplete
    expect(tip.matches(':popover-open')).to.equal(true)
    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await el.updateComplete
    expect(tip.matches(':popover-open')).to.equal(false)
  })

  it('gives each tooltip its own id', async () => {
    const a = await tooltip()
    const b = await tooltip()
    expect(a.tip.id).to.not.equal(b.tip.id)
  })
})
