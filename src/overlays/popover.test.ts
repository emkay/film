import { fixture, html, expect } from '@open-wc/testing'
import { sendMouse, resetMouse } from '@web/test-runner-commands'
import './popover.js'
import './dropdown.js'
import '../navigation/menu.js'
import '../navigation/menu-item.js'
import type { Popover } from './popover.js'
import type { Dropdown } from './dropdown.js'

const panelOpen = (el: HTMLElement): boolean =>
  (el.shadowRoot?.querySelector('.panel') as HTMLElement).matches(':popover-open')

async function popover (trigger = 'click'): Promise<{ el: Popover, button: HTMLButtonElement }> {
  const el = await fixture<Popover>(html`<film-popover trigger=${trigger}><button slot="trigger">Info</button><p>Details</p></film-popover>`)
  return { el, button: el.querySelector('button') as HTMLButtonElement }
}

describe('film-popover', () => {
  it('tells assistive tech its trigger opens a dialog', async () => {
    const { button } = await popover()
    expect(button.getAttribute('aria-haspopup')).to.equal('dialog')
    expect(button.getAttribute('aria-expanded')).to.equal('false')
  })

  it('toggles from its trigger', async () => {
    const { el, button } = await popover()
    button.click()
    await el.updateComplete
    expect(panelOpen(el)).to.equal(true)
    expect(button.getAttribute('aria-expanded')).to.equal('true')
    button.click()
    await el.updateComplete
    expect(panelOpen(el)).to.equal(false)
  })

  it('opens on hover with trigger="hover", not on click', async () => {
    const { el, button } = await popover('hover')
    button.click()
    await el.updateComplete
    expect(panelOpen(el)).to.equal(false)

    // A real pointer: mouseenter doesn't bubble, so a synthetic one dispatched
    // on the button would never reach the slot's listener anyway.
    const box = button.getBoundingClientRect()
    await sendMouse({ type: 'move', position: [Math.round(box.x + 4), Math.round(box.y + 4)] })
    await el.updateComplete
    expect(panelOpen(el), 'opens on hover').to.equal(true)
    await sendMouse({ type: 'move', position: [0, window.innerHeight - 1] })
    await el.updateComplete
    expect(panelOpen(el), 'closes on leave').to.equal(false)
    await resetMouse()
  })

  it('leaves opening to code with trigger="manual"', async () => {
    const { el, button } = await popover('manual')
    button.click()
    await el.updateComplete
    expect(panelOpen(el)).to.equal(false)
    el.show()
    await el.updateComplete
    expect(panelOpen(el)).to.equal(true)
  })

  it('syncs `open` when the browser dismisses it', async () => {
    const { el } = await popover()
    el.show()
    await el.updateComplete
    ;(el.shadowRoot?.querySelector('.panel') as HTMLElement).hidePopover()
    await new Promise((resolve) => setTimeout(resolve, 50)) // toggle fires async
    await el.updateComplete
    expect(el.open).to.equal(false)
  })
})

describe('film-dropdown', () => {
  async function dropdown (): Promise<{ el: Dropdown, button: HTMLButtonElement }> {
    const el = await fixture<Dropdown>(html`
      <film-dropdown>
        <button slot="trigger">Actions</button>
        <film-menu><film-menu-item>Rename</film-menu-item><film-menu-item>Delete</film-menu-item></film-menu>
      </film-dropdown>
    `)
    return { el, button: el.querySelector('button') as HTMLButtonElement }
  }

  it('tells assistive tech its trigger opens a menu', async () => {
    const { button } = await dropdown()
    expect(button.getAttribute('aria-haspopup')).to.equal('menu')
    expect(button.getAttribute('aria-expanded')).to.equal('false')
  })

  it('opens from its trigger and focuses the first item', async () => {
    const { el, button } = await dropdown()
    button.click()
    await el.updateComplete
    expect(panelOpen(el)).to.equal(true)
    expect(document.activeElement?.textContent?.trim()).to.equal('Rename')
  })
})
