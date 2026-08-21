import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * ButtonGroup — groups related buttons in a row. By default they sit with a
 * small gap; set `attached` to join them into a single segmented control.
 *
 * @slot - The buttons (e.g. `film-button`).
 */
@customElement('film-button-group')
export class ButtonGroup extends FilmElement {
  /** Join the buttons edge-to-edge into a segmented control. */
  @property({ type: Boolean, reflect: true }) attached = false

  /** Accessible label for the group. */
  @property({ type: String }) label = ''

  static styles = css`
    :host {
      display: inline-flex;
      gap: var(--s-2);
    }

    /* Joined mode: no gap, and square the children (via the inherited custom
       property) so they read as one segmented control. */
    :host([attached]) {
      gap: 0;
    }

    :host([attached]) ::slotted(*) {
      --film-radius: 0;
    }
  `

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'group')
  }

  updated (): void {
    if (this.label) this.setAttribute('aria-label', this.label)
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-button-group': ButtonGroup
  }
}
