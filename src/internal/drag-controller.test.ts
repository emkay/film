import { fixture, html, expect } from '@open-wc/testing'
import { LitElement } from 'lit'
import { DragController } from './drag-controller.js'

class DragHost extends LitElement {
  moves: Array<[number, number]> = []
  ended = 0
  drag = new DragController(this, {
    onDrag: (dx, dy) => this.moves.push([dx, dy]),
    onEnd: () => { this.ended += 1 }
  })

  render () {
    return html`<div
      class="handle"
      @pointerdown=${this.drag.onPointerDown}
      @pointermove=${this.drag.onPointerMove}
      @pointerup=${this.drag.onPointerUp}
    ></div>`
  }
}
customElements.define('test-drag-host', DragHost)

const pointer = (target: Element, type: string, init: PointerEventInit = {}): void => {
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, button: 0, pointerId: 1, ...init }))
}

describe('DragController', () => {
  it('ends the drag on pointercancel', async () => {
    const el = await fixture<DragHost>(html`<test-drag-host></test-drag-host>`)
    const handle = el.shadowRoot?.querySelector('.handle') as HTMLElement
    pointer(handle, 'pointerdown', { clientX: 0 })
    pointer(handle, 'pointercancel')
    pointer(handle, 'pointermove', { clientX: 50 })

    expect(el.moves, 'kept dragging after the gesture was cancelled').to.deep.equal([])
    expect(el.ended).to.equal(1)
  })

  it('ignores non-primary buttons', async () => {
    const el = await fixture<DragHost>(html`<test-drag-host></test-drag-host>`)
    const handle = el.shadowRoot?.querySelector('.handle') as HTMLElement
    pointer(handle, 'pointerdown', { button: 2 })
    pointer(handle, 'pointermove', { clientX: 50 })
    expect(el.moves).to.deep.equal([])
  })
})
