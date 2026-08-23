import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import { DragController } from '../internal/drag-controller.js'

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

const DIRECTIONS = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const
const MIN_WIDTH = 160
const MIN_HEIGHT = 100

/**
 * Window — a non-modal, stackable, positioned panel with a title bar, move and
 * resize (pointer + keyboard), and minimise / maximise / close. Unlike
 * `film-dialog`/`film-drawer` it does not use the top layer, so windows can
 * stack, sit side by side and be focused independently. Position/size are
 * reflected so a consumer can persist layout, and movement is constrained to
 * the offset parent (make the container `position: relative`).
 *
 * @slot - The window body.
 * @slot title - Title-bar content (overrides `title`).
 * @slot actions - Extra title-bar controls, before minimise/maximise/close.
 * @fires film-window-movestart - When a pointer move drag begins (for snap previews).
 * @fires film-window-move - `detail` is `{ x, y }`.
 * @fires film-window-moveend - When a pointer move drag ends (the commit point). `detail` is `{ x, y, width, height }`.
 * @fires film-window-resize - `detail` is `{ x, y, width, height }`.
 * @fires film-window-focus - When the window requests focus (for raising). Fires during
 *   `pointerdown`, before the browser resolves click focus — the shadow root's
 *   `delegatesFocus` handles moving focus into the window, so don't call `.focus()` in this handler.
 * @fires film-window-minimise - When minimised state toggles.
 * @fires film-window-maximise - When maximised state toggles.
 * @fires film-window-close - When the close button is activated.
 */
@customElement('film-window')
export class Window extends FilmElement {
  // Delegate focus into the window: a click on any non-focusable part moves the
  // keyboard to the first focusable element inside, so raising and focusing a
  // window happen together without the consumer deferring a `.focus()`.
  static shadowRootOptions: ShadowRootInit = {
    ...FilmElement.shadowRootOptions,
    delegatesFocus: true
  }

  @property({ type: String }) title = ''
  @property({ type: Number, reflect: true }) x = 40
  @property({ type: Number, reflect: true }) y = 40
  @property({ type: Number, reflect: true }) width = 320
  @property({ type: Number, reflect: true }) height = 240
  @property({ type: Boolean, reflect: true }) resizable = true
  @property({ type: Boolean, reflect: true }) movable = true
  @property({ type: Boolean, reflect: true }) minimised = false
  @property({ type: Boolean, reflect: true }) maximised = false
  @property({ type: Boolean, reflect: true }) active = false

  private base: Rect = { x: 0, y: 0, width: 0, height: 0 }
  private resizeDir = 'se'
  private restore?: Rect

  private readonly moveDrag = new DragController(this, {
    onStart: () => {
      this.base = this.rect()
      this.dispatchEvent(new CustomEvent('film-window-movestart', { bubbles: true }))
    },
    onDrag: (dx, dy) => this.setPosition(this.base.x + dx, this.base.y + dy),
    onStep: (dx, dy) => this.setPosition(this.x + dx, this.y + dy),
    onEnd: () =>
      this.dispatchEvent(
        new CustomEvent('film-window-moveend', {
          detail: { x: this.x, y: this.y, width: this.width, height: this.height },
          bubbles: true
        })
      )
  })

  private readonly resizeDrag = new DragController(this, {
    onStart: () => {
      this.base = this.rect()
    },
    onDrag: (dx, dy) => this.applyResize(dx, dy),
    onStep: (dx, dy) => {
      this.base = this.rect()
      this.applyResize(dx, dy)
    }
  })

