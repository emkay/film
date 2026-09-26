import { fixture, html, expect } from '@open-wc/testing'
import './field.js'
import './input.js'
import type { Field } from './field.js'
import type { Input } from './input.js'

const error = (el: Field): string | undefined =>
  el.shadowRoot?.querySelector('.error')?.textContent?.trim()
const hint = (el: Field): string | undefined =>
  el.shadowRoot?.querySelector('.hint')?.textContent?.trim()

describe('film-field', () => {
  it('shows a label and hint', async () => {
    const el = await fixture<Field>(html`<film-field label="Email" hint="We never share it"><film-input></film-input></film-field>`)
    expect(el.shadowRoot?.querySelector('label')?.textContent?.trim()).to.equal('Email')
    expect(hint(el)).to.equal('We never share it')
  })

  it('names the slotted control', async () => {
    const el = await fixture<Field>(html`<film-field label="Email"><film-input></film-input></film-field>`)
    expect(el.querySelector('film-input')?.getAttribute('aria-label')).to.equal('Email')
  })

  it('marks a required control', async () => {
    const el = await fixture<Field>(html`<film-field label="Email"><film-input required></film-input></film-field>`)
    expect(el.shadowRoot?.querySelector('.required')).to.exist
  })

  it('tracks `required` changing on the control', async () => {
    const el = await fixture<Field>(html`<film-field label="Email"><film-input></film-input></film-field>`)
    const input = el.querySelector('film-input') as Input
    input.required = true
    await input.updateComplete
    await el.updateComplete
    expect(el.shadowRoot?.querySelector('.required')).to.exist
  })

  it('shows the control\'s own message when it reports invalid, in place of the hint', async () => {
    const el = await fixture<Field>(html`<film-field label="Email" hint="h"><film-input required></film-input></film-field>`)
    const input = el.querySelector('film-input') as Input
    input.reportValidity()
    await el.updateComplete
    expect(error(el)).to.equal(input.validationMessage)
    expect(el.shadowRoot?.querySelector('.error')?.getAttribute('role')).to.equal('alert')
    expect(hint(el)).to.equal(undefined)
  })

  it('clears that message on input', async () => {
    const el = await fixture<Field>(html`<film-field label="Email"><film-input required></film-input></film-field>`)
    const input = el.querySelector('film-input') as Input
    input.reportValidity()
    await el.updateComplete
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await el.updateComplete
    expect(error(el)).to.equal(undefined)
  })

  it('prefers a manual error', async () => {
    const el = await fixture<Field>(html`<film-field label="Email" error="Taken"><film-input></film-input></film-field>`)
    expect(error(el)).to.equal('Taken')
  })
})
