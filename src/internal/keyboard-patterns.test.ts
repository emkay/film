import { fixture, html, expect } from '@open-wc/testing'
import { sendKeys } from '@web/test-runner-commands'
import '../index.js'

// Keyboard behaviour from the ARIA Authoring Practices patterns that the audit
// found missing: Home/End in trees, type-ahead in menus, listboxes and trees,
// the combobox focus model, and tabs linked to their panels.

const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 30))
const focusedText = (root: Document | ShadowRoot = document): string => {
  let el = root.activeElement
  while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement
  const host = el?.closest('film-tree-item, film-menu-item, film-select-option') ?? el
  const own = host?.querySelector(':scope > [slot="label"]')?.textContent
  return (own ?? Array.from(host?.childNodes ?? []).filter((n) => n.nodeType === Node.TEXT_NODE).map((n) => n.textContent).join('')).trim()
}

describe('keyboard: film-tree', () => {
  async function tree (): Promise<HTMLElement> {
    const el = await fixture<HTMLElement>(html`<film-tree>
      <film-tree-item>Apples</film-tree-item>
      <film-tree-item>Bananas</film-tree-item>
      <film-tree-item>Blueberries</film-tree-item>
      <film-tree-item>Cherries</film-tree-item>
    </film-tree>`)
    ;(el.querySelector('film-tree-item') as HTMLElement).focus()
    await settle()
    return el
  }

  it('moves to the last and first items with End and Home', async () => {
    await tree()
    await sendKeys({ press: 'End' })
    expect(focusedText()).to.equal('Cherries')
    await sendKeys({ press: 'Home' })
    expect(focusedText()).to.equal('Apples')
  })

  it('moves to the next item starting with a typed letter', async () => {
    await tree()
    await sendKeys({ press: 'c' })
    expect(focusedText()).to.equal('Cherries')
  })

  it('cycles through items sharing a first letter', async () => {
    await tree()
    await sendKeys({ press: 'b' })
    expect(focusedText()).to.equal('Bananas')
    await sendKeys({ press: 'b' })
    expect(focusedText()).to.equal('Blueberries')
  })

  it('matches a typed prefix', async () => {
    await tree()
    await sendKeys({ type: 'bl' })
    expect(focusedText()).to.equal('Blueberries')
  })
})

describe('keyboard: film-menu type-ahead', () => {
  it('moves to the item starting with a typed letter', async () => {
    const el = await fixture<HTMLElement>(html`<film-menu>
      <film-menu-item>Copy</film-menu-item><film-menu-item>Paste</film-menu-item><film-menu-item>Rename</film-menu-item>
    </film-menu>`)
    ;(el.querySelector('film-menu-item') as HTMLElement).focus()
    await sendKeys({ press: 'r' })
    expect(focusedText()).to.equal('Rename')
  })

  it('skips disabled items', async () => {
    const el = await fixture<HTMLElement>(html`<film-menu>
      <film-menu-item>Copy</film-menu-item><film-menu-item disabled>Paste</film-menu-item><film-menu-item>Print</film-menu-item>
    </film-menu>`)
    ;(el.querySelector('film-menu-item') as HTMLElement).focus()
    await sendKeys({ press: 'p' })
    expect(focusedText()).to.equal('Print')
  })
})

describe('keyboard: film-select type-ahead', () => {
  it('moves to the option starting with a typed letter', async () => {
    const el = await fixture<HTMLElement>(html`<film-select>
      <film-select-option value="a">Apple</film-select-option>
      <film-select-option value="b">Banana</film-select-option>
      <film-select-option value="c">Cherry</film-select-option>
    </film-select>`)
    ;(el.shadowRoot?.querySelector('.trigger') as HTMLElement).focus()
    await sendKeys({ press: 'ArrowDown' })
    await settle()
    await sendKeys({ press: 'c' })
    expect(focusedText()).to.equal('Cherry')
  })
})

