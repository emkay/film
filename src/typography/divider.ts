import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Divider — a themed separator, horizontal by default or `vertical`.
 */
@customElement('film-divider')
export class Divider extends FilmElement {
  /** Render a vertical rule instead of a horizontal one. */
  @property({ type: Boolean, reflect: true })
  vertical = false

  /** The space around the divider. */
  @property({ type: String })
  space = 'var(--s1)'

  static styles = css`
    :host {
      display: block;
    }

    hr {
      border: none;
      background-color: currentColor;
      opacity: 0.25;
      margin: 0;
    }

    :host(:not([vertical])) hr {
      block-size: var(--border-thin);
      inline-size: 100%;
      margin-block: var(--divider-space, var(--s1));
    }

    :host([vertical]) {
      display: inline-block;
      block-size: 100%;
    }

    :host([vertical]) hr {
      inline-size: var(--border-thin);
      block-size: 100%;
      margin-inline: var(--divider-space, var(--s1));
    }
  `

  static styleProps: Record<string, string> = { '--divider-space': 'space' }

  render () {
    return html`
      <hr
        role="separator"
        aria-orientation=${this.vertical ? 'vertical' : 'horizontal'}
      />
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-divider': Divider
  }
}
