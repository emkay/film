import { fixture, html, expect } from '@open-wc/testing'
import './input.js'
import '../actions/button.js'
import type { Input } from './input.js'

describe('film-input', () => {
  it('forwards autocomplete to the inner input', async () => {
    const el = await fixture<Input>(
      html`<film-input type="password" autocomplete="current-password"></film-input>`
    )
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    expect(input.getAttribute('autocomplete')).to.equal('current-password')
  })

  it('omits the autocomplete attribute when unset', async () => {
    const el = await fixture<Input>(html`<film-input></film-input>`)
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    expect(input.hasAttribute('autocomplete')).to.equal(false)
  })

  it('submits its native form on Enter', async () => {
    const form = document.createElement('form')
    const el = document.createElement('film-input') as Input
    el.name = 'q'
    form.append(el)
    document.body.append(form)
    await el.updateComplete

    let submitted = 0
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      submitted += 1
    })
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(submitted).to.equal(1)

    form.remove()
  })

  it('ignores other keys', async () => {
    const form = document.createElement('form')
    const el = document.createElement('film-input') as Input
    form.append(el)
    document.body.append(form)
    await el.updateComplete

    let submitted = 0
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      submitted += 1
    })
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }))
    expect(submitted).to.equal(0)

    form.remove()
  })

  it('accepts type="date" and forwards min / max', async () => {
    const el = await fixture<Input>(
      html`<film-input type="date" min="2020-01-01" max="2026-12-31"></film-input>`
    )
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    // A browser that didn't understand the type would fall back to "text".
    expect(input.type).to.equal('date')
    expect(input.min).to.equal('2020-01-01')
    expect(input.max).to.equal('2026-12-31')
  })

  it('omits min / max / step when unset', async () => {
    const el = await fixture<Input>(html`<film-input type="date"></film-input>`)
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    for (const name of ['min', 'max', 'step']) {
      expect(input.hasAttribute(name), name).to.equal(false)
    }
  })

  it('reports a date outside min / max as invalid on the host', async () => {
    const el = await fixture<Input>(
      html`<film-input type="date" min="2020-01-01" max="2026-12-31"></film-input>`
    )
    el.value = '2019-06-01'
    await el.updateComplete
    expect(el.checkValidity()).to.equal(false)
    // The flags must survive the copy into ElementInternals, not just `valid`.
    expect(el.validity.rangeUnderflow).to.equal(true)
    expect(el.validationMessage).to.not.equal('')

    el.value = '2027-06-01'
    await el.updateComplete
    expect(el.validity.rangeOverflow).to.equal(true)

    el.value = '2020-06-01'
    await el.updateComplete
    expect(el.checkValidity()).to.equal(true)
  })

  it('blocks submitting a native form with an out-of-range date', async () => {
    const form = document.createElement('form')
    const el = document.createElement('film-input') as Input
    el.type = 'date'
    el.name = 'as-at'
    el.min = '2020-01-01'
    el.value = '2019-01-01'
    form.append(el)
    document.body.append(form)
    await el.updateComplete

    expect(form.checkValidity()).to.equal(false)
    form.remove()
  })

  it('still reports a missing required value', async () => {
    const el = await fixture<Input>(html`<film-input required></film-input>`)
    expect(el.checkValidity()).to.equal(false)
    expect(el.validity.valueMissing).to.equal(true)
    el.value = 'x'
    await el.updateComplete
    expect(el.checkValidity()).to.equal(true)
  })
})
