import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './calendar.js'
import type { Calendar } from './calendar.js'

describe('film-calendar', () => {
  it('renders a 6-week grid (42 day cells)', async () => {
    const el = await fixture<Calendar>(html`<film-calendar value="2026-08-21"></film-calendar>`)
    expect(el.shadowRoot?.querySelectorAll('.day').length).to.equal(42)
  })

  it('marks the selected date', async () => {
    const el = await fixture<Calendar>(html`<film-calendar value="2026-08-21"></film-calendar>`)
    const selected = el.shadowRoot?.querySelector('.day.selected')
    expect(selected?.textContent?.trim()).to.equal('21')
  })

  it('emits film-change with the chosen date', async () => {
    const el = await fixture<Calendar>(html`<film-calendar value="2026-08-21"></film-calendar>`)
    const day = Array.from(el.shadowRoot?.querySelectorAll('.day') ?? []).find(
      (b) => !b.classList.contains('outside') && b.textContent?.trim() === '15'
    ) as HTMLButtonElement
    setTimeout(() => day.click())
    const event = await oneEvent(el, 'film-change')
    expect(event.detail.value).to.equal('2026-08-15')
  })
})
