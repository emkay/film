import { fixture, html, expect } from '@open-wc/testing'
import './tabs.js'
import './tab.js'
import './tab-panel.js'
import '../forms/input.js'
import type { Tabs } from './tabs.js'
import type { TabPanel } from './tab-panel.js'

const panel = (el: Tabs, name: string): TabPanel =>
  el.querySelector(`film-tab-panel[name="${name}"]`) as TabPanel

describe('film-tabs', () => {
  it('leaves arrow keys alone inside a panel', async () => {
    const el = await fixture<Tabs>(html`
      <film-tabs>
        <film-tab slot="nav" panel="a">A</film-tab>
        <film-tab slot="nav" panel="b">B</film-tab>
        <film-tab-panel name="a"><film-input></film-input></film-tab-panel>
        <film-tab-panel name="b">B</film-tab-panel>
      </film-tabs>
    `)
    const input = el.querySelector('film-input')?.shadowRoot?.querySelector('input') as HTMLInputElement
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      composed: true,
      cancelable: true
    })
    input.dispatchEvent(event)
    await el.updateComplete

    expect(event.defaultPrevented, 'text cursor movement was cancelled').to.equal(false)
    expect(el.active).to.equal('a')
  })

  it('still moves between tabs with arrow keys on the tab list', async () => {
    const el = await fixture<Tabs>(html`
      <film-tabs>
        <film-tab slot="nav" panel="a">A</film-tab>
        <film-tab slot="nav" panel="b">B</film-tab>
        <film-tab-panel name="a">A</film-tab-panel>
        <film-tab-panel name="b">B</film-tab-panel>
      </film-tabs>
    `)
    const tab = el.querySelector('film-tab') as HTMLElement
    tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await el.updateComplete
    expect(el.active).to.equal('b')
  })

  it('does not react to a nested film-tabs', async () => {
    const el = await fixture<Tabs>(html`
      <film-tabs>
        <film-tab slot="nav" panel="outer-a">Outer A</film-tab>
        <film-tab slot="nav" panel="outer-b">Outer B</film-tab>
        <film-tab-panel name="outer-a">
          <film-tabs id="inner">
            <film-tab slot="nav" panel="inner-a">Inner A</film-tab>
            <film-tab slot="nav" panel="inner-b">Inner B</film-tab>
            <film-tab-panel name="inner-a">IA</film-tab-panel>
            <film-tab-panel name="inner-b">IB</film-tab-panel>
          </film-tabs>
        </film-tab-panel>
        <film-tab-panel name="outer-b">OB</film-tab-panel>
      </film-tabs>
    `)
    const inner = el.querySelector('#inner') as Tabs
    await inner.updateComplete
    ;(inner.querySelector('film-tab[panel="inner-b"]') as HTMLElement).click()
    await el.updateComplete

    expect(inner.active).to.equal('inner-b')
    expect(el.active).to.equal('outer-a')
    expect(panel(el, 'outer-a').active).to.equal(true)
  })

  it('applies `active` set from code', async () => {
    const el = await fixture<Tabs>(html`
      <film-tabs>
        <film-tab slot="nav" panel="a">A</film-tab>
        <film-tab slot="nav" panel="b">B</film-tab>
        <film-tab-panel name="a">A</film-tab-panel>
        <film-tab-panel name="b">B</film-tab-panel>
      </film-tabs>
    `)
    el.active = 'b'
    await el.updateComplete
    expect(panel(el, 'b').active).to.equal(true)
    expect(panel(el, 'a').active).to.equal(false)
    expect((el.querySelector('film-tab[panel="b"]') as HTMLElement).tabIndex).to.equal(0)
  })
})
