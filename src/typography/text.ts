import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Text — a block of body text sized from the modular scale, with an optional
 * muted tone and weight.
 *
 * @slot - The text content.
 */
@customElement('film-text')
export class Text extends FilmElement {
  /** A modular-scale step, e.g. `s0` (default), `s-1`, `s1`. */
  @property({ type: String }) size = 's0'

  /** Text tone. */
  @property({ type: String, reflect: true }) tone: 'default' | 'muted' = 'default'

  /** Optional font weight (e.g. `600`, `bold`). */
  @property({ type: String }) weight = ''

  static styles = css`
    :host {
      display: block;
      font-size: var(--film-text-size, var(--s0));
      line-height: 1.5;
      color: var(--film-color-text);
    }

    :host([tone='muted']) {
      color: var(--film-color-text-muted);
    }
  `

  updated (): void {
    this.style.setProperty('--film-text-size', `var(--${this.size})`)
    if (this.weight) this.style.fontWeight = this.weight
    else this.style.removeProperty('font-weight')
  }

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-text': Text
  }
}
