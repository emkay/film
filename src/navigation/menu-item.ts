import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * MenuItem — a single actionable item within a {@link Menu}.
 *
 * @slot - The item label.
 * @slot start - Content before the label (e.g. an icon).
 * @fires film-select - When the item is activated. `detail.value` is the item's value.
 */
@customElement('film-menu-item')
export class MenuItem extends FilmElement {
  /** A value identifying the item, surfaced in the `film-select` event. */
  @property({ type: String }) value = ''

  /** Whether the item is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: var(--s-1);
      padding: var(--s-2) var(--s0);
      cursor: pointer;
      border-radius: var(--s-3);
      color: var(--color-dark);
      white-space: nowrap;
    }

    :host(:hover:not([disabled])),
    :host(:focus-visible) {
      background-color: var(--surface-info);
      outline: none;
    }

    :host([disabled]) {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'menuitem')
    if (!this.hasAttribute('tabindex')) this.tabIndex = -1
    this.addEventListener('click', this.onActivate)
    this.addEventListener('keydown', this.onKeydown)
  }

  private readonly onActivate = (): void => {
    if (this.disabled) return
    this.dispatchEvent(
      new CustomEvent('film-select', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    )
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.onActivate()
    }
  }

  render () {
    return html`<slot name="start"></slot><slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-menu-item': MenuItem
  }
}
