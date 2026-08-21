import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * ListItem — a row within a {@link List}. Renders as a link when `href` is set.
 *
 * @slot - The primary content.
 * @slot start - Leading content (icon, avatar).
 * @slot end - Trailing content (badge, action), pushed to the far edge.
 */
@customElement('film-list-item')
export class ListItem extends FilmElement {
  /** Makes the item a link to this URL. */
  @property({ type: String }) href = ''

  static styles = css`
    :host {
      display: block;
    }

    :host(:not(:first-child)) {
      border-block-start: var(--border-thin) solid var(--film-color-border);
    }

    .row {
      display: flex;
      align-items: center;
      gap: var(--s0);
      padding: var(--s-1) var(--s0);
      color: var(--film-color-text);
      text-decoration: none;
    }

    a.row:hover {
      background-color: var(--film-color-info);
    }

    .content {
      flex: 1;
      min-inline-size: 0;
    }
  `

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'listitem')
  }

  render () {
    const inner = html`
      <slot name="start"></slot>
      <span class="content"><slot></slot></span>
      <slot name="end"></slot>
    `
    return this.href
      ? html`<a class="row" href=${this.href}>${inner}</a>`
      : html`<div class="row">${inner}</div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-list-item': ListItem
  }
}