  static styles = css`
    :host {
      position: absolute;
      display: block;
      box-sizing: border-box;
      /* Contain descendant z-index (e.g. a sticky header inside the window) so
         it can't paint over sibling windows. */
      isolation: isolate;
    }

    :host([minimised]) {
      block-size: auto !important;
    }

    .frame {
      position: relative;
      display: flex;
      flex-direction: column;
      block-size: 100%;
      color: var(--film-color-text);
      background-color: var(--film-color-surface);
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius);
      box-shadow: var(--film-shadow-1);
      overflow: hidden;
    }

    :host([active]) .frame {
      box-shadow: var(--film-shadow-2);
    }

    .titlebar {
      display: flex;
      align-items: center;
      gap: var(--s-1);
      padding: var(--s-3) var(--s-1);
      background-color: var(--film-color-surface);
      border-block-end: var(--border-thin) solid var(--film-color-border);
      user-select: none;
    }

    :host([movable]:not([maximised])) .titlebar {
      cursor: move;
    }

    :host([active]) .titlebar {
      background-color: var(--film-color-info);
    }

    .title {
      flex: 1;
      min-inline-size: 0;
      font-weight: 600;
      font-size: var(--s-1);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: var(--s-3);
    }

    .titlebar button {
      border: none;
      background: none;
      color: inherit;
      cursor: pointer;
      line-height: 1;
      padding: 0 0.3em;
      font: inherit;
    }

    .titlebar button:focus-visible,
    .titlebar:focus-visible {
      outline: var(--border-thin) solid var(--film-color-focus);
    }

    .body {
      flex: 1;
      overflow: auto;
      padding: var(--s0);
    }

    .body[hidden] {
      display: none;
    }

    .handle {
      position: absolute;
    }

    .handle:focus-visible {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: -2px;
    }

    .handle.n { inset-block-start: -3px; inset-inline: 0; block-size: 6px; cursor: ns-resize; }
    .handle.s { inset-block-end: -3px; inset-inline: 0; block-size: 6px; cursor: ns-resize; }
    .handle.e { inset-inline-end: -3px; inset-block: 0; inline-size: 6px; cursor: ew-resize; }
    .handle.w { inset-inline-start: -3px; inset-block: 0; inline-size: 6px; cursor: ew-resize; }
    .handle.ne { inset-block-start: -4px; inset-inline-end: -4px; inline-size: 12px; block-size: 12px; cursor: nesw-resize; }
    .handle.nw { inset-block-start: -4px; inset-inline-start: -4px; inline-size: 12px; block-size: 12px; cursor: nwse-resize; }
    .handle.se { inset-block-end: -4px; inset-inline-end: -4px; inline-size: 12px; block-size: 12px; cursor: nwse-resize; }
    .handle.sw { inset-block-end: -4px; inset-inline-start: -4px; inline-size: 12px; block-size: 12px; cursor: nesw-resize; }
  `

