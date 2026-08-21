import { fixture, html, expect } from '@open-wc/testing'
import './checkbox.js'
import type { Checkbox } from './checkbox.js'

describe('film-checkbox', () => {
  it('has the checkbox role and is focusable', async () => {
    const el = await fixture<Checkbox>(html`<film-checkbox>Agree</film-checkbox>`)
    expect(el.getAttribute('role')).to.equal('checkbox')
    expect(el.tabIndex).to.equal(0)
  })

  it('toggles on click and reflects aria-checked', async () => {
    const el = await fixture<Checkbox>(html`<film-checkbox>Agree</film-checkbox>`)
    expect(el.checked).to.equal(false)
    el.click()
    await el.updateComplete
    expect(el.checked).to.equal(true)
    expect(el.getAttribute('aria-checked')).to.equal('true')
  })

  it('participates in a native form', async () => {
    const el = await fixture<Checkbox>(html`<film-checkbox name="agree" checked></film-checkbox>`)
    const form = document.createElement('form')
    document.body.appendChild(form)
    form.appendChild(el)
    await el.updateComplete
    expect(new FormData(form).get('agree')).to.equal('on')
    form.remove()
  })
})
