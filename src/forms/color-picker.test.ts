import { fixture, html, expect } from '@open-wc/testing'
import './color-picker.js'
import type { ColorPicker } from './color-picker.js'

const typeHex = async (el: ColorPicker, text: string): Promise<void> => {
  const hex = el.shadowRoot?.querySelector('#hex') as HTMLInputElement
  hex.value = text
  hex.dispatchEvent(new Event('change'))
  await el.updateComplete
}

describe('film-color-picker', () => {
  it('flags an invalid hex entry', async () => {
    const el = await fixture<ColorPicker>(html`<film-color-picker value="#000000"></film-color-picker>`)
    await typeHex(el, 'zzz')
    expect(el.checkValidity()).to.equal(false)
  })

  it('becomes valid again when the previous value is re-entered', async () => {
    const el = await fixture<ColorPicker>(html`<film-color-picker value="#000000"></film-color-picker>`)
    await typeHex(el, 'zzz')
    await typeHex(el, '#000000')
    expect(el.checkValidity()).to.equal(true)
  })
})
