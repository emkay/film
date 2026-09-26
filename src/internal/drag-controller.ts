import type { ReactiveController, ReactiveControllerHost } from 'lit'

export interface DragCallbacks {
  /** Called on pointer-down, before dragging — snapshot your base values here. */
  onStart?: () => void
  /** Cumulative pointer delta since drag start (drift-free; re-derive from base). */
  onDrag?: (dx: number, dy: number) => void
  /** A single keyboard step (apply incrementally to the current value). */
  onStep?: (dx: number, dy: number) => void
  /** Called on pointer-up. */
  onEnd?: () => void
  /**
   * Offer a way to do the same without dragging (WCAG 2.5.7): a click on the
   * handle arms it, and the next click anywhere places it there — reported
   * through onStart/onDrag/onEnd exactly like a drag to that point. Escape or a
   * second click on the handle cancels. Off by default: only handles whose
   * clicks do nothing else should opt in.
   */
  tapToPlace?: boolean
  /** Called when tap-to-place arms or disarms, so the host can show it. */
  onArm?: (armed: boolean) => void
}

/** Movement under this many pixels between press and release is a click. */
const CLICK_SLOP = 3

/**
 * DragController — the shared pointer + keyboard drag mechanics used by
 * draggable/resizable UI (windows, resize handles, dividers): pointer capture,
 * drift-free cumulative deltas, and arrow-key stepping. A cancelled gesture
 * (pointercancel — a touch taken over by scrolling, say) ends the drag like a
 * release; the controller listens for it itself. Spread its handlers onto a
 * handle element:
 *
 *     <div
 *       @pointerdown=${drag.onPointerDown}
 *       @pointermove=${drag.onPointerMove}
 *       @pointerup=${drag.onPointerUp}
 *       @keydown=${drag.onKeydown}
 *     ></div>
 */
export class DragController implements ReactiveController {
  /** Pixels moved per arrow-key press. */
  step: number

  private readonly callbacks: DragCallbacks
  private startX = 0
  private startY = 0
  private pointerId: number | null = null
  private target: HTMLElement | null = null
  private active = false
  private moved = false

  /** Where the arming click landed, while tap-to-place is armed. */
  private armedAt: { x: number, y: number, handle: HTMLElement } | null = null

  constructor (host: ReactiveControllerHost, callbacks: DragCallbacks, step = 8) {
    host.addController(this)
    this.callbacks = callbacks
    this.step = step
  }

  hostDisconnected (): void {
    this.active = false
    this.pointerId = null
    this.detach()
    this.disarm()
  }

  /** Whether tap-to-place is waiting for the click that places the handle. */
  get armed (): boolean {
    return this.armedAt !== null
  }

  private arm (x: number, y: number, handle: HTMLElement): void {
    this.armedAt = { x, y, handle }
    // Capture phase on the document: the placing click is seen before anything
    // on the page acts on it, so it can be kept from doing anything else.
    document.addEventListener('pointerdown', this.onPlace, true)
    document.addEventListener('keydown', this.onArmedKeydown, true)
    this.callbacks.onArm?.(true)
  }

  private disarm (): void {
    if (!this.armedAt) return
    this.armedAt = null
    document.removeEventListener('pointerdown', this.onPlace, true)
    document.removeEventListener('keydown', this.onArmedKeydown, true)
    this.callbacks.onArm?.(false)
  }

  private readonly onPlace = (event: PointerEvent): void => {
    const armed = this.armedAt
    if (!armed) return
    // The placing click belongs to us, not to whatever it lands on.
    event.preventDefault()
    event.stopPropagation()
    document.addEventListener('click', swallow, { capture: true, once: true })
    this.disarm()
    // A second click on the handle, or a non-primary button, cancels.
    if (event.button !== 0 || event.composedPath().includes(armed.handle)) return
    this.callbacks.onStart?.()
    this.callbacks.onDrag?.(event.clientX - armed.x, event.clientY - armed.y)
    this.callbacks.onEnd?.()
  }

  private readonly onArmedKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return
    event.preventDefault()
    event.stopPropagation()
    this.disarm()
  }

  /** Remove the listeners a drag adds beyond the handle's own bindings. */
  private detach (): void {
    this.target?.removeEventListener('pointercancel', this.onPointerUp)
    window.removeEventListener('pointerup', this.onPointerUp)
    this.target = null
  }

  readonly onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) return
    this.active = true
    this.moved = false
    this.startX = event.clientX
    this.startY = event.clientY
    this.pointerId = event.pointerId
    this.target = event.currentTarget as HTMLElement
    // Without this a cancelled touch leaves the drag active, and every later
    // pointermove over the handle keeps moving whatever it drags.
    this.target.addEventListener('pointercancel', this.onPointerUp)
    // Best-effort: capture keeps events flowing if the pointer leaves the handle,
    // but can throw for a stale/synthetic pointer id — degrade gracefully.
    let captured = false
    try {
      this.target.setPointerCapture(event.pointerId)
      captured = true
    } catch {
      /* fall through to the window fallback below */
    }
    // Without capture the handle's pointerup may never fire (pointer released off
    // it), which would strand the drag — end it from a window-level pointerup instead.
    if (!captured) window.addEventListener('pointerup', this.onPointerUp, { once: true })
    this.callbacks.onStart?.()
    event.preventDefault()
  }

  readonly onPointerMove = (event: PointerEvent): void => {
    if (!this.active) return
    const dx = event.clientX - this.startX
    const dy = event.clientY - this.startY
    if (Math.abs(dx) > CLICK_SLOP || Math.abs(dy) > CLICK_SLOP) this.moved = true
    this.callbacks.onDrag?.(event.clientX - this.startX, event.clientY - this.startY)
  }

  readonly onPointerUp = (event: PointerEvent): void => {
    if (!this.active) return
    this.active = false
    if (this.pointerId != null && this.target?.hasPointerCapture(this.pointerId)) {
      this.target.releasePointerCapture(this.pointerId)
    }
    this.pointerId = null
    // The handle pressed — not event.currentTarget, which is the window when
    // the release arrives through the capture-failure fallback.
    const handle = this.target
    this.detach()
    this.callbacks.onEnd?.()
    // A press and release with no drag between is a click: arm tap-to-place.
    if (this.callbacks.tapToPlace && !this.moved && event.type === 'pointerup' && handle) {
      this.arm(this.startX, this.startY, handle)
    }
  }

  readonly onKeydown = (event: KeyboardEvent): void => {
    let dx = 0
    let dy = 0
    switch (event.key) {
      case 'ArrowLeft': dx = -this.step; break
      case 'ArrowRight': dx = this.step; break
      case 'ArrowUp': dy = -this.step; break
      case 'ArrowDown': dy = this.step; break
      default: return
    }
    event.preventDefault()
    this.callbacks.onStep?.(dx, dy)
  }
}

/** Stop the one click that placed a tap-to-place handle from doing anything else. */
function swallow (event: Event): void {
  event.preventDefault()
  event.stopPropagation()
}
