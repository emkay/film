import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FilmElement } from '../internal/film-element.js'

/**
 * Skeleton — a placeholder shown while content loads. Purely decorative
 * (hidden from assistive tech); mark the surrounding region busy instead.
 */
@customElement('film-skeleton')
export class Skeleton extends FilmElement {
  /** Shape: a text line, a circle (avatar), or a rectangle (block). */
  @property({ type: String, reflect: true }) variant: 'text' | 'circle' | 'rect' = 'text'

  /** Width, as any length. */
  @property({ type: String }) width = '100%'

  /** Height, as any length. Defaults to the current line height for text. */
  @property({ type: String }) height = ''

  static styleProps: Record<string, string> = {
    '--skeleton-width': 'width',
    '--skeleton-height': 'height'
  }

  static styles = css`
    :host {
      display: block;
      inline-size: var(--skeleton-width, 100%);
      block-size: var(--skeleton-height, auto);
    }

    .bar {
      inline-size: 100%;
      block-size: 100%;
      border-radius: var(--film-radius-sm);
      background: linear-gradient(
          90deg,
          var(--film-color-border) 25%,
          color-mix(in oklch, var(--film-color-border), var(--film-color-surface) 60%) 50%,
          var(--film-color-border) 75%
        )
        var(--film-color-border);
      background-size: 200% 100%;
      animation: shimmer 1.4s ease-in-out infinite;
    }

    :host([variant='text']) .bar {
      block-size: 1em;
    }

    :host([variant='circle']) {
      inline-size: var(--skeleton-width, var(--s3));
      block-size: var(--skeleton-height, var(--skeleton-width, var(--s3)));
    }

    :host([variant='circle']) .bar {
      border-radius: 50%;
    }

    @keyframes shimmer {
      to {
        background-position: -200% 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bar {
        animation: none;
      }
    }
  `

  connectedCallback (): void {
    super.connectedCallback()
    this.setAttribute('aria-hidden', 'true')
  }

  render () {
    return html`<div class="bar"></div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'film-skeleton': Skeleton
  }
}
