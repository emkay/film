import { fixture, html, expect, oneEvent, aTimeout } from '@open-wc/testing'
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

  it('fires film-window-moveend with the committed geometry', async () => {
    const el = await fixture<Window>(html`<film-window x="10" y="10" width="200" height="150">body</film-window>`)
    await el.updateComplete
    const titlebar = el.shadowRoot?.querySelector('.titlebar') as HTMLElement
    titlebar.dispatchEvent(new PointerEvent('pointerdown', { button: 0, clientX: 0, clientY: 0, pointerId: 1, bubbles: true }))
    titlebar.dispatchEvent(new PointerEvent('pointermove', { clientX: 20, clientY: 15, pointerId: 1, bubbles: true }))
    const settled = oneEvent(el, 'film-window-moveend')
    titlebar.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1, bubbles: true }))
    const event = await settled
    expect(event.detail).to.have.all.keys('x', 'y', 'width', 'height')
    expect(event.detail.width).to.equal(200)
    expect(event.detail.height).to.equal(150)
  })

  it('focuses slotted content on raise when focus-content is set', async () => {
    const el = await fixture<Window>(
      html`<film-window focus-content title="T"><button id="inner">Go</button></film-window>`
    )
    await el.updateComplete
    const frame = el.shadowRoot?.querySelector('.frame') as HTMLElement
    frame.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await aTimeout(20)
    expect(document.activeElement).to.equal(el.querySelector('#inner'))
  })

  it('does not steal focus from titlebar chrome when focus-content is set', async () => {
    const el = await fixture<Window>(
      html`<film-window focus-content title="T"><button id="inner">Go</button></film-window>`
    )
    await el.updateComplete
    const closeBtn = Array.from(el.shadowRoot?.querySelectorAll('button') ?? []).find(
      (b) => b.getAttribute('aria-label') === 'Close'
    ) as HTMLButtonElement
    closeBtn.focus()
    await aTimeout(20)
    // Focus stays on the chrome button; content-focus must not hijack it.
    expect(el.shadowRoot?.activeElement).to.equal(closeBtn)
  })

  it('does not move focus on raise without focus-content', async () => {
    const el = await fixture<Window>(
      html`<film-window title="T"><button id="inner">Go</button></film-window>`
    )
    await el.updateComplete
    const before = document.activeElement
    const frame = el.shadowRoot?.querySelector('.frame') as HTMLElement
    frame.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await aTimeout(20)
    expect(document.activeElement).to.equal(before)
    expect(document.activeElement).to.not.equal(el.querySelector('#inner'))
  })

  it('does not start a move drag from a title-bar button', async () => {
    const el = await fixture<Window>(html`<film-window title="T">body</film-window>`)
    await el.updateComplete
    let started = false
    el.addEventListener('film-window-movestart', () => { started = true })
    const closeBtn = Array.from(el.shadowRoot?.querySelectorAll('button') ?? []).find(
      (b) => b.getAttribute('aria-label') === 'Close'
    ) as HTMLButtonElement
    const event = new PointerEvent('pointerdown', { button: 0, pointerId: 1, bubbles: true, composed: true, cancelable: true })
    closeBtn.dispatchEvent(event)
    expect(started).to.equal(false)
    // The drag also mustn't preventDefault, or the button never takes focus.
    expect(event.defaultPrevented).to.equal(false)
  })

  it('does not start a move drag from a slotted actions control', async () => {
    const el = await fixture<Window>(
      html`<film-window title="T"><span slot="actions"><button id="extra">?</button></span>body</film-window>`
    )
    await el.updateComplete
    let started = false
    el.addEventListener('film-window-movestart', () => { started = true })
    const extra = el.querySelector('#extra') as HTMLButtonElement
    extra.dispatchEvent(new PointerEvent('pointerdown', { button: 0, pointerId: 1, bubbles: true, composed: true }))
    expect(started).to.equal(false)
  })

  it('still starts a move drag from the title bar itself', async () => {
    const el = await fixture<Window>(html`<film-window title="T">body</film-window>`)
    await el.updateComplete
    let started = false
    el.addEventListener('film-window-movestart', () => { started = true })
    const titlebar = el.shadowRoot?.querySelector('.titlebar') as HTMLElement
    titlebar.dispatchEvent(new PointerEvent('pointerdown', { button: 0, pointerId: 1, bubbles: true }))
    expect(started).to.equal(true)
  })

  it('does not keyboard-move the window from a title-bar button', async () => {
    const el = await fixture<Window>(html`<film-window title="T" x="40" y="40">body</film-window>`)
    await el.updateComplete
    const closeBtn = Array.from(el.shadowRoot?.querySelectorAll('button') ?? []).find(
      (b) => b.getAttribute('aria-label') === 'Close'
    ) as HTMLButtonElement
    closeBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, composed: true }))
    await el.updateComplete
    expect(el.x).to.equal(40)
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
