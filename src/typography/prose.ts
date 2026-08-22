import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Prose — a readable flow container for long-form HTML: constrains line length
 * to `--measure` and adds vertical rhythm between top-level blocks.
 *
 * Note: because slotted content lives in the light DOM, only the direct
 * children can be styled here (`::slotted` can't reach their descendants), so
 * this handles block rhythm, measure and top-level element styles.
 *
 * @slot - The long-form content (headings, paragraphs, lists, etc.).
 */
@customElement('film-prose')
export class Prose extends FilmElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--s1);
      max-inline-size: var(--measure);
      color: var(--film-color-text);
      line-height: 1.6;
    }

    ::slotted(*) {
      margin: 0;
    }

    ::slotted(h1),
    ::slotted(h2),
    ::slotted(h3),
    ::slotted(h4) {
      line-height: 1.2;
    }

    ::slotted(h1) {
      font-size: var(--s4);
    }

    ::slotted(h2) {
      font-size: var(--s3);
    }

    ::slotted(h3) {
      font-size: var(--s2);
    }

    ::slotted(a) {
      color: var(--film-color-link);
    }

    ::slotted(pre),
    ::slotted(code) {
      font-family: var(--film-font-mono);
    }

    ::slotted(blockquote) {
      padding-inline-start: var(--s0);
      border-inline-start: var(--border-thick) solid var(--film-color-border);
      color: var(--film-color-text-muted);
    }
  `

  render () {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-prose': Prose
  }
}
