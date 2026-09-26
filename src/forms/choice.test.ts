import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import './select.js'
import './select-option.js'
import './radio-group.js'
import './radio.js'
import type { Select } from './select.js'
import type { RadioGroup } from './radio-group.js'

const key = (target: Element, name: string): void => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, composed: true, cancelable: true }))
}

describe('film-select', () => {
  async function select (attrs = ''): Promise<Select> {
    const el = await fixture<Select>(html`
      <film-select placeholder="Pick a fruit" ?required=${attrs.includes('required')}>
        <film-select-option value="a">Apple</film-select-option>
        <film-select-option value="b">Banana</film-select-option>
        <film-select-option value="c" disabled>Cherry</film-select-option>
      </film-select>
    `)
    return el
  }
  const trigger = (el: Select): HTMLButtonElement => el.shadowRoot?.querySelector('.trigger') as HTMLButtonElement
  const shown = (el: Select): string | undefined => trigger(el).querySelector('span')?.textContent?.trim()
  const listbox = (el: Select): HTMLElement => el.shadowRoot?.querySelector('.listbox') as HTMLElement

  it('shows the placeholder until something is chosen', async () => {
    const el = await select()
    expect(shown(el)).to.equal('Pick a fruit')
  })

  it('opens from its trigger with the listbox shown', async () => {
    const el = await select()
    trigger(el).click()
    await el.updateComplete
    expect(el.open).to.equal(true)
    expect(listbox(el).matches(':popover-open')).to.equal(true)
  })

  it('chooses an option: value, label, change event, closes', async () => {
    const el = await select()
    trigger(el).click()
    await el.updateComplete
    const banana = el.querySelectorAll('film-select-option')[1] as HTMLElement
    setTimeout(() => banana.click())
    await oneEvent(el, 'change')
    await el.updateComplete
    expect(el.value).to.equal('b')
    expect(shown(el)).to.equal('Banana')
    expect(el.open).to.equal(false)
  })

  it('ignores a disabled option', async () => {
    const el = await select()
    trigger(el).click()
    await el.updateComplete
    ;(el.querySelectorAll('film-select-option')[2] as HTMLElement).click()
    await el.updateComplete
    expect(el.value).to.equal('')
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const el = await select()
    trigger(el).click()
    await el.updateComplete
    key(listbox(el), 'Escape')
    await el.updateComplete
    expect(el.open).to.equal(false)
    expect(el.shadowRoot?.activeElement).to.equal(trigger(el))
  })

  it('opens from the keyboard', async () => {
    const el = await select()
    key(trigger(el), 'ArrowDown')
    await el.updateComplete
    expect(el.open).to.equal(true)
  })

  it('fails `required` until chosen', async () => {
    const el = await select('required')
    expect(el.checkValidity()).to.equal(false)
    el.value = 'a'
    await el.updateComplete
    expect(el.checkValidity()).to.equal(true)
  })
})

describe('film-radio-group', () => {
  async function group (): Promise<RadioGroup> {
    return fixture<RadioGroup>(html`
      <film-radio-group label="Size" value="s">
        <film-radio value="s">Small</film-radio>
        <film-radio value="m" disabled>Medium</film-radio>
        <film-radio value="l">Large</film-radio>
      </film-radio-group>
    `)
  }
  const radios = (el: RadioGroup): Array<HTMLElement & { checked: boolean }> =>
    Array.from(el.querySelectorAll('film-radio'))

  it('is a labelled radiogroup with the value checked', async () => {
    const el = await group()
    expect(el.getAttribute('role')).to.equal('radiogroup')
    expect(el.getAttribute('aria-label')).to.equal('Size')
    expect(radios(el).map((r) => r.checked)).to.deep.equal([true, false, false])
  })

  it('selects on click and fires change', async () => {
    const el = await group()
    setTimeout(() => radios(el)[2].click())
    await oneEvent(el, 'change')
    expect(el.value).to.equal('l')
    expect(radios(el).map((r) => r.checked)).to.deep.equal([false, false, true])
  })

  it('moves with arrow keys, skipping disabled radios and wrapping', async () => {
    const el = await group()
    key(radios(el)[0], 'ArrowDown')
    expect(el.value).to.equal('l')
    key(radios(el)[2], 'ArrowDown')
    expect(el.value).to.equal('s')
    key(radios(el)[0], 'ArrowUp')
    expect(el.value).to.equal('l')
  })

  it('ignores clicks on a disabled radio', async () => {
    const el = await group()
    radios(el)[1].click()
    expect(el.value).to.equal('s')
  })
})
