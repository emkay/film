import { css, html, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Tab — a single tab within a {@link Tabs} group. Selection state is managed by
 * the parent `film-tabs`.
 *
 * @slot - The tab label.
 */
@customElement('film-tab')
export class Tab extends FilmElement {
  /** The `name` of the panel this tab controls. */
  @property({ type: String }) panel = ''

  /** Whether this tab is active. Managed by the group. */
  @property({ type: Boolean, reflect: true }) active = false

  /** Whether this tab is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false

  static styles = css`
    :host {
      display: inline-block;
      padding: var(--s-2) var(--s0);
      cursor: pointer;
      border-block-end: var(--border-thick) solid transparent;
      color: var(--film-color-text);
      white-space: nowrap;
    }

    :host([active]) {
      border-block-end-color: var(--film-color-border);
      font-weight: 600;
    }

    :host([disabled]) {
      opacity: var(--film-disabled-opacity);
      cursor: not-allowed;
    }

    :host(:focus-visible) {
      outline: var(--border-thin) solid var(--film-color-focus);
      outline-offset: -2px;
    }
  `

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'tab')
  }

  updated (changed: PropertyValues<this>): void {
    if (changed.has('active')) this.setAttribute('aria-selected', String(this.active))
    if (changed.has('disabled')) this.setAttribute('aria-disabled', String(this.disabled))
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-tab': Tab
  }
}
