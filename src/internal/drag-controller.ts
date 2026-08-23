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
}

/**
 * DragController — the shared pointer + keyboard drag mechanics used by
 * draggable/resizable UI (windows, resize handles, dividers): pointer capture,
 * drift-free cumulative deltas, and arrow-key stepping. Spread its handlers onto
 * a handle element:
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

  constructor (host: ReactiveControllerHost, callbacks: DragCallbacks, step = 8) {
    host.addController(this)
    this.callbacks = callbacks
    this.step = step
  }

  hostDisconnected (): void {
    this.active = false
    this.pointerId = null
    this.target = null
  }

  readonly onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) return
    this.active = true
    this.startX = event.clientX
    this.startY = event.clientY
    this.pointerId = event.pointerId
    this.target = event.currentTarget as HTMLElement
    // Best-effort: capture keeps events flowing if the pointer leaves the handle,
    // but can throw for a stale/synthetic pointer id — degrade gracefully.
    try {
      this.target.setPointerCapture(event.pointerId)
    } catch {
      /* no capture — dragging still works while the pointer stays over the handle */
    }
    this.callbacks.onStart?.()
    event.preventDefault()
  }

  readonly onPointerMove = (event: PointerEvent): void => {
    if (!this.active) return
    this.callbacks.onDrag?.(event.clientX - this.startX, event.clientY - this.startY)
  }

  readonly onPointerUp = (_event: PointerEvent): void => {
    if (!this.active) return
    this.active = false
    if (this.pointerId != null && this.target?.hasPointerCapture(this.pointerId)) {
      this.target.releasePointerCapture(this.pointerId)
    }
    this.pointerId = null
    this.callbacks.onEnd?.()
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
