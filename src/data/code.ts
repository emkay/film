import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'
import '../actions/copy-button.js'

/**
 * Code — a code block with a copy button.
 */
@customElement('film-code')
export class Code extends FilmElement {
  /** The code to display and copy. */
  @property({ type: String }) code = ''

  /** An optional language hint (used as a label). */
  @property({ type: String }) language = ''

  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    pre {
      margin: 0;
      overflow: auto;
      padding: var(--s0);
      padding-inline-end: var(--s3);
      font-family: var(--film-font-mono);
      font-size: var(--s-1);
      color: var(--film-color-text);
      background-color: var(--film-color-surface);
      border: var(--border-thin) solid var(--film-color-border);
      border-radius: var(--film-radius);
    }

    film-copy-button {
      position: absolute;
      inset-block-start: var(--s-2);
      inset-inline-end: var(--s-2);
    }
  `

  render () {
    return html`
      <pre><code>${this.code}</code></pre>
      <film-copy-button
        value=${this.code}
        label="Copy"
        copied-label="Copied"
      ></film-copy-button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-code': Code
  }
}
