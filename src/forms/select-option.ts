import { css, html, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * SelectOption — one option within a {@link Select}.
 *
 * @slot - The option label.
 */
@customElement('film-select-option')
export class SelectOption extends FilmElement {
  /** The value contributed to the select when chosen. */
  @property({ type: String }) value = ''

  /** Whether this option is selected. Managed by the select. */
  @property({ type: Boolean, reflect: true }) selected = false

  /** Whether this option is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /**
   * The option a combobox's arrow keys have reached. Keyboard focus stays in
   * the combobox's text field, so this — not :focus — is what's drawn.
   */
  @property({ type: Boolean, reflect: true }) highlighted = false

  static styles = css`
    :host {
      display: block;
      padding: var(--s-2) var(--s0);
      cursor: pointer;
      color: var(--film-color-text);
      white-space: nowrap;
      border-radius: var(--film-radius-sm);
    }

    :host([hidden]) {
      display: none;
    }

    :host([selected]) {
      font-weight: 600;
    }

    :host(:hover:not([disabled])),
    :host(:focus-visible) {
      background-color: var(--film-color-info);
      outline: none;
    }

    /* The tint alone is too faint to find focus by, and forced-colours mode
       drops backgrounds; an inset ring survives both and can't be clipped by
       the scrolling listbox. */
    :host(:focus-visible),
    :host([highlighted]) {
      background-color: var(--film-color-info);
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: calc(-1 * var(--border-thin));
    }

    :host([disabled]) {
      opacity: var(--film-disabled-opacity);
      cursor: not-allowed;
    }
  `

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'option')
    if (!this.hasAttribute('tabindex')) this.tabIndex = -1
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('selected')) this.setAttribute('aria-selected', String(this.selected))
    if (changed.has('disabled')) this.setAttribute('aria-disabled', String(this.disabled))
  }

  /** The visible text of the option. */
  get label (): string {
    return this.textContent?.trim() ?? ''
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-select-option': SelectOption
  }
}