  private rect (): Rect {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  private container (): { w: number, h: number } {
    const parent = this.offsetParent as HTMLElement | null
    return {
      w: parent?.clientWidth ?? window.innerWidth,
      h: parent?.clientHeight ?? window.innerHeight
    }
  }

  private setPosition (x: number, y: number): void {
    const { w, h } = this.container()
    this.x = Math.max(0, Math.min(x, w - this.width))
    this.y = Math.max(0, Math.min(y, h - this.height))
    this.dispatchEvent(new CustomEvent('film-window-move', { detail: { x: this.x, y: this.y }, bubbles: true }))
  }

  private applyResize (dx: number, dy: number): void {
    const b = this.base
    const dir = this.resizeDir
    let width = b.width
    let height = b.height
    let x = b.x
    let y = b.y

    if (dir.includes('e')) width = b.width + dx
    if (dir.includes('w')) width = b.width - dx
    if (dir.includes('s')) height = b.height + dy
    if (dir.includes('n')) height = b.height - dy

    width = Math.max(MIN_WIDTH, width)
    height = Math.max(MIN_HEIGHT, height)
    if (dir.includes('w')) x = b.x + b.width - width
    if (dir.includes('n')) y = b.y + b.height - height

    const { w: cw, h: ch } = this.container()
    if (x < 0) { width += x; x = 0 }
    if (y < 0) { height += y; y = 0 }
    if (x + width > cw) width = cw - x
    if (y + height > ch) height = ch - y

    this.x = x
    this.y = y
    this.width = Math.max(MIN_WIDTH, width)
    this.height = Math.max(MIN_HEIGHT, height)
    this.dispatchEvent(
      new CustomEvent('film-window-resize', {
        detail: { x: this.x, y: this.y, width: this.width, height: this.height },
        bubbles: true
      })
    )
  }

  private readonly requestFocus = (): void => {
    this.active = true
    this.dispatchEvent(new CustomEvent('film-window-focus', { bubbles: true }))
  }

  private readonly onTitlePointerDown = (event: PointerEvent): void => {
    if (this.movable && !this.maximised) this.moveDrag.onPointerDown(event)
  }

  private readonly onTitleKeydown = (event: KeyboardEvent): void => {
    if (this.movable && !this.maximised) this.moveDrag.onKeydown(event)
  }

  private startResize (dir: string, event: PointerEvent): void {
    this.requestFocus()
    this.resizeDir = dir
    this.resizeDrag.onPointerDown(event)
  }

  private resizeKeydown (dir: string, event: KeyboardEvent): void {
    this.resizeDir = dir
    this.resizeDrag.onKeydown(event)
  }

  toggleMinimise (): void {
    this.minimised = !this.minimised
    this.dispatchEvent(new CustomEvent('film-window-minimise', { detail: { minimised: this.minimised }, bubbles: true }))
  }

  toggleMaximise (): void {
    if (this.maximised) {
      this.maximised = false
      if (this.restore) Object.assign(this, this.restore)
    } else {
      this.restore = this.rect()
      const { w, h } = this.container()
      this.maximised = true
      this.x = 0
      this.y = 0
      this.width = w
      this.height = h
    }
    this.dispatchEvent(new CustomEvent('film-window-maximise', { detail: { maximised: this.maximised }, bubbles: true }))
  }

  private close (): void {
    this.dispatchEvent(new CustomEvent('film-window-close', { bubbles: true }))
  }

  updated (changed: PropertyValues): void {
    super.updated(changed)
    this.style.insetInlineStart = `${this.x}px`
    this.style.insetBlockStart = `${this.y}px`
    this.style.inlineSize = `${this.width}px`
    this.style.blockSize = this.minimised ? 'auto' : `${this.height}px`
  }

  render () {
    return html`
      <div class="frame" @pointerdown=${this.requestFocus} @focusin=${this.requestFocus}>
        <div
          class="titlebar"
          tabindex=${this.movable ? '0' : nothing}
          @pointerdown=${this.onTitlePointerDown}
          @pointermove=${this.moveDrag.onPointerMove}
          @pointerup=${this.moveDrag.onPointerUp}
          @keydown=${this.onTitleKeydown}
          @dblclick=${this.toggleMaximise}
        >
          <span class="title"><slot name="title">${this.title}</slot></span>
          <span class="actions">
            <slot name="actions"></slot>
            <button aria-label="Minimise" @click=${this.toggleMinimise}>—</button>
            <button aria-label="Maximise" @click=${this.toggleMaximise}>▢</button>
            <button aria-label="Close" @click=${this.close}>✕</button>
          </span>
        </div>
        <div class="body" ?hidden=${this.minimised}><slot></slot></div>
      </div>
      ${this.resizable && !this.maximised && !this.minimised
        ? DIRECTIONS.map(
            (dir) => html`<span
              class="handle ${dir}"
              role="separator"
              tabindex="0"
              aria-label="Resize ${dir}"
              @pointerdown=${(e: PointerEvent) => this.startResize(dir, e)}
              @pointermove=${this.resizeDrag.onPointerMove}
              @pointerup=${this.resizeDrag.onPointerUp}
              @focusin=${this.requestFocus}
              @keydown=${(e: KeyboardEvent) => this.resizeKeydown(dir, e)}
            ></span>`
          )
        : nothing}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-window': Window
  }
}
