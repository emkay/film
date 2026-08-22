import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './window.js'
import type { Window } from './window.js'

describe('film-window', () => {
  it('renders a title bar and resize handles', async () => {
    const el = await fixture<Window>(html`<film-window title="Test">body</film-window>`)
    expect(el.shadowRoot?.querySelector('.titlebar')).to.exist
    expect(el.shadowRoot?.querySelectorAll('.handle').length).to.equal(8)
  })

  it('positions itself from x/y/width/height', async () => {
    const el = await fixture<Window>(html`<film-window x="30" y="40" width="200" height="150">body</film-window>`)
    await el.updateComplete
    expect(el.style.insetInlineStart).to.equal('30px')
    expect(el.style.inlineSize).to.equal('200px')
  })

  it('maximise fills the container and restores', async () => {
    const el = await fixture<Window>(html`<film-window width="200" height="150">body</film-window>`)
    el.toggleMaximise()
    await el.updateComplete
    expect(el.maximised).to.equal(true)
    expect(el.width).to.be.greaterThan(200)
    el.toggleMaximise()
    await el.updateComplete
    expect(el.maximised).to.equal(false)
    expect(el.width).to.equal(200)
  })

  it('hides resize handles when maximised', async () => {
    const el = await fixture<Window>(html`<film-window maximised>body</film-window>`)
    await el.updateComplete
    expect(el.shadowRoot?.querySelector('.handle')).to.not.exist
  })

  it('fires film-window-close', async () => {
    const el = await fixture<Window>(html`<film-window>body</film-window>`)
    const closeBtn = Array.from(el.shadowRoot?.querySelectorAll('button') ?? []).find(
      (b) => b.getAttribute('aria-label') === 'Close'
    ) as HTMLButtonElement
    setTimeout(() => closeBtn.click())
    await oneEvent(el, 'film-window-close')
  })
})
