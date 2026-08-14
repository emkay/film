import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * TabPanel — the content shown for a matching {@link Tab}, identified by `name`.
 *
 * @slot - The panel content.
 */
@customElement('film-tab-panel')
export class TabPanel extends FilmElement {
  /** The panel's identifier, matched against a tab's `panel`. */
  @property({ type: String }) name = ''

  /** Whether this panel is active. Managed by the group. */
  @property({ type: Boolean, reflect: true }) active = false

  static styles = css`
    :host {
      display: block;
      padding-block-start: var(--s0);
    }

    :host(:not([active])) {
      display: none;
    }
  `

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'tabpanel')
    this.tabIndex = 0
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-tab-panel': TabPanel
  }
}
