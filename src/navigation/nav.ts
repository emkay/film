import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Nav — a vertical navigation list of {@link NavItem}s inside a labelled
 * `nav` landmark.
 *
 * @slot - The `film-nav-item` children.
 */
@customElement('film-nav')
export class Nav extends FilmElement {
  /** The accessible label for the navigation landmark. */
  @property({ type: String }) label = 'Navigation'

  static styles = css`
    :host {
      display: block;
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: var(--s-3);
    }
  `

  render () {
    return html`<nav aria-label=${this.label}><slot></slot></nav>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-nav': Nav
  }
}
