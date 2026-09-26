import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './toast.js'
import { toast } from './toaster.js'
import type { Toast } from './toast.js'

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

describe('film-toast', () => {
  it('announces politely for info and assertively for danger', async () => {
    const info = await fixture<Toast>(html`<film-toast variant="info">x</film-toast>`)
    const danger = await fixture<Toast>(html`<film-toast variant="danger">x</film-toast>`)
    expect(info.getAttribute('role')).to.equal('status')
    expect(danger.getAttribute('role')).to.equal('alert')
  })

  it('updates its role when the variant changes', async () => {
    const el = await fixture<Toast>(html`<film-toast variant="info">x</film-toast>`)
    el.variant = 'danger'
    await el.updateComplete
    expect(el.getAttribute('role')).to.equal('alert')
  })

  it('closes itself after `duration`', async () => {
    const el = await fixture<Toast>(html`<film-toast duration="30">x</film-toast>`)
    el.show()
    await oneEvent(el, 'film-close')
    expect(el.open).to.equal(false)
  })

  it('stays open with duration 0', async () => {
    const el = await fixture<Toast>(html`<film-toast duration="0">x</film-toast>`)
    el.show()
    await wait(80)
    expect(el.open).to.equal(true)
  })

  it('pauses while hovered', async () => {
    const el = await fixture<Toast>(html`<film-toast duration="40">x</film-toast>`)
    el.show()
    const body = el.shadowRoot?.querySelector('.toast') as HTMLElement
    body.dispatchEvent(new MouseEvent('mouseenter'))
    await wait(90)
    expect(el.open, 'closed while hovered').to.equal(true)
    body.dispatchEvent(new MouseEvent('mouseleave'))
    await oneEvent(el, 'film-close')
  })

  it('closes from its dismiss button', async () => {
    const el = await fixture<Toast>(html`<film-toast duration="0">x</film-toast>`)
    el.show()
    setTimeout(() => (el.shadowRoot?.querySelector('.close') as HTMLButtonElement).click())
    await oneEvent(el, 'film-close')
    expect(el.open).to.equal(false)
  })
})

describe('toast()', () => {
  it('shows a message in a shared live region and removes it on close', async () => {
    const first = toast('Saved', { duration: 0 })
    const second = toast('Deleted', { variant: 'danger', duration: 0 })
    const region = first.parentElement as HTMLElement
    expect(region.getAttribute('role')).to.equal('region')
    expect(second.parentElement).to.equal(region)
    expect(first.textContent).to.equal('Saved')
    expect(second.variant).to.equal('danger')

    await wait(50) // shown on the next frame
    expect(first.open).to.equal(true)
    first.close()
    await oneEvent(first, 'film-close')
    expect(first.isConnected).to.equal(false)
    second.close()
    await oneEvent(second, 'film-close')
  })
})
