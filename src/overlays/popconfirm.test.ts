import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './popconfirm.js'
import type { Popconfirm } from './popconfirm.js'
import type { Popover } from './popover.js'

async function popconfirm (): Promise<{ el: Popconfirm, popover: Popover }> {
  const el = await fixture<Popconfirm>(html`
    <film-popconfirm message="Delete it?" confirm-label="Delete" cancel-label="Keep">
      <button slot="trigger">Delete</button>
    </film-popconfirm>
  `)
  const popover = el.shadowRoot?.querySelector('film-popover') as Popover
  await popover.updateComplete
  popover.open = true
  await popover.updateComplete
  return { el, popover }
}

const buttons = (el: Popconfirm): HTMLElement[] =>
  Array.from(el.shadowRoot?.querySelectorAll('film-button') ?? [])

describe('film-popconfirm', () => {
  it('shows the message and button labels', async () => {
    const { el } = await popconfirm()
    expect(el.shadowRoot?.textContent).to.contain('Delete it?')
    expect(buttons(el).map((b) => b.textContent?.trim())).to.deep.equal(['Keep', 'Delete'])
  })

  it('fires film-confirm and closes', async () => {
    const { el, popover } = await popconfirm()
    setTimeout(() => buttons(el)[1].click())
    await oneEvent(el, 'film-confirm')
    expect(popover.open).to.equal(false)
  })

  it('fires film-cancel from the cancel button and closes', async () => {
    const { el, popover } = await popconfirm()
    setTimeout(() => buttons(el)[0].click())
    await oneEvent(el, 'film-cancel')
    expect(popover.open).to.equal(false)
  })

  it('fires film-cancel when dismissed without choosing, as documented', async () => {
    const { el, popover } = await popconfirm()
    let cancelled = 0
    el.addEventListener('film-cancel', () => { cancelled += 1 })
    // Light dismiss / Escape: the browser hides the popover itself.
    ;(popover.shadowRoot?.querySelector('.panel') as HTMLElement).hidePopover()
    await new Promise((resolve) => setTimeout(resolve, 50))
    await popover.updateComplete
    expect(popover.open).to.equal(false)
    expect(cancelled).to.equal(1)
  })

  it('does not also fire film-cancel after a confirm', async () => {
    const { el } = await popconfirm()
    let cancelled = 0
    el.addEventListener('film-cancel', () => { cancelled += 1 })
    setTimeout(() => buttons(el)[1].click())
    await oneEvent(el, 'film-confirm')
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(cancelled).to.equal(0)
  })
})