describe('keyboard: film-combobox keeps focus in the field', () => {
  // Element identities are compared as booleans: a failing element assertion
  // makes chai serialise live Lit elements, which hangs the browser.
  type Input = HTMLInputElement & { ariaActiveDescendantElement: Element | null }
  async function combobox (): Promise<{ el: HTMLElement & { value: string, open: boolean }, input: Input, options: HTMLElement[] }> {
    const el = await fixture<HTMLElement & { value: string, open: boolean }>(html`<film-combobox label="Fruit">
      <film-select-option value="apple">Apple</film-select-option>
      <film-select-option value="apricot">Apricot</film-select-option>
      <film-select-option value="banana">Banana</film-select-option>
    </film-combobox>`)
    const input = el.shadowRoot?.querySelector('input') as Input
    input.focus()
    await settle()
    return { el, input, options: Array.from(el.querySelectorAll('film-select-option')) }
  }

  it('moves a highlight with the arrow keys while the field keeps focus', async () => {
    const { el, input, options } = await combobox()
    await sendKeys({ press: 'ArrowDown' })
    await settle()
    expect(el.shadowRoot?.activeElement === input, 'the field keeps focus').to.equal(true)
    expect(input.ariaActiveDescendantElement === options[0], 'active descendant is option 0').to.equal(true)
    expect(options[0].hasAttribute('highlighted')).to.equal(true)
    await sendKeys({ press: 'ArrowDown' })
    expect(input.ariaActiveDescendantElement === options[1], 'active descendant is option 1').to.equal(true)
    expect(options[0].hasAttribute('highlighted')).to.equal(false)
  })

  it('keeps filtering as the user types after arrowing', async () => {
    const { el, input } = await combobox()
    await sendKeys({ press: 'ArrowDown' })
    await sendKeys({ type: 'ban' })
    await settle()
    expect(input.value).to.equal('ban')
    expect(el.shadowRoot?.activeElement === input, 'the field keeps focus').to.equal(true)
  })

  it('drops a highlight the filter hides', async () => {
    const { input } = await combobox()
    await sendKeys({ press: 'ArrowDown' }) // Apple
    await sendKeys({ type: 'ban' })
    await settle()
    expect(input.ariaActiveDescendantElement === null, 'no active descendant').to.equal(true)
  })

  it('selects the highlighted option with Enter', async () => {
    const { el, input } = await combobox()
    await sendKeys({ press: 'ArrowDown' })
    await sendKeys({ press: 'ArrowDown' })
    await sendKeys({ press: 'Enter' })
    await settle()
    expect(el.value).to.equal('apricot')
    expect(input.value).to.equal('Apricot')
    expect(el.open).to.equal(false)
    expect(input.ariaActiveDescendantElement === null, 'no active descendant').to.equal(true)
  })

  it('closes on Escape without moving focus', async () => {
    const { el, input } = await combobox()
    await sendKeys({ press: 'ArrowDown' })
    await sendKeys({ press: 'Escape' })
    await settle()
    expect(el.open).to.equal(false)
    expect(el.shadowRoot?.activeElement === input, 'the field keeps focus').to.equal(true)
  })

  it('does not take focus from the field when an option is clicked', async () => {
    const { el, input, options } = await combobox()
    await sendKeys({ press: 'ArrowDown' })
    options[2].dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true, cancelable: true }))
    options[2].click()
    await settle()
    expect(el.value).to.equal('banana')
    expect(el.shadowRoot?.activeElement === input, 'the field keeps focus').to.equal(true)
  })
})

describe('film-tabs links tabs and panels', () => {
  it('names each panel by its tab, and each tab controls its panel', async () => {
    const el = await fixture<HTMLElement>(html`<film-tabs>
      <film-tab slot="nav" panel="general">General</film-tab>
      <film-tab slot="nav" panel="billing">Billing</film-tab>
      <film-tab-panel name="general">G</film-tab-panel>
      <film-tab-panel name="billing">B</film-tab-panel>
    </film-tabs>`)
    await settle()
    for (const name of ['general', 'billing']) {
      const tab = el.querySelector(`film-tab[panel="${name}"]`) as HTMLElement
      const panel = el.querySelector(`film-tab-panel[name="${name}"]`) as HTMLElement
      expect(tab.getAttribute('aria-controls') === panel.id && panel.id !== '', `${name} tab controls its panel`).to.equal(true)
      expect(panel.getAttribute('aria-labelledby') === tab.id && tab.id !== '', `${name} panel is named by its tab`).to.equal(true)
    }
  })

  it('keeps ids the consumer set', async () => {
    const el = await fixture<HTMLElement>(html`<film-tabs>
      <film-tab slot="nav" panel="a" id="my-tab">A</film-tab>
      <film-tab-panel name="a" id="my-panel">A</film-tab-panel>
    </film-tabs>`)
    await settle()
    expect(el.querySelector('film-tab')?.getAttribute('aria-controls')).to.equal('my-panel')
    expect(el.querySelector('film-tab-panel')?.getAttribute('aria-labelledby')).to.equal('my-tab')
  })
})
