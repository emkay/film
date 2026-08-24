import { fixture, html, expect, oneEvent, aTimeout } from '@open-wc/testing'
import './menu.js'
import './menu-item.js'
import './menu-bar.js'
import './menu-bar-item.js'
import type { MenuItem } from './menu-item.js'
import type { MenuBar } from './menu-bar.js'
import type { MenuBarItem } from './menu-bar-item.js'

describe('film-menu submenus', () => {
  const menuWithSubmenu = () => html`
    <film-menu>
      <film-menu-item value="new">New</film-menu-item>
      <film-menu-item value="share" id="parent">
        Share
        <film-menu slot="submenu">
          <film-menu-item value="email">Email</film-menu-item>
          <film-menu-item value="link">Copy link</film-menu-item>
        </film-menu>
      </film-menu-item>
    </film-menu>
  `

  it('marks an item with a nested menu as a flyout parent', async () => {
    const menu = await fixture(menuWithSubmenu())
    const parent = menu.querySelector<MenuItem>('#parent')!
    await parent.updateComplete
    await aTimeout(0)
    expect(parent.getAttribute('aria-haspopup')).to.equal('menu')
    expect(parent.getAttribute('aria-expanded')).to.equal('false')
  })

  it('opens the flyout on ArrowRight and closes on ArrowLeft', async () => {
    const menu = await fixture(menuWithSubmenu())
    const parent = menu.querySelector<MenuItem>('#parent')!
    await parent.updateComplete
    await aTimeout(0)

    parent.focus()
    parent.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await parent.updateComplete
    expect(parent.getAttribute('aria-expanded')).to.equal('true')

    parent.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await parent.updateComplete
    expect(parent.getAttribute('aria-expanded')).to.equal('false')
  })

  it('keeps the flyout open when a hover-opened parent is clicked', async () => {
    const menu = await fixture(menuWithSubmenu())
    const parent = menu.querySelector<MenuItem>('#parent')!
    await parent.updateComplete
    await aTimeout(0)
    parent.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }))
    await parent.updateComplete
    expect(parent.getAttribute('aria-expanded')).to.equal('true')

    parent.click()
    await parent.updateComplete
    expect(parent.getAttribute('aria-expanded')).to.equal('true')
  })

  it('bubbles film-select from a nested item and collapses the flyout', async () => {
    const menu = await fixture(menuWithSubmenu())
    const parent = menu.querySelector<MenuItem>('#parent')!
    await parent.updateComplete
    await aTimeout(0)
    parent.openSubmenu()
    await parent.updateComplete
    expect(parent.getAttribute('aria-expanded')).to.equal('true')

    const leaf = parent.querySelector<MenuItem>('film-menu-item[value="email"]')!
    setTimeout(() => leaf.click())
    const event = await oneEvent(menu, 'film-select')
    expect(event.detail.value).to.equal('email')
    await parent.updateComplete
    expect(parent.getAttribute('aria-expanded')).to.equal('false')
  })
})

describe('film-menu-bar', () => {
  const bar = () => html`
    <film-menu-bar>
      <film-menu-bar-item label="File" id="file">
        <film-menu>
          <film-menu-item value="new">New</film-menu-item>
          <film-menu-item value="open">Open</film-menu-item>
        </film-menu>
      </film-menu-bar-item>
      <film-menu-bar-item label="Edit" id="edit">
        <film-menu>
          <film-menu-item value="undo">Undo</film-menu-item>
        </film-menu>
      </film-menu-bar-item>
    </film-menu-bar>
  `

  it('makes only the first trigger tabbable', async () => {
    const el = await fixture<MenuBar>(bar())
    await aTimeout(0)
    const [file, edit] = el.querySelectorAll<MenuBarItem>('film-menu-bar-item')
    expect(file.tabbable).to.equal(true)
    expect(edit.tabbable).to.equal(false)
  })

  it('moves the roving tab stop with ArrowRight', async () => {
    const el = await fixture<MenuBar>(bar())
    await aTimeout(0)
    const [file, edit] = el.querySelectorAll<MenuBarItem>('film-menu-bar-item')
    file.focus()
    file.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await el.updateComplete
    expect(edit.tabbable).to.equal(true)
    expect(file.tabbable).to.equal(false)
  })

  it('opens the adjacent menu when moving while one is open', async () => {
    const el = await fixture<MenuBar>(bar())
    await aTimeout(0)
    const [file, edit] = el.querySelectorAll<MenuBarItem>('film-menu-bar-item')
    file.openMenu()
    await file.updateComplete
    await aTimeout(0)
    expect(file.open).to.equal(true)

    file.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await edit.updateComplete
    await aTimeout(0)
    expect(edit.open).to.equal(true)
  })

  it('opens and focuses the last item on ArrowUp', async () => {
    const el = await fixture<MenuBar>(bar())
    await aTimeout(0)
    const [file] = el.querySelectorAll<MenuBarItem>('film-menu-bar-item')
    file.focus()
    const trigger = file.shadowRoot!.querySelector('.trigger')!
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, composed: true }))
    await file.updateComplete
    await aTimeout(0)
    const items = file.querySelectorAll<MenuItem>('film-menu-item')
    expect(file.open).to.equal(true)
    expect(document.activeElement).to.equal(items[items.length - 1])
  })

  it('moves focus into an already-open menu on ArrowDown', async () => {
    const el = await fixture<MenuBar>(bar())
    await aTimeout(0)
    const [file] = el.querySelectorAll<MenuBarItem>('film-menu-bar-item')
    file.openMenu()
    await file.updateComplete
    await aTimeout(0)
    expect(file.open).to.equal(true)

    const trigger = file.shadowRoot!.querySelector('.trigger')!
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }))
    await aTimeout(0)
    expect(document.activeElement).to.equal(file.querySelector('film-menu-item'))
  })
})
