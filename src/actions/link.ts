import { css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Link — a themed anchor.
 *
 * @slot - The link text or content.
 */
@customElement('film-link')
export class Link extends FilmElement {
  /** The destination URL. */
  @property({ type: String })
  href = ''

  static styles = css`
    a {
      color: var(--film-color-link);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `

  render () {
    // No href means no destination: `href=""` would link to the current page.
    return html`<a href=${this.href || nothing}><slot></slot></a>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-link': Link
  }
}
