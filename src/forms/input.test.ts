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
})
