import { css, html, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Spinner — an indeterminate loading indicator.
 */
@customElement('film-spinner')
export class Spinner extends FilmElement {
  /** The diameter, as any length. Defaults to a modular-scale step. */
  @property({ type: String }) size = 'var(--s1)'

  /** Accessible label announced to assistive tech. */
  @property({ type: String }) label = 'Loading'

  static styleProps: Record<string, string> = { '--spinner-size': 'size' }

  static styles = css`
    :host {
      display: inline-block;
      inline-size: var(--spinner-size, var(--s1));
      block-size: var(--spinner-size, var(--s1));
    }

    .spinner {
      inline-size: 100%;
      block-size: 100%;
      border-radius: 50%;
      border: var(--border-thick) solid var(--film-color-border);
      border-block-start-color: var(--film-color-primary);
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation-duration: 2s;
      }
    }
  `

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('role', 'status')
  }

  updated (changed: PropertyValues): void {
    super.updated(changed)
    if (changed.has('label')) this.setAttribute('aria-label', this.label)
  }

  render () {
    return html`<div class="spinner"></div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-spinner': Spinner
  }
}
