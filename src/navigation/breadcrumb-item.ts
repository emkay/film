import { css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * BreadcrumbItem — one step in a {@link Breadcrumb}. Renders a link unless it is
 * the `current` page. A separator is inserted automatically before every item
 * except the first (override via the `--breadcrumb-separator` custom property).
 *
 * @slot - The item label.
 */
@customElement('film-breadcrumb-item')
export class BreadcrumbItem extends FilmElement {
  /** The destination URL. Omitted for the current page. */
  @property({ type: String }) href = ''

  /** Marks this item as the current page. */
  @property({ type: Boolean, reflect: true }) current = false

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--s-1);
    }

    :host(:not(:first-child))::before {
      content: var(--breadcrumb-separator, '/');
      opacity: 0.5;
    }

    a {
      color: var(--color-links);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    [aria-current] {
      font-weight: 600;
    }
  `

  render () {
    if (this.href && !this.current) {
      return html`<a href=${this.href}><slot></slot></a>`
    }
    return html`<span aria-current=${this.current ? 'page' : nothing}><slot></slot></span>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-breadcrumb-item': BreadcrumbItem
  }
}
