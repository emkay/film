import { fixture, html, expect } from '@open-wc/testing'
import './split-panel.js'
import type { SplitPanel } from './split-panel.js'

const pointer = (target: Element, type: string, init: PointerEventInit = {}): void => {
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, button: 0, pointerId: 1, ...init }))
}

async function panel (): Promise<{ el: SplitPanel, divider: HTMLElement }> {
  const el = await fixture<SplitPanel>(html`
    <film-split-panel style="inline-size: 400px; block-size: 100px">
      <div slot="start">start</div>
      <div slot="end">end</div>
    </film-split-panel>
  `)
  return { el, divider: el.shadowRoot?.querySelector('.divider') as HTMLElement }
}

describe('film-split-panel', () => {
  it('moves the divider when dragged', async () => {
    const { el, divider } = await panel()
    const left = el.getBoundingClientRect().left
    pointer(divider, 'pointerdown', { clientX: left + 200 })
    pointer(divider, 'pointermove', { clientX: left + 300 })
    pointer(divider, 'pointerup', { clientX: left + 300 })
    expect(el.position).to.be.closeTo(75, 1)
  })

  it('does not drag with a non-primary button', async () => {
    const { el, divider } = await panel()
    const left = el.getBoundingClientRect().left
    pointer(divider, 'pointerdown', { button: 2, clientX: left + 200 })
    pointer(divider, 'pointermove', { clientX: left + 300 })
    expect(el.position).to.equal(50)
  })

  it('stops dragging when the gesture is cancelled', async () => {
    const { el, divider } = await panel()
    const left = el.getBoundingClientRect().left
    pointer(divider, 'pointerdown', { clientX: left + 200 })
    pointer(divider, 'pointercancel')
    pointer(divider, 'pointermove', { clientX: left + 300 })
    expect(el.position).to.equal(50)
  })

  it('still steps with the keyboard', async () => {
    const { el, divider } = await panel()
    divider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    expect(el.position).to.equal(52)
  })
})
