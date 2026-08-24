import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import { MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT, type Window } from './window.js'

export interface WindowLayout {
  x: number
  y: number
  width: number
  height: number
}

/** A snap target: an edge/corner region, or full-area maximise. */
type SnapZone = 'w' | 'e' | 'nw' | 'ne' | 'sw' | 'se' | 'max'

/** How close (px) the pointer must be to an edge to trigger a snap. */
const SNAP_EDGE = 32
/** How far (px) along an edge counts as a corner rather than a half. */
const SNAP_CORNER = 96

/**
 * Workspace — the container for {@link Window}s. Owns what a lone window can't:
 * z-order, focus and layout. In `floating` layout, clicking a window raises it
 * and makes it active, and dragging one to an edge snaps it to a half or
 * quarter (disable with `no-snap`); in `tiled` layout, windows fill the area
 * and are pinned — either a uniform `grid` or a recursive `bsp` split.
 *
 * @slot - The `film-window` children.
 * @fires film-workspace-layout - When the arrangement changes. `detail.windows` is the layout, for persistence.
 */
@customElement('film-workspace')
export class Workspace extends FilmElement {
  /** Layout mode. */
  @property({ type: String, reflect: true }) layout: 'floating' | 'tiled' = 'floating'

  /** Tiling algorithm when `layout="tiled"`. */
  @property({ type: String, reflect: true }) tiling: 'grid' | 'bsp' = 'grid'

  /** Gap between windows, in pixels (tiling and snapping). */
  @property({ type: Number }) gap = 0

  /** Disable drag-to-snap in floating layout. */
  @property({ type: Boolean, attribute: 'no-snap', reflect: true }) noSnap = false

  @state() private preview: WindowLayout | null = null

  private z = 0
  private resizeObserver?: ResizeObserver
  private dragging: Window | null = null
  private pendingSnap: SnapZone | null = null
  /** Workspace rect, cached at drag start so pointermove doesn't force a reflow. */
  private dragRect: DOMRect | null = null
  /** Per-window movable/resizable saved before pinning, restored on untile. */
  private readonly pinned = new WeakMap<Window, { movable: boolean, resizable: boolean }>()

  static styles = css`
    :host {
      position: relative;
      display: block;
      overflow: hidden;
    }

    .snap-preview {
      position: absolute;
      z-index: 9999;
      box-sizing: border-box;
      pointer-events: none;
      border-radius: var(--film-radius);
      border: var(--border-thick) solid var(--film-color-primary);
      background-color: color-mix(in oklch, var(--film-color-primary) 22%, transparent);
      transition: inset var(--film-duration-fast) var(--film-ease),
        inline-size var(--film-duration-fast) var(--film-ease),
        block-size var(--film-duration-fast) var(--film-ease);
    }
  `

  /** The child windows, in DOM order. */
  get windows (): Window[] {
    return Array.from(this.querySelectorAll(':scope > film-window')) as Window[]
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.addEventListener('film-window-focus', this.onFocus)
    this.addEventListener('film-window-move', this.emitLayout)
    this.addEventListener('film-window-resize', this.emitLayout)
    this.addEventListener('film-window-movestart', this.onMoveStart)
    this.addEventListener('film-window-moveend', this.onMoveEnd)
    this.addEventListener('pointermove', this.onPointerMove)
    this.resizeObserver = new ResizeObserver(() => {
      if (this.layout === 'tiled') this.tile()
    })
    this.resizeObserver.observe(this)
  }

  disconnectedCallback (): void {
    this.resizeObserver?.disconnect()
    super.disconnectedCallback()
  }

  firstUpdated (): void {
    this.applyLayout()
    // Raise the last window initially.
    const last = this.windows.at(-1)
    if (last) this.raise(last)
  }

  updated (changed: PropertyValues<this>): void {
    super.updated(changed)
    if (changed.has('layout') || changed.has('tiling')) this.applyLayout()
  }

  /** The current arrangement, suitable for persisting and restoring. */
  getLayout (): WindowLayout[] {
    return this.windows.map((w) => ({ x: w.x, y: w.y, width: w.width, height: w.height }))
  }

  private readonly onFocus = (event: Event): void => {
    const win = (event.target as Element).closest('film-window') as Window | null
    if (win) this.raise(win)
  }

  private raise (win: Window): void {
    win.style.zIndex = String((this.z += 1))
    for (const other of this.windows) other.active = other === win
  }

  private readonly emitLayout = (): void => {
    this.dispatchEvent(
      new CustomEvent('film-workspace-layout', { detail: { windows: this.getLayout() }, bubbles: true })
    )
  }

  // --- Drag-to-snap ---------------------------------------------------------

  private snappingEnabled (): boolean {
    return this.layout === 'floating' && !this.noSnap
  }

  private readonly onMoveStart = (event: Event): void => {
    if (!this.snappingEnabled()) return
    this.dragging = (event.target as Element).closest('film-window') as Window | null
    this.pendingSnap = null
    this.dragRect = this.getBoundingClientRect()
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (!this.dragging || !this.dragRect) return
    const rect = this.dragRect
    const px = event.clientX - rect.left
    const py = event.clientY - rect.top
    this.pendingSnap = this.zoneFor(px, py, rect.width, rect.height)
    this.preview = this.pendingSnap ? this.rectFor(this.pendingSnap) : null
  }

