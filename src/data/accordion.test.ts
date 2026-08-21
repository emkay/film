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
})
