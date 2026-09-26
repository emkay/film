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
  // composed, as real pointer events are: they cross shadow boundaries.
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, composed: true, button: 0, pointerId: 1, ...init }))
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

// WCAG 2.5.7: anything done by dragging needs a single-pointer alternative.
class TapHost extends LitElement {
  moves: Array<[number, number]> = []
  armed: boolean[] = []
  drag = new DragController(this, {
    tapToPlace: true,
    onArm: (armed) => this.armed.push(armed),
    onDrag: (dx, dy) => this.moves.push([dx, dy])
  })

  render () {
    return html`<div class="handle" style="inline-size: 20px; block-size: 20px"
      @pointerdown=${this.drag.onPointerDown}
      @pointermove=${this.drag.onPointerMove}
      @pointerup=${this.drag.onPointerUp}
    ></div><button class="other">Other</button>`
  }
}
customElements.define('test-tap-host', TapHost)

describe('DragController tap-to-place', () => {
  const tap = (target: Element, x: number, y: number): void => {
    pointer(target, 'pointerdown', { clientX: x, clientY: y })
    pointer(target, 'pointerup', { clientX: x, clientY: y })
  }
  async function host (): Promise<{ el: TapHost, handle: HTMLElement, other: HTMLElement }> {
    const el = await fixture<TapHost>(html`<test-tap-host></test-tap-host>`)
    return {
      el,
      handle: el.shadowRoot?.querySelector('.handle') as HTMLElement,
      other: el.shadowRoot?.querySelector('.other') as HTMLElement
    }
  }

  it('arms on a click, then moves to the next click', async () => {
    const { el, handle, other } = await host()
    tap(handle, 10, 10)
    expect(el.armed).to.deep.equal([true])
    pointer(other, 'pointerdown', { clientX: 60, clientY: 30 })
    expect(el.moves.at(-1)).to.deep.equal([50, 20])
    expect(el.armed).to.deep.equal([true, false])
  })

  it('swallows the placing click, so it activates nothing underneath', async () => {
    const { handle, other } = await host()
    let clicked = 0
    other.addEventListener('click', () => { clicked += 1 })
    tap(handle, 10, 10)
    pointer(other, 'pointerdown', { clientX: 60, clientY: 30 })
    other.click()
    expect(clicked).to.equal(0)
    other.click()
    expect(clicked, 'only the one placing click is swallowed').to.equal(1)
  })

  it('cancels with Escape', async () => {
    const { el, handle, other } = await host()
    tap(handle, 10, 10)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    pointer(other, 'pointerdown', { clientX: 60, clientY: 30 })
    expect(el.moves).to.deep.equal([])
    expect(el.armed).to.deep.equal([true, false])
  })

  it('cancels with a second click on the handle', async () => {
    const { el, handle } = await host()
    tap(handle, 10, 10)
    tap(handle, 10, 10)
    expect(el.armed).to.deep.equal([true, false])
  })

  it('does not arm after a real drag', async () => {
    const { el, handle } = await host()
    pointer(handle, 'pointerdown', { clientX: 10, clientY: 10 })
    pointer(handle, 'pointermove', { clientX: 40, clientY: 10 })
    pointer(handle, 'pointerup', { clientX: 40, clientY: 10 })
    expect(el.armed).to.deep.equal([])
  })

  it('stays off unless asked for', async () => {
    const el = await fixture<DragHost>(html`<test-drag-host></test-drag-host>`)
    const handle = el.shadowRoot?.querySelector('.handle') as HTMLElement
    tap(handle, 10, 10)
    pointer(document.body, 'pointerdown', { clientX: 60, clientY: 30 })
    expect(el.moves).to.deep.equal([])
  })
})
