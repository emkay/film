import { expect } from '@open-wc/testing'
import '../forms/select.js'
import '../forms/select-option.js'
import '../navigation/menu.js'
import '../navigation/menu-item.js'
import '../navigation/tree.js'
import '../navigation/tree-item.js'
import type { Select } from '../forms/select.js'
import type { LitElement } from 'lit'

// These components are usually rendered inside an app's own shadow root, where
// document.activeElement is the app's host rather than the focused option.
const hosts: HTMLElement[] = []

async function inShadowRoot (markup: string): Promise<ShadowRoot> {
  const host = document.createElement('div')
  const root = host.attachShadow({ mode: 'open' })
  root.innerHTML = markup
  document.body.append(host)
  hosts.push(host)
  await Promise.all(
    Array.from(root.querySelectorAll('*'))
      .filter((el): el is LitElement => 'updateComplete' in el)
      .map((el) => el.updateComplete)
  )
  return root
}

const key = (target: Element, name: string): void => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, composed: true, cancelable: true }))
}

// Compare by label: when an element assertion fails, chai tries to print a diff
// of two live Lit elements, whose graphs are large and circular, and the tab dies.
const focusedLabel = (root: ShadowRoot): string => root.activeElement?.textContent?.trim() ?? '(nothing)'

afterEach(() => {
  for (const host of hosts.splice(0)) host.remove()
})

describe('keyboard navigation inside a shadow root', () => {
  it('film-select selects the focused option with Enter', async () => {
    const root = await inShadowRoot(`
      <film-select>
        <film-select-option value="a">A</film-select-option>
        <film-select-option value="b">B</film-select-option>
      </film-select>
    `)
    const select = root.querySelector('film-select') as Select
    select.open = true
    await select.updateComplete
    const [, b] = Array.from(root.querySelectorAll('film-select-option')) as HTMLElement[]
    b.focus()
    expect(focusedLabel(root)).to.equal('B')

    key(select.shadowRoot?.querySelector('.listbox') as HTMLElement, 'Enter')
    expect(select.value).to.equal('b')
  })

  it('film-select moves from the focused option with ArrowDown', async () => {
    const root = await inShadowRoot(`
      <film-select>
        <film-select-option value="a">A</film-select-option>
        <film-select-option value="b">B</film-select-option>
        <film-select-option value="c">C</film-select-option>
      </film-select>
    `)
    const select = root.querySelector('film-select') as Select
    select.open = true
    await select.updateComplete
    const [, b] = Array.from(root.querySelectorAll('film-select-option')) as HTMLElement[]
    b.focus()
    key(select.shadowRoot?.querySelector('.listbox') as HTMLElement, 'ArrowDown')
    expect(focusedLabel(root)).to.equal('C')
  })

  it('film-menu moves from the focused item', async () => {
    const root = await inShadowRoot(`
      <film-menu>
        <film-menu-item>One</film-menu-item>
        <film-menu-item>Two</film-menu-item>
        <film-menu-item>Three</film-menu-item>
      </film-menu>
    `)
    const [, two] = Array.from(root.querySelectorAll('film-menu-item')) as HTMLElement[]
    two.focus()
    key(two, 'ArrowDown')
    expect(focusedLabel(root)).to.equal('Three')
  })

  it('film-tree moves from the focused item', async () => {
    const root = await inShadowRoot(`
      <film-tree>
        <film-tree-item>One</film-tree-item>
        <film-tree-item>Two</film-tree-item>
      </film-tree>
    `)
    const [one] = Array.from(root.querySelectorAll('film-tree-item')) as HTMLElement[]
    one.focus()
    key(one, 'ArrowDown')
    expect(focusedLabel(root)).to.equal('Two')
  })
})
