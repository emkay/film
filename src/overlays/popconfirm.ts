import { css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import './popover.js'
import '../actions/button.js'
import type { Popover } from './popover.js'

/**
 * Popconfirm — a confirmation bubble anchored to a trigger. Composes
 * {@link Popover} with a message and confirm/cancel buttons.
 *
 * @slot trigger - The element that opens the confirmation.
 * @fires film-confirm - When the confirm button is activated.
 * @fires film-cancel - When cancelled (button or dismissal).
 */
@customElement('film-popconfirm')
export class Popconfirm extends FilmElement {
  /** The confirmation prompt. */
  @property({ type: String }) message = 'Are you sure?'

  /** Confirm button label. */
  @property({ type: String, attribute: 'confirm-label' }) confirmLabel = 'Confirm'

  /** Cancel button label. */
  @property({ type: String, attribute: 'cancel-label' }) cancelLabel = 'Cancel'

  @query('film-popover') private popoverEl!: Popover

  static styles = css`
    :host {
      display: inline-block;
    }

    .body {
      display: flex;
      flex-direction: column;
      gap: var(--s-1);
      max-inline-size: 24ch;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--s-2);
    }
  `

  private close (): void {
    if (this.popoverEl) this.popoverEl.open = false
  }

  private onConfirm (): void {
    this.close()
    this.dispatchEvent(new Event('film-confirm', { bubbles: true }))
  }

  private onCancel (): void {
    this.close()
    this.dispatchEvent(new Event('film-cancel', { bubbles: true }))
  }

  render () {
    return html`
      <film-popover placement="top" align="center">
        <slot name="trigger" slot="trigger"></slot>
        <div class="body">
          <span>${this.message}</span>
          <div class="actions">
            <film-button @click=${this.onCancel}>${this.cancelLabel}</film-button>
            <film-button invert @click=${this.onConfirm}>${this.confirmLabel}</film-button>
          </div>
        </div>
      </film-popover>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-popconfirm': Popconfirm
  }
}
