import { fixture, html, expect } from '@open-wc/testing'
import './slider.js'
import type { Slider } from './slider.js'

describe('film-slider', () => {
  it('exposes both thumb values', async () => {
    const el = await fixture<Slider>(html`<film-slider value-min="20" value-max="80"></film-slider>`)
    expect(el.valueMin).to.equal(20)
    expect(el.valueMax).to.equal(80)
    expect(el.shadowRoot?.querySelectorAll('input[type="range"]').length).to.equal(2)
  })

  it('keeps the min thumb from crossing the max', async () => {
    const el = await fixture<Slider>(html`<film-slider value-min="20" value-max="50"></film-slider>`)
    const minInput = el.shadowRoot?.querySelector('input[type="range"]') as HTMLInputElement
    minInput.value = '70'
    minInput.dispatchEvent(new Event('input'))
    await el.updateComplete
    expect(el.valueMin).to.equal(50)
  })
})
