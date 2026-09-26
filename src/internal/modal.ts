import type { PropertyValues } from 'lit'
import { property, query } from 'lit/decorators.js'
import { FilmElement } from './film-element.js'

/**
 * Base for modal overlays built on the native `<dialog>` element (Dialog,
 * Drawer). Owns `open`/`label`, the top-layer show/close wiring, backdrop
 * click-to-close and the `film-open` / `film-close` events. Subclasses supply
 * their styles and a render whose root is
 * `<dialog @close=${this.onClose} @click=${this.onClick}>…</dialog>`.
 *
 * @fires film-open - When the overlay opens.
 * @fires film-close - When the overlay closes.
 */
export abstract class FilmModal extends FilmElement {
  /** Whether the overlay is open. */
  @property({ type: Boolean, reflect: true }) open = false

  /** An accessible label / default heading. */
  @property({ type: String }) label = ''

  @query('dialog') protected dialog!: HTMLDialogElement

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

  // The native dialog's `close` fires once per close, however it happened:
  // close(), the ✕ button, a backdrop click (all of which set `open` first) or
  // Escape (which doesn't). So announce every one, and sync `open` for Escape.
  protected readonly onClose = (): void => {
    this.open = false
    this.dispatchEvent(new Event('film-close'))
  }

  protected readonly onClick = (event: MouseEvent): void => {
    if (event.target === this.dialog) this.close()
  }
}
