import { fixture, html, expect } from '@open-wc/testing'
import './form.js'
import './input.js'
import './number-input.js'
import './date-picker.js'
import './combobox.js'
import './search.js'
import './file-input.js'
import './select-option.js'
import type { Form } from './form.js'

describe('film-form', () => {
  it('collects values from every Film form control', async () => {
    const el = await fixture<Form>(html`
      <film-form>
        <film-input name="text" value="t"></film-input>
        <film-number-input name="qty" value="4"></film-number-input>
        <film-date-picker name="when" value="2026-01-02"></film-date-picker>
        <film-search name="q" value="find"></film-search>
      </film-form>
    `)
    const values = el.getValues()
    expect(values).to.include.keys('text', 'qty', 'when', 'q')
    expect(values.when).to.equal('2026-01-02')
  })

  it('validates controls it previously skipped', async () => {
    const el = await fixture<Form>(html`
      <film-form>
        <film-date-picker name="when" required></film-date-picker>
      </film-form>
    `)
    let submitted = false
    el.addEventListener('film-submit', () => { submitted = true })
    el.submit()
    expect(submitted).to.equal(false)
  })

  it('resets controls it previously skipped', async () => {
    const el = await fixture<Form>(html`
      <film-form>
        <film-number-input name="qty" value="4"></film-number-input>
      </film-form>
    `)
    const qty = el.querySelector('film-number-input') as HTMLElement & { value: number }
    qty.value = 9
    el.reset()
    expect(qty.value).to.equal(4)
  })
})
