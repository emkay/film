import { fixture, html, expect } from '@open-wc/testing'
import './accordion.js'
import './accordion-item.js'
import type { Accordion } from './accordion.js'
import type { AccordionItem } from './accordion-item.js'

const items = (el: Accordion): AccordionItem[] =>
  Array.from(el.querySelectorAll('film-accordion-item'))

describe('film-accordion', () => {
  it('opening one item closes the others by default', async () => {
    const el = await fixture<Accordion>(html`
      <film-accordion>
        <film-accordion-item summary="A" open></film-accordion-item>
        <film-accordion-item summary="B"></film-accordion-item>
      </film-accordion>
    `)
    const [a, b] = items(el)
    b.shadowRoot?.querySelector('button')?.click()
    await b.updateComplete
    expect(b.open).to.equal(true)
    expect(a.open).to.equal(false)
  })

  it('keeps multiple open when `multiple` is set', async () => {
    const el = await fixture<Accordion>(html`
      <film-accordion multiple>
        <film-accordion-item summary="A" open></film-accordion-item>
        <film-accordion-item summary="B"></film-accordion-item>
      </film-accordion>
    `)
    const [a, b] = items(el)
    b.shadowRoot?.querySelector('button')?.click()
    await b.updateComplete
    expect(a.open).to.equal(true)
    expect(b.open).to.equal(true)
  })

  it('ignores film-toggle from content inside an item', async () => {
    const el = await fixture<Accordion>(html`
      <film-accordion>
        <film-accordion-item summary="A" open>
          <div id="inner"></div>
        </film-accordion-item>
        <film-accordion-item summary="B"></film-accordion-item>
      </film-accordion>
    `)
    const [a] = items(el)
    // What a film-details or nested accordion inside the panel sends when opened.
    el.querySelector('#inner')?.dispatchEvent(
      new CustomEvent('film-toggle', { detail: { open: true }, bubbles: true })
    )
    await a.updateComplete
    expect(a.open).to.equal(true)
  })

  it('leaves a nested accordion to manage its own items', async () => {
    const el = await fixture<Accordion>(html`
      <film-accordion>
        <film-accordion-item summary="A" open>
          <film-accordion id="nested">
            <film-accordion-item summary="A1"></film-accordion-item>
          </film-accordion>
        </film-accordion-item>
        <film-accordion-item summary="B"></film-accordion-item>
      </film-accordion>
    `)
    const outerA = items(el)[0]
    const nested = el.querySelector('#nested') as Accordion
    const inner = nested.querySelector('film-accordion-item') as AccordionItem
    await inner.updateComplete
    inner.shadowRoot?.querySelector('button')?.click()
    await inner.updateComplete
    expect(inner.open).to.equal(true)
    expect(outerA.open).to.equal(true)
  })
})
