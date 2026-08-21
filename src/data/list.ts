import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * List — a vertical list of {@link ListItem}s with dividers between them.
 *
 * @slot - The `film-list-item` children.
 */
@customElement('film-list')
export class List extends FilmElement {
  /** Draw a border around the list. */
  @property({ type: Boolean, reflect: true }) bordered = false

  static styles = css`
    :host {
      display: block;
    }

    :host([bordered]) {
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius);
      overflow: hidden;
    }
  `

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'list')
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-list': List
  }
}
