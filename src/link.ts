import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * Link — a themed anchor.
 *
 * @slot - The link text or content.
 */
@customElement('film-link')
export class Link extends LitElement {
  /** The destination URL. */
  @property({ type: String })
  href = ''

  static styles = css`
    a {
      color: var(--color-links);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `

  render () {
    return html`<a href=${this.href}><slot></slot></a>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-link': Link
  }
}
