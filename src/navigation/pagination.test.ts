import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './pagination.js'
import type { Pagination } from './pagination.js'

describe('film-pagination', () => {
  it('shows first, last, current and ellipses for a large range', async () => {
    const el = await fixture<Pagination>(html`<film-pagination total="20" page="10"></film-pagination>`)
    const labels = Array.from(el.shadowRoot?.querySelectorAll('button') ?? []).map((b) =>
      b.textContent?.trim()
    )
    expect(labels).to.include('1')
    expect(labels).to.include('20')
    expect(labels).to.include('10')
    expect(el.shadowRoot?.querySelector('.ellipsis')).to.exist
  })

  it('fires film-page-change when a page is chosen', async () => {
    const el = await fixture<Pagination>(html`<film-pagination total="5" page="1"></film-pagination>`)
    const pageTwo = Array.from(el.shadowRoot?.querySelectorAll('button') ?? []).find(
      (b) => b.textContent?.trim() === '2'
    )
    setTimeout(() => pageTwo?.click())
    const event = await oneEvent(el, 'film-page-change')
    expect(event.detail.page).to.equal(2)
  })

  it('disables prev on the first page', async () => {
    const el = await fixture<Pagination>(html`<film-pagination total="5" page="1"></film-pagination>`)
    const prev = el.shadowRoot?.querySelector('button')
    expect(prev?.disabled).to.equal(true)
  })
})
