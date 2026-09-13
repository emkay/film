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

  const header = (el: Calendar): string =>
    el.shadowRoot?.querySelector('.month')?.textContent?.trim() ?? ''

  const nav = (el: Calendar, label: string): HTMLButtonElement =>
    el.shadowRoot?.querySelector(`.nav[aria-label="${label}"]`) as HTMLButtonElement

  it('steps a whole year from the header', async () => {
    const el = await fixture<Calendar>(html`<film-calendar value="2026-08-21"></film-calendar>`)
    expect(header(el)).to.equal('August 2026')

    nav(el, 'Previous year').click()
    await el.updateComplete
    expect(header(el)).to.equal('August 2025')

    nav(el, 'Next year').click()
    nav(el, 'Next year').click()
    await el.updateComplete
    expect(header(el)).to.equal('August 2027')
  })

  it('reaches a date years back in a handful of clicks', async () => {
    const el = await fixture<Calendar>(html`<film-calendar value="2026-03-10"></film-calendar>`)
    let clicks = 0
    while (header(el) !== 'January 2020') {
      const back = header(el).endsWith('2020') ? 'Previous month' : 'Previous year'
      nav(el, back).click()
      await el.updateComplete
      clicks += 1
      expect(clicks, 'should not need month-by-month navigation').to.be.lessThan(20)
    }
    // Six year steps plus two month steps, against ~74 before.
    expect(clicks).to.equal(8)
  })

  it('changes year with shift+PageUp / PageDown', async () => {
    const el = await fixture<Calendar>(html`<film-calendar value="2026-08-21"></film-calendar>`)
    const grid = el.shadowRoot?.querySelector('.grid') as HTMLElement

    grid.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', shiftKey: true, bubbles: true }))
    await el.updateComplete
    expect(header(el)).to.equal('August 2025')

    grid.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }))
    await el.updateComplete
    expect(header(el)).to.equal('September 2025')
  })

  it('clamps a year step to min instead of overshooting into a disabled month', async () => {
    const el = await fixture<Calendar>(
      html`<film-calendar value="2026-03-10" min="2025-06-15"></film-calendar>`
    )
    nav(el, 'Previous year').click()
    await el.updateComplete
    expect(header(el)).to.equal('June 2025')

    // Nothing further back is reachable, so both back buttons are spent.
    expect(nav(el, 'Previous year').disabled).to.equal(true)
    expect(nav(el, 'Previous month').disabled).to.equal(true)
    expect(nav(el, 'Next year').disabled).to.equal(false)
  })

  it('clamps a year step to max', async () => {
    const el = await fixture<Calendar>(
      html`<film-calendar value="2026-03-10" max="2026-09-04"></film-calendar>`
    )
    nav(el, 'Next year').click()
    await el.updateComplete
    expect(header(el)).to.equal('September 2026')
    expect(nav(el, 'Next year').disabled).to.equal(true)
  })
})
