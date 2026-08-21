import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Cover — a vertical layout that fills a minimum height and centres its main
 * content, with optional elements pinned to the top and bottom (e.g. a header
 * and footer).
 *
 * @slot - The centred principal content.
 * @slot top - Content pinned to the top.
 * @slot bottom - Content pinned to the bottom.
 */
@customElement('film-cover')
export class Cover extends FilmElement {
  /** The minimum space around and between the regions. */
  @property({ type: String })
  space = 'var(--s1)'

  /** The minimum height of the cover. */
  @property({ type: String, attribute: 'min-height' })
  minHeight = '100vh'

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-block-size: var(--cover-min-height, 100vh);
      padding: var(--cover-space, var(--s1));
      gap: var(--cover-space, var(--s1));
    }

    .principal {
      margin-block: auto;
    }
  `

  static styleProps: Record<string, string> = {
    '--cover-space': 'space',
    '--cover-min-height': 'minHeight'
  }

  render () {
    return html`
      <slot name="top"></slot>
      <div class="principal"><slot></slot></div>
      <slot name="bottom"></slot>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-cover': Cover
  }
}
