import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Imposter — positions its content over the top of a positioned ancestor,
 * centred both ways. Set `contain` to keep it inside the viewport (scrolling if
 * needed), and `fixed` to position it relative to the viewport instead.
 *
 * @slot - The overlaid content.
 */
@customElement('film-imposter')
export class Imposter extends FilmElement {
  /** Position relative to the viewport rather than the nearest ancestor. */
  @property({ type: Boolean, reflect: true })
  fixed = false

  /** Keep the imposter within the bounds of its container. */
  @property({ type: Boolean, reflect: true })
  contain = false

  /** The minimum gap to the container edges when `contain` is set. */
  @property({ type: String })
  margin = '0px'

  static styles = css`
    :host {
      position: absolute;
      inset-block-start: 50%;
      inset-inline-start: 50%;
      transform: translate(-50%, -50%);
    }

    :host([fixed]) {
      position: fixed;
    }

    :host([contain]) {
      overflow: auto;
      max-inline-size: calc(100% - (var(--imposter-margin, 0px) * 2));
      max-block-size: calc(100% - (var(--imposter-margin, 0px) * 2));
    }
  `

  updated () {
    this.reflectStyleProps({ '--imposter-margin': this.margin })
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-imposter': Imposter
  }
}
