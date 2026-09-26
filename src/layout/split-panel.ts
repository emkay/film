import { css, html, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import { DragController } from '../internal/drag-controller.js'

/**
 * SplitPanel — two panes separated by a draggable divider the user can move to
 * resize them. The divider is keyboard-operable (arrow keys).
 *
 * @slot start - The first pane.
 * @slot end - The second pane.
 * @fires film-reposition - When the divider moves. `detail.position` is a percentage.
 */
@customElement('film-split-panel')
export class SplitPanel extends FilmElement {
  /** The size of the start pane, as a percentage (0–100). */
  @property({ type: Number }) position = 50

  /** Split vertically (stacked) instead of horizontally. */
  @property({ type: Boolean, reflect: true }) vertical = false

  /** The minimum position, as a percentage. */
  @property({ type: Number }) min = 10

  /** The maximum position, as a percentage. */
  @property({ type: Number }) max = 90

  /** The position when the current drag began; drags apply deltas to it. */
  private dragBase = 0

  // Shares the pointer mechanics with film-window: primary button only,
  // pointer capture with a fallback, and pointercancel ending the drag.
  private readonly drag = new DragController(this, {
    onStart: () => {
      this.dragBase = this.clamp(this.position)
    },
    onDrag: (dx, dy) => {
      const rect = this.getBoundingClientRect()
      const fraction = this.vertical ? dy / rect.height : dx / rect.width
      this.setPosition(this.dragBase + fraction * 100)
    }
  })

  static styles = css`
    :host {
      display: flex;
      inline-size: 100%;
      block-size: 100%;
    }

    :host([vertical]) {
      flex-direction: column;
    }

    .start {
      flex: 0 0 var(--split-position, 50%);
      overflow: auto;
      min-inline-size: 0;
      min-block-size: 0;
    }

    .end {
      flex: 1 1 0;
      overflow: auto;
      min-inline-size: 0;
      min-block-size: 0;
    }

    .divider {
      flex: 0 0 auto;
      inline-size: var(--s-2);
      background-color: var(--film-color-inverted-surface);
      cursor: col-resize;
      touch-action: none;
    }

    :host([vertical]) .divider {
      inline-size: auto;
      block-size: var(--s-2);
      cursor: row-resize;
    }

    .divider:focus-visible {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: 2px;
    }
  `

  private clamp (value: number): number {
    return Math.max(this.min, Math.min(this.max, value))
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('position') || changed.has('min') || changed.has('max')) {
      this.reflectStyleProps({ '--split-position': `${this.clamp(this.position)}%` })
    }
  }

  private setPosition (value: number): void {
    this.position = this.clamp(value)
    this.dispatchEvent(
      new CustomEvent('film-reposition', { detail: { position: this.position }, bubbles: true })
    )
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    const decrease = this.vertical ? 'ArrowUp' : 'ArrowLeft'
    const increase = this.vertical ? 'ArrowDown' : 'ArrowRight'
    if (event.key === decrease) {
      event.preventDefault()
      this.setPosition(this.position - 2)
    } else if (event.key === increase) {
      event.preventDefault()
      this.setPosition(this.position + 2)
    }
  }

  render () {
    return html`
      <div class="start" part="start"><slot name="start"></slot></div>
      <div
        class="divider"
        part="divider"
        role="separator"
        tabindex="0"
        aria-orientation=${this.vertical ? 'horizontal' : 'vertical'}
        aria-valuenow=${Math.round(this.clamp(this.position))}
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        @pointerdown=${this.drag.onPointerDown}
        @pointermove=${this.drag.onPointerMove}
        @pointerup=${this.drag.onPointerUp}
        @keydown=${this.onKeydown}
      ></div>
      <div class="end" part="end"><slot name="end"></slot></div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-split-panel': SplitPanel
  }
}
