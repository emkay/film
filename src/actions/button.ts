import { css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

export type ButtonSize = 'small' | 'medium' | 'large'

/**
 * Button — a themed button. Sizing is expressed in `em` so it scales with the
 * surrounding font size, and its radius comes from the modular scale.
 *
 * @slot - The button label.
 */
@customElement('film-button')
export class Button extends FilmElement {
  /** Use the inverted colour treatment. */
  @property({ type: Boolean, reflect: true })
  invert = false

  /** Disable the button. */
  @property({ type: Boolean, reflect: true })
  disabled = false

  /** The button size (drives `font-size` on the modular scale). */
  @property({ type: String, reflect: true })
  size: ButtonSize = 'medium'

  static styles = css`
    button {
      background-color: var(--film-color-primary);
      border: none;
      border-radius: var(--film-radius);
      color: var(--film-color-primary-text);
      cursor: pointer;
      font-size: var(--s0);
      padding: 0.5em 1.5em 0.7em;
    }

    :host([size='small']) button {
      font-size: var(--s-1);
    }

    :host([size='large']) button {
      font-size: var(--s1);
    }

    button:focus {
      outline: solid;
      background-color: var(--film-color-primary-hover);
    }

    button:hover {
      outline: solid;
      background-color: var(--film-color-primary-hover);
    }

    button:active {
      background-color: var(--film-color-primary-active);
    }

    button[disabled] {
      cursor: not-allowed;
      opacity: var(--film-disabled-opacity);
    }

    button.invert {
      background-color: var(--film-color-inverted-surface);
      color: var(--film-color-inverted-text);
    }

    button.invert:hover,
    button.invert:focus {
      background-color: color-mix(in oklch, var(--film-color-inverted-surface), var(--film-color-primary) 30%);
    }
  `

  render () {
    return html`
      <button
        class=${this.invert ? 'invert' : nothing}
        ?disabled=${this.disabled}
      >
        <slot></slot>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-button': Button
  }
}
