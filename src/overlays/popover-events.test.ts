import { fixture, html, expect } from '@open-wc/testing'
import './dropdown.js'
import './popover.js'
import '../actions/button.js'
import '../layout/box.js'
import type { LitElement } from 'lit'

type Toggleable = LitElement & { open: boolean }

// Counts open/close events from the moment the element is created, so events
// fired during its first render are caught too.
async function mount (tag: 'film-dropdown' | 'film-popover'): Promise<{ el: Toggleable, events: string[] }> {
  const events: string[] = []
  const record = (event: Event): void => { events.push(event.type) }
  const el = document.createElement(tag) as Toggleable
  el.addEventListener('film-open', record)
  el.addEventListener('film-close', record)
  el.innerHTML = '<film-button slot="trigger">Open</film-button><div>content</div>'
  const wrapper = await fixture<HTMLElement>(html`<film-box></film-box>`)
  wrapper.append(el)
  await el.updateComplete
  return { el, events }
}

for (const tag of ['film-dropdown', 'film-popover'] as const) {
  describe(`${tag} open / close events`, () => {
    it('fires nothing on first render', async () => {
      const { events } = await mount(tag)
      expect(events).to.deep.equal([])
    })

    it('fires film-open then film-close for one open and close', async () => {
      const { el, events } = await mount(tag)
      el.open = true
      await el.updateComplete
      el.open = false
      await el.updateComplete
      expect(events).to.deep.equal(['film-open', 'film-close'])
    })

    it('leaves no positioning listeners behind after being reopened', async () => {
      const { el } = await mount(tag)
      const added: string[] = []
      const removed: string[] = []
      const origAdd = window.addEventListener
      const origRemove = window.removeEventListener
      window.addEventListener = function (type: string, ...rest: unknown[]) {
        if (type === 'scroll' || type === 'resize') added.push(type)
        return (origAdd as (...a: unknown[]) => void).call(this, type, ...rest)
      } as typeof window.addEventListener
      window.removeEventListener = function (type: string, ...rest: unknown[]) {
        if (type === 'scroll' || type === 'resize') removed.push(type)
        return (origRemove as (...a: unknown[]) => void).call(this, type, ...rest)
      } as typeof window.removeEventListener
      try {
        el.open = true
        await el.updateComplete
        // A redundant re-open, as a stale toggle event or double click produces.
        el.requestUpdate('open', false)
        await el.updateComplete
        el.open = false
        await el.updateComplete
      } finally {
        window.addEventListener = origAdd
        window.removeEventListener = origRemove
      }
      expect(removed.length, 'scroll/resize listeners leaked').to.equal(added.length)
    })
  })
}

describe('film-menu-bar-item open / close events', () => {
  it('fires nothing on first render', async () => {
    await import('../navigation/menu-bar.js')
    await import('../navigation/menu-bar-item.js')
    await import('../navigation/menu.js')
    await import('../navigation/menu-item.js')
    const events: string[] = []
    const bar = document.createElement('film-menu-bar')
    const record = (event: Event): void => { events.push(event.type) }
    bar.addEventListener('film-menubar-open', record)
    bar.addEventListener('film-menubar-close', record)
    bar.innerHTML = '<film-menu-bar-item label="File"><film-menu><film-menu-item>New</film-menu-item></film-menu></film-menu-bar-item>'
    const wrapper = await fixture<HTMLElement>(html`<film-box></film-box>`)
    wrapper.append(bar)
    const item = bar.querySelector('film-menu-bar-item') as LitElement
    await item.updateComplete
    expect(events).to.deep.equal([])
  })
})
