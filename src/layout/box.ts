import { css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * A padded box with a border. The padding and border derive from the modular
 * scale so a Box always sits in proportion to the rest of the layout.
 *
 * @slot - Content placed inside the box.
 */
@customElement('film-box')
export class Box extends FilmElement {
  /** Swap foreground and background colours. */
  @property({ type: Boolean, reflect: true })
  invert = false

  static styles = css`
    :host {
      display: block;
    }

    div {
      border: var(--border-thin) solid;
      color: var(--color-dark);
      background-color: var(--color-light);
      padding: var(--s1);
    }

    div ::slotted(*) {
      color: inherit;
    }

    div.invert {
      background-color: var(--color-dark);
      color: var(--color-light);
    }
  `

  render () {
    return html`
      <div class=${this.invert ? 'invert' : nothing}>
        <slot></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-box': Box
  }
}
