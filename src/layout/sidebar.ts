import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Sidebar — a two-element layout where one element (the sidebar) keeps its
 * content-based width while the other (the main content) takes up the rest,
 * collapsing to a stack when there isn't room for both.
 *
 * @slot - Exactly two children: the sidebar and the main content.
 */
@customElement('film-sidebar')
export class Sidebar extends FilmElement {
  /** The gap between the sidebar and the main content. */
  @property({ type: String })
  space = 'var(--s3)'

  /** The minimum width of the main content before the layout wraps. */
  @property({ type: String, attribute: 'content-min' })
  contentMin = '50%'

  static styles = css`
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sidebar-space, var(--s3));
    }

    ::slotted(:first-child) {
      flex-grow: 1;
    }

    ::slotted(:last-child) {
      flex-basis: 0;
      flex-grow: 999;
      min-inline-size: var(--sidebar-content-min, 50%);
    }
  `

  updated () {
    this.reflectStyleProps({
      '--sidebar-space': this.space,
      '--sidebar-content-min': this.contentMin
    })
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-sidebar': Sidebar
  }
}