  private readonly onMoveEnd = (): void => {
    const win = this.dragging
    const zone = this.pendingSnap
    this.dragging = null
    this.pendingSnap = null
    this.preview = null
    this.dragRect = null
    if (!win || !zone) return
    if (zone === 'max') {
      // Reuse the real maximise mechanism (stores restore geometry, hides
      // handles) rather than just filling the area.
      if (!win.maximised) win.toggleMaximise()
    } else {
      const r = this.rectFor(zone)
      win.x = r.x
      win.y = r.y
      win.width = r.width
      win.height = r.height
    }
    this.emitLayout()
  }

  private zoneFor (px: number, py: number, w: number, h: number): SnapZone | null {
    if (px <= SNAP_EDGE) return py <= SNAP_CORNER ? 'nw' : py >= h - SNAP_CORNER ? 'sw' : 'w'
    if (px >= w - SNAP_EDGE) return py <= SNAP_CORNER ? 'ne' : py >= h - SNAP_CORNER ? 'se' : 'e'
    if (py <= SNAP_EDGE) return 'max'
    return null
  }

  private rectFor (zone: SnapZone): WindowLayout {
    const g = this.gap
    const W = this.clientWidth
    const H = this.clientHeight
    const halfW = (W - g) / 2
    const halfH = (H - g) / 2
    const rightX = halfW + g
    const botY = halfH + g
    let raw: WindowLayout
    switch (zone) {
      case 'w': raw = { x: 0, y: 0, width: halfW, height: H }; break
      case 'e': raw = { x: rightX, y: 0, width: halfW, height: H }; break
      case 'nw': raw = { x: 0, y: 0, width: halfW, height: halfH }; break
      case 'ne': raw = { x: rightX, y: 0, width: halfW, height: halfH }; break
      case 'sw': raw = { x: 0, y: botY, width: halfW, height: halfH }; break
      case 'se': raw = { x: rightX, y: botY, width: halfW, height: halfH }; break
      case 'max': raw = { x: 0, y: 0, width: W, height: H }; break
    }
    // Honour the window's minimum size, so snapping in a small workspace can't
    // produce a sub-minimum window.
    return {
      x: raw.x,
      y: raw.y,
      width: Math.max(MIN_WINDOW_WIDTH, raw.width),
      height: Math.max(MIN_WINDOW_HEIGHT, raw.height)
    }
  }

  // --- Tiling ---------------------------------------------------------------

  private applyLayout (): void {
    if (this.layout === 'tiled') this.tile()
    else this.untile()
  }

  private untile (): void {
    for (const win of this.windows) {
      const saved = this.pinned.get(win)
      if (saved) {
        win.movable = saved.movable
        win.resizable = saved.resizable
        this.pinned.delete(win)
      }
    }
  }

  private tile (): void {
    const wins = this.windows
    if (wins.length === 0) return
    for (const win of wins) {
      if (!this.pinned.has(win)) this.pinned.set(win, { movable: win.movable, resizable: win.resizable })
      win.maximised = false
      win.minimised = false
      win.movable = false
      win.resizable = false
    }
    if (this.tiling === 'bsp') {
      const g = this.gap
      this.splitBsp(
        wins,
        { x: g, y: g, width: this.clientWidth - g * 2, height: this.clientHeight - g * 2 },
        this.clientWidth >= this.clientHeight
      )
    } else {
      this.layoutGrid(wins)
    }
    this.emitLayout()
  }

  private layoutGrid (wins: Window[]): void {
    const cols = Math.ceil(Math.sqrt(wins.length))
    const rows = Math.ceil(wins.length / cols)
    const gap = this.gap
    const cellW = (this.clientWidth - gap * (cols + 1)) / cols
    const cellH = (this.clientHeight - gap * (rows + 1)) / rows

    wins.forEach((win, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      win.x = gap + col * (cellW + gap)
      win.y = gap + row * (cellH + gap)
      win.width = cellW
      win.height = cellH
    })
  }

  /**
   * Recursive binary split: the first window takes half the area, the rest
   * recurse into the other half with the orientation flipped — a spiral tiling
   * where each new window subdivides the previous region.
   */
  private splitBsp (wins: Window[], rect: WindowLayout, horizontal: boolean): void {
    const [first, ...rest] = wins
    if (!first) return
    if (rest.length === 0) {
      first.x = rect.x
      first.y = rect.y
      first.width = rect.width
      first.height = rect.height
      return
    }
    const g = this.gap
    if (horizontal) {
      const halfW = (rect.width - g) / 2
      first.x = rect.x
      first.y = rect.y
      first.width = halfW
      first.height = rect.height
      this.splitBsp(rest, { x: rect.x + halfW + g, y: rect.y, width: rect.width - halfW - g, height: rect.height }, false)
    } else {
      const halfH = (rect.height - g) / 2
      first.x = rect.x
      first.y = rect.y
      first.width = rect.width
      first.height = halfH
      this.splitBsp(rest, { x: rect.x, y: rect.y + halfH + g, width: rect.width, height: rect.height - halfH - g }, true)
    }
  }

  private readonly onSlotChange = (): void => {
    if (this.layout === 'tiled') this.tile()
  }

  render () {
    return html`
      <slot @slotchange=${this.onSlotChange}></slot>
      ${this.preview
        ? html`<div
            class="snap-preview"
            style="inset-inline-start:${this.preview.x}px;inset-block-start:${this.preview.y}px;inline-size:${this.preview.width}px;block-size:${this.preview.height}px"
          ></div>`
        : nothing}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-workspace': Workspace
  }
}
