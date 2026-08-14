import { css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Icon — sizes a slotted SVG to match the adjacent text and keeps the two
 * aligned. Provide `label` for an accessible name when the icon stands alone.
 *
 * @slot - The icon, typically an inline `<svg>`.
 */
@customElement('film-icon')
export class Icon extends FilmElement {
  /** The gap between the icon and its label. */
  @property({ type: String })
  space = '0.5em'

  /** An optional text label rendered beside the icon. */
  @property({ type: String })
  label = ''

  static styles = css`
    :host {
      display: inline-flex;
      align-items: baseline;
      gap: var(--icon-space, 0.5em);
    }

    ::slotted(svg) {
      block-size: 0.75em;
      block-size: 1cap;
      inline-size: 0.75em;
      inline-size: 1cap;
    }
  `

  updated () {
    this.reflectStyleProps({ '--icon-space': this.space })
  }

  render () {
    return html`
      <slot></slot>
      ${this.label ? html`<span>${this.label}</span>` : nothing}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-icon': Icon
  }
}
