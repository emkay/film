import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

export type DrawerPlacement = 'start' | 'end' | 'top' | 'bottom'

/**
 * Drawer — a panel that slides in from an edge, built on the native `<dialog>`
 * element for top-layer rendering, focus trapping and Escape-to-close. Clicking
 * the backdrop closes it.
 *
 * @slot - The drawer body.
 * @slot header - The header content (defaults to `label`).
 * @fires film-open - When the drawer opens.
 * @fires film-close - When the drawer closes.
 */
@customElement('film-drawer')
export class Drawer extends FilmElement {
  /** Whether the drawer is open. */
  @property({ type: Boolean, reflect: true }) open = false

  /** The edge the drawer slides in from. */
  @property({ type: String, reflect: true }) placement: DrawerPlacement = 'end'

  /** An accessible label / default heading. */
  @property({ type: String }) label = ''

  @query('dialog') private dialog!: HTMLDialogElement

  static styles = css`
    dialog {
      color: var(--film-color-text);
      background-color: var(--film-color-surface);
      border: var(--border-thin) solid var(--film-color-border);
      padding: var(--s1);
      margin: 0;
      block-size: 100dvh;
      max-block-size: 100dvh;
      inline-size: min(90vw, 22rem);
    }

    :host([placement='start']) dialog {
      margin-inline-end: auto;
    }

    :host([placement='end']) dialog {
      margin-inline-start: auto;
    }

    :host([placement='top']) dialog,
    :host([placement='bottom']) dialog {
      inline-size: 100vw;
      max-inline-size: 100vw;
      block-size: auto;
      max-block-size: 80vh;
    }

    :host([placement='top']) dialog {
      margin-block-end: auto;
    }

    :host([placement='bottom']) dialog {
      margin-block-start: auto;
    }

    dialog::backdrop {
      background-color: var(--film-overlay-scrim);
    }

    .panel {
      display: flex;
      flex-direction: column;
      gap: var(--s0);
      block-size: 100%;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--s0);
      font-size: var(--s1);
    }

    .close {
      font: inherit;
      cursor: pointer;
      border: none;
      background: none;
      color: inherit;
      line-height: 1;
      padding: 0.2em;
    }
  `

  show (): void {
    this.open = true
  }

  close (): void {
    this.open = false
  }

  updated (changed: PropertyValues<this>): void {
    if (!changed.has('open')) return
    if (this.open && !this.dialog.open) {
      this.dialog.showModal()
      this.dispatchEvent(new Event('film-open'))
    } else if (!this.open && this.dialog.open) {
      this.dialog.close()
    }
  }

  private readonly onClose = (): void => {
    if (this.open) {
      this.open = false
      this.dispatchEvent(new Event('film-close'))
    }
  }

  private readonly onClick = (event: MouseEvent): void => {
    if (event.target === this.dialog) this.close()
  }

  render () {
    return html`
      <dialog
        aria-label=${this.label || nothing}
        @close=${this.onClose}
        @click=${this.onClick}
      >
        <div class="panel">
          <header>
            <slot name="header">${this.label}</slot>
            <button class="close" @click=${this.close} aria-label="Close">✕</button>
          </header>
          <div class="body"><slot></slot></div>
        </div>
      </dialog>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-drawer': Drawer
  }
}
