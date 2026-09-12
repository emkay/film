import { fixture, html, expect } from '@open-wc/testing'
import './drawer.js'
import type { Drawer } from './drawer.js'

describe('film-drawer', () => {
  it('exposes the inherited open / label API', async () => {
    const el = await fixture<Drawer>(html`<film-drawer label="Filters">body</film-drawer>`)
    expect(el.open).to.equal(false)
    expect(el.label).to.equal('Filters')
  })

  it('keeps the dialog inside the viewport despite its padding', async () => {
    const el = await fixture<Drawer>(html`<film-drawer label="Filters">body</film-drawer>`)
    el.show()
    await el.updateComplete
    const dialog = el.shadowRoot?.querySelector('dialog') as HTMLDialogElement
    expect(getComputedStyle(dialog).boxSizing).to.equal('border-box')
    expect(dialog.getBoundingClientRect().height).to.be.at.most(window.innerHeight + 1)
    el.close()
  })

  it('scrolls the body rather than clipping tall content', async () => {
    const el = await fixture<Drawer>(html`
      <film-drawer label="Filters">
        <div style="block-size: 400vh">tall</div>
      </film-drawer>
    `)
    el.show()
    await el.updateComplete
    const body = el.shadowRoot?.querySelector('.body') as HTMLElement
    expect(getComputedStyle(body).overflow).to.equal('auto')
    expect(body.scrollHeight).to.be.greaterThan(body.clientHeight)
    el.close()
  })
})
