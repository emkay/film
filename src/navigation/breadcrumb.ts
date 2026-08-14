import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Breadcrumb — a navigation trail of {@link BreadcrumbItem}s.
 *
 * @slot - The `film-breadcrumb-item` children.
 */
@customElement('film-breadcrumb')
export class Breadcrumb extends FilmElement {
  /** The accessible label for the navigation landmark. */
  @property({ type: String }) label = 'Breadcrumb'

  static styles = css`
    :host {
      display: block;
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--s-1);
    }
  `

  render () {
    return html`<nav aria-label=${this.label}><slot></slot></nav>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-breadcrumb': Breadcrumb
  }
}
