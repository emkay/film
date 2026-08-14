import { css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

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

  static styles = css`
    button {
      background-color: var(--button-primary-color);
      border: none;
      border-radius: var(--s-2);
      color: var(--font-color-primary);
      cursor: pointer;
      font-size: var(--s0);
      padding: 0.5em 1.5em 0.7em;
    }

    button:focus {
      outline: solid;
      background-color: var(--button-primary-color-focus);
    }

    button:hover {
      outline: solid;
      background-color: var(--button-primary-color-hover);
    }

    button:active {
      background-color: var(--button-primary-color-active);
    }

    button[disabled] {
      cursor: not-allowed;
      opacity: 0.6;
    }

    button.invert {
      background-color: var(--button-primary-color-invert);
      color: var(--button-primary-color-text-invert);
    }

    button.invert:hover {
      background-color: var(--button-primary-color-hover-invert);
    }

    button.invert:focus {
      background-color: var(--button-primary-color-focus-invert);
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
