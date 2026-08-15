import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Dialog — a modal built on the native `<dialog>` element, so it gets top-layer
 * rendering, a backdrop, focus trapping and Escape-to-close for free. Clicking
 * the backdrop closes it.
 *
 * @slot - The dialog body.
 * @slot header - The header content (defaults to `label`).
 * @slot footer - The footer content.
 * @fires film-open - When the dialog opens.
 * @fires film-close - When the dialog closes.
 */
@customElement('film-dialog')
export class Dialog extends FilmElement {
  /** Whether the dialog is open. */
  @property({ type: Boolean, reflect: true }) open = false

  /** An accessible label / default heading. */
  @property({ type: String }) label = ''

  @query('dialog') private dialog!: HTMLDialogElement

  static styles = css`
    dialog {
      padding: 0;
      border: none;
      background: transparent;
      max-inline-size: min(90vw, 40rem);
      color: var(--film-color-text);
    }

    dialog::backdrop {
      background-color: var(--film-overlay-scrim);
    }

    .panel {
      display: flex;
      flex-direction: column;
      gap: var(--s0);
      background-color: var(--film-color-surface);
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius-lg);
      padding: var(--s1);
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

    footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--s-1);
    }

    footer:not(:has(*)) {
      display: none;
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
          <footer><slot name="footer"></slot></footer>
        </div>
      </dialog>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-dialog': Dialog
  }
}
