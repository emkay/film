import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Grid — a responsive grid whose columns are created automatically. Each column
 * is at least `min` wide and they share the remaining space equally, wrapping
 * to new rows as needed. No media queries required.
 *
 * @slot - The grid items.
 */
@customElement('film-grid')
export class Grid extends FilmElement {
  /** The gap between grid items. Defaults to a modular-scale step. */
  @property({ type: String })
  space = 'var(--s1)'

  /** The minimum width of a column before it wraps to a new row. */
  @property({ type: String })
  min = '15rem'

  static styles = css`
    :host {
      display: grid;
      gap: var(--grid-space, var(--s1));
      grid-template-columns: repeat(
        auto-fit,
        minmax(min(var(--grid-min, 15rem), 100%), 1fr)
      );
    }
  `

  updated () {
    this.reflectStyleProps({
      '--grid-space': this.space,
      '--grid-min': this.min
    })
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-grid': Grid
  }
}
