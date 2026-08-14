import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * VisuallyHidden — hides content visually while keeping it available to
 * assistive technology. Use for skip links, extra labels, and live-region text.
 *
 * @slot - The content to hide visually.
 */
@customElement('film-visually-hidden')
export class VisuallyHidden extends FilmElement {
  static styles = css`
    :host {
      position: absolute !important;
      inline-size: 1px;
      block-size: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      white-space: nowrap;
      border: 0;
    }
  `

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-visually-hidden': VisuallyHidden
  }
}
