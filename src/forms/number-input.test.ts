import { fixture, html, expect } from '@open-wc/testing'
import './number-input.js'
import type { NumberInput } from './number-input.js'

const stepButtons = (el: NumberInput): HTMLButtonElement[] =>
  Array.from(el.shadowRoot?.querySelectorAll('button') ?? [])

describe('film-number-input', () => {
  it('increments and decrements by step', async () => {
    const el = await fixture<NumberInput>(html`<film-number-input value="3" step="2"></film-number-input>`)
    const [minus, plus] = stepButtons(el)
    plus.click()
    expect(el.value).to.equal(5)
    minus.click()
    expect(el.value).to.equal(3)
  })

  it('clamps to min/max and disables the buttons at the bounds', async () => {
    const el = await fixture<NumberInput>(html`<film-number-input value="10" min="0" max="10"></film-number-input>`)
    const [, plus] = stepButtons(el)
    expect(plus.disabled).to.equal(true)
    plus.click()
    expect(el.value).to.equal(10)
  })

  it('submits its value in a form', async () => {
    const el = await fixture<NumberInput>(html`<film-number-input name="qty" value="7"></film-number-input>`)
    const form = document.createElement('form')
    document.body.appendChild(form)
    form.appendChild(el)
    await el.updateComplete
    expect(new FormData(form).get('qty')).to.equal('7')
    form.remove()
  })

  it('treats a cleared field as missing when required', async () => {
    const el = await fixture<NumberInput>(html`<film-number-input required value="3"></film-number-input>`)
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.value = ''
    input.dispatchEvent(new Event('input'))
    await el.updateComplete
    expect(el.checkValidity()).to.equal(false)
    expect(el.validity.valueMissing).to.equal(true)
  })

  it('submits nothing for a cleared field', async () => {
    const form = document.createElement('form')
    const el = document.createElement('film-number-input') as NumberInput
    el.name = 'qty'
    el.value = 4
    form.append(el)
    document.body.append(form)
    await el.updateComplete
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.value = ''
    input.dispatchEvent(new Event('input'))
    await el.updateComplete
    // No number at all — previously the stale value, or 0 once re-rendered.
    expect(new FormData(form).get('qty') ?? '').to.equal('')
    form.remove()
  })
})
