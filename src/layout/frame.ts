import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Frame — constrains slotted media to a fixed aspect ratio, cropping to cover
 * so images and videos never distort.
 *
 * @slot - The media (img, video, picture, etc.) to frame.
 */
@customElement('film-frame')
export class Frame extends FilmElement {
  /** The aspect ratio, as `W:H` or a CSS aspect-ratio value (e.g. `16 / 9`). */
  @property({ type: String })
  ratio = '16:9'

  static styles = css`
    :host {
      display: block;
      aspect-ratio: var(--frame-ratio, 16 / 9);
      overflow: hidden;
    }

    ::slotted(img),
    ::slotted(video),
    ::slotted(picture) {
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
    }
  `

  updated () {
    this.reflectStyleProps({ '--frame-ratio': this.ratio.replace(':', ' / ') })
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-frame': Frame
  }
}
