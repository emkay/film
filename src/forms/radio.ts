import { css, html, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Radio — a single option within a {@link RadioGroup}. Selection, roving focus
 * and form value are all managed by the parent `film-radio-group`.
 *
 * @slot - The label.
 */
@customElement('film-radio')
export class Radio extends FilmElement {
  /** The value contributed to the group when this option is selected. */
  @property({ type: String }) value = ''

  /** Whether this option is selected. Managed by the group. */
  @property({ type: Boolean, reflect: true }) checked = false

  /** Whether this option is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--s-1);
      cursor: pointer;
    }

    :host([disabled]) {
      opacity: var(--film-disabled-opacity);
      cursor: not-allowed;
    }

    .dot {
      inline-size: 1.15em;
      block-size: 1.15em;
      flex: 0 0 auto;
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: 50%;
      background-color: var(--film-color-surface);
      display: grid;
      place-content: center;
    }

    .dot::after {
      content: '';
      inline-size: 0.6em;
      block-size: 0.6em;
      border-radius: 50%;
      background-color: var(--film-color-inverted-surface);
      transform: scale(0);
      transition: transform var(--film-duration-fast) var(--film-ease);
    }

    :host([checked]) .dot::after {
      transform: scale(1);
    }

    :host(:focus-visible) {
      outline: none;
    }

    :host(:focus-visible) .dot {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: 2px;
    }
  `

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', this.getAttribute('role') ?? 'radio')
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('checked')) this.setAttribute('aria-checked', String(this.checked))
    if (changed.has('disabled')) this.setAttribute('aria-disabled', String(this.disabled))
  }

  render () {
    return html`<span class="dot" aria-hidden="true"></span><slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-radio': Radio
  }
}
