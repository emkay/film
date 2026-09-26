import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './search.js'
import './textarea.js'
import './date-picker.js'
import type { Search } from './search.js'
import type { Textarea } from './textarea.js'
import type { DatePicker } from './date-picker.js'

describe('film-search', () => {
  const field = (el: Search): HTMLInputElement => el.shadowRoot?.querySelector('input') as HTMLInputElement

  it('fires film-search with the query on Enter', async () => {
    const el = await fixture<Search>(html`<film-search value="lit"></film-search>`)
    setTimeout(() => field(el).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })))
    const event = await oneEvent(el, 'film-search')
    expect(event.detail.value).to.equal('lit')
  })

  it('offers a clear button only when there is a query', async () => {
    const el = await fixture<Search>(html`<film-search></film-search>`)
    expect(el.shadowRoot?.querySelector('.clear')).to.equal(null)
    el.value = 'lit'
    await el.updateComplete
    expect(el.shadowRoot?.querySelector('.clear')).to.exist
  })

  it('clears, refocuses and fires film-search with an empty query', async () => {
    const el = await fixture<Search>(html`<film-search value="lit"></film-search>`)
    setTimeout(() => (el.shadowRoot?.querySelector('.clear') as HTMLButtonElement).click())
    const event = await oneEvent(el, 'film-search')
    await el.updateComplete
    expect(event.detail.value).to.equal('')
    expect(el.value).to.equal('')
    expect(el.shadowRoot?.activeElement).to.equal(field(el))
  })
})

describe('film-textarea', () => {
  const box = (el: Textarea): HTMLTextAreaElement => el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement

  it('keeps its value in step with typing', async () => {
    const el = await fixture<Textarea>(html`<film-textarea></film-textarea>`)
    box(el).value = 'hello'
    box(el).dispatchEvent(new Event('input'))
    expect(el.value).to.equal('hello')
  })

  it('grows with its content when auto-grow is set', async () => {
    const el = await fixture<Textarea>(html`<film-textarea auto-grow rows="2"></film-textarea>`)
    const before = box(el).offsetHeight
    el.value = 'line\n'.repeat(12)
    await el.updateComplete
    expect(box(el).offsetHeight).to.be.greaterThan(before)
  })

  it('stays put without auto-grow', async () => {
    const el = await fixture<Textarea>(html`<film-textarea rows="2"></film-textarea>`)
    const before = box(el).offsetHeight
    el.value = 'line\n'.repeat(12)
    await el.updateComplete
    expect(box(el).offsetHeight).to.equal(before)
  })
})

describe('film-date-picker', () => {
  const trigger = (el: DatePicker): HTMLButtonElement => el.shadowRoot?.querySelector('.trigger') as HTMLButtonElement

  it('shows the placeholder, then the chosen date formatted', async () => {
    const el = await fixture<DatePicker>(html`<film-date-picker></film-date-picker>`)
    expect(trigger(el).textContent?.trim()).to.equal('Select a date')
    el.value = '2026-01-02'
    await el.updateComplete
    const expected = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(2026, 0, 2))
    expect(trigger(el).textContent?.trim()).to.equal(expected)
  })

  it('opens its calendar, takes a chosen day, closes and fires change', async () => {
    const el = await fixture<DatePicker>(html`<film-date-picker value="2026-01-02"></film-date-picker>`)
    trigger(el).click()
    await el.updateComplete
    expect(trigger(el).getAttribute('aria-expanded')).to.equal('true')

    const calendar = el.shadowRoot?.querySelector('film-calendar') as HTMLElement & { updateComplete: Promise<boolean> }
    await calendar.updateComplete
    const day = calendar.shadowRoot?.querySelector('.day[data-date="2026-01-15"]') as HTMLButtonElement
    setTimeout(() => day.click())
    await oneEvent(el, 'change')
    await el.updateComplete
    expect(el.value).to.equal('2026-01-15')
    expect(el.open).to.equal(false)
  })

  it('passes min / max to its calendar', async () => {
    const el = await fixture<DatePicker>(html`<film-date-picker min="2026-01-10" max="2026-01-20"></film-date-picker>`)
    const calendar = el.shadowRoot?.querySelector('film-calendar') as HTMLElement & { min: string, max: string }
    expect([calendar.min, calendar.max]).to.deep.equal(['2026-01-10', '2026-01-20'])
  })
})
