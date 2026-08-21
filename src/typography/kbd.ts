import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Kbd — displays a keyboard key or shortcut.
 *
 * @slot - The key label (e.g. `⌘`, `Enter`).
 */
@customElement('film-kbd')
export class Kbd extends FilmElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    kbd {
      font-family: var(--film-font-mono);
      font-size: 0.85em;
      line-height: 1;
      padding: 0.2em 0.45em;
      color: var(--film-color-text);
      background-color: var(--film-color-surface);
      border: var(--border-thin) solid var(--film-color-border);
      border-block-end-width: var(--border-thick);
      border-radius: var(--film-radius-sm);
    }
  `

  render () {
    return html`<kbd><slot></slot></kbd>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-kbd': Kbd
  }
}
