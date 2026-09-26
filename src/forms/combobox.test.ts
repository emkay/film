import { fixture, html, expect } from '@open-wc/testing'
import './combobox.js'
import './select-option.js'
import type { Combobox } from './combobox.js'

const listbox = (el: Combobox): HTMLElement => el.shadowRoot?.querySelector('.listbox') as HTMLElement

async function openCombobox (): Promise<Combobox> {
  const el = await fixture<Combobox>(html`
    <film-combobox>
      <film-select-option value="a">Apple</film-select-option>
      <film-select-option value="b">Banana</film-select-option>
    </film-combobox>
  `)
  el.open = true
  await el.updateComplete
  return el
}

describe('film-combobox', () => {
  it('stays closed after an option is chosen', async () => {
    const el = await openCombobox()
    const banana = el.querySelectorAll('film-select-option')[1] as HTMLElement
    banana.focus()
    banana.click()
    await el.updateComplete
    await el.updateComplete

    expect(el.value).to.equal('b')
    expect(el.open).to.equal(false)
    expect(listbox(el).matches(':popover-open')).to.equal(false)
  })

  it('stays closed after Escape from an option', async () => {
    const el = await openCombobox()
    const apple = el.querySelector('film-select-option') as HTMLElement
    apple.focus()
    listbox(el).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await el.updateComplete
    await el.updateComplete
    expect(el.open).to.equal(false)
  })

  describe('value set from code', () => {
    const field = (el: Combobox): HTMLInputElement =>
      el.shadowRoot?.querySelector('input') as HTMLInputElement

    async function combobox (): Promise<Combobox> {
      return fixture<Combobox>(html`
        <film-combobox value="a">
          <film-select-option value="a">Apple</film-select-option>
          <film-select-option value="b">Banana</film-select-option>
        </film-combobox>
      `)
    }

    it('shows the initial value\'s label', async () => {
      const el = await combobox()
      expect(field(el).value).to.equal('Apple')
    })

    it('shows the new label when value is set', async () => {
      const el = await combobox()
      el.value = 'b'
      await el.updateComplete
      expect(field(el).value).to.equal('Banana')
    })

    it('marks the matching option selected', async () => {
      const el = await combobox()
      el.value = 'b'
      await el.updateComplete
      const [apple, banana] = Array.from(el.querySelectorAll('film-select-option')) as Array<HTMLElement & { selected: boolean }>
      expect([apple.selected, banana.selected]).to.deep.equal([false, true])
    })

    it('clears the field when value is cleared', async () => {
      const el = await combobox()
      el.value = ''
      await el.updateComplete
      expect(field(el).value).to.equal('')
    })

    it('does not overwrite what the user is typing', async () => {
      const el = await combobox()
      const input = field(el)
      input.value = 'Ban'
      input.dispatchEvent(new Event('input'))
      await el.updateComplete
      expect(input.value).to.equal('Ban')
    })
  })
})
