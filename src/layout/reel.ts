import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Reel — a horizontally scrolling strip of items with scroll snapping. Useful
 * for carousels, galleries and any "scroll sideways" list.
 *
 * @slot - The items in the reel.
 */
@customElement('film-reel')
export class Reel extends FilmElement {
  /** The gap between items. */
  @property({ type: String })
  space = 'var(--s1)'

  /** The width of each item; `auto` lets items size to their content. */
  @property({ type: String, attribute: 'item-width' })
  itemWidth = 'auto'

  static styles = css`
    :host {
      display: flex;
      gap: var(--reel-space, var(--s1));
      overflow-x: auto;
      overflow-y: hidden;
      scroll-snap-type: x proximity;
      overscroll-behavior-inline: contain;
    }

    ::slotted(*) {
      flex: 0 0 var(--reel-item-width, auto);
      scroll-snap-align: start;
    }
  `

  updated () {
    this.reflectStyleProps({
      '--reel-space': this.space,
      '--reel-item-width': this.itemWidth
    })
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-reel': Reel
  }
}
