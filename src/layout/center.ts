import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Center — horizontally centres its content within a sane maximum measure.
 *
 * @slot - The content to centre.
 */
@customElement('film-center')
export class Center extends FilmElement {
  static styles = css`
    :host {
      box-sizing: content-box;
      margin-inline: auto;
      max-inline-size: var(--measure);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-center': Center
  }
}
