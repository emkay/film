import { css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * NavItem — a link within a {@link Nav}. Marks itself as the current page when
 * `active`.
 *
 * @slot - The link label.
 * @slot start - Leading content (e.g. an icon).
 */
@customElement('film-nav-item')
export class NavItem extends FilmElement {
  /** The destination URL. */
  @property({ type: String }) href = ''

  /** Marks this item as the active/current page. */
  @property({ type: Boolean, reflect: true }) active = false

  static styles = css`
    :host {
      display: block;
    }

    a {
      display: flex;
      align-items: center;
      gap: var(--s-1);
      padding: var(--s-2) var(--s0);
      color: var(--film-color-text);
      text-decoration: none;
      border-radius: var(--film-radius-sm);
    }

    a:hover {
      background-color: var(--film-color-info);
    }

    :host([active]) a {
      background-color: var(--film-color-inverted-surface);
      color: var(--film-color-inverted-text);
    }

    a:focus-visible {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: -2px;
    }
  `

  render () {
    return html`
      <a href=${this.href || nothing} aria-current=${this.active ? 'page' : nothing}>
        <slot name="start"></slot>
        <slot></slot>
      </a>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-nav-item': NavItem
  }
}
